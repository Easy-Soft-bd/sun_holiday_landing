"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowRight, Plane } from "lucide-react";
import AppImage from "@/src/components/common/AppImage";
import type { PublicTicketRoute } from "@/src/lib/ticket/types";

const ServiceBookingModal = dynamic(() => import("@/src/view/booking/ServiceBookingModal"), {
    ssr: false,
});

const currencyFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

type PopularRoutesProps = {
    routes: PublicTicketRoute[];
};

export default function PopularRoutes({ routes }: PopularRoutesProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const selected = routes.find((route) => route.id === selectedId) ?? null;

    return (
        <section className="bg-base-50 py-14 sm:py-20">
            <div className="container mx-auto px-4">
                <div className="mb-10 text-center sm:mb-12">
                    <h2 className="mb-4 font-magmawave text-3xl sm:text-4xl">
                        Popular <span className="text-primary">Routes</span>
                    </h2>
                    <p className="text-base-content/70">Routes our ticket desk arranges most often. Tap a card to send your number.</p>
                </div>

                {routes.length === 0 ? (
                    <p className="text-center text-base-content/60">Popular routes will appear here once they are published.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {routes.map((route) => (
                            <button
                                key={route.id}
                                type="button"
                                onClick={() => setSelectedId(route.id)}
                                className="group overflow-hidden rounded-3xl border border-base-200 bg-base-100 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
                            >
                                <div className="relative h-40 overflow-hidden">
                                    {route.image ? (
                                        <AppImage
                                            src={route.image}
                                            alt={`${route.from} to ${route.to}`}
                                            fill
                                            loading="lazy"
                                            quality={55}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-primary/10 text-primary">
                                            <Plane size={28} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 font-bold text-white">
                                        <span className="min-w-0 truncate">{route.from}</span>
                                        <ArrowRight size={16} className="shrink-0" />
                                        <span className="min-w-0 truncate">{route.to}</span>
                                    </div>
                                </div>
                                <div className="p-5 sm:p-6">
                                    {route.airline ? (
                                        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/70">
                                            <Plane size={14} className="shrink-0" />
                                            <span className="truncate">{route.airline}</span>
                                        </div>
                                    ) : null}
                                    {route.note ? <p className="mb-3 line-clamp-2 text-sm text-base-content/70">{route.note}</p> : null}
                                    <div className="flex items-end justify-between gap-3">
                                        <div className="min-w-0">
                                            {route.priceFrom != null ? (
                                                <>
                                                    <p className="mb-1 text-xs text-base-content/70">Starts from</p>
                                                    <p className="text-xl font-black text-primary">{currencyFormatter.format(route.priceFrom)}</p>
                                                </>
                                            ) : (
                                                <p className="text-sm font-semibold text-base-content/70">Ask for the current fare</p>
                                            )}
                                        </div>
                                        <span className="btn btn-sm btn-ghost shrink-0 rounded-full text-primary group-hover:bg-primary/10">
                                            Send query
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ServiceBookingModal
                open={selected != null}
                onClose={() => setSelectedId(null)}
                serviceType="ticket"
                serviceTitle={selected ? `${selected.from} → ${selected.to}` : "Ticket query"}
                source="ticket-route"
                details={
                    selected
                        ? {
                              from: selected.from,
                              to: selected.to,
                              routeId: selected.id,
                              airline: selected.airline,
                              priceFrom: selected.priceFrom,
                              note: selected.note,
                          }
                        : null
                }
                showBookingDate
                eyebrow="Send a ticket query"
                title={selected ? `${selected.from} → ${selected.to}` : "Tell us how to reach you"}
                subtitle="Share your name and phone. Our ticket desk will call you about this route."
                summary={
                    selected
                        ? [
                              { label: "From", value: selected.from },
                              { label: "To", value: selected.to },
                              ...(selected.airline ? [{ label: "Airline", value: selected.airline }] : []),
                          ]
                        : []
                }
                requireEmail={false}
                submitLabel="Send Query"
                successTitle="Query received!"
                successDescription="Our ticket desk will call or text you with the fare options for this route."
            />
        </section>
    );
}
