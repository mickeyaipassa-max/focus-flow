import type { Metadata } from "next";
import { JouwDekkingVariant } from "./jouw-dekking-variant";

export const metadata: Metadata = { title: "Autoverzekering – Jouw dekking (variant)" };

export default function RVD2Page() {
  return <JouwDekkingVariant />;
}
