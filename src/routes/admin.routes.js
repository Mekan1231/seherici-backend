const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// Tüm admin endpointleri sadece admin kullanıcıya açık olacak.
router.use(requireAuth, requireRole('admin'));

// Boş test endpoint
router.get('/test', adminController.test);

module.exports = router;
