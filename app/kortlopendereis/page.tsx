"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
import { CheckboxCardControlLeftGroup, type CheckboxCardOption } from "@/components/CheckboxCardControlLeft";
import { Alert } from "@/components/Alert";
import { ReceiptBar } from "@/components/ReceiptBar";
import { Icon } from "@/components/Icon";

const REIS_STEPS = ["Jouw situatie", "Jouw dekking", "Jouw gegevens", "Laatste vragen", "Samenvatting"];

type DekkingKeuze = "basis" | "comfort" | "optimaal";

const BASISDEKKING_OPTIONS: RadioCardBottomOption[] = [
  {
    value: "basis",
    title: "Basis",
    description: "",
    price: "30,36",
    priceFrom: true,
    features: [
      { text: "Personenhulp in noodsituaties", included: true },
      { text: "Bagage tot € 1.000", included: false, details: ["€ 100 eigen risico", "Als extra dekking te kiezen"] },
      { text: "Geld tot € 500", included: false, details: ["Als extra dekking te kiezen"] },
      { text: "Geneeskundige kosten", included: false, details: ["Als extra dekking te kiezen"] },
      { text: "Reisrechtsbijstand", included: false, details: ["Als extra dekking te kiezen"] },
    ],
  },
  {
    value: "comfort",
    title: "Comfort",
    description: "",
    price: "34,16",
    priceFrom: true,
    features: [
      { text: "Personenhulp in noodsituaties", included: true },
      { text: "Bagage tot € 3.000", included: false, details: ["€ 50 eigen risico", "Als extra dekking te kiezen"] },
      { text: "Geld tot € 500", included: false, details: ["Als extra dekking te kiezen"] },
      { text: "Geneeskundige kosten", included: false, details: ["Als extra dekking te kiezen"] },
      { text: "Reisrechtsbijstand", included: false, details: ["Als extra dekking te kiezen"] },
    ],
  },
  {
    value: "optimaal",
    title: "Optimaal",
    description: "",
    price: "48,04",
    priceFrom: true,
    features: [
      { text: "Personenhulp in noodsituaties", included: true },
      { text: "Bagage tot € 5.000", included: true, details: ["Geen eigen risico", "Inbegrepen"] },
      { text: "Geld tot € 500", included: true, details: ["Inbegrepen"] },
      { text: "Geneeskundige kosten", included: true, details: ["Inbegrepen"] },
      { text: "Reisrechtsbijstand", included: true, details: ["Inbegrepen"] },
    ],
  },
];

/**
 * De "Bagage"-aanvullende dekking is een upgrade naar de bagagedekking van
 * de EERSTVOLGENDE hogere basisdekking — bevestigd via mcp op zowel de
 * Basis- als de Comfort-geselecteerde staat (Basis toont daar "Bagage tot
 * € 3000"/€50 eigen risico = Comfort's eigen bagagespec; Comfort toont
 * "Bagage tot € 5000"/geen eigen risico = Optimaal's spec). Bij Optimaal is
 * er geen hogere tier meer — dat scherm is niet apart bevestigd via mcp,
 * dus dit is een aanname: de upgrade-optie vervalt dan simpelweg (Optimaal
 * heeft de bagagedekking al standaard inbegrepen).
 */
function getBagageUpgrade(dekking: DekkingKeuze): CheckboxCardOption | null {
  if (dekking === "basis") {
    return { value: "bagage", title: "Bagage tot € 3000", description: "Voor deze dekking geldt een eigen risico van € 50.", price: "2,00" };
  }
  if (dekking === "comfort") {
    return { value: "bagage", title: "Bagage tot € 5000", description: "Voor deze dekking geldt geen eigen risico.", price: "2,00" };
  }
  return null;
}

/**
 * "Extra sportuitrusting" is in Figma alleen aan te vinken zodra "Bagage"
 * is aangevinkt (getoond als een blauw info-blokje i.p.v. een checkbox
 * zolang dat niet zo is). Bij Optimaal bestaat de "Bagage"-upgrade niet
 * (zie hierboven) — omdat Optimaal de bagagedekking al standaard heeft,
 * is aan die voorwaarde dan impliciet al voldaan.
 */
