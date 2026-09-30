import type { Metadata } from "next";
import RSMarketingDashboard from "./RSMarketingDashboard";

export const metadata: Metadata = {
  title: "Campagnedashboard – Hoeveel talent is bij jou al uit beeld?",
  robots: { index: false, follow: false, nocache: true },
};

export default function RSMarketingPage() {
  return <RSMarketingDashboard />;
}
