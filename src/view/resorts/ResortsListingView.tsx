import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Waves,
  Building2,
  ChevronRight,
  Hotel,
  Sparkles,
  Calendar,
  Users,
} from "lucide-react";
import ClientOnly from "@/src/components/common/ClientOnly";
import type { ResortsListingPageData, ResortsListingResort } from "@/src/lib/data/resorts-listing-page";
import { mergeResortsListingPageData } from "@/src/lib/data/resorts-listing-page";

type Props = {
  data?: Partial<ResortsListingPageData> | null;
  admin?: boolean;
};

function FeatureBadge({ feature }: { feature: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
      <Sparkles className="size-3" />
      {feature}
    </span>
  );
}

function ResortCard({ resort }: { resort: ResortsListingResort }) {
  const CategoryIcon = resort.category === "beach" ? Waves : Building2;
  const isComingSoon = resort.status === "coming-soon";

  return (
    <div className="group overflow-hidden rounded-3xl border border-base-300 bg-base-100 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl">
      <div className="relative h-[300px] overflow-hidden">
        <Image src={resort.image} alt={resort.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {isComingSoon ? (
          <div className="absolute right-4 top-4 rounded-full bg-warning px-4 py-2 text-xs uppercase tracking-wider text-warning-content shadow-lg">
            Coming Soon
          </div>
        ) : null}

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur-md">
          <CategoryIcon className="size-4" />
          <span className="text-xs capitalize">{resort.category} Resort</span>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-1">
          {Array.from({ length: resort.rating }).map((_, i) => (
            <Star key={i} className="size-5 fill-primary text-primary" />
          ))}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <h3 className="mb-2 font-gilliequest text-3xl leading-tight tracking-tighter transition-colors group-hover:text-primary">
            {resort.name}
          </h3>
          <p className="mb-2 text-sm uppercase tracking-wider text-primary">{resort.tagline}</p>
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <MapPin className="size-4 text-primary" />
            <span>{resort.location}</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-base-content/70">{resort.description}</p>

        <div className="flex flex-wrap gap-2">
          {resort.features.slice(0, 3).map((feature, index) => (
            <FeatureBadge key={`${feature}-${index}`} feature={feature} />
          ))}
          {resort.features.length > 3 ? (
            <span className="self-center text-xs text-base-content/40">+{resort.features.length - 3} more</span>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-base-300 pt-4">
          {resort.established ? (
            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <Calendar className="size-4 text-primary" />
              <span>Est. {resort.established}</span>
            </div>
          ) : (
            <span />
          )}

          <Link
            href={resort.href}
            className={`btn ${isComingSoon ? "btn-outline" : "btn-primary"} btn-sm group/btn rounded-full px-6`}
          >
            {isComingSoon ? "Learn More" : "View Details"}
            <ChevronRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

async function ResortsListingAdminSlot({ data }: { data: ResortsListingPageData }) {
  const ResortsListingAdminControl = (await import("./ResortsListingAdminControl")).default;
  return (
    <ClientOnly>
      <div className="absolute right-4 top-4 z-50 md:right-8 md:top-8">
        <ResortsListingAdminControl data={data} />
      </div>
    </ClientOnly>
  );
}

export default async function ResortsListingView({ data, admin = false }: Props) {
  const page = mergeResortsListingPageData(data);
  const resorts = page.resorts;
  const beachResorts = resorts.filter((r) => r.category === "beach");
  const cityHotels = resorts.filter((r) => r.category === "city");

  return (
    <div className="group/resorts-listing min-h-screen bg-base-100">
      <section className="relative h-[60vh] overflow-hidden md:h-[70vh]">
        {admin ? <ResortsListingAdminSlot data={page} /> : null}
        <div className="absolute inset-0">
          <Image
            src={page.heroBackgroundImage}
            alt="Sun Tourism Resorts"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative container mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <Hotel className="size-4 text-primary" />
            <span className="text-sm tracking-wide">{page.heroBadge}</span>
          </div>

          <h1 className="mb-4 font-magmawave text-5xl leading-none tracking-tighter md:text-7xl lg:text-8xl">
            {page.heroTitleBefore} <span className="text-primary italic">{page.heroTitleAccent}</span>
          </h1>

          <p className="mb-6 text-xl uppercase tracking-[0.2em] text-primary md:text-2xl">{page.heroTagline}</p>

          <p className="max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">{page.heroDescription}</p>
        </div>
      </section>

      <section className="border-y border-base-300 bg-base-200 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 w-fit rounded-2xl bg-primary/10 p-4">
                <Hotel className="size-8 text-primary" />
              </div>
              <div className="mb-1 text-3xl font-black text-primary md:text-4xl">{resorts.length}</div>
              <div className="text-xs uppercase tracking-wider text-base-content/60 md:text-sm">Properties</div>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 w-fit rounded-2xl bg-primary/10 p-4">
                <Waves className="size-8 text-primary" />
              </div>
              <div className="mb-1 text-3xl font-black text-primary md:text-4xl">{beachResorts.length}</div>
              <div className="text-xs uppercase tracking-wider text-base-content/60 md:text-sm">Beach Resorts</div>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 w-fit rounded-2xl bg-primary/10 p-4">
                <Building2 className="size-8 text-primary" />
              </div>
              <div className="mb-1 text-3xl font-black text-primary md:text-4xl">{cityHotels.length}</div>
              <div className="text-xs uppercase tracking-wider text-base-content/60 md:text-sm">City Hotels</div>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 w-fit rounded-2xl bg-primary/10 p-4">
                <Users className="size-8 text-primary" />
              </div>
              <div className="mb-1 text-3xl font-black text-primary md:text-4xl">{page.statGuestsValue}</div>
              <div className="text-xs uppercase tracking-wider text-base-content/60 md:text-sm">{page.statGuestsLabel}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Waves className="size-6 text-primary" />
              <p className="text-sm uppercase tracking-[0.3em] text-primary">{page.beachSectionEyebrow}</p>
            </div>
            <h2 className="mb-4 font-gilliequest text-4xl leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              {page.beachSectionTitleBefore}{" "}
              <span className="text-primary italic">{page.beachSectionTitleAccent}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-base-content/70">{page.beachSectionDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {beachResorts.map((resort) => (
              <ResortCard key={resort.id} resort={resort} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base-200 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Building2 className="size-6 text-primary" />
              <p className="text-sm uppercase tracking-[0.3em] text-primary">{page.citySectionEyebrow}</p>
            </div>
            <h2 className="mb-4 font-gilliequest text-4xl leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              {page.citySectionTitleBefore}{" "}
              <span className="text-primary italic">{page.citySectionTitleAccent}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-base-content/70">{page.citySectionDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cityHotels.map((resort) => (
              <ResortCard key={resort.id} resort={resort} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-12">
              <h2 className="mb-6 font-gilliequest text-4xl leading-tight tracking-tighter md:text-5xl">
                {page.ctaTitleBefore} <span className="text-primary italic">{page.ctaTitleAccent}</span> Your Stay?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-base-content/70">{page.ctaDescription}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={page.ctaPrimaryHref}
                  className="btn btn-primary btn-lg group rounded-full px-12 text-white shadow-xl shadow-primary/20"
                >
                  {page.ctaPrimaryLabel}
                  <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href={page.ctaSecondaryHref} className="btn btn-outline btn-lg rounded-full px-12">
                  {page.ctaSecondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
