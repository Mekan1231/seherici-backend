
const express = require('express');
const router = express.Router();

const tripController = require('../controllers/trip.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// Yolcu yeni trip isteği oluşturur
router.post( '/',requireAuth, requireRole('passenger'),tripController.createTrip);

router.post(
'/:id/cancel',
  requireAuth,
  requireRole('passenger'),
  tripController.cancelAsPassenger
);

// Yolcu on_the_way durumundaki kendi trip'ini erken bitirir
router.post(
  '/:id/finish',
  requireAuth,
  requireRole('passenger'),
  tripController.finishAsPassenger
);

// Passenger kendi trip'lerini görür
router.get('/my', requireAuth, requireRole('passenger'), tripController.getMyTrips);

router.get('/:id', requireAuth, tripController.getTripById);

module.exports = router;
