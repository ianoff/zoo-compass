import { describe, expect, it } from 'vitest';

import {
  findInstitutionForHtmlName,
  getMatchableNames,
} from '../../scripts/lib/match-institutions.mjs';

describe('getMatchableNames', () => {
  it('includes primary name and alternate names', () => {
    expect(
      getMatchableNames({
        name: 'Smithsonian National Zoological Park',
        alternateNames: [
          "Smithsonian's National Zoo and Conservation Biology Institute",
        ],
      }),
    ).toEqual([
      'Smithsonian National Zoological Park',
      "Smithsonian's National Zoo and Conservation Biology Institute",
    ]);
  });
});

describe('findInstitutionForHtmlName', () => {
  const institutions = [
    {
      id: 'smithsonian',
      name: 'Smithsonian National Zoological Park',
      alternateNames: [
        "Smithsonian's National Zoo and Conservation Biology Institute",
      ],
    },
    {
      id: 'phoenix',
      name: 'Phoenix Zoo',
      alternateNames: ['The Phoenix Zoo'],
    },
    {
      id: 'dallas',
      name: 'Dallas Zoo',
    },
  ];

  it('matches HTML entries against alternate names', () => {
    expect(
      findInstitutionForHtmlName(
        "Smithsonian's National Zoo and Conservation Biology Institute",
        institutions,
        new Set(),
      )?.id,
    ).toBe('smithsonian');
  });

  it('matches HTML entries against the primary name', () => {
    expect(
      findInstitutionForHtmlName('Phoenix Zoo', institutions, new Set())?.id,
    ).toBe('phoenix');
  });

  it('does not reuse institutions already matched', () => {
    const usedIds = new Set(['phoenix']);

    expect(
      findInstitutionForHtmlName('The Phoenix Zoo', institutions, usedIds),
    ).toBeNull();
  });

  it('falls back to token matching on the primary name', () => {
    expect(
      findInstitutionForHtmlName('Dallas Zoo', institutions, new Set())?.id,
    ).toBe('dallas');
  });
});
