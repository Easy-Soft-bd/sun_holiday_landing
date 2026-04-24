import type { TourRecord } from "@/src/lib/data/tours";

/** Path segment for canonical tour URLs (slug when set, otherwise numeric id). */
export function getTourCanonicalSegment(tour: Pick<TourRecord, "id" | "slug">): string {
  const s = typeof tour.slug === "string" ? tour.slug.trim() : "";
  if (s) return s;
  return String(tour.id);
}

/** Public pathname e.g. `/tours/cox-bazar-beach` (slug preferred; numeric id as legacy fallback). */
export function getTourPublicPath(tour: Pick<TourRecord, "id" | "slug">): string {
  return `/tours/${encodeURIComponent(getTourCanonicalSegment(tour))}`;
}

/**
 * Sitemap / SEO: only slug URLs (`/tours/{slug}`). Omit tours without a slug so
 * search engines do not index numeric legacy paths.
 */
export function getTourSlugOnlyPath(tour: Pick<TourRecord, "slug">): string | null {
  const s = typeof tour.slug === "string" ? tour.slug.trim() : "";
  if (!s) return null;
  return `/tours/${encodeURIComponent(s)}`;
}
