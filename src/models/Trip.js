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
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },

    // Yolculuğu alan sürücü (başta NULL)
    driver_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

    car_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'cars',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
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

    // Yolcunun alındığı konum
    origin: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: false,
    },

    // Yolculuğun biteceği konum
    destination: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: false,
    },

    estimated_fare: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'TMT',
    },

    finished_by: {
      type: DataTypes.ENUM('passenger', 'driver', 'admin', 'system', 'none'),
      allowNull: false,
      defaultValue: 'none',
    },

    finish_reason: {
      type: DataTypes.ENUM(
        'normal',
        'passenger_cancel_before_driver',
        'passenger_cancel_after_accept',
        'passenger_early_finish',
        'driver_cancel_before_pickup',
        'system_cancel_timeout'
      ),
      allowNull: true,
    },

    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    finished_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'trips',
    timestamps: true,
    underscored: false,
  }
);

module.exports = Trip;
