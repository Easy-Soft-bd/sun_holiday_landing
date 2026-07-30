const OPTIMIZED_REMOTE_HOSTS = new Set(['images.unsplash.com', 'i.pravatar.cc']);

export function canUseNextImage(src?: string | null) {
  if (!src) {
    return false;
  }

  if (src.startsWith('/')) {
    return true;
  }

  try {
    const hostname = new URL(src).hostname;
    return OPTIMIZED_REMOTE_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

/** Cap remote image width (esp. Unsplash) to avoid oversized LCP/bandwidth on mobile. */
export function optimizeRemoteImageUrl(src?: string | null, maxWidth = 1200) {
  if (!src) {
    return src ?? '';
  }

  try {
    const url = new URL(src);
    if (url.hostname !== 'images.unsplash.com') {
      return src;
    }

    const current = Number(url.searchParams.get('w') || '0');
    if (!current || current > maxWidth) {
      url.searchParams.set('w', String(maxWidth));
    }
    if (!url.searchParams.has('auto')) {
      url.searchParams.set('auto', 'format');
    }
    if (!url.searchParams.has('fit')) {
      url.searchParams.set('fit', 'crop');
    }
    return url.toString();
  } catch {
    return src;
  }
}
