import AppImage from "@/src/components/common/AppImage";
import Link from "next/link";
import SectionAdminControl from "./SectionAdminControl";
import type { InvestorHeroData } from "@/src/lib/data/sunvia-eco-resort";
import { whatsappHref } from "@/src/lib/data/sunvia-eco-resort";

interface HeroSectionProps {
  data: InvestorHeroData;
  admin?: boolean;
}

function ActionLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const external = /^https?:/i.test(href);
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function HeroSection({ data, admin = false }: HeroSectionProps) {
  const chatHref = whatsappHref(data.whatsappNumber, data.whatsappMessage);

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-black text-white">
      {admin ? (
        <div className="absolute right-4 bottom-28 z-30 md:right-6">
          <SectionAdminControl section="investor_hero" title="Edit Hero" data={data} />
        </div>
      ) : null}

      <div className="absolute inset-0">
        <AppImage
          src={data.backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/25" />
      </div>

      <div className="relative container mx-auto flex min-h-[85vh] items-center px-4 py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold tracking-[0.22em] text-secondary uppercase">{data.projectName}</p>
          <p className="mt-4 text-xs font-bold tracking-[0.28em] text-white/80 uppercase">{data.eyebrow}</p>
          <h1 className="font-gilliequest mt-4 text-4xl leading-none tracking-tight md:text-6xl">{data.headline}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">{data.supportLine}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/70">{data.unitLabel}</p>
              <p className="mt-1 text-lg font-black">{data.unitValue}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/70">{data.paymentLabel}</p>
              <p className="mt-1 text-lg font-black">{data.paymentValue}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink href={data.ctaPrimaryHref} className="btn btn-primary rounded-full border-0 !bg-primary !text-primary-content px-8">
              {data.ctaPrimaryText}
            </ActionLink>
            {chatHref ? (
              <a
                href={chatHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn rounded-full border !border-white/40 !bg-white/15 !text-white px-8 backdrop-blur-md hover:!border-secondary hover:!bg-secondary hover:!text-secondary-content"
              >
                {data.ctaSecondaryText}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
