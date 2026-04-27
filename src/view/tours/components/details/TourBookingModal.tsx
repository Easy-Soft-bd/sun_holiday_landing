"use client";

import { useEffect, useRef, useState } from "react";
import {
    CalendarCheck,
    CheckCircle2,
    Loader2,
    Mail,
    MessageSquare,
    Phone,
    User,
    X,
} from "lucide-react";
import type { TourPackage } from "@/src/view/tours/data/mockTours";

type Props = {
    tour: TourPackage;
    open: boolean;
    onClose: () => void;
};

type FormState = {
    name: string;
    phone: string;
    email: string;
    bookingDate: string;
    guests: string;
    message: string;
    /** Honeypot – must remain empty. Real users never see/touch this. */
    website: string;
};

const EMPTY_FORM: FormState = {
    name: "",
    phone: "",
    email: "",
    bookingDate: "",
    guests: "",
    message: "",
    website: "",
};

const currencyFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const MIN_FILL_TIME_MS = 1500;

export default function TourBookingModal({ tour, open, onClose }: Props) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const openedAtRef = useRef<number>(0);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const firstFieldRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!open) return;

        openedAtRef.current = Date.now();
        setError(null);
        setSuccess(false);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);

        const focusTimer = window.setTimeout(() => {
            firstFieldRef.current?.focus();
        }, 60);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKey);
            window.clearTimeout(focusTimer);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) {
            setForm(EMPTY_FORM);
            setSubmitting(false);
            setError(null);
            setSuccess(false);
        }
    }, [open]);

    if (!open) return null;

    const updateField =
        <K extends keyof FormState>(key: K) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm((prev) => ({ ...prev, [key]: event.target.value }));
        };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return;

        if (form.website.trim().length > 0) {
            setSuccess(true);
            return;
        }

        if (Date.now() - openedAtRef.current < MIN_FILL_TIME_MS) {
            setError("Please take a moment to fill the form before submitting.");
            return;
        }

        const phoneDigits = form.phone.replace(/\D/g, "");
        if (phoneDigits.length < 7 || phoneDigits.length > 16) {
            setError("Please enter a valid phone number.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const sourceSlug =
                (typeof tour.slug === "string" && tour.slug.trim()) || String(tour.id);
            const pageUrl =
                typeof window !== "undefined"
                    ? window.location.origin + window.location.pathname
                    : null;

            const messageWithGuests = form.guests.trim()
                ? `[Guests: ${form.guests.trim()}]\n${form.message.trim()}`
                : form.message.trim();

            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    phone: form.phone.trim(),
                    email: form.email.trim(),
                    bookingDate: form.bookingDate || null,
                    message: messageWithGuests,
                    source: `tour-${sourceSlug}`,
                    pageUrl,
                    website: form.website,
                    serviceType: "tour",
                    serviceTitle: tour.title,
                    details: {
                        location: tour.location ?? null,
                        duration: tour.duration ?? null,
                        price: tour.price ?? null,
                        guests: form.guests || null,
                    },
                    tourId: tour.id ? Number(tour.id) : undefined,
                    tourSlug: typeof tour.slug === "string" ? tour.slug : null,
                    tourTitle: tour.title,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(
                    data?.error ||
                        (res.status === 429
                            ? "Too many requests. Please try again shortly."
                            : "Failed to submit booking.")
                );
            }

            setSuccess(true);
            const closeTimer = window.setTimeout(onClose, 3500);
            return () => window.clearTimeout(closeTimer);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit booking.");
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().slice(0, 10);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-3 py-6 backdrop-blur-sm sm:p-6"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="presentation"
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tour-booking-title"
                className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-base-100 shadow-2xl ring-1 ring-base-200 sm:rounded-3xl"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close booking form"
                    className="absolute right-3 top-3 z-10 rounded-full bg-base-200/80 p-2 text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content sm:right-4 sm:top-4"
                >
                    <X size={18} />
                </button>

                <div className="border-b border-base-200 bg-gradient-to-br from-primary/5 via-base-100 to-base-100 p-5 sm:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                        Book this tour
                    </p>
                    <h2
                        id="tour-booking-title"
                        className="mt-1 text-xl font-bold leading-snug text-base-content sm:text-2xl"
                    >
                        {tour.title}
                    </h2>
                    <p className="mt-1 text-sm text-base-content/60">
                        {tour.location}
                        {tour.duration ? ` · ${tour.duration}` : ""} ·{" "}
                        <span className="font-semibold text-primary">
                            {currencyFormatter.format(tour.price)}
                        </span>{" "}
                        / person
                    </p>
                </div>

                {success ? (
                    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
                            <CheckCircle2 size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-base-content">
                            Booking request received!
                        </h3>
                        <p className="mt-2 max-w-sm text-sm text-base-content/60">
                            Thanks for choosing Sun Tourism. Our team will reach out within
                            24&nbsp;hours to confirm your trip details.
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-primary btn-md mt-6 rounded-xl"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="space-y-4 p-5 sm:space-y-5 sm:p-7"
                    >
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-[9999px] -top-[9999px]"
                        >
                            <label>
                                Website
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={form.website}
                                    onChange={updateField("website")}
                                />
                            </label>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                id="bk-name"
                                label="Full name"
                                icon={<User size={16} />}
                                required
                            >
                                <input
                                    ref={firstFieldRef}
                                    id="bk-name"
                                    type="text"
                                    name="name"
                                    autoComplete="name"
                                    required
                                    minLength={2}
                                    maxLength={120}
                                    value={form.name}
                                    onChange={updateField("name")}
                                    className="input input-bordered w-full rounded-xl"
                                    placeholder="Your name"
                                />
                            </Field>

                            <Field
                                id="bk-phone"
                                label="Phone"
                                icon={<Phone size={16} />}
                                required
                            >
                                <input
                                    id="bk-phone"
                                    type="tel"
                                    name="phone"
                                    autoComplete="tel"
                                    inputMode="tel"
                                    required
                                    pattern="[0-9+\-\s()]{7,20}"
                                    value={form.phone}
                                    onChange={updateField("phone")}
                                    className="input input-bordered w-full rounded-xl"
                                    placeholder="+8801XXXXXXXXX"
                                />
                            </Field>
                        </div>

                        <Field
                            id="bk-email"
                            label="Email"
                            icon={<Mail size={16} />}
                            required
                        >
                            <input
                                id="bk-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={updateField("email")}
                                className="input input-bordered w-full rounded-xl"
                                placeholder="you@example.com"
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                id="bk-date"
                                label="Preferred date"
                                icon={<CalendarCheck size={16} />}
                            >
                                <input
                                    id="bk-date"
                                    type="date"
                                    name="bookingDate"
                                    min={today}
                                    value={form.bookingDate}
                                    onChange={updateField("bookingDate")}
                                    className="input input-bordered w-full rounded-xl"
                                />
                            </Field>

                            <Field id="bk-guests" label="Travellers (optional)">
                                <input
                                    id="bk-guests"
                                    type="number"
                                    name="guests"
                                    min={1}
                                    max={50}
                                    value={form.guests}
                                    onChange={updateField("guests")}
                                    className="input input-bordered w-full rounded-xl"
                                    placeholder="2"
                                />
                            </Field>
                        </div>

                        <Field
                            id="bk-message"
                            label="Message"
                            icon={<MessageSquare size={16} />}
                        >
                            <textarea
                                id="bk-message"
                                name="message"
                                maxLength={2000}
                                rows={4}
                                value={form.message}
                                onChange={updateField("message")}
                                className="textarea textarea-bordered w-full rounded-xl"
                                placeholder="Any special requests or questions?"
                            />
                        </Field>

                        {error ? (
                            <div
                                role="alert"
                                className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
                            >
                                {error}
                            </div>
                        ) : null}

                        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-ghost btn-md rounded-xl"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-primary btn-md gap-2 rounded-xl shadow-lg shadow-primary/20"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Submitting…
                                    </>
                                ) : (
                                    <>
                                        <CalendarCheck size={18} />
                                        Confirm booking
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-[11px] leading-relaxed text-base-content/50">
                            By submitting you agree to be contacted by Sun Tourism about your
                            booking. We never share your details with third parties.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

function Field({
    id,
    label,
    icon,
    required,
    children,
}: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label htmlFor={id} className="block">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-base-content/70">
                {icon}
                {label}
                {required ? <span className="text-error">*</span> : null}
            </span>
            {children}
        </label>
    );
}
