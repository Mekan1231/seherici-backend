const bcrypt = require('bcrypt');
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
      throw new AppError('DRIVER_NOT_APPROVED', 403);
    }
    user.role = 'driver';
  } else if (user.role === 'driver') {
    user.role = 'passenger';
  } else {
    throw new AppError('ADMIN_CANNOT_SWITCH', 400);
  }

  await user.save();
  return user;
};

module.exports = {
  createUser,
  getUserById,
  switchMode
};





