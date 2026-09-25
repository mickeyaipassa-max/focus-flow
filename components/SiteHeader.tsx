"use client";

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
 * `/header/logo-underline-lg.svg`-assets, alleen zonder de responsive
 * sm-variant: deze pagina is expliciet desktop-only (1200–1920px) bevestigd
 * in de spec, dus geen `<picture>`-breakpointswitch nodig.
 *
 * Producten/Thema's-dropdowns zijn in de Figma Make-bron alleen als
 * niet-functionele knoppen met chevron-down opgehaald — geen menu-inhoud
 * bevestigd, dus hier ook geen dropdown-paneel verzonnen.
 */
export function SiteHeader() {
  return (
    <header className="relative z-10 w-full">
      {/* Top bar: domeinswitch */}
      <div className="flex h-10 w-full items-center bg-[#f6f6f7] px-32">
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

      {/* Nav: logo (overhangend) + gecentreerd menu + Inloggen */}
      <div className="relative w-full bg-white px-32">
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
    </header>
  );
}
