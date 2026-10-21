import type { VisaCountryRecord } from "@/src/lib/data/visa";
import { absoluteUrl, getDefaultSeo } from "@/src/lib/site";
import { stripHtml } from "@/src/lib/html";

type VisaJsonLdProps = {
  country: VisaCountryRecord;
};

export default function VisaJsonLd({ country }: VisaJsonLdProps) {
  const pageUrl = absoluteUrl(`/visa/${country.slug}`);
  const { siteName } = getDefaultSeo();
  const description = stripHtml(country.excerpt || country.content || "").slice(0, 2000) || undefined;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${country.name} Visa Assistance`,
    serviceType: "Visa assistance",
    description,
    url: pageUrl,
    image: absoluteUrl(country.coverImage),
    areaServed: {
      "@type": "Country",
      name: country.name,
    },
    provider: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Visa",
        item: absoluteUrl("/visa"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: country.name,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
