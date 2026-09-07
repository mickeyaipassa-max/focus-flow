import type { ReactNode } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "500"],
  variable: "--font-elise-poppins",
});

/**
 * Omvat alle routes onder `/elise/*`. Figma specificeert het lettertype
 * als "Poppins" (Light/ExtraLight/Medium) — een gewoon Google Font, dus
 * hier geladen via next/font/google i.p.v. lokale bestanden. Toegepast
 * op de hele subtree, los van focus-flow's eigen Avenir/Memphis in de
 * root layout.
 */
export default function EliseLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${poppins.variable} overflow-x-hidden font-[family-name:var(--font-elise-poppins)]`}>
      {children}
    </div>
  );
}
