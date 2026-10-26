import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BewindFunnelProvider } from "./funnel-context";

export const metadata: Metadata = { title: "Aanmelden als bewindvoerder" };

/** Omvat alle routes onder `/bewindsvoerder/*` met de gedeelde funnelstate — zelfde opzet als `app/behandelhistorie/layout.tsx`. */
export default function BewindLayout({ children }: { children: ReactNode }) {
  return <BewindFunnelProvider>{children}</BewindFunnelProvider>;
}
