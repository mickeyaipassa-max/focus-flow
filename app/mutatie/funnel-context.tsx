"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CURRENT_DEKKING, type DekkingKeuze } from "./pricing";

/**
 * Gedeelde state tussen de mutatie-funnel-stappen ("Jouw dekking" →
 * "Bevestiging"), zelfde opzet als `app/verzuim/funnel-context.tsx`:
 * React Context + sessionStorage-persistentie (herstelbaar binnen de tab,
 * niet blijvend na sluiten). Nodig omdat de bevestigingsstap letterlijk de
 * keuzes van stap 1 moet tonen ("Het startpunt is altijd jouw dekking. Neem
 * de wijzigingen die gedaan zijn op jouw dekking mee.") — niet twee losse
 * lokale useState's die bij navigatie verloren zouden gaan.
 */

export type MutatieFunnelState = {
  dekking: DekkingKeuze;
  eigenRisico: string;
  aanvullendeDekkingen: string[];
  /** yyyy-mm-dd (zie `toIsoDatum`/`fromIsoDatum` in pricing.ts) — sessionStorage kent geen `Date`-type. Leeg tot de klant zelf een datum kiest — op verzoek geen vooringevulde waarde. */
  ingangsdatum: string;
};

const DEFAULT_STATE: MutatieFunnelState = {
  dekking: CURRENT_DEKKING,
  eigenRisico: "100",
  aanvullendeDekkingen: [],
  ingangsdatum: "",
};

const STORAGE_KEY = "mutatie-dekking-funnel";

type MutatieFunnelContextValue = {
  state: MutatieFunnelState;
  isHydrated: boolean;
  setState: (state: MutatieFunnelState) => void;
};

const MutatieFunnelContext = createContext<MutatieFunnelContextValue | null>(null);

export function MutatieFunnelProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<MutatieFunnelState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setStateInternal(JSON.parse(raw) as MutatieFunnelState);
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

  function setState(next: MutatieFunnelState) {
    setStateInternal(next);
  }

  return (
    <MutatieFunnelContext.Provider value={{ state, isHydrated, setState }}>{children}</MutatieFunnelContext.Provider>
  );
}

export function useMutatieFunnel() {
  const context = useContext(MutatieFunnelContext);
  if (!context) throw new Error("useMutatieFunnel moet binnen een MutatieFunnelProvider gebruikt worden.");
  return context;
}
