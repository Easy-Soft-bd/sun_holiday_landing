/**
 * Indexable marketing routes for the public site (App Router `(main)` group).
 * Keep in sync when adding new top-level pages; resort detail URLs come from
 * `listStaticResortPathnames()` so slugs stay single-sourced.
 */
export const MARKETING_STATIC_PATHNAMES: readonly string[] = [
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
  '/destinations',
  '/sunvia-eco-resort',
] as const;
