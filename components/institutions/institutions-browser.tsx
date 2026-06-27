'use client';

import { useEffect, useMemo, useState } from 'react';

import { InstitutionFiltersPanel } from '@/components/institutions/institution-filters';
import { InstitutionsTable } from '@/components/institutions/institutions-table';
import { UserSettingsPanel } from '@/components/institutions/user-settings-panel';
import { useLocalStorage } from '@/hooks/use-local-storage';
import institutionsData from '@/lib/data/institutions.json';
import {
  lookupZipCentroid,
  normalizeZipCode,
  type ZipCentroidIndex,
} from '@/lib/geo/distance';
import {
  EMPTY_FILTERS,
  filterInstitutions,
  type InstitutionFilters,
} from '@/lib/filters/institution-filters';
import {
  DEFAULT_DISTANCE_ORIGIN,
  DISTANCE_ORIGIN_KEY,
  HOME_FACILITY_STORAGE_KEY,
  HOME_ZIP_STORAGE_KEY,
  migrateLegacyDistanceOrigin,
  type DistanceOrigin,
} from '@/lib/storage/user-settings';
import type { Institution } from '@/lib/types/institution';

const institutions = institutionsData as Institution[];

export function InstitutionsBrowser() {
  const [filters, setFilters] = useState<InstitutionFilters>(EMPTY_FILTERS);
  const [distanceOrigin, setDistanceOrigin, isDistanceOriginHydrated] =
    useLocalStorage<DistanceOrigin>(
      DISTANCE_ORIGIN_KEY,
      DEFAULT_DISTANCE_ORIGIN,
    );
  const [homeFacilityId, setHomeFacilityId, isHomeFacilityHydrated] =
    useLocalStorage<string | null>(HOME_FACILITY_STORAGE_KEY, null);
  const [homeZip, setHomeZip, isHomeZipHydrated] = useLocalStorage<string>(
    HOME_ZIP_STORAGE_KEY,
    '',
  );
  const [zipIndex, setZipIndex] = useState<ZipCentroidIndex | null>(null);

  const isHydrated =
    isDistanceOriginHydrated && isHomeFacilityHydrated && isHomeZipHydrated;

  useEffect(() => {
    if (!isDistanceOriginHydrated) {
      return;
    }

    const migrated = migrateLegacyDistanceOrigin();
    if (migrated) {
      setDistanceOrigin(migrated);
    }
  }, [isDistanceOriginHydrated, setDistanceOrigin]);

  useEffect(() => {
    if (distanceOrigin !== 'zip-code') {
      return;
    }

    let cancelled = false;

    import('@/lib/data/us-zip-centroids.json')
      .then((module) => {
        if (!cancelled) {
          setZipIndex(module.default as ZipCentroidIndex);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setZipIndex(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [distanceOrigin]);

  const homeInstitution = useMemo(
    () =>
      homeFacilityId
        ? (institutions.find(
            (institution) => institution.id === homeFacilityId,
          ) ?? null)
        : null,
    [homeFacilityId],
  );

  const normalizedZip = normalizeZipCode(homeZip);
  const zipCentroid = useMemo(() => {
    if (!normalizedZip || !zipIndex) {
      return null;
    }

    return lookupZipCentroid(normalizedZip, zipIndex);
  }, [normalizedZip, zipIndex]);

  const distanceOriginPoint = useMemo((): [number, number] | null => {
    if (distanceOrigin === 'home-zoo') {
      if (!homeInstitution?.location) {
        return null;
      }

      return [homeInstitution.location.lat, homeInstitution.location.lng];
    }

    return zipCentroid;
  }, [distanceOrigin, homeInstitution, zipCentroid]);

  const filteredInstitutions = useMemo(
    () => filterInstitutions(institutions, filters),
    [filters],
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <aside className="w-full min-w-0 shrink-0 lg:sticky lg:top-6 lg:w-72 lg:self-start">
        <InstitutionFiltersPanel
          institutions={institutions}
          filters={filters}
          onChange={setFilters}
        />
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <UserSettingsPanel
          institutions={institutions}
          distanceOrigin={distanceOrigin}
          onDistanceOriginChange={setDistanceOrigin}
          homeFacilityId={homeFacilityId}
          onHomeFacilityChange={setHomeFacilityId}
          homeInstitution={homeInstitution}
          homeZip={homeZip}
          onHomeZipChange={setHomeZip}
          zipIndex={zipIndex}
          isHydrated={isHydrated}
        />
        <InstitutionsTable
          institutions={filteredInstitutions}
          totalCount={institutions.length}
          homeInstitution={homeInstitution}
          distanceOrigin={distanceOrigin}
          distanceOriginPoint={distanceOriginPoint}
        />
      </div>
    </div>
  );
}
