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

/*
Tag to route mapping:
- TAG_HOME_PAGE -> `/`
- TAG_SUNVIA_ECO_RESORT -> `/sunvia-eco-resort`
- TAG_GENERAL_SETTINGS -> shared `(main)` layout content like nav branding, metadata, and footer
- TAG_TOURS_LIST -> `/tours`, sitemap tour entries, and admin/public list consumers
- tourDetailTag(id) -> `/tours/[id]` for the matching tour detail page and metadata
*/
