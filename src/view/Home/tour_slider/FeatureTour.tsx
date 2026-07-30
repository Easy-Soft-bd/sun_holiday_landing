"use client";

import { ArrowRight, Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { TourRecord } from "@/src/lib/data/tours";
import { canUseNextImage, optimizeRemoteImageUrl } from "@/src/lib/media";
import { getTourPublicPath } from "@/src/lib/tours/public-path";
import { FeatureTourSkeleton } from "@/src/view/Home/HomeSectionsSkeleton";

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

type FeaturedTour = Pick<
  TourRecord,
  "id" | "slug" | "title" | "image" | "category" | "rating" | "location" | "duration" | "price"
>;

type FeatureTourProps = {
  /** When omitted (home page), tours are fetched client-side to keep RSC HTML slim. */
  tours?: FeaturedTour[];
};

const FeatureTour = ({ tours: initialTours }: FeatureTourProps) => {
  const [tours, setTours] = useState<FeaturedTour[]>(initialTours ?? []);
  const [loaded, setLoaded] = useState(Boolean(initialTours?.length));

  useEffect(() => {
    if (initialTours?.length) {
      setTours(initialTours);
      setLoaded(true);
      return;
    }

    let cancelled = false;

    fetch("/api/home/featured-tours")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: FeaturedTour[]) => {
        if (!cancelled && Array.isArray(data)) {
          setTours(data);
        }
      })
      .catch(() => {
        if (!cancelled) setTours([]);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [initialTours]);

  if (!loaded) {
    return <FeatureTourSkeleton />;
  }

  if (!tours.length) {
    return null;
  }

  return (
    <section className="py-20 bg-base-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-base-content/70 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary" aria-hidden="true" />
              Featured Destinations
            </span>
            <h2 className="text-4xl md:text-5xl font-gilliequest uppercase leading-tight">
              Popular <span className="text-primary italic">Tour </span>Packages
            </h2>
            <p className="text-gray-500 text-lg">
              Discover our most loved destinations, curated for unforgettable experiences.
            </p>
          </div>
          <Link
            href="/tours"
            prefetch={false}
            className="btn btn-outline btn-md rounded-full px-6 min-h-11 h-11 inline-flex items-center"
          >
            Explore All Tours
          </Link>
        </div>

        <div className="overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-6 snap-x snap-mandatory">
            {tours.map((tour) => {
              const detailHref = getTourPublicPath(tour);
              if (!detailHref) return null;

              const imageSrc = optimizeRemoteImageUrl(tour.image, 800);
              const supportsImageOptimization = canUseNextImage(imageSrc);

              return (
                <article
                  key={tour.id}
                  className="snap-start min-w-[85vw] sm:min-w-[60vw] lg:min-w-[32%] flex-1"
                >
                  <div className="group relative h-[450px] rounded-3xl overflow-hidden bg-base-100 border border-base-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0">
                      <Image
                        src={imageSrc}
                        alt={tour.title}
                        fill
                        loading="lazy"
                        quality={55}
                        unoptimized={!supportsImageOptimization}
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 32vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    </div>

                    <div className="absolute top-4 left-4 z-10">
                      <span className="badge badge-primary text-primary-content font-bold py-3 px-4 shadow-lg">
                        {tour.category}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10 space-y-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} className="text-secondary" />
                          {tour.duration}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                          {tour.rating}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold font-gilliequest leading-tight group-hover:text-primary transition-colors">
                          {tour.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <MapPin size={16} />
                          {tour.location}
                        </div>
                      </div>

                      <div className="w-full h-[1px] bg-white/20" />

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-xs text-gray-400 uppercase tracking-wider block">
                            Start From
                          </span>
                          <span className="text-2xl font-bold text-white group-hover:text-secondary transition-colors">
                            {currencyFormatter.format(tour.price)}
                          </span>
                        </div>

                        <Link
                          href={detailHref}
                          prefetch={false}
                          aria-label={`View details for ${tour.title}`}
                          className="btn btn-circle bg-white/20 border-0 text-white hover:bg-primary hover:text-primary-content backdrop-blur-sm min-h-11 min-w-11"
                        >
                          <ArrowRight
                            size={20}
                            className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                            aria-hidden
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureTour;
