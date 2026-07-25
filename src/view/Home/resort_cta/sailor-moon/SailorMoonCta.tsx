import Image from "next/image";
import Link from "next/link";
import ClientOnly from "@/src/components/common/ClientOnly";
import PublicIconRenderer from "@/src/components/common/PublicIconRenderer";

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
    badgeText?: string;
    badgeIcon?: string;
    galleryButtonText?: string;
    galleryButtonLink?: string;
    galleryButtonIcon?: string;
    floatingIcon?: string;
    promoImageTitle?: string;
    promoImageSubtitle?: string;
}

const defaultData: Required<SailorMoonCtaData> = {
    bgImageUrl: "/sailor/sailor_ (21).jpg",
    promoImageUrl: "/sailor/Sailor_Room_1.jpg",
    locationText: "Inani Beach, Marine Drive Road",
    subHeadline: "Where The Sea Meets Celestial Splendor",
    titlePart1: "SAILOR",
    titlePart2: "MOON",
    description: "Discover a realm of magic at Sailor Moon Resort. A boutique luxury experience designed for those who seek tranquility under the moonlit waves of Cox's Bazar.",
    ctaButtonText: "Book Your Escape",
    ctaButtonLink: "/hotel/sailor-moon",
    amenities: [
        { icon: "LuSun", label: "Beach Front" },
        { icon: "LuWaves", label: "Infinity Pool" },
        { icon: "LuPalmtree", label: "Tropical Garden" },
        { icon: "LuSparkles", label: "Star Gazing" },
    ],
    badgeText: "New Escape",
    badgeIcon: "LuSparkles",
    galleryButtonText: "Experience Gallery",
    galleryButtonLink: "#view-gallery",
    galleryButtonIcon: "LuNavigation",
    floatingIcon: "LuStars",
    promoImageTitle: "Ocean View Premier Room",
    promoImageSubtitle: "Experience celestial luxury in every corner.",
};

interface SailorMoonCtaProps {
    data?: SailorMoonCtaData;
    admin?: boolean;
}

function mergeCtaData(data?: SailorMoonCtaData): Required<SailorMoonCtaData> {
    const amenities =
        Array.isArray(data?.amenities) && data.amenities.length > 0
            ? data.amenities
            : defaultData.amenities;

    return {
        ...defaultData,
        ...Object.fromEntries(
            Object.entries(data ?? {}).filter(([, value]) => value !== undefined && value !== null)
        ),
        amenities,
    } as Required<SailorMoonCtaData>;
}

async function SailorMoonCtaAdminSlot({ data }: { data: Required<SailorMoonCtaData> }) {
    const SailorMoonCtaAdminControl = (await import("./SailorMoonCtaAdminControl")).default;

    return (
        <ClientOnly>
            <div className="absolute top-8 right-8 z-50">
                <SailorMoonCtaAdminControl data={data} />
            </div>
        </ClientOnly>
    );
}

const SailorMoonCta = async ({ data, admin = false }: SailorMoonCtaProps) => {
  const ctaData = mergeCtaData(data);
  const visibleAmenities = ctaData.amenities.slice(0, 4);

  return (
    <section className="group/sailor-moon relative w-full px-4 py-4 md:py-6">
      {/* Admin Edit Controls */}
      {admin && (
          <SailorMoonCtaAdminSlot data={ctaData} />
      )}

      <div className="container mx-auto">
        <div className="relative w-full rounded-[2rem] overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center justify-end shadow-2xl group border border-white/10 bg-black">
          
          {/* Background Image */}
          <Image
            src={ctaData.bgImageUrl}
            alt="Sailor Moon Resort"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          
          {/* Gradient Overlay (Right to Left) */}
          <div className="absolute inset-0 bg-linear-to-l from-black/95 via-black/80 to-transparent md:w-2/3 lg:w-3/4 z-0 origin-right ml-auto" />
          <div className="absolute inset-0 bg-black/60 md:hidden z-0" />

          {/* Content */}
          <div className="relative z-10 w-full md:w-3/4 lg:w-3/5 p-6 md:p-12 flex flex-col items-start md:items-end md:text-right gap-4 md:gap-5">
            
            <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 w-full">
              <span className="flex items-center gap-1.5 bg-primary/20 backdrop-blur-md border border-primary/40 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-primary tracking-widest uppercase">
                <PublicIconRenderer iconName={ctaData.badgeIcon} className="size-3 text-primary animate-pulse" />
                {ctaData.badgeText}
              </span>
              <span className="flex items-center gap-1.5 text-white/80 text-xs md:text-sm font-medium border border-white/20 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full">
                <PublicIconRenderer iconName="LuMapPin" className="size-3.5 text-secondary" />
                {ctaData.locationText}
              </span>
            </div>

            <div className="space-y-1 md:space-y-2">
              <h1 className="font-magmawave text-4xl md:text-6xl text-white leading-none tracking-tighter">
                {ctaData.titlePart1} <span className="text-primary italic">{ctaData.titlePart2}</span>
              </h1>
              <h2 className="font-gilliequest text-lg md:text-2xl text-secondary">
                {ctaData.subHeadline}
              </h2>
            </div>

            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-lg line-clamp-3">
              {ctaData.description}
            </p>

            {/* Quick Amenities — driven by CMS data */}
            <div className="flex flex-wrap items-center justify-start md:justify-end gap-4 md:gap-6 pt-2 w-full">
              {visibleAmenities.map((item) => (
                <div key={`${item.icon}-${item.label}`} className="flex items-center gap-2 text-white/80" title={item.label}>
                  <PublicIconRenderer iconName={item.icon} className="size-4 md:size-5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white/90">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 pt-4 w-full">
              <Link href={ctaData.galleryButtonLink} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group/gallery order-2 sm:order-1">
                  <div className="size-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover/gallery:border-primary transition-colors">
                    <PublicIconRenderer iconName={ctaData.galleryButtonIcon} className="size-4" />
                  </div>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{ctaData.galleryButtonText}</span>
              </Link>

              <Link 
                href={ctaData.ctaButtonLink} 
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold w-full sm:w-auto rounded-full px-6 py-3 transition-all shadow-lg group/btn order-1 sm:order-2 border-none"
              >
                {ctaData.ctaButtonText}
                <PublicIconRenderer iconName="LuChevronRight" className="size-4 md:size-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SailorMoonCta;
