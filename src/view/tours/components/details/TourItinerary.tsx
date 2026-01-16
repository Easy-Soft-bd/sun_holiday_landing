
import { TourPackage } from "@/src/view/tours/data/mockTours";

export default function TourItinerary({ itinerary }: { itinerary: TourPackage['itinerary'] }) {
    if (!itinerary || itinerary.length === 0) return null;

    return (
        <div className="py-8">
            <h3 className="font-magmawave text-3xl mb-8">Itinerary</h3>
            <div className="relative border-l-2 border-primary/20 ml-3 space-y-12">
                {itinerary.map((day, idx) => (
                    <div key={idx} className="relative pl-8">
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-base-100" />
                        
                        <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                             <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                                 Day {day.day}
                             </div>
                             <h4 className="text-xl font-bold mb-3">{day.title}</h4>
                             <p className="text-base-content/70 leading-relaxed">
                                 {day.description}
                             </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
