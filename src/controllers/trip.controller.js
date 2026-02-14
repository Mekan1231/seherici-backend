
const tripService = require('../services/trip.service');

const createTrip = async (req, res, next) => {
  try {
    const passengerId = req.user.id; // JWT'den

    const trip = await tripService.createTrip(passengerId, req.body);

    return res.status(201).json({
      success: true,
      message: 'TRIP_CREATED',
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
    next(err); // global error handler'a gider
  }
};

// Passenger trip iptal eder
const cancelAsPassenger = async (req, res, next) => {
  try {
    const passengerId = req.user.id;  // JWT'den
    const tripId = req.params.id;

    const trip = await tripService.cancelTripByPassenger(passengerId, tripId);

    return res.json({
      success: true,
      message: 'TRIP_CANCELLED_BY_PASSENGER',
      trip: {
        id: trip.id,
        status: trip.status,
        passenger_id: trip.passenger_id,
        driver_id: trip.driver_id,
        car_id: trip.car_id,
        finished_by: trip.finished_by,
        finish_reason: trip.finish_reason,
        finished_at: trip.finished_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Passenger on_the_way durumundaki trip'i erken bitirir
const finishAsPassenger = async (req, res, next) => {
  try {
    const passengerId = req.user.id;
    const tripId = req.params.id;

    const trip = await tripService.finishTripByPassenger(passengerId, tripId);

    return res.json({
      success: true,
      message: 'TRIP_FINISHED_BY_PASSENGER',
      trip: {
        id: trip.id,
        status: trip.status,
        passenger_id: trip.passenger_id,
        driver_id: trip.driver_id,
        car_id: trip.car_id,
        finished_by: trip.finished_by,
        finish_reason: trip.finish_reason,
        finished_at: trip.finished_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTrip,
  cancelAsPassenger,
  finishAsPassenger,
};
