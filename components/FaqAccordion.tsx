"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

/**
 * Generiek FAQ-accordion — geen bestaand accordion-component in deze
 * bibliotheek om te hergebruiken (het "accordion-model" elders in dit
 * project, bv. Woonverzekeringen's premie-berekenen-pagina, is een
 * pagina-brede route-architectuur, geen los UI-component). Zelfde lichte
 * interactiepatroon als `Select.tsx` — het enige andere interactieve
 * component in deze bibliotheek: gewoon `useState` voor welk item open
 * staat, geen extern accordion-package.
 *
 * Bevestigd via Figma Make-broncode ("service-hub-page.md"): standaard
 * dicht, klik klapt open (chevron roteert 180°), 1px onderrand gray-100
 * per item.
 */
export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={className ?? "flex w-full flex-col gap-1"}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="border-[#e5e5e5] border-b">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 py-4 text-left"
            >
              <span className="flex-1 text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                {item.question}
              </span>
              <img
                src="/icons/chevron-down.svg"
                alt=""
                className="size-6 shrink-0 transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            {isOpen && (
              <div className="pb-4">
                <p className="text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
