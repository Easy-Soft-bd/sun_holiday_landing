import MedicalVisaView from "@/src/view/medical-visa/MedicalVisaView";
import { getCachedAdminStatus, getCachedHomePageData, getCachedSettings } from "@/src/lib/get-page-data";
import { buildPageMetadata } from "@/src/lib/site";
import { mergeMedicalVisaPageData } from "@/src/view/medical-visa/medical-visa-page-data";

export async function generateMetadata() {
  const home = await getCachedHomePageData();
  const page = mergeMedicalVisaPageData(home?.medical_visa_page);
  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.metaKeywords,
    path: "/medical-visa",
    image: page.heroImage,
  });
}

export default async function MedicalVisaPage() {
  const [admin, home, settings] = await Promise.all([
    getCachedAdminStatus(),
    getCachedHomePageData(),
    getCachedSettings().catch(() => null),
  ]);
  return (
    <MedicalVisaView
      data={home?.medical_visa_page}
      admin={admin}
      phones={settings?.contactPhones ?? []}
      emails={settings?.contactEmails ?? []}
      address={settings?.address ?? ""}
      mapsUrl={settings?.googleMapsUrl ?? ""}
    />
  );
}
