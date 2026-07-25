import BlogPost from '@/src/models/BlogPost';
import { slugifyText } from '@/src/lib/tours/slugify-text';

/** Reserve a unique `slug` in `blog_posts` (optionally ignoring `excludeId` on update). */
export async function allocateUniqueBlogSlug(
  title: string,
  preferred: string | null | undefined,
  excludeId?: number
): Promise<string> {
  const base = slugifyText((preferred ?? '').trim() || title || 'post');
  let candidate = base;
  let n = 1;

  for (;;) {
    const existing = await BlogPost.findOne({ where: { slug: candidate } });
    if (!existing || (excludeId != null && existing.id === excludeId)) {
      return candidate;
    }
    candidate = `${base}-${n++}`;
  }
}
