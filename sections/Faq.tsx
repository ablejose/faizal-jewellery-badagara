"use client";

import { useId, useState } from "react";
import { BRAND } from "@/config/brand";
import { SectionHeading } from "@/components/SectionHeading";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const baseId = useId();

  if (BRAND.faq.length === 0) return null;

  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="container-lux max-w-3xl">
        <SectionHeading eyebrow="Answers" title="Frequently Asked Questions" />

        <div className="mt-10 divide-y divide-border border-y border-border">
          {BRAND.faq.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${baseId}-faq-button-${index}`;
            const panelId = `${baseId}-faq-panel-${index}`;
            return (
              <div key={index}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left font-sans text-body-lg text-ivory"
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-gold transition-transform duration-300 ease-lux ${isOpen ? "rotate-180" : ""}`}
                    >
                      ⌄
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={\!isOpen}
                  className="pb-6 font-sans text-body text-muted"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
