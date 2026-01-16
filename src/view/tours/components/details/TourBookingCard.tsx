
import { PhoneCall, CalendarCheck } from "lucide-react";
import { TourPackage } from "@/src/view/tours/data/mockTours";

const currencyFormatter = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

export default function TourBookingCard({ tour }: { tour: TourPackage }) {
    return (
        <div className="bg-base-100 p-8 rounded-3xl border border-base-200 shadow-xl sticky top-32">
            <div className="text-center mb-6 pb-6 border-b border-base-200">
                <p className="text-sm font-bold text-base-content/60 uppercase tracking-widest mb-1">Starting From</p>
                <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-black text-primary">{currencyFormatter.format(tour.price)}</span>
                    <span className="text-base-content/50 font-medium text-lg">/ person</span>
                </div>
            </div>

            <div className="space-y-4">
                 <button className="btn btn-primary w-full btn-lg rounded-xl shadow-lg shadow-primary/30 gap-3">
                     <CalendarCheck size={20} />
                     Book Now
                 </button>
                 <a href="tel:+8801873838301" className="btn btn-outline btn-ghost w-full rounded-xl gap-3">
                     <PhoneCall size={20} />
                     Call for Inquiry
                 </a>
            </div>

            <p className="text-xs text-center text-base-content/50 mt-6 leading-relaxed">
                *Prices may vary depending on season and availability. Contact us for the latest offers.
            </p>
        </div>
    );
}
