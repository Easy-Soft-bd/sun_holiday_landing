import { MetadataRoute } from 'next';
import { blogPosts } from '@/src/view/blog/data/blogData';
import { getCachedActiveTours } from '@/src/lib/data/tours';
import { absoluteUrl } from '@/src/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const tours = await getCachedActiveTours();
  const staticRoutes = [
    '/',
    '/tours',
    '/blog',
    '/about',
    '/about/teams',
    '/contact',
    '/visa',
    '/tickets',
    '/resorts',
    '/sailor-moon-resorts',
    '/services',
    '/privacy',
    '/terms',
    '/cookies',
    '/resort/grandeur-bliss',
    '/resort/city-dhaka',
  ];

  return [
    ...staticRoutes.map((path, index) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: path === '/' ? 'weekly' as const : 'monthly' as const,
      priority: index === 0 ? 1 : 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.id}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...tours.map((tour) => ({
      url: absoluteUrl(`/tours/${tour.id}`),
      lastModified: tour.updatedAt ? new Date(tour.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];
}
