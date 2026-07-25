"use client";

import { useSyncExternalStore } from "react";
import type { SerializedCustomIcon } from "@/src/lib/icons/custom-icon-payload";
import { customIconSlug } from "@/src/lib/icons/custom-icon-ref";

/**
 * Client-side cache of the custom icon library.
 *
 * Icon pickers appear both in the admin dashboard and in the inline editors
 * rendered over public pages, so a module-level store is used instead of a
 * context provider that every one of those trees would have to mount.
 */

const EMPTY: SerializedCustomIcon[] = [];

let icons: SerializedCustomIcon[] = EMPTY;
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

  fetch("/api/custom-icons")
    .then((response) => (response.ok ? response.json() : null))
    .then((json) => {
      if (Array.isArray(json?.data)) {
        icons = json.data as SerializedCustomIcon[];
      }
    })
    .catch(() => {
      // An unavailable library just means no custom icons are offered.
    })
    .finally(() => {
      status = "ready";
      emit();
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return icons;
}

function getServerSnapshot() {
  return EMPTY;
}

/** Re-fetches the library, for use after an admin adds or edits an icon. */
export function refreshCustomIcons() {
  status = "idle";
  load();
}

export function useCustomIcons(): SerializedCustomIcon[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Resolves a `custom:slug` reference against the loaded library. */
export function useCustomIcon(iconName?: string | null): SerializedCustomIcon | null {
  const all = useCustomIcons();
  const slug = customIconSlug(iconName);

  if (!slug) {
    return null;
  }

  return all.find((entry) => entry.name === slug) ?? null;
}
