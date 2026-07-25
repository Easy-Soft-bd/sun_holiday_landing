import PublicIconRenderer from "@/src/components/common/PublicIconRenderer";
import SectionAdminControl from "./SectionAdminControl";
import type { ResortActivitiesData } from "@/src/lib/data/sunvia-eco-resort";

interface ActivitiesSectionProps {
  data: ResortActivitiesData;
  admin?: boolean;
}

export default function ActivitiesSection({ data, admin = false }: ActivitiesSectionProps) {
  return (
    <section className="relative py-16 md:py-24 bg-emerald-950 text-white">
      {admin ? (
        <div className="absolute right-4 top-4 z-20">
          <SectionAdminControl section="activities" title="Edit Activities" data={data} />
        </div>
      ) : null}
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-amber-400 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            {data.eyebrow}
          </p>
          <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter">
            {data.titlePrefix}{" "}
            <span className="text-amber-400 italic">{data.titleAccent}</span>
          </h2>
          <p className="text-emerald-200/60 text-lg mt-4 max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 max-w-5xl mx-auto">
          {data.items.map((activity, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-800/50 hover:border-amber-500/30 rounded-2xl p-5 md:p-6 transition-all duration-300 group"
            >
              <div className="text-emerald-300 group-hover:text-amber-400 transition-colors duration-300">
                <PublicIconRenderer
                  iconName={activity.icon}
                  className="size-7 md:size-8"
                />
              </div>
              <span className="text-xs md:text-sm font-bold text-center text-emerald-100/90 uppercase tracking-wider leading-tight">
                {activity.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
