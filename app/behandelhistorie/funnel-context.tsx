"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Situatie } from "./opties";

/**
 * Gedeelde state tussen de stappen van de "Chronische behandelhistorie
 * doorgeven"-funnel: alleen React Context, bewust zonder sessionStorage (zoals
 * de Royeren-funnel). Een refresh zet de funnel terug naar de lege beginstand;
 * tussen de stappen blijft alles behouden ("Terug" en "Wijzig").
 */

/** Stappen van de stappenindicator, gedeeld door alle schermen. */
export const BEHANDELHISTORIE_STEPS = ["Gegevens verzekerde", "Gegevens behandeling", "Controleren en verzenden"];

export const HEADER_TITLE = "Chronische behandelhistorie doorgeven";

export const ROUTES = {
  intro: "/behandelhistorie",
  verzekerde: "/behandelhistorie/verzekerde",
  behandeling: "/behandelhistorie/behandeling",
  controleren: "/behandelhistorie/controleren",
  gelukt: "/behandelhistorie/gelukt",
} as const;

export type BehandelhistorieState = {
  // Stap 1: Gegevens verzekerde
  verzekerdennummer: string;
  voorletters: string;
  tussenvoegsel: string;
  achternaam: string;
  /** yyyy-mm-dd (zie `toIsoDatum`/`fromIsoDatum` in lib/datum.ts), leeg tot de gebruiker kiest. */
  geboortedatum: string;
  /** Wat de gebruiker in het geboortedatumveld typte; onderscheidt 'niets ingevuld' van 'geen geldige datum'. */
  geboortedatumTekst: string;
  // Stap 2: Gegevens behandeling
  diagnosecode: string;
  ingangsdatum: string;
  /** Idem voor de ingangsdatum. */
  ingangsdatumTekst: string;
  situatie: Situatie | "";
  aantalBehandelingen: string;
  reden: string;
  toelichting: string;
  naamPraktijk: string;
  agbCode: string;
  emailPraktijk: string;
};

export const LEGE_STATE: BehandelhistorieState = {
  verzekerdennummer: "",
  voorletters: "",
  tussenvoegsel: "",
  achternaam: "",
  geboortedatum: "",
  geboortedatumTekst: "",
  diagnosecode: "",
  ingangsdatum: "",
  ingangsdatumTekst: "",
  situatie: "",
  aantalBehandelingen: "",
  reden: "",
  toelichting: "",
  naamPraktijk: "",
  agbCode: "",
  emailPraktijk: "",
};

type FunnelContextValue = {
  state: BehandelhistorieState;
  setState: (update: Partial<BehandelhistorieState>) => void;
  reset: () => void;
};

const BehandelhistorieFunnelContext = createContext<FunnelContextValue | null>(null);

export function BehandelhistorieFunnelProvider({ children }: { children: ReactNode }) {
  const [state, setFullState] = useState<BehandelhistorieState>(LEGE_STATE);

  return (
    <BehandelhistorieFunnelContext.Provider
      value={{
        state,
        setState: (update) => setFullState((current) => ({ ...current, ...update })),
        reset: () => setFullState(LEGE_STATE),
      }}
    >
      {children}
    </BehandelhistorieFunnelContext.Provider>
  );
}

export function useBehandelhistorieFunnel() {
  const context = useContext(BehandelhistorieFunnelContext);
  if (!context) throw new Error("useBehandelhistorieFunnel moet binnen een BehandelhistorieFunnelProvider gebruikt worden.");
  return context;
}
