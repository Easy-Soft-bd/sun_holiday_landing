import { Sparkles } from "lucide-react";
import IconRenderer from "@/src/components/common/IconRenderer";
import SectionAdminControl from "./SectionAdminControl";
import type { ResortServicesData } from "@/src/lib/data/sunvia-eco-resort";

interface ServicesSectionProps {
  data: ResortServicesData;
  admin?: boolean;
}

export default function ServicesSection({ data, admin = false }: ServicesSectionProps) {
  return (
    <section className="relative py-16 md:py-24 bg-base-200/50">
      {admin ? (
        <div className="absolute right-4 top-4 z-20">
          <SectionAdminControl section="services" title="Edit Services" data={data} />
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
          <p className="text-base-content/60 text-lg mt-4 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-5xl mx-auto">
          {data.items.map((service, index) => (
            <div
              key={index}
              className="bg-base-100 flex flex-col items-center gap-3 p-6 rounded-2xl border border-base-300 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg group text-center"
            >
              <div className="text-emerald-600 group-hover:text-amber-500 transition-colors duration-300">
                <IconRenderer
                  iconName={service.icon}
                  className="size-7 md:size-8"
                />
                {!service.icon ? <Sparkles className="size-7 md:size-8" /> : null}
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
