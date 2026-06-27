import type {
  InstitutionAddress,
  InstitutionLocation,
} from '../../../lib/types/institution';

export type GeocoderResult = {
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  zipcode?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
};

export type GeocodedFields = {
  address: InstitutionAddress;
  location: InstitutionLocation;
  timezone: string | null;
  geocodedAt: string;
};

function buildStreet(result: GeocoderResult): string | null {
  if (!result.streetName) {
    return null;
  }

  return [result.streetNumber, result.streetName].filter(Boolean).join(' ');
}

export function mapGeocoderResult(
  result: GeocoderResult,
  timezone: string | null,
  geocodedAt: string,
): GeocodedFields {
  return {
    address: {
      street: buildStreet(result),
      city: result.city ?? null,
      state: result.stateCode ?? result.state ?? null,
      postalCode: result.zipcode ?? null,
      country: result.countryCode ?? result.country ?? null,
    },
    location: {
      lat: result.latitude ?? 0,
      lng: result.longitude ?? 0,
    },
    timezone,
    geocodedAt,
  };
}

export function isValidGeocoderResult(result: GeocoderResult): boolean {
  return (
    typeof result.latitude === 'number' &&
    typeof result.longitude === 'number' &&
    Number.isFinite(result.latitude) &&
    Number.isFinite(result.longitude)
  );
}
