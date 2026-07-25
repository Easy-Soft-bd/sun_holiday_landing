import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { parseMultiValue, resolveMapsDirectionsHref } from "@/src/lib/settings-normalize";

type ContactInfoProps = {
    settings?: {
        contactEmail?: string | null;
        contactPhone?: string | null;
        contactEmails?: string[] | null;
        contactPhones?: string[] | null;
        address?: string | null;
        googleMapsUrl?: string | null;
    } | null;
};

function normalizeList(arr?: string[] | null, one?: string | null): string[] {
    const fromArray = Array.isArray(arr)
        ? arr.map((v) => String(v).trim()).filter(Boolean)
        : [];
    if (fromArray.length > 0) return fromArray;
    return parseMultiValue(one);
}

export default function ContactInfo({ settings }: ContactInfoProps) {
    const phoneNumbers = normalizeList(settings?.contactPhones, settings?.contactPhone);
    const emails = normalizeList(settings?.contactEmails, settings?.contactEmail);
    const officeAddress = settings?.address?.trim() || [
        "362/1, Holding 13/1 (2nd Floor)",
        "Old-27 New-16 Dhanmondi",
        "Dhaka-1209, Bangladesh",
    ].join("\n");
    const primaryPhone = phoneNumbers[0] || "+8801873838301";
    const primaryEmail = emails[0] || "info@sunholidaysltd.com";
    const directionsHref = resolveMapsDirectionsHref(settings?.googleMapsUrl) || "#map";

    const contactDetails = [
        {
            icon: MapPin,
            title: "Visit Our Office",
            content: (
                <span className="whitespace-pre-line">{officeAddress}</span>
            ),
            action: { label: "Get Directions", href: directionsHref, external: directionsHref.startsWith("http") },
        },
        {
            icon: Phone,
            title: "Call Us Anytime",
            content: (
                <div className="space-y-1">
                    {(phoneNumbers.length > 0 ? phoneNumbers : ["+88 018 73 83 83 01"]).map((phone, idx) => (
                        <a
                            key={`${phone}-${idx}`}
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="block hover:text-primary transition-colors"
                        >
                            {phone}
                        </a>
                    ))}
                </div>
            ),
            action: { label: "Call Now", href: `tel:${primaryPhone.replace(/\s/g, "")}`, external: false },
        },
        {
            icon: Mail,
            title: "Email Support",
            content: (
                <div className="space-y-1">
                    {(emails.length > 0 ? emails : ["info@sunholidaysltd.com"]).map((email, idx) => (
                        <a key={`${email}-${idx}`} href={`mailto:${email}`} className="block hover:text-primary transition-colors">{email}</a>
                    ))}
                </div>
            ),
            action: { label: "Send Email", href: `mailto:${primaryEmail}`, external: false },
        },
        {
            icon: Clock,
            title: "Working Hours",
            content: (
                <>
                    Our dedicated team is on standby<br />
                    24/7 at your service.<br />
                    Always ready to help.
                </>
            ),
            action: { label: "Contact Support", href: `tel:${primaryPhone.replace(/\s/g, "")}`, external: false },
        },
    ];

    return (
        <section className="py-20 bg-base-100">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contactDetails.map((item, index) => (
                        <div key={index} className="group bg-base-50 p-8 rounded-3xl border border-base-200 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary group-hover:text-white">
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                            <div className="text-base-content/70 leading-relaxed mb-6 min-h-[4.5rem]">
                                {item.content}
                            </div>
                            <a
                                href={item.action.href}
                                {...(item.action.external
                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                    : {})}
                                className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 uppercase tracking-widest group/link"
                            >
                                {item.action.label}
                                <span className="ml-2 transform group-hover/link:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
