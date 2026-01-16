"use client";

import { TourPackage } from "@/src/view/tours/data/mockTours";
import Image from "next/image";
import { useState } from "react";
import { Maximize2 } from "lucide-react";

export default function TourGallery({ tour }: { tour: TourPackage }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const images = tour.gallery && tour.gallery.length > 0 ? tour.gallery : [tour.image];

    return (
        <section className="mt-12">
            <h3 className="font-magmawave text-3xl mb-6">Photo Gallery</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
                {/* Featured Image */}
                <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg border border-base-200"
                     onClick={() => setSelectedImage(images[0])}>
                    <Image
                        src={images[0]}
                        alt={`${tour.title} Gallery 1`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="text-white w-8 h-8" />
                    </div>
                </div>

                {/* Other Images */}
                {images.slice(1, 5).map((img, idx) => (
                    <div 
                        key={idx} 
                        className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-md border border-base-200"
                        onClick={() => setSelectedImage(img)}
                    >
                        <Image
                            src={img}
                            alt={`${tour.title} Gallery ${idx + 2}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Maximize2 className="text-white w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox - Simple implementation */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src={selectedImage}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                         <button 
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
