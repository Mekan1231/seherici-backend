const { User, DriverDocument } = require('../models');
const carService = require('../services/car.service');
const tripService = require('../services/trip.service');




// 1 DRIVER APPLY
const apply = async (req, res) => {
  try {
    const user = req.user; // JWT’den gelir

    if (user.role === 'driver') {
      return res.status(400).json({ message: 'ALREADY_DRIVER' });
    }

    if (user.driver_status === 'pending') {
      return res.status(400).json({ message: 'APPLICATION_ALREADY_PENDING' });
    }

    // DB üzerinde user modelini gerçek veriden çekiyoruz:
    const dbUser = await User.findByPk(user.id);

    dbUser.driver_status = 'pending';
    await dbUser.save();

    return res.json({
      message: 'DRIVER_APPLICATION_RECEIVED',
      driver_status: dbUser.driver_status,
    });
  } catch (err) {
    console.error('DRIVER_APPLY_ERROR:', err);
    return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
  }
};


// 2 DRIVER DOCUMENT UPLOAD (yeni fonksiyon)
const uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { document_type } = req.body;

    if (!document_type) {
      return res.status(400).json({ message: 'DOCUMENT_TYPE_REQUIRED' });
    }

    // Test için sahte URL
    const fakeUploadedUrl = "https://storage.supabase.fake/testfile.jpg";

    const doc = await DriverDocument.create({
      user_id: userId,
      document_type,
      document_url: fakeUploadedUrl,
      status: 'pending',
    });

    return res.json({
      message: 'DOCUMENT_UPLOADED',
      document: doc,
    });

  } catch (err) {
    console.error('UPLOAD_DOCUMENT_ERROR:', err);
    return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
  }
};


//  3) Araç oluşturma
const createCar = async (req, res, next) => {
  try {
    const driverId = req.user.id;           // JWT'den
    const data = req.body;                  // plate_number, brand, model, color

    const car = await carService.createCar(driverId, data);

    return res.status(201).json({
      success: true,
      message: 'CAR_CREATED',
      car: {
        id: car.id,
        plate_number: car.plate_number,
        brand: car.brand,
        model: car.model,
        color: car.color,
        is_active: car.is_active,
      },
    });
  } catch (err) {
    next(err);
  }
};

//  4) Driver araçlarını listeleme
const listCars = async (req, res, next) => {
  try {
    const driverId = req.user.id;

    const cars = await carService.listCars(driverId);

    return res.json({
      success: true,
      message: 'DRIVER_CARS',
      count: cars.length,
      cars,
    });
  } catch (err) {
    next(err);
  }
};

// 5) Araç aktif etme
const activateCar = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const carId = req.params.id;

    const car = await carService.activateCar(driverId, carId);

    return res.json({
         success: true,
      message: 'CAR_ACTIVATED',
      car: {
        id: car.id,
        plate_number: car.plate_number,
        brand: car.brand,
        model: car.model,
        color: car.color,
        is_active: car.is_active,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 6) Aktif aracı getirme
async function getActiveCar(req,res, next) {
  try {
    const driverId = req.user.id;
    const car = await carService.getActiveCar(driverId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'ACTIVE_CAR_NOT_FOUND' });
    }
    return res.json({
      success: true,
      message: 'ACTIVE_CAR_FOUND',
      car: {
        id: car.id,
        plate_number: car.plate_number,
        brand: car.brand,
        model: car.model,
        color: car.color,
        is_active: car.is_active,
      },
    });
  } catch (err) {
    next(err);
  }
}

// 7) Araç silme (isteğe bağlı)
async function deleteCar(req, res, next) {
  try {
    const driverId = req.user.id;
    const carId = req.params.carId;

    const result = await carService.deleteCar(driverId, carId);

    return res.json({
      success: true,
      message: 'CAR_DELETED',
      wasActive: result.wasActive,
    });
  } catch (err) {
    next(err);
  }
}

// 8) Trip kabul etme
async function acceptTrip(req, res, next) {
  try {
    const driverId = req.user.id;   // JWT'den
    const tripId = req.params.id;   // URL'den

    const { trip, activeCar } = await tripService.acceptTrip(driverId, tripId);

    return res.json({
      success: true,
      message: 'TRIP_ACCEPTED',
      trip: {
        id: trip.id,
        status: trip.status,
        passenger_id: trip.passenger_id,
        driver_id: trip.driver_id,
        car_id: trip.car_id,
        estimated_fare: trip.estimated_fare,
        currency: trip.currency,
        createdAt: trip.createdAt,
      },
      car: {
        id: activeCar.id,
        plate_number: activeCar.plate_number,
        brand: activeCar.brand,
        model: activeCar.model,
        color: activeCar.color,
      },
    });
  } catch (err) {
    next(err);
  }
}


async function startTrip(req, res, next) {
  try {
    const driverId = req.user.id;
    const tripId = req.params.id;

    const trip = await tripService.startTrip(driverId, tripId);

    return res.json({
      success: true,
      message: 'TRIP_STARTED',
      trip: {
        id: trip.id,
        status: trip.status,
        passenger_id: trip.passenger_id,
        driver_id: trip.driver_id,
        car_id: trip.car_id,
        estimated_fare: trip.estimated_fare,
        currency: trip.currency,
        createdAt: trip.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function completeTrip(req, res, next) {
  try {
    const driverId = req.user.id;
    const tripId = req.params.id;

    const trip = await tripService.completeTrip(driverId, tripId);

    return res.json({
      success: true,
      message: 'TRIP_COMPLETED',
      trip: {
        id: trip.id,
        status: trip.status,
        passenger_id: trip.passenger_id,
        driver_id: trip.driver_id,
        car_id: trip.car_id,
        estimated_fare: trip.estimated_fare,
        currency: trip.currency,
        createdAt: trip.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}


    

module.exports = {
  apply,
  uploadDocument, // Yeni endpoint buraya EKLENİYOR (apply silinmiyor)
  createCar,
  listCars,
  activateCar,
  getActiveCar,
  deleteCar,
  acceptTrip,
  startTrip,
  completeTrip
};

