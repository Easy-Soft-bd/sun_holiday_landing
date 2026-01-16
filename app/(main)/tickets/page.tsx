
import { Metadata } from "next";
import TicketsView from "@/src/view/tickets/TicketsView";

export const metadata: Metadata = {
    title: "Flight Tickets - Sun Holidays Ltd | Book Domestic & Int'l Flights",
    description: "Find the best flight deals. Book air tickets to any destination with Sun Holidays Ltd. Contact us for instant booking.",
    keywords: ["Air Tickets", "Flight Booking", "Dhaka to Dubai", "Cheap Flights Bangladesh"]
};

export default function TicketsPage() {
    return <TicketsView />;
}
