"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Gedeelde state tussen de woonverzekeringen-funnel-stappen ("Productkeuze"
 * → "Jouw situatie" → ...), zelfde opzet als `app/mutatie/funnel-context.tsx`
 * en `app/verzuim/funnel-context.tsx`: React Context + sessionStorage-
 * persistentie. Nodig omdat latere stappen (bv. "Jouw dekking") moeten weten
 * welke producten in stap 1 zijn aangevinkt.
 */

export type WoonverzekeringenFunnelState = {
  /** Welke producten aan staan — slugs ("opstal", "inboedel", "aansprakelijkheid"), zelfde aanpak als mutatie's `aanvullendeDekkingen`. */
  selectedProducts: string[];
};

const DEFAULT_STATE: WoonverzekeringenFunnelState = {
  selectedProducts: [],
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
