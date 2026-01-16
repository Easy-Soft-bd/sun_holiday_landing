
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
        <section className="relative h-[60vh] min-h-[500px] flex items-end pb-20 overflow-hidden">
             <div className="absolute inset-0 z-0">
                <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#001030] via-[#001030]/40 to-transparent" />
             </div>

             <div className="container mx-auto px-4 relative z-10 text-white">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full">
                            {tour.category}
                        </span>
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold">
                             <Star size={12} className="fill-orange-400 text-orange-400" />
                             {tour.rating} ({tour.reviews} Reviews)
                        </div>
                    </div>

                    <h1 className="font-magmawave text-5xl md:text-7xl mb-6 leading-none">
                        {tour.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-lg text-white/80">
                         <div className="flex items-center gap-2">
                             <MapPin size={20} className="text-primary" />
                             {tour.location}
                         </div>
                         <div className="flex items-center gap-2">
                             <Clock size={20} className="text-primary" />
                             {tour.duration}
                         </div>
                    </div>
                </div>
             </div>
        </section>
    );
}
