"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Product } from "@/types/collections";
import { formatRupees } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  /**
   * Load the image eagerly (used while the collection page's loading screen is
   * gating on all product imagery). Off-page/default usage stays lazy.
   */
  eager?: boolean;
  /** Fired once when the image has loaded or errored (drives the loader gate). */
  onSettled?: () => void;
}

/**
 * Product card: image, name and rupee price. Matches the site's luxury language
 * (rounded card, gold border, soft hover zoom). Uses next/image for
 * optimisation and reports load completion so the page loader can wait for it.
 */
export function ProductCard({ product, eager = false, onSettled }: ProductCardProps) {
  const settled = useRef(false);
  const handleSettled = () => {
    if (settled.current) return;
    settled.current = true;
    onSettled?.();
  };

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-gold/20 shadow-xl shadow-black/40 ring-1 ring-white/5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
          loading={eager ? "eager" : "lazy"}
          onLoad={handleSettled}
          onError={handleSettled}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </div>
      <h3 className="mt-4 font-display text-xl text-ivory">{product.name}</h3>
      <p className="mt-1 font-sans text-body text-gold">
        {product.price > 0 ? formatRupees(product.price) : "Price on request"}
      </p>
    </article>
  );
}
