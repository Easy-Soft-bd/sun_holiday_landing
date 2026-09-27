
import { Metadata } from "next";
import ContactView from "@/src/view/contact/ContactView";
import { getCachedSettings } from "@/src/lib/get-page-data";
import { buildPageMetadata } from "@/src/lib/site";

export const metadata: Metadata = buildPageMetadata({
    title: "Contact Us - Sun Tourism Ltd | 24/7 Travel Support",
    description: "Get in touch with Sun Tourism Ltd. Visit our Dhanmondi office, call our 24/7 support, or email us for your travel needs.",
    path: "/contact",
    keywords: ["Contact Sun Tourism", "Travel Agency Dhaka", "Sun Tourism Address", "Travel Support Bangladesh"],
});

function readQueryValue(value: string | string[] | undefined, maxLength: number) {
    const raw = Array.isArray(value) ? value[0] : value;
    return raw?.trim().slice(0, maxLength) || "";
}

export default async function ContactPage({
    searchParams,
}: {
    searchParams: Promise<{ resort?: string | string[]; location?: string | string[] }>;
}) {
    const [settings, params] = await Promise.all([getCachedSettings(), searchParams]);
    const resort = readQueryValue(params.resort, 80);
    const location = readQueryValue(params.location, 120);

    return (
        <ContactView
            settings={settings}
            enquiry={resort ? { resort, location } : null}
        />
    );
}
