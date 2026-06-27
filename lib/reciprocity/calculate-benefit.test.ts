import { describe, expect, it } from 'vitest';

import { calculateMemberBenefit } from '@/lib/reciprocity/calculate-benefit';
import type { Institution } from '@/lib/types/institution';

function institution(
  id: string,
  reciprocity: Institution['reciprocity'],
): Institution {
  return {
    id,
    name: id,
    country: 'United States',
    city: 'Test City',
    type: 'zoo',
    reciprocity,
    region: 'West',
    source: 'test',
  };
}

const home50 = institution('home-50', {
  participates: true,
  tier: '50',
  label: '50%',
  freeToPublic: false,
});

const home100or50 = institution('home-100', {
  participates: true,
  tier: '100-or-50',
  label: '100% OR 50%',
  freeToPublic: false,
});

const homeFree = institution('home-free', {
  participates: true,
  tier: 'free',
  label: 'FREE TO PUBLIC',
  freeToPublic: true,
});

const homeNone = institution('home-none', {
  participates: false,
  label: 'Not participating',
});

const visit50 = institution('visit-50', {
  participates: true,
  tier: '50',
  label: '50%',
  freeToPublic: false,
});

const visit100or50 = institution('visit-100', {
  participates: true,
  tier: '100-or-50',
  label: '100% OR 50%',
  freeToPublic: false,
});

const visitFree = institution('visit-free', {
  participates: true,
  tier: 'free',
  label: 'FREE TO PUBLIC',
  freeToPublic: true,
});

const visitNone = institution('visit-none', {
  participates: false,
  label: 'Not participating',
});

describe('calculateMemberBenefit', () => {
  it('returns null when no home facility is set', () => {
    expect(calculateMemberBenefit(null, visit50)).toBeNull();
  });

  it('marks the home facility row', () => {
    expect(calculateMemberBenefit(home50, home50)?.kind).toBe('home-facility');
  });

  it('applies the AZA chart for a 50% home facility', () => {
    expect(calculateMemberBenefit(home50, visit50)?.kind).toBe('50-discount');
    expect(calculateMemberBenefit(home50, visit100or50)?.kind).toBe(
      '50-discount',
    );
    expect(calculateMemberBenefit(home50, visitFree)?.kind).toBe(
      'other-benefits',
    );
  });

  it('applies the AZA chart for a 100% or 50% home facility', () => {
    expect(calculateMemberBenefit(home100or50, visit50)?.kind).toBe(
      '50-discount',
    );
    expect(calculateMemberBenefit(home100or50, visit100or50)?.kind).toBe(
      'free-admission',
    );
    expect(calculateMemberBenefit(home100or50, visitFree)?.kind).toBe(
      'other-benefits',
    );
  });

  it('applies the AZA chart for a free-to-public home facility', () => {
    expect(calculateMemberBenefit(homeFree, visit50)?.kind).toBe('50-discount');
    expect(calculateMemberBenefit(homeFree, visit100or50)?.kind).toBe(
      'free-admission',
    );
    expect(calculateMemberBenefit(homeFree, visitFree)?.kind).toBe(
      'other-benefits',
    );
  });

  it('returns no reciprocity for non-participating destinations or homes', () => {
    expect(calculateMemberBenefit(home50, visitNone)?.kind).toBe(
      'no-reciprocity',
    );
    expect(calculateMemberBenefit(homeNone, visit50)?.kind).toBe(
      'no-reciprocity',
    );
  });
});
