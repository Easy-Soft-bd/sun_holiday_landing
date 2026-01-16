
import { Metadata } from "next";
import ContactView from "@/src/view/contact/ContactView";

export const metadata: Metadata = {
    title: "Contact Us - Sun Holidays Ltd | 24/7 Travel Support",
    description: "Get in touch with Sun Holidays Ltd. Visit our Dhanmondi office, call our 24/7 support, or email us for your travel needs.",
    keywords: ["Contact Sun Holidays", "Travel Agency Dhaka", "Sun Holidays Address", "Travel Support Bangladesh"]
};

export default function ContactPage() {
    return <ContactView />;
}
