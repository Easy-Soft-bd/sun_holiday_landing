import Image from "next/image";
import { BedDouble, Check } from "lucide-react";
import type { ResortConfig } from "../Index";

interface AccommodationSectionProps {
  accommodations: ResortConfig["accommodations"];
}

export default function AccommodationSection({ accommodations }: AccommodationSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-base-200/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-14">
          <p className="text-emerald-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            Stay With Us
          </p>
          <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter">
            Luxury{" "}
            <span className="text-emerald-600 italic">Accommodations</span>
          </h2>
          <p className="text-base-content/60 text-lg mt-4 max-w-2xl mx-auto">
            Choose from 100 thoughtfully designed units, each blending modern comfort with natural beauty.
          </p>
        </div>

        {/* Accommodation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {accommodations.map((room, index) => (
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
