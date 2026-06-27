import type { Institution } from '../../../lib/types/institution';
import { buildGeocodeQuery } from './build-geocode-query';
import { hasGeocodedLocation } from './has-geocoded-location';

export type MissingInstitutionSummary = {
  id: string;
  name: string;
  query: string;
  city: string;
  state?: string;
  province?: string;
  country: string;
  website?: string;
};

export function listMissingInstitutions(
  institutions: Institution[],
): MissingInstitutionSummary[] {
  return institutions
    .filter((institution) => !hasGeocodedLocation(institution))
    .map((institution) => ({
      id: institution.id,
      name: institution.name,
      query: buildGeocodeQuery(institution),
      city: institution.city,
      state: institution.state,
      province: institution.province,
      country: institution.country,
      ...(institution.website ? { website: institution.website } : {}),
    }));
}
