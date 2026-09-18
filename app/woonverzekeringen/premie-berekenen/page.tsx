"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { MultiEntityItem } from "@/components/MultiEntityItem";
import { InputDate } from "@/components/InputDate";
import { FieldsetAddress, type FieldsetAddressValue } from "@/components/FieldsetAddress";
import { CardDetails } from "@/components/CardDetails";
import { Select, type SelectOption } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
import { Alert } from "@/components/Alert";
import { Receipt, type ReceiptSection } from "@/components/Receipt";
import { Icon } from "@/components/Icon";

const WOON_STEPS = ["Productkeuze", "Premie berekenen", "Gegevens", "Laatste vragen", "Samenvatting"];

/**
 * Geen enkele Figma-instance van deze select toonde de volledige optielijst
 * (alleen het al gekozen voorbeeld "Twee onder een kap" was zichtbaar, de
 * dropdown zelf heeft geen los "open met alle opties"-component) — deze
 * lijst is dus, op "Twee onder een kap woning" na, niet 1-op-1 mcp-bevestigd.
 * Gebaseerd op de gangbare a.s.r.-categorieën voor woningtype.
 */
const SOORT_WONING_OPTIONS: SelectOption[] = [
  { value: "vrijstaand", label: "Vrijstaande woning" },
  { value: "twee-onder-een-kap", label: "Twee onder een kap woning" },
  { value: "tussenwoning", label: "Rijwoning (tussenwoning)" },
  { value: "hoekwoning", label: "Rijwoning (hoekwoning)" },
  { value: "appartement", label: "Appartement" },
];

const KOOP_HUUR_OPTIONS = [
  { value: "koop", label: "Koopwoning" },
  { value: "huur", label: "Huurwoning" },
];

const JA_NEE_OPTIONS = [
  { value: "ja", label: "Ja" },
  { value: "nee", label: "Nee" },
];

const MUREN_OPTIONS = [
  { value: "steen", label: "Steen" },
  { value: "hout", label: "Hout" },
];

const DAK_OPTIONS = [
  { value: "schuin", label: "Schuin dak" },
  { value: "plat", label: "Plat dak" },
];

const EIGEN_RISICO_OPTIONS = [
  { value: "0", label: "€ 0" },
  { value: "100", label: "€ 100" },
  { value: "500", label: "€ 500" },
];

const OPSTAL_FEATURES = [
  "Brand, bliksem en rook",
  "Storm, neerslag en lekkage",
  "Diefstal, inbraak en vandalisme",
  "Tijdelijke woonruimte bij nood",
  "Ongelukjes zoals vallen en stoten",
];

/**
 * Prijzen 1:1 uit Figma ("Radio Card Control Bottom Group", node 1:38255):
 * Basis € 4,82, Allrisk € 5,20, beide "Opstalverzekering". Let op: de
 * rechter Receipt-kaart in Figma toont voor Basis + eigen risico € 100 een
 * ander bedrag (€ 15,06) dat niet uit deze kaartprijs is af te leiden (geen
 * bevestigde regel legt het verband tussen eigen risico en prijs) — bewust
 * niet zelf een correctiefactor verzonnen om dat bedrag te forceren, zie de
 * toelichting in het chatbericht na deze build.
 */
const DEKKING_OPTIES: RadioCardBottomOption[] = [
  {
    value: "basis",
    title: "Basis",
    description: "Opstalverzekering",
    features: OPSTAL_FEATURES.map((text, index) => ({ text, included: index < 4 })),
    price: "4,82",
  },
  {
    value: "allrisk",
    title: "Allrisk",
    description: "Opstalverzekering",
    features: OPSTAL_FEATURES.map((text) => ({ text, included: true })),
    price: "5,20",
  },
];

const GLAS_PRICE = 2.63;

function formatEuro(amount: number) {
  return `€ ${amount.toFixed(2).replace(".", ",")}`;
}

