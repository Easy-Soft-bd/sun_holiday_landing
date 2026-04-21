import Image from "next/image";
import { PartyPopper, Users, Check } from "lucide-react";
import type { ResortConfig } from "../Index";

interface EventsSectionProps {
  events: ResortConfig["events"];
}

export default function EventsSection({ events }: EventsSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-base-200/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Image Side */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <Image
              src={events.image}
              alt="Resort event venue"
              width={800}
              height={500}
              className="rounded-3xl shadow-2xl w-full object-cover aspect-video"
            />
            {/* Capacity Badge */}
            <div className="absolute -bottom-5 right-4 lg:-right-5 bg-base-100 p-4 rounded-xl shadow-lg border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                  <Users className="size-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-base-content/50 uppercase tracking-widest">Max Cap.</div>
                  <div className="text-lg font-bold text-emerald-700">
                    {events.maxCapacity} Guests
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-sm font-bold uppercase tracking-wider">
              <PartyPopper size={16} />
              Venue & Events
            </div>

            <h2 className="font-gilliequest text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tighter">
              Events &{" "}
              <span className="text-emerald-600 italic">Celebrations</span>
            </h2>

            <p className="text-base-content/70 text-lg leading-relaxed">
              {events.description}
            </p>

            {/* Services List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {events.services.map((service) => (
                <div key={service} className="flex items-center gap-2 text-base-content/70">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
