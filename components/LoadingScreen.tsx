"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/config/brand";

export function LoadingScreen() {
  const [mounted, setMounted] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let removeTimer: ReturnType<typeof setTimeout>;

    const dismiss = () => {
      setFading(true);
      removeTimer = setTimeout(() => setMounted(false), 600);
    };

    const minTimer = setTimeout(() => {
      if (document.readyState === "complete") {
        dismiss();
      } else {
        window.addEventListener("load", dismiss, { once: true });
      }
    }, 1000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(removeTimer);
      window.removeEventListener("load", dismiss);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${BRAND.businessName}`}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-background transition-opacity duration-500 ease-lux ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span className="px-6 text-center font-display text-display-m font-medium tracking-tight text-ivory">
        {BRAND.businessName}
      </span>
      <span className="flex items-center gap-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 animate-bounce rounded-pill bg-gold [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-pill bg-gold [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-pill bg-gold" />
      </span>
    </div>
  );
}
