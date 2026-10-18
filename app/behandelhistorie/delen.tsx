"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { BACK_BUTTON_CLASS, BEHANDELHISTORIE_CARD_CLASS, STEP_INDICATOR_CLASS } from "./card";
import { BEHANDELHISTORIE_STEPS, HEADER_TITLE, ROUTES, useBehandelhistorieFunnel } from "./funnel-context";

/** "* Verplichte velden" zoals Figma het tekent (asterisk eerst), rechts boven het formulier. */
export function VerplichteVelden() {
  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <span className="text-[#ce0a1e] text-base" style={{ fontFamily: "var(--font-avenir-book)" }}>
        *
      </span>
      <span className="text-black text-sm" style={{ fontFamily: "var(--font-avenir-book)" }}>
        Verplichte velden
      </span>
    </div>
  );
}

/** Terug-link bovenaan een stap (Figma: pijl + tekst, 27px hoog, op de contentrand). */
export function TerugKnop({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <div className="flex w-full items-start">
      <Button type="tertiary" iconPrepend="arrow-left" onClick={onClick} className={BACK_BUTTON_CLASS}>
        {children}
      </Button>
    </div>
  );
}

/**
 * De schermen van de funnel delen header, stappenindicator en kaartbreedte; alleen stap en inhoud verschillen.
 * Een klik op het logo wist alles wat is ingevuld en begint de flow opnieuw bij de intro.
 */
export function BehandelhistorieScherm({
  activeStep,
  navigation,
  children,
}: {
  activeStep: number;
  navigation: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const { reset } = useBehandelhistorieFunnel();

  return (
    <FunnelPageTemplate
      headerTitle={HEADER_TITLE}
      onLogoClick={() => {
        reset();
        router.push(ROUTES.intro);
      }}
      steps={BEHANDELHISTORIE_STEPS}
      activeStep={activeStep}
      stepAnimationKey="behandelhistorie"
      stepIndicatorClassName={STEP_INDICATOR_CLASS}
      cardClassName={BEHANDELHISTORIE_CARD_CLASS}
      navigation={navigation}
    >
      {children}
    </FunnelPageTemplate>
  );
}
