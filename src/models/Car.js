const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


/**
 * Car Model
 * Bir sürücünün sahip olduğu araç bilgilerini tutar
 */
const Car = sequelize.define(
  'Car',
  {
    // Aracın benzersiz kimliği
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Aracın sahibi olan sürücünün user.id değeri
    driver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    // Araç plakası (benzersiz)
    plate_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    // Araç markası (Toyota, Hyundai vb.)
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Araç modeli (Camry, Elantra vb.)
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Araç rengi (gösterim amaçlı)
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Araç aktif mi? (bakımda / pasif olabilir)
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'cars',
    timestamps: true,   // createdAt & updatedAt
    underscored: false,  // camelCase column names
  }
);



module.exports = Car;
