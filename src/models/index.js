const User = require('./User');
const Car = require('./Car');
const Trip = require('./Trip'); 
const DriverDocument = require('./DriverDocument');

// RELATIONS
User.hasMany(Car, { foreignKey: 'driver_id', as: 'cars' });
Car.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

User.hasMany(DriverDocument, { foreignKey: 'user_id', as: 'documents' });
DriverDocument.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Trip ilişkileri

// Yolcu tarafı
User.hasMany(Trip, { foreignKey: 'passenger_id', as: 'passenger_trips' });
Trip.belongsTo(User, { foreignKey: 'passenger_id', as: 'passenger' });

// Sürücü tarafı
User.hasMany(Trip, { foreignKey: 'driver_id', as: 'driver_trips' });
Trip.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

// Araç tarafı
Car.hasMany(Trip, { foreignKey: 'car_id', as: 'trips' });
Trip.belongsTo(Car, { foreignKey: 'car_id', as: 'car' });


module.exports = {
  User,
  Car,
  Trip, 
  DriverDocument,
};
