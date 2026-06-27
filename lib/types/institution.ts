export type InstitutionType =
  | 'zoo'
  | 'aquarium'
  | 'aviary'
  | 'butterfly-invertebrates'
  | 'museum-science-center'
  | 'wildlife-park-nature-center';

export type ReciprocityTier = '50' | '100-or-50' | 'free';

export type ParticipatingReciprocity = {
  participates: true;
  tier: ReciprocityTier;
  label: string;
  freeToPublic: boolean;
  notes?: string;
};

export type NonParticipatingReciprocity = {
  participates: false;
  label: 'Not participating';
  notes?: string;
};

export type InstitutionReciprocity =
  | ParticipatingReciprocity
  | NonParticipatingReciprocity;

export type InstitutionContact = {
  name?: string;
  email?: string;
  phone?: string;
};

export type InstitutionAddress = {
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
};

export type InstitutionLocation = {
  lat: number;
  lng: number;
};

export type Institution = {
  id: string;
  name: string;
  country: string;
  state?: string;
  province?: string;
  city: string;
  type: InstitutionType;
  reciprocity: InstitutionReciprocity;
  region: string;
  contact?: InstitutionContact;
  source: string;
  website?: string;
  alternateNames?: string[];
  accreditedThrough?: string;
  geocodeQuery?: string;
  address?: InstitutionAddress;
  location?: InstitutionLocation;
  timezone?: string | null;
  geocodedAt?: string;
};

export function hasContactInfo(contact?: InstitutionContact): boolean {
  if (!contact) {
    return false;
  }

  return Boolean(contact.name || contact.email || contact.phone);
}

export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  zoo: 'Zoo',
  aquarium: 'Aquarium',
  aviary: 'Aviary',
  'butterfly-invertebrates': 'Butterfly / Invertebrates',
  'museum-science-center': 'Museum / Science Center',
  'wildlife-park-nature-center': 'Wildlife Park / Nature Center',
};

export type ReciprocityFilterKey = ReciprocityTier | 'no-reciprocity';

export const RECIPROCITY_FILTER_LABELS: Record<ReciprocityFilterKey, string> = {
  '50': '50% off',
  '100-or-50': '100% or 50%',
  free: 'Free admission',
  'no-reciprocity': 'No reciprocity',
};

export const RECIPROCITY_SHORT_LABELS: Record<ReciprocityFilterKey, string> = {
  '50': '50%',
  '100-or-50': '100/50',
  free: 'Free',
  'no-reciprocity': 'None',
};

export function formatLocation(institution: Institution): string {
  const hasCity = institution.city.trim().length > 0;

  if (!hasCity) {
    if (institution.state) {
      return institution.country === 'United States'
        ? institution.state
        : `${institution.state}, ${institution.country}`;
    }

    if (institution.province) {
      return `${institution.province}, ${institution.country}`;
    }

    return institution.country;
  }

  const locality = institution.state
    ? `${institution.city}, ${institution.state}`
    : institution.province
      ? `${institution.city}, ${institution.province}`
      : institution.city;

  if (institution.country === 'United States') {
    return locality;
  }

  return `${locality}, ${institution.country}`;
}

export function formatAddress(address: InstitutionAddress): string | null {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
  ].filter((part): part is string => Boolean(part?.trim()));

  if (parts.length === 0) {
    return null;
  }

  return parts.join(', ');
}

export function getReciprocityFilterKey(
  reciprocity: InstitutionReciprocity,
): ReciprocityFilterKey {
  if (!reciprocity.participates) {
    return 'no-reciprocity';
  }

  return reciprocity.tier;
}
