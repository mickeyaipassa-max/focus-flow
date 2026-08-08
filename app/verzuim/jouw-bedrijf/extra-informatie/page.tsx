"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RadioGroup } from "@/components/RadioGroup";
import { InputPercentage } from "@/components/InputPercentage";
import { Alert } from "@/components/Alert";
import { List } from "@/components/List";
import { useVerzuimFunnel } from "../../funnel-context";

const VERZUIM_STEPS = ["Jouw bedrijf", "Jouw dekking", "Aanvullende gegevens", "Laatste vragen", "Samenvatting"];

type Duration = "minder-dan-1-jaar" | "1-2-jaar" | "2-3-jaar" | "langer-dan-3-jaar";

const DURATION_OPTIONS: { value: Duration; label: string }[] = [
  { value: "minder-dan-1-jaar", label: "Minder dan 1 jaar" },
  { value: "1-2-jaar", label: "1-2 jaar" },
  { value: "2-3-jaar", label: "2-3 jaar" },
  { value: "langer-dan-3-jaar", label: "Langer dan 3 jaar" },
];

/**
 * Aantal gevraagde verzuimpercentage-jaren per diensttijd-keuze. Niet als
 * expliciete bedrijfsregel bevestigd in Figma (geen zichtbare formule), maar
 * afgeleid uit de 2 bevestigde voorbeeldschermen: "1 jaar verzuimpercentage"
 * (1 veld) en "2 jaar verzuimpercentage" (2 velden). "Minder dan 1 jaar" →
 * 0 (nog geen verzuimhistorie mogelijk); "Langer dan 3 jaar" → 3, aansluitend
 * op de eerder in stap 1/3 genoemde "verzuimpercentages van de afgelopen 3
 * jaar" en de bovengrens van de radiokeuzes zelf.
 */
const YEARS_BY_DURATION: Record<Duration, number> = {
  "minder-dan-1-jaar": 0,
  "1-2-jaar": 1,
  "2-3-jaar": 2,
  "langer-dan-3-jaar": 3,
};

const PERCENTAGE_DESCRIPTION = "Vraag deze gegevens op bij je salarisadministratie of je accountant.";

function emptyPercentages(count: number): string[] {
  return Array.from({ length: count }, () => "");
}

/**
 * Sub-stap 3 van 3 ("Jouw bedrijf 3/3", Figma node 10938:29591 + de
 * gerelateerde staten 10938:29528/29557/11264:43756). Zelfde aanpak als
 * 1/3 en 2/3: één stateful pagina, reactief op de radiokeuze i.p.v. een
 * aparte bevestigingsactie. Het aantal verzuimpercentage-velden past zich
 * automatisch aan de gekozen diensttijd aan, en de jaartallen worden
 * dynamisch berekend (huidig jaar - 1/-2/-3) i.p.v. Figma's statische
 * "2025"/"2024"-voorbeelden hard te coderen.
 *
 * Dit is de laatste sub-stap van "Jouw bedrijf" — "Naar jouw dekking"
 * verwijst naar de eerstvolgende bestaande funnelstap (`VERZUIM_STEPS[1]`);
 * die route bestaat nog niet in de codebase, dus dit blijft (net als bij
 * 1/3 en 2/3) een `console.log`-placeholder in plaats van een verzonnen
 * nieuwe route.
 */
