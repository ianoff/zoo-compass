import {
  Bird,
  Bug,
  Building2,
  Fish,
  PawPrint,
  Trees,
  type LucideIcon,
} from 'lucide-react';

import type { InstitutionType } from '@/lib/types/institution';
import { cn } from '@/lib/utils';

const INSTITUTION_TYPE_ICONS: Record<InstitutionType, LucideIcon> = {
  zoo: PawPrint,
  aquarium: Fish,
  aviary: Bird,
  'butterfly-invertebrates': Bug,
  'museum-science-center': Building2,
  'wildlife-park-nature-center': Trees,
};

type InstitutionTypeIconProps = {
  type: InstitutionType;
  className?: string;
};

export function InstitutionTypeIcon({
  type,
  className,
}: InstitutionTypeIconProps) {
  const Icon = INSTITUTION_TYPE_ICONS[type];
  return <Icon className={cn('size-4 shrink-0', className)} aria-hidden />;
}
