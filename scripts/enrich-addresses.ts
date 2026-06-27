import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import NodeGeocoder from 'node-geocoder';
import pLimit from 'p-limit';

import type { Institution } from '../lib/types/institution';
import { buildGeocodeQuery } from './lib/geocoding/build-geocode-query';
import { hasGeocodedLocation } from './lib/geocoding/has-geocoded-location';
import { listMissingInstitutions } from './lib/geocoding/list-missing-institutions';
import {
  isValidGeocoderResult,
  mapGeocoderResult,
  type GeocoderResult,
} from './lib/geocoding/map-geocoder-result';
import { resolveTimezone } from './lib/geocoding/resolve-timezone';
import { loadEnvFiles } from './lib/load-env';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
loadEnvFiles(root);
const sourcePath = join(root, 'data/source/institutions.json');

const NOMINATIM_DELAY_MS = 1000;

type CliOptions = {
  dryRun: boolean;
  forceId: string | null;
  listMissing: boolean;
  json: boolean;
};

function parseCliArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: false,
    forceId: null,
    listMissing: false,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--list-missing') {
      options.listMissing = true;
      continue;
    }

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    if (arg === '--force') {
      options.forceId = argv[index + 1] ?? null;
      index += 1;
    }
  }

  return options;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

async function loadInstitutions(): Promise<Institution[]> {
  const raw = await fs.readFile(sourcePath, 'utf8');
  return JSON.parse(raw) as Institution[];
}

async function writeInstitutions(institutions: Institution[]): Promise<void> {
  await fs.writeFile(sourcePath, `${JSON.stringify(institutions, null, 2)}\n`);
}

function applyGeocodedFields(
  institution: Institution,
  geocoded: ReturnType<typeof mapGeocoderResult>,
): void {
  institution.address = geocoded.address;
  institution.location = geocoded.location;
  institution.timezone = geocoded.timezone;
  institution.geocodedAt = geocoded.geocodedAt;

  if (!institution.city.trim() && geocoded.address.city) {
    institution.city = geocoded.address.city;
  }
}

async function listMissing(cli: CliOptions): Promise<void> {
  const institutions = await loadInstitutions();
  const missing = listMissingInstitutions(institutions);
  const geocodedCount = institutions.length - missing.length;

  if (cli.json) {
    console.log(JSON.stringify(missing, null, 2));
    return;
  }

  for (const institution of missing) {
    console.log(institution.name);
    console.log(`  id:      ${institution.id}`);
    console.log(`  query:   ${institution.query}`);
    if (institution.website) {
      console.log(`  website: ${institution.website}`);
    }
  }

  console.log(
    `\n${missing.length} missing of ${institutions.length} institutions (${geocodedCount} geocoded)`,
  );
}

async function enrich(cli: CliOptions): Promise<void> {
  const nominatimEmail = process.env.NOMINATIM_EMAIL;

  if (!nominatimEmail && !cli.dryRun) {
    console.warn(
      'Warning: NOMINATIM_EMAIL is not set. Set it to comply with Nominatim usage policy.',
    );
  }

  const geocoder = NodeGeocoder({
    provider: 'openstreetmap',
    ...(nominatimEmail ? { email: nominatimEmail } : {}),
  });

  const limit = pLimit(1);
  const institutions = await loadInstitutions();

  const summary = {
    skipped: 0,
    enriched: 0,
    noResult: 0,
    errors: 0,
  };

  const tasks = institutions.map((institution) =>
    limit(async () => {
      const isGeocoded = hasGeocodedLocation(institution);
      const shouldSkip = isGeocoded && cli.forceId !== institution.id;

      if (shouldSkip) {
        summary.skipped += 1;
        console.log(`Skipping ${institution.name}`);
        return;
      }

      if (cli.forceId && cli.forceId !== institution.id) {
        return;
      }

      const query = buildGeocodeQuery(institution);
      console.log(query);

      if (cli.dryRun) {
        return;
      }

      await sleep(NOMINATIM_DELAY_MS);

      try {
        const results = await geocoder.geocode(query);

        if (!results.length) {
          summary.noResult += 1;
          console.warn(`No result: ${institution.name}`);
          return;
        }

        const result = results[0] as GeocoderResult;

        if (!isValidGeocoderResult(result)) {
          summary.noResult += 1;
          console.warn(`Invalid coordinates: ${institution.name}`);
          return;
        }

        const timezone = resolveTimezone(result.latitude!, result.longitude!);

        applyGeocodedFields(
          institution,
          mapGeocoderResult(result, timezone, todayIsoDate()),
        );

        await writeInstitutions(institutions);
        summary.enriched += 1;
        console.log(`Enriched ${institution.name}`);
      } catch (error) {
        summary.errors += 1;
        console.error(`Error enriching ${institution.name}:`, error);
      }
    }),
  );

  await Promise.all(tasks);

  console.log('\nSummary:');
  console.log(`  Skipped (cached): ${summary.skipped}`);
  console.log(`  Enriched:         ${summary.enriched}`);
  console.log(`  No result:        ${summary.noResult}`);
  console.log(`  Errors:           ${summary.errors}`);
}

async function main(): Promise<void> {
  const cli = parseCliArgs(process.argv.slice(2));

  if (cli.listMissing) {
    await listMissing(cli);
    return;
  }

  await enrich(cli);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
