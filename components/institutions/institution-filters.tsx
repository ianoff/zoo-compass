'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { InstitutionTypeIcon } from '@/components/institutions/institution-type-icon';
import { ReciprocityFilterButton } from '@/components/institutions/reciprocity-filter-button';
import { useIsMounted } from '@/hooks/use-is-mounted';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EMPTY_FILTERS,
  getStatesForCountry,
  getUniqueValues,
  hasActiveFilters,
  type InstitutionFilters,
} from '@/lib/filters/institution-filters';
import {
  INSTITUTION_TYPE_LABELS,
  type Institution,
  type InstitutionType,
  type ReciprocityFilterKey,
} from '@/lib/types/institution';
import { cn } from '@/lib/utils';

type InstitutionFiltersPanelProps = {
  institutions: Institution[];
  filters: InstitutionFilters;
  onChange: (filters: InstitutionFilters) => void;
};

const RECIPROCITY_ORDER: ReciprocityFilterKey[] = [
  '50',
  '100-or-50',
  'free',
  'no-reciprocity',
];

const US_COUNTRY = 'United States';

export function InstitutionFiltersPanel({
  institutions,
  filters,
  onChange,
}: InstitutionFiltersPanelProps) {
  const uniqueValues = useMemo(
    () => getUniqueValues(institutions),
    [institutions],
  );
  const availableStates = useMemo(
    () => getStatesForCountry(institutions, filters.country),
    [institutions, filters.country],
  );

  const updateFilters = (patch: Partial<InstitutionFilters>) => {
    onChange({ ...filters, ...patch });
  };

  const handleCountryChange = (country: string) => {
    updateFilters({
      country: country === 'all' ? null : country,
      states: [],
    });
  };

  const toggleType = (type: InstitutionType) => {
    const next = filters.types.includes(type)
      ? filters.types.filter((value) => value !== type)
      : [...filters.types, type];
    updateFilters({ types: next });
  };

  const toggleState = (state: string) => {
    const next = filters.states.includes(state)
      ? filters.states.filter((value) => value !== state)
      : [...filters.states, state];
    updateFilters({ states: next });
  };

  const toggleReciprocityTier = (tier: ReciprocityFilterKey) => {
    const next = filters.reciprocityTiers.includes(tier)
      ? filters.reciprocityTiers.filter((value) => value !== tier)
      : [...filters.reciprocityTiers, tier];
    updateFilters({ reciprocityTiers: next });
  };

  const hasFilters = hasActiveFilters(filters);

  return (
    <div className="border-neon-teal/40 relative flex w-full min-w-0 flex-col rounded-xl border bg-white p-4 text-[15px] shadow-sm lg:max-h-[calc(100dvh-3rem)]">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          'border-border text-muted-foreground hover:text-foreground absolute top-2 right-3 z-10 h-auto px-2 py-0.5 text-[12px]',
          !hasFilters && 'pointer-events-none invisible',
        )}
        onClick={() => onChange(EMPTY_FILTERS)}
        tabIndex={hasFilters ? 0 : -1}
        aria-hidden={!hasFilters}
      >
        <X />
        Clear
      </Button>

      <p className="text-neon-teal shrink-0 pr-20 text-[13px] font-semibold tracking-[0.18em] uppercase">
        Filters
      </p>

      <div className="mt-4 min-h-0 space-y-4 overflow-y-auto overscroll-contain lg:flex-1 lg:pr-1">
        <InstitutionSearchCombobox
          institutions={institutions}
          value={filters.search}
          onChange={(search) => updateFilters({ search })}
        />

        <Select
          value={filters.country ?? 'all'}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger className="h-auto w-full min-w-0 py-2.5 text-[15px]">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {uniqueValues.countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.region ?? 'all'}
          onValueChange={(region) =>
            updateFilters({ region: region === 'all' ? null : region })
          }
        >
          <SelectTrigger className="h-auto w-full min-w-0 py-2.5 text-[15px]">
            <SelectValue placeholder="All regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {uniqueValues.regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filters.country === US_COUNTRY ? (
          <StateMultiSelect
            disabled={availableStates.length === 0}
            states={availableStates}
            selected={filters.states}
            onToggle={toggleState}
          />
        ) : null}

        <div>
          <p className="text-muted-foreground mb-2 text-[13px] font-medium tracking-wide uppercase">
            Reciprocity
          </p>
          <label className="mb-3 flex cursor-pointer items-center gap-2.5 leading-5.5">
            <Checkbox
              checked={filters.hideNonParticipating}
              onCheckedChange={(checked) =>
                updateFilters({ hideNonParticipating: checked === true })
              }
            />
            Hide zoos with no reciprocity
          </label>
          <div className="flex flex-col gap-1.5">
            {RECIPROCITY_ORDER.map((tier) => (
              <ReciprocityFilterButton
                key={tier}
                tier={tier}
                isActive={filters.reciprocityTiers.includes(tier)}
                onClick={() => toggleReciprocityTier(tier)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-muted-foreground mb-2 text-[13px] font-medium tracking-wide uppercase">
            Institution type
          </p>
          <div className="flex flex-col gap-1.5">
            {uniqueValues.types.map((type) => {
              const isActive = filters.types.includes(type);
              return (
                <Button
                  key={type}
                  type="button"
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  className={cn(
                    'h-auto w-full min-w-0 justify-start gap-2 px-3 py-2 text-left text-[14px] whitespace-normal',
                    isActive &&
                      'bg-neon-teal hover:bg-neon-teal/90 border-neon-teal text-white',
                  )}
                  onClick={() => toggleType(type)}
                >
                  <InstitutionTypeIcon
                    type={type}
                    className={cn(isActive ? 'text-white' : 'text-neon-teal')}
                  />
                  {INSTITUTION_TYPE_LABELS[type]}
                </Button>
              );
            })}
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 leading-5.5">
          <Checkbox
            checked={filters.hasNotes}
            onCheckedChange={(checked) =>
              updateFilters({ hasNotes: checked === true })
            }
          />
          Has restrictions or special notes
        </label>
      </div>
    </div>
  );
}

function InstitutionSearchCombobox({
  institutions,
  value,
  onChange,
}: {
  institutions: Institution[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="focus-visible:ring-neon-teal/40 h-auto w-full min-w-0 justify-between py-2.5 text-[15px] font-normal"
        >
          <span className="truncate text-left">
            {value ? `Search: ${value}` : 'Search by name or city'}
          </span>
          <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput
            placeholder="Search institutions..."
            value={value}
            onValueChange={onChange}
          />
          <CommandList>
            <CommandEmpty>No institutions found.</CommandEmpty>
            <CommandGroup>
              {institutions.map((institution) => (
                <CommandItem
                  key={institution.id}
                  value={`${institution.name} ${institution.city}`}
                  onSelect={() => {
                    onChange(institution.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'size-4',
                      value === institution.name ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div>
                    <p>{institution.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {institution.city}
                      {institution.state ? `, ${institution.state}` : ''}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function StateMultiSelect({
  disabled,
  states,
  selected,
  onToggle,
}: {
  disabled: boolean;
  states: string[];
  selected: string[];
  onToggle: (state: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const isMounted = useIsMounted();
  const isLocked = isMounted && disabled;
  const showLockedStyle = !isMounted || disabled;
  const label =
    selected.length === 0
      ? 'All states'
      : selected.length === 1
        ? selected[0]
        : `${selected.length} states selected`;

  return (
    <Popover
      open={showLockedStyle ? false : open}
      onOpenChange={(nextOpen) => {
        if (!showLockedStyle) {
          setOpen(nextOpen);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-disabled={isLocked ? true : undefined}
          className={cn(
            'h-auto w-full min-w-0 justify-between py-2.5 text-[15px] font-normal',
            showLockedStyle && 'pointer-events-none opacity-50',
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {states.map((state) => (
            <label
              key={state}
              className="hover:bg-muted flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-[15px]"
            >
              <Checkbox
                checked={selected.includes(state)}
                onCheckedChange={() => onToggle(state)}
              />
              {state}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
