/**
 * Reads boolean-ish env values (`true`/`1`/`yes`/`on`).
 */
export function envFlag(value: string | undefined, fallback = false): boolean {
  if (value == null || value.trim() === "") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
}

/** Public "Site under development" top banner. Admin mode banner is independent. */
export function isDevelopmentModeBannerEnabled() {
  return envFlag(process.env.DEVELOPMENT_MODE, false);
}
