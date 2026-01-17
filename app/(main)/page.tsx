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

export default async function Home() {
  const admin = await isAdmin();
  
  // Fetch home page data from database
  // Note: Data is fetched but not passed to components yet as they need to be updated to accept props.
  const pageDataRaw = await HomePage.findOne();
  const pageData = pageDataRaw?.get({ plain: true });
  console.log('Fetched Page Data:', pageData, admin);

  return (
    <>
      <Hero data={pageData?.hero} admin={admin} />
      {admin ? (
        <div className="bg-primary/10 border-b border-primary/20 py-2 text-center text-sm font-medium text-primary">
          You are logged in as <span className="font-bold underline">Admin</span>. (Admin Dashboard View)
        </div>
      ) : (
        <div className="bg-muted/50 py-1 text-center text-xs text-muted-foreground italic">
          hello admin login please
        </div>
      )}
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
