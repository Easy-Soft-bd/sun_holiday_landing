"use client";

import { FormEvent, useState } from "react";

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  buttonLabel: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MedicalVisaInquiry({ eyebrow, title, intro, buttonLabel }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const trimmedName = name.trim();
    const trimmedPhone = phone.replace(/[^\d+]/g, "");
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      setError("Enter your name.");
      return;
    }
    if (trimmedPhone.replace(/\D/g, "").length < 7) {
      setError("Enter a valid phone number.");
      return;
    }
    if (trimmedEmail && !EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Enter a valid email, or leave it blank.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
          message: message.trim() || "Medical visa enquiry",
          source: "Medical Visa",
          pageUrl: window.location.href,
          website,
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(body.error || "Could not send the enquiry. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Could not send the enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const words = title.trim().split(/\s+/);
  const lead = words.length > 1 ? words.slice(0, -1).join(" ") : title;
  const accent = words.length > 1 ? words[words.length - 1] : "";

  return (
    <section id="enquire" className="bg-base-200/40 py-16 sm:py-20">
      <div className="container mx-auto grid max-w-6xl items-start gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          <h2 className="font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
            {lead}{" "}
            {accent ? (
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{accent}</span>
            ) : null}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-base-content/70">{intro}</p>
        </div>

        <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm sm:p-8">
          {sent ? (
            <p className="py-8 text-center text-base font-medium text-base-content">
              Thank you. A counselor will call you about the medical visa.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              <label className="grid gap-1.5 text-sm font-medium">
                Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="input input-bordered w-full"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Phone
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="input input-bordered w-full"
                  autoComplete="tel"
                  required
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Email <span className="font-normal text-base-content/50">(optional)</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input input-bordered w-full"
                  autoComplete="email"
                  type="email"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Treatment or hospital <span className="font-normal text-base-content/50">(optional)</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="textarea textarea-bordered min-h-28 w-full"
                />
              </label>
              <input
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />
              {error ? <p className="text-sm text-error">{error}</p> : null}
              <button type="submit" className="btn btn-primary text-white" disabled={sending}>
                {sending ? "Sending..." : buttonLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
