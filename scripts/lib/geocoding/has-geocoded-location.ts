import type { Institution } from '../../../lib/types/institution';

export function hasGeocodedLocation(institution: Institution): boolean {
  return (
    typeof institution.location?.lat === 'number' &&
    typeof institution.location?.lng === 'number' &&
    Number.isFinite(institution.location.lat) &&
    Number.isFinite(institution.location.lng)
  );
}
