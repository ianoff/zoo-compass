import { Ban } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  RECIPROCITY_FILTER_LABELS,
  RECIPROCITY_SHORT_LABELS,
  type InstitutionReciprocity,
  type ReciprocityFilterKey,
} from '@/lib/types/institution';
import { cn } from '@/lib/utils';

type ReciprocityBadgeProps = {
  reciprocity: InstitutionReciprocity;
  className?: string;
};

function getReciprocityLabelKey(
  reciprocity: InstitutionReciprocity,
): ReciprocityFilterKey {
  if (!reciprocity.participates) {
    return 'no-reciprocity';
  }

  return reciprocity.tier;
}

function getReciprocityTierClassName(labelKey: ReciprocityFilterKey): string {
  switch (labelKey) {
    case 'free':
      return 'badge-tier-green';
    case '100-or-50':
      return 'badge-tier-lime';
    case '50':
      return 'badge-tier-teal';
    case 'no-reciprocity':
      return 'badge-tier-none';
  }
}

function ReciprocityLabel({ labelKey }: { labelKey: ReciprocityFilterKey }) {
  const fullLabel = RECIPROCITY_FILTER_LABELS[labelKey];
  const shortLabel = RECIPROCITY_SHORT_LABELS[labelKey];

  return (
    <>
      <span className="label-compact">{shortLabel}</span>
      <span className="label-full">{fullLabel}</span>
    </>
  );
}

export function ReciprocityBadge({
  reciprocity,
  className,
}: ReciprocityBadgeProps) {
  const labelKey = getReciprocityLabelKey(reciprocity);
  const fullLabel = RECIPROCITY_FILTER_LABELS[labelKey];
  const tierClassName = getReciprocityTierClassName(labelKey);

  return (
    <Badge
      variant={labelKey === 'no-reciprocity' ? 'outline' : undefined}
      title={fullLabel}
      className={cn(tierClassName, className)}
    >
      {labelKey === 'no-reciprocity' ? <Ban /> : null}
      <ReciprocityLabel labelKey={labelKey} />
    </Badge>
  );
}
