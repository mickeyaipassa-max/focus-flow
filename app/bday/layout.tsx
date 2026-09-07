import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins } from "next/font/google";

/**
 * Figma (node 11:190 t/m 11:208) gebruikt overal "Poppins:Light" (64px,
 * tracking 0.18em) — hier het echte Google Font geladen, gescheiden van
 * focus-flow's eigen Avenir/Memphis in de root layout.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-bday-poppins",
});

export const metadata: Metadata = {
  title: "Lieve Elise",
};

export default function BdayLayout({ children }: { children: ReactNode }) {
  return <div className={`${poppins.variable} bg-black`}>{children}</div>;
}