export default function OpstalPremieBerekenenPage() {
  const router = useRouter();

  const [geboortedatum, setGeboortedatum] = useState<Date | null>(null);
  const [adres, setAdres] = useState<FieldsetAddressValue>({ postalCode: "", houseNumber: "", addition: "" });
  const [soortWoning, setSoortWoning] = useState("");
  const [koopHuur, setKoopHuur] = useState("");
  const [particulier, setParticulier] = useState("");
  const [muren, setMuren] = useState("");
  const [dak, setDak] = useState("");
  const [rietenDak, setRietenDak] = useState("");

  const [dekking, setDekking] = useState("");
  const [eigenRisico, setEigenRisico] = useState("");
  const [glas, setGlas] = useState<string[]>([]);

  /**
   * Geen backend voor een echte postcode-lookup (bevestigd: ook de bestaande
   * `app/mutatie/page.tsx` toont z'n CardDetails-adresgegevens al hardcoded,
   * zonder API) — zodra postcode + huisnummer zijn ingevuld tonen we
   * dezelfde demo-adresgegevens die Figma zelf laat zien ("Dorpslaan 10",
   * "Utrecht", "119 m²", "1972", bevestigd via mcp op de "Card Details"-
   * instance, node 13:6094).
   */
  const addressResolved = adres.postalCode.trim().length >= 6 && adres.houseNumber.trim().length > 0;

  const isDataComplete = Boolean(
    geboortedatum && addressResolved && soortWoning && koopHuur && particulier && muren && dak && rietenDak,
  );
  const isCoverageComplete = Boolean(dekking && eigenRisico);

  const coveragePrice = dekking === "basis" ? 4.82 : dekking === "allrisk" ? 5.2 : 0;
  const glasPrice = glas.includes("glas") ? GLAS_PRICE : 0;
  const totalPrice = coveragePrice + glasPrice;

  const opstalSection: ReceiptSection = useMemo(() => {
    if (!isCoverageComplete) {
      return {
        id: "opstal",
        title: "Opstal",
        amount: "€ -,--",
        icon: <img src="/icons/pictogram-house.svg" alt="" className="size-8" />,
        groups: [{ items: [{ label: "Beantwoord de vragen om de premie te zien" }] }],
      };
    }
    const dekkingOptie = DEKKING_OPTIES.find((o) => o.value === dekking);
    return {
      id: "opstal",
      title: "Opstal",
      amount: formatEuro(totalPrice),
      icon: <img src="/icons/pictogram-house.svg" alt="" className="size-8" />,
      groups: [
        {
          title: "Dekking",
          items: [
            { label: dekkingOptie?.title ?? "", amount: formatEuro(coveragePrice) },
            { label: `Eigen risico € ${eigenRisico}` },
          ],
        },
        ...(glasPrice > 0 ? [{ title: "Aanvullende dekkingen", items: [{ label: "Glas", amount: formatEuro(glasPrice) }] }] : []),
      ],
    };
  }, [isCoverageComplete, dekking, eigenRisico, glasPrice, totalPrice, coveragePrice]);

  /**
   * De overige 3 producten hier hardcoded als "nog niet begonnen" —
   * bevestigd exact zo op de Figma-pagina zelf (Inboedel/Overlijdensrisico/
   * Rechtsbijstand, node 1:30178/1:36444/1:36470). Ze automatisch afleiden
   * uit de echte stap-1-selectie (zoals de rationale in punt 13/17
   * beschrijft) hoort bij het gedeelde-state-werk dat nog moet gebeuren
   * (`funnel-context.tsx` bestaat al, maar wordt door stap 1 nog niet
   * gebruikt) — hier bewust buiten scope, dit is de Opstal-only eerste bouw.
   */
  /**
   * Figma's eigen upcoming-rijen tonen voor alle drie hetzelfde generieke
   * poppetje-icoon (bevestigd via mcp) — in de praktijk oogt dat als een
   * fout zodra drie verschillende producten identiek ogen. Hier daarom
   * bewust het eigen producticoon van stap 1 hergebruikt (zelfde bestanden
   * als `app/woonverzekeringen/page.tsx`), consistent met hoe het huidige
   * (`current`) Opstal-item hierboven ook zijn eigen icoon toont.
   */
  const remainingProducts = [
    { title: "Inboedelverzekering", icon: "pictogram-inboedel" },
    { title: "Overlijdensrisicoverzekering", icon: "pictogram-overlijdensrisicoverzekering" },
    { title: "Rechtsbijstandverzekering", icon: "pictogram-rechtsbijstandsverzekering" },
  ];

  const receiptSections: ReceiptSection[] = [
    opstalSection,
    ...remainingProducts.map((p) => ({
      id: p.title,
      title: p.title,
      amount: "€ -,--",
      icon: <img src={`/icons/${p.icon}.svg`} alt="" className="size-8" />,
    })),
  ];

  const summaryAmount = formatEuro(totalPrice);

  function handlePrevious() {
    router.push("/woonverzekeringen");
  }

  /**
   * De vervolgstap (Inboedel) is nog niet gebouwd ("product voor product",
   * zie de werkwijze-instructie) — zelfde no-op-precedent als stap 1's eigen
   * "Ga terug"-knop, totdat die pagina er is.
   */
  function handleNext() {}

  return (
    <FunnelPageTemplate
      headerTitle="Woonverzekeringen"
      ikzSticker
      steps={WOON_STEPS}
      activeStep={2}
      sidebarClassName="w-full"
      sidebar={
        <Receipt
          sections={receiptSections}
          type="collapsable"
          defaultActiveSectionId="opstal"
          summaryAmount={summaryAmount}
        />
      }
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Vorige stap"
          nextLabel="verder met Inboedel"
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      }
    >
      <button
        type="button"
        onClick={handlePrevious}
        className="flex items-center gap-2 rounded-[3px]"
      >
        <Icon name="arrow-left" size="sm" />
        <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
          Terug naar productkeuze
        </span>
      </button>

      <FunnelSection intro title="Bereken je premie" />

      {/*
        Bevestigd via mcp (node 1:30978, "Container"): de divider vóór "Multi
        Entity Item" is 763px breed, dus edge-to-edge over de hele kaart —
        anders dan de smallere, 40px-ingesprongen divider die de intro-sectie
        zelf al toont (683px, `FunnelSection`'s eigen ingebouwde divider).
        Zonder de `-mx-6`/`-mx-10`-uitbraak uit `FunnelPageTemplate`'s eigen
        kaartpadding oogden beide dividers identiek breed en direct onder
        elkaar (het gerapporteerde "dubbele divider"-probleem). `MultiEntityItem`
        heeft zelf al de bevestigde 40px binnenpadding (pad=16/40/16/40), dus na
        deze uitbraak precies één set inspringing i.p.v. dubbel opgeteld.
      */}
      <div className="flex w-full flex-col items-start -mx-6 min-[1200px]:-mx-10">
        <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
        <MultiEntityItem state="current" icon={<img src="/icons/pictogram-house.svg" alt="" className="size-8" />} title="Opstalverzekering" description="Verzeker je woning voor bijvoorbeeld brand, storm of inbraak." />
      </div>

      <FunnelSection title="Gegevens">
        <InputDate labelText="Geboortedatum (dd-mm-jjjj)" showPickerButton value={geboortedatum} onChange={setGeboortedatum} />

        <div className="flex w-full flex-col items-start gap-4">
          <FieldsetAddress value={adres} onChange={setAdres} />
          {addressResolved && (
            <CardDetails
              title="Deze gegevens hebben we opgehaald"
              cardActionEdit={false}
              rows={[
                { label: "Straat en huisnummer", value: "Dorpslaan 10" },
                { label: "Plaats", value: "Utrecht" },
                { label: "Oppervlakte", value: "119 m²" },
                { label: "Bouwjaar", value: "1972" },
              ]}
            />
          )}
        </div>

        <Select
          labelText="Wat voor soort woning heb je?"
          description="Je kunt geen recreatiewoning, woonboot, studentenkamer, monument of bedrijfspand bij ons verzekeren."
          options={SOORT_WONING_OPTIONS}
          value={soortWoning}
          onChange={setSoortWoning}
        />

        <RadioGroup labelText="Heb je een koop- of huurwoning?" options={KOOP_HUUR_OPTIONS} value={koopHuur} onChange={setKoopHuur} />

        <RadioGroup labelText="Gebruik je de woning particulier?" options={JA_NEE_OPTIONS} value={particulier} onChange={setParticulier} horizontal />

        <RadioGroup
          labelText="Wat voor muren heeft je woning?"
          description="Geef aan van welk materiaal de muren van je woning zijn."
          options={MUREN_OPTIONS}
          value={muren}
          onChange={setMuren}
        />

        <RadioGroup
          labelText="Is het dak van je woning schuin of plat?"
          description="Heb je beide? Kies dan het soort dak dat het grootste deel van je woning heeft."
          options={DAK_OPTIONS}
          value={dak}
          onChange={setDak}
        />

        <RadioGroup labelText="Heeft je woning een rieten dak?" options={JA_NEE_OPTIONS} value={rietenDak} onChange={setRietenDak} horizontal />
      </FunnelSection>

      {/* Bevestigd via mcp (node 1:36357): ook deze divider is 763px, edge-to-edge — `showDividerAbove` zou hier de smallere, ingesprongen variant geven. */}
      <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)] -mx-6 min-[1200px]:-mx-10" />

      <FunnelSection title="Stel je opstalverzekering samen">
        {!isDataComplete ? (
          <Alert type="warning" title="Vul eerst alle gegevens in om je premie te berekenen" description="You can use a description to better explain the alert." />
        ) : (
          <>
            <RadioCardBottomGroup labelText="Kies je dekking" options={DEKKING_OPTIES} value={dekking} onChange={setDekking} onMoreInfoClick={() => {}} />
            <RadioGroup
              labelText="Kies je eigen risico"
              description="Dit is het bedrag dat wij aftrekken van een schadevergoeding. Hoe hoger je eigen risico, hoe minder je per maand betaalt."
              options={EIGEN_RISICO_OPTIONS}
              value={eigenRisico}
              onChange={setEigenRisico}
            />
            <CheckboxCardControlLeftGroup
              labelText="Welke aanvullende dekking wil je?"
              options={[
                {
                  value: "glas",
                  title: "Glas",
                  description: "Vergoeding voor de kosten van nieuwe ruiten en herstel van beschadigd schilderwerk.",
                  price: formatEuro(GLAS_PRICE).replace("€ ", ""),
                },
              ]}
              values={glas}
              onChange={setGlas}
              onMoreInfoClick={() => {}}
            />
          </>
        )}
      </FunnelSection>

      {/*
        Bevestigd via mcp: elke resterende-product-rij is z'n eigen "Multi
        Entity Section"-instance (Container = eigen 763px-brede divider +
        Multi Entity Item), niet één gedeelde divider bovenaan de hele lijst
        — vandaar een divider per rij i.p.v. één divider voor de volledige
        groep (het gerapporteerde "dividers lopen niet door"-probleem: elke
        divider moet zelf ook edge-to-edge zijn, niet alleen de bovenste).
      */}
      <div className="flex w-full flex-col items-start -mx-6 min-[1200px]:-mx-10">
        {remainingProducts.map((product) => (
          <div key={product.title} className="flex w-full flex-col items-start">
            <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
            <MultiEntityItem
              state="disabled"
              icon={<img src={`/icons/${product.icon}.svg`} alt="" className="size-8" />}
              title={product.title}
              onRemove={() => {}}
            />
          </div>
        ))}
      </div>
    </FunnelPageTemplate>
  );
}
