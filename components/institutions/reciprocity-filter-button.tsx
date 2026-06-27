import { Ban, Percent, Sparkles, Ticket, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  RECIPROCITY_FILTER_LABELS,
  type ReciprocityFilterKey,
} from '@/lib/types/institution';
import { cn } from '@/lib/utils';

type TierConfig = {
  icon: LucideIcon;
  inactive: string;
  active: string;
  iconInactive: string;
  iconActive: string;
};

const RECIPROCITY_TIER_CONFIG: Record<ReciprocityFilterKey, TierConfig> = {
  '50': {
    icon: Ticket,
    inactive: 'filter-tier-teal-inactive',
    active: 'filter-tier-teal-active',
    iconInactive: 'text-neon-teal',
    iconActive: 'text-white',
  },
  '100-or-50': {
    icon: Percent,
    inactive: 'filter-tier-lime-inactive',
    active: 'filter-tier-lime-active',
    iconInactive: 'text-[#5a7300]',
    iconActive: 'text-[#2f3d00]',
  },
  free: {
    icon: Sparkles,
    inactive: 'filter-tier-green-inactive',
    active: 'filter-tier-green-active',
    iconInactive: 'text-neon-green',
    iconActive: 'text-white',
  },
  'no-reciprocity': {
    icon: Ban,
    inactive: 'filter-tier-none-inactive',
    active: 'filter-tier-none-active',
    iconInactive: 'text-muted-foreground',
    iconActive: 'text-background',
  },
};

type ReciprocityFilterButtonProps = {
  tier: ReciprocityFilterKey;
  isActive: boolean;
  onClick: () => void;
};

export function ReciprocityFilterButton({
  tier,
  isActive,
  onClick,
}: ReciprocityFilterButtonProps) {
  const config = RECIPROCITY_TIER_CONFIG[tier];
  const Icon = config.icon;

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      aria-pressed={isActive}
      className={cn(
        'filter-row-button',
        isActive ? config.active : config.inactive,
      )}
      onClick={onClick}
    >
      <Icon
        className={cn(
          'size-4 shrink-0',
          isActive ? config.iconActive : config.iconInactive,
        )}
        aria-hidden
      />
      <span>{RECIPROCITY_FILTER_LABELS[tier]}</span>
    </Button>
  );
}
