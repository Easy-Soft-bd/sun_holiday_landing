import Tour from "@/src/models/Tour";
import { isUsableTourSlug, slugifyText } from "@/src/lib/tours/slugify-text";

/** @deprecated Prefer `slugifyText` in shared code; kept for server imports that expect this name. */
export const slugify = slugifyText;

function uniqueBase(preferred: string | null | undefined, title: string): string {
  const rawPref = (preferred ?? "").trim();
  if (rawPref) {
    const fromPreferred = slugifyText(rawPref);
    if (isUsableTourSlug(fromPreferred)) {
      return fromPreferred;
    }
  }
  const fromTitle = slugifyText(title || "tour");
  if (isUsableTourSlug(fromTitle)) {
    return fromTitle;
  }
  return "tour";
}

/** Reserve a unique `slug` in `tours` (optionally ignoring `excludeId` on update). */
export async function allocateUniqueTourSlug(
  title: string,
  preferred: string | null | undefined,
  excludeId?: number
): Promise<string> {
  const base = uniqueBase(preferred, title);
  let candidate = base;
  let n = 1;

  for (;;) {
    if (isUsableTourSlug(candidate)) {
      const existing = await Tour.findOne({ where: { slug: candidate } });
      if (!existing || (excludeId != null && existing.id === excludeId)) {
        return candidate;
      }
    }
    candidate = `${base}-${n++}`;
  }
}
