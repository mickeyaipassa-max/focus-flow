"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

export type SegmentedNavPillOption = { value: string; title: string };

type SegmentedNavPillProps = {
  options: SegmentedNavPillOption[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Segmented Nav Pill" (node 2412:7738, bestand
 * "Untitled"/q7IRrH1ahDr1P5KSWCLlBA) — zelf gebouwd als los component naast
 * de oorspronkelijke referentieschets (node 2403:28971), later door de
 * gebruiker verfijnd (strakkere regelhoogte, bredere fade, iets lager
 * gepositioneerde chevrons) — die verfijningen zijn hier 1-op-1 verwerkt.
 *
 * Toont dezelfde 3 opties als `RadioCardBottomCarousel` erboven en moet
 * daar altijd mee gesynchroniseerd zijn: geen eigen losse selectiestate,
 * puur aangestuurd via `activeIndex`/`onSelect` vanuit de pagina.
 *
 * Positionering van de actieve pil: EERST geprobeerd via zuiver
 * `scroll-snap` + `scrollIntoView` (zelfde techniek als de kaarten-
 * carrousel) — bleek voor déze rij niet te werken: de rij heeft simpelweg
 * te weinig scrollbare ruimte om een middelste knop echt te centreren
 * (gemeten: het zou 12px verder naar links moeten scrollen dan scrollLeft=0
 * toelaat, dus bleef de knop altijd 12px links van het midden hangen).
 * Vandaar hier een EXPLICIETE `scrollLeft`-berekening i.p.v. op de browser
 * te vertrouwen: eerste knop → scrollLeft = eigen offsetLeft (sluit direct
 * aan op de onzichtbare `spacer`, dus toch echt tegen de rand); laatste
 * knop → scrollLeft = eigen rand min zichtbare breedte (sluit aan tegen de
 * rand, de trailing spacer telt daar bewust niet in mee); alles ertussen →
 * echt wiskundig midden. De onzichtbare `spacer`-elementen vóór/na de rij
 * geven de nodige EXTRA scrollruimte om dat middelste geval te laten
 * kloppen, zonder de eerste/laatste knop zelf te verschuiven.
 *
 * Chevron-zichtbaarheid volgt puur `activeIndex` (niet de ruwe
 * scrollpositie): `‹` verborgen bij de eerste optie, `›` verborgen bij de
 * laatste — exact de 3 Figma-standen. Bewust NIET via `scrollLeft`/
 * `scrollWidth` bepaald: de onzichtbare `spacer`-elementen hierboven maken
 * de rij ook aan de uiteinden nog "scrollbaar" (nodig voor de centrering),
 * waardoor scroll-gebaseerde detectie de chevron/fade ten onrechte liet
 * zien bij de eerste/laatste optie. Dit component wordt toch alleen via
 * tikken/synchronisatie aangestuurd (geen los sleepgedrag), dus index-
 * gebaseerd is hier zowel de fix als de correctere bron van waarheid.
 *
 * Fade-overlay: exact Figma's eigen gradient-stops (niet een simpele
 * lineaire 0%→100%-fade) — vlak bij de rand blijft de achtergrondkleur
 * VOLLEDIG dekkend (0-40% resp. 60-100%) zodat de chevron nooit over de
 * onderliggende afgekapte tekst heen "doorschijnt"; pas daarna vervaagt
 * het naar transparant richting de zichtbare inhoud.
 *
 * Knoppen raken elkaar zonder tussenruimte (0 gap, bevestigd via Figma's
 * exacte x-offsets) — de volgende/vorige knop is dus altijd half zichtbaar
 * aan de rand, wat al een niet-sleep-alternatief geeft naast de chevrons.
 *
 * `chevron-left-sm`/`chevron-right-sm` zijn de al bestaande iconbestanden
 * (exact dezelfde 6.06×10.71-vectorafmeting als Figma's "chevron right"-
 * component, hier voor links het aparte bestand i.p.v. een CSS-rotatie).
 */
export function SegmentedNavPill({ options, activeIndex, onSelect, className }: SegmentedNavPillProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const canScrollLeft = activeIndex > 0;
  const canScrollRight = activeIndex < options.length - 1;

  useEffect(() => {
    const row = rowRef.current;
    const button = buttonRefs.current[activeIndex];
    if (!row || !button) return;

    const isFirst = activeIndex === 0;
    const isLast = activeIndex === options.length - 1;
    let target: number;
    if (isFirst) {
      target = button.offsetLeft;
    } else if (isLast) {
      target = button.offsetLeft + button.offsetWidth - row.clientWidth;
    } else {
      target = button.offsetLeft + button.offsetWidth / 2 - row.clientWidth / 2;
    }
    row.scrollTo({ left: target, behavior: "smooth" });
  }, [activeIndex, options.length]);

  return (
    <div className={className ?? "relative flex w-full items-center rounded-full bg-[#f6f6f7] p-2"}>
      {canScrollLeft && (
        <>
          <div
            className="pointer-events-none absolute top-0 left-0 z-10 h-full w-20 rounded-l-full"
            style={{ background: "linear-gradient(to right, #f6f6f7 0%, #f6f6f7 40%, transparent 100%)" }}
          />
          <span className="absolute top-1/2 left-4 z-20 -translate-y-1/2">
            <Icon name="chevron-left-sm" size="sm" />
          </span>
        </>
      )}

      <div
        ref={rowRef}
        /**
         * `relative` is hier bewust nodig, niet cosmetisch: zonder eigen
         * positionering is déze rij NIET het `offsetParent` van zijn eigen
         * knoppen — dat werd dan de buitenste pil-div (ook `relative`),
         * waardoor `button.offsetLeft` de 8px `p-2`-padding van de pil
         * meetelde i.p.v. echt relatief aan de rij's eigen scrollinhoud te
         * zijn. Gaf een consistente ~8-9px afwijking in de centrerings-
         * berekening hierboven — geverifieerd via `offsetParent` direct.
         */
        className="relative flex h-[41px] min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Onzichtbare marge zodat een middelste knop ook echt kan centreren — zie doc-comment. */}
        <div aria-hidden="true" className="w-14 shrink-0" />
        {options.map((option, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={option.value}
              type="button"
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              onClick={() => onSelect(index)}
              className={[
                "flex shrink-0 items-center justify-center whitespace-nowrap rounded-full py-3 text-[14px] leading-[17px]",
                active ? "bg-black px-6 text-white" : "px-4 text-black underline",
              ].join(" ")}
              style={{ fontFamily: "var(--font-avenir)" }}
            >
              {option.title}
            </button>
          );
        })}
        <div aria-hidden="true" className="w-14 shrink-0" />
      </div>

      {canScrollRight && (
        <>
          <div
            className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 rounded-r-full"
            style={{ background: "linear-gradient(to left, #f6f6f7 0%, #f6f6f7 40%, transparent 100%)" }}
          />
          <span className="absolute top-1/2 right-4 z-20 -translate-y-1/2">
            <Icon name="chevron-right-sm" size="sm" />
          </span>
        </>
      )}
    </div>
  );
}
