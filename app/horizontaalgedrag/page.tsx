"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { RadioCardBottomCarousel, type CarouselCardOption } from "@/components/RadioCardBottomCarousel";

const OPTIONS: CarouselCardOption[] = [
  {
    value: "wa",
    title: "WA",
    price: "68,76",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: false },
      { text: "Ruitschade", included: false },
      { text: "Schade door aanrijding en andere schades", included: false },
    ],
  },
  {
    value: "wa-casco-beperkt",
    title: "WA + Casco beperkt",
    price: "75,65",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Schade door aanrijding en andere schades", included: false },
    ],
  },
  {
    value: "wa-casco-allrisk",
    title: "WA + Casco allrisk",
    price: "116,77",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Schade door aanrijding en andere schades", included: true },
    ],
  },
];

/**
 * Demo van `RadioCardBottomCarousel` — de horizontale swipe-carrousel uit
 * Figma's "asr kaart"-scherm (node 2383:6764, bestand
 * "Untitled"/q7IRrH1ahDr1P5KSWCLlBA), de nog niet gebouwde "Jouw dekking"-
 * stap van de Auto-funnel. Losstaande demo-pagina op verzoek (`/horizontaalgedrag`)
 * — geen onderdeel van de echte Auto-funnel, dus geen FunnelPageTemplate/
 * StepIndicator/FormNavigation.
 *
 * "WA + Casco beperkt" is de standaard geselecteerde kaart — Figma toonde
 * die kaart al met de gele geselecteerd-rand/schaduw, niet los bevestigd
 * via een aparte state-toggle.
 *
 * De `Header` hier is de bestaande funnel-header (logo + titel + knop),
 * niet Figma's eigen "Inloggen/Menu"-sitebrede header op dit scherm — die
 * variant bestaat nog niet in de componentbibliotheek en valt buiten de
 * scope van deze carrousel-demo.
 */
export default function HorizontaalGedragPage() {
  const [selected, setSelected] = useState("wa-casco-beperkt");

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#fff8e3]">
      <Header title="Jouw dekking" chatButton={false} />

      <main className="flex w-full flex-1 flex-col items-center py-6">
        <div className="flex w-full max-w-[440px] flex-col gap-4 overflow-hidden rounded-[3px] bg-white pt-6 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.12)]">
          <p className="w-full px-6 text-[32px] text-black leading-[1.2]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            Jouw dekking
          </p>

          <div className="h-px w-full bg-[rgba(0,0,0,0.08)]" />

          <RadioCardBottomCarousel labelText="Kies je basisdekking" options={OPTIONS} value={selected} onChange={setSelected} onMoreInfoClick={() => {}} />

          <div className="h-2" />
        </div>
      </main>
    </div>
  );
}
