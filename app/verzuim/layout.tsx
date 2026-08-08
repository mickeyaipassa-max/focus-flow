import type { ReactNode } from "react";
import { VerzuimFunnelProvider } from "./funnel-context";

/**
 * Omvat alle routes onder `/verzuim/*` (Intro, Jouw bedrijf 1/3, 2/3, 3/3)
 * met de gedeelde funnelstate — Next.js past deze layout automatisch toe op
 * elke geneste sub-route, dus dit is de enige plek waar de provider hoeft
 * te staan.
 */
export default function VerzuimLayout({ children }: { children: ReactNode }) {
  return <VerzuimFunnelProvider>{children}</VerzuimFunnelProvider>;
}
