"use client";

import { useState } from "react";
import { Award, BadgeCheck, Medal, Sparkles, X } from "lucide-react";
import dynamic from "next/dynamic";
import ClientOnly from "@/src/components/common/ClientOnly";
import { mergeAwardCertificatePageData, type AwardCertificatePageData, type AwardCertificateItem } from "@/src/lib/data/award-certificate-page";

const AwardCertificateAdminControl = dynamic(() => import("./AwardCertificateAdminControl"), {
  ssr: false,
  loading: () => null,
});

function CategoryBadge({ category }: { category: AwardCertificateItem["category"] }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-black/35 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
      {category === "Award" ? <Award className="size-3.5" /> : <BadgeCheck className="size-3.5" />}
      {category}
    </span>
  );
}

type Props = {
  data?: Partial<AwardCertificatePageData> | null;
  admin?: boolean;
};

export default function AwardCertificateGallery({ data, admin = false }: Props) {
  const page = mergeAwardCertificatePageData(data);
  const items = page.items;
  const [previewImage, setPreviewImage] = useState<AwardCertificateItem | null>(null);
  const awardCount = items.filter((x) => x.category === "Award").length;
  const certCount = items.filter((x) => x.category === "Certificate").length;

  return (
    <main className="group/award-certificate min-h-screen bg-base-100">
      <section className="relative overflow-hidden border-b border-base-300 bg-base-200">
        {admin ? (
          <ClientOnly>
            <div className="absolute right-4 top-4 z-50 md:right-8 md:top-8">
              <AwardCertificateAdminControl data={page} />
            </div>
          </ClientOnly>
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_45%)]" />
        <div className="relative container mx-auto px-4 pb-20 pt-32 md:pt-40">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="size-4" />
              {page.heroBadgeText}
            </p>
            <h1 className="mb-6 font-magmawave text-5xl tracking-tight md:text-7xl">
              {page.heroTitleBefore} <span className="italic text-primary">{page.heroTitleAccent}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-base-content/70 md:text-lg">
              {page.heroDescription}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 text-center">
              <div className="mx-auto mb-2 w-fit rounded-xl bg-primary/10 p-3 text-primary">
                <Award className="size-5" />
              </div>
              <p className="text-2xl font-extrabold text-primary">{awardCount}</p>
              <p className="text-xs uppercase tracking-wider text-base-content/55">Awards</p>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 text-center">
              <div className="mx-auto mb-2 w-fit rounded-xl bg-primary/10 p-3 text-primary">
                <BadgeCheck className="size-5" />
              </div>
              <p className="text-2xl font-extrabold text-primary">{certCount}</p>
              <p className="text-xs uppercase tracking-wider text-base-content/55">Certificates</p>
            </div>
            <div className="rounded-2xl border border-base-300 bg-base-100 p-5 text-center">
              <div className="mx-auto mb-2 w-fit rounded-xl bg-primary/10 p-3 text-primary">
                <Medal className="size-5" />
              </div>
              <p className="text-2xl font-extrabold text-primary">{items.length}</p>
              <p className="text-xs uppercase tracking-wider text-base-content/55">Total Highlights</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setPreviewImage(item)}
                className="relative block h-64 w-full overflow-hidden text-left"
                aria-label={`Open full preview for ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute left-4 top-4">
                  <CategoryBadge category={item.category} />
                </div>
                <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-base-content">
                  {item.year}
                </span>
              </button>
              <div className="p-5">
                <h2 className="line-clamp-2 text-lg font-bold text-base-content">{item.title}</h2>
                <p className="mt-2 text-sm text-base-content/60">
                  Click image to preview full size.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {previewImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 md:p-8"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30"
            aria-label="Close preview"
          >
            <X className="size-5" />
          </button>
          <div className="w-full max-w-5xl rounded-2xl bg-base-100 p-2 md:p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage.image}
              alt={previewImage.title}
              className="mx-auto max-h-[86vh] w-auto max-w-full rounded-xl object-contain"
            />
            <div className="mt-3 px-1 pb-1">
              <p className="text-sm font-semibold text-base-content">{previewImage.title}</p>
              <p className="text-xs text-base-content/60">
                {previewImage.category} · {previewImage.year}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
