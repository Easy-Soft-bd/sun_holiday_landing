import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import AccommodationSection from "./components/AccommodationSection";
import DiningSection from "./components/DiningSection";
import ActivitiesSection from "./components/ActivitiesSection";
import EcoSection from "./components/EcoSection";
import EventsSection from "./components/EventsSection";
import GallerySection from "./components/GallerySection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import SectionAdminControl from "./components/SectionAdminControl";
import type { SunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";
import { mergeSunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";

interface SunviaEcoResortViewProps {
  data?: Partial<SunviaEcoResortPageData> | null;
  admin?: boolean;
}

export default function SunviaEcoResortView({
  data,
  admin = false,
}: SunviaEcoResortViewProps) {
  const pageData = mergeSunviaEcoResortPageData(data);

  return (
    <main className="min-h-screen bg-base-100">
      {admin ? (
        <>
          <div className="bg-primary/10 border-b border-primary/20 py-2 text-center text-sm font-medium text-primary">
            You are logged in as <span className="font-bold underline">Admin</span>. Resort page edit mode is active.
          </div>
          <div className="fixed bottom-4 right-4 z-50">
            <SectionAdminControl section="seo" title="Edit SEO" data={pageData.seo} />
          </div>
        </>
      ) : null}

      <HeroSection data={pageData.hero} admin={admin} />
      <AboutSection data={pageData.about} admin={admin} />
      <AccommodationSection data={pageData.accommodations} admin={admin} />
      <DiningSection data={pageData.dining} admin={admin} />
      <ActivitiesSection data={pageData.activities} admin={admin} />
      <EcoSection data={pageData.eco} admin={admin} />
      <EventsSection data={pageData.events} admin={admin} />
      <GallerySection data={pageData.gallery} admin={admin} />
      <ServicesSection data={pageData.services} admin={admin} />
      <ContactSection data={pageData.contact} admin={admin} />
    </main>
  );
}
