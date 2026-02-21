import Image from "next/image";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { 
    Sparkles, 
    MapPin, 
    Stars, 
    Navigation,
    ChevronRight,
    LucideIcon
} from "lucide-react";
import SailorMoonCtaEditButton from "./SailorMoonCtaEditButton";
import ClientOnly from "@/src/components/common/ClientOnly";

// Helper to get Lucide icon from string name
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    // @ts-ignore
    const IconComponent = LucideIcons[name] || Sparkles;
    return <IconComponent className={className} />;
};

interface Amenity {
    icon: string;
    label: string;
}

interface SailorMoonCtaData {
    bgImageUrl?: string;
    promoImageUrl?: string;
    locationText?: string;
    subHeadline?: string;
    titlePart1?: string;
    titlePart2?: string;
    description?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
    amenities?: Amenity[];
}

const defaultData: SailorMoonCtaData = {
    bgImageUrl: "/sailor/sailor_ (21).jpg",
    promoImageUrl: "/sailor/Sailor_Room_1.jpg",
    locationText: "Inani Beach, Marine Drive Road",
    subHeadline: "Where The Sea Meets The Celestial Splendor",
    titlePart1: "SAILOR",
    titlePart2: "MOON",
    description: "Discover a realm of magic at Sailor Moon Resort. A boutique luxury experience designed for those who seek tranquility under the moonlit waves of Cox's Bazar.",
    ctaButtonText: "Book Your Escape",
    ctaButtonLink: "/hotel/sailor-moon",
    amenities: [
        { icon: "Sunset", label: "Beach Front" },
        { icon: "Waves", label: "Infinity Pool" },
        { icon: "Palmtree", label: "Tropical Garden" },
        { icon: "Sparkles", label: "Star Gazing" },
    ],
};

interface SailorMoonCtaProps {
    data?: SailorMoonCtaData;
    admin?: boolean;
}

const SailorMoonCta = ({ data, admin = false }: SailorMoonCtaProps) => {
  const ctaData = { ...defaultData, ...data } as Required<SailorMoonCtaData>;

  return (
    <section className="relative w-full overflow-hidden bg-black group/sailor-moon">
      {/* Admin Edit Controls */}
      {admin && (
          <ClientOnly>
              <div className="absolute top-4 left-4 z-50">
                  <SailorMoonCtaEditButton data={ctaData} />
              </div>
          </ClientOnly>
      )}

      {/* 1. Immersive Background (Fixed/Parallax-like) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ctaData.bgImageUrl}
          alt="Sailor Moon Resort Cox's Bazar background"
          fill
          className="object-cover opacity-40 md:opacity-100"
        />
        {/* Luminous Overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent hidden md:block" />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black/90 md:hidden" />
      </div>

      <div className="container mx-auto relative z-10 py-12 px-4 md:py-24 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* 2. Content Column */}
          <div className="w-full lg:w-3/5 space-y-8 order-2 lg:order-1">
            {/* Glassmorphism Card */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-4xl p-6 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              
              <div className="flex flex-col gap-6 md:gap-8">
                {/* Badge & Location */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-1.5 rounded-full">
                    <Sparkles className="size-3 md:size-4 text-primary animate-pulse" />
                    <span className="text-[10px] md:text-xs font-bold text-primary tracking-widest uppercase">New Escape</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin size={14} className="text-secondary" />
                    <span className="text-xs md:text-sm font-medium tracking-wide">{ctaData.locationText}</span>
                  </div>
                </div>

                {/* Headlines */}
                <div className="space-y-4">
                  <h1 className="font-magmawave text-5xl md:text-7xl lg:text-8xl text-white leading-[0.8] tracking-tighter">
                    {ctaData.titlePart1} <span className="text-primary italic">{ctaData.titlePart2}</span>
                  </h1>
                  <h2 className="font-gilliequest text-xl md:text-3xl lg:text-4xl text-secondary leading-tight max-w-2xl">
                    {ctaData.subHeadline}
                  </h2>
                  <p className="text-white/60 text-sm md:text-lg max-w-xl leading-relaxed">
                    {ctaData.description}
                  </p>
                </div>

                {/* Amenities Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-2">
                  {ctaData.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 md:gap-3 group/item">
                      <div className="bg-white/10 p-1.5 md:p-2 rounded-lg group-hover/item:bg-primary/20 transition-colors">
                        <DynamicIcon name={item.icon} className="size-4 md:size-5 text-secondary group-hover/item:text-primary transition-colors" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-tighter">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 pt-4">
                  <Link 
                    href={ctaData.ctaButtonLink} 
                    className="btn btn-primary w-full sm:w-auto rounded-full px-8 md:px-10 text-white shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all group/btn border-none"
                  >
                    {ctaData.ctaButtonText}
                    <ChevronRight className="size-4 md:size-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link href="#view-gallery" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group/gallery">
                     <div className="size-8 md:size-10 rounded-full border border-white/20 flex items-center justify-center group-hover/gallery:border-primary transition-colors">
                        <Navigation className="size-4 md:size-5" />
                     </div>
                     <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Experience Gallery</span>
                  </Link>
                </div>
              </div>

              {/* Decorative Floating Icons */}
              <div className="absolute top-10 right-10 text-primary/10 animate-float hidden lg:block">
                <Stars size={100} strokeWidth={0.5} />
              </div>
            </div>
          </div>

          {/* 3. Image Column (Prominent on Mobile) */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2">
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[3/4] w-full rounded-4xl overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src={ctaData.promoImageUrl}
                alt="Sailor Moon Resort Premium Room"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Image Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <p className="text-white font-bold text-sm tracking-wide">Ocean View Premier Room</p>
                <p className="text-white/60 text-xs mt-1">Experience celestial luxury in every corner.</p>
              </div>
              
              {/* Mobile Mobile Floatings */}
              <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm p-3 rounded-full md:hidden animate-sun-pulse">
                <Sparkles className="size-5 text-white" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SailorMoonCta;