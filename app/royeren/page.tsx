"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { Select } from "@/components/Select";
import { InputDate } from "@/components/InputDate";
import { InputFile } from "@/components/InputFile";
import { fromIsoDatum, toIsoDatum } from "@/lib/datum";
import { ROYEREN_STEPS, useRoyerenFunnel } from "./funnel-context";
import { ROYEREN_CARD_CLASS } from "./card";
import { BEWIJSSTUK_LABEL, REDENEN, bewijsstukBeschrijving } from "./opzegreden";

type Errors = { reden?: string; bestanden?: string; ingangsdatum?: string };

function vandaag() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Stap 1 van de "Royeren"-funnel, "Je opzegging" (Figma-bestand "Mutatie
 * funnels", pagina "-> Royeren", frames "Je opzegging leeg" 8387:2693 en de
 * "Je opzegging ingevuld / …"-varianten per reden, o.a. 8397:1516 "verkoop"). Auto-only: header "Opzeggen
 * Autoverzekering" met "ik kies zelf"-sticker en "Annuleren".
 *
 * Opbouw als de mutatie-funnel: `FunnelPageTemplate` zonder sidebar met een
 * vaste kaartbreedte van 784px (zoals Woonverzekeringen), `Select` (reden),
 * `InputFile` (alleen bij een reden die een bewijsstuk vraagt) en `InputDate`.
 *
 * Eigen keuzes (niet uit Figma): validatie gebeurt bij "Naar samenvatting";
 * de datum mag niet in het verleden liggen; foutteksten voor reden/datum zijn
 * hier gekozen (Figma tekent alleen de akkoord-fout op de volgende stap); het
 * bewijsstuk heeft geen bestandstype- of grootte-eis (Figma noemt er geen).
 */
export default function RoyerenPage() {
  const router = useRouter();
  const { state, setState, bestanden, setBestanden } = useRoyerenFunnel();
  const { reden, ingangsdatum } = state;
  const [errors, setErrors] = useState<Errors>({});

  const beschrijving = bewijsstukBeschrijving(reden);

  function handleNext() {
    const next: Errors = {};
    if (!reden) next.reden = "Maak een keuze";
    if (beschrijving && bestanden.length === 0) next.bestanden = "Je hebt geen bestand gekozen. Kies een bestand.";
    if (!ingangsdatum) next.ingangsdatum = "Vul een geldige datum in";
    else if (fromIsoDatum(ingangsdatum) < vandaag()) next.ingangsdatum = "Kies een datum die niet in het verleden ligt";
    setErrors(next);
    if (Object.keys(next).length === 0) router.push("/royeren/bevestigen");
  }

  return (
    <FunnelPageTemplate
      headerTitle="Opzeggen Autoverzekering"
      cancelButton
      cancelStyle="cross-after"
      onCancel={() => router.push("/")}
      ikzSticker
      steps={ROYEREN_STEPS}
      activeStep={1}
      stepAnimationKey="royeren"
      stepIndicatorClassName="hidden w-full items-start justify-center min-[900px]:flex min-[1200px]:px-10"
      cardClassName={ROYEREN_CARD_CLASS}
      navigation={<FormNavigation nextLabel="Naar samenvatting" onNext={handleNext} />}
    >
      <FunnelSection
        intro
        title="Je opzegging"
        description="Jammer dat je je autoverzekering wilt opzeggen. Heb je al een andere auto of ben je van plan er een te kopen? Neem dan contact met ons op om te kijken wat we voor je kunnen betekenen."
        showRequiredFieldsNote
      />

      <Select
        labelText="Waarom wil je je verzekering opzeggen?"
        options={REDENEN}
        value={reden}
        placeholder="Maak een keuze..."
        error={errors.reden}
        onChange={(value) => {
          setState({ ...state, reden: value });
          setErrors((current) => ({ ...current, reden: undefined, bestanden: undefined }));
          if (!bewijsstukBeschrijving(value)) setBestanden([]);
        }}
      />

      {beschrijving && (
        <InputFile
          labelText={BEWIJSSTUK_LABEL}
          required
          description={beschrijving}
          multiple
          defaultValue={bestanden}
          error={errors.bestanden}
          onChange={(files) => {
            setBestanden(files);
            setErrors((current) => ({ ...current, bestanden: undefined }));
          }}
        />
      )}

      <InputDate
        className="relative isolate flex w-full flex-col items-start gap-2"
        labelText="Per wanneer wil je je verzekering opzeggen? (dd-mm-jjjj)"
        showPickerButton
        value={ingangsdatum ? fromIsoDatum(ingangsdatum) : null}
        minDate={vandaag()}
        error={errors.ingangsdatum}
        onChange={(date) => {
          setState({ ...state, ingangsdatum: date ? toIsoDatum(date) : "" });
          setErrors((current) => ({ ...current, ingangsdatum: undefined }));
        }}
      />
    </FunnelPageTemplate>
  );
}
