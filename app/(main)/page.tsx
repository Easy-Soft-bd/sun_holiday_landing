import { AirLineMarquee } from "@/src/components/common/AirLineMarquee";
import BookingProcess from "@/src/components/common/BookingProcess";
import WhyChooseUs from "@/src/components/common/WhyUs";
import HolidayCategories from "@/src/Demo";
import FeatureTour from "@/src/view/Home/tour_slider/FeatureTour";
import HajjCta from "@/src/view/Home/hajj_cta/HajjCta";
import Hero from "@/src/view/Home/Hero/Hero";
import ResortCta from "@/src/view/Home/resort_cta/ResortCta";
import { isAdmin } from "@/src/lib/auth";
import HomePage from "@/src/models/HomePage";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const admin = await isAdmin();
  
  // Fetch home page data from database
  const pageDataRaw = await HomePage.findOne();
  const pageData = pageDataRaw ? pageDataRaw.get({ plain: true }) : null;

  return (
    <>
      <Hero data={pageData?.hero} admin={admin} />
      {admin ? (
        <div className="bg-primary/10 border-b border-primary/20 py-2 text-center text-sm font-medium text-primary">
          You are logged in as <span className="font-bold underline">Admin</span>. (Admin Dashboard View)
        </div>
      ) : null}
      <AirLineMarquee data={pageData?.airline_marquee} admin={admin} />
      <FeatureTour />
      <ResortCta />
      <HajjCta />
      <HolidayCategories />
      <BookingProcess />
      <WhyChooseUs />
    </>
  );
}
