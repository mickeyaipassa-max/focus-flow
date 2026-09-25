"use client";

import { useState } from "react";
import { Icon } from "./Icon";

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
              {/*
                `Icon` i.p.v. een losse <img className="size-6">: het bestaande
                chevron-down.svg is van zichzelf géén vierkant (16,06×9,09) —
                een vaste `size-6`-vierkante box op de <img> zelf trekt de
                pijl scheef. `Icon` centreert het icoon ongeschaald in zijn
                kader (zie de toelichting in Icon.tsx), exact zoals elders in
                dit project. De rotatie-animatie zit daarom op een omhullende
                span i.p.v. op het icoon-component zelf (dat kent geen
                `style`-prop).
              */}
              <span
                className="inline-flex shrink-0 transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <Icon name="chevron-down" size="md" />
              </span>
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
