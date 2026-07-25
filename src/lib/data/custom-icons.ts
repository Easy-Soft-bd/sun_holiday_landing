import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import CustomIcon from '@/src/models/CustomIcon';
import { TAG_CUSTOM_ICONS } from '@/src/lib/revalidate-tags';
import { parseStoredCustomIcon, type ParsedCustomIcon } from '@/src/lib/icons/custom-icon-svg';
import { customIconSlug, toCustomIconName } from '@/src/lib/icons/custom-icon-ref';

export interface CustomIconRecord {
  id: number;
  /** Slug, e.g. `check-circle`. */
  name: string;
  /** Reference stored in content, e.g. `custom:check-circle`. */
  iconName: string;
  label: string;
  icon: ParsedCustomIcon;
}

const getCustomIconsFromDb = unstable_cache(
  async (): Promise<CustomIconRecord[]> => {
    const rows = await CustomIcon.findAll({ order: [['label', 'ASC']] });

    return rows.flatMap((row) => {
      const plain = row.get({ plain: true });
      const icon = parseStoredCustomIcon(plain.content);

      // A row whose markup no longer validates is skipped rather than crashing
      // every page that references it.
      if (!icon) {
        return [];
      }

      return [
        {
          id: plain.id,
          name: plain.name,
          iconName: toCustomIconName(plain.name),
          label: plain.label || plain.name,
          icon,
        },
      ];
    });
  },
  ['custom-icons'],
  {
    tags: [TAG_CUSTOM_ICONS],
  }
);

export const getCachedCustomIcons = cache(async () => getCustomIconsFromDb());

/** Looks up a `custom:slug` reference. */
export const getCachedCustomIcon = cache(async (iconName?: string | null) => {
  const slug = customIconSlug(iconName);

  if (!slug) {
    return null;
  }

  const icons = await getCachedCustomIcons();

  return icons.find((entry) => entry.name === slug) ?? null;
});
