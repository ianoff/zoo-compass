import { fetchAzaFindAZooToCache } from './lib/fetch-aza-find-a-zoo.mjs';
import { parseAzaHtml } from './lib/parse-aza-html.mjs';

const { html, cachePath } = await fetchAzaFindAZooToCache();
const entries = parseAzaHtml(html);

console.log(`Fetched ${entries.length} AZA directory entries`);
console.log(`Saved cache to ${cachePath}`);
