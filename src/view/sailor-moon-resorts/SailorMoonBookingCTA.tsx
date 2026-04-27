"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

const ServiceBookingModal = dynamic(
    () => import("@/src/view/booking/ServiceBookingModal"),
    { ssr: false }
);

type Props = {
    label: string;
    eyebrow?: string;
    resortName: string;
    location?: string;
    checkIn?: string;
    checkOut?: string;
    /** Tailwind classes for the trigger button. */
    className?: string;
    /** Disclaimer rendered below the button. */
    disclaimer?: string;
};

export default function SailorMoonBookingCTA({
    label,
    eyebrow = "Reserve your stay",
    resortName,
    location,
    checkIn,
    checkOut,
    className,
    disclaimer,
}: Props) {
    const [open, setOpen] = useState(false);

    const summary: { label: string; value: string }[] = [
        { label: "Resort", value: resortName },
    ];
    if (location) summary.push({ label: "Location", value: location });
    if (checkIn) summary.push({ label: "Check-in", value: checkIn });
    if (checkOut) summary.push({ label: "Check-out", value: checkOut });

    return (
        <div className="text-center">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={
                    className ??
                    "btn btn-primary btn-lg group rounded-full px-12 text-white shadow-xl shadow-primary/20"
                }
            >
                {label}
                <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
            </button>
            {disclaimer ? (
                <p className="mt-4 text-xs text-base-content/50">{disclaimer}</p>
            ) : null}

            <ServiceBookingModal
                open={open}
                onClose={() => setOpen(false)}
                serviceType="resort"
                serviceTitle={resortName}
                source="resort-sailor-moon"
                details={{
                    resort: resortName,
                    location: location ?? null,
                    checkIn: checkIn ?? null,
                    checkOut: checkOut ?? null,
                }}
                eyebrow={eyebrow}
                title={`Book your stay at ${resortName}`}
                subtitle={location}
                summary={summary}
                requireEmail
                submitLabel="Request reservation"
                successTitle="Reservation request received!"
                successDescription="Thanks! Our concierge team will reach out shortly to confirm availability and finalise your booking."
            />
        </div>
    );
}
