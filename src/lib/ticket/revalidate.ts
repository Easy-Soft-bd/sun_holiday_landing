import { revalidatePath, revalidateTag } from 'next/cache';
import { TAG_TICKET_ROUTES } from '@/src/lib/revalidate-tags';

export function revalidateTicketRouteCaches() {
  revalidateTag(TAG_TICKET_ROUTES, 'max');
  revalidatePath('/tickets');
}
