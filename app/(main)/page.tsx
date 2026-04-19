import Script from "next/script";
import type { Metadata } from "next";
import { AirLineMarquee } from "@/src/components/common/AirLineMarquee";
import BookingProcess from "@/src/components/common/BookingProcess";
import WhyChooseUs from "@/src/components/common/WhyUs";
import HolidayCategories from "@/src/Demo";
import FeatureTour from "@/src/view/Home/tour_slider/FeatureTour";
import HajjCta from "@/src/view/Home/hajj_cta/HajjCta";
import Hero from "@/src/view/Home/Hero/Hero";
import ResortCta from "@/src/view/Home/resort_cta/ResortCta";
import { getCachedAdminStatus, getCachedHomePageData, getCachedSettings } from "@/src/lib/get-page-data";
import SailorMoonCta from "@/src/view/Home/resort_cta/sailor-moon/SailorMoonCta";
import SunviaEcoResort from "@/src/view/Home/sunvia_eco_resort/SunviaEcoResort";
import { absoluteUrl, buildPageMetadata } from "@/src/lib/site";

// export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const [pageData, settings] = await Promise.all([
    getCachedHomePageData(),
    getCachedSettings(),
  ]);

  const hero = pageData?.hero ?? {};
  const title =
    settings?.metaTitle ||
    [hero.titlePart1, hero.titlePart2, hero.titlePart3].filter(Boolean).join(' ').trim() ||
    'Sun Holidays Ltd | Experience World-Class Travel';
  const description =
    settings?.metaDescription ||
    hero.description ||
    'Book your dream holiday with Sun Holidays Ltd. Specialists in tours, Hajj, Umrah, visa support, and curated travel experiences.';
  const image = settings?.metaImage || hero.backgroundImage || '/hero/hero.jpg';

  return buildPageMetadata({
    title,
    description,
    path: '/',
    image,
    keywords: settings?.metaKeywords,
  });
}

export default async function Home() {
  const [admin, pageData, settings] = await Promise.all([
    getCachedAdminStatus(),
    getCachedHomePageData(),
    getCachedSettings(),
  ]);
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.siteName || 'Sun Holidays Ltd',
    url: absoluteUrl('/'),
    logo: absoluteUrl(settings?.siteLogo || '/logo/logo.png'),
    email: settings?.contactEmail || undefined,
    telephone: settings?.contactPhone || undefined,
    address: settings?.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
        }
      : undefined,
  };
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings?.siteName || 'Sun Holidays Ltd',
    url: absoluteUrl('/'),
    description:
      settings?.metaDescription ||
      pageData?.hero?.description ||
      'Book your dream holiday with Sun Holidays Ltd.',
  };

  return (
    <>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero data={pageData?.hero} admin={admin} />
      {admin ? (
        <div className="bg-primary/10 border-b border-primary/20 py-2 text-center text-sm font-medium text-primary">
          You are logged in as <span className="font-bold underline">Admin</span>. (Admin Dashboard View)
        </div>
      ) : null}
      <AirLineMarquee data={pageData?.airline_marquee} admin={admin} />
      <FeatureTour />
      <SailorMoonCta data={pageData?.sailor_moon_cta} admin={admin} />
      <SunviaEcoResort />
      <ResortCta data={pageData?.resort_cta} admin={admin} />
      <HajjCta data={pageData?.hajj_cta} admin={admin} />
      <HolidayCategories data={pageData?.holiday_categories} admin={admin} />
      <BookingProcess />
      <WhyChooseUs />
    </>
  );
}
