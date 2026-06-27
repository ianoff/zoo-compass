import { distanceBetweenPoints } from '@/lib/geo/distance';
import type { MemberBenefitKind } from '@/lib/reciprocity/calculate-benefit';
import type { DistanceOrigin } from '@/lib/storage/user-settings';
import {
  INSTITUTION_TYPE_LABELS,
  type Institution,
  type InstitutionReciprocity,
  type InstitutionType,
} from '@/lib/types/institution';

const RECIPROCITY_TIER_RANK: Record<string, number> = {
  free: 0,
  '100-or-50': 1,
  '50': 2,
  'no-reciprocity': 3,
};

const MEMBER_BENEFIT_RANK: Record<MemberBenefitKind, number> = {
  'free-admission': 0,
  'other-benefits': 1,
  '50-discount': 2,
  'home-facility': 3,
  'no-reciprocity': 4,
};

export function getReciprocitySortRank(
  reciprocity: InstitutionReciprocity,
): number {
  if (!reciprocity.participates) {
    return RECIPROCITY_TIER_RANK['no-reciprocity'];
  }

  return RECIPROCITY_TIER_RANK[reciprocity.tier] ?? RECIPROCITY_TIER_RANK['50'];
}

export function getMemberBenefitSortRank(kind: MemberBenefitKind): number {
  return MEMBER_BENEFIT_RANK[kind];
}

export function getInstitutionTypeSortLabel(type: InstitutionType): string {
  return INSTITUTION_TYPE_LABELS[type];
}

export function compareNullableNumbers(
  left: number | null,
  right: number | null,
): number {
  const leftValue = left ?? Number.POSITIVE_INFINITY;
  const rightValue = right ?? Number.POSITIVE_INFINITY;

  if (leftValue !== rightValue) {
    return leftValue - rightValue;
  }

  return 0;
}

export function compareNullableStrings(
  left: string | null | undefined,
  right: string | null | undefined,
): number {
  const leftEmpty = !left?.trim();
  const rightEmpty = !right?.trim();

  if (leftEmpty && rightEmpty) {
    return 0;
  }

  if (leftEmpty) {
    return 1;
  }

  if (rightEmpty) {
    return -1;
  }

  return left!.localeCompare(right!);
}

export function getInstitutionDistanceMiles(
  institution: Institution,
  distanceOrigin: DistanceOrigin,
  originPoint: [number, number] | null,
): number | null {
  if (!originPoint || !institution.location) {
    return null;
  }

  if (
    distanceOrigin === 'zip-code' &&
    institution.country !== 'United States'
  ) {
    return null;
  }

  return distanceBetweenPoints(originPoint, institution.location);
}
