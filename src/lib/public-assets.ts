import { existsSync } from 'fs';
import { join } from 'path';

export const DEFAULT_SITE_LOGO = '/logo/logo.png';

/** Resolve a public asset path, falling back when the file is missing on disk. */
export function resolvePublicAssetPath(
  path?: string | null,
  fallback = DEFAULT_SITE_LOGO,
): string {
  if (!path?.trim()) {
    return fallback;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (/^https?:\/\//i.test(normalized)) {
    return path;
  }

  const filePath = join(process.cwd(), 'public', normalized.replace(/^\//, ''));
  if (existsSync(filePath)) {
    return normalized;
  }

  const fallbackPath = join(process.cwd(), 'public', fallback.replace(/^\//, ''));
  if (existsSync(fallbackPath)) {
    return fallback;
  }

  return normalized;
}
