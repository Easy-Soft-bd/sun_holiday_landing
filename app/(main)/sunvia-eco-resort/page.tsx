import Script from "next/script";
import type { Metadata } from "next";
import SunviaEcoResortView from "@/src/view/sunvia-eco-resort/Index";
import {
  getCachedAdminStatus,
  getCachedSunviaEcoResortPageData,
} from "@/src/lib/get-page-data";
import { absoluteUrl, buildPageMetadata } from "@/src/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getCachedSunviaEcoResortPageData();

  return buildPageMetadata({
    title: pageData.investor_seo.metaTitle,
    description: pageData.investor_seo.metaDescription,
    path: "/sunvia-eco-resort",
    keywords: pageData.investor_seo.metaKeywords,
    image: pageData.investor_seo.metaImage || pageData.investor_hero.backgroundImage,
  });
}

export default async function SunviaEcoResortPage() {
  const [admin, pageData] = await Promise.all([
    getCachedAdminStatus(),
    getCachedSunviaEcoResortPageData(),
  ]);

  const resortJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageData.investor_hero.headline,
    description: pageData.investor_seo.metaDescription,
    url: absoluteUrl("/sunvia-eco-resort"),
    image: absoluteUrl(pageData.investor_seo.metaImage || pageData.investor_hero.backgroundImage),
    about: {
      "@type": "Project",
      name: "Sunvia Hotel & Resort",
      description:
        "A planned hospitality destination in Manikganj by Sun Tourism Ltd. The resort is in planning and is not open for booking.",
    },
  };

  return (
    <>
      <Script
        id="sunvia-eco-resort-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resortJsonLd) }}
      />
      <SunviaEcoResortView data={pageData} admin={admin} />
    </>
  );
}
