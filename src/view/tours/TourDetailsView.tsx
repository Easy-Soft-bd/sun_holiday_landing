import TourBookingCard from "./components/details/TourBookingCard";
import TourHero from "./components/details/TourHero";
import TourItinerary from "./components/details/TourItinerary";
import TourOverview from "./components/details/TourOverview";
import TourGallery from "./components/details/TourGallery";
import TourVideo from "./components/details/TourVideo";
import TourQuickFacts from "./components/details/TourQuickFacts";
import type { TourPackage } from "@/src/view/tours/data/mockTours";

type TourDetailsProps = TourPackage;

export default function TourDetailsView({ tour }: { tour: TourDetailsProps }) {
  return (
    <main className="min-h-screen bg-base-50 pb-24">
      <TourHero tour={tour} />

      <div className="container relative z-20 mx-auto -mt-12 px-4 md:-mt-16">
        <TourQuickFacts tour={tour} />

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-12">
          <div className="min-w-0 flex-1">
            <div className="space-y-0 rounded-[2.5rem] border border-base-200 bg-base-100 p-8 shadow-xl md:p-10">
              <TourOverview tour={tour} />

              <div className="my-12 w-full h-px bg-base-200" />

              <TourItinerary itinerary={tour.itinerary} />

              <div className="my-12 w-full h-px bg-base-200" />

              <TourGallery tour={tour} />

              <TourVideo tour={tour} />
            </div>
          </div>

          <aside className="shrink-0 lg:w-96 lg:pt-2">
            <TourBookingCard tour={tour} />
          </aside>
        </div>
      </div>
    </main>
  );
}
