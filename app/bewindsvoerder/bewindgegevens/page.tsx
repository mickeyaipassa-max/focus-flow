"use client";

import { useRouter } from "next/navigation";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelSection } from "@/components/FunnelSection";
import { Input } from "@/components/Input";
import { InputDate } from "@/components/InputDate";
import { InputFile } from "@/components/InputFile";
import { RadioGroup } from "@/components/RadioGroup";
import { fromIsoDatum, toIsoDatum } from "@/lib/datum";
import { BewindScherm, useStap, VerplichteVelden } from "../delen";
import { ROUTES, type Betaalvoorkeur } from "../funnel-context";
import { isGeldig, valideerBewindgegevens } from "../validatie";

/** Helpertekst van "Input File" letterlijk uit Figma. */
const UPLOAD_TEKST = "Je documenten mogen samen niet groter dan 20mb zijn. Zorg dat je documenten eindigen op .doc, .docx, .jpg of .pdf.";

/** Knoptekst van "Input File" in Figma. */
const UPLOAD_KNOP = "Kies documenten";

/**
 * Stap 2, "Bewindgegevens" (Figma frames "2 Bewindgegevens" en de varianten "Betaalmail", "Zakelijk" en
 * "Zakelijk + Betaalmail"). "Upload Identiteitsbewijs" staat er alleen bij een particuliere bewindvoerder;
 * Bij Betaalvoorkeur "Zelf overmaken, rekening via e-mail" wordt geen e-mailadres meer gevraagd: dat staat al in stap 1.
 */
export default function BewindgegevensPage() {
  const router = useRouter();
  const { state, setState, fouten, setFouten, wijzig } = useStap();

  function handleNext() {
    const gevonden = valideerBewindgegevens(state);
    setFouten(gevonden);
    if (isGeldig(gevonden)) router.push(ROUTES.klant);
  }

  return (
    <BewindScherm
      activeStep={2}
      terugLabel="Bewindvoerder"
      onTerug={() => router.push(ROUTES.bewindvoerder)}
      navigation={
        <FormNavigation previousStep previousLabel="Bewindvoerder" nextLabel="Naar klant" onPrevious={() => router.push(ROUTES.bewindvoerder)} onNext={handleNext} />
      }
    >
      <FunnelSection intro title="Bewindgegevens" showRequiredFieldsNote requiredFieldsNote={<VerplichteVelden />} />

      <Input
        labelText="Zaaknummer rechtbank"
        className="flex w-full flex-col items-start gap-2"
        fieldWidth="lg"
        autoComplete="off"
        value={state.zaaknummer}
        error={fouten.zaaknummer}
        onChange={(value) => wijzig({ zaaknummer: value })}
      />

      <InputDate
        className="relative isolate flex w-full max-w-[333px] flex-col items-start gap-2"
        labelText="Startdatum bewind"
        showPickerButton
        placeholder="dd-mm-jjjj"
        value={state.startdatum ? fromIsoDatum(state.startdatum) : null}
        error={fouten.startdatum}
        onTextChange={(tekst) => setState({ startdatumTekst: tekst })}
        onChange={(date) => wijzig({ startdatum: date ? toIsoDatum(date) : "" })}
      />

      <InputDate
        className="relative isolate flex w-full max-w-[333px] flex-col items-start gap-2"
        labelText="Einddatum bewind"
        required={false}
        showPickerButton
        placeholder="dd-mm-jjjj"
        value={state.einddatum ? fromIsoDatum(state.einddatum) : null}
        error={fouten.einddatum}
        onTextChange={(tekst) => setState({ einddatumTekst: tekst })}
        onChange={(date) => wijzig({ einddatum: date ? toIsoDatum(date) : "" })}
      />

      <InputFile
        labelText="Upload beschikking"
        required
        buttonText={UPLOAD_KNOP}
        description={UPLOAD_TEKST}
        className="flex w-full max-w-[479px] flex-col items-start gap-2"
        defaultValue={state.beschikking}
        error={fouten.beschikking}
        onChange={(files) => wijzig({ beschikking: files })}
      />

      {state.soort === "particulier" && (
        <InputFile
          labelText="Upload identiteitsbewijs"
          required
          buttonText={UPLOAD_KNOP}
          description={UPLOAD_TEKST}
          className="flex w-full max-w-[479px] flex-col items-start gap-2"
          defaultValue={state.identiteitsbewijs}
          error={fouten.identiteitsbewijs}
          onChange={(files) => wijzig({ identiteitsbewijs: files })}
        />
      )}

      <RadioGroup
        labelText="Betaalvoorkeur"
        options={[
          { value: "incasso", label: "Automatisch betalen" },
          { value: "email", label: "Zelf overmaken, rekening via e-mail" },
        ]}
        value={state.betaalvoorkeur}
        onChange={(value) => wijzig({ betaalvoorkeur: value as Betaalvoorkeur })}
      />

      <Input
        labelText="Rekeningnummer"
        description="Bijvoorbeeld NL12BANK0123456789"
        showInfo
        className="flex w-full max-w-[288px] flex-col items-start gap-2"
        autoComplete="off"
        maxLength={22}
        value={state.iban}
        error={fouten.iban}
        onChange={(value) => wijzig({ iban: value })}
      />

      <Input
        labelText="Klantnaam, klantnummer of dossiernummer"
        required={false}
        description="Hiermee herken je de klant in je eigen administratie."
        className="flex w-full flex-col items-start gap-2"
        fieldWidth="lg"
        autoComplete="off"
        value={state.kenmerk}
        onChange={(value) => wijzig({ kenmerk: value })}
      />
    </BewindScherm>
  );
}
