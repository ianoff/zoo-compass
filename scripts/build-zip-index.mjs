import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const csvPath = join(root, 'data/source/us-zip-centroids.csv');
const outPath = join(root, 'lib/data/us-zip-centroids.json');

function normalizeZip(value) {
  return value.trim().padStart(5, '0');
}

function buildZipIndex() {
  const csvText = readFileSync(csvPath, 'utf8');
  const lines = csvText.trim().split('\n').slice(1);
  const index = {};

  for (const line of lines) {
    const [zip, latitude, longitude] = line.split(',');
    if (!zip || !latitude || !longitude) {
      continue;
    }

    const normalizedZip = normalizeZip(zip);
    index[normalizedZip] = [
      Number.parseFloat(latitude),
      Number.parseFloat(longitude),
    ];
  }

  return index;
}

const index = buildZipIndex();

writeFileSync(outPath, `${JSON.stringify(index)}\n`, 'utf8');

console.log(`Wrote ${Object.keys(index).length} zip centroids to ${outPath}`);
