import ContactHero from "./components/ContactHero";
import ContactInfo from "./components/ContactInfo";
import MapSection from "./components/MapSection";

export default function ContactView() {
    return (
        <main className="min-h-screen bg-base-50">
            <ContactHero />
            <ContactInfo />
            <MapSection />
        </main>
    );
}
