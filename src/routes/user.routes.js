const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

// 1 USER CREATE (PASSENGER KAYIT) → Bu eksikti
router.post('/', userController.createUser);

// 2 JWT ile kullanıcı bilgisi
router.get('/me', requireAuth, userController.me);

// 3 Driver'a özel örnek endpoint
router.get('/driver-panel', requireAuth, requireRole('driver'), (req, res) => {
  res.json({
    message: 'DRIVER_ACCESS_GRANTED',
    user: req.user,
  });
});

module.exports = router;


