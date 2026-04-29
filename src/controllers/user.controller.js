const userService = require('../services/user.service');
const AppError = require('../utils/AppError');

// 1️⃣ USER CREATE (Register)
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    return res.status(201).json({
      success: true,
      message: 'USER_CREATED',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    next(err); // → Global Error Handler
  }
};

// 2️⃣ ME ENDPOINT
const me = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("INVALID_TOKEN_PAYLOAD", 400);
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", 404);
    }

    return res.status(200).json({
      success: true,
      message: "ME_SUCCESS",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        is_available: user.is_available,
        rating: user.rating,
        createdAt: user.createdAt,
      }
    });

  } catch (err) {
    next(err); // → Global Error Handler
  }
};

const switchMode = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.switchMode(userId);

    return res.json({
      success: true,
      message: 'MODE_SWITCHED',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        driver_status: user.driver_status,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  me,
  switchMode,
};







