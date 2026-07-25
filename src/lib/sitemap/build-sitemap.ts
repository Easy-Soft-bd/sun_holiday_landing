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

  for (const path of MARKETING_STATIC_PATHNAMES) {
    push(
      entry(path, {
        lastModified: now,
        changeFrequency: path === '/' ? 'weekly' : path === '/blog' || path === '/tours' ? 'daily' : 'monthly',
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
