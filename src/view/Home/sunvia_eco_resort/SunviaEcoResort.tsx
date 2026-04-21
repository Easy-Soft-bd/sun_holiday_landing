import Image from "next/image";
import Link from "next/link";
import { Leaf, MapPin, ChevronRight, Play, BedDouble, Utensils, Activity } from "lucide-react";

interface SunviaEcoResortData {
  bgImageUrl?: string;
  locationText?: string;
  subHeadline?: string;
  titlePart1?: string;
  titlePart2?: string;
  description?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

const defaultData: SunviaEcoResortData = {
  bgImageUrl: "/sailor/Sailor_Room_1.jpg",
  locationText: "Manikganj, 1 Hour from Dhaka",
  subHeadline: "Sustainable Luxury Experience",
  titlePart1: "SUNVIA",
  titlePart2: "ECO RESORT",
  description: "A premier 5-star destination combining sustainability with modern sophistication. Experience heritage cottages, organic dining, and thrilling adventures in a lush landscape.",
  ctaButtonText: "Plan Your Escape",
  ctaButtonLink: "/sunvia-eco-resort",
};

interface SunviaEcoResortProps {
  data?: SunviaEcoResortData;
}

const SunviaEcoResort = ({ data }: SunviaEcoResortProps) => {
  const ctaData = { ...defaultData, ...data } as Required<SunviaEcoResortData>;

  return (
    <section className="py-4 md:py-6 px-4 w-full">
      <div className="container mx-auto">
        <div className="relative w-full rounded-[2rem] overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center shadow-2xl group border border-emerald-900/30">

          {/* Background Image */}
          <Image
            src={ctaData.bgImageUrl}
            alt="Sunvia Eco Resort"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {/* Gradient Overlay (Left to Right) */}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/95 via-emerald-950/80 to-transparent md:w-2/3 lg:w-3/4 z-0" />
          <div className="absolute inset-0 bg-emerald-950/60 md:hidden z-0" />

          {/* Content */}
          <div className="relative z-10 w-full md:w-3/4 lg:w-3/5 p-6 md:p-12 flex flex-col gap-4 md:gap-5">

            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-emerald-300 tracking-widest uppercase">
                <Leaf className="size-3 text-emerald-400" />
                5-Star Eco-Luxury
              </span>
              <span className="flex items-center gap-1.5 text-emerald-100/90 text-xs md:text-sm font-medium">
                <MapPin size={14} className="text-amber-400" />
                {ctaData.locationText}
              </span>
            </div>

            <div className="space-y-1 md:space-y-2">
              <h1 className="font-magmawave text-4xl md:text-6xl text-white leading-none tracking-tighter">
                {ctaData.titlePart1} <span className="text-amber-400 italic">{ctaData.titlePart2}</span>
              </h1>
              <h2 className="font-gilliequest text-lg md:text-2xl text-emerald-200">
                {ctaData.subHeadline}
              </h2>
            </div>

            <p className="text-emerald-50 text-sm md:text-base leading-relaxed max-w-lg line-clamp-3">
              {ctaData.description}
            </p>

            {/* Quick Features */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2">
              <div className="flex items-center gap-2 text-emerald-200" title="Eco-Friendly Accommodations">
                <BedDouble className="size-4 md:size-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-100/90">Eco Villas</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200" title="Organic Dining">
                <Utensils className="size-4 md:size-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-100/90">Farm Dining</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-200" title="Nature Adventures">
                <Activity className="size-4 md:size-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-100/90">Adventures</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Link
                href={ctaData.ctaButtonLink}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold w-full sm:w-auto rounded-full px-6 py-3 transition-all shadow-lg group/btn"
              >
                {ctaData.ctaButtonText}
                <ChevronRight className="size-4 md:size-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link href="#view-video" className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors group/video">
                <div className="size-10 rounded-full border border-emerald-400/30 flex items-center justify-center bg-emerald-900/50 group-hover/video:bg-amber-500/20 group-hover/video:border-amber-400 transition-colors">
                  <Play className="size-4 ml-0.5 text-amber-400" fill="currentColor" />
                </div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Resort Tour</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SunviaEcoResort;
