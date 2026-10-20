import type { MetadataRoute } from 'next';
import { getCachedActiveBlogPosts } from '@/src/lib/data/blog';
import { getCachedActiveTours } from '@/src/lib/data/tours';
import { listStaticResortPathnames } from '@/src/lib/resorts/static-resort-pages';
import {
  MARKETING_PATH_PRIORITY,
  MARKETING_STATIC_PATHNAMES,
} from '@/src/lib/sitemap/marketing-paths';
import { absoluteUrl } from '@/src/lib/site';
import { getTourSlugOnlyPath } from '@/src/lib/tours/public-path';
import { getBlogPublicPath } from '@/src/lib/blog/public-path';
import { MEDIA_LISTINGS, postsForListing, type MediaListingKey } from '@/src/lib/blog/categories';

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  opts: {
    lastModified?: Date;
    changeFrequency?: SitemapEntry['changeFrequency'];
    priority?: number;
  } = {}
): SitemapEntry {
  return {
    url: absoluteUrl(path),
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? 'monthly',
    priority: opts.priority ?? 0.7,
  };
}

/**
 * Full public sitemap: static marketing pages + resort slugs + active tours + active blog posts.
 * Served by `app/sitemap.ts` as `/sitemap.xml` and refreshed via `revalidate`.
 */
export async function buildFullSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [tours, blogPosts, resortPaths] = await Promise.all([
    getCachedActiveTours().catch((err) => {
      console.error('sitemap: failed to load tours', err);
      return [] as Awaited<ReturnType<typeof getCachedActiveTours>>;
    }),
    getCachedActiveBlogPosts().catch((err) => {
      console.error('sitemap: failed to load blog posts', err);
      return [] as Awaited<ReturnType<typeof getCachedActiveBlogPosts>>;
    }),
    Promise.resolve(listStaticResortPathnames()),
  ]);

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const push = (item: SitemapEntry) => {
    if (seen.has(item.url)) return;
    seen.add(item.url);
    entries.push(item);
  };

  const listingLastModified = (key: MediaListingKey) => {
    const dates = postsForListing(blogPosts, key)
      .map((post) => post.updatedAt ?? post.publishedAt)
      .filter((value): value is string | Date => Boolean(value))
      .map((value) => new Date(value))
      .filter((date) => !Number.isNaN(date.getTime()));
    if (dates.length === 0) return now;
    return new Date(Math.max(...dates.map((date) => date.getTime())));
  };

  for (const path of MARKETING_STATIC_PATHNAMES) {
    const listing = MEDIA_LISTINGS.find((item) => item.path === path);
    push(
      entry(path, {
        lastModified: listing ? listingLastModified(listing.key) : now,
        changeFrequency:
          path === '/'
            ? 'weekly'
            : path === '/blog' || path === '/news' || path === '/events' || path === '/csr' || path === '/tours'
              ? 'daily'
              : 'monthly',
        priority: MARKETING_PATH_PRIORITY[path] ?? 0.7,
      })
    );
  }

  for (const path of resortPaths) {
    push(
      entry(path, {
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    );
  }

  for (const tour of tours) {
    const path = getTourSlugOnlyPath(tour);
    if (!path) continue;
    push(
      entry(path, {
        lastModified: tour.updatedAt ? new Date(tour.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    );
  }

  for (const post of blogPosts) {
    push(
      entry(getBlogPublicPath(post), {
        lastModified: post.updatedAt
          ? new Date(post.updatedAt)
          : post.publishedAt
            ? new Date(post.publishedAt)
            : now,
        changeFrequency: 'weekly',
        priority: 0.75,
      })
    );
  }

  return entries;
}
