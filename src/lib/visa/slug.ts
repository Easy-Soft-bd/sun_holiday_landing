import VisaCountry from '@/src/models/VisaCountry';
import { slugifyText } from '@/src/lib/tours/slugify-text';

/** Reserve a unique `slug` in `visa_countries` (optionally ignoring `excludeId` on update). */
export async function allocateUniqueVisaSlug(
  name: string,
  preferred: string | null | undefined,
  excludeId?: number
): Promise<string> {
  const source = (preferred ?? '').trim() || name.trim() || 'country';
  const base = slugifyText(source);
  let candidate = base;
  let n = 1;

  for (;;) {
    const existing = await VisaCountry.findOne({ where: { slug: candidate } });
    if (!existing || (excludeId != null && existing.id === excludeId)) {
      return candidate;
    }
    candidate = `${base}-${n++}`;
  }
}

export async function isVisaSlugTaken(slug: string, excludeId?: number): Promise<boolean> {
  const existing = await VisaCountry.findOne({ where: { slug } });
  if (!existing) return false;
  return excludeId == null || existing.id !== excludeId;
}
