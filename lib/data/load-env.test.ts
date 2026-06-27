import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it } from 'vitest';

import { loadEnvFiles } from '../../scripts/lib/load-env';

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('loadEnvFiles', () => {
  it('loads variables from .env at the project root', () => {
    const root = mkdtempSync(join(tmpdir(), 'zoo-compass-env-'));

    writeFileSync(
      join(root, '.env'),
      '# comment\nNOMINATIM_EMAIL=test@example.com\n',
      'utf8',
    );

    delete process.env.NOMINATIM_EMAIL;
    loadEnvFiles(root);

    expect(process.env.NOMINATIM_EMAIL).toBe('test@example.com');
  });

  it('does not override variables already set in the environment', () => {
    const root = mkdtempSync(join(tmpdir(), 'zoo-compass-env-'));

    writeFileSync(
      join(root, '.env'),
      'NOMINATIM_EMAIL=from-file@example.com\n',
      'utf8',
    );

    process.env.NOMINATIM_EMAIL = 'from-shell@example.com';
    loadEnvFiles(root);

    expect(process.env.NOMINATIM_EMAIL).toBe('from-shell@example.com');
  });
});
