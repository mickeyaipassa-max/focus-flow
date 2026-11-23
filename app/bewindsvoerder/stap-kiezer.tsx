"use client";

import { usePathname, useRouter } from "next/navigation";
import { BEWIND_STEPS, ROUTES, useBewindFunnel } from "./funnel-context";

/** Alle schermen van de funnel in volgorde: de vier stappen en de succespagina. */
const SCHERMEN = [
  ...BEWIND_STEPS.map((naam, index) => ({ naam: `${index + 1}. ${naam}`, href: Object.values(ROUTES)[index] })),
  { naam: `${BEWIND_STEPS.length + 1}. Gelukt`, href: ROUTES.gelukt },
];

/**
 * Testhulp: dropdown rechtsboven (boven alles, z-index 1000) waarmee je direct naar een stap van de funnel springt,
 * zonder alles in te vullen. Er worden bij een sprong geen validaties afgevuurd; die volgen alleen via de
 * knoppen van de funnelnavigatie. Alleen zichtbaar op de funnelschermen, niet op de hubpagina.
 */
export function StapKiezer() {
  const router = useRouter();
  const pathname = usePathname();
  const { setState } = useBewindFunnel();
  const huidig = SCHERMEN.find((scherm) => scherm.href === pathname);
  if (!huidig) return null;

  return (
    <div className="fixed top-3 right-3 z-[1000] flex items-center gap-2 rounded-[3px] border border-[#767676] bg-white px-2 py-1 shadow-md">
      <label htmlFor="stap-kiezer" className="text-black text-sm" style={{ fontFamily: "var(--font-avenir-medium)" }}>
        Ga naar stap
      </label>
      <select
        id="stap-kiezer"
        value={huidig.href}
        onChange={(event) => {
          setState({ viaStapkiezer: true });
          router.push(event.target.value);
        }}
        className="rounded-[3px] border border-[#767676] bg-white px-2 py-1 text-black text-sm"
        style={{ fontFamily: "var(--font-avenir-book)" }}
      >
        {SCHERMEN.map((scherm) => (
          <option key={scherm.href} value={scherm.href}>
            {scherm.naam}
          </option>
        ))}
      </select>
    </div>
  );
}
