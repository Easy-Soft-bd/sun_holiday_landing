"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Default hero LCP image with a loading placeholder (plain img for fastest preload). */
export default function HeroLcpImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded ? (
        <div
          className="absolute inset-0 z-[1] flex items-center justify-center bg-base-300"
          aria-hidden
        >
          <span className="loading loading-spinner loading-lg text-primary/60" />
        </div>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-640.webp"
        srcSet="/hero/hero-640.webp 640w, /hero/hero-750.webp 750w, /hero/hero-1280.webp 1280w, /hero/hero-1920.webp 1920w"
        sizes="100vw"
        alt="Beautiful tropical holiday destination"
        width={1600}
        height={1066}
        fetchPriority="high"
        decoding="sync"
        onLoad={() => setLoaded(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </>
  );
}
