
class HaversineStrategy {
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  calculate(origin, destination) {
    const R = 6371; // Dünya yarıçapı km

    const dLat = this.toRadians(destination.lat - origin.lat);
    const dLng = this.toRadians(destination.lng - origin.lng);

    const lat1 = this.toRadians(origin.lat);
    const lat2 = this.toRadians(destination.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) *
        Math.sin(dLng / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // km
  }
}

module.exports = HaversineStrategy;