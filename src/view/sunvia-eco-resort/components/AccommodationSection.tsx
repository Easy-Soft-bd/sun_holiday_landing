import Image from "next/image";
import { BedDouble, Check } from "lucide-react";
import SectionAdminControl from "./SectionAdminControl";
import type { ResortAccommodationData } from "@/src/lib/data/sunvia-eco-resort";

interface AccommodationSectionProps {
  data: ResortAccommodationData;
  admin?: boolean;
}

export default function AccommodationSection({ data, admin = false }: AccommodationSectionProps) {
  return (
    <section className="relative py-16 md:py-24 bg-base-200/50">
      {admin ? (
        <div className="absolute right-4 top-4 z-20">
          <SectionAdminControl section="accommodations" title="Stay" data={data} />
        </div>
      ) : null}
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-14">
          <p className="text-emerald-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            {data.eyebrow}
          </p>
          <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter">
            {data.titlePrefix}{" "}
            <span className="text-emerald-600 italic">{data.titleAccent}</span>
          </h2>
          <p className="text-base-content/60 text-lg mt-4 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Accommodation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {data.items.map((room, index) => (
            <div
              key={index}
              className="bg-base-100 rounded-3xl overflow-hidden border border-base-300 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl group"
            >
              {/* Image */}
              <div className="relative h-56 md:h-64 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.type}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <BedDouble className="size-3.5" />
                  {room.type}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-3">{room.type}</h3>
                <p className="text-base-content/70 leading-relaxed mb-5">
                  {room.description}
                </p>

                {/* Amenities */}
                <div className="grid grid-cols-2 gap-2">
                  {room.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-base-content/60"
                    >
                      <Check className="size-3.5 text-emerald-500 shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
