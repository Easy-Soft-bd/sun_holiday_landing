"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ServiceBookingModal = dynamic(() => import("@/src/view/booking/ServiceBookingModal"), {
  ssr: false,
});

type VisaApplyPanelProps = {
  name: string;
  slug: string;
  flagEmoji?: string | null;
  className?: string;
};

export default function VisaApplyPanel({ name, slug, flagEmoji, className = "" }: VisaApplyPanelProps) {
  const [open, setOpen] = useState(false);
  const flag = flagEmoji?.trim() ?? "";
  const title = `${flag} ${name} Visa`.trim();

  return (
    <aside className={`h-fit rounded-2xl border border-base-200 bg-base-100 p-5 lg:sticky lg:top-28 ${className}`}>
      <p className="text-sm font-medium text-base-content/60">Apply with Sun Tourism</p>
      <p className="mt-1 text-lg font-semibold text-base-content">{name}</p>
      <p className="mt-2 text-sm leading-relaxed text-base-content/70">
        Send your details and a visa specialist will contact you with the next steps.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Apply for this visa
      </button>
      <ServiceBookingModal
        open={open}
        onClose={() => setOpen(false)}
        serviceType="visa"
        serviceTitle={`${name} Visa`}
        source={`visa-${slug}`}
        details={{ country: name, slug, flag }}
        eyebrow="Apply for visa"
        title={title}
        subtitle="Our team will contact you with the next steps."
        summary={[{ label: "Country", value: `${flag} ${name}`.trim() }]}
        requireEmail={false}
        submitLabel="Submit application"
        successTitle="Application received!"
        successDescription="Our visa specialist will contact you within 24 hours with the next steps and document checklist."
      />
    </aside>
  );
}
