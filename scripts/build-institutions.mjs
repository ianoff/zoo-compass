import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AZA_FIND_A_ZOO_CACHE_PATH,
  fetchAzaFindAZooToCache,
} from './lib/fetch-aza-find-a-zoo.mjs';
import { attachWebsites } from './lib/match-institutions.mjs';
import { parseAzaHtml } from './lib/parse-aza-html.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sourcePath = join(root, 'data/source/institutions.json');
const outPath = join(root, 'lib/data/institutions.json');
const reportPath = join(root, 'data/source/match-report.json');

const args = process.argv.slice(2);
const offline = args.includes('--offline');
const refreshAza = args.includes('--refresh-aza');

async function loadAzaHtml() {
  if (refreshAza || !existsSync(AZA_FIND_A_ZOO_CACHE_PATH)) {
    if (offline) {
      throw new Error(
        `AZA HTML cache missing at ${AZA_FIND_A_ZOO_CACHE_PATH}. Run yarn data:fetch-aza or omit --offline.`,
      );
    }

    const { cachePath } = await fetchAzaFindAZooToCache();
    console.log(`Fetched AZA directory HTML to ${cachePath}`);
    return readFileSync(cachePath, 'utf8');
  }

  return readFileSync(AZA_FIND_A_ZOO_CACHE_PATH, 'utf8');
}

async function buildInstitutions() {
  const sourceInstitutions = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const htmlText = await loadAzaHtml();
  const htmlEntries = parseAzaHtml(htmlText);

  const institutions = sourceInstitutions.map((institution) => ({
    ...institution,
  }));

  const reciprocityCount = institutions.filter(
    (institution) => institution.reciprocity.participates,
  ).length;
  const accreditedOnlyCount = institutions.filter(
    (institution) => !institution.reciprocity.participates,
  ).length;

  const websiteReport = attachWebsites(institutions, htmlEntries);

  return {
    institutions,
    report: {
      generatedAt: new Date().toISOString(),
      azaDirectoryUrl: 'https://www.aza.org/find-a-zoo-or-aquarium',
      sourceCount: institutions.length,
      reciprocityCount,
      accreditedOnlyCount,
      totalCount: institutions.length,
      htmlEntryCount: htmlEntries.length,
      websiteMatchCount: websiteReport.websiteMatchCount,
      websiteMatches: websiteReport.websiteMatches,
      unmatchedHtmlEntries: websiteReport.unmatchedHtmlEntries,
      institutionsWithoutWebsite: websiteReport.institutionsWithoutWebsite,
    },
  };
}

const { institutions, report } = await buildInstitutions();

writeFileSync(outPath, `${JSON.stringify(institutions, null, 2)}\n`, 'utf8');
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Wrote ${institutions.length} institutions to ${outPath}`);
console.log(
  `${report.reciprocityCount} reciprocity participants, ${report.accreditedOnlyCount} accredited-only`,
);
console.log(
  `Website matches: ${report.websiteMatchCount}/${report.htmlEntryCount}`,
);
console.log(`Match report: ${reportPath}`);
