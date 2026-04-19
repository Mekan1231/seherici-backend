const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PricingConfig = sequelize.define(
  'PricingConfig',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'default',
    },

    base_fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 10.00,
}   ,

    minimum_fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    per_km_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'pricing_configs',
    timestamps: true,
  }
);

module.exports = PricingConfig;