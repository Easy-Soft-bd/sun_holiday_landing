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
        googleMapsUrl?: string | null;
    } | null;
    enquiry?: {
        resort?: string;
        location?: string;
    } | null;
};

export default function ContactView({ settings, enquiry }: ContactViewProps) {
    const resort = enquiry?.resort?.trim();
    const location = enquiry?.location?.trim();

    return (
        <main className="min-h-screen bg-base-50">
            <ContactHero />
            {resort ? (
                <section className="relative z-10 -mt-10 px-4">
                    <div className="container mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-base-100 px-6 py-6 text-center shadow-xl">
                        <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase">
                            Enquiry
                        </p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">{resort}</h2>
                        {location ? (
                            <p className="mt-2 text-base-content/70">{location}</p>
                        ) : null}
                    </div>
                </section>
            ) : null}
            <ContactInfo settings={settings} />
            <MapSection
                googleMapsUrl={settings?.googleMapsUrl}
                address={settings?.address}
            />
        </main>
    );
}
