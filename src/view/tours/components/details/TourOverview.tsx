import { CheckCircle2, XCircle } from "lucide-react";
import { TourPackage } from "@/src/view/tours/data/mockTours";
import RichTextHtml from "@/src/components/common/RichTextHtml";
import { parseJsonArray } from "@/src/lib/tours/normalize-tour";

export default function TourOverview({ tour }: { tour: TourPackage }) {
    const highlights = parseJsonArray<string>(tour.highlights);
    const includes = parseJsonArray<string>(tour.includes);
    const excludes = parseJsonArray<string>(tour.excludes);

    return (
        <div className="space-y-12">
            {/* Description */}
            <div className="max-w-none">
                <h3 className="font-magmawave text-3xl mb-4">Overview</h3>
                <RichTextHtml html={tour.description} className="leading-relaxed" />
            </div>

            {/* Highlights */}
            {highlights.length > 0 ? (
                <div>
                    <h3 className="font-magmawave text-3xl mb-6">Highlights</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {highlights.map((highlight, idx) => (
                             <div key={idx} className="flex items-start gap-3 p-4 bg-base-100 rounded-xl border border-base-200 shadow-sm">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                    <CheckCircle2 size={14} />
                                </span>
                                <span className="font-medium text-base-content/80">{highlight}</span>
                             </div>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* Inclusions & Exclusions */}
             {(includes.length > 0 || excludes.length > 0) ? (
             <div className="grid md:grid-cols-2 gap-8">
                 {includes.length > 0 ? (
                 <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                     <h4 className="font-bold text-lg mb-4 text-green-800 flex items-center gap-2">
                         Included
                     </h4>
                     <ul className="space-y-3">
                         {includes.map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-green-900/80 text-sm">
                                 <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                                 {item}
                             </li>
                         ))}
                     </ul>
                 </div>
                 ) : (
                    <div className="rounded-3xl border border-dashed border-base-300 bg-base-200/20 p-8 text-center text-sm text-base-content/50">
                        No inclusion list provided for this tour.
                    </div>
                 )}

                 {excludes.length > 0 ? (
                 <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                     <h4 className="font-bold text-lg mb-4 text-red-800 flex items-center gap-2">
                         Not included
                     </h4>
                     <ul className="space-y-3">
                         {excludes.map((item, i) => (
                             <li key={i} className="flex items-start gap-3 text-red-900/80 text-sm">
                                 <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                 {item}
                             </li>
                         ))}
                     </ul>
                 </div>
                 ) : (
                    <div className="rounded-3xl border border-dashed border-base-300 bg-base-200/20 p-8 text-center text-sm text-base-content/50">
                        No exclusion list provided for this tour.
                    </div>
                 )}
             </div>
             ) : null}
        </div>
    );
}
