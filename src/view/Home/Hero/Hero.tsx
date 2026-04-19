"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Play, MapPin } from "lucide-react";
import ClientOnly from "@/src/components/common/ClientOnly";
import { canUseNextImage } from "@/src/lib/media";

const HeroEditButton = dynamic(() => import("./HeroEditButton"), {
    ssr: false,
    loading: () => null,
});

interface HeroData {
    badgeText?: string;
    titlePart1?: string;
    titlePart2?: string;
    titlePart3?: string;
    description?: string;
    button1Text?: string;
    button1Link?: string;
    button2Text?: string;
    button2Link?: string;
    stat1Count?: string;
    stat1Label?: string;
    stat2Count?: string;
    stat2Label?: string;
    stat3Count?: string;
    stat3Label?: string;
    videoSrc?: string;
    backgroundImage?: string;
}

const defaultData = {
    badgeText: "Explore the Unexplored",
    titlePart1: "SUN",
    titlePart2: "HOLIDAYS",
    titlePart3: "LTD",
    description: "Experience world-class travel with Sun Holidays Ltd. From exotic beaches to mountain retreats, we curate memories that last a lifetime.",
    button1Text: "Find a Destination",
    button1Link: "/destinations",
    button2Text: "Watch Story",
    button2Link: "#",
    stat1Count: "500+",
    stat1Label: "Destinations",
    stat2Count: "12k+",
    stat2Label: "Happy Travelers",
    stat3Count: "24/7",
    stat3Label: "Support",
    videoSrc: "/hero/hero-video.mp4",
    backgroundImage: "/hero/hero.jpg"
};


interface HeroProps {
    data?: HeroData;
    admin?: boolean;
}

type IdleWindow = Window & {
    requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
    navigator: Window['navigator'] & {
        connection?: {
            saveData?: boolean;
            effectiveType?: string;
        };
    };
};

export default function Hero({ data, admin = false }: HeroProps) {
    const heroData = { ...defaultData, ...data };
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const supportsImageOptimization = canUseNextImage(heroData.backgroundImage);

    useEffect(() => {
        const idleWindow = window as IdleWindow;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const connection = idleWindow.navigator.connection;
        const hasSlowConnection =
            connection?.saveData ||
            connection?.effectiveType === "slow-2g" ||
            connection?.effectiveType === "2g";

        const startVideoLoad = () => {
            timeoutId = setTimeout(() => setShouldLoadVideo(true), 2500);
        };

        if (prefersReducedMotion || hasSlowConnection || window.innerWidth < 1024) {
            return undefined;
        }

        if (typeof idleWindow.requestIdleCallback === "function") {
            const idleId = idleWindow.requestIdleCallback(startVideoLoad, { timeout: 1500 });

            return () => {
                if (typeof idleWindow.cancelIdleCallback === "function") {
                    idleWindow.cancelIdleCallback(idleId);
                }
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }

        startVideoLoad();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    return (
        <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-base-300 group/hero">
            
            {/* Admin Edit Controls */}
            {admin && (
                <ClientOnly>
                    <div className="absolute bottom-4 left-4 z-50">
                        <HeroEditButton data={heroData} />
                    </div>
                </ClientOnly>
            )}

            {/* 1. Fallback / Placeholder Image (Critical for LCP SEO) */}
            {supportsImageOptimization ? (
                <Image
                    src={heroData.backgroundImage}
                    alt="Beautiful tropical holiday destination"
                    fill
                    priority
                    unoptimized={!supportsImageOptimization}
                    className="object-cover object-center"
                    sizes="100vw"
                />
            ) : (
                <Image
                    src={heroData.backgroundImage}
                    alt="Beautiful tropical holiday destination"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-center"
                    sizes="100vw"
                />
            )}

            {/* 2. Video Background */}
            {shouldLoadVideo ? (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    poster={heroData.backgroundImage}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                >
                    <source src={heroData.videoSrc} type="video/mp4" />
                </video>
            ) : null}

            {/* 3. Dark Overlay for Text Readability */}
            <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

            {/* 4. Content Layer */}
            <div className="container relative z-30 px-4 mx-auto text-center text-white">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Badge (Optional but modern) */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-bold tracking-widest uppercase italic">
                            {heroData.badgeText}
                        </span>
                    </div>

                    {/* Main SEO Headline */}
                    <h1 className="font-magmawave text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight">
                        {heroData.titlePart1} <span className="text-primary">{heroData.titlePart2}</span> {heroData.titlePart3}
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 font-medium leading-relaxed">
                        {heroData.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link
                            href={heroData.button1Link}
                            className="btn btn-primary btn-lg rounded-full px-10 text-white border-none shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
                        >
                            <MapPin size={20} />
                            {heroData.button1Text}
                        </Link>

                        <Link
                            href={heroData.button2Link}
                            className="btn btn-ghost btn-lg rounded-full px-10 text-white backdrop-blur-md border border-white/20 hover:bg-white/10 group"
                        >
                            <Play size={20} className="fill-white group-hover:scale-110 transition-transform" />
                            {heroData.button2Text}
                        </Link>
                    </div>

                    {/* Trust Indicators (SEO & Conversion) */}
                    <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-8 opacity-70 max-w-2xl mx-auto border-t border-white/10">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{heroData.stat1Count}</span>
                            <span className="text-xs uppercase tracking-widest">{heroData.stat1Label}</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-white/10">
                            <span className="text-2xl font-bold">{heroData.stat2Count}</span>
                            <span className="text-xs uppercase tracking-widest">{heroData.stat2Label}</span>
                        </div>
                        <div className="flex-col items-center hidden md:flex">
                            <span className="text-2xl font-bold">{heroData.stat3Count}</span>
                            <span className="text-xs uppercase tracking-widest">{heroData.stat3Label}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Scroll Indicator (UX) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden lg:block">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
            </div>

        </section>
    );
}
