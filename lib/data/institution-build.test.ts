import { describe, expect, it } from 'vitest';

import {
  inferInstitutionType,
  parseAzaLocation,
  tokensMatch,
} from '../../scripts/lib/parse-location.mjs';

describe('institution build helpers', () => {
  it('parses US and international AZA locations', () => {
    expect(parseAzaLocation('Calif.')).toEqual({
      country: 'United States',
      state: 'California',
    });
    expect(parseAzaLocation('D.C.')).toEqual({
      country: 'United States',
      state: 'DC',
    });
    expect(parseAzaLocation('Canada')).toEqual({ country: 'Canada' });
    expect(parseAzaLocation('United Arab Emirates')).toEqual({
      country: 'United Arab Emirates',
    });
  });

  it('infers institution types from names', () => {
    expect(inferInstitutionType('Georgia Aquarium')).toBe('aquarium');
    expect(inferInstitutionType('Butterfly Pavilion')).toBe(
      'butterfly-invertebrates',
    );
    expect(inferInstitutionType('Museum of Science')).toBe(
      'museum-science-center',
    );
    expect(inferInstitutionType('San Diego Zoo')).toBe('zoo');
  });

  it('matches institution names without false positives', () => {
    expect(tokensMatch('Dallas Zoo', 'Dallas Zoo')).toBe(true);
    expect(tokensMatch('Dallas World Aquarium', 'Dallas Zoo')).toBe(false);
    expect(
      tokensMatch(
        'Adventure Aquarium',
        'Northeastern Wisconsin NEW Zoo & Adventure Park',
      ),
    ).toBe(false);
  });
});

describe('institutions dataset', () => {
  it('includes accredited-only institutions as non-participating', async () => {
    const institutions = (await import('@/lib/data/institutions.json')).default;
    const sanDiego = institutions.find(
      (institution) => institution.name === 'San Diego Zoo',
    );
    const endangeredWolf = institutions.find(
      (institution) => institution.name === 'Endangered Wolf Center',
    );

    expect(institutions.length).toBeGreaterThanOrEqual(240);
    expect(sanDiego?.reciprocity.participates).toBe(false);
    expect(sanDiego?.website).toMatch(/^https?:\/\//);
    expect(endangeredWolf).toBeTruthy();
  });

  it('stores guest-services contact details without personal names', async () => {
    const institutions = (await import('@/lib/data/institutions.json')).default;
    const columbus = institutions.find(
      (institution) => institution.name === 'Columbus Zoo and Aquarium',
    );
    const lincolnPark = institutions.find(
      (institution) => institution.name === 'Lincoln Park Zoo',
    );

    expect(columbus?.contact).toEqual({
      name: 'Membership and Guest Relations',
      phone: '614-645-3400',
    });
    expect(lincolnPark?.contact).toBeUndefined();
  });

  it('includes location data for distance calculations', async () => {
    const institutions = (await import('@/lib/data/institutions.json')).default;
    const usWithLocation = institutions.filter(
      (institution) =>
        institution.country === 'United States' && institution.location,
    );

    expect(usWithLocation.length).toBeGreaterThan(200);
  });
});
