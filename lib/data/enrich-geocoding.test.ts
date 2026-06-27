import { describe, expect, it } from 'vitest';

import type { Institution } from '../types/institution';
import { buildGeocodeQuery } from '../../scripts/lib/geocoding/build-geocode-query';
import { hasGeocodedLocation } from '../../scripts/lib/geocoding/has-geocoded-location';
import { listMissingInstitutions } from '../../scripts/lib/geocoding/list-missing-institutions';
import {
  isValidGeocoderResult,
  mapGeocoderResult,
  type GeocoderResult,
} from '../../scripts/lib/geocoding/map-geocoder-result';
import { resolveTimezone } from '../../scripts/lib/geocoding/resolve-timezone';

const reciprocityInstitution: Institution = {
  id: 'United States-Indiana-South Bend-Potawatomi Zoo',
  name: 'Potawatomi Zoo',
  country: 'United States',
  state: 'Indiana',
  city: 'South Bend',
  type: 'zoo',
  reciprocity: {
    participates: true,
    tier: '50',
    label: '50%',
    freeToPublic: false,
  },
  region: 'Midwest / Great Lakes',
  source: 'test',
};

const accreditedInstitution: Institution = {
  id: 'accredited--united-states--new-jersey--adventure-aquarium',
  name: 'Adventure Aquarium',
  country: 'United States',
  state: 'New Jersey',
  city: '',
  type: 'aquarium',
  reciprocity: {
    participates: false,
    label: 'Not participating',
  },
  region: 'Northeast / Mid-Atlantic',
  source: 'test',
};

describe('buildGeocodeQuery', () => {
  it('builds a query from name, city, state, and country', () => {
    expect(buildGeocodeQuery(reciprocityInstitution)).toBe(
      'Potawatomi Zoo, South Bend, Indiana, United States',
    );
  });

  it('omits empty city for accredited-only institutions', () => {
    expect(buildGeocodeQuery(accreditedInstitution)).toBe(
      'Adventure Aquarium, New Jersey, United States',
    );
  });

  it('uses geocodeQuery when provided', () => {
    expect(
      buildGeocodeQuery({
        ...accreditedInstitution,
        geocodeQuery: 'Adventure Aquarium, Camden, New Jersey, United States',
      }),
    ).toBe('Adventure Aquarium, Camden, New Jersey, United States');
  });
});

describe('mapGeocoderResult', () => {
  it('assembles street, address fields, and geocoded metadata', () => {
    const result: GeocoderResult = {
      streetNumber: '500',
      streetName: 'S Greenlawn Ave',
      city: 'South Bend',
      state: 'Indiana',
      stateCode: 'IN',
      zipcode: '46615',
      country: 'United States',
      countryCode: 'US',
      latitude: 41.667827,
      longitude: -86.224873,
    };

    expect(
      mapGeocoderResult(result, 'America/Indiana/Indianapolis', '2026-06-26'),
    ).toEqual({
      address: {
        street: '500 S Greenlawn Ave',
        city: 'South Bend',
        state: 'IN',
        postalCode: '46615',
        country: 'US',
      },
      location: {
        lat: 41.667827,
        lng: -86.224873,
      },
      timezone: 'America/Indiana/Indianapolis',
      geocodedAt: '2026-06-26',
    });
  });

  it('returns null street when street name is missing', () => {
    const result: GeocoderResult = {
      city: 'South Bend',
      latitude: 41.667827,
      longitude: -86.224873,
    };

    expect(mapGeocoderResult(result, null, '2026-06-26').address.street).toBe(
      null,
    );
  });
});

describe('isValidGeocoderResult', () => {
  it('accepts finite latitude and longitude', () => {
    expect(
      isValidGeocoderResult({
        latitude: 41.667827,
        longitude: -86.224873,
      }),
    ).toBe(true);
  });

  it('rejects missing coordinates', () => {
    expect(isValidGeocoderResult({ city: 'South Bend' })).toBe(false);
  });
});

describe('resolveTimezone', () => {
  it('resolves South Bend coordinates to America/Indiana/Indianapolis', () => {
    expect(resolveTimezone(41.667827, -86.224873)).toBe(
      'America/Indiana/Indianapolis',
    );
  });
});

describe('hasGeocodedLocation', () => {
  it('returns true when coordinates are present', () => {
    expect(
      hasGeocodedLocation({
        ...reciprocityInstitution,
        location: { lat: 41.667827, lng: -86.224873 },
      }),
    ).toBe(true);
  });

  it('returns false when coordinates are missing', () => {
    expect(hasGeocodedLocation(accreditedInstitution)).toBe(false);
  });
});

describe('listMissingInstitutions', () => {
  it('returns institutions without geocoded coordinates', () => {
    const institutions = [
      {
        ...reciprocityInstitution,
        location: { lat: 41.667827, lng: -86.224873 },
      },
      accreditedInstitution,
    ];

    expect(listMissingInstitutions(institutions)).toEqual([
      {
        id: accreditedInstitution.id,
        name: accreditedInstitution.name,
        query: 'Adventure Aquarium, New Jersey, United States',
        city: '',
        state: 'New Jersey',
        country: 'United States',
      },
    ]);
  });
});
