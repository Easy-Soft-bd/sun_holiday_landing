import EducationView from "@/src/view/education/EducationView";
import { getCachedAdminStatus, getCachedHomePageData, getCachedSettings } from "@/src/lib/get-page-data";
import { DEFAULT_SITE_NAME } from "@/src/lib/brand";
import { absoluteUrl, buildPageMetadata, getSiteUrl } from "@/src/lib/site";
import { mergeEducationPageData } from "@/src/view/education/education-page-data";

const PAGE_PATH = "/sun-global-education";

export async function generateMetadata() {
  const home = await getCachedHomePageData();
  const page = mergeEducationPageData(home?.education_page);
  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.metaKeywords,
    path: PAGE_PATH,
    image: page.heroImage,
  });
}

export default async function SunGlobalEducationPage() {
  const [admin, home, settings] = await Promise.all([
    getCachedAdminStatus(),
    getCachedHomePageData(),
    getCachedSettings().catch(() => null),
  ]);
  const page = mergeEducationPageData(home?.education_page);
  const pageUrl = absoluteUrl(PAGE_PATH);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Sun Global Education",
        serviceType: "Education visa consultancy",
        description: page.metaDescription,
        url: pageUrl,
        image: absoluteUrl(page.heroImage),
        provider: {
          "@type": "TravelAgency",
          name: DEFAULT_SITE_NAME,
          url: getSiteUrl(),
        },
        areaServed: {
          "@type": "Country",
          name: "Bangladesh",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Sun Global Education", item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <EducationView
        data={home?.education_page}
        admin={admin}
        phones={settings?.contactPhones ?? []}
        emails={settings?.contactEmails ?? []}
        address={settings?.address ?? ""}
        mapsUrl={settings?.googleMapsUrl ?? ""}
      />
    </>
  );
}
