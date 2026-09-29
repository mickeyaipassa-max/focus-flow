"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";

export type AccordionItem = {
  title: string;
  content?: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

/**
 * Generieke accordion, gebaseerd op Figma's losse "Accordion"-component
 * (node 15:2756) — i.t.t. `FaqAccordion.tsx` (specifiek voor vraag/antwoord-
 * paren) is dit de kale bouwsteen voor elke lijst met klap-items, hier
 * gebruikt voor "Alle eerdere modellen". Zelfde interactiepatroon
 * (`useState` voor welk item open staat, chevron roteert 180°) als
 * `FaqAccordion.tsx`/`FaqAccordion`'s footer-tegenhanger.
 *
 * Figma toont voor deze specifieke instantie alleen de dichte staat — de
 * inhoud van een opengeklapt item (waarschijnlijk een link naar het
 * betreffende oudere model) is niet bevestigd. `content` is daarom optioneel
 * en hier nog niet ingevuld; zonder `content` klapt een item niet zichtbaar
 * open (geen lege ruimte).
 */
export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={className ?? "flex w-full flex-col"}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.title} className="border-[#e5e5e5] border-b">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 py-4 text-left"
            >
              <span className="flex-1 text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                {item.title}
              </span>
              <span
                className="inline-flex shrink-0 motion-safe:transition-transform motion-safe:duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <Icon name="chevron-down" size="md" />
              </span>
            </button>
            {isOpen && item.content && <div className="pb-4">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
