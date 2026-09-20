"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ReceiptSection } from "@/components/Receipt";
import { formatEuro, getProductMeta, type WoonverzekeringenProductId } from "./products";

/**
 * Gedeelde state voor de Woonverzekeringen Multi Product Funnel — React
 * Context + sessionStorage-persistentie, zelfde opzet als
 * `app/mutatie/funnel-context.tsx` en `app/verzuim/funnel-context.tsx`.
 *
 * Uitgebreid t.o.v. de oorspronkelijke versie (die alleen `selectedProducts`
 * bijhield) met de twee stukken state die de rationale voor deze funnel
 * expliciet vereist:
 * - `sharedData`: gegevens die meerdere producten kunnen hergebruiken (bv.
 *   geboortedatum, adres, woninggegevens). Bevestigd via mcp dat Inboedel's
 *   "Je woning"-sectie letterlijk dezelfde velden vraagt als Opstal's
 *   "Gegevens"-sectie — die mogen dus maar één keer worden ingevuld, ongeacht
 *   welk product ze als eerste nodig heeft (rationale punt 11-13). Elk veld
 *   staat hier daarom maar één keer, niet gekopieerd per product.
 * - `products`: per geselecteerd product de premie en of het al is afgerond
 *   ("de gebruiker is verdergegaan", niet alleen "het formulier is vol") —
 *   nodig om het actieve product af te leiden (rationale punt 19: "het
 *   eerste geselecteerde product dat nog niet completed is") en om de
 *   kassabon op een ándere productpagina het al berekende bedrag van een
 *   eerder product te laten tonen — bevestigd via mcp: Inboedel's Receipt
 *   toont daar "Opstal € 17,69" naast de nog niet-berekende producten.
 *
 * De productspecifieke configuratie zelf (bv. Opstal's dekking/eigen risico/
 * Glas) hoort hier bewust niet in: geen ander product leest die waarden, dus
 * die blijft lokale state op de productpagina zelf (rationale punt 13: alleen
 * gedeelde gegevens horen op aanvraagniveau, productspecifieke keuzes blijven
 * aan het product gekoppeld).
 */

export type WoonverzekeringenSharedData = {
  /** yyyy-mm-dd — sessionStorage kent geen `Date`-type, zelfde aanpak als mutatie's `ingangsdatum` (zie `toIsoDatum`/`fromIsoDatum` hieronder). */
  geboortedatum: string;
  /**
   * Verplaatst van lokale per-productstate naar hier: Inboedel én
   * Aansprakelijkheid stellen letterlijk dezelfde vraag ("Hoe is je gezin
   * samengesteld?") — de eerdere aanname dat dit uniek per product was
   * ("geen ander product gebruikt dit") bleek onjuist zodra Aansprakelijkheid
   * gebouwd werd. Nu gedeeld, zodat de vraag nooit twee keer wordt gesteld
   * (rationale punt 11/12), consistent met alle andere gedeelde velden hier.
   */
  gezinssamenstelling: string;
  postcode: string;
  huisnummer: string;
  toevoeging: string;
  soortWoning: string;
  koopHuur: string;
  particulier: string;
  muren: string;
  dak: string;
  rietenDak: string;
};

export type WoonverzekeringenProductState = {
  /** `null` = nog geen premie bekend (product nog niet bereikt, of nog niet volledig samengesteld). */
  premium: number | null;
  /** `true` pas zodra de gebruiker het product heeft afgerond (op "verder met ..." heeft geklikt) — niet al zodra het formulier toevallig volledig is ingevuld. */
  isComplete: boolean;
};

export type WoonverzekeringenFunnelState = {
  /** Volgorde uit stap 1 is leidend voor de hele vervolgflow (rationale punt 1). */
  selectedProducts: WoonverzekeringenProductId[];
  sharedData: WoonverzekeringenSharedData;
  products: Partial<Record<WoonverzekeringenProductId, WoonverzekeringenProductState>>;
};

const DEFAULT_SHARED_DATA: WoonverzekeringenSharedData = {
  geboortedatum: "",
  gezinssamenstelling: "",
  postcode: "",
  huisnummer: "",
  toevoeging: "",
  soortWoning: "",
  koopHuur: "",
  particulier: "",
  muren: "",
  dak: "",
  rietenDak: "",
};

