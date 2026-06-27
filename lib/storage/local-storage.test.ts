import { afterEach, describe, expect, it } from 'vitest';

import { readJson, writeJson } from './local-storage';

describe('local-storage', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('returns fallback when key is missing', () => {
    expect(readJson('missing-key', { count: 0 })).toEqual({ count: 0 });
  });

  it('round-trips JSON values', () => {
    writeJson('test-key', { count: 2 });
    expect(readJson('test-key', { count: 0 })).toEqual({ count: 2 });
  });

  it('returns fallback for invalid JSON', () => {
    window.localStorage.setItem('bad-key', '{not-json');
    expect(readJson('bad-key', ['fallback'])).toEqual(['fallback']);
  });
});
