import Image from "next/image";
import Link from "next/link";
import DeferredAdmin from "@/src/components/admin/DeferredAdmin";
import PublicIconRenderer from "@/src/components/common/PublicIconRenderer";
import type { ResortHeroData } from "@/src/lib/data/sunvia-eco-resort";
import { optimizeRemoteImageUrl } from "@/src/lib/media";

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
  description:
    "A premier 5-star destination combining sustainability with modern sophistication. Experience heritage cottages, organic dining, and thrilling adventures in a lush landscape.",
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
}

function isResortHeroData(
  data: SunviaEcoResortData | ResortHeroData | undefined,
): data is ResortHeroData {
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
        Object.entries(data ?? {}).filter(([, value]) => value !== undefined && value !== null),
      ),
    } as Required<SunviaEcoResortData>,
  };
}

const SunviaEcoResort = async ({ data }: SunviaEcoResortProps) => {
  const { ctaData, heroData } = mergeCtaData(data);
  const featureStats = [
    { value: ctaData.stat1Value, label: ctaData.stat1Label, icon: ctaData.stat1Icon },
    { value: ctaData.stat2Value, label: ctaData.stat2Label, icon: ctaData.stat2Icon },
    { value: ctaData.stat3Value, label: ctaData.stat3Label, icon: ctaData.stat3Icon },
  ];

  return (
    <section className="w-full px-4 py-4 md:py-6">
      <div className="container mx-auto">
        <div className="group relative flex min-h-[300px] w-full items-center overflow-hidden rounded-[2rem] border border-emerald-900/30 shadow-2xl md:min-h-[400px]">
          {heroData ? (
            <DeferredAdmin
              name="sunviaHero"
              data={heroData}
              className="absolute top-4 right-4 z-20"
            />
          ) : null}

          <Image
            src={optimizeRemoteImageUrl(ctaData.bgImageUrl, 1200)}
            alt="Sunvia Eco Resort"
            fill
            loading="lazy"
            quality={55}
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 800px"
          />

          <div className="absolute inset-0 z-0 bg-linear-to-r from-emerald-950/95 via-emerald-950/80 to-transparent md:w-2/3 lg:w-3/4" />
          <div className="absolute inset-0 z-0 bg-emerald-950/60 md:hidden" />

          <div className="relative z-10 flex w-full flex-col gap-4 p-6 md:w-3/4 md:gap-5 md:p-12 lg:w-3/5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-300 uppercase backdrop-blur-md md:text-xs">
                <PublicIconRenderer iconName={ctaData.badgeIcon} className="size-3 text-emerald-400" />
                {ctaData.badgeText}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-100/90 md:text-sm">
                <PublicIconRenderer iconName="LuMapPin" className="size-3.5 text-amber-400" />
                {ctaData.locationText}
              </span>
            </div>

            <div className="space-y-1 md:space-y-2">
              <h1 className="font-magmawave text-4xl leading-none tracking-tighter text-white md:text-6xl">
                {ctaData.titlePart1}{" "}
                <span className="text-amber-400 italic">{ctaData.titlePart2}</span>
              </h1>
              <h2 className="font-gilliequest text-lg text-emerald-200 md:text-2xl">
                {ctaData.subHeadline}
              </h2>
            </div>

            <p className="line-clamp-3 max-w-lg text-sm leading-relaxed text-emerald-50 md:text-base">
              {ctaData.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 md:gap-6">
              {featureStats.map((stat) => (
                <div
                  key={`${stat.value}-${stat.label}`}
                  className="flex items-center gap-2 text-emerald-200"
                  title={stat.label}
                >
                  <PublicIconRenderer iconName={stat.icon} className="size-4 text-amber-400 md:size-5" />
                  <span className="text-xs font-bold tracking-widest text-emerald-100/90 uppercase">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start gap-4 pt-4 sm:flex-row sm:items-center">
              <Link
                href={ctaData.ctaButtonLink}
                className="group/btn flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-bold text-emerald-950 shadow-lg transition-all hover:bg-amber-400 sm:w-auto"
              >
                {ctaData.ctaButtonText}
                <PublicIconRenderer
                  iconName="LuChevronRight"
                  className="size-4 transition-transform group-hover/btn:translate-x-1 md:size-5"
                />
              </Link>

              <Link
                href={ctaData.ctaSecondaryLink}
                className="group/video flex items-center gap-2 text-emerald-100 transition-colors hover:text-white"
              >
                <div className="flex size-10 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-900/50 transition-colors group-hover/video:border-amber-400 group-hover/video:bg-amber-500/20">
                  <PublicIconRenderer
                    iconName={ctaData.ctaSecondaryIcon}
                    className="ml-0.5 size-4 text-amber-400"
                  />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase md:text-sm">
                  {ctaData.ctaSecondaryText}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SunviaEcoResort;
