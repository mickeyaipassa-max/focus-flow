"use client";

import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";

export type RadioCardBottomFeature = {
  text: string;
  included: boolean;
  /**
   * Extra regels ónder `text` (bv. "€ 100 eigen risico" / "Als extra dekking
   * te kiezen") — bevestigd op de Reisverzekering-funnel "Jouw dekking"-stap
   * (node 2416:2956), waar elk feature-item tot 3 regels toont i.p.v. de tot
   * nu toe enige-regel-tekst. Optioneel: bestaande 1-regelige features
   * (mutatie-funnel) geven dit niet mee en blijven ongewijzigd.
   */
  details?: string[];
};

export type RadioCardBottomOption = {
  value: string;
  title: string;
  /** Ontbreekt bij de "compact" variant (zie `RadioCardBottomGroupProps.variant`) — Aansprakelijkheid's kaarten tonen alleen een titel, geen subtekst. */
  description?: string;
  /** Ontbreekt bij de "compact" variant — geen featurelijst dan. */
  features?: RadioCardBottomFeature[];
  /**
   * Getoond als "€ {price} per maand" — geen placeholder-cijfers, dus een
   * echte waarde vereist zodra hij wordt getoond. Ontbreekt bij de "compact"
   * variant: Aansprakelijkheid's kaarten (node 180:5051;10783:74593) tonen
   * bevestigd via mcp geen prijsblok per kaart, alleen titel + radio-stip —
   * de premie zelf komt uit een expliciete afspraak met de opdrachtgever
   * (€ 4,50 / € 6,20) en wordt alleen in de kassabon getoond, niet hier.
   */
  price?: string;
  /**
   * Toont "vanaf" boven de prijs (bevestigd op dezelfde Reisverzekering-stap
   * — elke kaart daar toont "vanaf € X,XX", i.p.v. de kale "€ X,XX" van de
   * mutatie-funnel-kaarten). Optioneel, default geen "vanaf"-tekst.
   */
  priceFrom?: boolean;
  /**
   * Verbergt "per maand" onder de prijs (bevestigd op dezelfde
   * Reisverzekering-stap: die toont alleen "vanaf € X,XX", zonder "per
   * maand" erna — anders dan de mutatie-funnel-kaarten, die dat wel tonen).
   * Optioneel, default `true` (bestaand gedrag ongewijzigd).
   */
  showPricePeriod?: boolean;
  /**
   * Regels voor de gele "Highlight Tag"-badge boven de kaart (bevestigd op
   * de Auto-funnel "Jouw dekking"-stap, node 2383:21799 — daar alleen op de
   * WA-kaart, niet op de andere 2, die in Figma zelf een niet-afgemaakte
   * ("Meest gekozen" zonder tweede regel) resp. letterlijk onopgeloste
   * ("Highlight Tag"-placeholdertekst) badge tonen). Geen badge zonder deze
   * prop — bewust geen default tekst, want dit is per-kaart content.
   */
  highlightLines?: string[];
};

/**
 * Toont een `Spinner` i.p.v. de prijs, 1 seconde lang, telkens wanneer
 * `price` verandert (na de eerste render) — zelfde "herberekenen"-patroon
 * en dezelfde reden als `Receipt`'s eigen `summaryAmount`: een wijziging
 * elders (hier: het gekozen eigen risico) heeft impact op dit bedrag.
 * Losse subcomponent i.p.v. lokale state in de groep zelf, want elke kaart
 * moet z'n eigen onafhankelijke spinner-venster hebben.
 */
function DekkingPrice({ price, priceFrom, showPeriod = true }: { price: string; priceFrom?: boolean; showPeriod?: boolean }) {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsRecalculating(true);
    const timeout = setTimeout(() => setIsRecalculating(false), 1000);
    return () => clearTimeout(timeout);
  }, [price]);

  return (
    <div className="flex w-full flex-col items-center border-t border-[#e5e5e5] pt-4 text-center">
      {isRecalculating ? (
        <span className="flex items-center justify-center py-1" aria-live="polite" aria-label="Prijs wordt herberekend">
          <Spinner size="md" />
        </span>
      ) : (
        <>
          {priceFrom && (
            <p className="w-full font-[350] text-[#565656] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              vanaf
            </p>
          )}
          <p className="w-full text-2xl text-black leading-[1.3]" style={{ fontFamily: "var(--font-memphis-bold)" }}>
            € {price}
          </p>
          {showPeriod && (
            <p className="w-full font-[350] text-[#565656] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              per maand
            </p>
          )}
        </>
      )}
    </div>
  );
}

