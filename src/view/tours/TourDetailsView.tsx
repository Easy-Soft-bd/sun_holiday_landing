
// import { TourPackage } from "@/src/view/tours/data/mockTours";
import TourBookingCard from "./components/details/TourBookingCard";
import TourHero from "./components/details/TourHero";
import TourItinerary from "./components/details/TourItinerary";
import TourOverview from "./components/details/TourOverview";
import TourGallery from "./components/details/TourGallery";
import TourVideo from "./components/details/TourVideo";

// Define a compatible interface for the view
interface TourDetailsProps {
    id: string | number;
    title: string;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    duration: string;
    price: number;
    inquiryPhone?: string;
    description: string;
    highlights: string[];
    itinerary: any[];
    includes: string[];
    excludes: string[];
    gallery: string[];
    videoUrl?: string;
}

export default function TourDetailsView({ tour }: { tour: TourDetailsProps | any }) {
    return (
        <main className="min-h-screen bg-base-50 pb-20">
            <TourHero tour={tour} />

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-base-100 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-base-200 space-y-12">
                            <TourOverview tour={tour} />
                            <div className="w-full h-px bg-base-200" />
                            <TourItinerary itinerary={tour.itinerary} />
                            
                            <div className="w-full h-px bg-base-200" />
                            <TourGallery tour={tour} />

                            <TourVideo tour={tour} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-96 shrink-0 relative z-30">
                        <TourBookingCard tour={tour} />
                    </div>
                </div>
            </div>
        </main>
    );
}
