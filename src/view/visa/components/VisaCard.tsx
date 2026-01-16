
import { VisaService } from "../data/visaData";
import { Clock, Wallet, Calendar } from "lucide-react";
import Image from "next/image";

export default function VisaCard({ visa }: { visa: VisaService }) {
    return (
        <div className="group bg-white rounded-[2rem] overflow-hidden border border-base-200 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full">
            {/* Image & Category */}
            <div className="relative h-56 overflow-hidden">
                <Image 
                    src={visa.image} 
                    alt={visa.country}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                    <span className="text-base">{visa.flag}</span>
                    {visa.country}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-sm font-medium bg-primary/90 px-3 py-1 rounded-lg">
                        {visa.category} Visa
                    </span>
                    <div className="flex items-center gap-1 text-sm font-bold">
                        <Wallet size={14} className="text-accent" />
                        BDT {visa.price.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <p className="text-base-content/60 text-sm line-clamp-2 mb-6">
                    {visa.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <Clock size={14} className="text-primary" />
                        <span>{visa.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <Calendar size={14} className="text-primary" />
                        <span>{visa.validity}</span>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-base-100 flex items-center justify-between">
                    <button className="text-sm font-bold text-primary hover:text-secondary transition-colors underline-offset-4 hover:underline">
                        Requirements
                    </button>
                    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-primary transition-all active:scale-95">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
}
