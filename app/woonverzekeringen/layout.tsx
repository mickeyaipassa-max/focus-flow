import type { ReactNode } from "react";
import { WoonverzekeringenFunnelProvider } from "./funnel-context";

/** Omvat alle routes onder `/woonverzekeringen/*` met de gedeelde funnelstate — zelfde precedent als `app/mutatie/layout.tsx`. */
export default function WoonverzekeringenLayout({ children }: { children: ReactNode }) {
  return <WoonverzekeringenFunnelProvider>{children}</WoonverzekeringenFunnelProvider>;
}
