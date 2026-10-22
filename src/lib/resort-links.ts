export const SWAPNO_BILASH_RESORT_LINK = {
  label: "Swapno Bilash Resort",
  url: "/swapno-bilash-resort",
} as const;

export function ensureSwapnoBilashResortLink<T extends { label: string; url: string }>(links: T[]): T[] {
  if (links.some((link) => link.url === SWAPNO_BILASH_RESORT_LINK.url)) {
    return links;
  }
  const sailorIndex = links.findIndex((link) => link.url === "/sailor-moon-resorts");
  const next = [...links];
  next.splice(sailorIndex >= 0 ? sailorIndex + 1 : next.length, 0, { ...SWAPNO_BILASH_RESORT_LINK });
  return next;
}
