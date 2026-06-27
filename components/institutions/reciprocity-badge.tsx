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

function ReciprocityLabel({ labelKey }: { labelKey: ReciprocityFilterKey }) {
  const fullLabel = RECIPROCITY_FILTER_LABELS[labelKey];
  const shortLabel = RECIPROCITY_SHORT_LABELS[labelKey];

  return (
    <>
      <span className="lg:hidden">{shortLabel}</span>
      <span className="hidden lg:inline">{fullLabel}</span>
    </>
  );
}

export function ReciprocityBadge({
  reciprocity,
  className,
}: ReciprocityBadgeProps) {
  const labelKey = getReciprocityLabelKey(reciprocity);
  const fullLabel = RECIPROCITY_FILTER_LABELS[labelKey];

  if (!reciprocity.participates) {
    return (
      <Badge
        variant="outline"
        title={fullLabel}
        className={cn(
          'border-muted-foreground/30 bg-muted/30 text-muted-foreground',
          className,
        )}
      >
        <Ban />
        <ReciprocityLabel labelKey={labelKey} />
      </Badge>
    );
  }

  if (reciprocity.tier === 'free') {
    return (
      <Badge
        title={fullLabel}
        className={cn(
          'border-[color-mix(in_srgb,var(--neon-green)_35%,white)] bg-[color-mix(in_srgb,var(--neon-green)_18%,white)] text-[#145a0d]',
          className,
        )}
      >
        <ReciprocityLabel labelKey={labelKey} />
      </Badge>
    );
  }

  if (reciprocity.tier === '100-or-50') {
    return (
      <Badge
        title={fullLabel}
        className={cn(
          'border-[color-mix(in_srgb,var(--neon-lime)_45%,white)] bg-[color-mix(in_srgb,var(--neon-lime)_35%,white)] text-[#2f3d00]',
          className,
        )}
      >
        <ReciprocityLabel labelKey={labelKey} />
      </Badge>
    );
  }

  return (
    <Badge
      title={fullLabel}
      className={cn(
        'border-[color-mix(in_srgb,var(--neon-teal)_35%,white)] bg-[color-mix(in_srgb,var(--neon-teal)_18%,white)] text-[#055f5f]',
        className,
      )}
    >
      <ReciprocityLabel labelKey={labelKey} />
    </Badge>
  );
}
