import {
  Waves,
  Baby,
  Ship,
  Bike,
  Zap,
  Fish,
  Presentation,
  Dumbbell,
  Sparkles,
  TreePine,
  SquareActivity,
  Sailboat,
} from "lucide-react";
import type { ResortConfig } from "../Index";

interface ActivitiesSectionProps {
  activities: ResortConfig["activities"];
}

const iconMap: Record<string, React.ReactNode> = {
  pool: <Waves className="size-7 md:size-8" />,
  kids: <Baby className="size-7 md:size-8" />,
  boat: <Ship className="size-7 md:size-8" />,
  kayak: <Sailboat className="size-7 md:size-8" />,
  cycling: <Bike className="size-7 md:size-8" />,
  zipline: <Zap className="size-7 md:size-8" />,
  fishing: <Fish className="size-7 md:size-8" />,
  conference: <Presentation className="size-7 md:size-8" />,
  gym: <Dumbbell className="size-7 md:size-8" />,
  spa: <Sparkles className="size-7 md:size-8" />,
  nature: <TreePine className="size-7 md:size-8" />,
  playground: <SquareActivity className="size-7 md:size-8" />,
};

export default function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-emerald-950 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-amber-400 font-bold tracking-[0.3em] uppercase text-sm mb-4">
            Fun & Adventure
          </p>
          <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter">
            Activities &{" "}
            <span className="text-amber-400 italic">Entertainment</span>
          </h2>
          <p className="text-emerald-200/60 text-lg mt-4 max-w-2xl mx-auto">
            From adrenaline-pumping adventures to peaceful spa retreats, there&apos;s something for every guest.
          </p>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 max-w-5xl mx-auto">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-800/50 hover:border-amber-500/30 rounded-2xl p-5 md:p-6 transition-all duration-300 group"
            >
              <div className="text-emerald-300 group-hover:text-amber-400 transition-colors duration-300">
                {iconMap[activity.icon] ?? <Sparkles className="size-7 md:size-8" />}
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
