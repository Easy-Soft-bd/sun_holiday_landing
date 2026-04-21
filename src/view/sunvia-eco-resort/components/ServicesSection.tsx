import {
  Shield,
  HeartPulse,
  WashingMachine,
  Car,
  Map,
  PlaneTakeoff,
  Sparkles,
} from "lucide-react";
import type { ResortConfig } from "../Index";

interface ServicesSectionProps {
  services: ResortConfig["services"];
}

const serviceIconMap: Record<string, React.ReactNode> = {
  security: <Shield className="size-7 md:size-8" />,
  medical: <HeartPulse className="size-7 md:size-8" />,
  laundry: <WashingMachine className="size-7 md:size-8" />,
  car: <Car className="size-7 md:size-8" />,
  guide: <Map className="size-7 md:size-8" />,
  helipad: <PlaneTakeoff className="size-7 md:size-8" />,
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-base-200/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-emerald-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            Guest Support
          </p>
          <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter">
            Additional{" "}
            <span className="text-emerald-600 italic">Services</span>
          </h2>
          <p className="text-base-content/60 text-lg mt-4 max-w-2xl mx-auto">
            Everything you need for a worry-free, comfortable stay at our resort.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-base-100 flex flex-col items-center gap-3 p-6 rounded-2xl border border-base-300 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg group text-center"
            >
              <div className="text-emerald-600 group-hover:text-amber-500 transition-colors duration-300">
                {serviceIconMap[service.icon] ?? (
                  <Sparkles className="size-7 md:size-8" />
                )}
              </div>
              <span className="text-xs md:text-sm font-bold text-base-content/80 leading-tight">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
