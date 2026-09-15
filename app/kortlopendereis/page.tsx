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
    showPricePeriod: false,
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
    showPricePeriod: false,
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
    showPricePeriod: false,
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
 * De "Bagage"-aanvullende dekking bij Basis/Comfort — LET OP, deze aanname
 * (upgrade naar de eerstvolgende hogere tier) staat nog open: een hernieuwde
 * mcp-check liet zien dat Basis' eigen scherm juist zijn ÉÍGEN cijfers toont
 * ("€ 1000"/"€ 100 eigen risico", niet Comfort's "€ 3000"/"€ 50"), en dat
 * Comfort's scherm weer een mix van Comfort- en Optimaal-cijfers toont — dus
 * dit patroon klopt zelf niet consistent. Bewust nog NIET aangepast, op
 * verzoek eerst uitzoeken voordat dit gewijzigd wordt.
 *
 * Optimaal's eigen geval (Bagage al standaard inbegrepen) wordt niet meer
 * door déze functie afgehandeld — zie `getAanvullendeDekkingenOptions`'s
 * `bagageIncluded`-check, die dat geval nu apart en wél bevestigd afvangt
 * vóórdat deze functie ooit aangeroepen wordt.
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
 * zolang dat niet zo is). Bij Optimaal is "Bagage" zelf al "Inbegrepen"
 * (zie hieronder), dus is aan die voorwaarde dan impliciet al voldaan.
 *
 * "Inbegrepen"-pil i.p.v. checkbox: bevestigd via mcp op de Optimaal-
 * geselecteerde staat — "Bagage", "Geld", "Geneeskundige kosten" en
 * "Reisrechtsbijstand" zijn daar niet meer los aan te vinken, want ze zijn
 * al standaard onderdeel van Optimaal (exact dezelfde 4 items die in de
 * basisdekking-kaart zelf als ✓ i.p.v. ✗ staan). Bij Basis/Comfort staan
 * die 4 features nog op ✗, dus daar blijven het gewoon checkboxen.
 *
 * "Geld"-beschrijving bij Optimaal ("De a.s.r. alarmcentrale...") is
 * letterlijk overgenomen uit Figma, ook al lijkt de tekst inhoudelijk niet
 * bij "Geld" te passen (lijkt een contentfout in Figma zelf, hier bewust
 * niet zelf gecorrigeerd — mcp is de waarheid).
 *
 * "Geneeskundige kosten"/"Reisrechtsbijstand" tonen bij Optimaal in Figma
 * zelf nog onopgeloste "Description"-placeholdertekst — hier bewust NIET
 * overgenomen (zou zelf verzonnen content zijn); ze behouden voorlopig hun
 * bestaande, al wel bevestigde Basis/Comfort-beschrijving.
 */
