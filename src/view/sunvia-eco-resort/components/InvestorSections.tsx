import Link from "next/link";
import AppImage from "@/src/components/common/AppImage";
import SectionFrame, { SectionIntro } from "./SectionFrame";
import type {
  DemandData,
  FaqData,
  InvestmentData,
  InvestmentModelData,
  RoadmapData,
  TermsData,
  WhySunviaData,
} from "@/src/lib/data/sunvia-eco-resort";
import { whatsappHref } from "@/src/lib/data/sunvia-eco-resort";

export function InvestmentModelSection({ data, admin = false }: { data: InvestmentModelData; admin?: boolean }) {
  return (
    <SectionFrame id="investment-model" className="bg-base-200" admin={admin} section="investment_model" editTitle="Edit Investment Model" data={data}>
      <SectionIntro eyebrow={data.eyebrow} heading={data.heading} />
      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {data.steps.map((step, index) => (
          <li key={step} className="flex gap-4 rounded-3xl border border-base-300 bg-base-100 p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-content">
              {index + 1}
            </span>
            <span className="pt-2 text-base font-semibold leading-snug">{step}</span>
          </li>
        ))}
      </ol>
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-base-300 p-6 text-white md:p-8">
        <AppImage src={data.backgroundImage} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.2em] text-secondary uppercase">{data.revenueLabel}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {data.revenueSources.map((source) => (
              <li key={source} className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm font-semibold">
                {source}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/80">{data.disclosure}</p>
        </div>
      </div>
    </SectionFrame>
  );
}

export function InvestmentSection({ data, admin = false }: { data: InvestmentData; admin?: boolean }) {
  const facts = [
    { label: data.unitLabel, value: data.unitValue, detail: "" },
    { label: data.ownershipTitle, value: "", detail: data.ownershipText },
    { label: data.profitTitle, value: "", detail: data.profitText },
    { label: data.paymentLabel, value: data.paymentValue, detail: "" },
  ];

  return (
    <SectionFrame id="opportunity" className="bg-base-100" admin={admin} section="investment" editTitle="Edit Investment Opportunity" data={data}>
      <SectionIntro eyebrow={data.eyebrow} heading={data.heading} description={data.description} />
      <div className="grid gap-4 md:grid-cols-2">
        {facts.map((fact) => (
          <article key={fact.label} className="rounded-3xl border border-base-300 bg-base-200 p-6">
            <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">{fact.label}</p>
            {fact.value ? <p className="font-gilliequest mt-3 text-3xl leading-none">{fact.value}</p> : null}
            {fact.detail ? <p className="mt-3 text-base leading-relaxed text-base-content/75">{fact.detail}</p> : null}
          </article>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-base-content/65">{data.note}</p>
      <Link href={data.ctaHref} className="btn btn-primary mt-6 rounded-full border-0 !bg-primary !text-primary-content px-8">
        {data.ctaText}
      </Link>
    </SectionFrame>
  );
}

export function DemandSection({ data, admin = false }: { data: DemandData; admin?: boolean }) {
  return (
    <SectionFrame className="bg-base-200" admin={admin} section="demand" editTitle="Edit Demand Segments" data={data}>
      <SectionIntro eyebrow={data.eyebrow} heading={data.heading} description={data.description} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.items.map((item, index) => (
          <article key={item.title} className="rounded-3xl border border-base-300 bg-base-100 p-6">
            <span className="text-xs font-black tracking-[0.18em] text-secondary uppercase">0{index + 1}</span>
            <h3 className="mt-3 text-xl font-black">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

export function RoadmapSection({ data, admin = false }: { data: RoadmapData; admin?: boolean }) {
  return (
    <SectionFrame id="roadmap" className="bg-base-100" admin={admin} section="roadmap" editTitle="Edit Roadmap" data={data}>
      <SectionIntro eyebrow={data.eyebrow} heading={data.heading} />
      <ol className="relative space-y-3 border-l-2 border-primary/30 pl-6">
        {data.steps.map((step, index) => (
          <li key={step} className="relative rounded-2xl border border-base-300 bg-base-200 px-5 py-4">
            <span className="absolute top-5 -left-[31px] size-3 rounded-full bg-primary" />
            <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">Stage {index + 1}</p>
            <p className="mt-1 text-lg font-black">{step}</p>
          </li>
        ))}
      </ol>
    </SectionFrame>
  );
}

export function WhySunviaSection({ data, admin = false }: { data: WhySunviaData; admin?: boolean }) {
  const chatHref = whatsappHref(data.whatsappNumber, data.whatsappMessage);

  return (
    <SectionFrame
      id="why-sunvia"
      className="bg-black"
      admin={admin}
      section="why_sunvia"
      editTitle="Edit Why Sunvia"
      data={data}
      backgroundImage={data.backgroundImage}
    >
      <p className="mb-3 text-xs font-bold tracking-[0.28em] text-secondary uppercase">{data.eyebrow}</p>
      <h2 className="font-gilliequest mb-4 text-3xl leading-none tracking-tight text-white md:text-5xl">{data.heading}</h2>
      <p className="text-2xl font-black">{data.projectName}</p>
      <p className="mt-2 text-sm font-semibold tracking-wide text-white/75">{data.affiliation}</p>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80">{data.description}</p>
      {chatHref ? (
        <a href={chatHref} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-8 rounded-full border-0 !bg-secondary !text-secondary-content px-8 shadow-lg">
          {data.ctaText}
        </a>
      ) : null}
    </SectionFrame>
  );
}

export function TermsSection({ data, admin = false }: { data: TermsData; admin?: boolean }) {
  return (
    <SectionFrame className="bg-base-100" admin={admin} section="terms" editTitle="Edit Investor Terms" data={data}>
      <SectionIntro eyebrow={data.eyebrow} heading={data.heading} />
      <div className="grid gap-4 md:grid-cols-2">
        {data.items.map((item) => (
          <article key={item.title} className="rounded-3xl border border-base-300 bg-base-200 p-6">
            <h3 className="text-lg font-black">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-base-content/75">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

export function FaqSection({ data, admin = false }: { data: FaqData; admin?: boolean }) {
  return (
    <SectionFrame id="faq" className="bg-base-200" admin={admin} section="faq" editTitle="Edit FAQ" data={data}>
      <SectionIntro eyebrow={data.eyebrow} heading={data.heading} />
      <div className="space-y-3">
        {data.items.map((item) => (
          <details key={item.question} className="group rounded-3xl border border-base-300 bg-base-100 px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black marker:content-none">
              <span>{item.question}</span>
              <span className="text-primary transition-transform group-open:rotate-180" aria-hidden="true">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-base-content/75">{item.answer}</p>
          </details>
        ))}
      </div>
    </SectionFrame>
  );
}