function getAanvullendeDekkingenOptions(dekking: DekkingKeuze, bagageChecked: boolean): CheckboxCardOption[] {
  const bagageSatisfied = dekking === "optimaal" || bagageChecked;
  const bagage = getBagageUpgrade(dekking);

  const options: CheckboxCardOption[] = [];
  if (bagage) options.push(bagage);
  options.push(
    {
      value: "sportuitrusting",
      title: "Extra sportuitrusting",
      description: "Extra vergoeding voor je sportuitrusting tot € 2.500.",
      price: "1,20",
      disabledMessage: bagageSatisfied ? undefined : "Kan alleen worden meeverzekerd als dekking Bagage is afgesloten",
    },
    { value: "geld", title: "Geld", description: "Geld en cheques tot € 500 meeverzekerd.", price: "4,00" },
    { value: "geneeskundige-kosten", title: "Geneeskundige kosten", description: "Vergoeding voor spoedeisende medische hulp.", price: "4,00" },
    { value: "reisrechtsbijstand", title: "Reisrechtsbijstand", description: "Tijdens je reis verzekerd voor rechtsbijstand door de juristen van DAS.", price: "1,20" },
    { value: "ongevallen", title: "Ongevallen", description: "Eenmalige uitkering bij invaliditeit of overlijden door een ongeval.", price: "1,20" },
    { value: "wintersport", title: "Skiën en snowboarden", description: "Ook verzekerd als je gaat wintersporten.", price: "8,00" },
    { value: "vervoermiddel-hulp", title: "Hulp en huur vervoermiddel", description: "Verzekerd bij uitval van je vervoermiddel of bestuurder.", price: "17,50" },
  );
  return options;
}

function parseEuro(value: string): number {
  return Number.parseFloat(value.replace(",", "."));
}

