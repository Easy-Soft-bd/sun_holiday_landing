import { parseCustomIconSvg, type ParsedCustomIcon } from './custom-icon-svg';
import { slugifyIconName, toCustomIconName } from './custom-icon-ref';

export interface CustomIconPayload {
  name: string;
  label: string;
  svg: string;
  content: ParsedCustomIcon;
}

/** The plain shape a `CustomIcon` row produces. */
export interface CustomIconRow {
  id: number;
  name: string;
  label: string;
  svg: string;
  content: ParsedCustomIcon | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface SerializedCustomIcon {
  id: number;
  name: string;
  /** Value to store in content fields, e.g. `custom:check-circle`. */
  iconName: string;
  label: string;
  svg: string;
  content: ParsedCustomIcon | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Validates an admin-submitted icon. The SVG is parsed here so the stored tree is
 * always one the renderer has already accepted.
 */
export function buildCustomIconPayload(
  body: Record<string, unknown>,
): { payload: CustomIconPayload } | { error: string } {
  const label = String(body.label ?? '').trim();

  if (!label) {
    return { error: 'Give the icon a name so you can recognise it later.' };
  }

  if (label.length > 120) {
    return { error: 'That name is too long (120 characters max).' };
  }

  const name = slugifyIconName(String(body.name ?? '') || label);

  if (!name) {
    return { error: 'The reference name needs at least one letter or number.' };
  }

  const svg = String(body.svg ?? '');
  const parsed = parseCustomIconSvg(svg);

  if (!parsed.ok) {
    return { error: parsed.error };
  }

  return {
    payload: { name, label, svg: svg.trim(), content: parsed.icon },
  };
}

export function serializeCustomIcon(row: CustomIconRow): SerializedCustomIcon {
  const toIso = (value: Date | string | null | undefined) =>
    value instanceof Date ? value.toISOString() : (value ?? null);

  return {
    id: row.id,
    name: row.name,
    iconName: toCustomIconName(row.name),
    label: row.label || row.name,
    svg: row.svg ?? '',
    content: row.content ?? null,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}
