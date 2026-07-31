"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useScrolled } from "@/hooks/useScrolled";
import { splitBrandName } from "@/lib/format";
import { BRAND } from "@/config/brand";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Visit Store", href: "#visit-store" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const { primary, secondary } = splitBrandName(BRAND.businessName);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("wheel", close);
      window.removeEventListener("touchmove", close);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-lux ${
        scrolled
          ? "border-b border-border bg-background/85 py-3 backdrop-blur-md"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="container-lux flex items-center justify-between" aria-label="Primary">
        <Link href="#top" className="flex flex-col leading-none" aria-label={`${BRAND.businessName} home`}>
          <span className="font-display text-xl tracking-wide text-gold">
            {primary}
          </span>
          {secondary ? (
            <span className="mt-1 font-sans text-[0.6rem] uppercase tracking-[0.22em] text-gold/75">
              {secondary}
            </span>
          ) : null}
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-sans text-sm tracking-wide text-muted transition-colors duration-300 hover:text-ivory"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-pill border border-border text-ivory md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {open ? (
        <div className="fixed inset-0 top-0 z-40 flex flex-col items-center justify-center gap-10 bg-background md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-display-m text-ivory"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
}
