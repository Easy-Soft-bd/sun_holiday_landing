import { FALLBACK_ICON_NAME, normalizeIconName } from "./icon-aliases";
import { getIconTree, type IconTree } from "./icon-data";

export type { IconTree };

/**
 * Resolves any React Icons name to its drawing tree, applying the alias map so
 * names stored by older builds still render. Falls back to a placeholder glyph
 * rather than rendering nothing when a name cannot be found at all.
 */
export async function resolveIconTree(rawName?: string | null): Promise<IconTree | null> {
  const name = normalizeIconName(rawName);

  return (await getIconTree(name)) ?? (await getIconTree(FALLBACK_ICON_NAME));
}
