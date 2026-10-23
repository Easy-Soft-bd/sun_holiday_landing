/**
 * Indexable marketing routes for the public site (App Router `(main)` group).
 * Keep in sync when adding new top-level pages; resort detail URLs come from
 * `listStaticResortPathnames()` so slugs stay single-sourced.
 * Dynamic tour, blog, and visa country URLs are merged at runtime in `buildFullSitemap()`.
 */
export const MARKETING_STATIC_PATHNAMES: readonly string[] = [
  '/',
  '/tours',
  '/blog',
  '/news',
  '/events',
  '/csr',
  '/about',
  '/about/teams',
  '/about/award_certificate',
  '/contact',
  '/visa',
  '/medical-visa',
  '/sun-global-education',
  '/tickets',
  '/resorts',
  '/sailor-moon-resorts',
  '/swapno-bilash-resort',
  '/privacy',
  '/terms',
  '/cookies',
  '/destinations',
  '/sunvia-hotel-resort',
] as const;

/** Priority hints for well-known marketing paths. */
export const MARKETING_PATH_PRIORITY: Record<string, number> = {
  '/': 1,
  '/tours': 0.95,
  '/blog': 0.9,
  '/news': 0.85,
  '/events': 0.85,
  '/csr': 0.8,
  '/resorts': 0.88,
  '/sunvia-hotel-resort': 0.88,
  '/sailor-moon-resorts': 0.85,
  '/swapno-bilash-resort': 0.85,
  '/about': 0.8,
  '/contact': 0.8,
  '/visa': 0.75,
  '/medical-visa': 0.75,
  '/sun-global-education': 0.75,
  '/tickets': 0.75,
  '/services': 0.7,
  '/destinations': 0.7,
};
