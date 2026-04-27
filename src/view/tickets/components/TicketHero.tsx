"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Search, Calendar, Users, MapPin } from "lucide-react";
import type { ServiceBookingPayload } from "@/src/view/booking/ServiceBookingModal";

const ServiceBookingModal = dynamic(
    () => import("@/src/view/booking/ServiceBookingModal"),
    { ssr: false }
);

type TicketSearch = {
    from: string;
    to: string;
    date: string;
    travelers: string;
};

const EMPTY_SEARCH: TicketSearch = {
    from: "",
    to: "",
    date: "",
    travelers: "1 Passenger",
};

function buildPayload(search: TicketSearch): ServiceBookingPayload {
    const fromLabel = search.from.trim() || "Origin";
    const toLabel = search.to.trim() || "Destination";
    const route = `${fromLabel} → ${toLabel}`;
    return {
        serviceType: "ticket",
        serviceTitle: route,
        details: {
            from: search.from.trim() || null,
            to: search.to.trim() || null,
            date: search.date || null,
            travelers: search.travelers,
        },
        source: "ticket-search",
        initialBookingDate: search.date || undefined,
        showBookingDate: !search.date,
    };
}

export default function TicketHero() {
    const [search, setSearch] = useState<TicketSearch>(EMPTY_SEARCH);
    const [open, setOpen] = useState(false);
    const [validation, setValidation] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!search.from.trim() || !search.to.trim()) {
            setValidation("Please enter both departure and destination cities.");
            return;
        }
        setValidation(null);
        setOpen(true);
    };

    const updateField =
        <K extends keyof TicketSearch>(key: K) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setSearch((prev) => ({ ...prev, [key]: event.target.value }));
        };

    const payload = buildPayload(search);
    const summary = [
        { label: "From", value: search.from || "—" },
        { label: "To", value: search.to || "—" },
        { label: "Travelers", value: search.travelers },
    ];
    if (search.date) {
        summary.push({ label: "Date", value: search.date });
    }

    return (
        <section className="relative bg-base-100 border-b border-base-200 lg:min-h-[600px] flex flex-col justify-end pb-20 pt-40 overflow-visible">
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center"
                />
                <div className="absolute inset-0 bg-[#001030]/60 backdrop-blur-[2px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center text-white mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold uppercase tracking-wider mb-6">
                        <PlaneMarker />
                        Fly Anywhere
                    </div>
                    <h1 className="font-magmawave text-5xl md:text-7xl mb-4 tracking-tighter leading-tight text-white drop-shadow-sm">
                        Find Best <span className="text-primary">Flight Deals</span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
                        Search and book flights to your favorite destinations with exclusive offers.
                    </p>
                </div>

                {/* Search Form */}
                <form
                    onSubmit={handleSearch}
                    className="bg-base-100 p-6 rounded-[2rem] shadow-2xl border border-base-200 max-w-4xl mx-auto -mb-32 relative"
                >
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-base-content/60 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <MapPin size={12} /> From
                                </span>
                            </label>
                            <input
                                type="text"
                                value={search.from}
                                onChange={updateField("from")}
                                placeholder="Dhaka (DAC)"
                                className="input input-bordered rounded-xl font-bold focus:input-primary"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-base-content/60 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <MapPin size={12} /> To
                                </span>
                            </label>
                            <input
                                type="text"
                                value={search.to}
                                onChange={updateField("to")}
                                placeholder="Destination"
                                className="input input-bordered rounded-xl font-bold focus:input-primary"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-base-content/60 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <Calendar size={12} /> Date
                                </span>
                            </label>
                            <input
                                type="date"
                                value={search.date}
                                onChange={updateField("date")}
                                className="input input-bordered rounded-xl font-bold focus:input-primary text-base-content/70"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-base-content/60 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <Users size={12} /> Travelers
                                </span>
                            </label>
                            <select
                                value={search.travelers}
                                onChange={updateField("travelers")}
                                className="select select-bordered rounded-xl font-bold focus:select-primary"
                            >
                                <option>1 Passenger</option>
                                <option>2 Passengers</option>
                                <option>3+ Passengers</option>
                            </select>
                        </div>
                    </div>

                    {validation ? (
                        <p className="mt-3 text-sm font-medium text-error">{validation}</p>
                    ) : null}

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-6 rounded-xl text-lg gap-2 shadow-lg shadow-primary/30"
                    >
                        <Search size={20} />
                        Search Flights
                    </button>
                </form>
            </div>

            <ServiceBookingModal
                open={open}
                onClose={() => setOpen(false)}
                {...payload}
                eyebrow="Request a flight quote"
                title="Book this flight"
                subtitle={
                    search.from && search.to
                        ? `${search.from} → ${search.to}${search.date ? ` · ${search.date}` : ""}`
                        : undefined
                }
                summary={summary}
                requireEmail={false}
                submitLabel="Request booking"
                successTitle="Flight request received!"
                successDescription="Our team will call or text you on the number you shared with the best fare options."
            />
        </section>
    );
}

function PlaneMarker() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
    );
}
