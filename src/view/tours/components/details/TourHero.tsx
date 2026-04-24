
import { Star, MapPin, Clock } from "lucide-react";
import { TourPackage } from "@/src/view/tours/data/mockTours";

const currencyFormatter = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

export default function TourHero({ tour }: { tour: TourPackage }) {
    return (
        <section className="relative flex min-h-[300px] items-end overflow-hidden pb-6 sm:h-[56vh] sm:min-h-[420px] sm:pb-14 md:min-h-[500px] md:pb-20">
             <div className="absolute inset-0 z-0">
                <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#001030] via-[#001030]/40 to-transparent" />
             </div>

             <div className="container relative z-10 mx-auto px-4 text-white">
                <div className="max-w-4xl">
                    <div className="mb-3 flex flex-wrap items-center gap-2 py-1 sm:mb-4 sm:py-0">
                        <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white sm:text-xs">
                            {tour.category}
                        </span>
                        <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[11px] font-bold backdrop-blur-md sm:text-xs">
                             <Star size={12} className="fill-orange-400 text-orange-400" />
                             {tour.rating} ({tour.reviews} Reviews)
                        </div>
                    </div>

                    <h1 className="mb-3 font-magmawave text-2xl leading-tight sm:mb-5 sm:text-4xl md:mb-6 md:text-7xl md:leading-none">
                        {tour.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2.5 py-1 text-xs text-white/85 sm:gap-6 sm:py-0 sm:text-lg sm:text-white/80">
                         <div className="flex items-center gap-2">
                             <MapPin size={18} className="text-primary sm:size-5" />
                             {tour.location}
                         </div>
                         <div className="flex items-center gap-2">
                             <Clock size={18} className="text-primary sm:size-5" />
                             {tour.duration}
                         </div>
                    </div>
                </div>
             </div>
        </section>
    );
}
