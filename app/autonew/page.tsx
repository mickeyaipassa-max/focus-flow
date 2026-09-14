"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
import { RadioCardBottomCarousel, type CarouselCardOption } from "@/components/RadioCardBottomCarousel";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";

const AUTO_STEPS = ["Jouw situatie", "Jouw dekking", "Jouw gegevens", "Laatste vragen", "Samenvatting"];

type DekkingKeuze = "wa" | "wa-casco-beperkt" | "wa-casco-allrisk";

const DEKKING_OPTIONS: RadioCardBottomOption[] = [
  {
    value: "wa",
    title: "WA",
    description: "",
    price: "68,76",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: false },
      { text: "Ruitschade", included: false },
      { text: "Schade door aanrijding en andere schades", included: false },
    ],
  },
  {
    value: "wa-casco-beperkt",
    title: "WA + Casco beperkt",
    description: "",
    price: "75,65",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Schade door aanrijding en andere schades", included: false },
    ],
  },
  {
    value: "wa-casco-allrisk",
    title: "WA + Casco allrisk",
    description: "",
    price: "116,77",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Schade door aanrijding en andere schades", included: true },
    ],
  },
];

/** Zelfde inhoud als `DEKKING_OPTIONS`, alleen zonder het (hier toch al lege) `description`-veld dat de carrousel-variant niet kent. */
const CAROUSEL_OPTIONS: CarouselCardOption[] = DEKKING_OPTIONS.map(({ value, title, price, features, highlightLines }) => ({
  value,
  title,
  price,
  features,
  highlightLines,
}));

const AANVULLENDE_DEKKINGEN = [
  {
    value: "schade-inzittenden",
    title: "Schade inzittenden",
    description: "Passagiers en bestuurder verzekerd voor letsel en schade na een ongeval.",
    price: "5,22",
  },
  {
    value: "rechtsbijstand",
    title: "Rechtsbijstand motorrijtuigen",
    description: "Juridische hulp bij conflicten in het verkeer met je auto.",
    price: "5,28",
  },
  {
    value: "pechhulp",
    title: "Pechhulp",
    description: "De a.s.r. Alarmcentrale staat voor je klaar als je niet verder kan rijden door pech.",
    price: "6,16",
  },
];

