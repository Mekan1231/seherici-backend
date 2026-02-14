// src/services/car.service.js
const { Car } = require('../models');
const AppError = require('../utils/AppError');
const { sequelize } = require('../config/db');

//  Araç oluşturma
const createCar = async (driverId, data) => {
  const { plate_number, brand, model, color } = data;

  // Zorunlu alan kontrolü
  if (!plate_number || !brand || !model) {
    throw new AppError('REQUIRED_FIELDS_MISSING', 422);
  }

  // Aynı plaka var mı?
  const exists = await Car.findOne({ where: { plate_number } });
  if (exists) {
    throw new AppError('PLATE_ALREADY_EXISTS', 409);
  }

  // DB'ye kaydet
  const car = await Car.create({
    driver_id: driverId,
    plate_number,
    brand,
    model,
    color: color || null,
    is_active: true,
  });

  return car;
};

//  Driver'ın araçlarını listeleme
const listCars = async (driverId) => {
  const cars = await Car.findAll({
    where: { driver_id: driverId },
    order: [['createdAt', 'DESC']],
  });

  return cars;
};

const activateCar = async (driverId, carId) => {
  // Önce gerçekten bu car bu driver'a mı ait, var mı?
  const car = await Car.findOne({
    where: { id: carId, driver_id: driverId },
  });

  if (!car) {
    throw new AppError('CAR_NOT_FOUND', 404);
  }

  await sequelize.transaction(async (t) => {
    // 1) Bu driver'ın tüm araçlarını pasifleştir
    await Car.update(
      { is_active: false },
      {
        where: { driver_id: driverId },
        transaction: t,
      }
    );

    // 2) Sadece bu aracı aktif yap
    const [affectedRows] = await Car.update(
      { is_active: true },
      {
        where: { id: carId, driver_id: driverId },
        transaction: t,
      }
    );

    if (affectedRows === 0) {
      // teorik olarak olmaması lazım ama güvenlik için:
      throw new AppError('CAR_NOT_FOUND', 404);
    }
  });

  // Transaction bittikten sonra güncel halini DB'den tekrar çek
  await car.reload();

  return car;
};

// Driver'ın aktif aracını getirme
async function getActiveCar(driverId) {
    const car = await Car.findOne({ where: { driver_id: driverId, is_active: true } });
    return car;
}

// Araç silme
const deleteCar = async (driverId, carId) => {
  const car = await Car.findOne({ where: { id: carId, driver_id: driverId } });

  if (!car) {
    throw new AppError('CAR_NOT_FOUND', 404);
  }

    const wasActive = car.is_active;

  await car.destroy();
  return { wasActive };
}


module.exports = {
  createCar,
  listCars,
  activateCar,
  getActiveCar,
  deleteCar,
};