export default function JouwBedrijfExtraInformatiePage() {
  const router = useRouter();
  const funnel = useVerzuimFunnel();

  const [duration, setDuration] = useState<Duration | "">("");
  const [durationError, setDurationError] = useState<string | undefined>(undefined);
  const [percentages, setPercentages] = useState<string[]>([]);
  const [percentageErrors, setPercentageErrors] = useState<(string | undefined)[]>([]);

  // Validatie-guard tegen het overslaan van stap 2/3: zonder afgeronde
  // medewerkergegevens (bv. rechtstreekse URL-toegang) hoort de gebruiker
  // eerst bij "Jouw bedrijf" medewerkers te beginnen. Wacht op `isHydrated`
  // zodat een legitieme, herstelde sessie niet onterecht wordt teruggestuurd.
  useEffect(() => {
    if (!funnel.isHydrated) return;
    if (!funnel.state.employees) router.replace("/verzuim/jouw-bedrijf/medewerkers");
  }, [funnel.isHydrated, funnel.state.employees, router]);

  const yearsNeeded = duration ? YEARS_BY_DURATION[duration] : null;

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: yearsNeeded ?? 0 }, (_, index) => currentYear - 1 - index);
  }, [yearsNeeded]);

  // Herstel eerder ingevulde gegevens (refresh, of terug-dan-weer-vooruit
  // navigeren) — precies één keer, zodra de state uit sessionStorage is
  // opgehaald. `isRestoringRef` voorkomt dat het herstellen van `duration`
  // de reset-effect hieronder triggert en de zojuist herstelde percentages
  // weer leegmaakt.
  const hasRestoredRef = useRef(false);
  const isRestoringRef = useRef(false);
  useEffect(() => {
    if (!funnel.isHydrated || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const saved = funnel.state.extraInfo;
    if (!saved) return;
    isRestoringRef.current = true;
    setDuration(saved.duration as Duration);
    setPercentages(saved.percentages);
  }, [funnel.isHydrated, funnel.state.extraInfo]);

  // Aantal velden volgt automatisch de diensttijd-keuze — geen aparte
  // bevestigingsactie nodig, zelfde reactieve patroon als stap 1/3 en 2/3.
  useEffect(() => {
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }
    setPercentages(emptyPercentages(yearsNeeded ?? 0));
    setPercentageErrors([]);
    setDurationError(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  function updatePercentage(index: number, value: string) {
    setPercentages((current) => current.map((v, i) => (i === index ? value : v)));
    setPercentageErrors((current) => current.map((e, i) => (i === index ? undefined : e)));
  }

  function handleNext() {
    let hasError = false;

    if (!duration) {
      setDurationError("Je hebt geen keuze gemaakt. Maak een keuze in dienstverband.");
      hasError = true;
    } else {
      setDurationError(undefined);
    }

    if (yearsNeeded && yearsNeeded > 0) {
      const errors = percentages.map((value, index) =>
        value.trim() ? undefined : `Je vulde nog niets in. Vul het verzuimpercentage in voor ${years[index]}.`,
      );
      setPercentageErrors(errors);
      if (errors.some(Boolean)) hasError = true;
    }

    if (hasError) return;

    funnel.setExtraInfoStep({ duration, percentages });

    // Echte navigatie naar "Jouw dekking" (de volgende bestaande funnelstap)
    // bestaat nog niet in de codebase — bewust niet verzonnen, blijft een
    // `console.log`-placeholder totdat die stap daadwerkelijk gebouwd wordt.
    console.log("naar jouw dekking", { duration, percentages });
  }

  return (
    <FunnelPageTemplate
      headerTitle="Verzuimverzekering"
      chatButton={false}
      steps={VERZUIM_STEPS}
      activeStep={1}
      sidebar={
        <div className="flex w-full flex-col items-start gap-4">
          <h2 className="w-full text-black text-2xl leading-[1.3]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            Waarom onze verzekering
          </h2>
          <List
            icon="check"
            items={[
              { text: "Hulp bij verkorten van verzuim" },
              { text: "Eerste 2 jaar verzuim verzekerd" },
              { text: "Wij zorgen voor een goede aanpak bij elke ziekmelding" },
            ]}
          />
        </div>
      }
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Jouw bedrijf"
          nextLabel="Naar jouw dekking"
          onPrevious={() => router.push("/verzuim/jouw-bedrijf/medewerkers")}
          onNext={handleNext}
        />
      }
    >
      <FunnelSection intro title="Jouw bedrijf" showRequiredFieldsNote />

      <ProgressIndicator current={3} total={3} />

      <FunnelSection title="Extra informatie">
        <RadioGroup
          labelText="Hoe lang heb je medewerkers in dienst?"
          options={DURATION_OPTIONS}
          value={duration}
          onChange={(value) => setDuration(value as Duration)}
          error={durationError}
          name="duration"
        />

        {duration === "minder-dan-1-jaar" && (
          <Alert
            type="info"
            showTitle={false}
            description="Omdat je minder dan 1 jaar medewerkers in dienst hebt, gebruiken we het branchegemiddelde voor het verzuimpercentage."
            closable={false}
          />
        )}

        {yearsNeeded === 1 && (
          <InputPercentage
            id="percentage-0"
            labelText={`Wat was het verzuimpercentage in ${years[0]}?`}
            description={PERCENTAGE_DESCRIPTION}
            value={percentages[0] ?? ""}
            onChange={(value) => updatePercentage(0, value)}
            error={percentageErrors[0]}
          />
        )}

        {yearsNeeded !== null && yearsNeeded >= 2 && (
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full flex-col items-start gap-1">
              <div className="flex items-center gap-1 text-lg leading-[1.5]">
                <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  Wat was het verzuimpercentage in onderstaande jaren
                </span>
                <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
                  *
                </span>
              </div>
              <p className="w-full text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                {PERCENTAGE_DESCRIPTION}
              </p>
            </div>

            {years.map((year, index) => (
              <InputPercentage
                key={year}
                id={`percentage-${index}`}
                labelText={String(year)}
                value={percentages[index] ?? ""}
                onChange={(value) => updatePercentage(index, value)}
                error={percentageErrors[index]}
              />
            ))}
          </div>
        )}
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
