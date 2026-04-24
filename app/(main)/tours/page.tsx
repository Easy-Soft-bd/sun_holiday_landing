
import { Metadata } from "next";
import ToursView from "@/src/view/tours/ToursView";
import { getCachedActiveTours } from "@/src/lib/data/tours";
import { buildPageMetadata } from "@/src/lib/site";

export const metadata: Metadata = buildPageMetadata({
    title: "All Tours - Sun Tourism Ltd | Find Your Perfect Getaway",
    description: "Browse our extensive collection of tour packages. Filter by category, date, and price to find your dream vacation.",
    path: "/tours",
    keywords: ["Travel Packages", "Tour Booking", "Holiday Packages", "Cox's Bazar Tour", "Dubai Tour", "Umrah Package"],
});

export default async function ToursPage() {
    const tours = await getCachedActiveTours();

    return <ToursView initialTours={tours} />;
}
