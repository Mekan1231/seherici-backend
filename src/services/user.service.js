const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const AppError = require('../utils/AppError');
const User = models.User;

const createUser = async (data) => {
  const { name, phone, password } = data;
  if (!name || !phone || !password) {
    throw new AppError("REQUIRED_FIELDS_MISSING", 400, "REQUIRED_FIELDS_MISSING");
  }
  const existing = await User.findOne({ where: { phone } });
  if (existing) {
    throw new AppError("PHONE_ALREADY_EXISTS", 409, "PHONE_ALREADY_EXISTS");
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    phone,
    password: hashed,
    role: data.role || "passenger",
  });
  return user;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404, "USER_NOT_FOUND");
  }
  return user;
};

const switchMode = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('USER_NOT_FOUND', 404);
  }
  if (user.role === 'passenger') {
    if (user.driver_status !== 'approved') {
      throw new AppError('DRIVER_NOT_APPROVED', 403, 'DRIVER_NOT_APPROVED');
    }
    // Aktif trip var mı?
    const { Trip } = require('../models');
    const activeTrip = await Trip.findOne({
      where: {
        passenger_id: user.id,
        status: ['requested', 'accepted', 'on_the_way'],
      },
    });
    if (activeTrip) {
      throw new AppError('CANNOT_SWITCH_WITH_ACTIVE_TRIP', 400, 'CANNOT_SWITCH_WITH_ACTIVE_TRIP');
    }
    user.role = 'driver';
  } else if (user.role === 'driver') {
    user.role = 'passenger';
  } else {
    throw new AppError('ADMIN_CANNOT_SWITCH', 400, 'ADMIN_CANNOT_SWITCH');
  }
  await user.save();

  // Yeni token üret
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return { user, token };
};

module.exports = {
  createUser,
  getUserById,
  switchMode
};
