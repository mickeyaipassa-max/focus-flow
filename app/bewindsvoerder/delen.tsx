"use client";

import { useState, type ReactNode } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { RadioGroup } from "@/components/RadioGroup";
import { SiteHeader } from "@/components/SiteHeader";
import { StepIndicator } from "@/components/StepIndicator";
import { FOOTER_COLUMNS } from "./footer-kolommen";
import { BEWIND_STEPS, useBewindFunnel, type BewindState } from "./funnel-context";
import type { Fouten } from "./validatie";

/** State + fouten van één stap; een fout verdwijnt zodra het bijbehorende veld wordt aangepast. */
export function useStap() {
  const { state, setState } = useBewindFunnel();
  const [fouten, setFouten] = useState<Fouten>({});

  function wijzig(update: Partial<BewindState>) {
    setState(update);
    setFouten((huidig) => {
      const volgend = { ...huidig };
      for (const key of Object.keys(update)) delete volgend[key];
      return volgend;
    });
  }

  return { state, setState, fouten, setFouten, wijzig };
}

/*
 * Servicepagina met inline funnel, naar Figma "Bewindvoerdersformulier" (section "bewindsvoerderformulier"):
 * SiteHeader, kruimelpad, hero, de crème funnelband met stappenindicator en kaart, op de samenvatting en
 * succespagina "We zijn benieuwd naar je mening", en de footer. "Veel gestelde vragen" en "Hulp nodig?"
 * staan bewust niet in de funnel.
 */

const SECTIE_PADDING = "px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32";
const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;
const H2_KLASSE = "text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]";

/** Kaartbreedte zonder sidebar (Figma: "Funnel" 784px), zelfde opzet als de behandelhistorie-funnel. */
const KAART_KLASSE = "flex w-full max-w-[784px] flex-col items-start overflow-hidden rounded-md bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.12)]";
const BACK_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 py-0 pl-px text-black text-lg leading-[1.5] font-[550] underline whitespace-nowrap";

/** "* Verplichte velden" zoals Figma het tekent (asterisk eerst), rechts boven het formulier. */
export function VerplichteVelden() {
  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <span className="text-[#ce0a1e] text-base" style={AVENIR}>
        *
      </span>
      <span className="text-black text-sm" style={AVENIR}>
        Verplichte velden
      </span>
    </div>
  );
}

/** Sectietitel binnen een stap (Figma "intro": Memphis 32px, 24px onder 600px). */
export function SectieTitel({ children }: { children: ReactNode }) {
  return (
    <h2 className={`w-full ${H2_KLASSE}`} style={MEMPHIS}>
      {children}
    </h2>
  );
}

export function Scheidingslijn() {
  return <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />;
}

function Sectie({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={`w-full ${SECTIE_PADDING}`}>
      <div className={["mx-auto max-w-[1200px]", className ?? ""].join(" ")}>{children}</div>
    </section>
  );
}

function Feedback() {
  const [antwoord, setAntwoord] = useState("");
  return (
    <Sectie className="flex flex-col gap-2">
      <h2 className={H2_KLASSE} style={MEMPHIS}>
        We zijn benieuwd naar je mening
      </h2>
      <RadioGroup
        labelText="Heb je het doel van je bezoek bereikt?"
        required={false}
        horizontal
        options={[
          { value: "ja", label: "Ja" },
          { value: "nee", label: "Nee" },
        ]}
        value={antwoord}
        onChange={setAntwoord}
      />
    </Sectie>
  );
}

/**
 * Gedeelde paginaschil van alle stappen; alleen de actieve stap, de terug-link, de kaartinhoud en de
 * navigatie verschillen. `feedback` toont het blok "We zijn benieuwd naar je mening" (samenvatting en succespagina).
 * Zonder `terugLabel` en `navigation` (de succespagina) heeft de kaart geen terug-link en geen navigatiebalk.
 */
export function BewindScherm({
  activeStep,
  terugLabel,
  onTerug,
  navigation,
  feedback = false,
  children,
}: {
  activeStep: number;
  terugLabel?: string;
  onTerug?: () => void;
  navigation?: ReactNode;
  feedback?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <SiteHeader />
      <Breadcrumb
        items={[{ label: "Home" }, { label: "Service & contact" }, { label: "Bewindvoerders" }, { label: "Aanmelden als bewindvoerder" }]}
      />

      <main className="flex w-full flex-col items-start gap-6 pb-6 min-[600px]:gap-12 min-[600px]:pb-12">
        <Sectie className="flex flex-col gap-2 pt-6 min-[600px]:pt-0">
          <div className="flex items-start gap-4">
            <img src="/bewindsvoerder/pictogram-hand-met-zak-geld.svg" alt="" width={48} height={48} className="size-12 shrink-0" />
            <h1 className="pt-1 text-black text-[32px] leading-[1.2] min-[600px]:text-[40px]" style={MEMPHIS}>
              Aanmelden als bewindvoerder
            </h1>
          </div>
          <p className="max-w-[880px] text-black text-base leading-[1.4] min-[600px]:text-xl" style={AVENIR}>
            Ben je bewindvoerder van een klant van a.s.r.? Geef het bewind dan via dit formulier aan ons door.
          </p>
        </Sectie>

        <section className="flex w-full justify-center bg-[#fff8e3] py-10">
          <div className="flex w-full max-w-[1440px] flex-col items-center gap-10 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
            <StepIndicator
              steps={BEWIND_STEPS}
              activeStep={activeStep}
              animationKey="bewindsvoerder"
              mobile
              className="flex w-full items-start justify-center px-6 min-[900px]:hidden"
            />
            <StepIndicator
              steps={BEWIND_STEPS}
              activeStep={activeStep}
              animationKey="bewindsvoerder"
              className="hidden w-full items-start justify-center min-[900px]:flex min-[1200px]:pl-10"
            />
            <div className={KAART_KLASSE}>
              <div className="flex w-full flex-col items-start gap-6 p-6 min-[1200px]:p-10">
                {terugLabel && (
                  <div className="flex w-full items-start">
                    <Button type="tertiary" iconPrepend="arrow-left" onClick={onTerug} className={BACK_BUTTON_CLASS}>
                      {terugLabel}
                    </Button>
                  </div>
                )}
                <div className="flex w-full flex-col items-start gap-10">{children}</div>
              </div>
              {navigation && (
                <>
                  <Scheidingslijn />
                  {navigation}
                </>
              )}
            </div>
          </div>
        </section>

        {feedback && <Feedback />}
      </main>

      <Footer columns={FOOTER_COLUMNS} showAppBadges centered linkSection />
    </div>
  );
}
