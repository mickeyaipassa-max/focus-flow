"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelSection } from "@/components/FunnelSection";
import { Input } from "@/components/Input";
import { InputDate } from "@/components/InputDate";
import { InputEmail } from "@/components/InputEmail";
import { RadioGroup } from "@/components/RadioGroup";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { fromIsoDatum, toIsoDatum } from "@/lib/datum";
import { BehandelhistorieScherm, TerugKnop, VerplichteVelden } from "../delen";
import { ROUTES, useBehandelhistorieFunnel, type BehandelhistorieState } from "../funnel-context";
import { REDENEN, REDEN_ANDERS, SITUATIES } from "../opties";
import { isGeldig, valideerBehandeling, type Fouten } from "../validatie";

function vandaag() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Stap 2, "Gegevens behandeling" (Figma-bestand "Formulier-behandelhistorie",
 * frames "02", "02a", "02b", "02b.1" en "02c"): drie secties — Chronische
 * indicatie, Behandelhistorie en Gegevens praktijk.
 *
 * "Welke situatie is van toepassing?" bepaalt de vervolgvraag:
 * - nieuw bij a.s.r. (02a) of zelf betaalde behandelingen (02c): "Aantal
 *   behandelingen op chronische indicatie (aanspraakcode 008)", alleen bij
 *   "nieuw" met de hint uit Figma;
 * - opnieuw een chronische indicatie (02b): keuzelijst met de reden, en bij
 *   "Anders, namelijk" (02b.1) een toelichting.
 *
 * Wisselt de gebruiker van situatie, dan worden de antwoorden op de
 * vervolgvragen van de andere situaties gewist, zodat er niets achterblijft
 * dat niet meer zichtbaar is. Validatie bij "Naar controleren en verzenden"
 * (regels in `../validatie.ts`).
 */
export default function BehandelingPage() {
  const router = useRouter();
  const { state, setState } = useBehandelhistorieFunnel();
  const [fouten, setFouten] = useState<Fouten>({});

  function wijzig(update: Partial<BehandelhistorieState>) {
    setState(update);
    setFouten((huidig) => {
      const volgend = { ...huidig };
      for (const key of Object.keys(update)) delete volgend[key];
      return volgend;
    });
  }

  function handleNext() {
    const gevonden = valideerBehandeling(state);
    setFouten(gevonden);
    if (isGeldig(gevonden)) router.push(ROUTES.controleren);
  }

  const toonAantal = state.situatie === "nieuw" || state.situatie === "zelfBetaald";
  const toonReden = state.situatie === "opnieuw";

  return (
    <BehandelhistorieScherm
      activeStep={2}
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Gegevens verzekerde"
          nextLabel="Naar controleren en verzenden"
          onPrevious={() => router.push(ROUTES.verzekerde)}
          onNext={handleNext}
        />
      }
    >
      <TerugKnop onClick={() => router.push(ROUTES.verzekerde)}>Gegevens verzekerde</TerugKnop>

      <FunnelSection intro title="Gegevens behandeling" showRequiredFieldsNote requiredFieldsNote={<VerplichteVelden />} />

      <FunnelSection title="Chronische indicatie">
        <Input
          labelText="Wat is de diagnosecode?"
          className="flex w-full flex-col items-start gap-2"
          fieldWidth="sm"
          inputMode="numeric"
          autoComplete="off"
          value={state.diagnosecode}
          error={fouten.diagnosecode}
          onChange={(value) => wijzig({ diagnosecode: value })}
        />
        <InputDate
          className="relative isolate flex w-full flex-col items-start gap-2"
          labelText="Ingangsdatum chronische periode"
          description="Datum van de eerste behandeling, meestal de intake."
          showPickerButton
          placeholder="dd-mm-jjjj"
          maxDate={vandaag()}
          value={state.ingangsdatum ? fromIsoDatum(state.ingangsdatum) : null}
          error={fouten.ingangsdatum}
          onChange={(date) => wijzig({ ingangsdatum: date ? toIsoDatum(date) : "" })}
        />
      </FunnelSection>

      <FunnelSection title="Behandelhistorie" showDividerAbove>
        <RadioGroup
          labelText="Welke situatie is van toepassing?"
          description="Kies de situatie die van toepassing is. De relevante vervolgvraag verschijnt direct."
          options={SITUATIES}
          fullWidth
          name="situatie"
          value={state.situatie}
          error={fouten.situatie}
          onChange={(value) =>
            // Antwoorden op vervolgvragen van een andere situatie vervallen.
            wijzig({
              situatie: value as BehandelhistorieState["situatie"],
              aantalBehandelingen: "",
              reden: "",
              toelichting: "",
            })
          }
        />

        {toonAantal && (
          <Input
            labelText="Aantal behandelingen op chronische indicatie (aanspraakcode 008)"
            description={state.situatie === "nieuw" ? "Het gaat om het aantal behandelingen voordat de verzekerde bij a.s.r. verzekerd was." : undefined}
            className="flex w-full flex-col items-start gap-2"
            fieldWidth="sm"
            inputMode="numeric"
            autoComplete="off"
            value={state.aantalBehandelingen}
            error={fouten.aantalBehandelingen}
            onChange={(value) => wijzig({ aantalBehandelingen: value })}
          />
        )}

        {toonReden && (
          <>
            <Select
              labelText="Waarom is er een nieuwe chronische indicatie van toepassing?"
              options={REDENEN}
              fieldWidth="lg"
              wrapOptions
              value={state.reden}
              error={fouten.reden}
              onChange={(value) => wijzig({ reden: value, toelichting: "" })}
            />
            {state.reden === REDEN_ANDERS && (
              <Textarea
                id="toelichting"
                labelText="Licht je reden toe"
                value={state.toelichting}
                error={fouten.toelichting}
                onChange={(value) => wijzig({ toelichting: value })}
              />
            )}
          </>
        )}
      </FunnelSection>

      <FunnelSection title="Gegevens praktijk" showDividerAbove>
        <Input
          labelText="Naam praktijk"
          className="flex w-full flex-col items-start gap-2"
          fieldWidth="md"
          autoComplete="organization"
          value={state.naamPraktijk}
          error={fouten.naamPraktijk}
          onChange={(value) => wijzig({ naamPraktijk: value })}
        />
        <Input
          labelText="AGB-code praktijk"
          className="flex w-full flex-col items-start gap-2"
          fieldWidth="md"
          inputMode="numeric"
          maxLength={8}
          autoComplete="off"
          value={state.agbCode}
          error={fouten.agbCode}
          onChange={(value) => wijzig({ agbCode: value })}
        />
        <InputEmail
          className="flex w-full max-w-80 flex-col items-start gap-2"
          value={state.emailPraktijk}
          error={fouten.emailPraktijk}
          onChange={(value) => wijzig({ emailPraktijk: value })}
        />
      </FunnelSection>
    </BehandelhistorieScherm>
  );
}
