import type { Metadata } from "next";
import SailorMoonResortsView from "@/src/view/sailor-moon-resorts/SailorMoonResortsView";
import { getCachedAdminStatus, getCachedHomePageData, getCachedSettings } from "@/src/lib/get-page-data";
import { mergeSailorMoonResortsPageData } from "@/src/lib/data/sailor-moon-resorts-page";
import { buildPageMetadata } from "@/src/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getCachedHomePageData();
  const data = mergeSailorMoonResortsPageData(home?.sailor_moon_resorts_page);

  return buildPageMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: "/sailor-moon-resorts",
    keywords: data.metaKeywords,
    image: data.metaOgImage,
  });
}

export default async function SailorMoonResortsPage() {
  const [admin, home, settings] = await Promise.all([
    getCachedAdminStatus(),
    getCachedHomePageData(),
    getCachedSettings().catch(() => null),
  ]);

  return (
    <SailorMoonResortsView
      data={home?.sailor_moon_resorts_page}
      admin={admin}
      contactPhones={settings?.contactPhones ?? []}
      contactEmails={settings?.contactEmails ?? []}
    />
  );
}
