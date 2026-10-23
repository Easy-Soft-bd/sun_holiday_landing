import { Metadata } from "next";
import AboutView from "@/src/view/about/AboutView";
import { buildPageMetadata } from "@/src/lib/site";
import { getCachedAdminStatus, getCachedHomePageData, getCachedSettings } from "@/src/lib/get-page-data";

export const metadata: Metadata = buildPageMetadata({
    title: "About Us - Sun Tourism Ltd | Your Trusted Travel Partner",
    description: "Discover the story of Sun Tourism Ltd, founded in 2021. Our vision is to be the first choice for travelers, providing service with care and empathy.",
    path: "/about",
    keywords: ["About Sun Tourism", "Travel Agency Bangladesh", "Sun Tourism Ltd", "Tour Operator Dhaka"],
});

export default async function About() {
  const [admin, pageData, settings] = await Promise.all([
    getCachedAdminStatus(),
    getCachedHomePageData(),
    getCachedSettings(),
  ]);
  return (
    <AboutView
      data={pageData?.about_page}
      admin={admin}
      phones={settings?.contactPhones ?? []}
      emails={settings?.contactEmails ?? []}
      address={settings?.address ?? ""}
      socialLinks={settings?.socialLinks ?? []}
    />
  );
}
