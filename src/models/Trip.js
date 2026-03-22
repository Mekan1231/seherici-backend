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

    distance_km: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },

    fare_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    commission_rate: {
      type: DataTypes.DECIMAL(5, 2), // %5.00 gibi
      allowNull: false,
    },

    platform_commission_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    driver_earning_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
