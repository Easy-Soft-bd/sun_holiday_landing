import Image from "next/image";
import { Leaf, Calendar, Users, Ruler } from "lucide-react";
import type { ResortConfig } from "../Index";

interface AboutSectionProps {
  config: ResortConfig;
}

const highlightIcons: Record<string, React.ReactNode> = {
  Area: <Ruler className="size-5 text-emerald-600" />,
  Established: <Calendar className="size-5 text-emerald-600" />,
  "200–250 Guests": <Users className="size-5 text-emerald-600" />,
};

function getHighlightIcon(value: string) {
  return highlightIcons[value] ?? <Leaf className="size-5 text-emerald-600" />;
}

export default function AboutSection({ config }: AboutSectionProps) {
  const { about } = config;

  return (
    <section className="py-16 md:py-24 bg-base-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Side */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="absolute inset-0 lg:-inset-4 bg-emerald-500/10 rounded-3xl -z-10 rotate-1 lg:rotate-3" />
            <Image
              src={about.image}
              alt="Sunvia Eco Resort surroundings"
              width={800}
              height={500}
              className="rounded-2xl shadow-2xl w-full object-cover aspect-video"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-5 right-4 lg:-right-5 bg-base-100 p-4 rounded-xl shadow-lg border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Leaf className="size-5" />
                <span>100% Eco-Friendly</span>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-sm font-bold uppercase tracking-wider">
              <Leaf size={16} />
              About Our Resort
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {about.heading}
            </h2>

            <p className="text-base-content/70 text-lg leading-relaxed">
              {about.description}
            </p>

            {/* Highlight Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {about.highlights.map((h) => (
                <div
                  key={h.label}
                  className="bg-base-200/80 p-4 rounded-2xl border border-base-300 text-center"
                >
                  <div className="flex justify-center mb-2">
                    {getHighlightIcon(h.value)}
                  </div>
                  <div className="text-lg md:text-xl font-bold text-emerald-800">
                    {h.value}
                  </div>
                  <div className="text-xs text-base-content/50 uppercase tracking-widest mt-1">
                    {h.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