type RadioCardBottomGroupProps = {
  labelText: string;
  /** Toelichting onder de legend, vóór de kaartenrij — zelfde plek/stijl als `RadioGroup`'s eigen `description`, hier `ReactNode` i.p.v. `string` omdat Aansprakelijkheid's toelichting een link bevat ("Bekijk wie en wat is verzekerd", node 180:5051;10783:74593;1099:302;11148:4293). */
  description?: ReactNode;
  required?: boolean;
  options: RadioCardBottomOption[];
  value?: string;
  onChange?: (value: string) => void;
  onMoreInfoClick?: (value: string) => void;
  /**
   * "detailed" (default) = ongewijzigd bestaand gedrag: featurelijst +
   * prijsblok + "Meer informatie"-link per kaart (mutatie-funnel/Opstal/
   * Inboedel). "compact" = alleen titel + radio-stip, zonder die drie
   * blokken — bevestigd via mcp voor Aansprakelijkheid's "Kies een maximaal
   * verzekerd bedrag"-kaarten (node 180:5051;10783:74593;1099:302;
   * 11092:3714/3715): die tonen geen features, geen prijs en geen
   * "Meer informatie", puur titel + radio.
   */
  variant?: "detailed" | "compact";
  /** Zelfde foutmelding-patroon als `RadioGroup`'s eigen `error`-prop — nodig zodra een groep zonder standaardselectie start (bevestigd op de Auto-funnel "Jouw dekking"-stap, geen enkele kaart staat daar standaard aan). */
  error?: string;
  name?: string;
  className?: string;
  /**
   * Extra marge boven de kaartenrij, los van de fieldset's eigen `gap`: die
   * gap werkt niet tussen `<legend>` en de eerstvolgende sibling (bekende
   * browserquirk — legend doet niet mee aan de normale flex-gap-berekening,
   * geverifieerd via `getBoundingClientRect()` op de Auto-funnel "Jouw
   * dekking"-stap: legend-bottom en kaartenrij-top vielen exact samen
   * ondanks `gap-4`). Genegeerd zodra `hasHighlight` al zijn eigen `mt-4`
   * toepast (badge-clearance gaat voor).
   */
  contentTopClassName?: string;
};

/**
 * Gebaseerd op Figma's "Radio Card Control Bottom (Group)" — bevestigd via
 * mcp op de mutatie-funnel "Kies je dekking"-stap (node 8031:10820, cards
 * "Basis"/"Allrisk"). Zelfde naam als de bestaande `RadioCardGroup`, maar
 * een structureel ander component: radio-indicator ónderaan i.p.v. een
 * losse kolom links, plus een featurelijst (check/cross) en prijsblok die
 * `RadioCardGroup` niet heeft — geen van beide bestaande componenten dekt
 * deze variant, vandaar een nieuw, eigen component.
 *
 * `<label>` + verborgen `<input type="radio">` i.p.v. Figma's letterlijke
 * `<button>`-element — zelfde toegankelijkheidsredenering als
 * `RadioCardGroup`/`RadioGroup`: gratis formuliersemantiek en
 * toetsenbordnavigatie, geen nieuw patroon t.o.v. wat al in dit project
 * bestaat.
 *
 * De check/cross-iconen binnen de featurelijst zijn losse nieuwe bestanden
 * (`list-check`/`list-cross`) i.p.v. de bestaande `check`/`x`: die bestaande
 * bestanden zijn een ander glyph met een andere kleur/verhouding (bevestigd
 * via een directe mcp-vergelijking) — hergebruik zou hier zelf een icoon
 * verzinnen zijn.
 */
