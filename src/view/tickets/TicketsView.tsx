import PopularRoutes from "./components/PopularRoutes";
import ServiceNotice from "./components/ServiceNotice";
import TicketHero from "./components/TicketHero";
import type { PublicTicketRoute } from "@/src/lib/ticket/types";

type TicketsViewProps = {
    routes: PublicTicketRoute[];
    phones: string[];
    emails: string[];
};

export default function TicketsView({ routes, phones, emails }: TicketsViewProps) {
    return (
        <main className="min-h-screen bg-base-50">
            <TicketHero />
            <ServiceNotice phones={phones} emails={emails} />
            <PopularRoutes routes={routes} />
        </main>
    );
}
