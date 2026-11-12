"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/Alert";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { Icon } from "@/components/Icon";
import { InputDate } from "@/components/InputDate";
import { RadioCardBottomGroup } from "@/components/RadioCardBottom";
import { RadioGroup } from "@/components/RadioGroup";
import { Validation } from "@/components/Validation";
import {
  AANKOOPWAARDE_UITLEG,
  AUTO_STEPS,
  DEKKING_OPTIONS,
  DEKKING_PRIJS_CENTEN,
  DEKKING_TITEL,
  EIGEN_RISICO_OPTIONS,
  EIGEN_RISICO_UITLEG,
  EXTRA_DEKKINGEN,
  NIEUWWAARDE_UITLEG,
  formatDatum,
  plusJaren,
  type DekkingKeuze,
  type ExtraKeuze,
} from "./data";
import { DekkingDialog, ExtraDialog } from "./info-dialogs";
import { PremieKassabon } from "./premie-kassabon";

const JA_NEE = [
  { value: "ja", label: "Ja" },
  { value: "nee", label: "Nee" },
];

const MEDIUM = { fontFamily: "var(--font-avenir-medium)" } as const;

/**
 * Stap 2 van 5 ("Jouw dekking") van de Autoverzekering-funnel, naar Figma "Untitled" (6pTuBCHupEW7rq3Ir4mJow),
 * sectie "JOUW DEKKING" (node 135:22205): de staten Idle, WA+, aankoopwaarde-/nieuwwaarderegeling, de
 * validaties en de "kenteken nog niet bekend"-flow, plus de zwevende Receipt Bar met de Receipt Dialog.
 *
 * Twee staten die in Figma van de rest van de funnel afhangen, zijn hier schakelaars in de URL (deze pagina
 * staat los van de /auto-funnel):
 * - `?auto=nieuw`: auto van maximaal 1 jaar oud, dus de nieuwwaarderegeling i.p.v. de aankoopwaarderegeling
 *   (Figma-annotatie "Nieuwwaarderegeling").
 * - `?kenteken=onbekend`: stap 1 is zonder kenteken doorlopen, dus de waarschuwing "Je kenteken is nog niet bekend".
 *
 * Eigen risico en de beide regelingen verschijnen bij WA + Casco (beperkt en allrisk), of bij een poging door
 * te gaan zonder keuze (Figma's validatiestaat toont ze dan allemaal). "Extra's boven € 1000" alleen bij
 * allrisk ("Indien gebruiker kiest voor WA + Casco Allrisk wordt deze optie getoond").
 */
