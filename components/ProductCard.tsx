"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Product } from "@/types/collections";
import { BRAND } from "@/config/brand";
import { formatRupees, quantityLabel, whatsappHref } from "@/lib/format";

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
 * Product card: image, name, rupee price, optional quantity, and a full-width
 * WhatsApp "Buy" enquiry button pre-filled with the product's details. Matches
 * the site's luxury language (rounded card, gold border, soft hover zoom).
 */
export function ProductCard({ product, eager = false, onSettled }: ProductCardProps) {
  const settled = useRef(false);
  const handleSettled = () => {
    if (settled.current) return;
    settled.current = true;
    onSettled?.();
  };

  const qty = quantityLabel(product.quantity, product.unit);
  const priceText = product.price > 0 ? formatRupees(product.price) : "Price on request";

  // Pre-fill a WhatsApp enquiry with the exact product details.
  const enquiryLines = [
    `Hello ${BRAND.businessName}, I'd like to buy / enquire about this product:`,
    "",
    `Product: ${product.name}`,
  ];
  if (qty) enquiryLines.push(`Quantity: ${qty}`);
  enquiryLines.push(`Price: ${priceText}`);
  enquiryLines.push("", "Please share the details and availability.");
  const enquiryHref = whatsappHref(BRAND.whatsapp, enquiryLines.join("\n"));

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
      <div className="mt-1 flex items-baseline gap-2">
        {qty ? <span className="font-sans text-body font-bold text-ivory">{qty}</span> : null}
        <span className="font-sans text-body text-gold">{priceText}</span>
      </div>
      <a
        href={enquiryHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buy or enquire about ${product.name} on WhatsApp`}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 font-sans text-body font-medium text-background transition hover:opacity-90"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.892a11.821 11.821 0 00-3.484-8.463z" />
        </svg>
        Buy
      </a>
    </article>
  );
}
