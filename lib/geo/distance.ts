export type ZipCentroidIndex = Record<string, [number, number] | number[]>;

const EARTH_RADIUS_MILES = 3958.8;

export function normalizeZipCode(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 5) {
    return null;
  }

  return digits;
}

export function lookupZipCentroid(
  zip: string,
  index: ZipCentroidIndex,
): [number, number] | null {
  const normalized = normalizeZipCode(zip);
  if (!normalized) {
    return null;
  }

  const entry = index[normalized];
  if (!entry || entry.length < 2) {
    return null;
  }

  return [entry[0], entry[1]];
}

export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(miles: number): string {
  if (miles < 1) {
    return '< 1 mi';
  }

  if (miles < 10) {
    return `${miles.toFixed(1)} mi`;
  }

  return `${Math.round(miles)} mi`;
}

export function distanceFromZipToInstitution(
  zipCentroid: [number, number],
  location: { lat: number; lng: number },
): number {
  return distanceBetweenPoints(zipCentroid, location);
}

export function distanceBetweenPoints(
  origin: [number, number] | { lat: number; lng: number },
  location: { lat: number; lng: number },
): number {
  const originLat = Array.isArray(origin) ? origin[0] : origin.lat;
  const originLng = Array.isArray(origin) ? origin[1] : origin.lng;

  return haversineMiles(originLat, originLng, location.lat, location.lng);
}
