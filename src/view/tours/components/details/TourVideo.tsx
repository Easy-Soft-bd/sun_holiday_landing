"use client";

import { TourPackage } from "@/src/view/tours/data/mockTours";
import { Play } from "lucide-react";

export default function TourVideo({ tour }: { tour: TourPackage }) {
    if (!tour.videoUrl) return null;

    // Extract YouTube Video ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(tour.videoUrl);

    if (!videoId) return null;

    return (
        <section className="mt-16 mb-20">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-base-100 shadow-2xl border border-base-200">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                
                <div className="p-8 md:p-12 relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">Video Experience</span>
                            <h3 className="font-magmawave text-4xl text-base-content">Virtual Tour Preview</h3>
                            <p className="text-base-content/60 mt-2 max-w-xl">Take a glimpse into your next adventure with our cinematic tour overview.</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center animate-pulse">
                                <Play size={20} className="text-primary fill-primary/20" />
                            </div>
                            <span className="text-base-content/40 font-medium">Watch Tour Highlights</span>
                        </div>
                    </div>

                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group ring-1 ring-base-content/5">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                            title={`${tour.title} video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
