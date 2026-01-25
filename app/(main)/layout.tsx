import React from 'react';
import Nav from "@/src/components/layouts/Nav";
import Footer from "@/src/components/layouts/Footer";
import TopBanner from "@/src/components/common/TopBanner";
import { getCachedAdminStatus, getCachedHomePageData } from "@/src/lib/get-page-data";

export default async function MainLayout({    
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const admin = await getCachedAdminStatus();
    await getCachedHomePageData();

  return (
    <>
      <TopBanner />
      <div className="relative">
        <Nav />
        {children}
        <Footer />
      </div>
    </>
  );
}
