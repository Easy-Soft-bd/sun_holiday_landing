
import { AirLineMarquee } from "@/src/components/common/AirLineMarquee";
import HolidayCategories from "@/src/Demo";
import HajjCta from "@/src/view/Home/hajj_cta/HajjCta";
import Hero from "@/src/view/Home/Hero/Hero";
import ResortCta from "@/src/view/Home/resort_cta/ResortCta";

export default function Home() {
  return (
    <>
      <Hero />
      <AirLineMarquee />
      <ResortCta />
      <HajjCta />
      <HolidayCategories />
    </>

  );
}



