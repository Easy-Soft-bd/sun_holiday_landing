"use client";

import { useEffect, useState, type ComponentType } from "react";
import { usePublicAdmin } from "@/src/components/admin/PublicAdminProvider";

type AdminControlProps = { data?: unknown };
type ProvidersProps = { children: React.ReactNode };

const adminLoaders = {
  airline: () => import("@/src/components/common/AirLineMarqueeAdminControl"),
  holidayCategories: () => import("@/src/components/common/HolidayCategoriesAdminControl"),
  footer: () => import("@/src/components/layouts/FooterAdminControl"),
  hajj: () => import("@/src/view/Home/hajj_cta/HajjCtaAdminControl"),
  resort: () => import("@/src/view/Home/resort_cta/ResortCtaAdminControl"),
  sailorMoon: () => import("@/src/view/Home/resort_cta/sailor-moon/SailorMoonCtaAdminControl"),
  hero: () => import("@/src/view/Home/Hero/HeroEditButton"),
  sunviaHero: () =>
    import("@/src/view/sunvia-eco-resort/components/SectionAdminControl").then((mod) => ({
      default: function SunviaHeroAdmin({ data }: AdminControlProps) {
        const Control = mod.default;
        return (
          <Control
            section="hero"
            title="Edit Resort Hero"
            data={data as never}
          />
        );
      },
    })),
} as const;

export type DeferredAdminName = keyof typeof adminLoaders;

/**
 * Mounts CMS admin controls only after client-side auth confirms an admin.
 * Keeps Ant Design / edit modals out of the anonymous visitor bundle.
 */
export default function DeferredAdmin({
  name,
  data,
  className,
}: {
  name: DeferredAdminName;
  data: unknown;
  className?: string;
}) {
  const { admin, ready } = usePublicAdmin();
  const [Control, setControl] = useState<ComponentType<AdminControlProps> | null>(null);
  const [Providers, setProviders] = useState<ComponentType<ProvidersProps> | null>(null);

  useEffect(() => {
    if (!ready || !admin) {
      setControl(null);
      setProviders(null);
      return;
    }

    let cancelled = false;
    void Promise.all([
      import("@/src/components/providers/AntdProviders"),
      adminLoaders[name](),
    ]).then(([providersMod, controlMod]) => {
      if (cancelled) return;
      setProviders(() => providersMod.default);
      setControl(() => controlMod.default as ComponentType<AdminControlProps>);
    });

    return () => {
      cancelled = true;
    };
  }, [admin, name, ready]);

  if (!Control || !Providers) {
    return null;
  }

  return (
    <Providers>
      <div className={className}>
        <Control data={data} />
      </div>
    </Providers>
  );
}
