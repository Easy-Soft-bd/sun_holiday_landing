"use client";

import { TourPackage } from "@/src/view/tours/data/mockTours";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Images, Maximize2 } from "lucide-react";
import { parseJsonArray } from "@/src/lib/tours/normalize-tour";
import { canUseNextImage } from "@/src/lib/media";

export default function TourGallery({ tour }: { tour: TourPackage }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const gallery = parseJsonArray<string>(tour.gallery);
  const images = useMemo(() => {
    const list = gallery.length > 0 ? [...gallery] : [tour.image];
    const seen = new Set<string>();
    return list.filter((url) => {
      if (!url?.trim()) return false;
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }, [gallery, tour.image]);

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 md:mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 md:mb-6">
        <div>
          <h3 className="font-magmawave text-2xl md:text-3xl">Photo gallery</h3>
          <p className="mt-1 text-sm text-base-content/60">{images.length} photo{images.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-base-content/50">
          <Images size={18} />
          <span>Tap to enlarge</span>
        </div>
      </div>

      <div className="grid auto-rows-[minmax(110px,1fr)] grid-cols-2 gap-2 sm:gap-4 md:auto-rows-[minmax(160px,200px)] md:grid-cols-4">
        {images.map((img, idx) => {
          const isFeatured = idx === 0;
          const optimized = canUseNextImage(img);
          return (
            <div
              key={`${img}-${idx}`}
              className={
                isFeatured
                  ? "relative col-span-2 row-span-2 min-h-[220px] cursor-pointer overflow-hidden rounded-2xl border border-base-200 shadow-lg group md:min-h-[280px]"
                  : "relative min-h-[120px] cursor-pointer overflow-hidden rounded-2xl border border-base-200 shadow-md group md:min-h-[160px]"
              }
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt={`${tour.title} — photo ${idx + 1}`}
                fill
                unoptimized={!optimized}
                sizes={
                  isFeatured
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 768px) 50vw, 25vw"
                }
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
                <Maximize2
                  className={`text-white opacity-0 drop-shadow-lg transition-opacity group-hover:opacity-100 ${isFeatured ? "h-8 w-8" : "h-6 w-6"}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
          role="presentation"
        >
          <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={selectedImage}
              alt="Gallery preview"
              fill
              unoptimized={!canUseNextImage(selectedImage)}
              className="object-contain"
            />
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/40"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
