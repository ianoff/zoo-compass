import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

export const AZA_FIND_A_ZOO_URL = 'https://www.aza.org/find-a-zoo-or-aquarium';

export const AZA_FIND_A_ZOO_CACHE_PATH = join(
  root,
  'data/source/.cache/aza-find-a-zoo.html',
);

export const AZA_FETCH_USER_AGENT =
  'ZooCompass/0.1 (+https://github.com/ianoff/zoo-compass; data maintenance)';

export async function fetchAzaFindAZooHtml() {
  const response = await fetch(AZA_FIND_A_ZOO_URL, {
    headers: {
      'User-Agent': AZA_FETCH_USER_AGENT,
      Accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch AZA Find a Zoo page (${response.status} ${response.statusText})`,
    );
  }

  return response.text();
}

export async function fetchAzaFindAZooToCache({
  cachePath = AZA_FIND_A_ZOO_CACHE_PATH,
} = {}) {
  const html = await fetchAzaFindAZooHtml();
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, html, 'utf8');
  return { html, cachePath };
}
