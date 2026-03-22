
const { Trip } = require('../models');
const AppError = require('../utils/AppError');
const { Car } = require('../models');
const distanceService = require('../services/distance/distance.service');
const pricingService = require('../services/pricing/pricing.service');


function assertTripNotFinished(trip) {
  if (trip.status === 'completed' || trip.status === 'cancelled') {
    throw new AppError('TRIP_ALREADY_FINISHED', 400);
  }
}


/**
 * Yeni trip oluşturur (Yolcu tarafından)
 * @param {string} passengerId - JWT'den gelen user id
 * @param {object} data - Request body
 * @param {object} data.origin - Başlangıç konumu
 * @param {number} data.origin.lat - Başlangıç latitude
 * @param {number} data.origin.lng - Başlangıç longitude
 * @param {object} data.destination - Varış konumu
 * @param {number} data.destination.lat - Varış latitude
 * @param {number} data.destination.lng - Varış longitude
 * @param {number} [data.estimated_fare] - Tahmini ücret (opsiyonel)
 * @param {string} [data.currency] - Para birimi (varsayılan: TMT)
 * @returns {Promise<object>} Oluşturulan Trip nesnesi
 * @throws {AppError} Validasyon hatasında
 */
const createTrip = async (passengerId, data) => {
  const { origin, destination, currency } = data;

  // Origin validasyonu: null/undefined ve valid coordinate kontrol
  if (
    origin == null ||
    !Number.isFinite(origin.lat) ||
    !Number.isFinite(origin.lng)
  ) {
    throw new AppError('ORIGIN_INVALID', 400);
  }

  // Destination validasyonu: null/undefined ve valid coordinate kontrol
  if (
    destination == null ||
    !Number.isFinite(destination.lat) ||
    !Number.isFinite(destination.lng)
  ) {
    throw new AppError('DESTINATION_INVALID', 400);
  }

  // Sequelize GEOGRAPHY(Point) formatı: { type: 'Point', coordinates: [lng, lat] }
  const originPoint = {
    type: 'Point',
    coordinates: [origin.lng, origin.lat],
  };

  const destinationPoint = {
    type: 'Point',
    coordinates: [destination.lng, destination.lat],
  };

  const distanceKm = distanceService.calculate(origin, destination);
  const pricingConfig = pricingService.getActiveConfig();

  if (!pricingConfig) {
    throw new AppError('PRICING_CONFIG_NOT_FOUND', 500);
  }
  const calculatedFare = pricingService.calculateFare(distanceKm, pricingConfig);
  

  const trip = await Trip.create({
    passenger_id: passengerId,
    driver_id: null,      // henüz driver yok
    car_id: null,         // henüz araç yok
    status: 'requested',  // default, ama açık yazmak okunaklı

    origin: originPoint,
    destination: destinationPoint,
    distance_km: distanceKm,
    fare_amount: calculatedFare,
    currency: currency || 'TMT',
    commission_rate: pricingConfig.commission_rate,
    platform_commission_amount: calculatedFare * (pricingConfig.commission_rate / 100),
    driver_earning_amount: calculatedFare * (1 - pricingConfig.commission_rate / 100),
    
  });

  return trip;
};


/**
 * Driver trip'i kabul eder ve aktif araç ile eşleştirir
 * @param {string} driverId - Driver user id
 * @param {string} tripId - Trip id
 * @returns {Promise<object>} { trip, activeCar } - Güncellenen trip ve aktif araç
 * @throws {AppError} Trip bulunamazsa, durumu uygun değilse veya aktif araç yoksa
 */
const acceptTrip = async (driverId, tripId) => {
  if (!tripId) {
    throw new AppError('TRIP_ID_REQUIRED', 400);
  }

  // 1) Trip var mı?
  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    throw new AppError('TRIP_NOT_FOUND', 404);
  }

  assertTripNotFinished(trip);

  // 2) Trip hâlâ requested durumda mı?
  if (trip.status !== 'requested') {
    throw new AppError('TRIP_NOT_REQUESTED', 400);
  }

  // 3) Driver'ın aktif arabası var mı?
  const activeCar = await Car.findOne({
    where: {
      driver_id: driverId,
      is_active: true,
    },
  });

  if (!activeCar) {
    throw new AppError('ACTIVE_CAR_REQUIRED', 400);
  }

  // 4) Trip'i driver + car ile eşleştir, status = accepted
  trip.driver_id = driverId;
  trip.car_id = activeCar.id;
  trip.status = 'accepted';

  await trip.save();

  return { trip, activeCar };
};


/**
 * Trip'i başlatır (status: accepted -> on_the_way)
 * @param {string} driverId - Driver user id
 * @param {string} tripId - Trip id
 * @returns {Promise<object>} Güncellenen trip nesnesi
 * @throws {AppError} Trip bulunamazsa, durumu uygun değilse veya driver eşleşmemişse
 */
