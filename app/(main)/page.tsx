import { Suspense } from "react";
import { buildPageMetadata } from "@/src/lib/site";
import { getCachedHomePageData } from "@/src/lib/get-page-data";
import Hero from "@/src/view/Home/Hero/Hero";
import HomeDeferred from "@/src/view/Home/HomeDeferred";
import HomeSectionsSkeleton from "@/src/view/Home/HomeSectionsSkeleton";

export const metadata = buildPageMetadata({
  title: "Sun Holidays Ltd | Best Travel Agency in Bangladesh",
  description:
    "Discover exclusive holiday packages, luxury resorts, and seamless travel experiences with Sun Holidays Ltd — your trusted travel partner in Bangladesh.",
  path: "/",
});

async function HomeHero() {
  const pageData = await getCachedHomePageData();
  return <Hero data={pageData?.hero} />;
}

export default function Home() {
  return (
    <>
      {/* Hero uses cached CMS data; Suspense keeps the shell streaming. */}
      <Suspense
        fallback={
          <section
            className="relative flex min-h-[90vh] w-full items-center justify-center bg-base-300 lg:min-h-screen"
            aria-hidden
          />
        }
      >
        <HomeHero />
      </Suspense>
      <Suspense fallback={<HomeSectionsSkeleton />}>
        <HomeDeferred />
      </Suspense>
    </>
  );
}
