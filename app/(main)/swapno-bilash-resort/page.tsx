import type { Metadata } from "next";
import SailorMoonResortsView from "@/src/view/sailor-moon-resorts/SailorMoonResortsView";
import { getCachedAdminStatus, getCachedHomePageData, getCachedSettings } from "@/src/lib/get-page-data";
import {
  defaultSwapnoBilashResortPageData,
  mergeSwapnoBilashResortPageData,
} from "@/src/lib/data/swapno-bilash-resort-page";
import { buildPageMetadata } from "@/src/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getCachedHomePageData();
  const data = mergeSwapnoBilashResortPageData(home?.swapno_bilash_resort_page);

  return buildPageMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: "/swapno-bilash-resort",
    keywords: data.metaKeywords,
    image: data.metaOgImage,
  });
}

export default async function SwapnoBilashResortPage() {
  const [admin, home, settings] = await Promise.all([
    getCachedAdminStatus(),
    getCachedHomePageData(),
    getCachedSettings().catch(() => null),
  ]);

  return (
    <SailorMoonResortsView
      data={home?.swapno_bilash_resort_page}
      admin={admin}
      contactPhones={settings?.contactPhones ?? []}
      contactEmails={settings?.contactEmails ?? []}
      editor={{
        section: "swapno_bilash_resort_page",
        title: "Edit Swapno Bilash Resort page",
        uploadType: "swapno",
        bookingSource: "Swapno Bilash Resort",
        defaults: defaultSwapnoBilashResortPageData,
      }}
    />
  );
}
