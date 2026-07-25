import type { BlogPostRecord } from '@/src/lib/data/blog';

/** Canonical public path for a blog post (`/blog/{slug}`). */
export function getBlogPublicPath(post: Pick<BlogPostRecord, 'slug' | 'id'>): string {
  const slug = typeof post.slug === 'string' ? post.slug.trim() : '';
  if (slug) {
    return `/blog/${slug}`;
  }
  return `/blog/${post.id}`;
}

export function getBlogCanonicalSegment(post: Pick<BlogPostRecord, 'slug' | 'id'>): string {
  const slug = typeof post.slug === 'string' ? post.slug.trim() : '';
  return slug || String(post.id);
}
