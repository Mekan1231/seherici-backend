const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    role: {
      type: DataTypes.ENUM('passenger', 'driver', 'admin'),
      allowNull: false,
      defaultValue: 'passenger',
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    current_location: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: true,
    },

    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 5.0,
    },

    driver_status: {
      type: DataTypes.ENUM('none', 'pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'none',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: false,

    //  INDEX BURADA
    indexes: [
      {
        fields: ['current_location'],
        using: 'GIST',
      },
    ],
  }
);

module.exports = User;

