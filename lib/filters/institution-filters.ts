import type {
  Institution,
  InstitutionType,
  ReciprocityFilterKey,
} from '@/lib/types/institution';
import { getReciprocityFilterKey } from '@/lib/types/institution';

export type InstitutionFilters = {
  search: string;
  country: string | null;
  states: string[];
  region: string | null;
  types: InstitutionType[];
  reciprocityTiers: ReciprocityFilterKey[];
  hasNotes: boolean;
  hideNonParticipating: boolean;
};

export const EMPTY_FILTERS: InstitutionFilters = {
  search: '',
  country: null,
  states: [],
  region: null,
  types: [],
  reciprocityTiers: [],
  hasNotes: false,
  hideNonParticipating: false,
};

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export function matchesSearch(
  institution: Institution,
  search: string,
): boolean {
  const query = normalizeSearch(search);
  if (!query) {
    return true;
  }

  const haystack = [
    institution.name,
    institution.city,
    institution.state,
    institution.province,
    institution.country,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

export function matchesCountry(
  institution: Institution,
  country: string | null,
): boolean {
  if (!country) {
    return true;
  }

  return institution.country === country;
}

export function matchesStates(
  institution: Institution,
  states: string[],
): boolean {
  if (states.length === 0) {
    return true;
  }

  return Boolean(institution.state && states.includes(institution.state));
}

export function matchesRegion(
  institution: Institution,
  region: string | null,
): boolean {
  if (!region) {
    return true;
  }

  return institution.region === region;
}

export function matchesTypes(
  institution: Institution,
  types: InstitutionType[],
): boolean {
  if (types.length === 0) {
    return true;
  }

  return types.includes(institution.type);
}

export function matchesReciprocityTiers(
  institution: Institution,
  reciprocityTiers: ReciprocityFilterKey[],
): boolean {
  if (reciprocityTiers.length === 0) {
    return true;
  }

  return reciprocityTiers.includes(
    getReciprocityFilterKey(institution.reciprocity),
  );
}

export function matchesHasNotes(
  institution: Institution,
  hasNotes: boolean,
): boolean {
  if (!hasNotes) {
    return true;
  }

  return (
    institution.reciprocity.participates &&
    Boolean(institution.reciprocity.notes?.trim())
  );
}

export function matchesHideNonParticipating(
  institution: Institution,
  hideNonParticipating: boolean,
): boolean {
  if (!hideNonParticipating) {
    return true;
  }

  return institution.reciprocity.participates;
}

export function filterInstitutions(
  institutions: Institution[],
  filters: InstitutionFilters,
): Institution[] {
  return institutions.filter(
    (institution) =>
      matchesSearch(institution, filters.search) &&
      matchesCountry(institution, filters.country) &&
      matchesStates(institution, filters.states) &&
      matchesRegion(institution, filters.region) &&
      matchesTypes(institution, filters.types) &&
      matchesReciprocityTiers(institution, filters.reciprocityTiers) &&
      matchesHasNotes(institution, filters.hasNotes) &&
      matchesHideNonParticipating(institution, filters.hideNonParticipating),
  );
}

export function getUniqueValues(institutions: Institution[]) {
  const countries = new Set<string>();
  const regions = new Set<string>();
  const states = new Set<string>();
  const types = new Set<InstitutionType>();

  for (const institution of institutions) {
    countries.add(institution.country);
    regions.add(institution.region);
    if (institution.state) {
      states.add(institution.state);
    }
    types.add(institution.type);
  }

  return {
    countries: [...countries].sort(),
    regions: [...regions].sort(),
    states: [...states].sort(),
    types: [...types].sort(),
  };
}

export function getReciprocityCounts(
  institutions: Institution[],
): Record<ReciprocityFilterKey, number> {
  const counts: Record<ReciprocityFilterKey, number> = {
    '50': 0,
    '100-or-50': 0,
    free: 0,
    'no-reciprocity': 0,
  };

  for (const institution of institutions) {
    const key = getReciprocityFilterKey(institution.reciprocity);
    counts[key] += 1;
  }

  return counts;
}

export function getStatesForCountry(
  institutions: Institution[],
  country: string | null,
): string[] {
  if (!country) {
    return [];
  }

  return [
    ...new Set(
      institutions
        .filter((institution) => institution.country === country)
        .map((institution) => institution.state)
        .filter((state): state is string => Boolean(state)),
    ),
  ].sort();
}

export function hasActiveFilters(filters: InstitutionFilters): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.country !== null ||
    filters.states.length > 0 ||
    filters.region !== null ||
    filters.types.length > 0 ||
    filters.reciprocityTiers.length > 0 ||
    filters.hasNotes ||
    filters.hideNonParticipating
  );
}
