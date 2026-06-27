import { describe, expect, it } from 'vitest';

import {
  compareNullableNumbers,
  compareNullableStrings,
  getInstitutionDistanceMiles,
  getMemberBenefitSortRank,
  getReciprocitySortRank,
} from '@/lib/institutions/table-sort';
import type { Institution } from '@/lib/types/institution';

describe('getReciprocitySortRank', () => {
  it('orders tiers from best to worst', () => {
    const free = getReciprocitySortRank({
      participates: true,
      tier: 'free',
      label: 'FREE TO PUBLIC',
      freeToPublic: true,
    });
    const hundredOrFifty = getReciprocitySortRank({
      participates: true,
      tier: '100-or-50',
      label: '100% OR 50%',
      freeToPublic: false,
    });
    const fifty = getReciprocitySortRank({
      participates: true,
      tier: '50',
      label: '50%',
      freeToPublic: false,
    });
    const none = getReciprocitySortRank({
      participates: false,
      label: 'Not participating',
    });

    expect(free).toBeLessThan(hundredOrFifty);
    expect(hundredOrFifty).toBeLessThan(fifty);
    expect(fifty).toBeLessThan(none);
  });
});

describe('getMemberBenefitSortRank', () => {
  it('orders benefits from best to worst', () => {
    expect(getMemberBenefitSortRank('free-admission')).toBeLessThan(
      getMemberBenefitSortRank('other-benefits'),
    );
    expect(getMemberBenefitSortRank('other-benefits')).toBeLessThan(
      getMemberBenefitSortRank('50-discount'),
    );
    expect(getMemberBenefitSortRank('50-discount')).toBeLessThan(
      getMemberBenefitSortRank('home-facility'),
    );
    expect(getMemberBenefitSortRank('home-facility')).toBeLessThan(
      getMemberBenefitSortRank('no-reciprocity'),
    );
  });
});

describe('compareNullableNumbers', () => {
  it('sorts null values last', () => {
    expect(compareNullableNumbers(1, null)).toBeLessThan(0);
    expect(compareNullableNumbers(null, 1)).toBeGreaterThan(0);
    expect(compareNullableNumbers(null, null)).toBe(0);
  });
});

describe('compareNullableStrings', () => {
  it('sorts empty values last', () => {
    expect(compareNullableStrings('a', '')).toBeLessThan(0);
    expect(compareNullableStrings('', 'a')).toBeGreaterThan(0);
    expect(compareNullableStrings('', '')).toBe(0);
  });
});

describe('getInstitutionDistanceMiles', () => {
  const origin: [number, number] = [41.8781, -87.6298];
  const usInstitution = {
    country: 'United States',
    location: { lat: 43.0389, lng: -87.9065 },
  } as Institution;
  const intlInstitution = {
    country: 'Canada',
    location: { lat: 43.6532, lng: -79.3832 },
  } as Institution;

  it('returns miles for US institutions when using ZIP origin', () => {
    const miles = getInstitutionDistanceMiles(
      usInstitution,
      'zip-code',
      origin,
    );

    expect(miles).not.toBeNull();
    expect(miles!).toBeGreaterThan(80);
  });

  it('returns null for non-US institutions when using ZIP origin', () => {
    expect(
      getInstitutionDistanceMiles(intlInstitution, 'zip-code', origin),
    ).toBeNull();
  });

  it('returns miles for international institutions when using home origin', () => {
    expect(
      getInstitutionDistanceMiles(intlInstitution, 'home-zoo', origin),
    ).not.toBeNull();
  });
});
