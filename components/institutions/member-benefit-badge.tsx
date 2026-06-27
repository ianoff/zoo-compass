import { Ban, Home, Sparkles, Ticket } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { MemberBenefit } from '@/lib/reciprocity/calculate-benefit';
import { cn } from '@/lib/utils';

type MemberBenefitBadgeProps = {
  benefit: MemberBenefit;
  className?: string;
};

export function MemberBenefitBadge({
  benefit,
  className,
}: MemberBenefitBadgeProps) {
  if (benefit.kind === 'no-reciprocity') {
    return (
      <Badge
        variant="outline"
        title={benefit.description}
        className={cn(
          'border-muted-foreground/30 bg-muted/30 text-muted-foreground',
          className,
        )}
      >
        <Ban />
        {benefit.label}
      </Badge>
    );
  }

  if (benefit.kind === 'home-facility') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'border-[color-mix(in_srgb,var(--neon-orange)_35%,white)] bg-[color-mix(in_srgb,var(--neon-orange)_15%,white)] text-[#7a3e00]',
          className,
        )}
      >
        <Home />
        {benefit.label}
      </Badge>
    );
  }

  if (benefit.kind === 'free-admission') {
    return (
      <Badge
        title={benefit.description}
        className={cn(
          'border-[color-mix(in_srgb,var(--neon-lime)_45%,white)] bg-[color-mix(in_srgb,var(--neon-lime)_35%,white)] text-[#2f3d00]',
          className,
        )}
      >
        <Ticket />
        {benefit.label}
      </Badge>
    );
  }

  if (benefit.kind === 'other-benefits') {
    return (
      <Badge
        title={benefit.description}
        className={cn(
          'border-[color-mix(in_srgb,var(--neon-green)_35%,white)] bg-[color-mix(in_srgb,var(--neon-green)_18%,white)] text-[#145a0d]',
          className,
        )}
      >
        <Sparkles />
        {benefit.label}
      </Badge>
    );
  }

  return (
    <Badge
      title={benefit.description}
      className={cn(
        'border-[color-mix(in_srgb,var(--neon-teal)_35%,white)] bg-[color-mix(in_srgb,var(--neon-teal)_18%,white)] text-[#055f5f]',
        className,
      )}
    >
      <Ticket />
      {benefit.label}
    </Badge>
  );
}
