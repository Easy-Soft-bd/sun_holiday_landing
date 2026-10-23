import { resolveMapsDirectionsHref, resolveMapsEmbedForIframe } from "@/src/lib/settings-normalize";

type MapSectionProps = {
    googleMapsUrl?: string | null;
    address?: string | null;
};

export default async function MapSection({ googleMapsUrl, address }: MapSectionProps) {
    const embedSrc = googleMapsUrl?.trim() ? await resolveMapsEmbedForIframe(googleMapsUrl) : null;
    if (!embedSrc) return null;

    const directionsHref = resolveMapsDirectionsHref(googleMapsUrl);
    const blurb = address?.trim() || "";

    return (
        <section id="map" className="py-20 md:pb-32 container mx-auto px-4">
            <div className="bg-base-100 rounded-[3rem] overflow-hidden shadow-2xl border border-base-200 relative h-[500px] w-full group">
                <div className="absolute inset-0 bg-base-200 animate-pulse -z-10" />
                <iframe
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office location map"
                    className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                {blurb || directionsHref ? (
                    <div className="absolute bottom-6 left-6 right-6 md:auto md:right-auto md:w-96 bg-base-100/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                        <h3 className="text-lg font-bold mb-2">Locate Us</h3>
                        {blurb ? <p className="text-base-content/70 text-sm whitespace-pre-line">{blurb}</p> : null}
                        {directionsHref ? (
                            <a
                                href={directionsHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center mt-3 text-sm font-bold text-primary hover:text-primary/80 uppercase tracking-widest"
                            >
                                Open in Google Maps
                                <span className="ml-2">→</span>
                            </a>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
