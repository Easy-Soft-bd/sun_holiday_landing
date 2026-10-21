import { revalidatePath, revalidateTag } from 'next/cache';
import type { VisaCountryRecord } from '@/src/lib/data/visa';
import { TAG_VISA_LIST, visaDetailTag, visaRouteTag } from '@/src/lib/revalidate-tags';

export function revalidateVisaCaches(prev?: VisaCountryRecord | null, next?: VisaCountryRecord | null) {
  revalidateTag(TAG_VISA_LIST, 'max');

  for (const record of [prev, next]) {
    if (!record) continue;
    revalidateTag(visaDetailTag(record.id), 'max');
    revalidateTag(visaRouteTag(String(record.id)), 'max');
    if (record.slug?.trim()) {
      revalidateTag(visaRouteTag(record.slug.trim()), 'max');
      revalidatePath(`/visa/${record.slug.trim()}`);
    }
  }

  revalidatePath('/visa');
  revalidatePath('/');
  revalidatePath('/sitemap.xml');
}
