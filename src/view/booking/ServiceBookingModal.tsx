"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

export type ServiceType = "tour" | "ticket" | "visa" | "resort" | "general";

export type ServiceBookingDetailItem = {
    /** Short label, e.g. "From", "Country", "Resort". */
    label: string;
    /** Display value, e.g. "DAC", "United Arab Emirates". */
    value: string;
};

export type ServiceBookingPayload = {
    serviceType: ServiceType;
    /** Short snapshot label persisted to admin (e.g. "DAC → DXB", "UAE Tourist Visa"). */
    serviceTitle: string;
    /** Free-form structured payload (route, country, etc.) saved to `bookings.details`. */
    details?: Record<string, unknown> | null;
    /** Used as `bookings.source` (e.g. "ticket-search", "visa-uae"). */
    source: string;
    /** Optional tour FK + snapshot for tour bookings. */
    tourId?: number | null;
    tourSlug?: string | null;
    tourTitle?: string | null;
    /** Optional pre-filled / forced booking date (yyyy-mm-dd). */
    initialBookingDate?: string;
    /** When false, the modal hides the booking-date picker entirely. */
    showBookingDate?: boolean;
};

export type ServiceBookingModalProps = ServiceBookingPayload & {
    open: boolean;
    onClose: () => void;
    /** Big eyebrow above the title (e.g. "Complete your booking"). */
    eyebrow?: string;
    /** Large title (e.g. "Book this flight"). */
    title: string;
    /** Smaller line under the title (e.g. flight route or country). */
    subtitle?: string;
    /** Bullets shown in a soft summary card at the top of the form. */
    summary?: ServiceBookingDetailItem[];
    /** Whether email is required. Tickets default to false; tours/visa/resort default to true. */
    requireEmail?: boolean;
    /** Submit button label override. */
    submitLabel?: string;
    /** Confirmation copy after submit. */
    successTitle?: string;
    successDescription?: string;
};

type FormState = {
    name: string;
    phone: string;
    email: string;
    bookingDate: string;
    message: string;
    /** Honeypot field — must remain empty. */
    website: string;
};

const MIN_FILL_TIME_MS = 1500;

export default function ServiceBookingModal(props: ServiceBookingModalProps) {
    const {
        open,
        onClose,
        serviceType,
        serviceTitle,
        details,
        source,
        tourId,
        tourSlug,
        tourTitle,
        initialBookingDate,
        showBookingDate = true,
        eyebrow,
        title,
        subtitle,
        summary,
        requireEmail,
        submitLabel,
        successTitle = "Booking request received!",
        successDescription = "Thanks for reaching out. Our team will contact you shortly to confirm the details.",
    } = props;

    const emailRequired = requireEmail ?? serviceType !== "ticket";

    const initialForm = useMemo<FormState>(
        () => ({
            name: "",
            phone: "",
            email: "",
            bookingDate: initialBookingDate ?? "",
            message: "",
            website: "",
        }),
        [initialBookingDate]
    );

    const [form, setForm] = useState<FormState>(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const openedAtRef = useRef<number>(0);
    const firstFieldRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!open) return;

        openedAtRef.current = Date.now();
        setError(null);
        setSuccess(false);
        setForm(initialForm);

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
    }, [open, onClose, initialForm]);

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
        if (emailRequired && !form.email.trim()) {
            setError("Email is required.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const pageUrl =
                typeof window !== "undefined"
                    ? window.location.origin + window.location.pathname
                    : null;

            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    phone: form.phone.trim(),
                    email: form.email.trim() || undefined,
                    bookingDate: form.bookingDate || null,
                    message: form.message.trim(),
                    serviceType,
                    serviceTitle,
                    details: details ?? null,
                    source,
                    pageUrl,
                    website: form.website,
                    tourId: typeof tourId === "number" ? tourId : undefined,
                    tourSlug: tourSlug ?? undefined,
                    tourTitle: tourTitle ?? undefined,
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
            window.setTimeout(() => onClose(), 3500);
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
                role="dialog"
                aria-modal="true"
                aria-labelledby="service-booking-title"
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
                    {eyebrow ? (
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                            {eyebrow}
                        </p>
                    ) : null}
                    <h2
                        id="service-booking-title"
                        className="mt-1 text-xl font-bold leading-snug text-base-content sm:text-2xl"
                    >
                        {title}
                    </h2>
                    {subtitle ? (
                        <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>
                    ) : null}
                </div>

                {success ? (
                    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
                            <CheckCircle2 size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-base-content">{successTitle}</h3>
                        <p className="mt-2 max-w-sm text-sm text-base-content/60">
                            {successDescription}
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

                        {summary && summary.length > 0 ? (
                            <div className="rounded-2xl border border-base-200 bg-base-200/40 p-4">
                                <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-base-content/50">
                                    Your selection
                                </div>
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                                    {summary.map((item) => (
                                        <div key={`${item.label}-${item.value}`}>
                                            <dt className="text-xs text-base-content/50">
                                                {item.label}
                                            </dt>
                                            <dd className="font-semibold text-base-content">
                                                {item.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ) : null}

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
                            label={emailRequired ? "Email" : "Email (optional)"}
                            icon={<Mail size={16} />}
                            required={emailRequired}
                        >
                            <input
                                id="bk-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                required={emailRequired}
                                value={form.email}
                                onChange={updateField("email")}
                                className="input input-bordered w-full rounded-xl"
                                placeholder="you@example.com"
                            />
                        </Field>

                        {showBookingDate ? (
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
                        ) : null}

                        <Field
                            id="bk-message"
                            label="Message (optional)"
                            icon={<MessageSquare size={16} />}
                        >
                            <textarea
                                id="bk-message"
                                name="message"
                                maxLength={2000}
                                rows={3}
                                value={form.message}
                                onChange={updateField("message")}
                                className="textarea textarea-bordered w-full rounded-xl"
                                placeholder="Anything we should know?"
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
                                        {submitLabel ?? "Confirm booking"}
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-[11px] leading-relaxed text-base-content/50">
                            By submitting you agree to be contacted by Sun Tourism about your
                            request. We never share your details with third parties.
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
