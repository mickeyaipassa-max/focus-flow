import type { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dd-inter",
});

/**
 * Omvat alle routes onder `/duvet-dubois/*`. De Figma-export van dit
 * ontwerp zet per tekstnode een letterlijke (niet-bestaande) CSS
 * font-family `"Inter:Semi Bold"` etc. — dat matcht geen geladen font, dus
 * die tokens zijn uit de componenten verwijderd (het echte gewicht komt al
 * mee via `font-semibold`/`font-medium`/`font-normal`). Hier laden we het
 * echte Inter-lettertype en passen het toe op de hele subtree, gescheiden
 * van focus-flow's eigen Avenir/Memphis in de root layout.
 */
export default function DuvetDuboisLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} overflow-x-hidden font-[family-name:var(--font-dd-inter)]`}>
      {children}
    </div>
  );
}
