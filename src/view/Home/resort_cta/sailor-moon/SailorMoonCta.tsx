import Image from "next/image";
import Link from "next/link";
import { Sparkles, MapPin, ChevronRight, Navigation, Sunset, Waves, Palmtree } from "lucide-react";
import SailorMoonCtaEditButton from "./SailorMoonCtaEditButton";
import ClientOnly from "@/src/components/common/ClientOnly";
import IconRenderer from "@/src/components/common/IconRenderer";


<<<<<<< HEAD
=======

>>>>>>> 5917b2a (draft)
interface Amenity {
    icon: string;
    label: string;
}

interface SailorMoonCtaData {
    bgImageUrl?: string;
    locationText?: string;
    subHeadline?: string;
    titlePart1?: string;
    titlePart2?: string;
    description?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
<<<<<<< HEAD
    amenities?: Amenity[]; // keeping it in the interface to not break any existing data model, but won't render it heavily
=======
    amenities?: Amenity[];
    badgeText?: string;
    badgeIcon?: string;
    galleryButtonText?: string;
    galleryButtonLink?: string;
    galleryButtonIcon?: string;
    floatingIcon?: string;
    promoImageTitle?: string;
    promoImageSubtitle?: string;
>>>>>>> 3ded553 (123)
}

const defaultData: SailorMoonCtaData = {
    bgImageUrl: "/sailor/sailor_ (21).jpg",
    locationText: "Inani Beach, Marine Drive Road",
    subHeadline: "Where The Sea Meets Celestial Splendor",
    titlePart1: "SAILOR",
    titlePart2: "MOON",
    description: "Discover a realm of magic at Sailor Moon Resort. A boutique luxury experience designed for those who seek tranquility under the moonlit waves of Cox's Bazar.",
    ctaButtonText: "Book Your Escape",
    ctaButtonLink: "/hotel/sailor-moon",
<<<<<<< HEAD
=======
    amenities: [
        { icon: "Sunset", label: "Beach Front" },
        { icon: "Waves", label: "Infinity Pool" },
        { icon: "Palmtree", label: "Tropical Garden" },
        { icon: "Sparkles", label: "Star Gazing" },
    ],
    badgeText: "New Escape",
    badgeIcon: "Sparkles",
    galleryButtonText: "Experience Gallery",
    galleryButtonLink: "#view-gallery",
    galleryButtonIcon: "Navigation",
    floatingIcon: "Stars",
    promoImageTitle: "Ocean View Premier Room",
    promoImageSubtitle: "Experience celestial luxury in every corner.",
>>>>>>> 3ded553 (123)
};

interface SailorMoonCtaProps {
    data?: SailorMoonCtaData;
    admin?: boolean;
}

