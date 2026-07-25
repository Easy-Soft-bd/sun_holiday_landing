/**
 * Custom icons share the single `iconName` field with React Icons names, so they
 * are referenced with a prefix: `custom:my-icon`. The prefix contains a colon,
 * which no React Icons export can, so the two namespaces cannot collide.
 */

export const CUSTOM_ICON_PREFIX = "custom:";

export function isCustomIconName(value?: string | null): boolean {
  return typeof value === "string" && value.trim().startsWith(CUSTOM_ICON_PREFIX);
}

/** `check-circle` -> `custom:check-circle` */
export function toCustomIconName(slug: string): string {
  return `${CUSTOM_ICON_PREFIX}${slug}`;
}

/** `custom:check-circle` -> `check-circle`, or an empty string when not a custom ref. */
export function customIconSlug(value?: string | null): string {
  const name = String(value ?? "").trim();

  return name.startsWith(CUSTOM_ICON_PREFIX)
    ? name.slice(CUSTOM_ICON_PREFIX.length).trim().toLowerCase()
    : "";
}

/** Builds the URL-safe key an admin refers to the icon by. */
export function slugifyIconName(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}
