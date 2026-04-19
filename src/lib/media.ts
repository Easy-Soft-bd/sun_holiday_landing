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
