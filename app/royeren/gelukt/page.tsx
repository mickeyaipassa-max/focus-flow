"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { formatDatum, fromIsoDatum } from "@/lib/datum";
import { ROYEREN_CARD_CLASS } from "../card";
import { ROYEREN_STEPS, useRoyerenFunnel } from "../funnel-context";

/**
 * Successcherm van de "Royeren"-funnel (Figma-bestand "Mutatie funnels",
 * pagina "-> Royeren", frame "Succes" 8299:25759). Zelfde opzet als het
 * successcherm van de mutatie-funnel: `activeStep` één voorbij de laatste stap
 * zet beide stappen op "completed".
 *
 * Anders dan daar staan de twee knoppen in Figma binnen de kaart (tussen twee
 * dividers), niet in een navigatiebalk; de afsluitende divider van de
 * template blijft, de navigatie is leeg.
 *
 * "Naar je Autoverzekering" en "Naar je account" hebben (nog) geen bestemming
 * in Figma; beide gaan naar de startpagina. Zonder datum (rechtstreeks
 * geopend of na een refresh) gaat de klant terug naar stap 1; "Annuleren" wist
 * de funnel en gaat ook naar stap 1.
 */
export default function RoyerenGeluktPage() {
  const router = useRouter();
  const { state, reset } = useRoyerenFunnel();
  const { ingangsdatum } = state;

  useEffect(() => {
    if (!ingangsdatum) router.replace("/royeren");
  }, [ingangsdatum, router]);

  return (
    <FunnelPageTemplate
      headerTitle="Opzeggen Autoverzekering"
      cancelButton
      cancelStyle="cross-after"
      onCancel={() => {
        reset();
        router.push("/royeren");
      }}
      ikzSticker
      steps={ROYEREN_STEPS}
      activeStep={ROYEREN_STEPS.length + 1}
      stepAnimationKey="royeren"
      stepIndicatorClassName="hidden w-full items-start justify-center min-[900px]:flex min-[1200px]:px-10"
      cardClassName={ROYEREN_CARD_CLASS}
      navigation={null}
    >
      <FunnelSection intro title="Gelukt!" />

      <div className="w-full">
        {/* Figma tekent deze Alert zonder rand (alleen de groene tint, 87px hoog met 8px binnenruimte), anders dan Alert's standaard met rand. */}
        <Alert
          className="flex items-start gap-2 rounded-[3px] bg-[#eef4e3] p-2"
          type="success"
          closable={false}
          title="Het is gelukt!"
          description={`Je verzekering is opgezegd en stopt op ${ingangsdatum ? formatDatum(fromIsoDatum(ingangsdatum)) : "–"}.`}
        />
      </div>

      <FunnelSection title="Wat nu?" description="Je krijgt binnen een paar minuten een e-mail met de bevestiging van je wijziging." />

      <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />

      <div className="flex w-full flex-col items-stretch gap-2 min-[600px]:flex-row min-[600px]:items-start">
        <Button type="primary" wrap onClick={() => router.push("/")}>
          Naar je Autoverzekering
        </Button>
        <Button type="secondary" wrap onClick={() => router.push("/")}>
          Naar je account
        </Button>
      </div>
    </FunnelPageTemplate>
  );
}
