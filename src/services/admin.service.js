const { User } = require('../models');

const getPendingDrivers = async () => {
  const pending = await User.findAll({
    where: { driver_status: 'pending' },
    attributes: ['id', 'name', 'phone', 'driver_status', 'createdAt']
  });

  return pending;
};

module.exports = {
  getPendingDrivers,
};
