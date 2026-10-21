import { Metadata } from "next";
import TicketsView from "@/src/view/tickets/TicketsView";
import { buildPageMetadata } from "@/src/lib/site";
import { getCachedActiveTicketRoutes } from "@/src/lib/data/ticket-routes";
import { getCachedSettings } from "@/src/lib/get-page-data";
import type { PublicTicketRoute } from "@/src/lib/ticket/types";

export const metadata: Metadata = buildPageMetadata({
    title: "Flight Tickets - Sun Tourism Ltd | Ask for a Fare",
    description: "Send a ticket query for any route. Sun Tourism Ltd checks the fare and calls you back. Or call the ticket desk directly.",
    path: "/tickets",
    keywords: ["Air Tickets", "Flight Inquiry", "Dhaka to Dubai", "Cheap Flights Bangladesh"],
});

export default async function TicketsPage() {
    const [rawRoutes, settings] = await Promise.all([
        getCachedActiveTicketRoutes().catch(() => []),
        getCachedSettings().catch(() => null),
    ]);

    const routes: PublicTicketRoute[] = rawRoutes.map((route) => ({
        id: route.id,
        from: route.from,
        to: route.to,
        airline: route.airline,
        priceFrom: route.priceFrom,
        image: route.image,
        note: route.note,
    }));

    return (
        <TicketsView
            routes={routes}
            phones={settings?.contactPhones ?? []}
            emails={settings?.contactEmails ?? []}
        />
    );
}
