import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { DigidHighlight } from "../digid-highlight";
import { Jaarkeuze } from "./jaarkeuze";
import { Vinder } from "./vinder";

export const metadata: Metadata = { title: "Oefentherapie bij knie- en heupartrose" };

/*
 * Naar Figma "Vergoedingenvinder — desktop 1440" (bestand Vergoedingen, node 4:1437) en "— mobiel 375" (node 7:515):
 * SiteHeader, kruimelpad, titel, "In het kort" met de jaarkeuze en de DigiD-highlight, "Kijk wat je vergoed krijgt:" met
 * de verzekeringskeuze en de uitkomst, en de footer. Op mobiel ontbreken "In het kort" en de highlight in Figma, en staat
 * de uitkomst anders opgebouwd (zie vinder.tsx). Het kruimelpad staat letterlijk zoals in Figma.
 */

const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;

export default function OefentherapieKnieHeupartrosePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <SiteHeader />

      <main className="w-full px-4 pt-4 pb-8 min-[600px]:px-12 min-[900px]:px-16 min-[900px]:pt-6 min-[900px]:pb-16 min-[1200px]:px-[120px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 min-[900px]:gap-8">
          <Breadcrumb
            items={[{ label: "home" }, { label: "zorgverzekering" }, { label: "Vergoedingen" }, { label: "Oefentherapie bij knie- en heupartrose" }]}
            className="w-full"
          />

          <h1 className="text-black text-[32px] leading-[1.3] min-[900px]:text-[40px] min-[900px]:leading-[1.2]" style={MEMPHIS}>
            Oefentherapie bij knie- en heupartrose
          </h1>

          <div className="flex w-full items-center gap-8">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <hr className="m-0 hidden h-px w-full border-0 bg-[rgba(0,0,0,0.08)] min-[900px]:block" />
              <h2 className="hidden text-black text-[24px] leading-[1.3] min-[900px]:block" style={MEMPHIS}>
                In het kort
              </h2>
              <p className="hidden text-black text-lg leading-[1.5] min-[900px]:block" style={AVENIR}>
                Gericht op het verbeteren van de functie van het knie- en heupgewricht en het verminderen van pijn en stijfheid door middel van specifieke oefeningen.
              </p>
              <Jaarkeuze />
            </div>
            <DigidHighlight />
          </div>

          <Vinder />
        </div>
      </main>

      <Footer />
    </div>
  );
}
