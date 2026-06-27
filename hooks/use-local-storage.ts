'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { readJson, writeJson } from '@/lib/storage/local-storage';

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

function subscribe(onStoreChange: () => void) {
  const listeners = getStorageListeners();
  listeners.add(onStoreChange);

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.storageArea === window.localStorage) {
      onStoreChange();
    }
  };

  window.addEventListener('storage', handleStorageEvent);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = useCallback(
    () => readJson(key, initialValue),
    [key, initialValue],
  );

  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialValue,
  );

  const setStoredValue = (next: T | ((current: T) => T)) => {
    const current = readJson(key, initialValue);
    const resolved =
      typeof next === 'function' ? (next as (current: T) => T)(current) : next;
    writeJson(key, resolved);
    emitStorageChange();
  };

  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return [value, setStoredValue, isHydrated] as const;
}
