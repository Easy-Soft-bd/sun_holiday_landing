import Image from "next/image";
import Link from "next/link";
import SectionAdminControl from "@/src/view/sunvia-eco-resort/components/SectionAdminControl";
import PublicIconRenderer from "@/src/components/common/PublicIconRenderer";
import type { ResortHeroData } from "@/src/lib/data/sunvia-eco-resort";

interface SunviaEcoResortData {
  bgImageUrl?: string;
  locationText?: string;
  subHeadline?: string;
  titlePart1?: string;
  titlePart2?: string;
  description?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  badgeText?: string;
  badgeIcon?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  ctaSecondaryIcon?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat1Icon?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat2Icon?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat3Icon?: string;
}

const defaultData: Required<SunviaEcoResortData> = {
  bgImageUrl: "/sailor/Sailor_Room_1.jpg",
  locationText: "Manikganj, 1 Hour from Dhaka",
  subHeadline: "Sustainable Luxury Experience",
  titlePart1: "SUNVIA",
  titlePart2: "ECO RESORT",
  description: "A premier 5-star destination combining sustainability with modern sophistication. Experience heritage cottages, organic dining, and thrilling adventures in a lush landscape.",
  ctaButtonText: "Plan Your Escape",
  ctaButtonLink: "/sunvia-eco-resort",
  badgeText: "5-Star Eco-Luxury",
  badgeIcon: "LuLeaf",
  ctaSecondaryText: "Resort Tour",
  ctaSecondaryLink: "#view-video",
  ctaSecondaryIcon: "LuPlay",
  stat1Value: "Eco Villas",
  stat1Label: "Stay",
  stat1Icon: "LuBedDouble",
  stat2Value: "Farm Dining",
  stat2Label: "Dining",
  stat2Icon: "LuUtensils",
  stat3Value: "Adventures",
  stat3Label: "Activities",
  stat3Icon: "LuActivity",
};

interface SunviaEcoResortProps {
  data?: SunviaEcoResortData | ResortHeroData;
  admin?: boolean;
}

function isResortHeroData(data: SunviaEcoResortData | ResortHeroData | undefined): data is ResortHeroData {
  return Boolean(data && "backgroundImage" in data);
}

function mergeCtaData(data?: SunviaEcoResortData | ResortHeroData): {
  ctaData: Required<SunviaEcoResortData>;
  heroData?: ResortHeroData;
} {
  if (isResortHeroData(data)) {
    return {
      heroData: data,
      ctaData: {
        ...defaultData,
        bgImageUrl: data.backgroundImage || defaultData.bgImageUrl,
        locationText: data.locationText || defaultData.locationText,
        subHeadline: data.subtitle || defaultData.subHeadline,
        titlePart1: data.titlePart1 || defaultData.titlePart1,
        titlePart2: data.titlePart2 || defaultData.titlePart2,
        description: data.description || defaultData.description,
        ctaButtonText: data.ctaPrimaryText || defaultData.ctaButtonText,
        ctaButtonLink: data.ctaPrimaryHref || defaultData.ctaButtonLink,
        badgeText: data.badgeText || defaultData.badgeText,
        badgeIcon: data.badgeIcon || defaultData.badgeIcon,
        ctaSecondaryText: data.ctaSecondaryText || defaultData.ctaSecondaryText,
        ctaSecondaryLink: data.ctaSecondaryHref || defaultData.ctaSecondaryLink,
        ctaSecondaryIcon: data.ctaSecondaryIcon || defaultData.ctaSecondaryIcon,
        stat1Value: data.stat1Value || defaultData.stat1Value,
        stat1Label: data.stat1Label || defaultData.stat1Label,
        stat1Icon: data.stat1Icon || defaultData.stat1Icon,
        stat2Value: data.stat2Value || defaultData.stat2Value,
        stat2Label: data.stat2Label || defaultData.stat2Label,
        stat2Icon: data.stat2Icon || defaultData.stat2Icon,
        stat3Value: data.stat3Value || defaultData.stat3Value,
        stat3Label: data.stat3Label || defaultData.stat3Label,
        stat3Icon: data.stat3Icon || defaultData.stat3Icon,
      },
    };
  }

  return {
    ctaData: {
      ...defaultData,
      ...Object.fromEntries(
        Object.entries(data ?? {}).filter(([, value]) => value !== undefined && value !== null)
      ),
    } as Required<SunviaEcoResortData>,
  };
}

const SunviaEcoResort = async ({ data, admin = false }: SunviaEcoResortProps) => {
  const { ctaData, heroData } = mergeCtaData(data);
  const featureStats = [
    { value: ctaData.stat1Value, label: ctaData.stat1Label, icon: ctaData.stat1Icon },
    { value: ctaData.stat2Value, label: ctaData.stat2Label, icon: ctaData.stat2Icon },
    { value: ctaData.stat3Value, label: ctaData.stat3Label, icon: ctaData.stat3Icon },
  ];

  return (
    <section className="py-4 md:py-6 px-4 w-full">
      <div className="container mx-auto">
        <div className="relative w-full rounded-[2rem] overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center shadow-2xl group border border-emerald-900/30">
          {admin && heroData ? (
            <div className="absolute right-4 top-4 z-20">
              <SectionAdminControl section="hero" title="Edit Resort Hero" data={heroData} />
            </div>
          ) : null}

          {/* Background Image */}
          <Image
            src={ctaData.bgImageUrl}
            alt="Sunvia Eco Resort"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="100vw"
          />

          {/* Gradient Overlay (Left to Right) */}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/95 via-emerald-950/80 to-transparent md:w-2/3 lg:w-3/4 z-0" />
          <div className="absolute inset-0 bg-emerald-950/60 md:hidden z-0" />

          {/* Content */}
          <div className="relative z-10 w-full md:w-3/4 lg:w-3/5 p-6 md:p-12 flex flex-col gap-4 md:gap-5">

            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-emerald-300 tracking-widest uppercase">
                <PublicIconRenderer iconName={ctaData.badgeIcon} className="size-3 text-emerald-400" />
                {ctaData.badgeText}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-100/90 text-xs md:text-sm font-medium">
                <PublicIconRenderer iconName="LuMapPin" className="size-3.5 text-amber-400" />
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

            {/* Quick Features — driven by hero stats + icons from CMS */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2">
              {featureStats.map((stat) => (
                <div key={`${stat.value}-${stat.label}`} className="flex items-center gap-2 text-emerald-200" title={stat.label}>
                  <PublicIconRenderer iconName={stat.icon} className="size-4 md:size-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-100/90">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Link
                href={ctaData.ctaButtonLink}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold w-full sm:w-auto rounded-full px-6 py-3 transition-all shadow-lg group/btn"
              >
                {ctaData.ctaButtonText}
                <PublicIconRenderer iconName="LuChevronRight" className="size-4 md:size-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link href={ctaData.ctaSecondaryLink} className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors group/video">
                <div className="size-10 rounded-full border border-emerald-400/30 flex items-center justify-center bg-emerald-900/50 group-hover/video:bg-amber-500/20 group-hover/video:border-amber-400 transition-colors">
                  <PublicIconRenderer iconName={ctaData.ctaSecondaryIcon} className="size-4 ml-0.5 text-amber-400" />
                </div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{ctaData.ctaSecondaryText}</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SunviaEcoResort;
