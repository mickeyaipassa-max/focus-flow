"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * Site-brede header voor marketing-/servicepagina's (bv. de Service hub) —
 * bewust een NIEUW, los component van `Header.tsx`, dat funnel-specifiek is
 * (gecentreerde titel + step-indicator-context, één actie-slot rechts) en
 * hier niet herbruikt kon worden: geen domeinswitch, geen navigatie-menu,
 * geen breadcrumb-slot. Zie de toelichting in `Header.tsx` zelf — dat
 * component blijft ongewijzigd voor de bestaande funnels.
 *
 * Bevestigd via Figma Make-broncode ("service-hub-page.md"): TopBar (40px,
 * bg gray-30, domeinswitch) + Header (wit, gecentreerde nav + Inloggen
 * rechts). De logo-doos (160×77px, wit blok met groene onderlijn) is
 * letterlijk hetzelfde samengestelde beeld als `Header.tsx` al gebruikt —
 * hier hergebruikt via dezelfde `/header/logo-asr-lg.svg` +
 * `/header/logo-underline-lg.svg`-assets.
 *
 * Onder 600px is dit geen kleinere versie van dezelfde twee balken, maar een
 * structureel ander patroon — bevestigd via Figma's mobiele frame (node
 * 19:1744/19:1745): één balk (logo + "Inloggen"/"Menu"-iconknoppen), waarbij
 * "Menu" een volledig-schermbrede uitklaplaag opent (logo + "Sluiten",
 * domeinswitch, "Menu"-titel, navigatie-items, divider, "Geef feedback").
 * Beide varianten staan als aparte DOM-blokken naast elkaar, getoggled via
 * `hidden`/`min-[600px]:flex` — hetzelfde patroon als Footer/ChatWidget/
 * TileGroup elders op deze pagina, i.p.v. één laag proberen te forceren met
 * CSS-reflow.
 *
 * Producten/Thema's-dropdowns zijn in de Figma Make-bron alleen als
 * niet-functionele knoppen met chevron-down opgehaald — geen menu-inhoud
 * bevestigd, dus hier ook geen dropdown-paneel verzonnen (bevestigd:
 * hetzelfde geldt voor de mobiele uitklaplaag — Producten/Thema's blijven
 * daar ook niet-functioneel, exact zoals op desktop).
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <header className="relative z-10 w-full">
      {/* Desktop/tablet: TopBar (domeinswitch) + Nav (logo, gecentreerd menu, Inloggen) — ongewijzigd vanaf 600px. */}
      <div className="hidden min-[600px]:block">
        <div className="flex h-10 w-full items-center bg-[#f6f6f7] px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between">
            <div className="h-[77px] w-[160px] shrink-0" />
            <div className="flex shrink-0 items-center gap-5">
              <div className="flex h-10 items-center border-black border-b-2">
                <span className="text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  Particulier
                </span>
              </div>
              <div className="flex h-10 items-center">
                <span className="text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Zakelijk
                </span>
              </div>
              <div className="flex h-10 items-center">
                <span className="text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Adviseur
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full bg-white px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto flex w-full max-w-[1200px] items-center gap-10 py-5">
            <div className="-mt-[57.75px] h-[77px] w-[160px] shrink-0 overflow-hidden bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.12)]">
              <div className="relative size-full">
                <img src="/header/logo-underline-lg.svg" alt="" className="absolute inset-x-0 bottom-0 block h-[5.222px] w-full" />
                <img
                  src="/header/logo-asr-lg.svg"
                  alt="a.s.r."
                  className="-translate-x-1/2 absolute top-[26.59px] left-1/2 h-[18.766px] w-[106.039px]"
                />
              </div>
            </div>

            <nav className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <button type="button" className="flex items-center gap-2">
                <span className="whitespace-nowrap text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                  Producten
                </span>
                {/* `Icon` i.p.v. een losse <img className="size-6">: chevron-down.svg is geen vierkant (16,06×9,09) — een vaste vierkante box op de <img> zelf trekt de pijl scheef, zie de toelichting in `FaqAccordion.tsx`. */}
                <Icon name="chevron-down" size="md" />
              </button>
              <button type="button" className="flex items-center gap-2">
                <span className="whitespace-nowrap text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                  Thema&apos;s
                </span>
                <Icon name="chevron-down" size="md" />
              </button>
              <button type="button" className="flex items-center">
                <span className="whitespace-nowrap text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                  Service &amp; contact
                </span>
              </button>
            </nav>

            <div className="flex w-40 shrink-0 items-center justify-end gap-2">
              <img src="/icons/user.svg" alt="" className="size-6" />
              <span className="whitespace-nowrap text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                Inloggen
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobiel (<600px): één balk (logo + Inloggen/Menu-iconknoppen) — bevestigd via Figma node 19:1746. */}
      <div className="flex h-20 w-full items-center justify-between bg-white px-6 min-[600px]:hidden">
        {/* 120×57,75px (0,75× de desktop-doos van 160×77px) met dezelfde witte kaart+schaduw — bevestigd via Figma node 19:1748 en een screenshot-vergelijking (56:9266): de bestaande sm-assets waren al exact op deze 0,75-schaal gepositioneerd, alleen de buitenste doos stond eerder op een verzonnen 80×38,5px i.p.v. de bevestigde 120×57,75px, en miste de schaduw. */}
        <div className="relative h-[57.75px] w-[120px] shrink-0 overflow-hidden bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.12)]">
          <img src="/header/logo-underline-sm.svg" alt="" className="absolute inset-x-0 bottom-0 block h-[3.916px] w-full" />
          <img
            src="/header/logo-asr-sm.svg"
            alt="a.s.r."
            className="-translate-x-1/2 absolute top-[19.94px] left-1/2 h-[14.074px] w-[79.529px]"
          />
        </div>

        <div className="flex items-center gap-6">
          <button type="button" className="flex flex-col items-center gap-1">
            <img src="/icons/user.svg" alt="" className="size-6" />
            <span className="text-[12px] text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
              Inloggen
            </span>
          </button>
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-header-mobile-menu"
            className="flex flex-col items-center gap-1"
          >
            <img src="/icons/menu.svg" alt="" className="size-6" />
            <span className="text-[12px] text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
              Menu
            </span>
          </button>
        </div>
      </div>

      {/* Mobiele uitklaplaag — volledig scherm, alleen gemount zolang open (bevestigd via Figma node 19:1745: logo+Sluiten, domeinswitch, "Menu"-titel, navigatie-items, divider, feedback-knop). */}
      {menuOpen && (
        <div
          id="site-header-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white min-[600px]:hidden"
        >
          <div className="flex h-20 w-full shrink-0 items-center justify-between px-6">
            <div className="relative h-[57.75px] w-[120px] shrink-0 overflow-hidden bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.12)]">
              <img src="/header/logo-underline-sm.svg" alt="" className="absolute inset-x-0 bottom-0 block h-[3.916px] w-full" />
              <img
                src="/header/logo-asr-sm.svg"
                alt="a.s.r."
                className="-translate-x-1/2 absolute top-[19.94px] left-1/2 h-[14.074px] w-[79.529px]"
              />
            </div>

            <div className="flex items-center gap-6">
              <button type="button" className="flex flex-col items-center gap-1">
                <img src="/icons/user.svg" alt="" className="size-6" />
                <span className="text-[12px] text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                  Inloggen
                </span>
              </button>
              <button type="button" onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1">
                <Icon name="close" size="md" />
                <span className="text-[12px] text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                  Sluiten
                </span>
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col items-center border-[#e5e5e5] border-b pt-2 pb-10">
            <div className="flex items-center gap-5">
              <div className="flex h-10 items-center border-black border-b-2">
                <span className="text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  Particulier
                </span>
              </div>
              <div className="flex h-10 items-center">
                <span className="text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Zakelijk
                </span>
              </div>
              <div className="flex h-10 items-center">
                <span className="text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Adviseur
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col px-6 pb-4">
            <p className="text-black text-[24px] leading-[1.3]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
              Menu
            </p>
          </div>

          <div className="flex w-full flex-col gap-6 pb-6">
            <div className="flex flex-col">
              <button type="button" className="flex h-16 w-full items-center gap-4 px-6">
                <span className="flex-1 text-left text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Producten
                </span>
                <Icon name="chevron-down" size="md" />
              </button>
              <button type="button" className="flex h-16 w-full items-center gap-4 px-6">
                <span className="flex-1 text-left text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Thema&apos;s
                </span>
                <Icon name="chevron-down" size="md" />
              </button>
              <button type="button" className="flex h-16 w-full items-center gap-4 px-6">
                <span className="flex-1 text-left text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Klantenservice
                </span>
              </button>
            </div>

            <div className="h-px w-full bg-[rgba(0,0,0,0.08)]" />

            <div className="flex w-full items-center justify-center">
              <button type="button" className="flex items-center gap-2">
                <Icon name="comment" size="md" />
                <span className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                  Geef feedback
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
