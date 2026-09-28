import AppImage from "@/src/components/common/AppImage";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import DeferredAdmin from "@/src/components/admin/DeferredAdmin";
import type { InvestorHeroData } from "@/src/lib/data/sunvia-eco-resort";
import { defaultSunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";
import { optimizeRemoteImageUrl } from "@/src/lib/media";

interface SunviaEcoResortProps {
  data?: InvestorHeroData;
}

export default function SunviaEcoResort({ data }: SunviaEcoResortProps) {
  const hero = data?.headline ? data : defaultSunviaEcoResortPageData.investor_hero;
  const imageUrl = optimizeRemoteImageUrl(hero.backgroundImage, 1200);

  return (
    <section className="relative overflow-hidden bg-base-200 py-20 lg:py-28">
      <DeferredAdmin name="sunviaHero" data={hero} className="absolute bottom-4 left-4 z-50" />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="relative w-full lg:w-1/2">
            <div className="relative h-[400px] w-full overflow-hidden rounded-4xl shadow-2xl md:h-[600px]">
              <AppImage
                src={imageUrl}
                alt="Sunvia Hotel and Resort, a planned hospitality investment"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={55}
                loading="lazy"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-md">
                <MapPin className="size-4 text-primary" />
                <span className="text-sm font-bold tracking-wide">{hero.projectName}</span>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 hidden rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xl md:block">
              <p className="text-lg font-black text-base-content">{hero.unitValue}</p>
              <p className="text-xs font-bold tracking-widest text-base-content/70 uppercase">{hero.paymentValue}</p>
            </div>
          </div>

          <div className="w-full space-y-8 lg:w-1/2">
            <div className="space-y-4">
              <p className="text-sm font-bold tracking-[0.3em] text-base-content uppercase">{hero.eyebrow}</p>
              <h2 className="font-gilliequest text-5xl leading-none tracking-tighter md:text-6xl">{hero.headline}</h2>
              <p className="text-lg leading-relaxed text-base-content/70">{hero.supportLine}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                <p className="text-xs font-black tracking-tighter text-base-content uppercase">{hero.unitLabel}</p>
                <p className="mt-1 text-sm font-bold">{hero.unitValue}</p>
              </div>
              <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                <p className="text-xs font-black tracking-tighter text-base-content uppercase">{hero.paymentLabel}</p>
                <p className="mt-1 text-sm font-bold">{hero.paymentValue}</p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/sunvia-hotel-resort"
                className="btn btn-primary btn-lg group rounded-full px-10 text-primary-content shadow-xl shadow-primary/20"
              >
                {hero.ctaPrimaryText}
                <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
