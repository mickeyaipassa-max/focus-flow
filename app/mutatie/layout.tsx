import type { ReactNode } from "react";
import { MutatieFunnelProvider } from "./funnel-context";

/** Omvat alle routes onder `/mutatie/*` met de gedeelde funnelstate — zelfde precedent als `app/verzuim/layout.tsx`. */
export default function MutatieLayout({ children }: { children: ReactNode }) {
  return <MutatieFunnelProvider>{children}</MutatieFunnelProvider>;
}
