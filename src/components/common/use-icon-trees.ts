"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { IconTree } from "@/src/lib/icons/icon-data";

/**
 * Client-side cache of React Icons drawing trees, fetched from `/api/icons`.
 *
 * The alternative is importing the packs, which cannot be narrowed down when the
 * icon name is only known at runtime and so pulls in the whole 41MB catalogue.
 * Fetching the handful of icons actually on screen keeps the bundle free of it.
 *
 * A module-level store is used rather than a context provider because pickers
 * mount both in the dashboard and in editors overlaid on public pages.
 */

/** The picker renders a grid at once, so requests are batched into one call. */
const BATCH_DELAY_MS = 16;
const MAX_PER_REQUEST = 500;

/** `null` records a name the server could not resolve, so it is not re-requested. */
const cache = new Map<string, IconTree | null>();
const pending = new Set<string>();
const inFlight = new Set<string>();
const listeners = new Set<() => void>();

let flushTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

async function fetchBatch(names: string[]) {
  try {
    const response = await fetch(`/api/icons?names=${names.map(encodeURIComponent).join(",")}`);
    const json = response.ok ? await response.json() : null;
    const data = json?.data as Record<string, IconTree | null> | undefined;

    for (const name of names) {
      cache.set(name, data?.[name] ?? null);
    }
  } catch {
    // Treat a failed lookup as "unresolved" so the icon falls back quietly
    // instead of the caller retrying on every render.
    for (const name of names) {
      cache.set(name, null);
    }
  } finally {
    for (const name of names) {
      inFlight.delete(name);
    }

    emit();
  }
}

function flush() {
  flushTimer = null;

  const names = [...pending];
  pending.clear();

  for (let i = 0; i < names.length; i += MAX_PER_REQUEST) {
    const chunk = names.slice(i, i + MAX_PER_REQUEST);

    for (const name of chunk) {
      inFlight.add(name);
    }

    void fetchBatch(chunk);
  }
}

function request(name: string) {
  if (!name || cache.has(name) || pending.has(name) || inFlight.has(name)) {
    return;
  }

  pending.add(name);
  flushTimer ??= setTimeout(flush, BATCH_DELAY_MS);
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/** Returns the icon's tree once loaded, or `undefined` while it is still in flight. */
export function useIconTree(name?: string | null): IconTree | null | undefined {
  const key = (name ?? "").trim();

  const tree = useSyncExternalStore(
    subscribe,
    () => (key ? cache.get(key) : null),
    () => undefined,
  );

  useEffect(() => {
    request(key);
  }, [key]);

  return key ? tree : null;
}

/** Warms the cache for icons about to be rendered, e.g. a picker page of results. */
export function prefetchIconTrees(names: readonly string[]) {
  for (const name of names) {
    request(name.trim());
  }
}
