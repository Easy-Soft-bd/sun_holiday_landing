import { Mail, MapPin, Phone } from "lucide-react";
import ClientOnly from "@/src/components/common/ClientOnly";
import PublicIconRenderer from "@/src/components/common/PublicIconRenderer";
import { resolveMapsDirectionsHref } from "@/src/lib/settings-normalize";
import EducationInquiry from "./EducationInquiry";
import { mergeEducationPageData, type EducationPageData } from "./education-page-data";

type Props = {
  data?: Partial<EducationPageData>;
  admin?: boolean;
  phones?: string[];
  emails?: string[];
  address?: string;
  mapsUrl?: string;
};

function cleanList(values: string[] | undefined) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const value of values ?? []) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) continue;
    seen.add(key);
    next.push(trimmed);
  }
  return next;
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function accentTitle(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return { lead: title, accent: "" };
  return { lead: words.slice(0, -1).join(" "), accent: words[words.length - 1] ?? "" };
}

function Heading({ title }: { title: string }) {
  const parts = accentTitle(title);
  return (
    <h2 className="font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
      {parts.lead}{" "}
      {parts.accent ? (
        <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{parts.accent}</span>
      ) : null}
    </h2>
  );
}

async function EducationAdminSlot({ data }: { data: EducationPageData }) {
  const EducationAdminControl = (await import("./EducationAdminControl")).default;
  return (
    <ClientOnly>
      <div className="absolute right-3 top-3 z-50 sm:right-4 sm:top-4">
        <EducationAdminControl data={data} />
      </div>
    </ClientOnly>
  );
}

export default async function EducationView({
  data,
  admin = false,
  phones,
  emails,
  address,
  mapsUrl,
}: Props) {
  const page = mergeEducationPageData(data);
  const phoneNumbers = cleanList(phones).filter((phone, index, list) => {
    const digits = phone.replace(/\D/g, "");
    return list.findIndex((item) => item.replace(/\D/g, "") === digits) === index;
  });
  const emailAddresses = cleanList(emails);
  const officeAddress = (address ?? "").trim();
  const directionsHref = resolveMapsDirectionsHref(mapsUrl);

  return (
    <main className="group/education min-h-screen bg-base-100">
      <section className="relative overflow-hidden bg-base-100">
        {admin ? <EducationAdminSlot data={page} /> : null}
        <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-primary/15 blur-3xl sm:-top-24 sm:-right-24 sm:size-96" />
        <div className="relative z-10 container mx-auto grid items-center gap-10 px-4 pt-24 pb-12 sm:pt-28 lg:grid-cols-2 lg:pt-32 lg:pb-16">
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-base-200 bg-base-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm sm:mb-7 sm:px-4 sm:py-2 sm:text-sm sm:tracking-widest">
              <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-primary sm:size-2" />
              <span className="truncate">{page.heroBadge}</span>
            </div>
            <h1 className="mb-3 font-sans text-4xl font-semibold leading-tight tracking-tight sm:mb-5 sm:text-5xl md:text-6xl">
              {page.heroTitleMain}{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                {page.heroTitleAccent}
              </span>
            </h1>
            <p className="font-sans text-lg font-medium text-base-content/80 sm:text-xl">{page.heroSubtitle}</p>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-base-content/60 sm:text-lg lg:mx-0">
              {page.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a href="#enquire" className="btn btn-primary text-white">
                {page.heroEnquireLabel}
              </a>
              <a href="#visit" className="btn btn-outline">
                {page.heroVisitLabel}
              </a>
            </div>
          </div>
          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-base-200 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.heroImage}
              alt=""
              className="h-72 w-full object-cover sm:h-96 lg:h-[28rem]"
            />
          </div>
        </div>
      </section>

      <section className="bg-base-200/40 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.servicesEyebrow}</p>
            <Heading title={page.servicesTitle} />
            <p className="mt-4 text-base-content/70">{page.servicesIntro}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.services.map((service) => (
              <article key={service.title} className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PublicIconRenderer iconName={service.icon} size={22} />
                </div>
                <h3 className="font-sans text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.destinationsEyebrow}</p>
          <Heading title={page.destinationsTitle} />
          <p className="mt-4 text-base-content/70">{page.destinationsIntro}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {page.destinations.map((destination) => (
            <article key={destination.title} className="min-w-0 overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm">
              {destination.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={destination.image} alt={destination.title} className="h-44 w-full object-cover sm:h-52" />
              ) : null}
              <div className="p-5">
                <h3 className="font-sans text-xl font-semibold">{destination.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">{destination.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-base-200/40 py-16">
        <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2">
          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-base-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.documentsImage}
              alt=""
              className="h-72 w-full object-cover sm:h-96 lg:h-[28rem]"
            />
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.documentsEyebrow}</p>
            <Heading title={page.documentsTitle} />
            <p className="mt-4 mb-6 text-base-content/70">{page.documentsIntro}</p>
            <ul className="grid gap-3">
            {page.documents.map((document) => (
              <li
                key={document.text}
                className="flex items-start gap-3 rounded-2xl border border-base-200 bg-base-100 px-4 py-3 text-sm leading-relaxed"
              >
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                {document.text}
              </li>
            ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.stepsEyebrow}</p>
          <Heading title={page.stepsTitle} />
          <p className="mt-4 text-base-content/70">{page.stepsIntro}</p>
        </div>
        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {page.steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
              <p className="font-sans text-3xl font-semibold text-primary/70">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-sans text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="visit" className="border-y border-primary/15 bg-primary/5">
        <div className="container mx-auto px-4 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.visitEyebrow}</p>
            <Heading title={page.visitTitle} />
            <p className="mt-4 text-base leading-relaxed text-base-content/75">{page.visitBody}</p>
          </div>
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
            {phoneNumbers.length > 0 || emailAddresses.length > 0 ? (
              <article className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Phone size={22} />
                </div>
                <h3 className="font-sans text-xl font-semibold">Call the office</h3>
                {phoneNumbers.length > 0 ? (
                  <ul className="mt-3 grid gap-1">
                    {phoneNumbers.map((phone) => (
                      <li key={phone}>
                        <a href={phoneHref(phone)} className="text-base font-medium hover:text-primary">
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {emailAddresses.length > 0 ? (
                  <ul className="mt-4 grid gap-1 border-t border-base-200 pt-4">
                    {emailAddresses.map((email) => (
                      <li key={email}>
                        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-sm hover:text-primary">
                          <Mail size={16} className="text-primary" />
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {phoneNumbers[0] ? (
                  <a href={phoneHref(phoneNumbers[0])} className="btn btn-primary mt-5 text-white">
                    {page.visitCallLabel}
                  </a>
                ) : null}
              </article>
            ) : null}
            {officeAddress || directionsHref ? (
              <article className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin size={22} />
                </div>
                <h3 className="font-sans text-xl font-semibold">Come to the office</h3>
                {officeAddress ? (
                  <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-base-content/75">{officeAddress}</p>
                ) : null}
                {directionsHref ? (
                  <a href={directionsHref} className="btn btn-outline mt-5" target="_blank" rel="noopener noreferrer">
                    {page.visitOfficeLabel}
                  </a>
                ) : null}
              </article>
            ) : null}
          </div>
        </div>
      </section>

      <EducationInquiry
        eyebrow={page.inquiryEyebrow}
        title={page.inquiryTitle}
        intro={page.inquiryIntro}
        buttonLabel={page.inquiryButton}
      />
    </main>
  );
}
