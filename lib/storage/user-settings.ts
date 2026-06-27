import { invalidateJsonCache } from '@/lib/storage/local-storage';

export const LEGACY_SETTINGS_MODE_KEY = 'zoo-compass:settings-mode';
export const DISTANCE_ORIGIN_KEY = 'zoo-compass:distance-origin';
export const HOME_FACILITY_STORAGE_KEY = 'zoo-compass:home-facility-id';
export const HOME_ZIP_STORAGE_KEY = 'zoo-compass:home-zip-code';

export type DistanceOrigin = 'home-zoo' | 'zip-code';

export const DEFAULT_DISTANCE_ORIGIN: DistanceOrigin = 'zip-code';

/** @deprecated Migrated to DistanceOrigin */
export type SettingsMode = 'home-facility' | 'zip-distance';

export function parseLegacySettingsMode(value: unknown): SettingsMode | null {
  if (value === 'home-facility' || value === 'zip-distance') {
    return value;
  }

  return null;
}

export function legacySettingsModeToDistanceOrigin(
  mode: SettingsMode,
): DistanceOrigin {
  return mode === 'zip-distance' ? 'zip-code' : 'home-zoo';
}

export function migrateLegacyDistanceOrigin(): DistanceOrigin | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(LEGACY_SETTINGS_MODE_KEY);
  if (raw === null) {
    return null;
  }

  let legacy: SettingsMode | null = null;

  try {
    legacy = parseLegacySettingsMode(JSON.parse(raw));
  } catch {
    legacy = parseLegacySettingsMode(raw);
  }

  window.localStorage.removeItem(LEGACY_SETTINGS_MODE_KEY);
  invalidateJsonCache(LEGACY_SETTINGS_MODE_KEY);

  if (!legacy) {
    return null;
  }

  return legacySettingsModeToDistanceOrigin(legacy);
}
