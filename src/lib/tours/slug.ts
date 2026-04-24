import Tour from "@/src/models/Tour";
import { slugifyText } from "@/src/lib/tours/slugify-text";

/** @deprecated Prefer `slugifyText` in shared code; kept for server imports that expect this name. */
export const slugify = slugifyText;

/** Reserve a unique `slug` in `tours` (optionally ignoring `excludeId` on update). */
export async function allocateUniqueTourSlug(
  title: string,
  preferred: string | null | undefined,
  excludeId?: number
): Promise<string> {
  const base = slugifyText((preferred ?? "").trim() || title || "tour");
  let candidate = base;
  let n = 1;

  for (;;) {
    const existing = await Tour.findOne({ where: { slug: candidate } });
    if (!existing || (excludeId != null && existing.id === excludeId)) {
      return candidate;
    }
    candidate = `${base}-${n++}`;
  }
}
