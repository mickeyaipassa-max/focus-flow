"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type KaartCarouselProps = {
  /** Naam van de carrousel voor schermlezers, bv. "Zorgverzekeringen". */
  label: string;
  items: { key: string; label: string; content: ReactNode }[];
};

/**
 * Horizontale carrousel met kaarten van 320px (Figma: 8px ertussen, 24px marge links) en de bolletjes eronder (16px onder de kaarten; actieve bol is een
 * pil van 32×12, de andere cirkels van 12px in #ccc, 8px ertussen). Zelfde opzet als app/automobiel/DekkingCarousel: native
 * scroll-snap, de bolletjes volgen de scrollpositie en een tik op een bolletje scrollt naar die kaart. De eerste kaart staat links,
 * de laatste rechts en de rest gecentreerd.
 */
export function KaartCarousel({ label, items }: KaartCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  function scrollTargetFor(track: HTMLUListElement, index: number): number {
    const kinderen = Array.from(track.children) as HTMLElement[];
    if (index <= 0) return 0;
    if (index >= kinderen.length - 1) return track.scrollWidth - track.clientWidth;
    const kaart = kinderen[index];
    return kaart.offsetLeft + kaart.offsetWidth / 2 - track.clientWidth / 2;
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onScroll() {
      if (!track) return;
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
    if (track) track.scrollTo({ left: scrollTargetFor(track, index), behavior: "smooth" });
  }

  return (
    <div className="flex w-full flex-col items-center gap-[15px]" role="group" aria-roledescription="carrousel" aria-label={label}>
      <ul ref={trackRef} className="relative flex w-full snap-x snap-mandatory scroll-px-6 gap-2 overflow-x-auto px-6 pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <li
            key={item.key}
            className={["flex w-[320px] shrink-0", index === 0 ? "snap-start" : index === items.length - 1 ? "snap-end" : "snap-center"].join(" ")}
            aria-roledescription="dia"
            aria-label={`${index + 1} van ${items.length}: ${item.label}`}
          >
            {item.content}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.key}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Ga naar ${item.label}`}
            aria-current={active === index ? "true" : undefined}
            className="relative flex items-center before:absolute before:-inset-2 before:content-['']"
          >
            <span className={["block h-3 rounded-full motion-safe:transition-all motion-safe:duration-200", active === index ? "w-8 bg-black" : "w-3 bg-[#ccc]"].join(" ")} />
          </button>
        ))}
      </div>
    </div>
  );
}
