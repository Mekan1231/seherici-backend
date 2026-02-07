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
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
},
{
  tableName: 'driver_documents',
  timestamps: true, // createdAt & updatedAt
  underscored: false, // camelCase column names
}
);



module.exports = DriverDocument;

