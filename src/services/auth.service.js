const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');

const login = async (phone, password) => {
  if (!phone || !password) {
    throw new AppError("PHONE_AND_PASSWORD_REQUIRED", 400, "PHONE_AND_PASSWORD_REQUIRED");
  }

  const user = await User.findOne({ where: { phone } });

  // USER YOK → aynı hata şifre yanlış ile aynı
  if (!user) {
    throw new AppError("INVALID_CREDENTIALS", 401, "INVALID_CREDENTIALS");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new AppError("INVALID_CREDENTIALS", 401, "INVALID_CREDENTIALS");
  }

  // is_active DB’de yok → kaldırıldı
  // if (user.is_active === false) { ... }

  // JWT üret
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

  return {
    token,
    user,
  };
};

module.exports = {
  login,
};
