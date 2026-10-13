"use client";

import { useEffect, useRef, useState } from "react";
import { CardProduct, type CardProductFeature } from "@/components/CardProduct";

type Dekking = {
  title: string;
  subtitle: string;
  features: CardProductFeature[];
};

/**
 * Teksten letterlijk uit Figma (Autoverzekering, node 8979:9348). De ondertitel
 * van de eerste kaart zegt "bij auto's", die van de andere twee "voor auto's" —
 * zo staat het in het ontwerp en is dus ook zo overgenomen.
 */
const DEKKINGEN: Dekking[] = [
  {
    title: "WA",
    subtitle: "Meest gekozen bij auto's van 10 jaar en ouder",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: false },
      { text: "Ruitschade", included: false },
      { text: "Diefstal", included: false },
      { text: "Standaard 1 jaar nieuwwaarde", included: false },
      { text: "Schade aan je eigen auto", included: false },
    ],
  },
  {
    title: "WA + Casco beperkt",
    subtitle: "Meest gekozen voor auto's van 10 jaar en ouder",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Diefstal", included: true },
      { text: "Standaard 1 jaar nieuwwaarde", included: true },
      { text: "Schade aan je eigen auto", included: false },
    ],
  },
  {
    title: "WA + Casco allrisk",
    subtitle: "Meest gekozen voor auto's van 10 jaar en ouder",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Diefstal", included: true },
      { text: "Standaard 1 jaar nieuwwaarde", included: true },
      { text: "Schade aan je eigen auto", included: true },
    ],
  },
];

/**
 * Horizontale carrousel met de drie dekkingskaarten (Figma: kaarten van 320px
 * met 8px ertussen, 24px marge links) en de bolletjes eronder (actieve bol is
 * een pil van 32×12, de andere twee cirkels van 12px in #ccc, 8px ertussen).
 *
 * Native scroll-snap i.p.v. een carrousel-bibliotheek: swipen werkt gratis, en
 * de bolletjes volgen de scrollpositie. Een tik op een bolletje scrollt naar
 * die kaart.
 *
 * Uitlijning per kaart: de eerste staat 24px vanaf links (scrollpositie 0),
 * een kaart daartussen staat gecentreerd, en de laatste staat 24px vanaf
 * rechts (uiterste scrollpositie, met 24px padding rechts). Dat geven
 * `snap-start`, `snap-center` en `snap-end` met 24px `scroll-padding`.
 */
export function DekkingCarousel({ onBerekenen }: { onBerekenen: () => void }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  /** Scrollpositie waarop kaart `index` goed staat: eerste links, laatste rechts, de rest gecentreerd. */
  function scrollTargetFor(track: HTMLUListElement, index: number): number {
    const items = Array.from(track.children) as HTMLElement[];
    if (index <= 0) return 0;
    if (index >= items.length - 1) return track.scrollWidth - track.clientWidth;
    const item = items[index];
    return item.offsetLeft + item.offsetWidth / 2 - track.clientWidth / 2;
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onScroll() {
      if (!track) return;
      // De kaart waarvan de "goede" scrollpositie het dichtst bij de huidige ligt.
      let best = 0;
      let bestDistance = Infinity;
      for (let index = 0; index < track.children.length; index++) {
        const distance = Math.abs(scrollTargetFor(track, index) - track.scrollLeft);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      }
      setActive(best);
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: scrollTargetFor(track, index), behavior: "smooth" });
  }

  return (
    <div className="flex w-full flex-col items-center gap-6" role="group" aria-roledescription="carrousel" aria-label="Dekkingen">
      <ul
        ref={trackRef}
        className="relative flex w-full snap-x snap-mandatory scroll-px-6 gap-2 overflow-x-auto px-6 pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {DEKKINGEN.map((dekking, index) => (
          <li
            key={dekking.title}
            className={[
              "w-[320px] shrink-0",
              index === 0 ? "snap-start" : index === DEKKINGEN.length - 1 ? "snap-end" : "snap-center",
            ].join(" ")}
            aria-roledescription="dia"
            aria-label={`${index + 1} van ${DEKKINGEN.length}: ${dekking.title}`}
          >
            <CardProduct
              title={dekking.title}
              subtitle={dekking.subtitle}
              features={dekking.features}
              primaryLabel="Bereken je premie"
              secondaryLabel="Meer informatie"
              onPrimaryClick={onBerekenen}
              className="flex w-full flex-col overflow-clip rounded-md border border-[rgba(0,0,0,0.12)] bg-white"
            />
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        {DEKKINGEN.map((dekking, index) => (
          <button
            key={dekking.title}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Ga naar ${dekking.title}`}
            aria-current={active === index ? "true" : undefined}
            className="relative flex items-center before:absolute before:-inset-2 before:content-['']"
          >
            <span
              className={[
                "block h-3 rounded-full motion-safe:transition-all motion-safe:duration-200",
                active === index ? "w-8 bg-black" : "w-3 bg-[#ccc]",
              ].join(" ")}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
