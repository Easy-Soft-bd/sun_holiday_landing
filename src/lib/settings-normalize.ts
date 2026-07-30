import { resolveSocialLinks, type SocialLink } from '@/src/lib/social-links';

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
  const contactEmails =
    Array.isArray(settings.contactEmails) && (settings.contactEmails as unknown[]).length > 0
      ? (settings.contactEmails as unknown[]).map((v) => String(v).trim()).filter(Boolean)
      : parseMultiValue(settings.contactEmail);

  const contactPhones =
    Array.isArray(settings.contactPhones) && (settings.contactPhones as unknown[]).length > 0
      ? (settings.contactPhones as unknown[]).map((v) => String(v).trim()).filter(Boolean)
      : parseMultiValue(settings.contactPhone);

  const googleMapsUrl = String(settings.googleMapsUrl ?? '').trim();

  return {
    ...settings,
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

/** Prefer an embed URL for iframes; otherwise return null so UI can fall back. */
export function resolveMapsEmbedSrc(url: string | null | undefined): string | null {
  const trimmed = String(url ?? '').trim();
  if (!trimmed) return null;
  if (/\/maps\/embed/i.test(trimmed) || /google\.com\/maps\/embed/i.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/** Share / directions link suitable for opening Google Maps in a new tab. */
export function resolveMapsDirectionsHref(url: string | null | undefined): string | null {
  const trimmed = String(url ?? '').trim();
  if (!trimmed) return null;
  return trimmed;
}
