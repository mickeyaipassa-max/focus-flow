"use client";

import { useEffect, useRef } from "react";

const SCALE = 1.15;
/** Totaal 1,4s: 0,7s groeien en 0,7s terug, beide met ease-in-out. */
const DURATION_MS = 1400;

/**
 * De Opiness-badge ("best beoordeeld 2026") met een eenmalige puls: zodra de
 * badge de lijn op 25% vanaf de onderkant van het scherm bereikt, groeit hij
 * heel soepel naar 1,15× en wordt daarna weer zijn oorspronkelijke formaat,
 * om even op te vallen.
 *
 * Alleen `transform: scale()` vanuit het midden, dus er verschuift niets op
 * de pagina (de badge heeft 10px ruimte rondom). Eén keer per paginabezoek.
 * Bij `prefers-reduced-motion` gebeurt er niets.
 *
 * `rootMargin: "0px 0px -25% 0px"` schuift de onderrand van het meetgebied
 * 25% omhoog; de badge telt als "in beeld" zodra zijn bovenkant daarboven komt.
 */
export function OpinessBadge() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const badge = ref.current;
    if (!badge) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        badge.animate(
          [
            { transform: "scale(1)", easing: "ease-in-out" },
            { transform: `scale(${SCALE})`, easing: "ease-in-out" },
            { transform: "scale(1)" },
          ],
          { duration: DURATION_MS, easing: "linear" },
        );
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    observer.observe(badge);
    return () => observer.disconnect();
  }, []);

  return <img ref={ref} src="/automobiel/opiness-2026.png" alt="Opiness 2026: best beoordeeld, autoverzekeraars" className="size-[98px]" />;
}
