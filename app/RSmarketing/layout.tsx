import type { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-rs-inter",
});

/**
 * Omvat /RSmarketing. RocketSourcers' eigen huisstijl gebruikt Inter (niet
 * focus-flow's eigen Avenir/Memphis uit de root layout), dus dat laden we
 * hier apart, net als duvet-dubois zijn eigen Inter laadt.
 */
export default function RSMarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} font-[family-name:var(--font-rs-inter)]`}>
      {children}
    </div>
  );
}
