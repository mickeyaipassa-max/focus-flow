"use client";

import { Fragment, forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

export type CarouselCardFeature = { text: string; included: boolean };

export type CarouselCardOption = {
  value: string;
  title: string;
  features: CarouselCardFeature[];
  /** Getoond als "€ {price} per maand" — geen placeholder-cijfers, dus een echte waarde vereist. */
  price: string;
  /** Zelfde "Highlight Tag"-badge als `RadioCardBottomOption`'s eigen `highlightLines` — hier overgenomen zodat de mobiele en desktop-weergave dezelfde inhoud tonen. */
  highlightLines?: string[];
};

type RadioCardBottomCarouselProps = {
  labelText: string;
  required?: boolean;
  options: CarouselCardOption[];
  value?: string;
  onChange?: (value: string) => void;
  onMoreInfoClick?: (value: string) => void;
  /** Zelfde patroon als `RadioCardBottomGroup`'s eigen `error`-prop. */
  error?: string;
  name?: string;
  className?: string;
  /** Zelfde patroon en reden als `RadioCardBottomGroup`'s eigen `contentTopClassName` — de fieldset's `gap` werkt niet tussen `<legend>` en de scroll-container. Genegeerd zodra `hasHighlight` al zijn eigen `mt-4` toepast. */
  contentTopClassName?: string;
  /** Meldt de actief bekeken kaart (scroll-gebaseerd, zelfde bepaling als de paginatie-stipjes) — nodig zodat `SegmentedNavPill` erboven kan meebewegen. */
  onActiveIndexChange?: (index: number) => void;
  /** Slot tussen de legend en de kaartenrij, bv. voor `SegmentedNavPill`. Los van `contentTopClassName` (die blijft de marge boven de kaartenrij zelf regelen). */
  topSlot?: ReactNode;
};

export type RadioCardBottomCarouselHandle = {
  /** Scrollt naar de opgegeven kaart — zelfde `scrollIntoView`-techniek als de interne actieve-kaart-tracking, zodat `SegmentedNavPill` de carrousel kan aansturen. */
  scrollToIndex: (index: number) => void;
};

/**
 * Puur mobiele, horizontaal swipebare variant van `RadioCardBottomGroup` —
 * gebaseerd op Figma's "asr kaart"-scherm (node 2383:6764, bestand
 * "Untitled"/q7IRrH1ahDr1P5KSWCLlBA), de nog niet gebouwde "Jouw dekking"-
 * stap van de Auto-funnel (WA/Casco-kaarten). Op verzoek een apart, nieuw
 * component i.p.v. een responsive uitbreiding van `RadioCardBottomGroup` —
 * dat component blijft de bestaande gestapelde/naast-elkaar layout houden.
 *
 * Maatvoering 1-op-1 uit Figma's eigen "Maatvoering"-toelichting op het
 * canvas (geen los component, puur documentatie ernaast): kaartbreedte
 * `calc(100vw - 72px)`, 12px tussen kaarten. De eerste kaart staat 24px
 * vanaf de linkerrand (`snap-start`, laat 36px van de volgende kaart zien);
 * elke kaart daarna — inclusief de laatste — centreert zich (`snap-center`,
 * 24px van beide buurkaarten zichtbaar). Bereikt door alleen de EERSTE
 * kaart op `snap-start` te zetten en de rest op `snap-center`, met 24px
 * linker- en 36px rechter-padding op de scroll-container (36px = de
 * "slack" die de laatste kaart nodig heeft om ook echt te centreren:
 * (schermbreedte 375 − kaartbreedte 303) / 2).
 *
 * Paginatie-stipjes onderaan: kleuren en vorm 1-op-1 uit Figma's eigen SVG
 * (actief = pil 32×12px `#eda50f`, inactief = rondje 12px `#ccc`) — hier
 * dynamisch opgebouwd i.p.v. 3 losse vaste SVG's per stand, want het aantal
 * kaarten kan variëren. Actieve kaart wordt bijgehouden via een
 * scroll-listener die per kaart het dichtstbijzijnde middelpunt bepaalt
 * (geen aparte state-prop nodig — puur visuele voortgangsindicator).
 *
 * "Meer informatie"-knoptekst en kaart-opbouw (radio onderaan, prijs,
 * check/cross-featurelijst) letterlijk hergebruikt van `RadioCardBottom`'s
 * al bevestigde stijl — Figma toonde hier zelf een niet-ingevulde "Button"-
 * placeholdertekst, op verzoek gelijkgetrokken aan dat bestaande patroon.
 * Geen `description`-regel onder de titel: die laag stond in Figma zelf op
 * hidden voor elk van de 3 kaarten, dus hier niet verzonnen.
 *
 * `highlightLines` en `error` later toegevoegd (zelfde props/gedrag als
 * `RadioCardBottomGroup`) toen deze carrousel als mobiele weergave naast
 * die desktop-groep werd ingezet op `/autonew` — zodat beide weergaven
 * exact dezelfde inhoud en validatie tonen.
 */
export const RadioCardBottomCarousel = forwardRef<RadioCardBottomCarouselHandle, RadioCardBottomCarouselProps>(function RadioCardBottomCarousel(
  {
    labelText,
    required = true,
    options,
    value,
    onChange,
    onMoreInfoClick,
    error,
    name,
    className,
    contentTopClassName,
    onActiveIndexChange,
    topSlot,
  },
  ref,
) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const errorId = `${groupName}-error`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLabelElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasHighlight = options.some((option) => option.highlightLines);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    function handleScroll() {
      const el = scrollRef.current;
      if (!el) return;
      const viewportCenter = el.scrollLeft + el.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    }

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    onActiveIndexChange?.(activeIndex);
  }, [activeIndex, onActiveIndexChange]);

  useImperativeHandle(ref, () => ({
    scrollToIndex(index) {
      cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    },
  }));

  return (
    <fieldset
      className={className ?? "m-0 flex w-full min-w-0 flex-col items-start gap-4 border-0 p-0"}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="flex items-center gap-1 p-0 px-6 text-lg leading-[1.5]">
        <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
          {labelText}
        </span>
        {required && (
          <span aria-hidden="true" className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
            *
          </span>
        )}
      </legend>

      {/* mt-4 (16px) i.p.v. de fieldset-gap: dezelfde legend-naar-sibling-quirk als bij `contentTopClassName` hieronder — de fieldset's eigen `gap` werkt niet na een `<legend>`. */}
      {topSlot && <div className="mt-4 w-full px-6">{topSlot}</div>}

      <div
        ref={scrollRef}
        className={[
          "flex w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pl-6 pr-9 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          /**
           * `contentTopClassName` compenseert normaliter de legend-naar-
           * sibling-quirk (fieldset's `gap` werkt niet ná een `<legend>`).
           * Staat er een `topSlot` tussen, dan is de kaartenrij géén
           * legend-buur meer maar een gewone sibling van `topSlot` — dáár
           * werkt de fieldset's eigen `gap-4` wel gewoon, dus zou
           * `contentTopClassName` er als EXTRA marge bovenop komen (16px
           * gap-4 + 16px mt-4 = 32px i.p.v. de bedoelde 16px, zo gevonden).
           * Vandaar hier leeg zodra `topSlot` bestaat.
           */
          hasHighlight ? "mt-4" : topSlot ? "" : (contentTopClassName ?? ""),
        ].join(" ")}
      >
        {options.map((option, index) => {
          const checked = option.value === value;
          const inputId = `${groupName}-${option.value}`;
          return (
            <label
              key={option.value}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              htmlFor={inputId}
              className={[
                "relative flex w-[calc(100vw-72px)] shrink-0 cursor-pointer flex-col items-start rounded-[3px]",
                "has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-black",
                /**
                 * `scroll-ml-6` (scroll-margin-left: 24px) alléén op de
                 * eerste kaart — i.p.v. `scroll-padding-left` op de hele
                 * container: dat laatste maakte de snapport asymmetrisch en
                 * schoof daardoor OOK de `snap-center`-kaarten 12px naar
                 * rechts (36px/12px zicht op buren i.p.v. 24px/24px, want de
                 * snapport-"center" verschuift mee met scroll-padding).
                 * `scroll-margin` werkt alleen op het snap-gebied van déze
                 * ene kaart, dus de overige kaarten centreren onaangetast op
                 * het echte scherm-midden. Zonder deze marge snapt de browser
                 * bij laden de scrollpositie naar 24 (= de `pl-6`) om de
                 * kaart tegen de padding-rand te zetten, waardoor de
                 * bedoelde 24px-marge visueel verdween (geverifieerd via
                 * scrollLeft na een fresh load/resize).
                 */
                index === 0 ? "snap-start scroll-ml-6" : "snap-center",
                checked ? "drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]" : "",
              ].join(" ")}
            >
              {option.highlightLines && (
                <span className="-translate-x-1/2 absolute top-[-15px] left-1/2 flex flex-col items-center rounded-full bg-[#eda50f] px-3 pt-[6px] pb-1 text-center font-bold text-black text-sm leading-[1.5] whitespace-nowrap" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  {option.highlightLines.map((line, lineIndex) => (
                    <span key={lineIndex}>{line}</span>
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
                <p className="w-full text-center font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  {option.title}
                </p>

                <div className="flex w-full flex-col items-start gap-2">
                  {option.features.map((feature, featureIndex) => (
                    <Fragment key={featureIndex}>
                      <div className="flex w-full items-start gap-2">
                        <span
                          className={[
                            "flex shrink-0 items-center justify-center rounded-full p-1",
                            feature.included ? "bg-[#eef4e3]" : "bg-[#f6f6f7]",
                          ].join(" ")}
                        >
                          <Icon name={feature.included ? "list-check" : "list-cross"} size="sm" />
                        </span>
                        <p className="min-w-px flex-1 pt-px text-left text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                          {feature.text}
                        </p>
                      </div>
                      {featureIndex < option.features.length - 1 && <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />}
                    </Fragment>
                  ))}
                </div>

                <div className="flex w-full flex-col items-center border-t border-[#e5e5e5] pt-4 text-center">
                  <p className="w-full text-2xl text-black leading-[1.3]" style={{ fontFamily: "var(--font-memphis-bold)" }}>
                    € {option.price}
                  </p>
                  <p className="w-full font-[350] text-[#565656] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                    per maand
                  </p>
                </div>

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

      <div className="flex w-full items-center justify-center gap-2">
        <span className="sr-only" aria-live="polite">
          Kaart {activeIndex + 1} van {options.length}
        </span>
        {options.map((option, index) => (
          <span
            key={option.value}
            aria-hidden="true"
            className={["h-3 rounded-full transition-all", index === activeIndex ? "w-8 bg-black" : "w-3 bg-[#ccc]"].join(" ")}
          />
        ))}
      </div>

      {error && (
        <div id={errorId} role="alert" className="mx-6 flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
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
});
