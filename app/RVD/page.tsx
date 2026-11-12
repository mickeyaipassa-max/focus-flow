import type { Metadata } from "next";
import { JouwDekkingStap } from "./jouw-dekking";

export const metadata: Metadata = { title: "Autoverzekering – Jouw dekking" };

export default function RVDPage() {
  return <JouwDekkingStap />;
}
