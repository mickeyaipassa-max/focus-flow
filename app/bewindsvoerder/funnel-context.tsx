"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Gedeelde state tussen de stappen van het bewindvoerdersformulier: alleen React Context, bewust zonder
 * sessionStorage (zoals de behandelhistorie-funnel). Een refresh zet het formulier terug naar de lege
 * beginstand; tussen de stappen blijft alles behouden ("Terug" en "Wijzig"). Uploads blijven als `File`
 * in het geheugen en worden nergens heen gestuurd.
 */

/** Stappen van de stappenindicator (Figma "Bewindvoerdersformulier", section "bewindsvoerderformulier"). */
export const BEWIND_STEPS = ["Bewindvoerder", "Bewindgegevens", "Klant", "Samenvatting"];

export const ROUTES = {
  bewindvoerder: "/bewindsvoerder",
  bewindgegevens: "/bewindsvoerder/bewindgegevens",
  klant: "/bewindsvoerder/klant",
  samenvatting: "/bewindsvoerder/samenvatting",
} as const;

export type SoortBewindvoerder = "particulier" | "zakelijk";
export type Betaalvoorkeur = "incasso" | "email";
export type JaNee = "ja" | "nee" | "";

export type BewindState = {
  // Stap 1: Bewindvoerder
  soort: SoortBewindvoerder;
  voornamen: string;
  tussenvoegsel: string;
  achternaam: string;
  /** yyyy-mm-dd (zie lib/datum.ts), leeg tot er een geldige datum is. */
  geboortedatum: string;
  /** Wat er in het datumveld getypt is; onderscheidt "niets ingevuld" van "ongeldige datum". */
  geboortedatumTekst: string;
  statutaireNaam: string;
  kvkNummer: string;
  email: string;
  telefoon: string;
  postbus: boolean;
  postcode: string;
  huisnummer: string;
  toevoeging: string;
  postbusnummer: string;
  plaats: string;
  /** Opgehaald via de adres-lookup of handmatig ingevoerd (zie `./adres.tsx`). */
  straat: string;
  woonplaats: string;
  handmatig: boolean;
  adresGevonden: boolean;
  // Stap 2: Bewindgegevens
  zaaknummer: string;
  startdatum: string;
  startdatumTekst: string;
  einddatum: string;
  einddatumTekst: string;
  beschikking: File[];
  identiteitsbewijs: File[];
  betaalvoorkeur: Betaalvoorkeur;
  emailBetaalmail: string;
  iban: string;
  kenmerk: string;
  // Stap 3: Klant
  klantVoornamen: string;
  klantTussenvoegsel: string;
  klantAchternaam: string;
  klantGeboortedatum: string;
  klantGeboortedatumTekst: string;
  klantPostcode: string;
  klantHuisnummer: string;
  klantToevoeging: string;
  klantStraat: string;
  klantWoonplaats: string;
  klantHandmatig: boolean;
  klantAdresGevonden: boolean;
  betalingsachterstand: JaNee;
  polisblad: JaNee;
};

/** Particulier en Automatische incasso staan in Figma voorgeselecteerd. */
export const LEGE_STATE: BewindState = {
  soort: "particulier",
  voornamen: "",
  tussenvoegsel: "",
  achternaam: "",
  geboortedatum: "",
  geboortedatumTekst: "",
  statutaireNaam: "",
  kvkNummer: "",
  email: "",
  telefoon: "",
  postbus: false,
  postcode: "",
  huisnummer: "",
  toevoeging: "",
  postbusnummer: "",
  plaats: "",
  straat: "",
  woonplaats: "",
  handmatig: false,
  adresGevonden: false,
  zaaknummer: "",
  startdatum: "",
  startdatumTekst: "",
  einddatum: "",
  einddatumTekst: "",
  beschikking: [],
  identiteitsbewijs: [],
  betaalvoorkeur: "incasso",
  emailBetaalmail: "",
  iban: "",
  kenmerk: "",
  klantVoornamen: "",
  klantTussenvoegsel: "",
  klantAchternaam: "",
  klantGeboortedatum: "",
  klantGeboortedatumTekst: "",
  klantPostcode: "",
  klantHuisnummer: "",
  klantToevoeging: "",
  klantStraat: "",
  klantWoonplaats: "",
  klantHandmatig: false,
  klantAdresGevonden: false,
  betalingsachterstand: "",
  polisblad: "",
};

type FunnelContextValue = {
  state: BewindState;
  setState: (update: Partial<BewindState>) => void;
};

const BewindFunnelContext = createContext<FunnelContextValue | null>(null);

export function BewindFunnelProvider({ children }: { children: ReactNode }) {
  const [state, setFullState] = useState<BewindState>(LEGE_STATE);

  return (
    <BewindFunnelContext.Provider
      value={{ state, setState: (update) => setFullState((current) => ({ ...current, ...update })) }}
    >
      {children}
    </BewindFunnelContext.Provider>
  );
}

export function useBewindFunnel() {
  const context = useContext(BewindFunnelContext);
  if (!context) throw new Error("useBewindFunnel moet binnen een BewindFunnelProvider gebruikt worden.");
  return context;
}
