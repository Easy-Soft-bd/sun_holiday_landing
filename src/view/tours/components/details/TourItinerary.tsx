import { TourPackage } from "@/src/view/tours/data/mockTours";
import RichTextHtml from "@/src/components/common/RichTextHtml";
import { normalizeItinerary } from "@/src/lib/tours/normalize-tour";

export default function TourItinerary({ itinerary }: { itinerary: TourPackage["itinerary"] }) {
    const days = normalizeItinerary(itinerary);
    if (days.length === 0) {
        return (
            <div className="py-2 md:py-4">
                <h3 className="mb-3 font-magmawave text-2xl md:text-3xl">Itinerary</h3>
                <p className="rounded-2xl border border-dashed border-base-300 bg-base-200/20 px-6 py-8 text-center text-sm text-base-content/60">
                    The day-by-day itinerary for this package is not listed yet. Contact us for the full schedule.
                </p>
            </div>
        );
    }

    return (
        <div className="py-2 md:py-4">
            <h3 className="mb-5 font-magmawave text-2xl md:mb-8 md:text-3xl">Itinerary</h3>
            <div className="relative ml-0 space-y-6 border-l-0 md:ml-3 md:space-y-12 md:border-l-2 md:border-primary/20">
                {days.map((day, idx) => (
                    <div key={idx} className="relative pl-0 md:pl-8">
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-0 hidden h-4 w-4 rounded-full bg-primary ring-4 ring-base-100 md:block" />
                        
                        <div className="rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm transition-shadow hover:shadow-md md:rounded-3xl md:p-6">
                             <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                                 Day {day.day}
                             </div>
                             <h4 className="mb-2 text-lg font-bold md:mb-3 md:text-xl">{day.title}</h4>
                             <RichTextHtml html={day.description} className="text-base-content/70 leading-relaxed" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
