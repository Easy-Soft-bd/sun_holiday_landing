"use client";

import { useState } from "react";
import Link from "next/link";
import SectionFrame from "./SectionFrame";
import type { LeadData } from "@/src/lib/data/sunvia-eco-resort";
import { whatsappHref } from "@/src/lib/data/sunvia-eco-resort";

interface LeadSectionProps {
  data: LeadData;
  admin?: boolean;
}

export default function LeadSection({ data, admin = false }: LeadSectionProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const chatHref = whatsappHref(data.whatsappNumber, data.whatsappMessage);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const interest = String(formData.get("interest") || "").trim();
    const preferredContact = String(formData.get("preferredContact") || "").trim();
    const consent = formData.get("consent") === "yes";
    const website = String(formData.get("website") || "");

    if (!consent) {
      setStatus("error");
      setError(data.errorMessage);
      return;
    }

    setStatus("saving");
    setError("");

    const message = [
      `Phone / WhatsApp: ${phone}`,
      `Preferred contact: ${preferredContact}`,
      interest ? `Investment interest: ${interest}` : "",
      "Contact consent: yes",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          website,
          source: data.source,
          pageUrl: window.location.href,
          message,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus("error");
        setError(result.error || data.errorMessage);
        return;
      }
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
      setError(data.errorMessage);
    }
  }

  return (
    <SectionFrame id="lead" className="bg-base-100" admin={admin} section="lead" editTitle="Edit Lead Form" data={data}>
      <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs font-bold tracking-[0.28em] text-primary uppercase">{data.eyebrow}</p>
          <h2 className="font-gilliequest mb-4 text-3xl tracking-tight md:text-5xl">{data.heading}</h2>
          <p className="text-base leading-relaxed text-base-content/70 md:text-lg">{data.description}</p>
          {chatHref ? (
            <a
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mt-8 rounded-full border-0 !bg-secondary !text-secondary-content"
            >
              {data.whatsappLabel}
            </a>
          ) : null}
        </div>

        {status === "done" ? (
          <div className="rounded-3xl border border-base-300 bg-base-200 p-8 shadow-xl">
            <p className="text-lg leading-relaxed">{data.successMessage}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl md:p-8">
            <div className="grid gap-4">
              <label className="block text-sm font-semibold">
                Name
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={data.namePlaceholder}
                  className="mt-1 w-full rounded-xl border border-base-300 px-3 py-2.5 font-normal"
                />
              </label>
              <label className="block text-sm font-semibold">
                Phone / WhatsApp
                <input
                  name="phone"
                  required
                  autoComplete="tel"
                  placeholder={data.phonePlaceholder}
                  className="mt-1 w-full rounded-xl border border-base-300 px-3 py-2.5 font-normal"
                />
              </label>
              <label className="block text-sm font-semibold">
                {data.contactLabel}
                <select name="preferredContact" required defaultValue="" className="mt-1 w-full rounded-xl border border-base-300 px-3 py-2.5 font-normal">
                  <option value="" disabled>
                    Select
                  </option>
                  {data.contactOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {data.interestLabel}
                <span className="ml-2 font-normal text-base-content/50">Optional</span>
                <select name="interest" defaultValue="" className="mt-1 w-full rounded-xl border border-base-300 px-3 py-2.5 font-normal">
                  <option value="">Select if you want</option>
                  {data.interestOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-start gap-3 text-sm leading-relaxed">
                <input name="consent" type="checkbox" value="yes" required className="checkbox checkbox-primary mt-0.5" />
                <span>
                  {data.consentText}{" "}
                  <Link href={data.privacyHref} className="font-semibold text-primary underline">
                    {data.privacyLabel}
                  </Link>
                  .
                </span>
              </label>
            </div>
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
            <button
              type="submit"
              disabled={status === "saving"}
              className="btn btn-primary mt-6 w-full rounded-full border-0"
            >
              {status === "saving" ? "Sending..." : data.submitText}
            </button>
          </form>
        )}
      </div>
    </SectionFrame>
  );
}
