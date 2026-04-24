import { MetadataRoute } from 'next';
import { blogPosts } from '@/src/view/blog/data/blogData';
import { getCachedActiveTours } from '@/src/lib/data/tours';
import { listStaticResortPathnames } from '@/src/lib/resorts/static-resort-pages';
import { MARKETING_STATIC_PATHNAMES } from '@/src/lib/sitemap/marketing-paths';
import { absoluteUrl } from '@/src/lib/site';
import { getTourSlugOnlyPath } from '@/src/lib/tours/public-path';

/** Regenerate sitemap periodically; tour list still respects `unstable_cache` tags on reads. */
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [tours, resortPaths] = await Promise.all([
    getCachedActiveTours(),
    Promise.resolve(listStaticResortPathnames()),
  ]);

  const staticPaths = [...MARKETING_STATIC_PATHNAMES, ...resortPaths];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path, index) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: index === 0 && path === '/' ? 1 : path === '/tours' ? 0.95 : 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.id}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const tourEntries: MetadataRoute.Sitemap = tours
    .map((tour) => {
      const path = getTourSlugOnlyPath(tour);
      if (!path) return null;
      return {
        url: absoluteUrl(path),
        lastModified: tour.updatedAt ? new Date(tour.updatedAt) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry != null);

  return [...staticEntries, ...blogEntries, ...tourEntries];
}
