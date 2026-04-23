import Image from "next/image";
import SectionAdminControl from "./SectionAdminControl";
import type { ResortGalleryData } from "@/src/lib/data/sunvia-eco-resort";

interface GallerySectionProps {
  data: ResortGalleryData;
  admin?: boolean;
}

export default function GallerySection({ data, admin = false }: GallerySectionProps) {
  return (
    <section id="gallery" className="relative py-16 md:py-24 bg-base-100">
      {admin ? (
        <div className="absolute right-4 top-4 z-20">
          <SectionAdminControl section="gallery" title="Edit Gallery" data={data} />
        </div>
      ) : null}
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-emerald-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            {data.eyebrow}
          </p>
          <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter">
            {data.titlePrefix}{" "}
            <span className="text-emerald-600 italic">{data.titleAccent}</span>
          </h2>
          <p className="text-base-content/60 text-lg mt-4 max-w-2xl mx-auto">{data.description}</p>
        </div>

        {/* Masonry-Style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {data.items.map((item, index) => {
            // Make first and last items span two rows for visual variety
            const isLarge = index === 0 || index === 4;
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                  isLarge ? "sm:row-span-2 h-[300px] sm:h-full" : "h-[250px] md:h-[280px]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes={isLarge ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 1024px) 100vw, 30vw"}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-bold text-sm">{item.alt}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
