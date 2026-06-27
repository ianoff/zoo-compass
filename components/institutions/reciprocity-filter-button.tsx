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
    inactive:
      'border-[color-mix(in_srgb,var(--neon-teal)_35%,white)] bg-[color-mix(in_srgb,var(--neon-teal)_10%,white)] text-[#055f5f] hover:bg-[color-mix(in_srgb,var(--neon-teal)_18%,white)]',
    active: 'border-neon-teal bg-neon-teal hover:bg-neon-teal/90 text-white',
    iconInactive: 'text-neon-teal',
    iconActive: 'text-white',
  },
  '100-or-50': {
    icon: Percent,
    inactive:
      'border-[color-mix(in_srgb,var(--neon-lime)_45%,white)] bg-[color-mix(in_srgb,var(--neon-lime)_20%,white)] text-[#2f3d00] hover:bg-[color-mix(in_srgb,var(--neon-lime)_30%,white)]',
    active:
      'border-neon-lime bg-neon-lime hover:bg-neon-lime/90 text-[#2f3d00]',
    iconInactive: 'text-[#5a7300]',
    iconActive: 'text-[#2f3d00]',
  },
  free: {
    icon: Sparkles,
    inactive:
      'border-[color-mix(in_srgb,var(--neon-green)_35%,white)] bg-[color-mix(in_srgb,var(--neon-green)_12%,white)] text-[#145a0d] hover:bg-[color-mix(in_srgb,var(--neon-green)_20%,white)]',
    active: 'border-neon-green bg-neon-green hover:bg-neon-green/90 text-white',
    iconInactive: 'text-neon-green',
    iconActive: 'text-white',
  },
  'no-reciprocity': {
    icon: Ban,
    inactive:
      'border-muted-foreground/30 bg-muted/30 text-muted-foreground hover:bg-muted/50',
    active:
      'border-muted-foreground/50 bg-muted-foreground text-background hover:bg-muted-foreground/90',
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
        'h-auto w-full min-w-0 justify-start gap-2 px-3 py-2 text-left text-[15px] whitespace-normal',
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
