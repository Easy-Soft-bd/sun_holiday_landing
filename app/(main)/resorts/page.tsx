import type { Metadata } from "next";
import ResortsListingView from "@/src/view/resorts/ResortsListingView";
import { getCachedAdminStatus, getCachedHomePageData } from "@/src/lib/get-page-data";
import { mergeResortsListingPageData } from "@/src/lib/data/resorts-listing-page";
import { buildPageMetadata } from "@/src/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getCachedHomePageData();
  const data = mergeResortsListingPageData(home?.resorts_listing_page);

  return buildPageMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: "/resorts",
    keywords: data.metaKeywords,
    image: data.metaOgImage,
  });
}

export default async function ResortsPage() {
  const [admin, home] = await Promise.all([getCachedAdminStatus(), getCachedHomePageData()]);

  return <ResortsListingView data={home?.resorts_listing_page} admin={admin} />;
}
