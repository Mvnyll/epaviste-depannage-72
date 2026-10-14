const toRadians = (degrees) => (degrees * Math.PI) / 180;

export function haversineDistanceKm(from, to) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const value =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(value));
}

export function sortAreasByDistance(areas, position) {
  return areas
    .map((area) => ({
      area,
      distanceKm:
        Number.isFinite(area.latitude) && Number.isFinite(area.longitude)
          ? haversineDistanceKm(position, area)
          : null,
    }))
    .sort((first, second) => {
      if (first.distanceKm === null) return second.distanceKm === null ? 0 : 1;
      if (second.distanceKm === null) return -1;
      return first.distanceKm - second.distanceKm;
    });
}
