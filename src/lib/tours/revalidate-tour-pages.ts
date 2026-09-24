import { revalidatePath, revalidateTag } from 'next/cache';
import { TAG_TOURS_LIST, tourDetailTag, tourRouteTag } from '@/src/lib/revalidate-tags';

/** Immediate expire — CMS writes must show on the next public request, not SWR-stale. */
const IMMEDIATE = { expire: 0 } as const;

function addSegment(into: Set<string>, value: unknown) {
  if (value == null) return;
  const s = String(value).trim();
  if (s) into.add(s);
}

/** Invalidate list + detail caches and public `/tours` routes after create/update/delete. */
export function revalidateTourMutation(input: {
  id: string | number;
  slug?: string | null;
  prevSlug?: string | null;
}) {
  const segments = new Set<string>();
  addSegment(segments, input.id);
  addSegment(segments, input.slug);
  addSegment(segments, input.prevSlug);

  revalidateTag(TAG_TOURS_LIST, IMMEDIATE);
  revalidateTag(tourDetailTag(input.id), IMMEDIATE);
  for (const segment of segments) {
    revalidateTag(tourRouteTag(segment), IMMEDIATE);
  }

  revalidatePath('/');
  revalidatePath('/tours');
  revalidatePath('/tours', 'layout');
  revalidatePath('/sitemap.xml');
  for (const segment of segments) {
    revalidatePath(`/tours/${segment}`);
  }
}
