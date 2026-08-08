"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { FieldsetCompanyAddressValue } from "@/components/FieldsetCompanyAddress";
import type { EmployeeValue } from "@/components/FieldsetEmployee";

/**
 * Centrale state voor de "Jouw bedrijf"-funnel (1/3 → 2/3 → 3/3), gedeeld
 * via `app/verzuim/layout.tsx` zodat elke sub-stap dezelfde data leest en
 * schrijft i.p.v. losse, lokale state per scherm die bij navigatie verloren
 * zou gaan. Er bestond geen centrale funnelstate-oplossing in dit project
 * (elke stap had tot nu toe puur lokale `useState`) — dit is de eerste,
 * en bewust met React's ingebouwde Context-API i.p.v. een nieuwe
 * state-management-library.
 *
 * Persistentie via `sessionStorage` (niet `localStorage`): een funnel hoort
 * binnen dezelfde tabsessie herstelbaar te zijn (refresh, per ongeluk terug
 * naar Intro navigeren, een eerder bezochte stap-URL rechtstreeks openen),
 * maar niet permanent op het apparaat te blijven staan nadat de tab sluit.
 */

export type CompanyResult = {
  id: string;
  name: string;
  postalCode: string;
  address: string;
  city: string;
  kvkNumber: string;
  establishmentNumber: string;
  label: string;
};

export type CompanyStepData = {
  address: FieldsetCompanyAddressValue;
  selectedCompany: CompanyResult;
};

export type EmployeesStepData = {
  countInput: string;
  employees: EmployeeValue[];
};

export type ExtraInfoStepData = {
  duration: string;
  percentages: string[];
};

type VerzuimFunnelState = {
  company: CompanyStepData | null;
  employees: EmployeesStepData | null;
  extraInfo: ExtraInfoStepData | null;
};

const EMPTY_STATE: VerzuimFunnelState = { company: null, employees: null, extraInfo: null };

const STORAGE_KEY = "verzuim-jouw-bedrijf-funnel";

type VerzuimFunnelContextValue = {
  state: VerzuimFunnelState;
  /** Wordt pas `true` nadat is geprobeerd eerdere state uit sessionStorage te herstellen — voorkomt dat stappen te vroeg concluderen "geen data" en onterecht terugsturen. */
  isHydrated: boolean;
  setCompanyStep: (data: CompanyStepData) => void;
  setEmployeesStep: (data: EmployeesStepData) => void;
  setExtraInfoStep: (data: ExtraInfoStepData) => void;
  resetFunnel: () => void;
};

const VerzuimFunnelContext = createContext<VerzuimFunnelContextValue | null>(null);

export function VerzuimFunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VerzuimFunnelState>(EMPTY_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as VerzuimFunnelState);
    } catch {
      // Corrupte of ontoegankelijke sessionStorage (bv. privénavigatie-quota) — start gewoon leeg, geen harde fout.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // voorkom dat de initiële lege state de zojuist herstelde data overschrijft
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage niet beschikbaar — funnel blijft functioneel binnen de huidige sessie, alleen zonder refresh-herstel.
    }
  }, [state, isHydrated]);

  function setCompanyStep(data: CompanyStepData) {
    setState((current) => ({ ...current, company: data }));
  }
  function setEmployeesStep(data: EmployeesStepData) {
    setState((current) => ({ ...current, employees: data }));
  }
  function setExtraInfoStep(data: ExtraInfoStepData) {
    setState((current) => ({ ...current, extraInfo: data }));
  }
  function resetFunnel() {
    setState(EMPTY_STATE);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // negeren — state is in elk geval al in-memory gereset
    }
  }

  return (
    <VerzuimFunnelContext.Provider value={{ state, isHydrated, setCompanyStep, setEmployeesStep, setExtraInfoStep, resetFunnel }}>
      {children}
    </VerzuimFunnelContext.Provider>
  );
}

export function useVerzuimFunnel() {
  const context = useContext(VerzuimFunnelContext);
  if (!context) throw new Error("useVerzuimFunnel moet binnen een VerzuimFunnelProvider gebruikt worden.");
  return context;
}
