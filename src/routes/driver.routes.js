const express = require('express');
const router = express.Router();

const driverController = require('../controllers/driver.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// Passenger → Driver başvurusu
router.post('/apply', requireAuth, driverController.apply);
router.post('/upload-document', requireAuth, driverController.uploadDocument);

router.post('/cars', requireAuth, driverController.createCar);
router.get('/cars', requireAuth, driverController.listCars);
router.delete('/cars/:carId', requireAuth, requireRole('driver'), driverController.deleteCar);
router.post('/cars/:id/activate',requireAuth,requireRole('driver'),driverController.activateCar);
router.get('/active-car', requireAuth, requireRole('driver'), driverController.getActiveCar);
router.post('/trips/:id/accept',requireAuth,requireRole('driver'),driverController.acceptTrip);
router.post('/trips/:id/start', requireAuth, requireRole('driver'), driverController.startTrip);
router.post('/trips/:id/complete', requireAuth, requireRole('driver'), driverController.completeTrip);



module.exports = router;