function formatEuro(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

/**
 * Losstaande prototype-pagina voor de Kortlopende Reisverzekering-funnel —
 * Figma node 2416:2956 ("JOUW DEKKING", bestand "Untitled"/
 * q7IRrH1ahDr1P5KSWCLlBA), een ander product dan de bestaande Auto-funnel.
 * Op verzoek alleen de "Jouw dekking"-stap; de overige 4 stappen bestaan
 * niet, dus lokale `useState` i.p.v. een eigen FunnelProvider (zelfde
 * precedent als `/autonew`/`/horizontaalgedrag`).
 *
 * Nieuw t.o.v. bestaande funnels, hier toegevoegd als uitbreidingen op
 * bestaande componenten i.p.v. losse eenmalige opmaak:
 * - `RadioCardBottomFeature.details` — meerdere regels per feature-item
 *   (bv. "€ 100 eigen risico" / "Als extra dekking te kiezen").
 * - `RadioCardBottomOption.priceFrom` — toont "vanaf" boven de prijs.
 * - `CheckboxCardOption.disabledMessage` — toont een info-blokje i.p.v. een
 *   klikbare checkbox (hier: "Extra sportuitrusting" zolang "Bagage" niet
 *   is aangevinkt).
 * - `FormNavigation`'s `saveForLater` — de "Bewaar voor later"-link.
 *
 * De "← Jouw situatie"-link bovenaan (bevestigd via mcp, zelf een "Button"-
 * instance) is hier een lokaal, pagina-eigen element i.p.v. een nieuwe
 * `FunnelPageTemplate`-prop: dit is de EERSTE keer dat dit patroon
 * voorkomt, dus bewust niet vooruitgelopen op hergebruik elders. Er is geen
 * echte "Jouw situatie"-stap gebouwd voor déze funnel, dus de link heeft
 * nog geen bestemming (zelfde soort gat als `/autonew`'s "Naar jouw
 * gegevens").
 *
 * Bekende afwijking t.o.v. Figma, expliciet op verzoek: de "Terug"-knop
 * onderaan (`FormNavigation`'s `previousLabel`) toont hier "Terug naar
 * jouw situatie" — Figma zelf toont daar nog "Jouw dekking" (bevestigde
 * fout, de gebruiker gaf aan dat dit "Jouw situatie" moet zijn maar de
 * Figma-tekst zelf kon niet aangepast worden vanwege een lettertype-
 * beperking in de plugin-omgeving).
 *
 * "Kies eerst een basisdekking"-melding: `Alert` met `closable={false}` —
 * Figma toont hier geen sluitknop-affordance voor deze instructietekst.
 *
 * Premieberekening (`ReceiptBar`) is een eigen optelsom (basisdekking +
 * aangevinkte aanvullende dekkingen) — Figma specificeert geen exacte
 * backend-rekenregel, dus dit is de simpelste correcte aanname.
 */
export default function KortlopendeReisPage() {
  const router = useRouter();
  const [dekking, setDekking] = useState<DekkingKeuze | "">("");
  const [dekkingError, setDekkingError] = useState(false);
  const [aanvullendeDekkingen, setAanvullendeDekkingen] = useState<string[]>([]);

  const aanvullendeOpties = useMemo(
    () => (dekking ? getAanvullendeDekkingenOptions(dekking, aanvullendeDekkingen.includes("bagage")) : []),
    [dekking, aanvullendeDekkingen],
  );

  const totaalPremie = useMemo(() => {
    if (!dekking) return 0;
    const basis = BASISDEKKING_OPTIONS.find((option) => option.value === dekking);
    const basisPrijs = basis ? parseEuro(basis.price) : 0;
    const extraPrijs = aanvullendeOpties
      .filter((option) => aanvullendeDekkingen.includes(option.value))
      .reduce((sum, option) => sum + (option.price ? parseEuro(option.price) : 0), 0);
    return basisPrijs + extraPrijs;
  }, [dekking, aanvullendeOpties, aanvullendeDekkingen]);

  function handleDekkingChange(value: string) {
    const next = value as DekkingKeuze;
    setDekking(next);
    setDekkingError(false);
    // Aanvullende dekkingen die niet meer bestaan voor de nieuwe basisdekking (bv. "bagage" bij Optimaal) automatisch uitzetten.
    setAanvullendeDekkingen((current) => current.filter((value) => getAanvullendeDekkingenOptions(next, true).some((option) => option.value === value)));
  }

  function handleNext() {
    if (!dekking) {
      setDekkingError(true);
      return;
    }
    router.push("/kortlopendereis/jouw-gegevens");
  }

  return (
    <FunnelPageTemplate
      headerTitle="Kortlopende reisverzekering"
      ikzSticker
      steps={REIS_STEPS}
      activeStep={2}
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Terug naar jouw situatie"
          nextLabel="Naar jouw gegevens"
          saveForLater
          onPrevious={() => router.push("/kortlopendereis")}
          onNext={handleNext}
          onSaveForLater={() => {}}
        />
      }
    >
      <button
        type="button"
        onClick={() => {}}
        className="flex items-center gap-2 rounded-[3px]"
      >
        <Icon name="arrow-left" size="sm" />
        <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
          Jouw situatie
        </span>
      </button>

      <FunnelSection intro title="Jouw dekking" showRequiredFieldsNote />

      <FunnelSection title="Stel je reisverzekering samen">
        <RadioCardBottomGroup
          labelText="Kies je basisdekking"
          options={BASISDEKKING_OPTIONS}
          value={dekking}
          onChange={handleDekkingChange}
          onMoreInfoClick={() => {}}
          error={dekkingError ? "Kies een dekking" : undefined}
        />

        {dekking ? (
          <CheckboxCardControlLeftGroup
            labelText="Welke aanvullende dekkingen wil je?"
            options={aanvullendeOpties}
            values={aanvullendeDekkingen}
            onChange={setAanvullendeDekkingen}
          />
        ) : (
          <div className="flex w-full flex-col items-start gap-2">
            <p className="font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
              Welke aanvullende dekkingen wil je?
            </p>
            <Alert
              type="info"
              title="Kies eerst een basisdekking"
              description="Kies eerst je basisdekking. Daarna zie je welke aanvullende dekkingen je kunt kiezen."
              closable={false}
            />
          </div>
        )}
      </FunnelSection>

      {dekking && <ReceiptBar amount={formatEuro(totaalPremie)} onShowDetails={() => {}} />}
    </FunnelPageTemplate>
  );
}
