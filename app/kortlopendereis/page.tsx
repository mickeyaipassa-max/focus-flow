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
 * Bagage-bedragen per tier — hernieuwde mcp-check (Basis-scherm en beide
 * Comfort-schermen) loste de eerdere inconsistentie op: het aanvinkbare
 * "Bagage"-item toont standaard de EIGEN tier-bedragen (niet die van de
 * volgende tier), en pas ná aanvinken springt alleen de TITEL door naar het
 * bedrag van de eerstvolgende tier — de eigen-risico-tekst verandert daarbij
 * niet mee (bevestigd op Comfort: aangevinkt toont "Bagage tot € 5000" met
 * ongewijzigd "€ 50 eigen risico", niet Optimaal's "geen eigen risico").
 * Voor Basis is alleen de niet-aangevinkte stand rechtstreeks bevestigd; de
 * aangevinkte stand ("Bagage tot € 3000") is afgeleid via exact hetzelfde,
 * wél bevestigde patroon bij Comfort — geen apart Figma-scherm hiervoor.
 */
const BAGAGE_TIER_DATA: Record<"basis" | "comfort", { eigenBedrag: string; volgendeBedrag: string; eigenRisico: string }> = {
  basis: { eigenBedrag: "1000", volgendeBedrag: "3000", eigenRisico: "Voor deze dekking geldt een eigen risico van € 100." },
  comfort: { eigenBedrag: "3000", volgendeBedrag: "5000", eigenRisico: "Voor deze dekking geldt een eigen risico van € 50." },
};

/**
 * "Extra sportuitrusting" is in Figma alleen aan te vinken zodra "Bagage"
 * is aangevinkt (getoond als een roze pil i.p.v. een checkbox zolang dat
 * niet zo is — bevestigd via mcp, node 2444:4193/2444:4211: de titel bevat
 * nu zelf het bedrag ("Extra sportuitrusting tot € 2.500.") zonder aparte
 * beschrijvingsregel, en de pil-tekst is tier-afhankelijk: "Alleen
 * beschikbaar i.c.m. Bagage tot € 1000/3000"). Bij Optimaal is "Bagage" zelf
 * al "Inbegrepen", dus is aan die voorwaarde dan impliciet al voldaan.
 *
 * "Inbegrepen"-pil i.p.v. checkbox: bevestigd via mcp op de Optimaal-
 * geselecteerde staat — "Bagage", "Geld", "Geneeskundige kosten" en
 * "Reisrechtsbijstand" zijn daar niet meer los aan te vinken, want ze zijn
 * al standaard onderdeel van Optimaal (exact dezelfde 4 items die in de
 * basisdekking-kaart zelf als ✓ i.p.v. ✗ staan). Bij Basis/Comfort staan
 * die 4 features nog op ✗, dus daar blijven het gewoon checkboxen.
 *
 * Alle 4 "Inbegrepen"-items tonen bij Optimaal geen beschrijvingsregel meer
 * (bevestigd via mcp) — inclusief "Geld", waarvan de eerder overgenomen
 * "De a.s.r. alarmcentrale..."-tekst (een contentfout in Figma zelf) dus
 * niet meer relevant is, want die regel is helemaal verdwenen.
 *
 * "Geneeskundige kosten"/"Reisrechtsbijstand" tonen bij Optimaal in Figma
 * zelf nog onopgeloste "Description"-placeholdertekst voor de 3 laatste,
 * nog-aan-te-vinken items (Ongevallen/Skiën/Hulp) — hier bewust NIET
 * overgenomen (zou zelf verzonnen content zijn); die 3 behouden voorlopig
 * hun bestaande, al wel bevestigde Basis/Comfort-beschrijving.
 *
 * Volgorde: bevestigd via mcp op Optimaal (node 2416:3430) staan de 4
 * "Inbegrepen"-items vooraan, gevolgd door de nog aan te vinken items. Een
 * stabiele sort op `included` (aflopend) reproduceert dit exact, zonder iets
 * te veranderen aan Basis/Comfort (daar is nooit een item `included`, ook
 * niet wanneer Bagage is aangevinkt — dat geeft geen `included`-status).
 */
function getAanvullendeDekkingenOptions(dekking: DekkingKeuze, bagageChecked: boolean): CheckboxCardOption[] {
  const tier = BASISDEKKING_OPTIONS.find((option) => option.value === dekking)!;
  const bagageIncluded = tier.features[1].included;
  const geldIncluded = tier.features[2].included;
  const geneeskundigeKostenIncluded = tier.features[3].included;
  const reisrechtsbijstandIncluded = tier.features[4].included;

  let bagageOption: CheckboxCardOption;
  let sportuitrustingDisabledMessage: string | undefined;
  if (bagageIncluded) {
    bagageOption = { value: "bagage", title: "Bagage tot € 5000", included: true };
    sportuitrustingDisabledMessage = undefined;
  } else {
    const tierData = BAGAGE_TIER_DATA[dekking as "basis" | "comfort"];
    bagageOption = {
      value: "bagage",
      title: `Bagage tot € ${bagageChecked ? tierData.volgendeBedrag : tierData.eigenBedrag}`,
      description: tierData.eigenRisico,
      price: "2,00",
    };
    sportuitrustingDisabledMessage = bagageChecked ? undefined : `Alleen beschikbaar i.c.m. Bagage tot € ${tierData.eigenBedrag}`;
  }

  const options: CheckboxCardOption[] = [
    bagageOption,
    {
      value: "sportuitrusting",
      title: "Extra sportuitrusting tot € 2.500.",
      price: "1,20",
      disabledMessage: sportuitrustingDisabledMessage,
    },
    {
      value: "geld",
      title: "Geld",
      description: geldIncluded ? undefined : "Geld en cheques tot € 500 meeverzekerd.",
      price: "4,00",
      included: geldIncluded,
    },
    {
      value: "geneeskundige-kosten",
      title: "Geneeskundige kosten",
      description: geneeskundigeKostenIncluded ? undefined : "Vergoeding voor spoedeisende medische hulp.",
      price: "4,00",
      included: geneeskundigeKostenIncluded,
    },
    {
      value: "reisrechtsbijstand",
      title: "Reisrechtsbijstand",
      description: reisrechtsbijstandIncluded ? undefined : "Tijdens je reis verzekerd voor rechtsbijstand door de juristen van DAS.",
      price: "1,20",
      included: reisrechtsbijstandIncluded,
    },
    { value: "ongevallen", title: "Ongevallen", description: "Eenmalige uitkering bij invaliditeit of overlijden door een ongeval.", price: "1,20" },
    { value: "wintersport", title: "Skiën en snowboarden", description: "Ook verzekerd als je gaat wintersporten.", price: "8,00" },
    { value: "vervoermiddel-hulp", title: "Hulp en huur vervoermiddel", description: "Verzekerd bij uitval van je vervoermiddel of bestuurder.", price: "17,50" },
  ];

  const sortedByIncludedFirst = [...options].sort((a, b) => Number(b.included ?? false) - Number(a.included ?? false));
  return sortedByIncludedFirst.map((option) => ({ ...option, showPricePeriod: false, centerActionSlot: true, compact: true }));
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
              description="Daarna zie je welke aanvullende dekkingen je kunt kiezen."
              closable={false}
            />
          </div>
        )}
      </FunnelSection>

      {dekking && <ReceiptBar amount={`Premie € ${formatEuro(totaalPremie)}`} period="" onShowDetails={() => {}} />}
    </FunnelPageTemplate>
  );
}
