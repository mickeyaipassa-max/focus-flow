import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Woonverzekeringen | a.s.r.",
  description: "Verzeker je huis en spullen goed. Kies de woonverzekering die past bij jouw woning en situatie.",
};

export default function WoonV2Layout({ children }: { children: ReactNode }) {
  return children;
}
