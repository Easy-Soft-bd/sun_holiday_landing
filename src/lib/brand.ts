export const DEFAULT_SITE_NAME = 'Sun Tourism Ltd';
export const DEFAULT_SITE_LOGO = '/logo/sun-tourism.png';
export const DEFAULT_FAVICON = '/logo/sun-tourism.png';

const LEGACY_SITE_NAMES = new Set([
  'sun holidays',
  'sun holidays ltd',
  'sun holidays ltd.',
  'sun holiday ltd',
  'sun holiday ltd.',
  'sun tour ltd',
  'sun tour ltd.',
]);

/** Previous built-in marks. A custom admin upload uses a different path and is kept. */
const LEGACY_BRAND_ASSETS = new Set([
  '/logo/logo.png',
  '/logo/logo.webp',
  '/logo/logo.original.png',
  '/logo/1785425252384-sun-tourism.png',
]);

export function resolveSiteName(value?: string | null): string {
  const trimmed = String(value ?? '').trim().replace(/\s+/g, ' ');
  if (!trimmed || LEGACY_SITE_NAMES.has(trimmed.toLowerCase())) {
    return DEFAULT_SITE_NAME;
  }
  return trimmed;
}

export function resolveBrandAsset(
  value?: string | null,
  fallback = DEFAULT_SITE_LOGO,
): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return fallback;

  const pathOnly = trimmed.split('?')[0];
  const normalized = (pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`).toLowerCase();
  if (LEGACY_BRAND_ASSETS.has(normalized)) return fallback;

  return trimmed;
}
