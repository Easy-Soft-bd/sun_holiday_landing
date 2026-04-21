import Image from "next/image";
import Link from "next/link";
import { MapPin, Leaf, ChevronRight, Trees } from "lucide-react";
import type { ResortConfig } from "../Index";

interface HeroSectionProps {
  config: ResortConfig;
}

export default function HeroSection({ config }: HeroSectionProps) {
  return (
    <section className="relative h-[75vh] md:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={config.hero.backgroundImage}
          alt={config.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-950/50 to-emerald-950/80" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <span className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-full text-xs font-bold text-emerald-300 tracking-widest uppercase">
            <Leaf className="size-3.5 text-emerald-400" />
            {config.starRating}
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
            <MapPin className="size-3.5 text-amber-400" />
            {config.location.short}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-magmawave text-5xl md:text-7xl lg:text-8xl leading-none tracking-tighter mb-3">
          SUNVIA{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-400 italic">
            ECO RESORT
          </span>
        </h1>

        <h2 className="font-gilliequest text-xl md:text-3xl text-emerald-200/90 mb-4">
          {config.tagline}
        </h2>

        <p className="max-w-2xl text-base md:text-lg leading-relaxed text-white/80 mb-8">
          A premier {config.area} nature-focused destination with {config.totalUnits} luxury
          accommodations, set in the heart of Bangladesh&apos;s serene landscape.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">{config.area}</div>
            <div className="text-xs text-emerald-200/70 uppercase tracking-widest mt-1">Lush Grounds</div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">{config.totalUnits}+</div>
            <div className="text-xs text-emerald-200/70 uppercase tracking-widest mt-1">Luxury Units</div>
          </div>
          <div className="w-px h-10 bg-white/20 hidden md:block" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-400">{config.guestCapacity}</div>
            <div className="text-xs text-emerald-200/70 uppercase tracking-widest mt-1">Guest Capacity</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={config.hero.ctaPrimary.href}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-full px-8 py-3.5 transition-all shadow-lg shadow-amber-500/20 group/btn w-full sm:w-auto"
          >
            {config.hero.ctaPrimary.text}
            <ChevronRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={config.hero.ctaSecondary.href}
            className="flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-bold rounded-full px-8 py-3.5 transition-all backdrop-blur-sm w-full sm:w-auto"
          >
            <Trees className="size-4" />
            {config.hero.ctaSecondary.text}
          </Link>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base-100 to-transparent" />
    </section>
  );
}
