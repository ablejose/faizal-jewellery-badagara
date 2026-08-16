"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BRAND } from "@/config/brand";
import { ProductsLoadingScreen } from "@/components/ProductsLoadingScreen";
import { BackButton } from "@/components/BackButton";

interface Poster {
  id: string;
  url: string;
  width?: number;
  height?: number;
}

/**
 * Offers page view: a Back button on top, then a full-screen poster stage. A
 * brand loading screen gates on every poster image; once ready, posters show
 * one at a time with a popping arrow bar + dots — but only when a second poster
 * exists.
 */
export function OffersView({ posters }: { posters: Poster[] }) {
  const total = posters.length;
  const hasMultiple = total > 1;

  const [ready, setReady] = useState(total === 0);
  const [index, setIndex] = useState(0);
  const loaded = useRef(0);

  useEffect(() => {
    loaded.current = 0;
    setReady(total === 0);
    const timeout = setTimeout(() => setReady(true), 7000);
    return () => clearTimeout(timeout);
  }, [total]);

  useEffect(() => {
    if (!hasMultiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasMultiple, total]);

  const onSettled = () => {
    loaded.current += 1;
    if (loaded.current >= total) setReady(true);
  };

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  if (total === 0) {
    return (
      <section className="container-lux pb-24">
        <div className="pt-2">
          <BackButton />
        </div>
        <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 text-center">
          <span className="label-eyebrow">Offers</span>
          <h1 className="font-display text-display-l text-ivory">No offers right now</h1>
          <p className="max-w-md font-sans text-body text-muted">
            Check back soon — festive promotions and special prices will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {!ready ? <ProductsLoadingScreen name="Offers" /> : null}

      <section>
        <div className="container-lux pt-2 pb-4">
          <BackButton />
        </div>

        <div className="relative flex min-h-[calc(100svh-11rem)] w-full items-center justify-center overflow-hidden bg-background">
          {posters.map((poster, i) => (
            <div
              key={poster.id}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Image
                src={poster.url}
                alt={`${BRAND.businessName} offer ${i + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority={i === 0}
                onLoad={onSettled}
                onError={onSettled}
              />
            </div>
          ))}

          {hasMultiple ? (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-6">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous offer"
                  className="animate-pop pointer-events-auto flex h-12 w-12 items-center justify-center rounded-pill border border-gold/50 bg-background/70 text-2xl text-gold backdrop-blur transition-colors hover:bg-gold hover:text-background"
                >
                  <span aria-hidden="true">&lsaquo;</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next offer"
                  className="animate-pop pointer-events-auto flex h-12 w-12 items-center justify-center rounded-pill border border-gold/50 bg-background/70 text-2xl text-gold backdrop-blur transition-colors hover:bg-gold hover:text-background"
                >
                  <span aria-hidden="true">&rsaquo;</span>
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center gap-2">
                {posters.map((poster, i) => (
                  <button
                    key={poster.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to offer ${i + 1}`}
                    className={`h-2.5 rounded-pill transition-all ${
                      i === index ? "w-6 bg-gold" : "w-2.5 bg-ivory/40 hover:bg-ivory/70"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
