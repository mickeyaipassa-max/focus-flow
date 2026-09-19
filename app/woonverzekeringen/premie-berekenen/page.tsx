"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  fromIsoDatum,
  getProductStatus,
  getTotalPremium,
  toIsoDatum,
  useWoonverzekeringenFunnel,
  type WoonverzekeringenSharedData,
} from "../funnel-context";
import { getProductMeta, type WoonverzekeringenProductId } from "../products";

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
  const { state, setState } = useWoonverzekeringenFunnel();

  /**
   * Alle velden hieronder komen nu uit `state.sharedData` i.p.v. lokale
   * `useState` — bevestigd via mcp dat Inboedel's "Je woning"-sectie
   * letterlijk dezelfde vragen stelt als deze "Gegevens"-sectie, dus deze
   * gegevens moeten aanvraagbreed beschikbaar zijn, niet alleen op deze
   * pagina (rationale punt 11-13). `updateSharedData` is een dunne
   * merge-helper, zelfde `setState({ ...state, veld })`-patroon als
   * `app/mutatie/dekking-wijzigen/page.tsx` al gebruikt.
   */
  function updateSharedData(patch: Partial<WoonverzekeringenSharedData>) {
    setState({ ...state, sharedData: { ...state.sharedData, ...patch } });
  }

  const geboortedatum = fromIsoDatum(state.sharedData.geboortedatum);
  const adres: FieldsetAddressValue = {
    postalCode: state.sharedData.postcode,
    houseNumber: state.sharedData.huisnummer,
    addition: state.sharedData.toevoeging,
  };
  const { soortWoning, koopHuur, particulier, muren, dak, rietenDak } = state.sharedData;

  /**
   * Standaard al Basis/€ 100/Glas aangevinkt i.p.v. leeg — bevestigd via de
   * Figma Make-broncode (`useState('Basis')`/`useState('€ 100')`/
   * `useState(true)`): de gebruiker krijgt een kant-en-klare configuratie te
   * zien die hij kan aanpassen, in plaats van alles zelf te moeten kiezen.
   */
  const [dekking, setDekking] = useState("basis");
  const [eigenRisico, setEigenRisico] = useState("100");
  const [glas, setGlas] = useState<string[]>(["glas"]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const stelJeOpstalRef = useRef<HTMLDivElement>(null);
  const wasDataComplete = useRef(false);

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

  /**
   * Bevestigd via de Figma Make-broncode (`useEffect` op `isComplete`):
   * zodra "Gegevens" van onvolledig naar compleet gaat, scrollt de pagina
   * smooth naar "Stel je opstalverzekering samen" (80px vanaf de top) en
   * toont hij daar 1 seconde een pulserende skeleton i.p.v. direct de echte
   * Basis/Allrisk-kaarten — geen losse animatiebibliotheek nodig voor dit
   * eenmalige effect, `setTimeout` + Tailwinds `animate-pulse` volstaan,
   * exact zoals de referentie het zelf ook doet.
   */
  useEffect(() => {
    if (isDataComplete && !wasDataComplete.current) {
      setShowSkeleton(true);
      requestAnimationFrame(() => {
        const top = stelJeOpstalRef.current?.getBoundingClientRect().top;
        if (top !== undefined) {
          window.scrollTo({ top: top + window.scrollY - 80, behavior: "smooth" });
        }
      });
      const timeout = setTimeout(() => setShowSkeleton(false), 1000);
      wasDataComplete.current = isDataComplete;
      return () => clearTimeout(timeout);
    }
    wasDataComplete.current = isDataComplete;
  }, [isDataComplete]);

  const coveragePrice = dekking === "basis" ? 4.82 : dekking === "allrisk" ? 5.2 : 0;
  const glasPrice = glas.includes("glas") ? GLAS_PRICE : 0;
  const totalPrice = coveragePrice + glasPrice;

  /**
   * Zet Opstal's eigen premie door naar de gedeelde state, zodat een latere
   * productpagina (bv. Inboedel) 'm in de kassabon kan tonen — bevestigd via
   * mcp dat Inboedel's Receipt precies dit doet ("Opstal € 17,69" naast de
   * nog niet-berekende producten). Reactief op elke wijziging (niet pas bij
   * "verder met ..."), zodat de kassabon ook op déze pagina live meebeweegt
   * zoals Figma laat zien. `isComplete` (het product is écht afgerond, de
   * gebruiker is verdergegaan) staat los hiervan — zie `handleNext`.
   */
  useEffect(() => {
    const premium = isDataComplete ? totalPrice : null;
    if (state.products.opstal?.premium === premium) return;
    setState({
      ...state,
      products: { ...state.products, opstal: { premium, isComplete: state.products.opstal?.isComplete ?? false } },
    });
  }, [isDataComplete, totalPrice, state, setState]);

  const opstalSection: ReceiptSection = useMemo(() => {
    if (!isDataComplete) {
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
  }, [isDataComplete, dekking, eigenRisico, glasPrice, totalPrice, coveragePrice]);

  /**
   * Nu écht afgeleid uit de stap-1-selectie i.p.v. hardcoded (was bewust
   * buiten scope bij de allereerste Opstal-only bouw, tot deze
   * gedeelde-state-laag er was) — volgorde uit `state.selectedProducts` is
   * leidend (rationale punt 1). Titels/iconen komen uit `products.ts` i.p.v.
   * hier opnieuw gedupliceerd.
   */
  const otherProductIds = state.selectedProducts.filter((id) => id !== "opstal");

  const receiptSections: ReceiptSection[] = [
    opstalSection,
    ...otherProductIds.map((id) => {
      const meta = getProductMeta(id);
      const premium = state.products[id]?.premium ?? null;
      return {
        id,
        title: meta.shortTitle,
        amount: premium != null ? formatEuro(premium) : "€ -,--",
        icon: <img src={`/icons/${meta.icon}.svg`} alt="" className="size-8" />,
        ...(premium == null ? { groups: [{ items: [{ label: "Beantwoord de vragen om de premie te zien" }] }] } : {}),
      };
    }),
  ];

  const summaryAmount = isDataComplete ? formatEuro(getTotalPremium(state)) : "€ -,--";

  const nextProductId = otherProductIds[0] ?? null;
  const nextLabel = nextProductId ? `verder met ${getProductMeta(nextProductId).shortTitle}` : "Volgende stap";

  function handlePrevious() {
    router.push("/woonverzekeringen");
  }

  /** Haalt een product uit de selectie (en z'n eventuele premie/status) — de "Verwijder"-knop op de resterende-producten-rijen. */
  function handleRemoveProduct(id: WoonverzekeringenProductId) {
    const { [id]: _removed, ...remainingProductStates } = state.products;
    setState({
      ...state,
      selectedProducts: state.selectedProducts.filter((productId) => productId !== id),
      products: remainingProductStates,
    });
  }

  /**
   * Zet Opstal op "afgerond" in de gedeelde state zodra de gebruiker
   * daadwerkelijk verdergaat (rationale punt 9: "active → completed" gebeurt
   * bij het verdergaan, niet al zodra het formulier toevallig vol is — zie
   * de premie-sync hierboven, die blijft reactief los hiervan). Navigeren
   * naar de vervolgpagina zelf hoort bij het bouwen van dat product (bv.
   * Inboedel) — nog niet gebouwd, dus hier bewust geen route-navigatie.
   */
  function handleNext() {
    setState({
      ...state,
      products: { ...state.products, opstal: { premium: state.products.opstal?.premium ?? null, isComplete: true } },
    });
  }

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
          nextLabel={nextLabel}
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

      {/*
        `hideIntroDivider`: de opdrachtgever wil hier maar één lijn zien
        (bevestigd na review) — de eigen intro-divider van deze sectie
        verviel, de edge-to-edge "Container"-divider vlak vóór het
        Multi-Entity-item-blok hieronder blijft over.
      */}
      <FunnelSection intro title="Bereken je premie" hideIntroDivider />

      {/*
        Bevestigd via mcp (node 1:30978, "Container"): de divider vóór "Multi
        Entity Item" is 763px breed, dus edge-to-edge over de hele kaart —
        anders dan de smallere, 40px-ingesprongen divider die de intro-sectie
        zelf al toont (683px, `FunnelSection`'s eigen ingebouwde divider).
        `-mx-6`/`-mx-10` alléén verschuift een `w-full`-element (breedte blijft
        100% van de reeds ingesprongen ouder, dus het schuift alleen naar
        links i.p.v. ook rechts door te lopen — vandaar de eerdere "loopt niet
        door"-fout). De `w-[calc(100%+3rem)]`/`...+5rem)` compenseert dat: de
        breedte wordt expliciet met exact 2x de opgeheven padding vergroot, dus
        de rand raakt nu écht beide kaartranden. `MultiEntityItem` heeft zelf
        al de bevestigde 40px binnenpadding (pad=16/40/16/40), dus na deze
        uitbraak precies één set inspringing i.p.v. dubbel opgeteld.
      */}
      <div className="flex w-[calc(100%+3rem)] flex-col items-start -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10">
        <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
        <MultiEntityItem
          state={state.products.opstal?.isComplete ? "completed" : "current"}
          icon={<img src="/icons/pictogram-house.svg" alt="" className="size-8" />}
          title="Opstalverzekering"
          description="Verzeker je woning voor bijvoorbeeld brand, storm of inbraak."
        />
      </div>

      <FunnelSection title="Gegevens">
        <InputDate
          labelText="Geboortedatum (dd-mm-jjjj)"
          showPickerButton
          value={geboortedatum}
          onChange={(value) => updateSharedData({ geboortedatum: value ? toIsoDatum(value) : "" })}
        />

        <div className="flex w-full flex-col items-start gap-4">
          <FieldsetAddress
            value={adres}
            onChange={(value) => updateSharedData({ postcode: value.postalCode, huisnummer: value.houseNumber, toevoeging: value.addition })}
          />
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
          onChange={(value) => updateSharedData({ soortWoning: value })}
        />

        <RadioGroup
          labelText="Heb je een koop- of huurwoning?"
          options={KOOP_HUUR_OPTIONS}
          value={koopHuur}
          onChange={(value) => updateSharedData({ koopHuur: value })}
        />

        <RadioGroup
          labelText="Gebruik je de woning particulier?"
          options={JA_NEE_OPTIONS}
          value={particulier}
          onChange={(value) => updateSharedData({ particulier: value })}
          horizontal
        />

        <RadioGroup
          labelText="Wat voor muren heeft je woning?"
          description="Geef aan van welk materiaal de muren van je woning zijn."
          options={MUREN_OPTIONS}
          value={muren}
          onChange={(value) => updateSharedData({ muren: value })}
        />

        <RadioGroup
          labelText="Is het dak van je woning schuin of plat?"
          description="Heb je beide? Kies dan het soort dak dat het grootste deel van je woning heeft."
          options={DAK_OPTIONS}
          value={dak}
          onChange={(value) => updateSharedData({ dak: value })}
        />

        <RadioGroup
          labelText="Heeft je woning een rieten dak?"
          options={JA_NEE_OPTIONS}
          value={rietenDak}
          onChange={(value) => updateSharedData({ rietenDak: value })}
          horizontal
        />
      </FunnelSection>

      {/*
        Bevestigd via mcp (node 1:36357): ook deze divider is 763px, edge-to-
        edge — `showDividerAbove` zou hier de smallere, ingesprongen variant
        geven. Zie de toelichting hierboven: `w-[calc(100%+...)]` i.p.v.
        `w-full`, anders schuift de divider alleen naar links i.p.v. ook
        rechts door te lopen.
      */}
      <div className="h-px w-[calc(100%+3rem)] shrink-0 bg-[rgba(0,0,0,0.08)] -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10" />

      <div ref={stelJeOpstalRef}>
        <FunnelSection title="Stel je opstalverzekering samen">
          {!isDataComplete ? (
            <Alert type="warning" title="Vul eerst alle gegevens in om je premie te berekenen" description="You can use a description to better explain the alert." />
          ) : showSkeleton ? (
            /**
             * Bevestigd via de Figma Make-broncode: 1 seconde lang een
             * pulserende skeleton i.p.v. direct de echte content, met
             * ongeveer dezelfde blokafmetingen als de content die hij
             * vervangt (titel + 2 kaarten naast elkaar + eigen-risico-blok +
             * Glas-blok).
             */
            <div className="flex w-full flex-col items-start gap-6" aria-hidden="true">
              <div className="h-7 w-[180px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
              <div className="flex w-full gap-4">
                <div className="h-80 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
                <div className="h-80 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              </div>
              <div className="flex w-full flex-col gap-3">
                <div className="h-7 w-[200px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
              </div>
              <div className="flex w-full flex-col gap-3">
                <div className="h-7 w-[280px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-20 w-full animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              </div>
            </div>
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
      </div>

      {/*
        Bevestigd via mcp: elke resterende-product-rij is z'n eigen "Multi
        Entity Section"-instance (Container = eigen 763px-brede divider +
        Multi Entity Item), niet één gedeelde divider bovenaan de hele lijst
        — vandaar een divider per rij i.p.v. één divider voor de volledige
        groep (het gerapporteerde "dividers lopen niet door"-probleem: elke
        divider moet zelf ook edge-to-edge zijn, niet alleen de bovenste).
      */}
      <div className="flex w-[calc(100%+3rem)] flex-col items-start -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10">
        {otherProductIds.map((id) => {
          const meta = getProductMeta(id);
          const status = getProductStatus(state, id);
          return (
            <div key={id} className="flex w-full flex-col items-start">
              <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
              <MultiEntityItem
                state={status === "completed" ? "completed" : "disabled"}
                icon={<img src={`/icons/${meta.icon}.svg`} alt="" className="size-8" />}
                title={meta.title}
                onRemove={() => handleRemoveProduct(id)}
              />
            </div>
          );
        })}
      </div>
    </FunnelPageTemplate>
  );
}
