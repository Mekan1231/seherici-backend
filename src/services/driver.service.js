const { User } = require('../models');
const AppError = require('../utils/AppError');

const applyForDriver = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('USER_NOT_FOUND', 404, 'USER_NOT_FOUND');
  if (user.role === 'driver') throw new AppError('ALREADY_DRIVER', 400, 'ALREADY_DRIVER');
  if (user.driver_status === 'pending') throw new AppError('ALREADY_PENDING', 400, 'ALREADY_PENDING');
  user.driver_status = 'pending';
  await user.save();
  return user;
};

const uploadDriverDocument = async (userId, document_type, fileUrl) => {
  const { DriverDocument } = require('../models');
  return await DriverDocument.create({
    user_id: userId,
    document_type,
    document_url: fileUrl,
    status: 'pending',
  });
};

const updateLocation = async (driverId, lat, lng) => {
  const driver = await User.findByPk(driverId);
  if (!driver) throw new AppError('USER_NOT_FOUND', 404, 'USER_NOT_FOUND');
  driver.current_location = {
    type: 'Point',
    coordinates: [lng, lat],
  };
  await driver.save();
  return { lat, lng };
};


const setAvailability = async (driverId, isAvailable) => {
  const driver = await User.findByPk(driverId);
  if (!driver) throw new AppError('USER_NOT_FOUND', 404, 'USER_NOT_FOUND');
  driver.is_available = isAvailable;
  await driver.save();
  return { is_available: isAvailable };
};


module.exports = {
  applyForDriver,
  uploadDriverDocument,
  updateLocation,
  setAvailability,
};



