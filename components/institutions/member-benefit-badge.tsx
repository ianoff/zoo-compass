import { Ban, Home, Sparkles, Ticket } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  MEMBER_BENEFIT_SHORT_LABELS,
  type MemberBenefit,
} from '@/lib/reciprocity/calculate-benefit';
import { cn } from '@/lib/utils';

type MemberBenefitBadgeProps = {
  benefit: MemberBenefit;
  className?: string;
};

function BenefitLabel({ benefit }: { benefit: MemberBenefit }) {
  const shortLabel = MEMBER_BENEFIT_SHORT_LABELS[benefit.kind];

  return (
    <>
      <span className="lg:hidden">{shortLabel}</span>
      <span className="hidden lg:inline">{benefit.label}</span>
    </>
  );
}

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
        <BenefitLabel benefit={benefit} />
      </Badge>
    );
  }

  if (benefit.kind === 'home-facility') {
    return (
      <Badge
        variant="outline"
        title={benefit.label}
        className={cn(
          'border-[color-mix(in_srgb,var(--neon-orange)_35%,white)] bg-[color-mix(in_srgb,var(--neon-orange)_15%,white)] text-[#7a3e00]',
          className,
        )}
      >
        <Home />
        <BenefitLabel benefit={benefit} />
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
        <BenefitLabel benefit={benefit} />
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
        <BenefitLabel benefit={benefit} />
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
      <BenefitLabel benefit={benefit} />
    </Badge>
  );
}
