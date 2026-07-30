"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Omits heavy below-fold content from the SSR HTML DOM. Mounts on the first user
 * gesture, or after a long idle fallback so hydration does not compete with
 * hero LCP. Optional `fallback` shows skeletons while waiting.
 */
export default function HomeDeferredGate({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    let done = false;
    let fallbackId: ReturnType<typeof setTimeout> | undefined;

    const enable = () => {
      if (done) return;
      done = true;
      if (fallbackId !== undefined) clearTimeout(fallbackId);
      setReady(true);
    };

    window.addEventListener("scroll", enable, { passive: true, once: true });
    window.addEventListener("touchstart", enable, { passive: true, once: true });
    window.addEventListener("pointerdown", enable, { once: true });
    window.addEventListener("keydown", enable, { once: true });

    const startFallback = () => {
      fallbackId = setTimeout(enable, 5000);
    };

    if (document.readyState === "complete") {
      startFallback();
    } else {
      window.addEventListener("load", startFallback, { once: true });
    }

    return () => {
      if (fallbackId !== undefined) clearTimeout(fallbackId);
      window.removeEventListener("scroll", enable);
      window.removeEventListener("touchstart", enable);
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
      window.removeEventListener("load", startFallback);
    };
  }, [ready]);

  if (!ready) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
