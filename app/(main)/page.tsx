import { AirLineMarquee } from "@/src/components/common/AirLineMarquee";
import BookingProcess from "@/src/components/common/BookingProcess";
import WhyChooseUs from "@/src/components/common/WhyUs";
import HolidayCategories from "@/src/Demo";
import FeatureTour from "@/src/view/Home/tour_slider/FeatureTour";
import HajjCta from "@/src/view/Home/hajj_cta/HajjCta";
import Hero from "@/src/view/Home/Hero/Hero";
import ResortCta from "@/src/view/Home/resort_cta/ResortCta";
import { getCachedAdminStatus, getCachedHomePageData } from "@/src/lib/get-page-data";


// export const dynamic = 'force-dynamic';

export default async function Home() {
  const admin = await getCachedAdminStatus();
  const pageData = await getCachedHomePageData();

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
      <ResortCta data={pageData?.resort_cta} admin={admin} />
      <HajjCta data={pageData?.hajj_cta} admin={admin} />
      <HolidayCategories data={pageData?.holiday_categories} admin={admin} />
      <BookingProcess />
      <WhyChooseUs />
    </>
  );
}
