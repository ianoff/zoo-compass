import { describe, expect, it } from 'vitest';

import {
  EMPTY_FILTERS,
  filterInstitutions,
  getReciprocityCounts,
  getStatesForCountry,
  hasActiveFilters,
  matchesHasNotes,
  matchesReciprocityTiers,
  matchesSearch,
} from '@/lib/filters/institution-filters';
import type { Institution } from '@/lib/types/institution';

const participating: Institution = {
  id: 'test-1',
  name: 'John G. Shedd Aquarium',
  country: 'United States',
  state: 'Illinois',
  city: 'Chicago',
  type: 'aquarium',
  reciprocity: {
    participates: true,
    tier: '50',
    label: '50%',
    freeToPublic: false,
    notes: 'Limit 2 noted in PDF',
  },
  region: 'Midwest / Great Lakes',
  source: 'test',
  contact: { name: 'Member Services' },
};

const nonParticipating: Institution = {
  id: 'test-2',
  name: 'Brookfield Zoo Chicago',
  country: 'United States',
  state: 'Illinois',
  city: 'Brookfield',
  type: 'zoo',
  reciprocity: {
    participates: false,
    label: 'Not participating',
    notes: 'Not participating in AZA reciprocity',
  },
  region: 'Midwest / Great Lakes',
  source: 'test',
};

const freeAdmission: Institution = {
  id: 'test-3',
  name: 'Lincoln Park Zoo',
  country: 'United States',
  state: 'Illinois',
  city: 'Chicago',
  type: 'zoo',
  reciprocity: {
    participates: true,
    tier: 'free',
    label: 'FREE TO PUBLIC',
    freeToPublic: true,
  },
  region: 'Midwest / Great Lakes',
  source: 'test',
};

const institutions = [participating, nonParticipating, freeAdmission];

describe('institution filters', () => {
  it('matches institution name and city in search', () => {
    expect(matchesSearch(participating, 'shedd')).toBe(true);
    expect(matchesSearch(participating, 'chicago')).toBe(true);
    expect(matchesSearch(participating, 'miami')).toBe(false);
  });

  it('filters by country and cascades state options', () => {
    const filtered = filterInstitutions(institutions, {
      ...EMPTY_FILTERS,
      country: 'United States',
      states: ['Illinois'],
    });

    expect(filtered).toHaveLength(3);
    expect(getStatesForCountry(institutions, 'United States')).toEqual([
      'Illinois',
    ]);
    expect(getStatesForCountry(institutions, 'Canada')).toEqual([]);
  });

  it('filters reciprocity tiers including non-participating', () => {
    expect(matchesReciprocityTiers(nonParticipating, ['no-reciprocity'])).toBe(
      true,
    );
    expect(matchesReciprocityTiers(participating, ['no-reciprocity'])).toBe(
      false,
    );

    const filtered = filterInstitutions(institutions, {
      ...EMPTY_FILTERS,
      reciprocityTiers: ['no-reciprocity'],
    });

    expect(filtered).toEqual([nonParticipating]);
  });

  it('combines filters with AND semantics', () => {
    const filtered = filterInstitutions(institutions, {
      ...EMPTY_FILTERS,
      country: 'United States',
      reciprocityTiers: ['50'],
      search: 'shedd',
    });

    expect(filtered).toEqual([participating]);
  });

  it('only treats participating notes as restrictions', () => {
    expect(matchesHasNotes(participating, true)).toBe(true);
    expect(matchesHasNotes(nonParticipating, true)).toBe(false);
    expect(matchesHasNotes(freeAdmission, true)).toBe(false);
  });

  it('counts reciprocity tiers', () => {
    expect(getReciprocityCounts(institutions)).toEqual({
      '50': 1,
      '100-or-50': 0,
      free: 1,
      'no-reciprocity': 1,
    });
  });

  it('detects active filters', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(
      hasActiveFilters({
        ...EMPTY_FILTERS,
        reciprocityTiers: ['free'],
      }),
    ).toBe(true);
    expect(
      hasActiveFilters({
        ...EMPTY_FILTERS,
        hideNonParticipating: true,
      }),
    ).toBe(true);
  });

  it('hides non-participating institutions when enabled', () => {
    const filtered = filterInstitutions(institutions, {
      ...EMPTY_FILTERS,
      hideNonParticipating: true,
    });

    expect(filtered).toEqual([participating, freeAdmission]);
  });
});
