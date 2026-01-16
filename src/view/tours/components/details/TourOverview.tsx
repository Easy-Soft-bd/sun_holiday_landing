
import { CheckCircle2, XCircle } from "lucide-react";
import { TourPackage } from "@/src/view/tours/data/mockTours";

export default function TourOverview({ tour }: { tour: TourPackage }) {
    return (
        <div className="space-y-12">
            {/* Description */}
            <div className="prose prose-lg max-w-none">
                <h3 className="font-magmawave text-3xl mb-4">Overview</h3>
                <p className="text-base-content/70 leading-relaxed">
                    {tour.description}
                </p>
            </div>

            {/* Highlights */}
            <div>
                <h3 className="font-magmawave text-3xl mb-6">Highlights</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {tour.highlights.map((highlight, idx) => (
                         <div key={idx} className="flex items-start gap-3 p-4 bg-base-100 rounded-xl border border-base-200 shadow-sm">
                            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                <CheckCircle2 size={14} />
                            </span>
                            <span className="font-medium text-base-content/80">{highlight}</span>
                         </div>
                    ))}
                </div>
            </div>

            {/* Inclusions & Exclusions */}
             <div className="grid md:grid-cols-2 gap-8">
                 <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                     <h4 className="font-bold text-lg mb-4 text-green-800 flex items-center gap-2">
                         Included
                     </h4>
                     <ul className="space-y-3">
                         {tour.includes.map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-green-900/80 text-sm">
                                 <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                                 {item}
                             </li>
                         ))}
                     </ul>
                 </div>

                 <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                     <h4 className="font-bold text-lg mb-4 text-red-800 flex items-center gap-2">
                         Not Included
                     </h4>
                     <ul className="space-y-3">
                         {tour.excludes.map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-red-900/80 text-sm">
                                 <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                 {item}
                             </li>
                         ))}
                     </ul>
                 </div>
             </div>
        </div>
    );
}
