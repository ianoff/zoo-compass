const jsonCache = new Map<string, unknown>();

export function invalidateJsonCache(key?: string): void {
  if (key === undefined) {
    jsonCache.clear();
    return;
  }

  jsonCache.delete(key);
}

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  if (jsonCache.has(key)) {
    return jsonCache.get(key) as T;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as T;
    jsonCache.set(key, parsed);
    return parsed;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    jsonCache.set(key, value);
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    invalidateJsonCache(key);
    // Ignore quota or serialization errors.
  }
}
