"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { Button } from "@/components/Button";
import { CardDetails } from "@/components/CardDetails";
import { List } from "@/components/List";
import { Checkbox } from "@/components/Checkbox";
import { Validation } from "@/components/Validation";
import { formatDatum, fromIsoDatum } from "@/lib/datum";
import { ROYEREN_BEVESTIGEN_CARD_CLASS } from "../card";
import { ROYEREN_STEPS, useRoyerenFunnel } from "../funnel-context";
import { REDENEN, bewijsstukBeschrijving } from "../opzegreden";

/**
 * Stap 2 van de "Royeren"-funnel, "Bevestigen" (Figma-bestand "Mutatie
 * funnels", pagina "-> Royeren", frame "Bevestigen" 8300:26700). Toont de
 * keuzes uit stap 1 (reden en datum uit `useRoyerenFunnel`) in een
 * `CardDetails` met "Wijzig" terug naar stap 1, en vraagt akkoord vóór
 * "Opzeggen bevestigen".
 *
 * Wijkt in Figma af van de andere schermen: de kaart is 763px breed (i.p.v.
 * 784px), heeft bovenaan een terug-knop (17px van de bovenrand, 16px boven de
 * intro) en de `Validation` onder de checkbox gebruikt een driehoek-icoon.
 * De 24px extra ruimte boven "Geef je akkoord" is ook letterlijk uit Figma.
 * Het gekozen bewijsstuk staat niet in de samenvatting (niet getekend).
 *
 * Zonder reden/datum (rechtstreeks geopend, of bestand kwijt na refresh) gaat
 * de klant terug naar stap 1.
 */
export default function RoyerenBevestigenPage() {
  const router = useRouter();
  const { state, reset, bestanden } = useRoyerenFunnel();
  const { reden, ingangsdatum } = state;
  const [akkoord, setAkkoord] = useState(false);
  const [akkoordError, setAkkoordError] = useState(false);

  const compleet = Boolean(reden && ingangsdatum) && !(bewijsstukBeschrijving(reden) && bestanden.length === 0);

  useEffect(() => {
    if (!compleet) router.replace("/royeren");
  }, [compleet, router]);

  const redenLabel = REDENEN.find((option) => option.value === reden)?.label ?? "";
  const datum = ingangsdatum ? formatDatum(fromIsoDatum(ingangsdatum)) : "";

  function handleSubmit() {
    if (!akkoord) {
      setAkkoordError(true);
      return;
    }
    router.push("/royeren/gelukt");
  }

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
      activeStep={2}
      stepAnimationKey="royeren"
      stepIndicatorClassName="hidden w-full items-start justify-center min-[900px]:flex min-[1200px]:px-10"
      cardClassName={ROYEREN_BEVESTIGEN_CARD_CLASS}
      contentClassName="flex w-full flex-col items-start gap-10 px-6 pt-4 pb-6 min-[1200px]:px-10 min-[1200px]:pt-[17px] min-[1200px]:pb-10"
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Je opzegging"
          nextStep={false}
          submit
          submitLabel="Opzeggen bevestigen"
          onPrevious={() => router.push("/royeren")}
          onSubmit={handleSubmit}
        />
      }
    >
      {/* Terug-knop: in Figma staan pijl en tekst op de contentrand (geen horizontale padding); 16px onder de knop begint de intro. */}
      <div className="-mb-6 flex w-full items-start">
        <Button
          type="tertiary"
          iconPrepend="arrow-left"
          onClick={() => router.push("/royeren")}
          className="inline-flex items-center justify-center gap-2 py-3 pl-px text-black text-lg leading-[1.5] font-[550] underline whitespace-nowrap"
        >
          Je opzegging
        </Button>
      </div>

      <FunnelSection
        intro
        title="Bevestigen"
        description="Je opzegging is nog niet doorgevoerd. Controleer de gegevens hieronder en geef je akkoord om de opzegging door te voeren."
        showRequiredFieldsNote
      />

      <FunnelSection title="Controleer je gegevens">
        <CardDetails
          // p-[23px] i.p.v. p-6: Figma's rand ligt binnen het kader, de CSS-rand van 1px erbuiten.
          className="flex w-full flex-col items-start gap-4 rounded-[3px] border border-[#ccc] bg-white p-[23px] min-[900px]:flex-row"
          title="Je opzegging"
          onEdit={() => router.push("/royeren")}
          rows={[
            { label: "Waarom wil je je verzekering opzeggen?", value: redenLabel },
            { label: "Je wilt je verzekering opzeggen per", value: datum },
          ]}
        />
      </FunnelSection>

      {/* 24px extra boven "Geef je akkoord": Figma's Form section heeft dat als eigen binnenruimte (64px i.p.v. 40px vanaf de kaart erboven). */}
      <div className="flex w-full flex-col items-start pt-6">
        <FunnelSection title="Geef je akkoord" description="Je verklaart:" />
      </div>

      <div className="flex w-full flex-col items-start gap-4">
        <List
          icon="bullet"
          items={[
            {
              text: `Ik ga ermee akkoord dat ik niet meer verzekerd ben onder de autoverzekering van a.s.r. ik kies zelf vanaf ${datum}. Na deze datum kunnen er geen claims meer worden ingediend.`,
            },
          ]}
        />

        <div className="flex w-full flex-col items-start gap-2">
          <Checkbox
            label={
              <>
                Ja, ik ga akkoord <span className="text-[#ce0a1e]">*</span>
              </>
            }
            checked={akkoord}
            onChange={(checked) => {
              setAkkoord(checked);
              if (checked) setAkkoordError(false);
            }}
          />
          {akkoordError && <Validation icon="triangle" message="Je dient akkoord te gaan met de voorwaarden." />}
        </div>
      </div>
    </FunnelPageTemplate>
  );
}
