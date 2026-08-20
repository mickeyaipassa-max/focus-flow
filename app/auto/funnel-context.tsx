"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { VehicleDetails } from "@/components/InputLicensePlate";

/**
 * Centrale state voor de Autoverzekering-funnel (Jouw situatie -> Jouw
 * dekking -> Jouw gegevens -> Laatste vragen -> Samenvatting), zelfde opzet
 * als `app/verzuim/funnel-context.tsx`: React Context + sessionStorage,
 * zodat toekomstige stappen dezelfde data lezen/schrijven en de funnel
 * herstelbaar is binnen de tabsessie (refresh, terugnavigeren) zonder na
 * het sluiten van de tab te blijven staan.
 */

export type SituatieStepData = {
  kenteken: string;
  vehicle: VehicleDetails | null;
  kmPerJaar: string;
  regelmatigeBestuurder: string;
  tweedeOfDerdeVerzekering: "ja" | "nee" | "";
  schadevrijeJaren: string;
  geboortedatum: Date | null;
  postcode: string;
  huisnummer: string;
  toevoeging: string;
};

type AutoFunnelState = {
  situatie: SituatieStepData | null;
};

const EMPTY_STATE: AutoFunnelState = { situatie: null };
const STORAGE_KEY = "auto-funnel-state";

type AutoFunnelContextValue = {
  state: AutoFunnelState;
  isHydrated: boolean;
  setSituatieStep: (data: SituatieStepData) => void;
};

const AutoFunnelContext = createContext<AutoFunnelContextValue | null>(null);

export function AutoFunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AutoFunnelState>(EMPTY_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AutoFunnelState & { situatie: (SituatieStepData & { geboortedatum: string | null }) | null };
        setState({
          situatie: parsed.situatie
            ? { ...parsed.situatie, geboortedatum: parsed.situatie.geboortedatum ? new Date(parsed.situatie.geboortedatum) : null }
            : null,
        });
      } catch {
        // Corrupte/oude sessionStorage-inhoud: negeren, met lege state verder.
      }
    }
    setIsHydrated(true);
  }, []);

  function persist(next: AutoFunnelState) {
    setState(next);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function setSituatieStep(data: SituatieStepData) {
    persist({ ...state, situatie: data });
  }

  return <AutoFunnelContext.Provider value={{ state, isHydrated, setSituatieStep }}>{children}</AutoFunnelContext.Provider>;
}

export function useAutoFunnel() {
  const ctx = useContext(AutoFunnelContext);
  if (!ctx) throw new Error("useAutoFunnel moet binnen AutoFunnelProvider gebruikt worden.");
  return ctx;
}
