
import { AirLineMarquee } from "@/src/components/common/AirLineMarquee";
import HolidayCategories from "@/src/Demo";
import Hero from "@/src/view/Hero/Hero";
import ResortCta from "@/src/view/Hero/resort_cta/ResortCta";

export default function Home() {
  return (
    <>
      <Hero />
      <AirLineMarquee />
      <ResortCta />
      <HolidayCategories />
    </>

  );
}



