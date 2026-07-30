import { Suspense } from "react";
import { AirLineMarquee } from "@/src/components/common/AirLineMarquee";
import SailorMoonCta from "@/src/view/Home/resort_cta/sailor-moon/SailorMoonCta";
import SunviaEcoResort from "@/src/view/Home/sunvia_eco_resort/SunviaEcoResort";
import ResortCta from "@/src/view/Home/resort_cta/ResortCta";
import HajjCta from "@/src/view/Home/hajj_cta/HajjCta";
import FeatureTour from "@/src/view/Home/tour_slider/FeatureTour";
import BookingProcess from "@/src/components/common/BookingProcess";
import WhyChooseUs from "@/src/components/common/WhyUs";
import HolidayCategories from "@/src/Demo";
import HomeDeferredGate from "@/src/view/Home/HomeDeferredGate";
import HomeSectionsSkeleton, {
  FeatureTourSkeleton,
} from "@/src/view/Home/HomeSectionsSkeleton";
import {
  getCachedHomePageData,
  getCachedSunviaEcoResortPageData,
} from "@/src/lib/get-page-data";

/**
 * Below-fold home sections with CMS data. Gated so they stay out of the
 * initial HTML DOM and do not compete with hero LCP.
 */
export default async function HomeDeferred() {
  const [pageData, resortPageData] = await Promise.all([
    getCachedHomePageData(),
    getCachedSunviaEcoResortPageData(),
  ]);

  return (
    <HomeDeferredGate fallback={<HomeSectionsSkeleton />}>
      <Suspense
        fallback={
          <section className="container mx-auto space-y-6 px-4 py-8">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
              <div className="skeleton h-3 w-40" />
              <div className="skeleton h-10 w-72 max-w-full" />
            </div>
            <div className="flex gap-4 overflow-hidden py-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-16 w-28 shrink-0 rounded-xl" />
              ))}
            </div>
          </section>
        }
      >
        <AirLineMarquee data={pageData?.airline_marquee} />
      </Suspense>
      <Suspense
        fallback={
          <section className="container mx-auto px-4 py-4">
            <div className="skeleton min-h-[280px] w-full rounded-3xl md:min-h-[360px]" />
          </section>
        }
      >
        <SailorMoonCta data={pageData?.sailor_moon_cta} />
      </Suspense>
      <Suspense
        fallback={
          <section className="container mx-auto px-4 py-4">
            <div className="skeleton min-h-[280px] w-full rounded-3xl md:min-h-[360px]" />
          </section>
        }
      >
        <SunviaEcoResort data={resortPageData?.hero} />
      </Suspense>
      <Suspense
        fallback={
          <section className="container mx-auto px-4 py-4">
            <div className="skeleton min-h-[280px] w-full rounded-3xl md:min-h-[360px]" />
          </section>
        }
      >
        <ResortCta data={pageData?.resort_cta} />
      </Suspense>
      <Suspense
        fallback={
          <section className="container mx-auto px-4 py-4">
            <div className="skeleton min-h-[280px] w-full rounded-3xl md:min-h-[360px]" />
          </section>
        }
      >
        <HajjCta data={pageData?.hajj_cta} />
      </Suspense>
      <Suspense fallback={<FeatureTourSkeleton />}>
        <FeatureTour />
      </Suspense>
      <Suspense
        fallback={
          <section className="bg-base-200/50 py-16">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="skeleton size-16 rounded-2xl" />
                  <div className="skeleton h-6 w-40" />
                  <div className="skeleton h-16 w-full" />
                </div>
              ))}
            </div>
          </section>
        }
      >
        <BookingProcess />
      </Suspense>
      <Suspense
        fallback={
          <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-12 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4 rounded-2xl border border-base-200 p-6">
                <div className="skeleton size-12 rounded-xl" />
                <div className="skeleton h-5 w-32" />
                <div className="skeleton h-12 w-full" />
              </div>
            ))}
          </section>
        }
      >
        <WhyChooseUs />
      </Suspense>
      <Suspense
        fallback={
          <section className="container mx-auto grid grid-cols-2 gap-4 px-4 py-12 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-40 w-full rounded-2xl md:h-52" />
            ))}
          </section>
        }
      >
        <HolidayCategories data={pageData?.holiday_categories} />
      </Suspense>
    </HomeDeferredGate>
  );
}
