
import { Metadata } from "next";
import ToursView from "@/src/view/tours/ToursView";

export const metadata: Metadata = {
    title: "All Tours - Sun Holidays Ltd | Find Your Perfect Getaway",
    description: "Browse our extensive collection of tour packages. Filter by category, date, and price to find your dream vacation.",
    keywords: ["Travel Packages", "Tour Booking", "Holiday Packages", "Cox's Bazar Tour", "Dubai Tour", "Umrah Package"]
};

export default function ToursPage() {
    return <ToursView />;
}
