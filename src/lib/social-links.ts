import { normalizeIconName } from "./icons/icon-aliases";

export interface SocialLink {
  label: string;
  icon: string;
  url: string;
}

export const DEFAULT_SOCIAL_ICON = "LuGlobe";

/**
 * The four URL columns that predate the configurable list. They are still read
 * so existing installs keep their links until an admin saves the new editor.
 */
const LEGACY_SOCIAL_COLUMNS = [
  { key: "facebookUrl", label: "Facebook", icon: "SiFacebook" },
  { key: "instagramUrl", label: "Instagram", icon: "SiInstagram" },
  { key: "twitterUrl", label: "Twitter", icon: "SiX" },
  { key: "linkedinUrl", label: "LinkedIn", icon: "SiLinkedin" },
] as const;

export const SUGGESTED_SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "Facebook", icon: "SiFacebook", url: "" },
  { label: "Instagram", icon: "SiInstagram", url: "" },
  { label: "X", icon: "SiX", url: "" },
  { label: "LinkedIn", icon: "SiLinkedin", url: "" },
  { label: "YouTube", icon: "SiYoutube", url: "" },
  { label: "WhatsApp", icon: "SiWhatsapp", url: "" },
  { label: "TikTok", icon: "SiTiktok", url: "" },
  { label: "Telegram", icon: "SiTelegram", url: "" },
];

// Anything outside these schemes (notably `javascript:`) must not reach an href.
const SAFE_URL_START = /^(?:https?:\/\/|mailto:|tel:|\/|#)/i;
const BARE_DOMAIN = /^[\w-]+(?:\.[\w-]+)+(?:[/?#].*)?$/;

/** Returns a safe href, or an empty string when the value cannot be trusted. */
export function sanitizeSocialUrl(value: unknown): string {
  const url = String(value ?? "").trim();

  if (!url) {
    return "";
  }

  if (SAFE_URL_START.test(url)) {
    return url;
  }

  // Admins routinely type "facebook.com/acme" without a scheme.
  return BARE_DOMAIN.test(url) ? `https://${url}` : "";
}

function toSocialLink(entry: unknown): SocialLink | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const { label, icon, url } = entry as Record<string, unknown>;
  const href = sanitizeSocialUrl(url);

  if (!href) {
    return null;
  }

  const iconName = normalizeIconName(typeof icon === "string" ? icon : "");

  return {
    label: String(label ?? "").trim(),
    icon: iconName || DEFAULT_SOCIAL_ICON,
    url: href,
  };
}

/**
 * Parses the stored `socialLinks` column. Returns `null` when the column has
 * never been written, which is what lets callers fall back to the legacy URL
 * columns without resurrecting links an admin deliberately deleted.
 */
export function parseStoredSocialLinks(value: unknown): SocialLink[] | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  let raw = value;

  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(raw)) {
    return null;
  }

  return raw.map(toSocialLink).filter((link): link is SocialLink => link !== null);
}

/** Normalizes a list coming from the admin form or an API payload. */
export function normalizeSocialLinks(value: unknown): SocialLink[] {
  return parseStoredSocialLinks(value) ?? [];
}

function legacySocialLinks(settings: Record<string, unknown> | null | undefined): SocialLink[] {
  if (!settings) {
    return [];
  }

  return LEGACY_SOCIAL_COLUMNS.map(({ key, label, icon }) => ({
    label,
    icon,
    url: sanitizeSocialUrl(settings[key]),
  })).filter((link) => link.url.length > 0);
}

/**
 * The links to show for a settings row. Once an admin saves the configurable
 * list it wins outright, including when they emptied it on purpose; before that
 * we fall back to the legacy columns and finally to any CMS-provided list.
 */
export function resolveSocialLinks(
  settings: Record<string, unknown> | null | undefined,
  fallback: unknown = [],
): SocialLink[] {
  const configured = parseStoredSocialLinks(settings?.socialLinks);

  if (configured) {
    return configured;
  }

  const legacy = legacySocialLinks(settings);

  return legacy.length > 0 ? legacy : normalizeSocialLinks(fallback);
}
