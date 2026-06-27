import { find } from 'geo-tz';

export function resolveTimezone(lat: number, lng: number): string | null {
  const timezones = find(lat, lng);

  return timezones[0] ?? null;
}