const startTrip = async (driverId, tripId) => {
  if (!tripId) {
    throw new AppError('TRIP_ID_REQUIRED', 400);
  }

  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    throw new AppError('TRIP_NOT_FOUND', 404);
  }

  assertTripNotFinished(trip);

  // Trip bu driver'a mı ait?
  if (trip.driver_id !== driverId) {
    throw new AppError('TRIP_NOT_ASSIGNED_TO_DRIVER', 403);
  }

  // Yanlış status'te mi?
  if (trip.status !== 'accepted') {
    throw new AppError('TRIP_NOT_IN_ACCEPTED_STATE', 400);
  }

  trip.status = 'on_the_way';

  if (!trip.started_at) {
    trip.started_at = new Date();
  }

  await trip.save();
  return trip;
};


/**
 * Trip'i tamamlar (status: on_the_way -> completed)
 * @param {string} driverId - Driver user id
 * @param {string} tripId - Trip id
 * @returns {Promise<object>} Tamamlanan trip nesnesi
 * @throws {AppError} Trip bulunamazsa, durumu uygun değilse veya driver eşleşmemişse
 */
const completeTrip = async (driverId, tripId) => {
  if (!tripId) {
    throw new AppError('TRIP_ID_REQUIRED', 400);
  }

  const trip = await Trip.findByPk(tripId);

  if (!trip) {
    throw new AppError('TRIP_NOT_FOUND', 404);
  }


  if (trip.driver_id !== driverId) {
    throw new AppError('TRIP_NOT_ASSIGNED_TO_DRIVER', 403);
  }

  assertTripNotFinished(trip);
  
  if (trip.status !== 'on_the_way') {
    throw new AppError('TRIP_NOT_IN_ON_THE_WAY_STATE', 400);
  }

  trip.status = 'completed';
  trip.finished_by = 'driver';  
  trip.finish_reason = 'normal';
  trip.finished_at = new Date();


  await trip.save();
  return trip;
};

/**
 * Passenger trip iptal eder.
 * Kurallar:
 *  - Sadece kendi trip'ini iptal edebilir
 *  - Sadece requested veya accepted durumda iptal edebilir
 *  - on_the_way durumunda iptal YOK (orada early finish mantığı var)
 */
const cancelTripByPassenger = async (passengerId, tripId) => {
  if (!tripId) {
    throw new AppError('TRIP_ID_REQUIRED', 400);
  }

  const trip = await Trip.findByPk(tripId);
  if (!trip) {
    throw new AppError('TRIP_NOT_FOUND', 404);
  }


  // Bu trip gerçekten bu yolcuya mı ait?
  if (trip.passenger_id !== passengerId) {
    throw new AppError('TRIP_NOT_OWNED_BY_PASSENGER', 403);
  }

  assertTripNotFinished(trip);

  // Hangi state'te iptal edebilsin?
  if (trip.status === 'requested') {
    trip.status = 'cancelled';
    trip.finished_by = 'passenger';
    trip.finish_reason = 'passenger_cancel_before_driver';
    trip.finished_at = new Date();
  } else if (trip.status === 'accepted') {
    trip.status = 'cancelled';
    trip.finished_by = 'passenger';
    trip.finish_reason = 'passenger_cancel_after_accept';
    trip.finished_at = new Date();
  } else if (trip.status === 'on_the_way') {
    // Kurala göre izin yok
    throw new AppError('CANNOT_CANCEL_DURING_TRIP', 400);
  } else {
    // diğer durumlar zaten assertTripNotFinished ile eleniyor
    throw new AppError('CANNOT_CANCEL_IN_THIS_STATE', 400);
  }

  await trip.save();
  return trip;
};

/**
 * Passenger on_the_way durumundaki trip'i "erken bitirir"
 * Bu, cancel değil, "early complete" olarak kaydedilir.
 */
const finishTripByPassenger = async (passengerId, tripId) => {
  if (!tripId) {
    throw new AppError('TRIP_ID_REQUIRED', 400);
  }

  const trip = await Trip.findByPk(tripId);
  if (!trip) {
    throw new AppError('TRIP_NOT_FOUND', 404);
  }

  assertTripNotFinished(trip);

  if (trip.passenger_id !== passengerId) {
    throw new AppError('TRIP_NOT_OWNED_BY_PASSENGER', 403);
  }

  if (trip.status !== 'on_the_way') {
    throw new AppError('TRIP_NOT_IN_ON_THE_WAY_STATE', 400);
  }

  trip.status = 'completed';
  trip.finished_by = 'passenger';
  trip.finish_reason = 'passenger_early_finish';
  trip.finished_at = new Date();

  await trip.save();
  return trip;
};


module.exports = {
  createTrip,
  acceptTrip,
  startTrip,
  completeTrip,
  cancelTripByPassenger,
  finishTripByPassenger,
};
