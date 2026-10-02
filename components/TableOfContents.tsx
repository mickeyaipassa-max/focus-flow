"use client";

import type { MouseEvent } from "react";
import { Icon } from "./Icon";

export type TableOfContentsItem = {
  label: string;
  /** Id van de sectie verderop op de pagina (zonder `#`) waar deze link naartoe springt. */
  targetId: string;
};

type TableOfContentsProps = {
  items: TableOfContentsItem[];
  className?: string;
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function smoothScrollTo(targetY: number, duration = 600) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Gebaseerd op Figma's "Table of contents" (node 2061:7049, "Link List –
 * Inhoudsopgave"), die de eerdere tegelrij (AnchorTiles) vervangt: een rij
 * in-page ankerlinks, elk met een blauw pijl-omlaag-icoon (16×16, nieuw
 * gedownload asset `arrow-down-blue.svg` — bewust een apart bestand van het
 * zwarte 24px-icoon dat de tegels gebruikten) vóór een blauwe linktekst
 * (`#0064a8`, 18px). Het icoon staat 4px lager dan de top van de regel
 * (`pt-1`), zoals in Figma, zodat het optisch op de eerste tekstregel valt.
 *
 * Echte `<a href="#...">` i.p.v. `<button>`: native ankergedrag (werkt zonder
 * JS, verschijnt in de URL, "open in nieuw tabblad" werkt).
 *
 * Responsief: Figma toont alleen het desktop-frame (één rij, 8px tussen de
 * links). Onder 600px staan de links hier onder elkaar, vanaf 600px naast
 * elkaar met omloop — een eigen, niet via Figma bevestigde aanname.
 *
 * Scroll-naar-sectie is een eigen eased animatie i.p.v. de browser-eigen
 * `scroll-behavior: smooth` (op verzoek van de opdrachtgever: expliciet
 * ease-in/ease-out): `smoothScrollTo` animeert handmatig via
 * `requestAnimationFrame` met `easeInOutCubic`. Respecteert de bestaande
 * `scroll-mt-6` van elke sectie (leest `scrollMarginTop` i.p.v. die marge te
 * hardcoden) en slaat de animatie over bij `prefers-reduced-motion`.
 */
export function TableOfContents({ items, className }: TableOfContentsProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>, targetId: string) {
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", `#${targetId}`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.scrollIntoView();
      return;
    }
    const scrollMarginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - scrollMarginTop);
  }

  return (
    <nav aria-label="Inhoudsopgave" className={className ?? "flex w-full flex-col items-start gap-2 min-[600px]:flex-row min-[600px]:flex-wrap"}>
      {items.map(({ label, targetId }) => (
        <a
          key={targetId}
          href={`#${targetId}`}
          onClick={(event) => handleClick(event, targetId)}
          className="flex items-start gap-2"
        >
          <span className="flex shrink-0 items-center pt-1">
            <Icon name="arrow-down-blue" size="sm" />
          </span>
          <span className="whitespace-nowrap text-[#0064a8] text-lg leading-[1.5] hover:underline" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {label}
          </span>
        </a>
      ))}
    </nav>
  );
}
