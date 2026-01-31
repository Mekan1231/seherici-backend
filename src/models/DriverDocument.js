const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DriverDocument = sequelize.define('DriverDocument', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  document_type: {
    type: DataTypes.ENUM('driver_license', 'id_card', 'car_registration'),
    allowNull: false,
  },

  document_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  },
});



module.exports = DriverDocument;

