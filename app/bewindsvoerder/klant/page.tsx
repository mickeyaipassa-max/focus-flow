"use client";

import { useRouter } from "next/navigation";
import { FieldsetAddress } from "@/components/FieldsetAddress";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelSection } from "@/components/FunnelSection";
import { Input } from "@/components/Input";
import { InputDate } from "@/components/InputDate";
import { RadioGroup } from "@/components/RadioGroup";
import { fromIsoDatum, toIsoDatum } from "@/lib/datum";
import { BewindScherm, Scheidingslijn, SectieTitel, useStap, VerplichteVelden } from "../delen";
import { ROUTES, type JaNee } from "../funnel-context";
import { isGeldig, valideerKlant } from "../validatie";

const JA_NEE = [
  { value: "ja", label: "Ja" },
  { value: "nee", label: "Nee" },
];

/** Stap 3, "Klant" (Figma frame "3 Klant"): gegevens van de cliënt en het verzoek (twee ja/nee-vragen). */
export default function KlantPage() {
  const router = useRouter();
  const { state, setState, fouten, setFouten, wijzig } = useStap();

  function handleNext() {
    const gevonden = valideerKlant(state);
    setFouten(gevonden);
    if (isGeldig(gevonden)) router.push(ROUTES.samenvatting);
  }

  return (
    <BewindScherm
      activeStep={3}
      terugLabel="Bewindgegevens"
      onTerug={() => router.push(ROUTES.bewindgegevens)}
      navigation={
        <FormNavigation previousStep previousLabel="Bewindgegevens" nextLabel="Naar samenvatting" onPrevious={() => router.push(ROUTES.bewindgegevens)} onNext={handleNext} />
      }
    >
      <FunnelSection intro title="Klant" showRequiredFieldsNote requiredFieldsNote={<VerplichteVelden />} />

      <SectieTitel>Gegevens</SectieTitel>

      <div className="flex w-full max-w-[480px] flex-col items-start gap-6">
        <div className="flex w-full flex-wrap items-end gap-x-2 gap-y-6">
          <Input
            labelText="Voornamen"
            description="Officiële voornamen zoals op ID"
            className="flex min-w-[min(312px,100%)] flex-1 flex-col items-start gap-2"
            autoComplete="off"
            value={state.klantVoornamen}
            error={fouten.klantVoornamen}
            onChange={(value) => wijzig({ klantVoornamen: value })}
          />
          <Input
            labelText="Tussenvoegsel"
            required={false}
            className="flex w-40 max-w-full flex-col items-start gap-2"
            autoComplete="off"
            value={state.klantTussenvoegsel}
            error={fouten.klantTussenvoegsel}
            onChange={(value) => wijzig({ klantTussenvoegsel: value })}
          />
        </div>
        <Input
          labelText="Achternaam"
          className="flex w-full flex-col items-start gap-2"
          autoComplete="off"
          value={state.klantAchternaam}
          error={fouten.klantAchternaam}
          onChange={(value) => wijzig({ klantAchternaam: value })}
        />
      </div>

      <InputDate
        className="relative isolate flex w-full max-w-[333px] flex-col items-start gap-2"
        labelText="Geboortedatum"
        showPickerButton
        placeholder="dd-mm-jjjj"
        value={state.klantGeboortedatum ? fromIsoDatum(state.klantGeboortedatum) : null}
        error={fouten.klantGeboortedatum}
        onTextChange={(tekst) => setState({ klantGeboortedatumTekst: tekst })}
        onChange={(date) => wijzig({ klantGeboortedatum: date ? toIsoDatum(date) : "" })}
      />

      <FieldsetAddress
        className="flex w-full max-w-[400px] flex-col items-start gap-4"
        value={{ postalCode: state.klantPostcode, houseNumber: state.klantHuisnummer, addition: state.klantToevoeging }}
        errors={{ postalCode: fouten.klantPostcode, houseNumber: fouten.klantHuisnummer }}
        onChange={(value) =>
          wijzig({ klantPostcode: value.postalCode, klantHuisnummer: value.houseNumber, klantToevoeging: value.addition })
        }
      />

      <Scheidingslijn />
      <SectieTitel>Verzoek</SectieTitel>

      <RadioGroup
        labelText="Overzicht betalingsachterstand"
        horizontal
        options={JA_NEE}
        value={state.betalingsachterstand}
        error={fouten.betalingsachterstand}
        onChange={(value) => wijzig({ betalingsachterstand: value as JaNee })}
      />

      <RadioGroup
        labelText="Polisblad ontvangen"
        horizontal
        options={JA_NEE}
        value={state.polisblad}
        error={fouten.polisblad}
        onChange={(value) => wijzig({ polisblad: value as JaNee })}
      />
    </BewindScherm>
  );
}
