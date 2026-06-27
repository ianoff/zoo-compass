'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { ReciprocityBadge } from '@/components/institutions/reciprocity-badge';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  lookupZipCentroid,
  normalizeZipCode,
  type ZipCentroidIndex,
} from '@/lib/geo/distance';
import type { DistanceOrigin } from '@/lib/storage/user-settings';
import { formatLocation, type Institution } from '@/lib/types/institution';
import { cn } from '@/lib/utils';

type UserSettingsPanelProps = {
  institutions: Institution[];
  distanceOrigin: DistanceOrigin;
  onDistanceOriginChange: (origin: DistanceOrigin) => void;
  homeFacilityId: string | null;
  onHomeFacilityChange: (institutionId: string | null) => void;
  homeInstitution: Institution | null;
  homeZip: string;
  onHomeZipChange: (zip: string) => void;
  zipIndex: ZipCentroidIndex | null;
  isHydrated: boolean;
};

export function UserSettingsPanel({
  institutions,
  distanceOrigin,
  onDistanceOriginChange,
  homeFacilityId,
  onHomeFacilityChange,
  homeInstitution,
  homeZip,
  onHomeZipChange,
  zipIndex,
  isHydrated,
}: UserSettingsPanelProps) {
  const [homeOpen, setHomeOpen] = useState(false);
  const isMounted = useIsMounted();
  const isHomeSelectorLocked = !isMounted || !isHydrated;

  const sortedInstitutions = useMemo(
    () => [...institutions].sort((a, b) => a.name.localeCompare(b.name)),
    [institutions],
  );

  const normalizedZip = normalizeZipCode(homeZip);
  const zipCentroid =
    normalizedZip && zipIndex
      ? lookupZipCentroid(normalizedZip, zipIndex)
      : null;
  const homeHasLocation = Boolean(homeInstitution?.location);

  const zipError =
    distanceOrigin === 'zip-code' &&
    isHydrated &&
    homeZip.trim().length > 0 &&
    !normalizedZip
      ? 'Enter a valid 5-digit US ZIP code.'
      : distanceOrigin === 'zip-code' &&
          isHydrated &&
          normalizedZip &&
          zipIndex &&
          !zipCentroid
        ? 'ZIP code not found in our lookup table.'
        : null;

  const homeDistanceError =
    distanceOrigin === 'home-zoo' &&
    isHydrated &&
    homeFacilityId &&
    !homeHasLocation
      ? 'Your home facility does not have coordinates for distance calculations.'
      : distanceOrigin === 'home-zoo' && isHydrated && !homeFacilityId
        ? 'Select your home facility to show distances from it.'
        : null;

  return (
    <section className="border-neon-orange/40 overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="space-y-6 p-4 sm:p-5">
        <div className="space-y-3">
          <div>
            <p className="text-foreground font-medium">Your home facility</p>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              Choose where you hold membership. We&apos;ll use AZA&apos;s
              reciprocity chart to show the benefit you can expect at each
              destination.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-2">
            <Popover
              open={isHomeSelectorLocked ? false : homeOpen}
              onOpenChange={(nextOpen) => {
                if (!isHomeSelectorLocked) {
                  setHomeOpen(nextOpen);
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={homeOpen}
                  aria-disabled={isMounted && !isHydrated ? true : undefined}
                  className={cn(
                    'focus-visible:ring-neon-orange/40 w-full justify-between font-normal',
                    isHomeSelectorLocked && 'pointer-events-none opacity-50',
                  )}
                >
                  <span className="truncate text-left">
                    {!isHydrated
                      ? 'Loading saved setting...'
                      : homeInstitution
                        ? homeInstitution.name
                        : 'Select your home facility'}
                  </span>
                  <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Search your home zoo or aquarium..." />
                  <CommandList>
                    <CommandEmpty>No institutions found.</CommandEmpty>
                    <CommandGroup>
                      {sortedInstitutions.map((institution) => (
                        <CommandItem
                          key={institution.id}
                          value={`${institution.name} ${institution.city}`}
                          onSelect={() => {
                            onHomeFacilityChange(institution.id);
                            setHomeOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'size-4',
                              homeFacilityId === institution.id
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate">{institution.name}</p>
                            <p className="text-muted-foreground truncate text-xs">
                              {formatLocation(institution)}
                            </p>
                          </div>
                          <ReciprocityBadge
                            reciprocity={institution.reciprocity}
                            className="hidden sm:inline-flex"
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {isHydrated && homeInstitution ? (
              <div className="flex flex-wrap items-center gap-2">
                <ReciprocityBadge reciprocity={homeInstitution.reciprocity} />
                <span className="text-muted-foreground text-xs">
                  {formatLocation(homeInstitution)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => onHomeFacilityChange(null)}
                >
                  <X />
                  Clear
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 border-t pt-5">
          <div>
            <p className="text-foreground font-medium">Distance from</p>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              Show straight-line distances in the table. Distances are
              approximate — not driving distance.
            </p>
          </div>

          <ToggleGroup
            type="single"
            variant="outline"
            spacing={0}
            className="flex w-full max-w-md"
            value={distanceOrigin}
            onValueChange={(value) => {
              if (value === 'home-zoo' || value === 'zip-code') {
                onDistanceOriginChange(value);
              }
            }}
          >
            <ToggleGroupItem
              value="home-zoo"
              className="data-[state=on]:bg-neon-orange/15 data-[state=on]:text-foreground h-auto flex-1 px-3 py-2 whitespace-normal"
            >
              Home zoo
            </ToggleGroupItem>
            <ToggleGroupItem
              value="zip-code"
              className="data-[state=on]:bg-neon-orange/15 data-[state=on]:text-foreground h-auto flex-1 px-3 py-2 whitespace-normal"
            >
              ZIP code
            </ToggleGroupItem>
          </ToggleGroup>

          {distanceOrigin === 'home-zoo' ? (
            <div className="text-muted-foreground text-sm leading-6">
              {homeDistanceError ? (
                <p className="text-destructive">{homeDistanceError}</p>
              ) : homeInstitution && homeHasLocation ? (
                <p>
                  Showing distances from{' '}
                  <span className="text-foreground font-medium">
                    {homeInstitution.name}
                  </span>
                  .
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex w-full max-w-xs flex-col gap-2">
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="e.g. 90210"
                maxLength={5}
                disabled={!isHydrated}
                value={homeZip}
                onChange={(event) =>
                  onHomeZipChange(
                    event.target.value.replace(/\D/g, '').slice(0, 5),
                  )
                }
                className="focus-visible:ring-neon-orange/40"
              />
              {zipError ? (
                <p className="text-destructive text-sm">{zipError}</p>
              ) : zipCentroid ? (
                <p className="text-muted-foreground text-xs">
                  Showing distances from ZIP {normalizedZip} (US institutions
                  only).
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
