import Image from "next/image";
import { Utensils } from "lucide-react";
import type { ResortConfig } from "../Index";

interface DiningSectionProps {
  dining: ResortConfig["dining"];
}

export default function DiningSection({ dining }: DiningSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-base-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-emerald-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            Culinary Experiences
          </p>
          <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter">
            {dining.heading.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-emerald-600 italic">
              {dining.heading.split(" ").slice(-1)}
            </span>
          </h2>
          <p className="text-base-content/60 text-lg mt-4 max-w-2xl mx-auto">
            {dining.description}
          </p>
        </div>

        {/* Cuisine Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {dining.cuisines.map((cuisine) => (
            <span
              key={cuisine}
              className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Utensils className="size-3.5" />
              {cuisine}
            </span>
          ))}
        </div>

        {/* Dining Experience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {dining.experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden border border-base-300 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative h-60 md:h-72">
                <Image
                  src={exp.image}
                  alt={exp.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />

                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {exp.name}
                  </h3>
                  <p className="text-emerald-100/80 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
