import type { MetadataRoute } from 'next';
import { buildFullSitemap } from '@/src/lib/sitemap/build-sitemap';

/**
 * Dynamic `/sitemap.xml` for the full public site.
 * Regenerates on a short interval; tour/blog mutations also revalidate this path.
 */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildFullSitemap();
}
