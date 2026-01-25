import React from 'react';
import Nav from "@/src/components/layouts/Nav";
import Footer from "@/src/components/layouts/Footer";
import TopBanner from "@/src/components/common/TopBanner";
import { getCachedAdminStatus, getCachedHomePageData, getCachedSettings } from "@/src/lib/get-page-data";

export default async function MainLayout({    
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const admin = await getCachedAdminStatus();
    const pageData = await getCachedHomePageData();
    const settings = await getCachedSettings();

  return (
    <>
      <TopBanner />
      <div className="relative">
        <Nav />
        {children}
        <Footer data={pageData?.footer} admin={admin} settings={settings} />
      </div>
    </>
  );
}