function getAanvullendeDekkingenOptions(dekking: DekkingKeuze, bagageChecked: boolean): CheckboxCardOption[] {
  const tier = BASISDEKKING_OPTIONS.find((option) => option.value === dekking)!;
  const bagageIncluded = tier.features[1].included;
  const geldIncluded = tier.features[2].included;
  const geneeskundigeKostenIncluded = tier.features[3].included;
  const reisrechtsbijstandIncluded = tier.features[4].included;
  const bagageSatisfied = bagageIncluded || bagageChecked;

  const bagageOption: CheckboxCardOption | null = bagageIncluded
    ? { value: "bagage", title: "Bagage tot € 5000", description: "Voor deze dekking geldt geen eigen risico", included: true }
    : getBagageUpgrade(dekking);

  const options: CheckboxCardOption[] = [];
  if (bagageOption) options.push(bagageOption);
  options.push(
    {
      value: "sportuitrusting",
      title: "Extra sportuitrusting",
      description: "Extra vergoeding voor je sportuitrusting tot € 2.500.",
      price: "1,20",
      disabledMessage: bagageSatisfied ? undefined : "Kan alleen worden meeverzekerd als dekking Bagage is afgesloten",
    },
    {
      value: "geld",
      title: "Geld",
      description: geldIncluded
        ? "De a.s.r. alarmcentrale staat voor je klaar als je niet verder kan rijden door pech."
        : "Geld en cheques tot € 500 meeverzekerd.",
      price: "4,00",
      included: geldIncluded,
    },
    {
      value: "geneeskundige-kosten",
      title: "Geneeskundige kosten",
      description: "Vergoeding voor spoedeisende medische hulp.",
      price: "4,00",
      included: geneeskundigeKostenIncluded,
    },
    {
      value: "reisrechtsbijstand",
      title: "Reisrechtsbijstand",
      description: "Tijdens je reis verzekerd voor rechtsbijstand door de juristen van DAS.",
      price: "1,20",
      included: reisrechtsbijstandIncluded,
    },
    { value: "ongevallen", title: "Ongevallen", description: "Eenmalige uitkering bij invaliditeit of overlijden door een ongeval.", price: "1,20" },
    { value: "wintersport", title: "Skiën en snowboarden", description: "Ook verzekerd als je gaat wintersporten.", price: "8,00" },
    { value: "vervoermiddel-hulp", title: "Hulp en huur vervoermiddel", description: "Verzekerd bij uitval van je vervoermiddel of bestuurder.", price: "17,50" },
  );
  return options.map((option) => ({ ...option, showPricePeriod: false, centerActionSlot: true }));
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
      // `included` (de "Inbegrepen"-pil) telt nooit los mee — die zit al in de basisprijs.
      .filter((option) => !option.included && aanvullendeDekkingen.includes(option.value))
      .reduce((sum, option) => sum + (option.price ? parseEuro(option.price) : 0), 0);
    return basisPrijs + extraPrijs;
  }, [dekking, aanvullendeOpties, aanvullendeDekkingen]);

  function handleDekkingChange(value: string) {
    const next = value as DekkingKeuze;
    setDekking(next);
    setDekkingError(false);
    // Aanvullende dekkingen die niet meer bestaan óf nu "Inbegrepen" zijn voor de nieuwe basisdekking automatisch uitzetten.
    const nextOptions = getAanvullendeDekkingenOptions(next, true);
    setAanvullendeDekkingen((current) =>
      current.filter((value) => nextOptions.some((option) => option.value === value && !option.included)),
    );
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
          /**
           * Zonder deze prop staat de kaartenrij plakt direct tegen de
           * legend aan (0px i.p.v. 16px) — bevestigd via mcp (node 2416:3430,
           * frame "Frame 2609877"): legend-hoogte 27px, kaartenrij start op
           * y=43, dus een gap van 16px. Bekende quirk: de fieldset's eigen
           * `gap-4` werkt niet tussen `<legend>` en de eerstvolgende sibling.
           */
          contentTopClassName="mt-4"
        />

        {dekking ? (
          <CheckboxCardControlLeftGroup
            labelText="Welke aanvullende dekkingen wil je?"
            options={aanvullendeOpties}
            values={aanvullendeDekkingen}
            onChange={setAanvullendeDekkingen}
            /**
             * Zonder handler toont de Group geen "Meer informatie"-link per
             * item (`showMoreInfoButton={Boolean(onMoreInfoClick)}` in
             * `CheckboxCardControlLeft.tsx`) — bevestigd via mcp (node
             * 2416:3430): elk aanvullende-dekking-item toont daar een eigen
             * "Meer informatie"-link. Zelfde no-op-patroon als de
             * basisdekking-kaarten hierboven, in afwachting van een
             * info-modal/paneel dat nog niet is opgeleverd.
             */
            onMoreInfoClick={() => {}}
            /**
             * `gap-4` (16px) i.p.v. het component-eigen default `gap-2` —
             * bevestigd via mcp (node 2416:3430, "Frame 2609878"): het label
             * "Welke aanvullende dekkingen wil je?" is 27px hoog, de lijst
             * begint op y=43, dus een gap van 16px tussen label en lijst.
             */
            className="flex w-full max-w-[800px] flex-col items-start gap-4"
          />
        ) : (
          <div className="flex w-full max-w-[800px] flex-col items-start gap-4">
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

      {dekking && <ReceiptBar amount={`Premie € ${formatEuro(totaalPremie)}`} period="" onShowDetails={() => {}} />}
    </FunnelPageTemplate>
  );
}
