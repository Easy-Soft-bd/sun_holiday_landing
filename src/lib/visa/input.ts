import type { VisaCountryStatus } from '@/src/models/VisaCountry';

export function readStatus(value: unknown, fallback: VisaCountryStatus = 'Draft'): VisaCountryStatus {
  if (value === 'Active' || value === 'Inactive' || value === 'Draft') return value;
  return fallback;
}

export function readSortOrder(value: unknown, fallback = 0): number {
  const n =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.round(n));
}

export function readTrimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** `undefined` means the field was omitted. `null` clears it. */
export function readNullableText(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed || null;
}
