import type { Metadata } from "next";
import { ZorgverzekeringenContent } from "../ZorgverzekeringenContent";

export const metadata: Metadata = {
  title: "Zorgverzekeringen | a.s.r.",
  // Dit is alleen de inhoud voor de iframe op /zorgverzekeringen, geen eigen pagina om te vinden.
  robots: { index: false, follow: false },
};

export default function ZorgverzekeringenInhoudPage() {
  return <ZorgverzekeringenContent />;
}
