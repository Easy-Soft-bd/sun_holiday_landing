
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
        <div className="rounded-2xl border border-base-200 bg-base-100 p-3 shadow-xl sm:rounded-3xl sm:p-6 lg:sticky lg:top-32 lg:p-8">
            <div className="mb-4 border-b border-base-200 pb-4 text-center sm:mb-6 sm:pb-6">
                <p className="text-sm font-bold text-base-content/60 uppercase tracking-widest mb-1">Starting From</p>
                <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-black text-primary sm:text-4xl">{currencyFormatter.format(tour.price)}</span>
                    <span className="text-base-content/50 font-medium text-sm sm:text-lg">/ person</span>
                </div>
            </div>

            <div className="space-y-2.5 sm:space-y-4">
                 <button className="btn btn-primary btn-md w-full gap-2 rounded-xl shadow-lg shadow-primary/30 sm:btn-lg sm:gap-3">
                     <CalendarCheck size={20} />
                     Book Now
                 </button>
                 {tour.inquiryPhone && (
                     <a href={`tel:${tour.inquiryPhone}`} className="btn btn-outline btn-ghost btn-md w-full gap-2 rounded-xl sm:btn-lg sm:gap-3">
                         <PhoneCall size={20} />
                         Call for Inquiry
                     </a>
                 )}
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-base-content/50 sm:mt-6 sm:text-xs">
                *Prices may vary depending on season and availability. Contact us for the latest offers.
            </p>
        </div>
    );
}
