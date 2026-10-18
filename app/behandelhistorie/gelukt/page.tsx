"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/Alert";
import { FunnelSection } from "@/components/FunnelSection";
import { isGeldig, valideerBehandeling, valideerVerzekerde } from "../validatie";
import { BehandelhistorieScherm } from "../delen";
import { BEHANDELHISTORIE_STEPS, ROUTES, useBehandelhistorieFunnel } from "../funnel-context";

/**
 * Bevestiging na "Indienen" (Figma-bestand "Formulier-behandelhistorie",
 * frame "Afgerond - Gelukt - Bevestiging aanvraag"): alle drie de stappen
 * staan op "completed" (`activeStep` één voorbij de laatste), zonder knoppen.
 *
 * Figma noemt ook een e-mail naar het praktijkadres (twee tekstvarianten) en
 * een foutscherm voor een mislukte aanvraag; die zijn niet getekend en hier
 * dus niet gebouwd. Zonder ingevulde gegevens (rechtstreeks geopend of na een
 * refresh) gaat de gebruiker terug naar de start.
 */
export default function GeluktPage() {
  const router = useRouter();
  const { state } = useBehandelhistorieFunnel();
  const compleet = isGeldig(valideerVerzekerde(state)) && isGeldig(valideerBehandeling(state));

  useEffect(() => {
    if (!compleet) router.replace(ROUTES.intro);
  }, [compleet, router]);

  return (
    <BehandelhistorieScherm activeStep={BEHANDELHISTORIE_STEPS.length + 1} navigation={null}>
      <FunnelSection intro title="Gelukt!" />

      <div className="w-full">
        {/* Zoals Royeren: Figma tekent deze Alert zonder rand (alleen de groene tint). */}
        <Alert
          className="flex items-start gap-2 rounded-[3px] bg-[#eef4e3] p-2"
          type="success"
          closable={false}
          title="Het is gelukt!"
          description="Bedankt voor het doorgeven van de behandelhistorie."
        />
      </div>

      <FunnelSection title="Wat nu?" description="We verwerken je aanvraag zo snel mogelijk. Binnen 10 werkdagen ontvang je van ons een reactie." />
    </BehandelhistorieScherm>
  );
}
