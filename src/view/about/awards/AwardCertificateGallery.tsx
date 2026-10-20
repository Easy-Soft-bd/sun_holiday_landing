"use client";

import { useEffect, useState } from "react";
import { Award, BadgeCheck, Sparkles, X } from "lucide-react";
import dynamic from "next/dynamic";
import ClientOnly from "@/src/components/common/ClientOnly";
import { mergeAwardCertificatePageData, type AwardCertificatePageData, type AwardCertificateItem } from "@/src/lib/data/award-certificate-page";

const AwardCertificateAdminControl = dynamic(() => import("./AwardCertificateAdminControl"), {
  ssr: false,
  loading: () => null,
});

function CategoryBadge({ category }: { category: AwardCertificateItem["category"] }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
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

  useEffect(() => {
    if (!previewImage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewImage(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [previewImage]);

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
        </div>
      </section>

      <section className="bg-base-200/40">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div
            className={
              items.length === 1
                ? "mx-auto w-full max-w-md"
                : "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            }
          >
            {items.map((item) => (
              <article
                key={item.id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => setPreviewImage(item)}
                  className="block w-full bg-base-200 p-3 text-left sm:p-4"
                  aria-label={`Open full page view for ${item.title}`}
                >
                  <span className="flex h-80 items-center justify-center sm:h-[26rem]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
                    />
                  </span>
                </button>
                <div className="flex flex-1 flex-col border-t border-base-200 px-4 py-4 sm:px-5">
                  <div className="flex items-center justify-between gap-2">
                    <CategoryBadge category={item.category} />
                    {item.year ? (
                      <span className="shrink-0 text-xs font-bold tracking-wide text-base-content/50">
                        {item.year}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-base font-semibold leading-snug text-base-content sm:text-lg">
                    {item.title}
                  </h2>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {previewImage ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label={previewImage.title}
          onClick={() => setPreviewImage(null)}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold sm:text-base">{previewImage.title}</p>
              <p className="text-xs text-white/70">
                {previewImage.category}
                {previewImage.year ? ` · ${previewImage.year}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30"
              aria-label="Close preview"
            >
              <X className="size-5" />
            </button>
          </div>
          <img
            src={previewImage.image}
            alt={previewImage.title}
            className="min-h-0 w-full flex-1 object-contain"
          />
        </div>
      ) : null}
    </main>
  );
}
