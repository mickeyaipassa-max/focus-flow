"use client";

import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/Checkbox";
import { FieldsetAddress } from "@/components/FieldsetAddress";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelSection } from "@/components/FunnelSection";
import { Input } from "@/components/Input";
import { InputDate } from "@/components/InputDate";
import { InputEmail } from "@/components/InputEmail";
import { InputPhone } from "@/components/InputPhone";
import { RadioGroup } from "@/components/RadioGroup";
import { fromIsoDatum, toIsoDatum } from "@/lib/datum";
import { BewindScherm, Scheidingslijn, SectieTitel, useStap, VerplichteVelden } from "./delen";
import { ROUTES, type SoortBewindvoerder } from "./funnel-context";
import { isGeldig, valideerBewindvoerder } from "./validatie";

/**
 * Stap 1, "Bewindvoerder" (Figma frames "1 Bewindvoerder" en de varianten "Zakelijk" en "Postbusadres").
 * Particulier toont voornamen, achternaam en geboortedatum; Zakelijk toont statutaire naam en KvK-nummer.
 * "Dit adres is een postbusadres" wisselt huisnummer/toevoeging voor postbusnummer en plaats (Figma
 * "Fieldset Address P.O. Box"). Validatie bij "Volgende stap" (regels in `./validatie.ts`).
 */
export default function BewindvoerderPage() {
  const router = useRouter();
  const { state, setState, fouten, setFouten, wijzig } = useStap();
  const particulier = state.soort === "particulier";

  function handleNext() {
    const gevonden = valideerBewindvoerder(state);
    setFouten(gevonden);
    if (isGeldig(gevonden)) router.push(ROUTES.bewindgegevens);
  }

  return (
    <BewindScherm
      activeStep={1}
      terugLabel="Terug"
      onTerug={() => router.back()}
      navigation={<FormNavigation previousStep previousLabel="Terug" nextLabel="Naar bewindgegevens" onPrevious={() => router.back()} onNext={handleNext} />}
    >
      <FunnelSection intro title="Bewindvoerder" showRequiredFieldsNote requiredFieldsNote={<VerplichteVelden />} />

      <SectieTitel>Gegevens</SectieTitel>

      <RadioGroup
        labelText="Particulier/Zakelijk"
        horizontal
        options={[
          { value: "particulier", label: "Particulier" },
          { value: "zakelijk", label: "Zakelijk" },
        ]}
        value={state.soort}
        onChange={(value) => wijzig({ soort: value as SoortBewindvoerder })}
      />

      {particulier ? (
        <>
          <div className="flex w-full max-w-[480px] flex-col items-start gap-6">
            <div className="flex w-full flex-wrap items-end gap-x-2 gap-y-6">
              <Input
                labelText="Voornamen Bewindvoerder"
                description="Officiële voornamen zoals op ID"
                className="flex min-w-[min(312px,100%)] flex-1 flex-col items-start gap-2"
                autoComplete="off"
                value={state.voornamen}
                error={fouten.voornamen}
                onChange={(value) => wijzig({ voornamen: value })}
              />
              <Input
                labelText="Tussenvoegsel"
                required={false}
                className="flex w-40 max-w-full flex-col items-start gap-2"
                autoComplete="off"
                value={state.tussenvoegsel}
                error={fouten.tussenvoegsel}
                onChange={(value) => wijzig({ tussenvoegsel: value })}
              />
            </div>
            <Input
              labelText="Achternaam Bewindvoerder"
              className="flex w-full flex-col items-start gap-2"
              autoComplete="off"
              value={state.achternaam}
              error={fouten.achternaam}
              onChange={(value) => wijzig({ achternaam: value })}
            />
          </div>

          <InputDate
            className="relative isolate flex w-full max-w-[333px] flex-col items-start gap-2"
            labelText="Geboortedatum"
            showPickerButton
            placeholder="dd-mm-jjjj"
            value={state.geboortedatum ? fromIsoDatum(state.geboortedatum) : null}
            error={fouten.geboortedatum}
            onTextChange={(tekst) => setState({ geboortedatumTekst: tekst })}
            onChange={(date) => wijzig({ geboortedatum: date ? toIsoDatum(date) : "" })}
          />
        </>
      ) : (
        <>
          <Input
            labelText="Statutaire naam"
            className="flex w-full flex-col items-start gap-2"
            fieldWidth="lg"
            autoComplete="organization"
            value={state.statutaireNaam}
            error={fouten.statutaireNaam}
            onChange={(value) => wijzig({ statutaireNaam: value })}
          />
          <Input
            labelText="KvK-nummer"
            className="flex w-full flex-col items-start gap-2"
            fieldWidth="sm"
            inputMode="numeric"
            maxLength={8}
            autoComplete="off"
            value={state.kvkNummer}
            error={fouten.kvkNummer}
            onChange={(value) => wijzig({ kvkNummer: value })}
          />
        </>
      )}

      <InputEmail
        labelText="E-mailadres"
        className="flex w-full max-w-[272px] flex-col items-start gap-2"
        value={state.email}
        error={fouten.email}
        onChange={(value) => wijzig({ email: value })}
      />

      <InputPhone
        labelText="Telefoonnummer"
        required={false}
        className="flex w-full max-w-[272px] flex-col items-start gap-2"
        value={state.telefoon}
        error={fouten.telefoon}
        onChange={(value) => wijzig({ telefoon: value })}
      />

      <Scheidingslijn />
      <SectieTitel>Postadres</SectieTitel>

      <div className="flex w-full max-w-[400px] flex-col items-start gap-6">
        <Checkbox
          label="Dit adres is een postbusadres"
          checked={state.postbus}
          onChange={(checked) => wijzig({ postbus: checked, huisnummer: "", toevoeging: "", postbusnummer: "", plaats: "" })}
        />

        {state.postbus ? (
          <>
            <Input
              labelText="Postcode"
              className="flex w-[112px] flex-col items-start gap-2"
              autoComplete="postal-code"
              maxLength={7}
              value={state.postcode}
              error={fouten.postcode}
              onChange={(value) => wijzig({ postcode: value })}
            />
            <Input
              labelText="Postbusnummer"
              className="flex w-40 max-w-full flex-col items-start gap-2"
              inputMode="numeric"
              autoComplete="off"
              value={state.postbusnummer}
              error={fouten.postbusnummer}
              onChange={(value) => wijzig({ postbusnummer: value })}
            />
            <Input
              labelText="Plaats"
              className="flex w-40 max-w-full flex-col items-start gap-2"
              autoComplete="address-level2"
              value={state.plaats}
              error={fouten.plaats}
              onChange={(value) => wijzig({ plaats: value })}
            />
          </>
        ) : (
          <FieldsetAddress
            value={{ postalCode: state.postcode, houseNumber: state.huisnummer, addition: state.toevoeging }}
            errors={{ postalCode: fouten.postcode, houseNumber: fouten.huisnummer }}
            onChange={(value) => wijzig({ postcode: value.postalCode, huisnummer: value.houseNumber, toevoeging: value.addition })}
          />
        )}
      </div>
    </BewindScherm>
  );
}
