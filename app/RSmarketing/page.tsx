import type { Metadata } from "next";
import RSMarketingDashboard from "./RSMarketingDashboard";

export const metadata: Metadata = {
  title: "Marketingdashboard – RocketSourcers",
  robots: { index: false, follow: false, nocache: true },
};

export default function RSMarketingPage() {
  return <RSMarketingDashboard />;
}
