import { normalizeName, tokensMatch } from './parse-location.mjs';

export function getMatchableNames(institution) {
  return [institution.name, ...(institution.alternateNames ?? [])];
}

export function findInstitutionForHtmlName(htmlName, institutions, usedIds) {
  const available = institutions.filter(
    (institution) => !usedIds.has(institution.id),
  );
  const normalizedHtml = normalizeName(htmlName);

  const exact = available.find((institution) =>
    getMatchableNames(institution).some(
      (name) => normalizeName(name) === normalizedHtml,
    ),
  );
  if (exact) {
    return exact;
  }

  return (
    available.find((institution) =>
      getMatchableNames(institution).some((name) =>
        tokensMatch(htmlName, name),
      ),
    ) ?? null
  );
}

export function attachWebsites(institutions, htmlEntries) {
  const usedIds = new Set();
  const websiteMatches = [];
  const unmatchedHtmlEntries = [];

  for (const entry of htmlEntries) {
    const match = findInstitutionForHtmlName(entry.name, institutions, usedIds);

    if (!match) {
      unmatchedHtmlEntries.push(entry);
      continue;
    }

    match.website = entry.website;
    usedIds.add(match.id);
    websiteMatches.push({
      htmlName: entry.name,
      institutionName: match.name,
      institutionId: match.id,
      website: entry.website,
    });
  }

  const institutionsWithoutWebsite = institutions
    .filter((institution) => !institution.website)
    .map((institution) => ({
      institutionName: institution.name,
      institutionId: institution.id,
    }));

  return {
    websiteMatchCount: websiteMatches.length,
    websiteMatches,
    unmatchedHtmlEntries,
    institutionsWithoutWebsite,
  };
}
