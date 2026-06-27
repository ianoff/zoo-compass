import { describe, expect, it } from 'vitest';

import {
  formatAddress,
  formatLocation,
  type Institution,
} from '@/lib/types/institution';

function institution(partial: Partial<Institution>): Institution {
  return {
    id: 'test',
    name: 'Test Zoo',
    country: 'United States',
    city: '',
    type: 'zoo',
    reciprocity: {
      participates: false,
      label: 'Not participating',
    },
    region: 'West',
    source: 'test',
    ...partial,
  };
}

describe('formatLocation', () => {
  it('formats city and state for reciprocity records', () => {
    expect(
      formatLocation(institution({ city: 'San Diego', state: 'California' })),
    ).toBe('San Diego, California');
  });

  it('formats state only when city is missing', () => {
    expect(formatLocation(institution({ state: 'California', city: '' }))).toBe(
      'California',
    );
  });

  it('formats international accredited-only records', () => {
    expect(
      formatLocation(
        institution({
          country: 'Canada',
          province: 'Quebec',
          city: '',
        }),
      ),
    ).toBe('Quebec, Canada');
  });
});

describe('formatAddress', () => {
  it('joins structured address parts', () => {
    expect(
      formatAddress({
        street: '1 Riverside Drive',
        city: 'Camden',
        state: 'New Jersey',
        postalCode: '08103',
        country: 'US',
      }),
    ).toBe('1 Riverside Drive, Camden, New Jersey, 08103');
  });
});
