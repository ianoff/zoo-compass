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
      <span className="label-compact">{shortLabel}</span>
      <span className="label-full">{benefit.label}</span>
    </>
  );
}

function getBenefitTierClassName(benefit: MemberBenefit): string {
  switch (benefit.kind) {
    case 'no-reciprocity':
      return 'badge-tier-none';
    case 'home-facility':
      return 'badge-tier-orange';
    case 'free-admission':
      return 'badge-tier-lime';
    case 'other-benefits':
      return 'badge-tier-green';
    case '50-discount':
      return 'badge-tier-teal';
  }
}

function getBenefitIcon(benefit: MemberBenefit) {
  switch (benefit.kind) {
    case 'no-reciprocity':
      return Ban;
    case 'home-facility':
      return Home;
    case 'other-benefits':
      return Sparkles;
    case 'free-admission':
    case '50-discount':
      return Ticket;
  }
}

export function MemberBenefitBadge({
  benefit,
  className,
}: MemberBenefitBadgeProps) {
  const Icon = getBenefitIcon(benefit);
  const tierClassName = getBenefitTierClassName(benefit);
  const title =
    benefit.kind === 'home-facility' ? benefit.label : benefit.description;

  return (
    <Badge
      variant={benefit.kind === 'no-reciprocity' ? 'outline' : undefined}
      title={title}
      className={cn(tierClassName, className)}
    >
      <Icon />
      <BenefitLabel benefit={benefit} />
    </Badge>
  );
}
