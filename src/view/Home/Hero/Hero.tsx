import Image from "next/image";
import Link from "next/link";
import { Play, MapPin } from "lucide-react";
import DeferredAdmin from "@/src/components/admin/DeferredAdmin";
import { canUseNextImage } from "@/src/lib/media";
import HeroBackgroundVideo from "./HeroBackgroundVideo";

interface HeroData {
  badgeText?: string;
  titlePart1?: string;
  titlePart2?: string;
  titlePart3?: string;
  description?: string;
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
  stat1Count?: string;
  stat1Label?: string;
  stat2Count?: string;
  stat2Label?: string;
  stat3Count?: string;
  stat3Label?: string;
  videoSrc?: string;
  backgroundImage?: string;
}

const defaultData = {
  badgeText: "Explore the Unexplored",
  titlePart1: "SUN",
  titlePart2: "HOLIDAYS",
  titlePart3: "LTD",
  description:
    "Experience world-class travel with Sun Tourism Ltd. From exotic beaches to mountain retreats, we curate memories that last a lifetime.",
  button1Text: "Find a Destination",
  button1Link: "/destinations",
  button2Text: "Watch Story",
  button2Link: "#",
  stat1Count: "500+",
  stat1Label: "Destinations",
  stat2Count: "12k+",
  stat2Label: "Happy Travelers",
  stat3Count: "24/7",
  stat3Label: "Support",
  videoSrc: "/hero/hero-video.mp4",
  backgroundImage: "/hero/hero.jpg",
};

const DEFAULT_HERO_IMAGE = "/hero/hero.jpg";

interface HeroProps {
  data?: HeroData;
}

function DefaultHeroPicture() {
  // Direct WebP src — no <picture>/jpg fallback so LCP matches the preloaded resource.
  // Inline positioning so the LCP image can paint before the large Tailwind CSS arrives.
  return (
    <img
      src="/hero/hero-640.webp"
      srcSet="/hero/hero-640.webp 640w, /hero/hero-750.webp 750w, /hero/hero-1280.webp 1280w, /hero/hero-1920.webp 1920w"
      sizes="100vw"
      alt="Beautiful tropical holiday destination"
      width={1600}
      height={1066}
      fetchPriority="high"
      decoding="sync"
      className="absolute inset-0 h-full w-full object-cover object-center"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  );
}

export default function Hero({ data }: HeroProps) {
  const heroData = { ...defaultData, ...data };
  const isDefaultHero =
    !data?.backgroundImage || data.backgroundImage === DEFAULT_HERO_IMAGE;
  const supportsImageOptimization = canUseNextImage(heroData.backgroundImage);

  return (
    <section
      className="group/hero relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-base-300 lg:min-h-screen"
      style={{
        position: "relative",
        display: "flex",
        minHeight: "90vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#e8e4d9",
      }}
    >
      <DeferredAdmin
        name="hero"
        data={heroData}
        className="absolute bottom-4 left-4 z-50"
      />

      {isDefaultHero ? (
        <DefaultHeroPicture />
      ) : supportsImageOptimization ? (
        <Image
          src={heroData.backgroundImage}
          alt="Beautiful tropical holiday destination"
          fill
          priority
          fetchPriority="high"
          quality={60}
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <Image
          src={heroData.backgroundImage}
          alt="Beautiful tropical holiday destination"
          fill
          priority
          fetchPriority="high"
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
      )}

      <HeroBackgroundVideo
        videoSrc={heroData.videoSrc}
        poster={isDefaultHero ? "/hero/hero-640.webp" : heroData.backgroundImage}
      />

      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

      <div className="container relative z-30 mx-auto px-4 text-center text-white">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-bold tracking-widest uppercase italic">
              {heroData.badgeText}
            </span>
          </div>

          <h1 className="font-magmawave text-5xl leading-tight font-black tracking-tighter md:text-7xl lg:text-8xl">
            {heroData.titlePart1}{" "}
            <span className="text-primary">{heroData.titlePart2}</span> {heroData.titlePart3}
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-gray-200 md:text-xl">
            {heroData.description}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
            <Link
              href={heroData.button1Link}
              className="btn btn-primary btn-lg rounded-full border-none px-10 text-primary-content shadow-2xl shadow-primary/40 transition-transform hover:scale-105"
            >
              <MapPin size={20} />
              {heroData.button1Text}
            </Link>

            <Link
              href={heroData.button2Link}
              className="btn btn-ghost btn-lg group rounded-full border border-white/20 px-10 text-white backdrop-blur-md hover:bg-white/10"
            >
              <Play size={20} className="fill-white transition-transform group-hover:scale-110" />
              {heroData.button2Text}
            </Link>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8 border-t border-white/10 pt-12 opacity-70 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{heroData.stat1Count}</span>
              <span className="text-xs tracking-widest uppercase">{heroData.stat1Label}</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/10">
              <span className="text-2xl font-bold">{heroData.stat2Count}</span>
              <span className="text-xs tracking-widest uppercase">{heroData.stat2Label}</span>
            </div>
            <div className="hidden flex-col items-center md:flex">
              <span className="text-2xl font-bold">{heroData.stat3Count}</span>
              <span className="text-xs tracking-widest uppercase">{heroData.stat3Label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 lg:block">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 p-1">
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
}
