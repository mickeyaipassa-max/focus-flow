"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelSection } from "@/components/FunnelSection";
import { Input } from "@/components/Input";
import { InputDate } from "@/components/InputDate";
import { fromIsoDatum, toIsoDatum } from "@/lib/datum";
import { BehandelhistorieScherm, TerugKnop, VerplichteVelden } from "../delen";
import { ROUTES, useBehandelhistorieFunnel, type BehandelhistorieState } from "../funnel-context";
import { isGeldig, valideerVerzekerde, type Fouten } from "../validatie";

function vandaag() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Stap 1, "Gegevens verzekerde" (Figma-bestand "Formulier-behandelhistorie",
 * frame "01 - Gegevens verzekerde"): verzekerdennummer, voorletters,
 * tussenvoegsel (niet verplicht), achternaam en geboortedatum. Validatie bij
 * "Naar gegevens behandeling" (regels in `../validatie.ts`); een fout
 * verdwijnt zodra het veld wordt aangepast.
 */
export default function VerzekerdePage() {
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
    const gevonden = valideerVerzekerde(state);
    setFouten(gevonden);
    if (isGeldig(gevonden)) router.push(ROUTES.behandeling);
  }

  return (
    <BehandelhistorieScherm
      activeStep={1}
      navigation={<FormNavigation previousStep previousLabel="Terug" nextLabel="Naar gegevens behandeling" onPrevious={() => router.push(ROUTES.intro)} onNext={handleNext} />}
    >
      <TerugKnop onClick={() => router.push(ROUTES.intro)}>Terug</TerugKnop>

      <FunnelSection intro title="Gegevens verzekerde" showRequiredFieldsNote requiredFieldsNote={<VerplichteVelden />} />

      <div className="flex w-full flex-col items-start gap-10">
        <Input
          labelText="Verzekerdennummer"
          description="Het verzekerdennummer bestaat uit 9 cijfers en begint met 13, 46 of 47."
          className="flex w-full flex-col items-start gap-2"
          fieldWidth="sm"
          inputMode="numeric"
          maxLength={9}
          autoComplete="off"
          value={state.verzekerdennummer}
          error={fouten.verzekerdennummer}
          onChange={(value) => wijzig({ verzekerdennummer: value })}
        />

        <div className="flex w-full max-w-[384px] flex-col items-start gap-6">
          <div className="flex w-full flex-wrap items-start gap-x-2 gap-y-6">
            <Input
              labelText="Voorletters"
              className="flex w-40 max-w-full flex-col items-start gap-2"
              autoComplete="off"
              value={state.voorletters}
              error={fouten.voorletters}
              onChange={(value) => wijzig({ voorletters: value })}
            />
            <Input
              labelText="Tussenvoegsel"
              required={false}
              className="flex w-40 max-w-full flex-col items-start gap-2"
              autoComplete="off"
              value={state.tussenvoegsel}
              onChange={(value) => wijzig({ tussenvoegsel: value })}
            />
          </div>
          <Input
            labelText="Achternaam"
            className="flex w-full flex-col items-start gap-2"
            autoComplete="off"
            value={state.achternaam}
            error={fouten.achternaam}
            onChange={(value) => wijzig({ achternaam: value })}
          />
        </div>

        <InputDate
          className="relative isolate flex w-full flex-col items-start gap-2"
          labelText="Geboortedatum"
          showPickerButton
          placeholder="dd-mm-jjjj"
          maxDate={vandaag()}
          value={state.geboortedatum ? fromIsoDatum(state.geboortedatum) : null}
          error={fouten.geboortedatum}
          onTextChange={(tekst) => setState({ geboortedatumTekst: tekst })}
          onChange={(date) => wijzig({ geboortedatum: date ? toIsoDatum(date) : "" })}
        />
      </div>
    </BehandelhistorieScherm>
  );
}
