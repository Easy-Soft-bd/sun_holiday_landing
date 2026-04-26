import type { Metadata } from "next";
import { buildPageMetadata } from "@/src/lib/site";
import AwardCertificateGallery from "@/src/view/about/awards/AwardCertificateGallery";
import { getCachedAdminStatus, getCachedHomePageData } from "@/src/lib/get-page-data";
import { mergeAwardCertificatePageData } from "@/src/lib/data/award-certificate-page";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getCachedHomePageData();
  const data = mergeAwardCertificatePageData(home?.award_certificate_page);

  return buildPageMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: "/about/award_certificate",
    keywords: data.metaKeywords,
    image: data.items[0]?.image,
  });
}

export default async function AwardCertificatePage() {
  const [admin, home] = await Promise.all([getCachedAdminStatus(), getCachedHomePageData()]);
  return <AwardCertificateGallery data={home?.award_certificate_page} admin={admin} />;
}
