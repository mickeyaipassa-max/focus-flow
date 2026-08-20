import type { ReactNode } from "react";
import { AutoFunnelProvider } from "./funnel-context";

/** Omvat alle routes onder `/auto/*` met de gedeelde funnelstate. */
export default function AutoLayout({ children }: { children: ReactNode }) {
  return <AutoFunnelProvider>{children}</AutoFunnelProvider>;
}
