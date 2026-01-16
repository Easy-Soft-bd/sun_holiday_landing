import PopularRoutes from "./components/PopularRoutes";
import ServiceNotice from "./components/ServiceNotice";
import TicketHero from "./components/TicketHero";

export default function TicketsView() {
    return (
        <main className="min-h-screen bg-base-50">
            <TicketHero />
            <ServiceNotice />
            <PopularRoutes />
        </main>
    );
}
