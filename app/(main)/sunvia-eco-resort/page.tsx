import Script from "next/script";
import type { Metadata } from "next";
import SunviaEcoResortView from "@/src/view/sunvia-eco-resort/Index";
import {
  getCachedAdminStatus,
  getCachedSunviaEcoResortPageData,
  getCachedSettings,
} from "@/src/lib/get-page-data";
import { absoluteUrl, buildPageMetadata } from "@/src/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getCachedSunviaEcoResortPageData();

  return buildPageMetadata({
    title: pageData.seo.metaTitle,
    description: pageData.seo.metaDescription,
    path: "/sunvia-eco-resort",
    keywords: pageData.seo.metaKeywords,
    image: pageData.seo.metaImage || pageData.hero.backgroundImage,
  });
}

export default async function SunviaEcoResortPage() {
  const [admin, pageData, settings] = await Promise.all([
    getCachedAdminStatus(),
    getCachedSunviaEcoResortPageData(),
    getCachedSettings(),
  ]);

  const resortJsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: `${pageData.hero.titlePart1} ${pageData.hero.titlePart2}`,
    description: pageData.seo.metaDescription,
    url: absoluteUrl("/sunvia-eco-resort"),
    image: absoluteUrl(pageData.seo.metaImage || pageData.hero.backgroundImage),
    telephone: pageData.contact.phones[0],
    email: pageData.contact.emails[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: pageData.contact.locationFull,
      addressCountry: "BD",
    },
    amenityFeature: pageData.services.items.map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item.name,
      value: true,
    })),
    makesOffer: pageData.accommodations.items.map((item) => ({
      "@type": "Offer",
      name: item.type,
      description: item.description,
    })),
    brand: settings?.siteName || "Sun Holidays Ltd",
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
