export const SWAPNO_BILASH_RESORT_LINK = {
  label: "Swapno Bilash Resort",
  url: "/swapno-bilash-resort",
};

type ResortNavLink = {
  label: string;
  url: string;
};

export function ensureSwapnoBilashResortLink(links: ResortNavLink[]): ResortNavLink[] {
  if (links.some((link) => link.url === SWAPNO_BILASH_RESORT_LINK.url)) {
    return links;
  }
  const sailorIndex = links.findIndex((link) => link.url === "/sailor-moon-resorts");
  const next = [...links];
  next.splice(sailorIndex >= 0 ? sailorIndex + 1 : next.length, 0, { ...SWAPNO_BILASH_RESORT_LINK });
  return next;
}
