import { Mail, MapPin, Phone } from "lucide-react";
import ClientOnly from "@/src/components/common/ClientOnly";
import PublicIconRenderer from "@/src/components/common/PublicIconRenderer";
import { resolveMapsDirectionsHref } from "@/src/lib/settings-normalize";
import MedicalVisaInquiry from "./MedicalVisaInquiry";
import { mergeMedicalVisaPageData, type MedicalVisaPageData } from "./medical-visa-page-data";

type Props = {
  data?: Partial<MedicalVisaPageData>;
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

async function MedicalVisaAdminSlot({ data }: { data: MedicalVisaPageData }) {
  const MedicalVisaAdminControl = (await import("./MedicalVisaAdminControl")).default;
  return (
    <ClientOnly>
      <div className="absolute right-3 top-3 z-50 sm:right-4 sm:top-4">
        <MedicalVisaAdminControl data={data} />
      </div>
    </ClientOnly>
  );
}

export default async function MedicalVisaView({
  data,
  admin = false,
  phones,
  emails,
  address,
  mapsUrl,
}: Props) {
  const page = mergeMedicalVisaPageData(data);
  const phoneNumbers = cleanList(phones).filter((phone, index, list) => {
    const digits = phone.replace(/\D/g, "");
    return list.findIndex((item) => item.replace(/\D/g, "") === digits) === index;
  });
  const emailAddresses = cleanList(emails);
  const officeAddress = (address ?? "").trim();
  const directionsHref = resolveMapsDirectionsHref(mapsUrl);
  const urgentTitle = accentTitle(page.urgentTitle);
  const introTitle = accentTitle(page.introTitle);
  const servicesTitle = accentTitle(page.servicesTitle);
  const documentsTitle = accentTitle(page.documentsTitle);
  const stepsTitle = accentTitle(page.stepsTitle);

  return (
    <main className="group/medical-visa min-h-screen bg-base-100">
      <section className="relative overflow-hidden bg-base-100">
        {admin ? <MedicalVisaAdminSlot data={page} /> : null}
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center opacity-30 sm:opacity-40"
            style={{ backgroundImage: `url(${page.heroImage})` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-base-100/80 via-base-100/90 to-base-100" />
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-primary/20 opacity-50 blur-3xl sm:-top-24 sm:-right-24 sm:size-96" />
        </div>
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 text-center sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-base-200 bg-base-100/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur-sm sm:mb-7 sm:px-4 sm:py-2 sm:text-sm sm:tracking-widest">
            <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-primary sm:size-2" />
            <span className="truncate">{page.heroBadge}</span>
          </div>
          <h1 className="mb-3 font-sans text-4xl font-semibold leading-tight tracking-tight sm:mb-5 sm:text-5xl md:text-6xl">
            {page.heroTitleMain}{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              {page.heroTitleAccent}
            </span>
          </h1>
          <p className="font-sans text-lg font-medium text-base-content/80 sm:text-xl">
            {page.heroSubtitle}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-base-content/60 sm:text-lg">
            {page.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={phoneNumbers[0] ? phoneHref(phoneNumbers[0]) : "#urgent"} className="btn btn-primary text-white">
              {page.urgentCallLabel}
            </a>
            <a href="#enquire" className="btn btn-outline">
              Ask about a visa
            </a>
          </div>
        </div>
      </section>

      <section id="urgent" className="border-y border-primary/15 bg-primary/5">
        <div className="container mx-auto px-4 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.urgentEyebrow}</p>
            <h2 className="font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
              {urgentTitle.lead}{" "}
              {urgentTitle.accent ? (
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {urgentTitle.accent}
                </span>
              ) : null}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-base-content/75">{page.urgentBody}</p>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
            {phoneNumbers.length > 0 || emailAddresses.length > 0 ? (
              <article className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Phone size={22} />
                </div>
                <h3 className="font-sans text-xl font-semibold">Call us directly</h3>
                {phoneNumbers.length > 0 ? (
                  <ul className="mt-3 grid gap-1">
                    {phoneNumbers.map((phone, index) => (
                      <li key={`${phone}-${index}`}>
                        <a href={phoneHref(phone)} className="text-base font-medium hover:text-primary">
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {emailAddresses.length > 0 ? (
                  <ul className="mt-4 grid gap-1 border-t border-base-200 pt-4">
                    {emailAddresses.map((email, index) => (
                      <li key={`${email}-${index}`}>
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
                    {page.urgentCallLabel}
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
                    {page.urgentVisitLabel}
                  </a>
                ) : null}
              </article>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-base-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.introImage} alt="" className="h-full max-h-[420px] w-full object-cover" />
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.introEyebrow}</p>
          <h2 className="font-sans font-semibold text-3xl tracking-tight sm:text-4xl">
            {introTitle.lead}{" "}
            {introTitle.accent ? (
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                {introTitle.accent}
              </span>
            ) : null}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-base-content/70">{page.introBody}</p>
        </div>
      </section>

      <section className="bg-base-200/40 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.servicesEyebrow}</p>
            <h2 className="font-sans font-semibold text-3xl tracking-tight sm:text-4xl">
              {servicesTitle.lead}{" "}
              {servicesTitle.accent ? (
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {servicesTitle.accent}
                </span>
              ) : null}
            </h2>
            <p className="mt-4 text-base-content/70">{page.servicesIntro}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.services.map((service) => (
              <article key={service.title} className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PublicIconRenderer iconName={service.icon} size={22} />
                </div>
                <h3 className="font-sans font-semibold text-xl">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.documentsEyebrow}</p>
          <h2 className="font-sans font-semibold text-3xl tracking-tight sm:text-4xl">
            {documentsTitle.lead}{" "}
            {documentsTitle.accent ? (
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                {documentsTitle.accent}
              </span>
            ) : null}
          </h2>
          <p className="mt-4 text-base-content/70">{page.documentsIntro}</p>
        </div>
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
      </section>

      <section className="bg-base-200/40 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.stepsEyebrow}</p>
            <h2 className="font-sans font-semibold text-3xl tracking-tight sm:text-4xl">
              {stepsTitle.lead}{" "}
              {stepsTitle.accent ? (
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stepsTitle.accent}
                </span>
              ) : null}
            </h2>
            <p className="mt-4 text-base-content/70">{page.stepsIntro}</p>
          </div>
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {page.steps.map((step, index) => (
              <li key={step.title} className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <p className="font-sans font-semibold text-3xl text-primary/70">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-sans font-semibold text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <MedicalVisaInquiry
        eyebrow={page.inquiryEyebrow}
        title={page.inquiryTitle}
        intro={page.inquiryIntro}
        buttonLabel={page.inquiryButton}
      />
    </main>
  );
}
