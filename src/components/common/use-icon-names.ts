"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * The searchable list of React Icons names, fetched on demand.
 *
 * Roughly 50,000 names is ~800KB of strings. That is cheap next to importing the
 * packs to call `Object.keys` on them, but still not worth loading for visitors
 * who never open a picker, so the fetch waits until one is opened.
 */

const EMPTY: string[] = [];

let names: string[] = EMPTY;
let status: "idle" | "loading" | "ready" = "idle";
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function load() {
  if (status !== "idle") {
    return;
  }

  status = "loading";

  fetch("/api/icons?manifest=1")
    .then((response) => (response.ok ? response.json() : null))
    .then((json) => {
      if (Array.isArray(json?.data)) {
        names = json.data as string[];
      }
    })
    .catch(() => {
      // Without the manifest the picker still offers its curated defaults.
    })
    .finally(() => {
      status = "ready";
      emit();
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return names;
}

function getServerSnapshot() {
  return EMPTY;
}

/** Loads the manifest once `enabled` turns true, e.g. when a picker first opens. */
export function useIconNames(enabled: boolean): string[] {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (enabled) {
      load();
    }
  }, [enabled]);

  return value;
}
