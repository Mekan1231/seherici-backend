const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Trip = sequelize.define(
  'Trip',
  {
    // Yolculuğun benzersiz kimliği
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Yolculuğu başlatan yolcu
    passenger_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // Yolculuğu alan sürücü (başta NULL)
    driver_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    // Yolcunun alındığı konum
    pickup_location: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: false,
    },

    // Yolculuğun biteceği konum
    dropoff_location: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: false,
    },

    // Yolculuğun durumu
    status: {
      type: DataTypes.ENUM(
        'requested',
        'accepted',
        'on_the_way',
        'completed',
        'cancelled'
      ),
      allowNull: false,
      defaultValue: 'requested',
    },
  },
  {
    tableName: 'trips',
    timestamps: true,
    underscored: false,
  }
);

module.exports = Trip;
