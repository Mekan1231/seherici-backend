
const HaversineStrategy = require('./strategies/haversine.strategy');

class DistanceService {
  constructor() {
    this.strategy = new HaversineStrategy();
  }

  calculate(origin, destination) {
    return this.strategy.calculate(origin, destination);
  }
}

module.exports = new DistanceService();