import type { TourRecord } from "@/src/lib/data/tours";

/** Path segment for canonical tour URLs (slug when set, otherwise numeric id). */
export function getTourCanonicalSegment(tour: Pick<TourRecord, "id" | "slug">): string {
  const s = typeof tour.slug === "string" ? tour.slug.trim() : "";
  if (s && s.toLowerCase() !== "null" && s.toLowerCase() !== "undefined") return s;
  if (tour.id == null) return "";
  const id = String(tour.id).trim();
  if (!id || id.toLowerCase() === "null" || id.toLowerCase() === "undefined") return "";
  return id;
}

/** Public pathname e.g. `/tours/cox-bazar-beach` (slug preferred; numeric id as legacy fallback). */
export function getTourPublicPath(tour: Pick<TourRecord, "id" | "slug">): string | null {
  const segment = getTourCanonicalSegment(tour);
  if (!segment) return null;
  return `/tours/${encodeURIComponent(segment)}`;
}

/**
 * Sitemap / SEO: only slug URLs (`/tours/{slug}`). Omit tours without a slug so
 * search engines do not index numeric legacy paths.
 */
export function getTourSlugOnlyPath(tour: Pick<TourRecord, "slug">): string | null {
  const s = typeof tour.slug === "string" ? tour.slug.trim() : "";
  if (!s || s.toLowerCase() === "null" || s.toLowerCase() === "undefined") return null;
  return `/tours/${encodeURIComponent(s)}`;
}
