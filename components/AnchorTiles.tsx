"use client";

import type { MouseEvent } from "react";
import { Icon } from "./Icon";

export type AnchorTileItem = {
  label: string;
  /** Id van de sectie verderop op de pagina (zonder `#`) waar deze tegel naartoe springt. */
  targetId: string;
};

type AnchorTilesProps = {
  items: AnchorTileItem[];
  className?: string;
};

/**
 * Gebaseerd op Figma ("Voorwaarden vinden", node 2025:4953, "Tile Group"):
 * dezelfde rij-tegel met crème pictogram-cirkel die op de klantenservice-
 * pagina al bestaat (page.tsx's `TILE_ITEMS`), maar met een ander doel en
 * icoon — dit zijn geen links naar andere pagina's/tools, maar
 * in-page anchor-links: elke tegel springt naar een sectie verderop op
 * dezelfde pagina (labels komen letterlijk overeen met de secties eronder).
 * Daarom `<a href="#...">` i.p.v. `<button>` — correct native ankergedrag
 * (werkt zonder JS, verschijnt in de URL, "open in nieuw tabblad" werkt),
 * en het pijl-omlaag-icoon i.p.v. chevron-right, exact zoals bevestigd via
 * `get_design_context` (nieuw gedownload asset `arrow-down.svg`, 24×24).
 *
 * Responsief gedrag (1 kolom < 600px, 4 kolommen vanaf 600px) is nog niet
 * bevestigd via een mobiel Figma-frame voor déze pagina — hier bewust
 * hetzelfde patroon aangehouden als de bevestigde klantenservice-tegels,
 * als redelijke aanname totdat een mobiel frame dit bevestigt.
 *
 * Scroll-naar-sectie is een eigen eased animatie i.p.v. de browser-eigen
 * `scroll-behavior: smooth` (op verzoek van de opdrachtgever: expliciet
 * ease-in/ease-out, geen door de browser bepaalde curve) — `smoothScrollTo`
 * hieronder animeert handmatig via `requestAnimationFrame` met
 * `easeInOutCubic`. Respecteert de bestaande `scroll-mt-6` van elke
 * sectie (leest `scrollMarginTop` i.p.v. die marge hier te hardcoden) en
 * slaat de animatie over bij `prefers-reduced-motion`, zelfde discipline
 * als de rest van dit project.
 */
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

export function AnchorTiles({ items, className }: AnchorTilesProps) {
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
    <div
      className={
        className ?? "grid w-full grid-cols-1 overflow-hidden rounded-md min-[600px]:grid-cols-4"
      }
      style={{ background: "rgba(0,0,0,0.16)", gap: 1, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
    >
      {items.map(({ label, targetId }) => (
        <a
          key={targetId}
          href={`#${targetId}`}
          onClick={(event) => handleClick(event, targetId)}
          className="group flex items-center gap-3 bg-white px-4 py-3 text-left hover:bg-[#fafafa]"
        >
          <span className="flex size-10 min-[1440px]:size-12 shrink-0 scale-100 items-center justify-center rounded-full bg-[#fff8e3] group-hover:scale-[1.2] motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0,-0.4,0.4,1.6)]">
            <Icon name="arrow-down" size="md" />
          </span>
          <span className="text-black text-sm leading-[1.5] min-[600px]:text-base min-[1440px]:text-lg" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            {label}
          </span>
        </a>
      ))}
    </div>
  );
}
