import Image from "next/image";
import Link from "next/link";
import { MapPin, Leaf, ChevronRight, Trees } from "lucide-react";
import SectionAdminControl from "./SectionAdminControl";
import type { ResortHeroData } from "@/src/lib/data/sunvia-eco-resort";

interface HeroSectionProps {
  data: ResortHeroData;
  admin?: boolean;
}

export default function HeroSection({ data, admin = false }: HeroSectionProps) {
  return (
    <section className="relative h-[75vh] md:h-[85vh] overflow-hidden bg-emerald-950">
      {admin ? (
        <div className="absolute right-4 top-4 z-30">
          <SectionAdminControl section="hero" title="Edit Hero" data={data} />
        </div>
      ) : null}

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={data.backgroundImage}
          alt={`${data.titlePart1} ${data.titlePart2}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-950/50 to-emerald-950/80" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <span className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-full text-xs font-bold text-emerald-300 tracking-widest uppercase">
            <Leaf className="size-3.5 text-emerald-400" />
            {data.badgeText}
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
            <MapPin className="size-3.5 text-amber-400" />
            {data.locationText}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-magmawave text-5xl md:text-7xl lg:text-8xl leading-none tracking-tighter mb-3">
          {data.titlePart1}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-400 italic">
            {data.titlePart2}
          </span>
        </h1>

        <h2 className="font-gilliequest text-xl md:text-3xl text-emerald-200/90 mb-4">
          {data.subtitle}
        </h2>

        <p className="max-w-2xl text-base md:text-lg leading-relaxed text-white/80 mb-8">
          {data.description}
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">{data.stat1Value}</div>
            <div className="text-xs text-emerald-200/70 uppercase tracking-widest mt-1">{data.stat1Label}</div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">{data.stat2Value}</div>
            <div className="text-xs text-emerald-200/70 uppercase tracking-widest mt-1">{data.stat2Label}</div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">{data.stat3Value}</div>
            <div className="text-xs text-emerald-200/70 uppercase tracking-widest mt-1">{data.stat3Label}</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={data.ctaPrimaryHref}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-full px-8 py-3.5 transition-all shadow-lg shadow-amber-500/20 group/btn w-full sm:w-auto"
          >
            {data.ctaPrimaryText}
            <ChevronRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={data.ctaSecondaryHref}
            className="flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-bold rounded-full px-8 py-3.5 transition-all backdrop-blur-sm w-full sm:w-auto"
          >
            <Trees className="size-4" />
            {data.ctaSecondaryText}
          </Link>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base-100 to-transparent" />
    </section>
  );
}
