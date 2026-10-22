"use client";

import { useEffect, useRef, useState } from "react";
import { BedDouble, CalendarCheck, Check, CheckCircle2, Loader2, Mail, MessageSquare, Phone, User, Users } from "lucide-react";
import type { SailorMoonPriceItem } from "@/src/lib/data/sailor-moon-resorts-page";

const ROOM_EVENT = "sailor-moon-select-room";
const MIN_FILL_TIME_MS = 1500;

export function requestSailorMoonRoom(roomName: string) {
  window.dispatchEvent(new CustomEvent(ROOM_EVENT, { detail: roomName }));
  document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function formatRoomPrice(price: string) {
  const value = price.trim();
  if (!value || /^on request$/i.test(value)) return "On request";
  if (/[৳$€£]/.test(value)) return value;
  if (/^[\d,.\s]+$/.test(value)) return `৳ ${value}`;
  return value;
}

export function SailorMoonPriceGrid({ items }: { items: SailorMoonPriceItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const featured = items.length >= 3 && index === 1;
        return (
          <article
            key={item.name}
            className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border bg-base-100 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-32px_rgba(15,23,42,0.55)] ${
              featured ? "border-primary/50 ring-1 ring-primary/30" : "border-base-300 hover:border-primary/35"
            }`}
          >
            <div className="h-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            <div className="flex flex-1 flex-col p-7 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                    {featured ? "Featured stay" : "Room rate"}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">{item.name}</h3>
                </div>
                <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <BedDouble className="size-5" aria-hidden />
                </span>
              </div>

              {item.description ? (
                <p className="mt-4 text-sm leading-relaxed text-base-content/65">{item.description}</p>
              ) : null}

              <div className="mt-6 flex items-end justify-between gap-3 border-y border-base-300/80 py-5">
                <p className="font-gilliequest text-4xl leading-none tracking-tight text-primary">
                  {formatRoomPrice(item.price)}
                </p>
                <p className="pb-1 text-right text-xs font-semibold uppercase tracking-[0.16em] text-base-content/45">
                  {item.unit}
                </p>
              </div>

              {item.highlights.length > 0 ? (
                <ul className="mt-5 flex-1 space-y-3">
                  {item.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-snug text-base-content/80">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3.5" aria-hidden />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex-1" />
              )}

              <button
                type="button"
                onClick={() => requestSailorMoonRoom(item.name)}
                className="btn btn-primary mt-8 w-full rounded-full text-white"
              >
                Request this room
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

type FormProps = {
  resortName: string;
  location: string;
  checkInTime: string;
  checkOutTime: string;
  submitLabel: string;
  disclaimer?: string;
  rooms: SailorMoonPriceItem[];
  source?: string;
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  room: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  message: string;
  website: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  room: "",
  checkIn: "",
  checkOut: "",
  adults: "2",
  children: "0",
  message: "",
  website: "",
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SailorMoonBookingForm({
  resortName,
  location,
  checkInTime,
  checkOutTime,
  submitLabel,
  disclaimer,
  rooms,
  source = "Sailor Moon Beach Resorts",
}: FormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const openedAtRef = useRef(0);

  useEffect(() => {
    openedAtRef.current = Date.now();
    const onSelect = (event: Event) => {
      const roomName = String((event as CustomEvent<string>).detail ?? "");
      if (!roomName) return;
      setForm((prev) => ({ ...prev, room: roomName }));
      setSuccess(false);
    };
    window.addEventListener(ROOM_EVENT, onSelect);
    return () => window.removeEventListener(ROOM_EVENT, onSelect);
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const update =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "checkIn" && next.checkOut && next.checkOut <= value) {
          next.checkOut = "";
        }
        return next;
      });
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (form.website.trim()) {
      setSuccess(true);
      return;
    }
    if (Date.now() - openedAtRef.current < MIN_FILL_TIME_MS) {
      setError("Please take a moment to fill the form before submitting.");
      return;
    }

    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim().toLowerCase();
    const phoneDigits = phone.replace(/\D/g, "");
    const adults = Number(form.adults);
    const children = Number(form.children);

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (phoneDigits.length < 7 || phoneDigits.length > 16) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (email && !isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (rooms.length > 0 && !form.room) {
      setError("Please choose a room.");
      return;
    }
    if (!form.checkIn || !form.checkOut) {
      setError("Please choose check-in and check-out dates.");
      return;
    }
    if (form.checkOut <= form.checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }
    if (!Number.isFinite(adults) || adults < 1) {
      setError("At least one adult is required.");
      return;
    }
    if (!Number.isFinite(children) || children < 0) {
      setError("Children cannot be less than zero.");
      return;
    }

    const selected = rooms.find((room) => room.name === form.room);
    const rate = selected ? [selected.price, selected.unit].filter(Boolean).join(" ") : "";
    const guestLine = `${adults} adult${adults === 1 ? "" : "s"}, ${children} child${children === 1 ? "" : "ren"}`;
    const note = form.message.trim();
    const summary = [
      `Resort: ${resortName}`,
      form.room ? `Room: ${form.room}` : "",
      rate ? `Rate: ${rate}` : "",
      `Check-in: ${form.checkIn} (${checkInTime})`,
      `Check-out: ${form.checkOut} (${checkOutTime})`,
      `Guests: ${guestLine}`,
      location ? `Location: ${location}` : "",
      note ? `Notes: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const pageUrl = window.location.origin + window.location.pathname;
    const details = {
      resort: resortName,
      location,
      room: form.room || null,
      price: selected?.price || null,
      unit: selected?.unit || null,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      checkInTime,
      checkOutTime,
      adults,
      children,
      pageUrl,
    };

    setSubmitting(true);
    setError(null);

    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          bookingDate: form.checkIn,
          message: summary,
          serviceType: "resort",
          serviceTitle: form.room ? `${resortName} · ${form.room}` : resortName,
          details,
          source,
          pageUrl,
          website: form.website,
        }),
      });
      const bookingData = await bookingRes.json().catch(() => null);
      if (!bookingRes.ok) {
        throw new Error(bookingData?.error || "Failed to submit booking.");
      }

      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message: summary,
          source,
          pageUrl,
          website: form.website,
        }),
      });
      const leadData = await leadRes.json().catch(() => null);
      if (!leadRes.ok) {
        throw new Error(leadData?.error || "Booking was saved, but the lead record failed.");
      }

      setSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div id="booking-form" className="rounded-3xl border border-base-300 bg-base-200 px-6 py-14 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-9" aria-hidden />
        </div>
        <h3 className="text-2xl font-bold">Reservation request received</h3>
        <p className="mx-auto mt-3 max-w-md text-base-content/70">
          Thanks. Our team will contact you to confirm availability, the rate, and your stay dates.
        </p>
        <button type="button" onClick={() => setSuccess(false)} className="btn btn-primary mt-6 rounded-full text-white">
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form id="booking-form" onSubmit={handleSubmit} noValidate className="rounded-3xl border border-base-300 bg-base-200 p-6 md:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="sm-name" label="Full name" icon={<User size={16} />} required>
          <input
            id="sm-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
            className="input input-bordered w-full rounded-xl"
          />
        </Field>
        <Field id="sm-phone" label="Phone" icon={<Phone size={16} />} required>
          <input
            id="sm-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            value={form.phone}
            onChange={update("phone")}
            placeholder="+8801XXXXXXXXX"
            className="input input-bordered w-full rounded-xl"
          />
        </Field>
        <Field id="sm-email" label="Email" icon={<Mail size={16} />}>
          <input
            id="sm-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            className="input input-bordered w-full rounded-xl"
          />
        </Field>
        <Field id="sm-room" label="Room" icon={<BedDouble size={16} />} required={rooms.length > 0}>
          {rooms.length > 0 ? (
            <select
              id="sm-room"
              name="room"
              required
              value={form.room}
              onChange={update("room")}
              className="select select-bordered w-full rounded-xl"
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.name} value={room.name}>
                  {room.name}
                  {room.price ? ` — ${room.price}` : ""}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="sm-room"
              name="room"
              type="text"
              value={form.room}
              onChange={update("room")}
              placeholder="Room or package"
              className="input input-bordered w-full rounded-xl"
            />
          )}
        </Field>
        <Field id="sm-check-in" label="Check-in date" icon={<CalendarCheck size={16} />} required>
          <input
            id="sm-check-in"
            name="checkIn"
            type="date"
            required
            min={today}
            value={form.checkIn}
            onChange={update("checkIn")}
            className="input input-bordered w-full rounded-xl"
          />
        </Field>
        <Field id="sm-check-out" label="Check-out date" icon={<CalendarCheck size={16} />} required>
          <input
            id="sm-check-out"
            name="checkOut"
            type="date"
            required
            min={form.checkIn || today}
            value={form.checkOut}
            onChange={update("checkOut")}
            className="input input-bordered w-full rounded-xl"
          />
        </Field>
        <Field id="sm-adults" label="Adults" icon={<Users size={16} />} required>
          <input
            id="sm-adults"
            name="adults"
            type="number"
            required
            min={1}
            max={20}
            value={form.adults}
            onChange={update("adults")}
            className="input input-bordered w-full rounded-xl"
          />
        </Field>
        <Field id="sm-children" label="Children" icon={<Users size={16} />} >
          <input
            id="sm-children"
            name="children"
            type="number"
            min={0}
            max={20}
            value={form.children}
            onChange={update("children")}
            className="input input-bordered w-full rounded-xl"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field id="sm-message" label="Message" icon={<MessageSquare size={16} />}>
          <textarea
            id="sm-message"
            name="message"
            rows={4}
            maxLength={2000}
            value={form.message}
            onChange={update("message")}
            placeholder="Arrival time, special requests, or questions"
            className="textarea textarea-bordered w-full rounded-xl"
          />
        </Field>
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={submitting} className="btn btn-primary btn-lg mt-6 w-full rounded-full text-white">
        {submitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          submitLabel
        )}
      </button>
      {disclaimer ? <p className="mt-4 text-center text-xs text-base-content/50">{disclaimer}</p> : null}
      <p className="mt-3 text-center text-[11px] leading-relaxed text-base-content/50">
        By submitting you agree to be contacted about this stay. We use your details only to handle this request.
      </p>
    </form>
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
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-base-content/70">
        {icon}
        {label}
        {required ? <span className="text-error">*</span> : null}
      </span>
      {children}
    </label>
  );
}
