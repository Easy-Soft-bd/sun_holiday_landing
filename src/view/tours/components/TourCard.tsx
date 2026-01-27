
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TourPackage } from "../data/mockTours";

const currencyFormatter = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

interface TourProps {
    id: string | number;
    title: string;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    duration: string;
    price: number;
}

export default function TourCard({ tour }: { tour: TourProps | any }) {
    return (
        <div className="group bg-base-100 rounded-3xl overflow-hidden shadow-sm border border-base-200 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-base-100/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
                    {tour.category}
                </div>
                <div className="absolute top-4 right-4 bg-base-100/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star size={14} className="fill-orange-400 text-orange-400" />
                    {tour.rating} <span className="text-base-content/50 font-normal">({tour.reviews})</span>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-1.5 text-base-content/60 text-sm mb-2">
                            <MapPin size={14} />
                            {tour.location}
                        </div>
                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {tour.title}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-base-content/70 mb-6 bg-base-200/50 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-primary" />
                        {tour.duration}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-base-200 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs text-base-content/60 font-medium uppercase mb-1">Starting From</p>
                        <p className="text-2xl font-black text-primary">
                            {currencyFormatter.format(tour.price)}
                        </p>
                    </div>
                    <Link 
                        href={`/tours/${tour.id}`}
                        className="btn btn-primary btn-sm rounded-full text-white px-4"
                    >
                        Details <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
