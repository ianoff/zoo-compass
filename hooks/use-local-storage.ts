'use client';

import { useCallback, useLayoutEffect, useState } from 'react';

import {
  invalidateJsonCache,
  readJson,
  writeJson,
} from '@/lib/storage/local-storage';

const STORAGE_LISTENERS_KEY = '__zooCompassStorageListeners__';

type ListenerSet = Set<() => void>;

function getStorageListeners(): ListenerSet {
  const globalStore = globalThis as typeof globalThis & {
    [STORAGE_LISTENERS_KEY]?: ListenerSet;
  };

  if (!globalStore[STORAGE_LISTENERS_KEY]) {
    globalStore[STORAGE_LISTENERS_KEY] = new Set();
  }

  return globalStore[STORAGE_LISTENERS_KEY];
}

function emitStorageChange() {
  for (const listener of getStorageListeners()) {
    listener();
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useLayoutEffect(() => {
    setValue(readJson(key, initialValue));
    setIsHydrated(true);

    const onStoreChange = () => {
      setValue(readJson(key, initialValue));
    };

    const listeners = getStorageListeners();
    listeners.add(onStoreChange);

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) {
        return;
      }

      if (event.key) {
        invalidateJsonCache(event.key);
      } else {
        invalidateJsonCache();
      }

      onStoreChange();
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      listeners.delete(onStoreChange);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key, initialValue]);

  const setStoredValue = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved =
          typeof next === 'function'
            ? (next as (current: T) => T)(current)
            : next;
        writeJson(key, resolved);
        emitStorageChange();
        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue, isHydrated] as const;
}
