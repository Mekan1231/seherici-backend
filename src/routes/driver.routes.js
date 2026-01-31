const express = require('express');
const router = express.Router();

const driverController = require('../controllers/driver.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

// Passenger → Driver başvurusu
router.post('/apply', requireAuth, driverController.apply);
router.post('/upload-document', requireAuth, driverController.uploadDocument);

module.exports = router;
