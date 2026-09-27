"use client";

import { useState } from "react";
import AppImage from "@/src/components/common/AppImage";
import SectionFrame, { SectionIntro } from "./SectionFrame";
import type { MasterPlanData } from "@/src/lib/data/sunvia-eco-resort";

interface MasterPlanSectionProps {
  data: MasterPlanData;
  admin?: boolean;
}

export default function MasterPlanSection({ data, admin = false }: MasterPlanSectionProps) {
  const [active, setActive] = useState(0);
  const zone = data.zones[active] ?? data.zones[0];

  return (
    <SectionFrame className="bg-base-100" admin={admin} section="master_plan" editTitle="Edit Master Plan" data={data}>
      <div id="overview" className="scroll-mt-40">
        <SectionIntro eyebrow={data.eyebrow} heading={data.heading} description={data.description} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.highlights.map((item) => (
            <div key={`${item.value}-${item.label}`} className="relative min-h-36 overflow-hidden rounded-3xl border border-base-300">
              <AppImage src={item.image} alt="" fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/55" />
              <div className="relative px-5 py-6 text-white">
                <p className="font-gilliequest text-3xl leading-none tracking-tight">{item.value}</p>
                <p className="mt-3 text-xs font-bold tracking-[0.16em] uppercase text-white/75">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="master-plan" className="mt-12 grid items-start gap-8 scroll-mt-40 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-80 overflow-hidden rounded-3xl border border-base-300">
          <AppImage src={data.image} alt={data.imageAlt} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute right-4 bottom-4 left-4 flex flex-wrap gap-2">
            {data.labels.map((label) => (
              <span key={label} className="rounded-full bg-base-100/90 px-3 py-1 text-xs font-semibold text-base-content">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3">
            {data.zones.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                    selected ? "border-primary bg-primary text-primary-content" : "border-base-300 bg-base-100 hover:border-primary"
                  }`}
                >
                  <span className="block text-xs font-bold tracking-[0.16em] uppercase opacity-70">0{index + 1}</span>
                  <span className="mt-1 block text-lg font-black">{item.title}</span>
                </button>
              );
            })}
          </div>
          {zone ? (
            <div className="mt-4 rounded-3xl border border-base-300 bg-base-200 p-6">
              <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">{zone.title}</p>
              <p className="mt-2 text-base leading-relaxed text-base-content/80">{zone.description}</p>
            </div>
          ) : null}
          <p className="mt-4 text-sm leading-relaxed text-base-content/60">{data.caption}</p>
        </div>
      </div>
    </SectionFrame>
  );
}
