import type { TourItineraryDay } from "@/src/models/Tour";

export function parseJsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}

export function normalizeItinerary(value: unknown): TourItineraryDay[] {
  const raw = parseJsonArray<unknown>(value);
  return raw
    .filter((item): item is Record<string, unknown> => item !== null && typeof item === "object")
    .map((item) => ({
      day: Number(item.day) || 0,
      title: String(item.title ?? ""),
      description: String(item.description ?? ""),
    }));
}

/** Coerce JSON columns that may arrive as strings or malformed values from the DB. */
export function normalizeTourPlain<T extends Record<string, unknown>>(tour: T): T {
  const homeSortRaw = tour.homeSortOrder;
  const homeSortOrder =
    homeSortRaw == null || homeSortRaw === ""
      ? 0
      : Number.isFinite(Number(homeSortRaw))
        ? Number(homeSortRaw)
        : 0;

  return {
    ...tour,
    highlights: parseJsonArray<string>(tour.highlights),
    itinerary: normalizeItinerary(tour.itinerary),
    includes: parseJsonArray<string>(tour.includes),
    excludes: parseJsonArray<string>(tour.excludes),
    gallery: parseJsonArray<string>(tour.gallery),
    showOnHome: Boolean(tour.showOnHome),
    homeSortOrder,
  } as T;
}
