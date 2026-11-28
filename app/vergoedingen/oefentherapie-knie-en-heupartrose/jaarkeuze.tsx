"use client";

import { useState } from "react";
import { Toggle } from "@/components/Toggle";

const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;
const AVENIR_BOLD = { fontFamily: "var(--font-avenir-bold)" } as const;

/**
 * Figma "Jaarkeuze (maatwerk)": gele (#fff8e3) kaart met een toggle tussen 2026 en 2027 (Figma toont 2027, dus aan).
 * Figma heeft geen aparte inhoud per jaar ontworpen, dus de keuze past alleen de regel eronder aan.
 */
export function Jaarkeuze() {
  const [volgendJaar, setVolgendJaar] = useState(true);
  const jaar = volgendJaar ? 2027 : 2026;

  return (
    <div className="flex w-full flex-col items-start gap-2 bg-[#fff8e3] px-4 pt-4 pb-1 min-[900px]:w-fit">
      <p className="text-black text-lg leading-[1.5]" style={AVENIR_BOLD}>
        Kies het jaar van de vergoeding
      </p>
      <div className="flex items-center gap-3">
        <span className="text-black text-lg leading-[1.5]" style={AVENIR_BOLD}>
          2026
        </span>
        <Toggle checked={volgendJaar} onChange={setVolgendJaar} aria-label="Kies het jaar: uit is 2026, aan is 2027" />
        <span className="text-black text-lg leading-[1.5]" style={AVENIR_BOLD}>
          2027
        </span>
      </div>
      <p className="text-[#2a292e] text-sm leading-[1.5]" style={AVENIR} aria-live="polite">
        Je bekijkt de vergoeding voor {jaar}
      </p>
    </div>
  );
}
