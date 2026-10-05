"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Gedeelde state tussen de stappen van de "Royeren"-funnel ("Je opzegging" →
 * "Bevestigen"), zelfde opzet als `app/mutatie/funnel-context.tsx`: React
 * Context + sessionStorage voor wat serialiseerbaar is. De gekozen bestanden
 * (`File`-objecten) kunnen niet in sessionStorage en blijven daarom alleen in
 * het geheugen: ze overleven navigatie tussen de stappen ("Wijzig" op de
 * bevestigingsstap), maar niet een refresh van de pagina.
 */

/** Stappen van de stappenindicator, gedeeld door alle schermen van de funnel. */
export const ROYEREN_STEPS = ["Je opzegging", "Bevestigen"];

export type RoyerenFunnelState = {
  /** Waarde van de gekozen opzegreden (zie `REDENEN`), leeg tot de klant kiest. */
  reden: string;
  /** yyyy-mm-dd (zie `toIsoDatum`/`fromIsoDatum` in lib/datum.ts) — sessionStorage kent geen `Date`. Leeg tot de klant zelf een datum kiest. */
  ingangsdatum: string;
};

const DEFAULT_STATE: RoyerenFunnelState = { reden: "", ingangsdatum: "" };

const STORAGE_KEY = "royeren-funnel";

type RoyerenFunnelContextValue = {
  state: RoyerenFunnelState;
  isHydrated: boolean;
  setState: (state: RoyerenFunnelState) => void;
  /** Alleen in het geheugen (niet in sessionStorage). */
  bestanden: File[];
  setBestanden: (bestanden: File[]) => void;
};

const RoyerenFunnelContext = createContext<RoyerenFunnelContextValue | null>(null);

export function RoyerenFunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RoyerenFunnelState>(DEFAULT_STATE);
  const [bestanden, setBestanden] = useState<File[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as RoyerenFunnelState);
    } catch {
      // Corrupte of ontoegankelijke sessionStorage — start gewoon leeg, geen harde fout.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // voorkom dat de initiële default-state de zojuist herstelde data overschrijft
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage niet beschikbaar — funnel blijft functioneel binnen de huidige sessie, alleen zonder refresh-herstel.
    }
  }, [state, isHydrated]);

  return (
    <RoyerenFunnelContext.Provider value={{ state, isHydrated, setState, bestanden, setBestanden }}>
      {children}
    </RoyerenFunnelContext.Provider>
  );
}

export function useRoyerenFunnel() {
  const context = useContext(RoyerenFunnelContext);
  if (!context) throw new Error("useRoyerenFunnel moet binnen een RoyerenFunnelProvider gebruikt worden.");
  return context;
}
