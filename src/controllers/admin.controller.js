const adminService = require('../services/admin.service');
const AppError = require('../utils/AppError');
const { User } = require('../models');

const getPendingDrivers = async (req, res, next) => {
  try {
    const list = await adminService.getPendingDrivers();

    return res.json({
      success: true,
      message: "PENDING_DRIVERS_LIST",
      count: list.length,
      drivers: list,
    });

  } catch (err) {
    next(err);
  }
};

// Driver onaylandı
const approveDriver = async (req, res, next) => {
  try {
    const driverId = req.params.id;

    const user = await User.findByPk(driverId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", 404);
    }

    if (user.driver_status !== "pending") {
      throw new AppError("DRIVER_NOT_PENDING", 400);
    }

    user.role = "driver";
    user.driver_status = "approved";

    await user.save();

    return res.json({
      success: true,
      message: "DRIVER_APPROVED",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        driver_status: user.driver_status
      }
    });

  } catch (err) {
    next(err);
  }
};

// Driver reddedildi
const rejectDriver = async (req, res, next) => {
  try {
    const driverId = req.params.id;

    const user = await User.findByPk(driverId);
    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404);
    }

    if (user.driver_status !== 'pending') {
      throw new AppError('DRIVER_NOT_PENDING', 400);
    }

    // Reddet → rol passenger olarak kalıyor
    user.driver_status = 'rejected';
    await user.save();

    return res.json({
      success: true,
      message: 'DRIVER_REJECTED',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,              // muhtemelen 'passenger'
        driver_status: user.driver_status, // 'rejected'
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPendingDrivers,
  approveDriver,
  rejectDriver,
};

