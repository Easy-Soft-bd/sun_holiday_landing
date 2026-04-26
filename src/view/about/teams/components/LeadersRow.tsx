"use client";

import { useState } from "react";
import { Quote, Sparkles } from "lucide-react";
import type { DirectorItem } from "../teams-page-data";

type Props = {
    directors: DirectorItem[];
    eyebrow?: string;
    title?: string;
    description?: string;
};

export default function LeadersRow({
    directors,
    eyebrow = "Leadership",
    title = "Our Top Leaders",
    description = "Meet the visionaries steering Sun Tourism Ltd.",
}: Props) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const safeDirectors = (directors || []).filter(Boolean);
    if (safeDirectors.length === 0) return null;

    // alternating pill heights for visual rhythm (taller on desktop)
    const heights = [
        "h-72 md:h-80 lg:h-[22rem]",
        "h-80 md:h-[22rem] lg:h-[25rem]",
        "h-72 md:h-80 lg:h-[23rem]",
        "h-80 md:h-[22rem] lg:h-[24rem]",
        "h-72 md:h-80 lg:h-[22rem]",
        "h-80 md:h-[22rem] lg:h-[25rem]",
    ];

    const active = safeDirectors[activeIndex] ?? safeDirectors[0];
    const activeSafe = {
        name: (active?.name || "").trim() || "Team Member",
        title: (active?.title || "").trim() || "Director",
        message:
            (active?.message || "").trim() ||
            "Thank you for trusting Sun Tourism Ltd.",
        image:
            (active?.image || "").trim() ||
            "https://placehold.co/1600x1000?text=Leader",
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-base-900 via-[#0b1220] to-base-900 text-white shadow-xl sm:rounded-[2rem]">
            {/* Active photo as low-opacity background (desktop/tablet only) */}
            <div
                key={`bg-${activeIndex}`}
                className="pointer-events-none absolute inset-0 hidden sm:block"
                aria-hidden
            >
                <img
                    src={activeSafe.image}
                    alt=""
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.12] blur-[2px] transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-base-900/85 via-base-900/80 to-base-900/95" />
            </div>

            {/* Decorative orbs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/25 blur-3xl opacity-60" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/25 blur-3xl opacity-50" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]" />
            </div>

            <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 backdrop-blur sm:text-xs">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        {eyebrow}
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                        {title}
                    </h2>
                    {description ? (
                        <p className="mx-auto mt-2 max-w-lg text-sm text-white/60 sm:mt-3 sm:text-base">
                            {description}
                        </p>
                    ) : null}
                </div>

                {/* DESKTOP / TABLET: Pill portraits row */}
                <div className="mt-8 hidden sm:block">
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 lg:gap-5">
                        {safeDirectors.map((d, i) => {
                            const heightClass = heights[i % heights.length];
                            const img =
                                (d.image || "").trim() ||
                                "https://placehold.co/600x900?text=Leader";
                            const name = (d.name || "").trim() || "Leader";
                            const isActive = activeIndex === i;
                            return (
                                <button
                                    key={`${name}-${i}`}
                                    type="button"
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onFocus={() => setActiveIndex(i)}
                                    onClick={() => setActiveIndex(i)}
                                    className={`group relative shrink-0 overflow-hidden rounded-full ring-1 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary ${heightClass} ${
                                        isActive
                                            ? "w-[140px] ring-primary/60 md:w-[170px] lg:w-[200px]"
                                            : "w-[110px] ring-white/10 md:w-[130px] lg:w-[150px]"
                                    }`}
                                    aria-label={`View message from ${name}`}
                                >
                                    <img
                                        src={img}
                                        alt={name}
                                        loading="lazy"
                                        className={`h-full w-full object-cover transition-all duration-700 ${
                                            isActive
                                                ? "scale-[1.04] grayscale-0 brightness-100"
                                                : "grayscale-[0.3] brightness-90 group-hover:grayscale-0 group-hover:brightness-100"
                                        }`}
                                    />
                                    {/* subtle gradient */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                    {/* mini label on hover */}
                                    <div
                                        className={`pointer-events-none absolute inset-x-0 bottom-0 px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white transition-opacity duration-300 ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-0 group-hover:opacity-100"
                                        }`}
                                    >
                                        <p className="line-clamp-1 text-center">
                                            {name.split(" ")[0]}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active leader message panel */}
                    <div className="mx-auto mt-8 max-w-3xl">
                        <div
                            key={activeIndex ?? 0}
                            className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-6 animate-[fadeIn_300ms_ease-out]"
                        >
                            <Quote
                                className="absolute right-4 top-4 h-10 w-10 rotate-180 text-primary/25 sm:h-14 sm:w-14"
                                strokeWidth={1.25}
                            />
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary sm:text-xs">
                                <span className="h-px w-8 bg-primary/50" />
                                Message from the {activeSafe.title}
                            </div>
                            <h3 className="mt-3 text-lg font-bold text-white sm:text-xl">
                                {activeSafe.name}
                                <span className="ml-2 font-light text-white/50">
                                    / {activeSafe.title}
                                </span>
                            </h3>
                            <p className="mt-3 max-h-40 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-white/75 sm:text-[15px]">
                                {activeSafe.message}
                            </p>
                        </div>
                        <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-white/40">
                            Hover or tap a portrait to read the message
                        </p>
                    </div>
                </div>

                {/* MOBILE: stacked cards (1 column) */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:hidden">
                    {safeDirectors.map((d, i) => {
                        const img =
                            (d.image || "").trim() ||
                            "https://placehold.co/600x900?text=Leader";
                        const name = (d.name || "").trim() || "Leader";
                        const title = (d.title || "").trim() || "Director";
                        const message =
                            (d.message || "").trim() ||
                            "Thank you for trusting Sun Tourism Ltd.";
                        return (
                            <article
                                key={`m-${name}-${i}`}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur"
                            >
                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                                    <img
                                        src={img}
                                        alt={name}
                                        loading="lazy"
                                        className="h-full w-full object-cover object-top"
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                                    <div className="absolute inset-x-3 bottom-3">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                            {title}
                                        </p>
                                        <h3 className="text-base font-bold leading-tight text-white drop-shadow">
                                            {name}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-white/75">
                                        {message}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
