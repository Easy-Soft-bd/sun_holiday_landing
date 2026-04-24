import type { TourRecord } from "@/src/lib/data/tours";
import { absoluteUrl } from "@/src/lib/site";
import { getTourPublicPath } from "@/src/lib/tours/public-path";
import { stripHtml } from "@/src/lib/html";
import { parseJsonArray } from "@/src/lib/tours/normalize-tour";

type TourJsonLdProps = {
  tour: TourRecord;
};

export default function TourJsonLd({ tour }: TourJsonLdProps) {
  const path = getTourPublicPath(tour);
  const pageUrl = absoluteUrl(path);
  const gallery = parseJsonArray<string>(tour.gallery).filter((u) => u?.trim());
  const imageUrls = [tour.image, ...gallery]
    .filter((u, i, arr) => u?.trim() && arr.indexOf(u) === i)
    .slice(0, 12)
    .map((u) => absoluteUrl(u));

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: stripHtml(tour.description).slice(0, 2000),
    touristType: tour.category,
    image: imageUrls,
    url: pageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: tour.price,
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
  };

  if (tour.reviews > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: tour.rating,
      reviewCount: tour.reviews,
    };
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
