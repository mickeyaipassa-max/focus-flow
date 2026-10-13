"use client";

import type { FormEvent } from "react";
import { KentekenVeld } from "./KentekenVeld";

type StickyKentekenBarProps = {
  /** Zichtbaar zodra de productkaarten voorbij zijn gescrold. */
  visible: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

/** Hoogte van de balk (Figma: 99px, hier 16px hoger gezet zodat hij onderaan niet wegvalt). De pagina houdt onderaan zoveel ruimte vrij, zodat de footer niet bedekt wordt. */
export const STICKY_BAR_HEIGHT = 115;

const DURATION_MS = 300;
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * Sticky CTA met kentekenveld, uit Figma "Autoverzekering" (Frame 4, node
 * 11:1454, bestand aGZg6VV6…): witte balk van volle breedte met 16px
 * padding (32px onderaan, ruimte voor de streep van de iPhone; +16px extra
 * zodat de inhoud op een echte telefoon niet tegen de onderrand van het scherm of de
 * browserbalk aan zit), radius 6,
 * schaduw 0/8/24 zwart 16%, daarin het kentekenveld en een gele knop
 * "Berekenen" (110×51, 16px).
 *
 * De balk staat vast onderaan het scherm en schuift met een ease-in-out van
 * 300ms omhoog (en weer weg). Figma legt de animatie zelf niet vast; dit
 * volgt de opdracht. Zolang hij verborgen is, staat hij buiten beeld,
 * `inert` en `visibility: hidden`, zodat toetsenbord en schermlezer er niet
 * in blijven hangen. Bij `prefers-reduced-motion` verschijnt hij zonder
 * beweging.
 *
 * `z-40`: onder het mobiele menu van SiteHeader (`z-50`).
 */
export function StickyKentekenBar({ visible, value, onChange, onSubmit }: StickyKentekenBarProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Premie berekenen met je kenteken"
      inert={!visible}
      className="fixed inset-x-0 bottom-0 z-40 flex items-start gap-2 rounded-md bg-white px-4 pt-4 pb-[calc(max(32px,env(safe-area-inset-bottom))+16px)] shadow-[0_8px_24px_rgba(0,0,0,0.16)] motion-reduce:!transition-none"
      style={{
        transform: visible ? "translateY(0)" : "translateY(calc(100% + 32px))",
        visibility: visible ? "visible" : "hidden",
        // Zichtbaar: meteen `visible` en dan schuiven. Verborgen: eerst wegschuiven, daarna pas `hidden`.
        transition: visible
          ? `transform ${DURATION_MS}ms ${EASING}, visibility 0s`
          : `transform ${DURATION_MS}ms ${EASING}, visibility 0s linear ${DURATION_MS}ms`,
      }}
    >
      <KentekenVeld id="kenteken-sticky" value={value} onChange={onChange} className="min-w-0 flex-1" />
      <button
        type="submit"
        className="flex h-[51px] w-[110px] shrink-0 items-center justify-center rounded-[3px] border-[rgba(0,0,0,0.08)] border-b-2 bg-[#eda50f] px-4 font-[550] text-base text-black leading-[1.5] hover:bg-[#f0b335]"
        style={{ fontFamily: "var(--font-avenir-medium)" }}
      >
        Berekenen
      </button>
    </form>
  );
}