/**
 * Losstaande demo van "Jouw dekking" (stap 2 van 5) van de Autoverzekering-
 * funnel — Figma node 2383:21799 ("Auto/JD/Idle", bestand
 * "Untitled"/q7IRrH1ahDr1P5KSWCLlBA), de canonieke standaardstaat op een
 * groot QA/spec-canvas met tientallen statusvarianten van dezelfde stap
 * (WA/WA+ geselecteerd, uitgeklapte varianten, een "multi-entity"-flow voor
 * meerdere auto's) — die overige varianten zijn hier bewust buiten scope.
 *
 * Op verzoek een losstaande pagina op `/autonew` i.p.v. een echte stap
 * binnen de Auto-funnel — dus geen `AutoFunnelProvider`/`useAutoFunnel`
 * (die dekt alleen `/auto/*`), lokale `useState` in plaats daarvan, zelfde
 * precedent als de `/horizontaalgedrag`-carrouseldemo. "Terug naar jouw
 * situatie" linkt nog wel naar de bestaande, echte stap 1 (`/auto`); "Naar
 * jouw gegevens" heeft geen bestaande bestemming (nog niet gebouwd).
 *
 * Volledig opgebouwd uit bestaande componenten: `RadioCardBottomGroup`
 * (dezelfde WA/WA+Casco beperkt/WA+Casco allrisk-kaarten als eerder al
 * bevestigd op de horizontaalgedrag-carrouseldemo — featurelijst hier niet
 * opnieuw via MCP gecontroleerd, 1-op-1 hergebruikt) en
 * `CheckboxCardControlLeftGroup` (3 aanvullende dekkingen, zelfde patroon
 * als mutatie's "Glas"-checkbox).
 *
 * `RadioCardBottomOption`/`RadioCardBottomCarousel` ondersteunen een
 * optionele `highlightLines`-prop voor de gele "Meest gekozen"-badge (op
 * de WA-kaart in Figma) — op verzoek hier niet gebruikt, dus geen enkele
 * kaart toont die badge.
 *
 * Geen `description` onder de kaarttitels: die laag stond in Figma op
 * hidden, net als bij de eerdere carrousel-kaarten.
 *
 * Pechhulp's icoon was in Figma zelf een onopgeloste "Swap me"-placeholder
 * (roze stippellijnkader) — net als `CheckboxCardControlLeft`'s eigen
 * documentatie al aangeeft voor zo'n geval, hier dus geen icoon verzonnen
 * (component heeft er ook geen verplichte prop voor).
 *
 * Geen kaart staat standaard geselecteerd — bevestigd via MCP: alle 3
 * "Radio Container"-instanties tonen in deze "Idle"-staat dezelfde
 * niet-geselecteerde grijze stijl. `RadioCardBottomGroup` kreeg daarom ook
 * een nieuwe optionele `error`-prop (zelfde patroon als `RadioGroup`'s
 * eigen `error`), zodat "Naar jouw gegevens" een keuze afdwingt i.p.v.
 * zonder selectie door te laten.
 *
 * Form Navigation-knoptekst ("Terug naar jouw situatie" / "Naar jouw
 * gegevens") was in Figma zelf niet ingevuld (letterlijk "Button") — hier
 * gekozen naar analogie van stap 1's eigen "Naar jouw dekking"-conventie.
 *
 * Op verzoek toont de dekkingkeuze nu twee volledige, los gerenderde
 * varianten naast elkaar in de DOM, geschakeld via responsive classes
 * i.p.v. JS-detectie (zelfde precedent als `StepIndicator`'s eigen
 * mobiel/desktop-instances in `FunnelPageTemplate`): onder 600px de
 * `RadioCardBottomCarousel` uit de `/horizontaalgedrag`-demo, vanaf 600px
 * (`RadioCardBottomGroup`'s eigen bestaande `min-[600px]:flex-row`-omslag)
 * de gewone naast-elkaar-groep. Beide delen dezelfde `dekking`/`error`-state,
 * dus een selectie blijft behouden als het scherm van grootte verandert.
 * De rest van de pagina (kop, stappenbalk, aanvullende dekkingen,
 * navigatie) is ongewijzigd.
 */
export default function AutoNewPage() {
  const router = useRouter();
  const [dekking, setDekking] = useState<DekkingKeuze | "">("");
  const [dekkingError, setDekkingError] = useState(false);
  const [aanvullendeDekkingen, setAanvullendeDekkingen] = useState<string[]>([]);

  function handleNext() {
    if (!dekking) {
      setDekkingError(true);
      return;
    }
    router.push("/auto/jouw-gegevens");
  }

  return (
    <FunnelPageTemplate
      headerTitle="Autoverzekering"
      ikzSticker
      steps={AUTO_STEPS}
      activeStep={2}
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Terug naar jouw situatie"
          nextLabel="Naar jouw gegevens"
          onPrevious={() => router.push("/auto")}
          onNext={handleNext}
        />
      }
    >
      <FunnelSection intro title="Jouw dekking" showRequiredFieldsNote />

      <FunnelSection title="Stel je autoverzekering samen">
        <div className="min-[600px]:hidden w-full">
          <RadioCardBottomCarousel
            labelText="Kies je basisdekking"
            options={CAROUSEL_OPTIONS}
            value={dekking}
            onChange={(value) => {
              setDekking(value as DekkingKeuze);
              setDekkingError(false);
            }}
            onMoreInfoClick={() => {}}
            error={dekkingError ? "Kies een dekking" : undefined}
          />
        </div>

        <div className="hidden min-[600px]:block w-full">
          <RadioCardBottomGroup
            labelText="Kies je basisdekking"
            options={DEKKING_OPTIONS}
            value={dekking}
            onChange={(value) => {
              setDekking(value as DekkingKeuze);
              setDekkingError(false);
            }}
            onMoreInfoClick={() => {}}
            error={dekkingError ? "Kies een dekking" : undefined}
          />
        </div>

        <CheckboxCardControlLeftGroup
          labelText="Welke aanvullende dekkingen wil je?"
          options={AANVULLENDE_DEKKINGEN}
          values={aanvullendeDekkingen}
          onChange={setAanvullendeDekkingen}
          onMoreInfoClick={() => {}}
        />
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
