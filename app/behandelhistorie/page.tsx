"use client";

import { useRouter } from "next/navigation";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelSection } from "@/components/FunnelSection";
import { List } from "@/components/List";
import { BehandelhistorieScherm } from "./delen";
import { ROUTES } from "./funnel-context";

/**
 * Introscherm van "Chronische behandelhistorie doorgeven" (Figma-bestand
 * "Formulier-behandelhistorie", frame "00 - Intro"): titel, uitleg met twee
 * bullets en "Start formulier". De stappenindicator toont de drie stappen,
 * maar nog geen is actief.
 */
export default function BehandelhistorieIntroPage() {
  const router = useRouter();

  return (
    <BehandelhistorieScherm
      activeStep={0}
      navigation={<FormNavigation nextLabel="Start formulier" onNext={() => router.push(ROUTES.verzekerde)} />}
    >
      <FunnelSection
        intro
        hideIntroDivider
        title="Chronische behandelhistorie doorgeven"
        description={
          <>
            Dit formulier is voor zorgverleners van verzekerden met een chronische indicatie.
            <br />
            Via dit formulier kun je:
          </>
        }
      >
        <List
          icon="bullet"
          items={[
            { text: "De behandelhistorie voor chronische fysiotherapie of oefentherapie doorgeven." },
            { text: "De nieuwe chronische indicatie van de verzekerde melden." },
          ]}
        />
      </FunnelSection>
    </BehandelhistorieScherm>
  );
}