const DEFAULT_STATE: WoonverzekeringenFunnelState = {
  selectedProducts: [],
  sharedData: DEFAULT_SHARED_DATA,
  products: {},
};

const STORAGE_KEY = "woonverzekeringen-funnel";

type WoonverzekeringenFunnelContextValue = {
  state: WoonverzekeringenFunnelState;
  isHydrated: boolean;
  setState: (state: WoonverzekeringenFunnelState) => void;
};

const WoonverzekeringenFunnelContext = createContext<WoonverzekeringenFunnelContextValue | null>(null);

export function WoonverzekeringenFunnelProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<WoonverzekeringenFunnelState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setStateInternal(JSON.parse(raw) as WoonverzekeringenFunnelState);
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

  function setState(next: WoonverzekeringenFunnelState) {
    setStateInternal(next);
  }

  return (
    <WoonverzekeringenFunnelContext.Provider value={{ state, isHydrated, setState }}>
      {children}
    </WoonverzekeringenFunnelContext.Provider>
  );
}

export function useWoonverzekeringenFunnel() {
  const context = useContext(WoonverzekeringenFunnelContext);
  if (!context) throw new Error("useWoonverzekeringenFunnel moet binnen een WoonverzekeringenFunnelProvider gebruikt worden.");
  return context;
}

/**
 * Het actieve product = het eerste geselecteerde product (in de volgorde uit
 * stap 1) dat nog niet completed is — rationale punt 19, letterlijk zo
 * afgeleid i.p.v. apart opgeslagen, zodat er nooit twee velden uit de pas
 * kunnen lopen.
 */
export function getActiveProduct(state: WoonverzekeringenFunnelState): WoonverzekeringenProductId | null {
  return state.selectedProducts.find((id) => !state.products[id]?.isComplete) ?? null;
}

export type WoonverzekeringenProductStatus = "completed" | "active" | "upcoming" | "not-selected";

export function getProductStatus(state: WoonverzekeringenFunnelState, id: WoonverzekeringenProductId): WoonverzekeringenProductStatus {
  if (!state.selectedProducts.includes(id)) return "not-selected";
  if (state.products[id]?.isComplete) return "completed";
  return getActiveProduct(state) === id ? "active" : "upcoming";
}

/** Som van de premies van alle producten die al een bekend bedrag hebben — rationale punt 16 ("Je betaalt per maand" = som van de op dat moment beschikbare premies). */
export function getTotalPremium(state: WoonverzekeringenFunnelState): number {
  return Object.values(state.products).reduce((sum: number, product) => sum + (product?.premium ?? 0), 0);
}

/**
 * Bouwt de kassabon-sectie voor een ánder product dan de huidige pagina —
 * altijd read-only ("€ -,--" totdat dat product zijn eigen premie heeft
 * doorgezet, anders het al bekende bedrag). Gedeeld zodat elke productpagina
 * dezelfde weergave voor de "overige" producten gebruikt i.p.v. dit per
 * pagina te herhalen — bevestigd via mcp dat Inboedel's Receipt exact dit
 * doet voor Opstal ("Opstal € 17,69") en de nog niet-berekende producten.
 */
export function buildOtherProductReceiptSection(state: WoonverzekeringenFunnelState, id: WoonverzekeringenProductId): ReceiptSection {
  const meta = getProductMeta(id);
  const premium = state.products[id]?.premium ?? null;
  return {
    id,
    title: meta.shortTitle,
    amount: premium != null ? formatEuro(premium) : "€ -,--",
    icon: <img src={`/icons/${meta.icon}.svg`} alt="" className="size-8" />,
    ...(premium == null ? { groups: [{ items: [{ label: "Beantwoord de vragen om de premie te zien" }] }] } : {}),
  };
}

/** sessionStorage kent geen `Date`-type — zelfde aanpak als `app/mutatie/pricing.ts`'s `toIsoDatum`/`fromIsoDatum`, hier lokaal voor deze funnel i.p.v. een cross-funnel import. */
export function toIsoDatum(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function fromIsoDatum(iso: string): Date | null {
  if (!iso) return null;
  const [yyyy, mm, dd] = iso.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}
