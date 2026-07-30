import { Suspense } from "react";
import MainChrome from "@/src/components/layouts/MainChrome";
import Footer from "@/src/components/layouts/Footer";
import { getCachedHomePageData, getCachedSettings } from "@/src/lib/get-page-data";
import { isDevelopmentModeBannerEnabled } from "@/src/lib/env";
import HomeDeferredGate from "@/src/view/Home/HomeDeferredGate";

async function DeferredFooter() {
  const [pageData, settings] = await Promise.all([
    getCachedHomePageData(),
    getCachedSettings(),
  ]);

  return (
    <Footer
      data={pageData?.footer}
      settings={settings ?? undefined}
      branding={
        settings
          ? {
              siteName: settings.siteName,
              siteLogo: settings.siteLogo,
            }
          : undefined
      }
    />
  );
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getCachedSettings();
  const branding = settings
    ? {
        siteName: settings.siteName,
        siteLogo: settings.siteLogo,
      }
    : {};

  return (
    <MainChrome
      branding={branding}
      showDevelopmentBanner={isDevelopmentModeBannerEnabled()}
    >
      {children}
      <Suspense fallback={null}>
        <HomeDeferredGate>
          <DeferredFooter />
        </HomeDeferredGate>
      </Suspense>
    </MainChrome>
  );
}
