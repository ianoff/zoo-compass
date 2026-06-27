import { Ban } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { InstitutionReciprocity } from '@/lib/types/institution';

type ReciprocityBadgeProps = {
  reciprocity: InstitutionReciprocity;
  className?: string;
};

export function ReciprocityBadge({
  reciprocity,
  className,
}: ReciprocityBadgeProps) {
  if (!reciprocity.participates) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'border-muted-foreground/30 bg-muted/30 text-muted-foreground',
          className,
        )}
      >
        <Ban />
        <span className="lg:hidden">None</span>
        <span className="hidden lg:inline">No reciprocity</span>
      </Badge>
    );
  }

  if (reciprocity.tier === 'free') {
    return (
      <Badge
        className={cn(
          'border-[color-mix(in_srgb,var(--neon-green)_35%,white)] bg-[color-mix(in_srgb,var(--neon-green)_18%,white)] text-[#145a0d]',
          className,
        )}
      >
        Free admission
      </Badge>
    );
  }

  if (reciprocity.tier === '100-or-50') {
    return (
      <Badge
        className={cn(
          'border-[color-mix(in_srgb,var(--neon-lime)_45%,white)] bg-[color-mix(in_srgb,var(--neon-lime)_35%,white)] text-[#2f3d00]',
          className,
        )}
      >
        100% or 50%
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        'border-[color-mix(in_srgb,var(--neon-teal)_35%,white)] bg-[color-mix(in_srgb,var(--neon-teal)_18%,white)] text-[#055f5f]',
        className,
      )}
    >
      50% off
    </Badge>
  );
}
