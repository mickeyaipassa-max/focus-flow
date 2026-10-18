import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BehandelhistorieFunnelProvider } from "./funnel-context";

export const metadata: Metadata = { title: "Chronische behandelhistorie doorgeven" };

/** Omvat alle routes onder `/behandelhistorie/*` met de gedeelde funnelstate — zelfde opzet als `app/royeren/layout.tsx`. */
export default function BehandelhistorieLayout({ children }: { children: ReactNode }) {
  return <BehandelhistorieFunnelProvider>{children}</BehandelhistorieFunnelProvider>;
}
