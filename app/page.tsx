
import { AirLineMarquee } from "@/src/components/common/AirLineMarquee";
import BookingProcess from "@/src/components/common/BookingProcess";
import WhyChooseUs from "@/src/components/common/WhyUs";
import HolidayCategories from "@/src/Demo";
import FeatureTour from "@/src/view/Home/tour_slider/FeatureTour";
import HajjCta from "@/src/view/Home/hajj_cta/HajjCta";
import Hero from "@/src/view/Home/Hero/Hero";
import ResortCta from "@/src/view/Home/resort_cta/ResortCta";

export default function Home() {
  return (
    <>
      <Hero />
      <AirLineMarquee />
      <FeatureTour />
      <ResortCta />
      <HajjCta />
      <HolidayCategories />
      <BookingProcess />
      <WhyChooseUs />
    </>

  );
}



