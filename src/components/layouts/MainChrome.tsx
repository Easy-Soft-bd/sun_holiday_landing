"use client";

import type { ReactNode } from "react";
import Nav from "@/src/components/layouts/Nav";
import TopBanner from "@/src/components/common/TopBanner";
import {
  PublicAdminProvider,
  usePublicAdmin,
} from "@/src/components/admin/PublicAdminProvider";

type Branding = {
  siteName?: string | null;
  siteLogo?: string | null;
};

function MainChromeInner({
  branding,
  showDevelopmentBanner,
  callPhone,
  children,
}: {
  branding: Branding;
  showDevelopmentBanner: boolean;
  callPhone?: string | null;
  children: ReactNode;
}) {
  const { admin, user, ready } = usePublicAdmin();
  const showTopBanner = (ready && admin) || showDevelopmentBanner;

  return (
    <>
      {showTopBanner ? (
        <TopBanner
          adminUser={admin ? user : null}
          showDevelopmentBanner={showDevelopmentBanner}
          callPhone={callPhone}
        />
      ) : null}
      <div className="relative">
        <Nav branding={branding} admin={ready && admin} />
        <main id="main-content">{children}</main>
      </div>
    </>
  );
}

export default function MainChrome({
  branding,
  showDevelopmentBanner,
  callPhone,
  children,
}: {
  branding: Branding;
  showDevelopmentBanner: boolean;
  callPhone?: string | null;
  children: ReactNode;
}) {
  return (
    <PublicAdminProvider>
      <MainChromeInner
        branding={branding}
        showDevelopmentBanner={showDevelopmentBanner}
        callPhone={callPhone}
      >
        {children}
      </MainChromeInner>
    </PublicAdminProvider>
  );
}
