import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import VisaDetailView from "@/src/view/visa/VisaDetailView";
import VisaJsonLd from "@/src/view/visa/components/VisaJsonLd";
import {
  generateStaticParamsForActiveVisaCountries,
  getCachedVisaForPublicPage,
} from "@/src/lib/data/visa";
import { buildVisaCountryMetadata } from "@/src/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return generateStaticParamsForActiveVisaCountries();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const segment = decodeURIComponent(raw);
  const country = await getCachedVisaForPublicPage(segment);

  if (!country || country.status !== "Active") {
    return {
      title: "Visa country not found | Sun Tourism Ltd",
      description: "This visa page is unavailable or no longer published.",
      robots: { index: false, follow: false },
    };
  }

  return buildVisaCountryMetadata(country, `/visa/${country.slug}`);
}

export default async function VisaCountryPage({ params }: Props) {
  const { slug: raw } = await params;
  const segment = decodeURIComponent(raw);
  const country = await getCachedVisaForPublicPage(segment);

  if (!country || country.status !== "Active") {
    notFound();
  }

  if (segment !== country.slug) {
    permanentRedirect(`/visa/${encodeURIComponent(country.slug)}`);
  }

  return (
    <>
      <VisaJsonLd country={country} />
      <VisaDetailView country={country} />
    </>
  );
}
