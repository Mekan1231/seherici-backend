// src/services/pricing/pricing.service.js

const PricingConfig = require('../../models/pricingConfig.model');

class PricingService {
  async getActiveConfig(city = 'default') {
    const config = await PricingConfig.findOne({
      where: { city, active: true },
    });

    if (!config) {
      throw new Error('PRICING_CONFIG_NOT_FOUND');
    }

    return config;
  }

  calculateFare(distanceKm, config) {
    const rawFare =
      Number(config.base_fare) +
      distanceKm * Number(config.per_km_rate);

    return Math.max(Number(config.minimum_fare), rawFare);
  }
}

module.exports = new PricingService();