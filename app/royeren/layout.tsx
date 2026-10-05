import type { ReactNode } from "react";
import { RoyerenFunnelProvider } from "./funnel-context";

/** Omvat alle routes onder `/royeren/*` met de gedeelde funnelstate — zelfde precedent als `app/mutatie/layout.tsx`. */
export default function RoyerenLayout({ children }: { children: ReactNode }) {
  return <RoyerenFunnelProvider>{children}</RoyerenFunnelProvider>;
}
