/**
 * Shared cache tags for Next.js data caching and on-demand invalidation.
 * These tags are attached to server-only cached loaders via `unstable_cache`
 * and invalidated from mutation routes with `revalidateTag`.
 */
export const TAG_HOME_PAGE = 'home-page';
export const TAG_GENERAL_SETTINGS = 'general-settings';
export const TAG_TOURS_LIST = 'tours-list';
export const TAG_SUNVIA_ECO_RESORT = 'sunvia-eco-resort';

export function tourDetailTag(id: string | number) {
  return `tour-${id}`;
}

/** Invalidate cached HTML/data for a public tour URL segment (slug or legacy numeric id). */
export function tourRouteTag(param: string) {
  return `tour-url-${param}`;
}

/*
Tag to route mapping:
- TAG_TOURS_LIST -> `/tours`, sitemap, list consumers
- tourDetailTag(id) -> legacy admin/API cache keys by primary key
- tourRouteTag(param) -> `/tours/[slug]` where param is the URL segment used in fetch
*/
