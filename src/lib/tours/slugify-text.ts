const RESERVED_TOUR_SLUGS = new Set(["null", "undefined", "new", "edit", "add"]);

/** URL-safe slug from arbitrary text (lowercase, hyphenated). Safe for client bundles. */
export function slugifyText(input: string): string {
  const s = input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

  return s || "tour";
}

/**
 * True when a slug is safe for `/tours/[slug]`.
 * Rejects empty values, MySQL/JSON "null" strings, reserved words, and numeric-only
 * slugs (those collide with legacy `/tours/{id}` lookup).
 */
export function isUsableTourSlug(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  const s = value.trim();
  if (!s) {
    return false;
  }
  if (RESERVED_TOUR_SLUGS.has(s.toLowerCase())) {
    return false;
  }
  if (/^\d+$/.test(s)) {
    return false;
  }
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(s);
}

export function usableTourSlug(value: unknown): string | null {
  if (!isUsableTourSlug(value)) {
    return null;
  }
  return value.trim();
}
