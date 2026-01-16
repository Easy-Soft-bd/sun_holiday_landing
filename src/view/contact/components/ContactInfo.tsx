
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactInfo() {
    const contactDetails = [
        {
            icon: MapPin,
            title: "Visit Our Office",
            content: (
                <>
                    362/1, Holding 13/1 (2nd Floor)<br />
                    Old-27 New-16 Dhanmondi<br />
                    Dhaka-1209, Bangladesh
                </>
            ),
            action: { label: "Get Directions", href: "#map" }
        },
        {
            icon: Phone,
            title: "Call Us Anytime",
            content: (
                <div className="space-y-1">
                    <a href="tel:+8801873838301" className="block hover:text-primary transition-colors">+88 018 73 83 83 01</a>
                    <a href="tel:+8802222243452" className="block hover:text-primary transition-colors">+88 02 2222 43452</a>
                    <a href="tel:+8801873838302" className="block hover:text-primary transition-colors">+88 018 73 83 83 02</a>
                </div>
            ),
            action: { label: "Call Now", href: "tel:+8801873838301" }
        },
        {
            icon: Mail,
            title: "Email Support",
            content: (
                <div className="space-y-1">
                    <a href="mailto:info@sunholidaysltd.com" className="block hover:text-primary transition-colors">info@sunholidaysltd.com</a>
                    <a href="mailto:sunholidays07@gmail.com" className="block hover:text-primary transition-colors">sunholidays07@gmail.com</a>
                </div>
            ),
            action: { label: "Send Email", href: "mailto:info@sunholidaysltd.com" }
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
             action: { label: "Contact Support", href: "tel:+8801873838301" }
        }
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
