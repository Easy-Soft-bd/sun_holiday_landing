
import { PhoneCall } from "lucide-react";

export default function ServiceNotice() {
    return (
        <section className="pt-40 pb-20 container mx-auto px-4">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[3rem] p-8 md:p-12 border border-primary/10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4">Direct Booking Service</h3>
                    <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
                        Our online ticketing system is currently undergoing an upgrade to serve you better. 
                        For instant bookings and the best rates, please contact our 24/7 flight reservation desk using the number below.
                    </p>
                    <a href="tel:+8801873838301" className="btn btn-primary btn-lg rounded-full px-8 gap-3 shadow-xl">
                        <PhoneCall size={20} />
                         Call for Booking
                    </a>
                </div>
            </div>
        </section>
    );
}
