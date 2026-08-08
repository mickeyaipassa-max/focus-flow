import type { ReactNode } from "react";

type FunnelSectionProps = {
  /** Figma's "Form title"/"Title" zijn placeholder-demotekst — geen default, elke afnemer geeft zijn eigen titel mee. */
  title: string;
  description?: string;
  /** De component-slots binnen deze sectie (Figma's roze "swap this"-placeholders) — echte formuliervelden van de afnemer. */
  children?: ReactNode;
  /** Grotere 40px kop + 24px gap — Figma's "Intro section" (het eerste, altijd-aanwezige blok in de kaart). Standaard uit: een gewone 32px "Form section"-kop met 40px gap. */
  intro?: boolean;
  /** Toont de "Velden met * zijn verplicht"-regel — in Figma uitsluitend op de Intro section. Onafhankelijk van de afsluitende divider (zie `intro`): die staat er in Figma's IntroSection-component altijd, ook zonder deze regel. */
  showRequiredFieldsNote?: boolean;
  /** Toont een divider vóór deze sectie. Figma's gewone "Form section" heeft die altijd; de Intro section (altijd de eerste) nooit. */
  showDividerAbove?: boolean;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Intro section" (node 1277:3053) en de herhaalbare
 * "Form section"-blokken binnen "Funnel Template" (node 1277:3079, uit het
 * "Templates"-bestand). Dit is het contentblok dat de generieke funnel-
 * templates herhaaldelijk stapelen — hier als los, herbruikbaar component
 * gebouwd zodat een funnel op maat wordt samengesteld uit meerdere
 * `FunnelSection`s binnen `FunnelPageTemplate`, i.p.v. dat elke funnel dit
 * blok opnieuw natekent.
 */
export function FunnelSection({
  title,
  description,
  children,
  intro = false,
  showRequiredFieldsNote = false,
  showDividerAbove = false,
  className,
}: FunnelSectionProps) {
  return (
    <div className={className ?? ["flex w-full flex-col items-start", intro ? "gap-6" : "gap-10"].join(" ")}>
      {showDividerAbove && <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />}

      <div className="flex w-full flex-col items-start gap-2">
        {/*
          Fontsize per breakpoint geverifieerd op alle 5 officiële viewport-
          instances (node 11256:32902, resp. 1440/1200/900/600/375px):
          "Form title" (intro-h1) is 40px van 1440 t/m 600px en pas 32px
          onder 600px; "Title" (sectie-h2) is 32px t/m 600px en 24px onder
          600px. Beide waren voorheen statisch — geen van beide viel terug
          voor de kleinste viewport.
        */}
        {intro ? (
          <h1 className="w-full text-[32px] text-black leading-[1.2] min-[600px]:text-[40px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            {title}
          </h1>
        ) : (
          <h2 className="w-full text-[24px] text-black leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            {title}
          </h2>
        )}
        {description && (
          <p className="w-full font-[350] text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        )}
      </div>

      {children && <div className="flex w-full flex-col items-start gap-10">{children}</div>}

      {intro && (
        <div className="flex w-full flex-col items-end gap-2">
          {showRequiredFieldsNote && (
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="text-black text-sm" style={{ fontFamily: "var(--font-avenir-book)" }}>
                Velden met
              </span>
              <span className="text-[#ce0a1e] text-base" style={{ fontFamily: "var(--font-avenir-book)" }}>
                *
              </span>
              <span className="text-black text-sm" style={{ fontFamily: "var(--font-avenir-book)" }}>
                zijn verplicht
              </span>
            </div>
          )}
          <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
        </div>
      )}
    </div>
  );
}
