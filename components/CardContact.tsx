import type { ReactNode } from "react";
import { Icon } from "./Icon";

type CardContactProps = {
  title: string;
  /** Bv. "Mogelijk moet je even wachten" — naast het klok-icoon. */
  availability: string;
  /** Icoon vóór de actielink, bv. "phone" of "edit". */
  actionIcon: string;
  actionLabel: string;
  onActionClick?: () => void;
  /** Optionele grijze voettekst, bv. "Werkdagen 08.30 – 17.30 uur" — niet elke kaart heeft die (bevestigd: alleen de telefoon-variant in Figma). */
  footerText?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Card Contact" (node 10776:7465): "een gestructureerde
 * informatiekaart voor een contactkanaal... helpt gebruikers snel te
 * begrijpen hoe ze contact kunnen opnemen en wat ze qua beschikbaarheid of
 * reactietijd kunnen verwachten." Twee instances (telefoon/contactformulier)
 * worden in stap 1 samen in een `CardContactCollage` getoond.
 */
export function CardContact({ title, availability, actionIcon, actionLabel, onActionClick, footerText, className }: CardContactProps) {
  return (
    <div className={className ?? "flex min-w-px flex-1 flex-col items-start gap-8 self-stretch bg-white p-6"}>
      {/*
        Geverifieerd via de Plugin API op het echte "Card Contact"-component
        (10776:7465, variant "graphic=false, image=false, presets=default"):
        de buitenste "Container" heeft itemSpacing 32 tussen de "section"
        (titel+beschikbaarheid+actie) en de voettekst; de "section" zelf heeft
        itemSpacing 16 tussen titel+beschikbaarheid en het actie-blok. Twee
        niveaus, twee verschillende waarden — niet overal 16px.
      */}
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full flex-col items-start gap-4">
          <h3 className="w-full font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {title}
          </h3>
          <div className="flex w-full items-start gap-2">
            <span className="flex shrink-0 items-center pt-[2px]">
              <Icon name="clock" size="sm" />
            </span>
            <p className="min-w-px flex-1 text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {availability}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-1">
          {/*
            `gap-1` i.p.v. Figma's letterlijke 8px: Icon.tsx centreert dit
            icoon (natuurlijke grootte ~19,4px, matcht Figma's eigen 9,5%-inset
            exact) binnen zijn 24px-kader, wat al ~2,3px onzichtbare ruimte aan
            weerszijden toevoegt. Een CSS-gap van 8px erbovenop gaf daardoor een
            waarneembaar te grote afstand (10,3px gemeten) tot de tekst.
          */}
          {/* `text-left`: native <button>-elementen hebben een browserdefault van `text-align: center`, die anders naar de flex-1 tekst-span erft en "(0800) 00 00 000" centreert i.p.v. links tegen het icoon laat aansluiten. */}
          <button type="button" onClick={onActionClick} className="flex w-full items-start gap-1 rounded-[3px] text-left">
            <span className="flex shrink-0 items-start">
              <Icon name={actionIcon} size="md" />
            </span>
            <span
              className="min-w-px flex-1 font-[550] text-black text-base underline decoration-solid decoration-from-font [text-underline-position:from-font] leading-[1.5]"
              style={{ fontFamily: "var(--font-avenir-medium)" }}
            >
              {actionLabel}
            </span>
          </button>
        </div>
      </div>
      {footerText && (
        <p className="w-full text-[#565656] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
          {footerText}
        </p>
      )}
    </div>
  );
}

type CardContactCollageProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Card Contact Collage" (node 10776:7644, component set
 * met variant-properties `mobile`/`columns`/`rows`). Hier geïmplementeerd
 * voor exact 2 kaarten (het enige aantal dat in Figma is bevestigd), met de
 * twee relevante variants als CSS-toggle op één markup i.p.v. gedupliceerde
 * DOM:
 * - `mobile=false, columns=2` (10776:7647): layoutMode HORIZONTAL, kaarten
 *   naast elkaar, verticale divider (border-l) ertussen.
 * - `mobile=true, rows=2` (10776:7648): layoutMode VERTICAL, itemSpacing 0,
 *   kaarten vol-breed onder elkaar, horizontale divider (border-t) ertussen.
 * Breakpoint 900px geverifieerd tegen dezelfde officiële viewport-schaal als
 * StepIndicator/Header/FunnelPageTemplate elders in deze pagina.
 */
export function CardContactCollage({ children, className }: CardContactCollageProps) {
  return (
    <div
      className={
        className ??
        [
          "flex w-full flex-col overflow-hidden rounded-md border border-[rgba(0,0,0,0.16)]",
          "[&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-t-[rgba(0,0,0,0.16)]",
          "min-[900px]:flex-row min-[900px]:items-start",
          "min-[900px]:[&>*:not(:first-child)]:border-t-0 min-[900px]:[&>*:not(:first-child)]:border-l min-[900px]:[&>*:not(:first-child)]:border-l-[rgba(0,0,0,0.16)]",
        ].join(" ")
      }
    >
      {children}
    </div>
  );
}
