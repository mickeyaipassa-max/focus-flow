"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Gedeelde state tussen de stappen van de "Royeren"-funnel ("Je opzegging" →
 * "Bevestigen"): alleen React Context, bewust zonder sessionStorage. Een
 * refresh van de pagina of "Annuleren" zet de funnel dus altijd terug naar de
 * beginstand (leeg formulier op `/royeren`). Tussen de stappen blijft de state
 * behouden ("Wijzig" op de bevestigingsstap), ook de gekozen bestanden.
 */

/** Stappen van de stappenindicator, gedeeld door alle schermen van de funnel. */
export const ROYEREN_STEPS = ["Je opzegging", "Bevestigen"];

export type RoyerenFunnelState = {
  /** Waarde van de gekozen opzegreden (zie `REDENEN`), leeg tot de klant kiest. */
  reden: string;
  /** yyyy-mm-dd (zie `toIsoDatum`/`fromIsoDatum` in lib/datum.ts). Leeg tot de klant zelf een datum kiest. */
  ingangsdatum: string;
};

const DEFAULT_STATE: RoyerenFunnelState = { reden: "", ingangsdatum: "" };

type RoyerenFunnelContextValue = {
  state: RoyerenFunnelState;
  setState: (state: RoyerenFunnelState) => void;
  /** Zet reden, datum en bestanden terug naar de beginstand (gebruikt door "Annuleren"). */
  reset: () => void;
    bestanden: File[];
  setBestanden: (bestanden: File[]) => void;
};

const RoyerenFunnelContext = createContext<RoyerenFunnelContextValue | null>(null);

export function RoyerenFunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RoyerenFunnelState>(DEFAULT_STATE);
  const [bestanden, setBestanden] = useState<File[]>([]);

  function reset() {
    setState(DEFAULT_STATE);
    setBestanden([]);
  }

  return (
    <RoyerenFunnelContext.Provider value={{ state, setState, reset, bestanden, setBestanden }}>
      {children}
    </RoyerenFunnelContext.Provider>
  );
}

export function useRoyerenFunnel() {
  const context = useContext(RoyerenFunnelContext);
  if (!context) throw new Error("useRoyerenFunnel moet binnen een RoyerenFunnelProvider gebruikt worden.");
  return context;
}
