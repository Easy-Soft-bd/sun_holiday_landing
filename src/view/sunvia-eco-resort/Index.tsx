import AntdProviders from "@/src/components/providers/AntdProviders";
import HeroSection from "./components/HeroSection";
import PageNav from "./components/PageNav";
import MasterPlanSection from "./components/MasterPlanSection";
import LeadSection from "./components/LeadSection";
import SectionAdminControl from "./components/SectionAdminControl";
import {
  DemandSection,
  FaqSection,
  InvestmentModelSection,
  InvestmentSection,
  RoadmapSection,
  TermsSection,
  WhySunviaSection,
} from "./components/InvestorSections";
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

  const page = (
    <main className="min-h-screen bg-base-100 pb-24 lg:pb-0">
      {admin ? (
        <>
          <div className="border-b border-primary/20 bg-primary/10 py-2 text-center text-sm font-medium text-primary">
            You are logged in as <span className="font-bold underline">Admin</span>. Resort page edit mode is active.
          </div>
          <div className="fixed right-4 bottom-4 z-50">
            <SectionAdminControl section="investor_seo" title="Edit SEO" data={pageData.investor_seo} />
          </div>
        </>
      ) : (
        <a
          href="#lead"
          className="btn btn-primary fixed inset-x-4 bottom-4 z-40 rounded-full border-0 !bg-primary !text-primary-content shadow-xl lg:hidden"
        >
          {pageData.lead.mobileCtaText}
        </a>
      )}

      <HeroSection data={pageData.investor_hero} admin={admin} />
      <PageNav />
      <MasterPlanSection data={pageData.master_plan} admin={admin} />
      <InvestmentModelSection data={pageData.investment_model} admin={admin} />
      <InvestmentSection data={pageData.investment} admin={admin} />
      <DemandSection data={pageData.demand} admin={admin} />
      <RoadmapSection data={pageData.roadmap} admin={admin} />
      <WhySunviaSection data={pageData.why_sunvia} admin={admin} />
      <TermsSection data={pageData.terms} admin={admin} />
      <FaqSection data={pageData.faq} admin={admin} />
      <LeadSection data={pageData.lead} admin={admin} />
    </main>
  );

  return admin ? <AntdProviders>{page}</AntdProviders> : page;
}