export function JouwDekkingStap() {
  const router = useRouter();

  const [nieuweAuto, setNieuweAuto] = useState(false);
  const [kentekenOnbekend, setKentekenOnbekend] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNieuweAuto(params.get("auto") === "nieuw");
    setKentekenOnbekend(params.get("kenteken") === "onbekend");
  }, []);

  const [dekking, setDekking] = useState<DekkingKeuze | "">("");
  const [eigenRisico, setEigenRisico] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [regeling, setRegeling] = useState("");
  const [aankoopdatum, setAankoopdatum] = useState<Date | null>(null);
  const [aankoopdatumTekst, setAankoopdatumTekst] = useState("");
  const [jaren, setJaren] = useState("");
  const [probeerdeDoor, setProbeerdeDoor] = useState(false);

  const [dekkingInfo, setDekkingInfo] = useState<DekkingKeuze | null>(null);
  const [extraInfo, setExtraInfo] = useState<ExtraKeuze | null>(null);

  const isCasco = dekking === "wa-casco-beperkt" || dekking === "wa-casco-allrisk";
  const toonCascoVragen = isCasco || (probeerdeDoor && dekking === "");
  const regelingNaam = nieuweAuto ? "nieuwwaarderegeling" : "aankoopwaarderegeling";
  const extraOpties = EXTRA_DEKKINGEN.filter((extra) => extra.value !== "extras-boven-1000" || dekking === "wa-casco-allrisk");

  function kiesDekking(waarde: string) {
    setDekking(waarde as DekkingKeuze);
    if (waarde !== "wa-casco-allrisk") setExtras((huidig) => huidig.filter((extra) => extra !== "extras-boven-1000"));
  }

  const jarenOpties = nieuweAuto
    ? [
        { value: "2", label: "2 jaar (tot [datum])" },
        { value: "3", label: "3 jaar (tot [datum])" },
      ]
    : aankoopdatum
      ? [
          { value: "2", label: `${formatDatum(plusJaren(aankoopdatum, 2))} (2 jaar na aankoopdatum)` },
          { value: "3", label: `${formatDatum(plusJaren(aankoopdatum, 3))} (3 jaar na aankoopdatum)` },
        ]
      : [];

  const fouten = {
    dekking: probeerdeDoor && dekking === "",
    eigenRisico: probeerdeDoor && (toonCascoVragen && eigenRisico === ""),
    regeling: probeerdeDoor && toonCascoVragen && regeling === "",
    datum: probeerdeDoor && toonCascoVragen && regeling === "ja" && !nieuweAuto && !aankoopdatum,
    jaren: probeerdeDoor && toonCascoVragen && regeling === "ja" && jaren === "" && (nieuweAuto || Boolean(aankoopdatum)),
  };

  function volgende() {
    // Toont de validaties. "Naar jouw gegevens" (stap 3) is nog niet gebouwd, dus ook bij een geldige keuze
    // blijft de pagina staan i.p.v. door te verwijzen naar een route die niet bestaat.
    setProbeerdeDoor(true);
  }

  const totaalCenten =
    dekking === ""
      ? null
      : DEKKING_PRIJS_CENTEN[dekking] + EXTRA_DEKKINGEN.filter((extra) => extras.includes(extra.value)).reduce((som, extra) => som + extra.centen, 0);

  return (
    <>
      <FunnelPageTemplate
        headerTitle="Autoverzekering"
        ikzSticker
        steps={AUTO_STEPS}
        activeStep={2}
        navigation={
          <FormNavigation
            previousStep
            previousLabel="Jouw situatie"
            nextLabel="Naar jouw gegevens"
            saveForLater
            onPrevious={() => router.push("/auto")}
            onNext={volgende}
          />
        }
      >
        <button
          type="button"
          onClick={() => router.push("/auto")}
          className="-mb-4 flex items-center gap-2 rounded-[3px] text-base text-black leading-[1.5]"
          style={MEDIUM}
        >
          <Icon name="arrow-left" size="sm" />
          <span className="underline">Jouw situatie</span>
        </button>

        <FunnelSection intro title="Jouw dekking" showRequiredFieldsNote />

        <FunnelSection title="Stel je autoverzekering samen">
          <div className="flex w-full flex-col items-start gap-6">
            <RadioCardBottomGroup
              labelText="Kies je basisdekking"
              options={DEKKING_OPTIONS}
              contentTopClassName="mt-2"
              value={dekking}
              onChange={kiesDekking}
              onMoreInfoClick={(value) => setDekkingInfo(value as DekkingKeuze)}
              error={fouten.dekking ? "Je hebt niks gekozen. Kies je basisdekking." : undefined}
            />

            {toonCascoVragen && (
              <RadioCardBottomGroup
                labelText="Kies je eigen risico"
                description={EIGEN_RISICO_UITLEG}
                variant="compact"
                options={EIGEN_RISICO_OPTIONS}
                contentTopClassName="mt-2"
                value={eigenRisico}
                onChange={setEigenRisico}
                error={fouten.eigenRisico ? "Je hebt niks gekozen. Kies je eigen risico." : undefined}
              />
            )}

            <CheckboxCardControlLeftGroup
              labelText="Welke aanvullende dekkingen wil je?"
              className="flex w-full max-w-[800px] flex-col items-start gap-2"
              options={extraOpties}
              values={extras}
              onChange={setExtras}
              onMoreInfoClick={(value) => setExtraInfo(value as ExtraKeuze)}
            />
          </div>
        </FunnelSection>

        {toonCascoVragen && (
          <FunnelSection
            showDividerAbove
            title={nieuweAuto ? "Nieuwwaarderegeling" : "Aankoopwaarderegeling"}
            description={nieuweAuto ? NIEUWWAARDE_UITLEG : AANKOOPWAARDE_UITLEG}
          >
            <div className="flex w-full flex-col items-start gap-6">
              <RadioGroup
                labelText={`Wil je gebruik maken van de ${regelingNaam}?`}
                horizontal
                options={JA_NEE}
                value={regeling}
                onChange={(waarde) => {
                  setRegeling(waarde);
                  setJaren("");
                }}
                error={fouten.regeling ? `Je hebt niks gekozen. Kies of je gebruik wil maken van de ${regelingNaam}.` : undefined}
              />

              {regeling === "ja" && !nieuweAuto && (
                <div className="w-fit min-w-[360px] max-w-full">
                  <InputDate
                    labelText="Wanneer heb je de auto gekocht? (dd-mm-jjjj)"
                    showPickerButton
                    maxDate={new Date()}
                    value={aankoopdatum}
                    onChange={(datum) => {
                      setAankoopdatum(datum);
                      setJaren("");
                    }}
                    onTextChange={setAankoopdatumTekst}
                    error={fouten.datum ? (aankoopdatumTekst ? "Vul een geldige datum in (dd-mm-jjjj)." : "Vul de datum in waarop je de auto hebt gekocht.") : undefined}
                  />
                </div>
              )}

              {regeling === "ja" && jarenOpties.length > 0 && (
                <RadioGroup
                  labelText={`Hoeveel jaar wil je deze ${regelingNaam}?`}
                  options={jarenOpties}
                  value={jaren}
                  onChange={setJaren}
                  error={fouten.jaren ? `Je hebt niks gekozen. Kies hoeveel jaar je de ${regelingNaam} wilt.` : undefined}
                />
              )}
            </div>
          </FunnelSection>
        )}

        {kentekenOnbekend && (
          <div className="flex w-full flex-col items-start gap-2">
            <Alert
              type="warning"
              closable={false}
              title="Je kenteken is nog niet bekend"
              description={
                <>
                  Om een autoverzekering aan te vragen hebben wij een kenteken nodig.{" "}
                  <a href="/auto" className="underline">
                    Ga terug naar stap 1
                  </a>{" "}
                  en vul het kenteken in. Is het kenteken nog niet bekend? Bewaar dan je premieberekening voor later via de knop ‘Bewaar voor later’.
                </>
              }
              className="flex w-full max-w-[704px] items-start gap-2 rounded-[3px] border border-[#eda50f] bg-[#fff8e3] p-[7px]"
            />
            {probeerdeDoor && <Validation message="Vul eerst je kenteken in bij stap 1. Je dekkingskeuze blijft bewaard." />}
          </div>
        )}
      </FunnelPageTemplate>

      <PremieKassabon
        totaalCenten={totaalCenten}
        dekkingTitel={dekking ? DEKKING_TITEL[dekking] : ""}
        dekkingCenten={dekking ? DEKKING_PRIJS_CENTEN[dekking] : 0}
        eigenRisico={eigenRisico}
        extras={EXTRA_DEKKINGEN.filter((extra) => extras.includes(extra.value)).map((extra) => ({ titel: extra.title, centen: extra.centen }))}
      />
      <DekkingDialog keuze={dekkingInfo} onClose={() => setDekkingInfo(null)} />
      <ExtraDialog keuze={extraInfo} onClose={() => setExtraInfo(null)} />
    </>
  );
}
