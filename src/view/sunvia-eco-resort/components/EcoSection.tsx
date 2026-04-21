import Image from "next/image";
import { Leaf, Check } from "lucide-react";
import type { ResortConfig } from "../Index";

interface EcoSectionProps {
  eco: ResortConfig["ecoFeatures"];
}

export default function EcoSection({ eco }: EcoSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-base-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Side */}
          <div className="flex-1 space-y-6 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-sm font-bold uppercase tracking-wider">
              <Leaf size={16} />
              Eco-Friendly Living
            </div>

            <h2 className="font-gilliequest text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tighter">
              Living in Harmony with{" "}
              <span className="text-emerald-600 italic">Nature</span>
            </h2>

            <p className="text-base-content/70 text-lg leading-relaxed">
              {eco.description}
            </p>

            {/* Eco Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {eco.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-base-200/80 p-4 rounded-xl border border-base-300 hover:border-emerald-500/20 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-500/10 p-2 rounded-lg shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <Check className="size-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-base-content/60 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Side */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none order-1 lg:order-2">
            <div className="absolute inset-0 lg:-inset-4 bg-emerald-500/10 rounded-3xl -z-10 -rotate-1 lg:-rotate-3" />
            <Image
              src={eco.image}
              alt="Eco-friendly resort environment"
              width={800}
              height={500}
              className="rounded-2xl shadow-2xl w-full object-cover aspect-video"
            />
            {/* Floating Badge */}
            <div className="absolute -top-4 left-4 lg:-left-4 bg-emerald-600 px-4 py-2 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Leaf className="size-4" />
                <span>Carbon Neutral</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
