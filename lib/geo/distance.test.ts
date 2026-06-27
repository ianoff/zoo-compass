import { describe, expect, it } from 'vitest';

import {
  formatDistance,
  haversineMiles,
  lookupZipCentroid,
  normalizeZipCode,
  distanceBetweenPoints,
} from '@/lib/geo/distance';

describe('normalizeZipCode', () => {
  it('accepts 5-digit zip codes', () => {
    expect(normalizeZipCode('90210')).toBe('90210');
    expect(normalizeZipCode('9021')).toBeNull();
    expect(normalizeZipCode('902101')).toBeNull();
  });
});

describe('lookupZipCentroid', () => {
  const index = {
    '90210': [34.100517, -118.41463] as [number, number],
  };

  it('finds a known zip in the index', () => {
    expect(lookupZipCentroid('90210', index)).toEqual([34.100517, -118.41463]);
  });

  it('returns null for unknown zip codes', () => {
    expect(lookupZipCentroid('00000', index)).toBeNull();
  });
});

describe('haversineMiles', () => {
  it('returns zero for identical points', () => {
    expect(haversineMiles(41.8781, -87.6298, 41.8781, -87.6298)).toBe(0);
  });

  it('calculates a reasonable Chicago to Milwaukee distance', () => {
    const miles = haversineMiles(41.8781, -87.6298, 43.0389, -87.9065);
    expect(miles).toBeGreaterThan(80);
    expect(miles).toBeLessThan(95);
  });
});

describe('formatDistance', () => {
  it('formats sub-mile distances', () => {
    expect(formatDistance(0.4)).toBe('< 1 mi');
  });

  it('formats short and long distances', () => {
    expect(formatDistance(4.56)).toBe('4.6 mi');
    expect(formatDistance(142.2)).toBe('142 mi');
  });
});

describe('distanceBetweenPoints', () => {
  it('accepts tuple and object origins', () => {
    const location = { lat: 43.0389, lng: -87.9065 };
    const fromTuple = distanceBetweenPoints([41.8781, -87.6298], location);
    const fromObject = distanceBetweenPoints(
      { lat: 41.8781, lng: -87.6298 },
      location,
    );

    expect(fromTuple).toBe(fromObject);
    expect(fromTuple).toBeGreaterThan(80);
    expect(fromTuple).toBeLessThan(95);
  });
});
