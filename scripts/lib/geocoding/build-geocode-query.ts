import type { Institution } from '../../../lib/types/institution';

export function buildGeocodeQuery(institution: Institution): string {
  if (institution.geocodeQuery?.trim()) {
    return institution.geocodeQuery.trim();
  }

  const region = institution.state ?? institution.province;

  return [institution.name, institution.city, region, institution.country]
    .filter((part) => part && part.trim().length > 0)
    .join(', ');
}
