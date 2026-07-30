import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import TourDetailsView from "@/src/view/tours/TourDetailsView";
import TourJsonLd from "@/src/view/tours/components/details/TourJsonLd";
import {
  generateStaticParamsForActiveTours,
  getCachedTourForPublicPage,
} from "@/src/lib/data/tours";
import { buildTourDetailMetadata } from "@/src/lib/site";
import { getTourCanonicalSegment, getTourPublicPath } from "@/src/lib/tours/public-path";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Pre-render active tours; new slugs still work via `dynamicParams`. */
export const dynamicParams = true;

export async function generateStaticParams() {
  return generateStaticParamsForActiveTours();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const segment = decodeURIComponent(raw);
  const tour = await getCachedTourForPublicPage(segment);

  if (!tour || tour.status !== "Active") {
    return {
      title: "Tour not found | Sun Tourism Ltd",
      description: "This tour is unavailable or no longer listed.",
      robots: { index: false, follow: false },
    };
  }

  const path = getTourPublicPath(tour);
  if (!path) {
    return {
      title: "Tour not found | Sun Tourism Ltd",
      description: "This tour is unavailable or no longer listed.",
      robots: { index: false, follow: false },
    };
  }

  return buildTourDetailMetadata(tour, path);
}

export default async function TourDetailsPage({ params }: Props) {
  const { slug: raw } = await params;
  const segment = decodeURIComponent(raw);
  const tour = await getCachedTourForPublicPage(segment);

  if (!tour || tour.status !== "Active") {
    notFound();
  }

  const canonical = getTourCanonicalSegment(tour);
  if (!canonical) {
    notFound();
  }
  if (segment !== canonical) {
    permanentRedirect(`/tours/${encodeURIComponent(canonical)}`);
  }

  return (
    <>
      <TourJsonLd tour={tour} />
      <TourDetailsView tour={{ ...tour, id: String(tour.id) }} />
    </>
  );
}
