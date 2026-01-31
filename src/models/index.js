const User = require('./User');
const Car = require('./Car');
const Trip = require('./Trip'); 
const DriverDocument = require('./DriverDocument');

// RELATIONS
User.hasMany(Car, { foreignKey: 'driver_id', as: 'cars' });
Car.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

User.hasMany(DriverDocument, { foreignKey: 'user_id', as: 'documents' });
DriverDocument.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  User,
  Car,
  Trip, 
  DriverDocument,
};
