import type { Metadata } from "next";
import { AutomobielContent } from "../AutomobielContent";

export const metadata: Metadata = {
  title: "Autoverzekering | a.s.r.",
  // Dit is alleen de inhoud voor de iframe op /automobiel, geen eigen pagina om te vinden.
  robots: { index: false, follow: false },
};

export default function AutomobielInhoudPage() {
  return <AutomobielContent />;
}
