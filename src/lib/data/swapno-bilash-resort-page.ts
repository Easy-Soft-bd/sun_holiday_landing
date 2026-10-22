import {
  defaultSailorMoonResortsPageData,
  mergeSailorMoonResortsPageData,
  type SailorMoonResortsPageData,
} from "@/src/lib/data/sailor-moon-resorts-page";

function withSwapnoBilashName(data: SailorMoonResortsPageData): SailorMoonResortsPageData {
  const renamed = JSON.parse(
    JSON.stringify(data)
      .replaceAll("Sailor Moon Resorts", "Swapno Bilash Resort")
      .replaceAll("Sailor Moon Resort", "Swapno Bilash Resort")
      .replaceAll("Sailor Moon", "Swapno Bilash"),
  ) as SailorMoonResortsPageData;

  renamed.heroTitleLine1 = "Swapno Bilash";
  renamed.heroTitleLine2 = "Resort";
  renamed.name = "Swapno Bilash Resort";
  return renamed;
}

export const defaultSwapnoBilashResortPageData = withSwapnoBilashName(defaultSailorMoonResortsPageData);

export function mergeSwapnoBilashResortPageData(
  partial?: Partial<SailorMoonResortsPageData> | null,
): SailorMoonResortsPageData {
  return mergeSailorMoonResortsPageData(partial, defaultSwapnoBilashResortPageData);
}
