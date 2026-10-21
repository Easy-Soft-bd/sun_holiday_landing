import type { Metadata } from "next";
import { absoluteUrl, buildPageMetadata } from "@/src/lib/site";
import { getCachedActiveVisaCountries, toVisaCountryCard } from "@/src/lib/data/visa";
import VisaDirectory from "@/src/view/visa/VisaDirectory";

export const metadata: Metadata = buildPageMetadata({
  title: "Visa Services by Country",
  description:
    "Search countries where Sun Tourism Ltd provides visa assistance. Open a country to read requirements, documents, and how to apply.",
  path: "/visa",
  keywords: ["visa services", "visa requirements", "country visa", "Bangladesh visa assistance"],
});

export default async function VisaPage() {
  const countries = (await getCachedActiveVisaCountries()).map(toVisaCountryCard);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Visa services by country",
    itemListElement: countries.map((country, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${country.name} Visa`,
      url: absoluteUrl(`/visa/${country.slug}`),
    })),
  };

  return (
    <main className="bg-base-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }}
      />
      <div className="container mx-auto px-4 pt-24 pb-12 sm:pt-28 lg:pt-32 lg:pb-14">
        <header className="max-w-2xl">
          <h1 className="font-magmawave text-3xl tracking-tight text-balance text-base-content sm:text-4xl md:text-5xl">
            Visa services by country
          </h1>
          <p className="mt-3 text-base leading-relaxed text-base-content/70">
            Search for a country to see visa requirements, documents, and how to apply.
          </p>
        </header>
        <VisaDirectory countries={countries} />
      </div>
    </main>
  );
}
