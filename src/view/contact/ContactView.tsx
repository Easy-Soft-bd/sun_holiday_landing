import ContactHero from "./components/ContactHero";
import ContactInfo from "./components/ContactInfo";
import MapSection from "./components/MapSection";

type ContactViewProps = {
    settings?: {
        contactEmail?: string | null;
        contactPhone?: string | null;
        contactEmails?: string[] | null;
        contactPhones?: string[] | null;
        address?: string | null;
    } | null;
};

export default function ContactView({ settings }: ContactViewProps) {
    return (
        <main className="min-h-screen bg-base-50">
            <ContactHero />
            <ContactInfo settings={settings} />
            <MapSection />
        </main>
    );
}
