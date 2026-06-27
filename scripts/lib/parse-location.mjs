const US_STATE_ABBREVIATIONS = {
  Ala: 'Alabama',
  Alaska: 'Alaska',
  Ariz: 'Arizona',
  Ark: 'Arkansas',
  Calif: 'California',
  Colo: 'Colorado',
  Conn: 'Connecticut',
  Del: 'Delaware',
  DC: 'DC',
  Fla: 'Florida',
  Ga: 'Georgia',
  Hawaii: 'Hawaii',
  Idaho: 'Idaho',
  Ill: 'Illinois',
  Ind: 'Indiana',
  Iowa: 'Iowa',
  Kan: 'Kansas',
  Ky: 'Kentucky',
  La: 'Louisiana',
  Md: 'Maryland',
  Mass: 'Massachusetts',
  Mich: 'Michigan',
  Minn: 'Minnesota',
  Miss: 'Mississippi',
  Mo: 'Missouri',
  Mont: 'Montana',
  Neb: 'Nebraska',
  Nev: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  Ohio: 'Ohio',
  Okla: 'Oklahoma',
  Ore: 'Oregon',
  Pa: 'Pennsylvania',
  Penn: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  Tenn: 'Tennessee',
  Texas: 'Texas',
  Utah: 'Utah',
  Va: 'Virginia',
  Vt: 'Vermont',
  Wash: 'Washington',
  WVa: 'West Virginia',
  Wis: 'Wisconsin',
  Wyo: 'Wyoming',
  Arkansas: 'Arkansas',
  Kansas: 'Kansas',
  Nebraska: 'Nebraska',
};

const INTERNATIONAL_LOCATIONS = {
  Canada: { country: 'Canada' },
  Mexico: { country: 'Mexico' },
  Colombia: { country: 'Colombia' },
  Bermuda: { country: 'Bermuda' },
  Bahamas: { country: 'Bahamas' },
  Argentina: { country: 'Argentina' },
  Spain: { country: 'Spain' },
  'South Korea': { country: 'South Korea' },
  'Hong Kong': { country: 'Hong Kong' },
  Singapore: { country: 'Singapore' },
  'United Arab Emirates': { country: 'United Arab Emirates' },
  'Abu Dhabi, United Arab Emirates': {
    country: 'United Arab Emirates',
    province: 'Abu Dhabi',
  },
  'Abu Dhabi United Arab Emirates': {
    country: 'United Arab Emirates',
    province: 'Abu Dhabi',
  },
};

const US_REGIONS = {
  Alabama: 'Southeast',
  Alaska: 'West',
  Arizona: 'West',
  Arkansas: 'Southeast',
  California: 'West',
  Colorado: 'West',
  Connecticut: 'Northeast / Mid-Atlantic',
  Delaware: 'Northeast / Mid-Atlantic',
  DC: 'Northeast / Mid-Atlantic',
  Florida: 'Southeast',
  Georgia: 'Southeast',
  Hawaii: 'West',
  Idaho: 'West',
  Illinois: 'Midwest / Great Lakes',
  Indiana: 'Midwest / Great Lakes',
  Iowa: 'Midwest / Great Lakes',
  Kansas: 'Midwest / Great Lakes',
  Kentucky: 'Southeast',
  Louisiana: 'Southeast',
  Maryland: 'Northeast / Mid-Atlantic',
  Massachusetts: 'Northeast / Mid-Atlantic',
  Michigan: 'Midwest / Great Lakes',
  Minnesota: 'Midwest / Great Lakes',
  Mississippi: 'Southeast',
  Missouri: 'Midwest / Great Lakes',
  Montana: 'West',
  Nebraska: 'Midwest / Great Lakes',
  Nevada: 'West',
  'New Hampshire': 'Northeast / Mid-Atlantic',
  'New Jersey': 'Northeast / Mid-Atlantic',
  'New Mexico': 'West',
  'New York': 'Northeast / Mid-Atlantic',
  'North Carolina': 'Southeast',
  'North Dakota': 'Midwest / Great Lakes',
  Ohio: 'Midwest / Great Lakes',
  Oklahoma: 'South Central',
  Oregon: 'West',
  Pennsylvania: 'Northeast / Mid-Atlantic',
  'Rhode Island': 'Northeast / Mid-Atlantic',
  'South Carolina': 'Southeast',
  'South Dakota': 'Midwest / Great Lakes',
  Tennessee: 'Southeast',
  Texas: 'South Central',
  Utah: 'West',
  Virginia: 'Southeast',
  Vermont: 'Northeast / Mid-Atlantic',
  Washington: 'West',
  'West Virginia': 'Southeast',
  Wisconsin: 'Midwest / Great Lakes',
  Wyoming: 'West',
};

export function parseAzaLocation(location) {
  const trimmed = location.trim().replace(/\./g, '');

  if (INTERNATIONAL_LOCATIONS[location.trim()]) {
    return { ...INTERNATIONAL_LOCATIONS[location.trim()] };
  }

  if (INTERNATIONAL_LOCATIONS[trimmed]) {
    return { ...INTERNATIONAL_LOCATIONS[trimmed] };
  }

  const state = US_STATE_ABBREVIATIONS[trimmed];
  if (state) {
    return {
      country: 'United States',
      state,
    };
  }

  throw new Error(`Unknown AZA location: "${location}"`);
}

export function lookupRegion(country, state) {
  if (country === 'United States' && state) {
    return US_REGIONS[state] ?? 'United States';
  }

  return country;
}

export function inferInstitutionType(name) {
  const lower = name.toLowerCase();

  if (
    lower.includes('aquarium') ||
    lower.includes('sea life') ||
    lower.includes('seaworld') ||
    lower.includes('the seas')
  ) {
    return 'aquarium';
  }

  if (lower.includes('aviary')) {
    return 'aviary';
  }

  if (lower.includes('butterfly')) {
    return 'butterfly-invertebrates';
  }

  if (
    lower.includes('museum') ||
    lower.includes('science center') ||
    lower.includes('biodôme') ||
    lower.includes('biodome')
  ) {
    return 'museum-science-center';
  }

  if (
    lower.includes('safari') ||
    lower.includes('wildlife') ||
    lower.includes('nature center') ||
    lower.includes('reptiland')
  ) {
    return 'wildlife-park-nature-center';
  }

  return 'zoo';
}

export function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeName(value) {
  return value
    .toLowerCase()
    .replace(/®/g, '')
    .replace(/\b(the|inc|llc)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'at',
  'of',
  'in',
  'for',
  'zoo',
  'aquarium',
  'park',
  'gardens',
  'botanical',
  'national',
  'center',
  'science',
  'wildlife',
  'safari',
  'society',
  'conservation',
  'museum',
  'inc',
  'llc',
  'new',
  'england',
]);

export function significantTokens(name) {
  return normalizeName(name)
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

export function tokensMatch(azaName, reciprocityName) {
  const azaTokens = significantTokens(azaName);
  const reciprocityTokens = significantTokens(reciprocityName);

  if (azaTokens.length === 0 || reciprocityTokens.length === 0) {
    return normalizeName(azaName) === normalizeName(reciprocityName);
  }

  if (azaTokens.length !== reciprocityTokens.length) {
    return false;
  }

  return azaTokens.every((token) => reciprocityTokens.includes(token));
}
