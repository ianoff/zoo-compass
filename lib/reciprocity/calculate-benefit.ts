import type {
  Institution,
  InstitutionReciprocity,
  ReciprocityTier,
} from '@/lib/types/institution';

export type MemberBenefitKind =
  | '50-discount'
  | 'free-admission'
  | 'other-benefits'
  | 'no-reciprocity'
  | 'home-facility';

export type MemberBenefit = {
  kind: MemberBenefitKind;
  label: string;
  description?: string;
};

export const MEMBER_BENEFIT_LABELS: Record<MemberBenefitKind, string> = {
  '50-discount': '50% discount',
  'free-admission': 'Free admission',
  'other-benefits': 'Other benefits',
  'no-reciprocity': 'No reciprocity',
  'home-facility': 'Membership',
};

function getParticipatingTier(
  reciprocity: InstitutionReciprocity,
): ReciprocityTier | null {
  if (!reciprocity.participates) {
    return null;
  }

  return reciprocity.tier;
}

function calculateFromTiers(
  homeTier: ReciprocityTier,
  visitTier: ReciprocityTier,
): MemberBenefit {
  if (visitTier === 'free') {
    return {
      kind: 'other-benefits',
      label: MEMBER_BENEFIT_LABELS['other-benefits'],
      description: 'Other benefits, such as gift shop discounts',
    };
  }

  if (visitTier === '50') {
    return {
      kind: '50-discount',
      label: MEMBER_BENEFIT_LABELS['50-discount'],
    };
  }

  // visitTier === '100-or-50'
  if (homeTier === '50') {
    return {
      kind: '50-discount',
      label: MEMBER_BENEFIT_LABELS['50-discount'],
    };
  }

  return {
    kind: 'free-admission',
    label: MEMBER_BENEFIT_LABELS['free-admission'],
  };
}

export function calculateMemberBenefit(
  homeInstitution: Institution | null,
  visitInstitution: Institution,
): MemberBenefit | null {
  if (!homeInstitution) {
    return null;
  }

  if (homeInstitution.id === visitInstitution.id) {
    return {
      kind: 'home-facility',
      label: MEMBER_BENEFIT_LABELS['home-facility'],
    };
  }

  const homeTier = getParticipatingTier(homeInstitution.reciprocity);
  if (!homeTier) {
    return {
      kind: 'no-reciprocity',
      label: MEMBER_BENEFIT_LABELS['no-reciprocity'],
      description: 'Your home facility does not participate in AZA reciprocity',
    };
  }

  const visitTier = getParticipatingTier(visitInstitution.reciprocity);
  if (!visitTier) {
    return {
      kind: 'no-reciprocity',
      label: MEMBER_BENEFIT_LABELS['no-reciprocity'],
      description: 'This facility does not participate in AZA reciprocity',
    };
  }

  return calculateFromTiers(homeTier, visitTier);
}
