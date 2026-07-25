import React from 'react';
import type { Metadata } from 'next';
import Nav from "@/src/components/layouts/Nav";
import Footer from "@/src/components/layouts/Footer";
import TopBanner from "@/src/components/common/TopBanner";
import { getCachedAdminSession, getCachedAdminStatus, getCachedHomePageData, getCachedSettings } from "@/src/lib/get-page-data";
import { resolvePublicAssetPath } from "@/src/lib/public-assets";
import { isDevelopmentModeBannerEnabled } from "@/src/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSettings();
  const icon = resolvePublicAssetPath(settings?.siteLogo);

  return {
    icons: {
      icon,
      apple: icon,
    },
  };
}

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [admin, adminSession, pageData, settings] = await Promise.all([
      getCachedAdminStatus(),
      getCachedAdminSession(),
      getCachedHomePageData(),
      getCachedSettings(),
    ]);
    const branding = {
      siteName: settings?.siteName,
      siteLogo: settings?.siteLogo,
    };
    const showDevelopmentBanner = isDevelopmentModeBannerEnabled();
    const showTopBanner = Boolean(adminSession.user) || showDevelopmentBanner;

  return (
    <>
      {showTopBanner ? (
        <TopBanner
          adminUser={adminSession.user}
          showDevelopmentBanner={showDevelopmentBanner}
        />
      ) : null}
      <div className="relative">
        <Nav branding={branding} admin={admin} />
        {children}
        <Footer data={pageData?.footer} admin={admin} settings={settings} branding={branding} />
      </div>
    </>
  );
}
