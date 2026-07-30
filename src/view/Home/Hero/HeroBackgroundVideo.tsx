"use client";

import { useEffect, useState } from "react";

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
  navigator: Window["navigator"] & {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
    };
  };
};

export default function HeroBackgroundVideo({
  videoSrc,
  poster,
}: {
  videoSrc: string;
  poster: string;
}) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

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

  if (!shouldLoadVideo) {
    return null;
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      className="absolute inset-0 z-10 h-full w-full object-cover"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