export function RadioCardBottomGroup({
  labelText,
  description,
  required = true,
  options,
  value,
  onChange,
  onMoreInfoClick,
  variant = "detailed",
  error,
  name,
  className,
  contentTopClassName,
}: RadioCardBottomGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const errorId = `${groupName}-error`;
  const isCompact = variant === "compact";
  /** Extra ruimte boven de kaartenrij zodra een "Highlight Tag"-badge (absoluut, -15px boven de kaart) anders over de legend zou vallen. */
  const hasHighlight = options.some((option) => option.highlightLines);

  return (
    <fieldset
      className={className ?? "m-0 flex w-full flex-col items-start gap-4 border-0 p-0"}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="flex items-center gap-1 p-0 text-lg leading-[1.5]">
        <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
          {labelText}
        </span>
        {required && (
          <span aria-hidden="true" className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
            *
          </span>
        )}
      </legend>
      {description && (
        <div className="w-full text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
          {description}
        </div>
      )}

      <div
        className={[
          "flex w-full flex-col items-stretch gap-4 min-[600px]:flex-row",
          hasHighlight ? "mt-4" : (contentTopClassName ?? ""),
        ].join(" ")}
      >
        {options.map((option) => {
          const checked = option.value === value;
          const inputId = `${groupName}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              /**
               * `preventDefault` + zelf `focus({ preventScroll: true })` +
               * zelf `onChange` aanroepen, i.p.v. de browser natuurlijk de
               * (onzichtbare, `sr-only`) radio-input laten activeren.
               *
               * Eerder werd de scrollpositie ná de klik hersteld (capture-en-
               * corrigeer via dubbele `requestAnimationFrame`), maar dat bleek
               * niet waterdicht bij een echte, "trusted" muisklik: Chrome
               * animeert de native focus-scroll voor trusted events soms
               * (geen CSS `scroll-behavior: smooth` nodig, browsers doen dit
               * intern), dus de eenmalige correctie ving de sprong soms
               * halverwege af i.p.v. hem volledig te voorkomen (gemeten: een
               * kleine, hardnekkige restverspringing van ~24px bij een echte
               * klik, ook al toonde elke synthetische testklik géén sprong).
               * Nu voorkomt `preventDefault` de browser-eigen scroll-naar-
               * focus helemaal, in plaats van hem achteraf te repareren.
               */
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(inputId)?.focus({ preventScroll: true });
                onChange?.(option.value);
              }}
              className={[
                "relative flex min-w-px flex-1 cursor-pointer flex-col items-start rounded-[3px]",
                "has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-black",
                checked ? "drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]" : "",
              ].join(" ")}
            >
              {option.highlightLines && (
                <span className="-translate-x-1/2 absolute top-[-15px] left-1/2 flex flex-col items-center rounded-full bg-[#eda50f] px-3 pt-[6px] pb-1 text-center font-bold text-black text-sm leading-[1.5] whitespace-nowrap" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  {option.highlightLines.map((line, index) => (
                    <span key={index}>{line}</span>
                  ))}
                </span>
              )}

              <input
                id={inputId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={checked}
                onChange={() => onChange?.(option.value)}
                required={required}
                className="sr-only"
              />

              <div
                className={[
                  "flex w-full flex-col items-center gap-4 rounded-t-[3px] border-t border-r border-l bg-white px-6 pb-4",
                  option.highlightLines ? "pt-10" : "pt-6",
                  checked ? "border-[#eda50f]" : "border-[#ccc]",
                ].join(" ")}
              >
                <div className="flex w-full flex-col items-start text-center">
                  <p className="w-full font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                    {option.title}
                  </p>
                  {option.description && (
                    <p className="w-full font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                      {option.description}
                    </p>
                  )}
                </div>

                {!isCompact && option.features && option.features.length > 0 && (
                  <div className="flex w-full flex-col items-start gap-2">
                    {(() => {
                      /**
                       * Zodra een kaart feature-items met `details` heeft,
                       * gebruikt de featurenaam ("Bagage tot € 1.000")
                       * `--font-avenir-medium` i.p.v. het standaard
                       * `--font-avenir-book`-leesgewicht van de mutatie-
                       * funnel-kaarten (die nooit `details` meegeven, dus
                       * ongewijzigd blijven) — 350 (Book) bleek te dun om
                       * onderscheid te houden met de detailregel eronder
                       * ("€ 100 eigen risico"), die `--font-avenir-light`
                       * (Avenir 35 Light) gebruikt. Bevestigd doordat de
                       * gebruiker de daadwerkelijke Figma-typography-
                       * inspector liet zien: het gekoppelde font-family-token
                       * voor de detailregel bleek daar losgekoppeld, maar het
                       * losse gewicht-token heette letterlijk
                       * "font-text-weight-light".
                       */
                      const features = option.features ?? [];
                      const hasFeatureDetails = features.some((feature) => feature.details);
                      return features.map((feature, index) => (
                        <Fragment key={index}>
                          <div className="flex w-full items-start gap-2">
                            <span
                              className={[
                                "flex shrink-0 items-center justify-center rounded-full p-1",
                                feature.included ? "bg-[#eef4e3]" : "bg-[#f6f6f7]",
                              ].join(" ")}
                            >
                              <Icon name={feature.included ? "list-check" : "list-cross"} size="sm" />
                            </span>
                            <div className="flex min-w-px flex-1 flex-col items-start pt-px text-left">
                              <p
                                className={["w-full text-black text-base leading-[1.5]", hasFeatureDetails ? "font-[550]" : "font-[350]"].join(" ")}
                                style={{ fontFamily: hasFeatureDetails ? "var(--font-avenir-medium)" : "var(--font-avenir-book)" }}
                              >
                                {feature.text}
                              </p>
                              {feature.details?.map((detail, detailIndex) => (
                                <p
                                  key={detailIndex}
                                  className="w-full font-[300] text-black text-base leading-[1.5]"
                                  style={{ fontFamily: "var(--font-avenir-light)" }}
                                >
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                          {index < features.length - 1 && <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />}
                        </Fragment>
                      ));
                    })()}
                  </div>
                )}

                {!isCompact && option.price && (
                  <DekkingPrice price={option.price} priceFrom={option.priceFrom} showPeriod={option.showPricePeriod ?? true} />
                )}

                {/*
                  Losse, lokale knop i.p.v. het gedeelde `Button`-component:
                  deze knop zit genest in het `<label>` van de radio, dus een
                  klik moet de radio-selectie niet meenemen. Zelfde
                  stopPropagation-aanpak als CheckboxCardControlLeft's eigen
                  "Meer informatie"-knop, die voor exact dezelfde reden ook
                  geen gedeeld `Button` gebruikt (dat component accepteert
                  geen event-object in `onClick`).

                  `justify-center` bevestigd via mcp op de Reisverzekering-
                  funnel "Jouw dekking"-stap (node 2416:3490): "Meer
                  informatie" staat daar gecentreerd, niet links uitgelijnd.

                  Alleen in de "detailed" variant — Aansprakelijkheid's
                  compacte kaarten (node 180:5051;10783:74593;1099:302;
                  11092:3714/3715) hebben geen "Meer informatie"-link.
                */}
                {!isCompact && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onMoreInfoClick?.(option.value);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-[3px]"
                  >
                    <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                      Meer informatie
                    </span>
                  </button>
                )}
              </div>

              <div
                className={[
                  "flex w-full items-center justify-center rounded-b-[3px] border px-6 py-2",
                  checked ? "border-[#eda50f] bg-[#fff8e3]" : "border-[#ccc] bg-[#f6f6f7]",
                ].join(" ")}
              >
                <span className="relative inline-flex size-5 shrink-0">
                  <span
                    aria-hidden="true"
                    className={[
                      "pointer-events-none absolute inset-0 rounded-full border bg-white",
                      checked ? "border-[6px] border-black" : "border-[#565656]",
                    ].join(" ")}
                  />
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <div id={errorId} role="alert" className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
          <span className="flex shrink-0 items-center pt-[3px]">
            <Icon name="validation-error" size="sm" />
          </span>
          <span className="flex items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
            {error}
          </span>
        </div>
      )}
    </fieldset>
  );
}