const SailorMoonCta = ({ data, admin = false }: SailorMoonCtaProps) => {
  const ctaData = { ...defaultData, ...data } as Required<SailorMoonCtaData>;

  return (
    <section className="py-4 md:py-6 px-4 w-full relative">
      {/* Admin Edit Controls */}
      {admin && (
          <ClientOnly>
              <div className="absolute top-8 right-8 z-50">
                  <SailorMoonCtaEditButton data={ctaData} />
              </div>
          </ClientOnly>
      )}

      <div className="container mx-auto">
        <div className="relative w-full rounded-[2rem] overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center justify-end shadow-2xl group border border-white/10 bg-black">
          
<<<<<<< HEAD
          {/* Background Image */}
          <Image
            src={ctaData.bgImageUrl}
            alt="Sailor Moon Resort"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          
          {/* Gradient Overlay (Right to Left) */}
          <div className="absolute inset-0 bg-linear-to-l from-black/95 via-black/80 to-transparent md:w-2/3 lg:w-3/4 z-0 origin-right ml-auto" />
          <div className="absolute inset-0 bg-black/60 md:hidden z-0" />
=======
          {/* 2. Content Column */}
          <div className="w-full lg:w-3/5 space-y-8 order-2 lg:order-1">
            {/* Glassmorphism Card */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-4xl p-6 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              
              <div className="flex flex-col gap-6 md:gap-8">
                {/* Badge & Location */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-1.5 rounded-full">
                    <IconRenderer iconName={ctaData.badgeIcon} className="size-3 md:size-4 text-primary animate-pulse" />
                    <span className="text-[10px] md:text-xs font-bold text-primary tracking-widest uppercase">{ctaData.badgeText}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin size={14} className="text-secondary" />
                    <span className="text-xs md:text-sm font-medium tracking-wide">{ctaData.locationText}</span>
                  </div>
                </div>
>>>>>>> 3ded553 (123)

          {/* Content */}
          <div className="relative z-10 w-full md:w-3/4 lg:w-3/5 p-6 md:p-12 flex flex-col items-start md:items-end md:text-right gap-4 md:gap-5">
            
            <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 w-full">
              <span className="flex items-center gap-1.5 bg-primary/20 backdrop-blur-md border border-primary/40 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-primary tracking-widest uppercase">
                <Sparkles className="size-3 text-primary animate-pulse" />
                New Escape
              </span>
              <span className="flex items-center gap-1.5 text-white/80 text-xs md:text-sm font-medium border border-white/20 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full">
                <MapPin size={14} className="text-secondary" />
                {ctaData.locationText}
              </span>
            </div>

<<<<<<< HEAD
            <div className="space-y-1 md:space-y-2">
              <h1 className="font-magmawave text-4xl md:text-6xl text-white leading-none tracking-tighter">
                {ctaData.titlePart1} <span className="text-primary italic">{ctaData.titlePart2}</span>
              </h1>
              <h2 className="font-gilliequest text-lg md:text-2xl text-secondary">
                {ctaData.subHeadline}
              </h2>
            </div>
=======
                {/* Amenities Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-2">
                  {ctaData.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 md:gap-3 group/item">
                      <div className="bg-white/10 p-1.5 md:p-2 rounded-lg group-hover/item:bg-primary/20 transition-colors">
                        <IconRenderer iconName={item.icon} className="size-4 md:size-5 text-secondary group-hover/item:text-primary transition-colors" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-tighter">{item.label}</span>
                    </div>
                  ))}
                </div>
>>>>>>> 5917b2a (draft)

<<<<<<< HEAD
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-lg line-clamp-3">
              {ctaData.description}
            </p>

            {/* Quick Amenities */}
            <div className="flex flex-wrap items-center justify-start md:justify-end gap-4 md:gap-6 pt-2 w-full">
              <div className="flex items-center gap-2 text-white/80" title="Beach Front">
                 <Sunset className="size-4 md:size-5 text-primary" />
                 <span className="text-xs font-bold uppercase tracking-widest text-white/90">Beach Front</span>
              </div>
              <div className="flex items-center gap-2 text-white/80" title="Infinity Pool">
                 <Waves className="size-4 md:size-5 text-primary" />
                 <span className="text-xs font-bold uppercase tracking-widest text-white/90">Infinity Pool</span>
              </div>
              <div className="flex items-center gap-2 text-white/80" title="Tropical Garden">
                 <Palmtree className="size-4 md:size-5 text-primary" />
                 <span className="text-xs font-bold uppercase tracking-widest text-white/90">Gardens</span>
=======
                {/* CTA Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 pt-4">
                  <Link 
                    href={ctaData.ctaButtonLink} 
                    className="btn btn-primary w-full sm:w-auto rounded-full px-8 md:px-10 text-white shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all group/btn border-none"
                  >
                    {ctaData.ctaButtonText}
                    <ChevronRight className="size-4 md:size-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link href={ctaData.galleryButtonLink} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group/gallery">
                     <div className="size-8 md:size-10 rounded-full border border-white/20 flex items-center justify-center group-hover/gallery:border-primary transition-colors">
                        <IconRenderer iconName={ctaData.galleryButtonIcon} className="size-4 md:size-5" />
                     </div>
                     <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{ctaData.galleryButtonText}</span>
                  </Link>
                </div>
              </div>

              {/* Decorative Floating Icons */}
              <div className="absolute top-10 right-10 text-primary/10 animate-float hidden lg:block">
<<<<<<< HEAD
                <DynamicIcon name={ctaData.floatingIcon} className="size-[100px]" />
>>>>>>> 3ded553 (123)
=======
                <IconRenderer iconName={ctaData.floatingIcon} className="size-[100px]" />
>>>>>>> 5917b2a (draft)
              </div>
            </div>

<<<<<<< HEAD
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 pt-4 w-full">
              <Link href="#view-gallery" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group/gallery order-2 sm:order-1">
                  <div className="size-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover/gallery:border-primary transition-colors">
                    <Navigation className="size-4" />
                  </div>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Experience Gallery</span>
              </Link>

              <Link 
                href={ctaData.ctaButtonLink} 
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold w-full sm:w-auto rounded-full px-6 py-3 transition-all shadow-lg group/btn order-1 sm:order-2 border-none"
              >
                {ctaData.ctaButtonText}
                <ChevronRight className="size-4 md:size-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
=======
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
                <p className="text-white font-bold text-sm tracking-wide">{ctaData.promoImageTitle}</p>
                <p className="text-white/60 text-xs mt-1">{ctaData.promoImageSubtitle}</p>
              </div>
              
              {/* Mobile Mobile Floatings */}
              <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm p-3 rounded-full md:hidden animate-sun-pulse">
                <Sparkles className="size-5 text-white" />
              </div>
>>>>>>> 3ded553 (123)
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SailorMoonCta;