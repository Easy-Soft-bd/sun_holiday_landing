import { cache } from "react";
import { unstable_cache } from "next/cache";
import SunviaEcoResortPage from "@/src/models/SunviaEcoResortPage";
import { TAG_SUNVIA_ECO_RESORT } from "@/src/lib/revalidate-tags";
import { mergeSunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";

const getSunviaEcoResortPageDataFromDb = unstable_cache(
  async () => {
    const pageDataRaw = await SunviaEcoResortPage.findOne();
    if (!pageDataRaw) {
      return mergeSunviaEcoResortPageData();
    }

    return mergeSunviaEcoResortPageData(pageDataRaw.get({ plain: true }));
  },
  ["sunvia-eco-resort-page"],
  {
    tags: [TAG_SUNVIA_ECO_RESORT],
  },
);

export const getCachedSunviaEcoResortPageData = cache(async () => getSunviaEcoResortPageDataFromDb());
