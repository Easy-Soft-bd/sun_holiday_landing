import { resolveBrandAsset, resolveSiteName, DEFAULT_FAVICON } from '@/src/lib/brand';
import { resolveSocialLinks, type SocialLink } from '@/src/lib/social-links';

export function uniquePhones(values: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.replace(/\D/g, "");
    if (!trimmed || !key || seen.has(key)) continue;
    seen.add(key);
    next.push(trimmed);
  }
  return next;
}

export function uniqueEmails(values: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) continue;
    seen.add(key);
    next.push(trimmed);
  }
  return next;
}

export function parseMultiValue(value: unknown): string[] {
  return String(value ?? '')
    .split(/[\n,;]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

/** Public-facing general settings after contact/social normalization. */
export type NormalizedSettings = {
  siteName?: string | null;
  siteLogo?: string | null;
  favicon?: string | null;
  updatedAt?: string | Date | null;
  metaImage?: string | null;
  contactEmail: string;
  contactPhone: string;
  contactEmails: string[];
  contactPhones: string[];
  address?: string | null;
  googleMapsUrl: string;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  socialLinks: SocialLink[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
};

/**
 * Expand newline/comma-joined contact strings into arrays for public consumers
 * (footer, contact page, JSON-LD). Safe to call on already-normalized payloads.
 */
export function normalizeSettingsPlain(
  settings: Record<string, unknown>,
): NormalizedSettings {
  const contactEmails = uniqueEmails(
    Array.isArray(settings.contactEmails) && (settings.contactEmails as unknown[]).length > 0
      ? (settings.contactEmails as unknown[]).map((v) => String(v).trim()).filter(Boolean)
      : parseMultiValue(settings.contactEmail),
  );

  const contactPhones = uniquePhones(
    Array.isArray(settings.contactPhones) && (settings.contactPhones as unknown[]).length > 0
      ? (settings.contactPhones as unknown[]).map((v) => String(v).trim()).filter(Boolean)
      : parseMultiValue(settings.contactPhone),
  );

  const googleMapsUrl = String(settings.googleMapsUrl ?? '').trim();

  return {
    ...settings,
    siteName: resolveSiteName(settings.siteName as string | null | undefined),
    siteLogo: resolveBrandAsset(settings.siteLogo as string | null | undefined),
    favicon: resolveBrandAsset(settings.favicon as string | null | undefined, DEFAULT_FAVICON),
    contactEmails,
    contactPhones,
    contactEmail: contactEmails[0] || '',
    contactPhone: contactPhones[0] || '',
    googleMapsUrl,
    // Falls back to the legacy facebook/twitter/instagram/linkedin columns until
    // the admin saves the configurable list for the first time.
    socialLinks: resolveSocialLinks(settings),
  } as NormalizedSettings;
}

function mapsEmbedQuery(query: string, zoom = 16): string {
  const z = Number.isFinite(zoom) && zoom > 0 ? Math.round(zoom) : 16;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${z}&hl=en&output=embed`;
}

function extractMapsUrl(raw: string): string {
  const trimmed = raw.trim();
  const iframeSrc = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)?.[1];
  return (iframeSrc ?? trimmed).replace(/&amp;/g, '&');
}

function isShortMapsLink(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host === 'maps.app.goo.gl' || host === 'goo.gl';
  } catch {
    return false;
  }
}

/**
 * Turn a Google Maps link into an iframe src.
 * Accepts embed URLs, place links, and search links. Short share links need
 * resolveMapsEmbedForIframe so the redirect can be followed first.
 */
export function resolveMapsEmbedSrc(url: string | null | undefined): string | null {
  const trimmed = extractMapsUrl(String(url ?? ''));
  if (!trimmed) return null;
  if (/\/maps\/embed/i.test(trimmed) || /google\.[^/]+\/maps\/embed/i.test(trimmed)) {
    return trimmed;
  }
  if (isShortMapsLink(trimmed)) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '');
  const isGoogleMaps =
    host === 'google.com' ||
    host.endsWith('.google.com') ||
    host === 'maps.google.com';
  if (!isGoogleMaps) return null;

  const at = parsed.href.match(/@(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)(?:,(\d+(?:\.\d+)?)z)?/);
  if (at) {
    const zoom = at[3] ? Number(at[3]) : 16;
    return mapsEmbedQuery(`${at[1]},${at[2]}`, zoom);
  }

  const query =
    parsed.searchParams.get('q') ||
    parsed.searchParams.get('query') ||
    parsed.searchParams.get('destination');
  if (query) return mapsEmbedQuery(query);

  const place = parsed.pathname.match(/\/maps\/(?:place|search)\/([^/]+)/);
  if (place) {
    return mapsEmbedQuery(decodeURIComponent(place[1].replace(/\+/g, ' ')));
  }

  return null;
}

/** Resolve share links such as maps.app.goo.gl, then build an embed URL. */
export async function resolveMapsEmbedForIframe(
  url: string | null | undefined,
): Promise<string | null> {
  const trimmed = extractMapsUrl(String(url ?? ''));
  if (!trimmed) return null;

  const direct = resolveMapsEmbedSrc(trimmed);
  if (direct) return direct;
  if (!isShortMapsLink(trimmed)) return null;

  try {
    const response = await fetch(trimmed, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 * 60 * 12 },
    });
    return resolveMapsEmbedSrc(response.url);
  } catch {
    return null;
  }
}

/** Share / directions link suitable for opening Google Maps in a new tab. */
export function resolveMapsDirectionsHref(url: string | null | undefined): string | null {
  const trimmed = String(url ?? '').trim();
  if (!trimmed) return null;
  return trimmed;
}
