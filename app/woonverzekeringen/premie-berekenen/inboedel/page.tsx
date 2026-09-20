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
import { Select } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
import { Alert } from "@/components/Alert";
import { Receipt, type ReceiptSection } from "@/components/Receipt";
import { Icon } from "@/components/Icon";
import {
  buildOtherProductReceiptSection,
  fromIsoDatum,
  getProductStatus,
  getTotalPremium,
  toIsoDatum,
  useWoonverzekeringenFunnel,
  type WoonverzekeringenSharedData,
} from "../../funnel-context";
import { formatEuro, getProductMeta, PRODUCT_ROUTES, type WoonverzekeringenProductId } from "../../products";
import {
  DAK_OPTIONS,
  EIGEN_RISICO_OPTIONS,
  GEZINSSAMENSTELLING_OPTIONS,
  JA_NEE_OPTIONS,
  KOOP_HUUR_OPTIONS,
  MUREN_OPTIONS,
  SOORT_WONING_OPTIONS,
} from "../../woning-opties";

const WOON_STEPS = ["Productkeuze", "Premie berekenen", "Gegevens", "Laatste vragen", "Samenvatting"];

const INBOEDEL_FEATURES = [
  "Brand, bliksem en rook",
  "Storm, neerslag en lekkage",
  "Diefstal, inbraak en vandalisme",
  "Cybercriminaliteit zoals phishing",
  "Ongelukjes zoals vallen en stoten",
];

/**
 * Prijzen 1:1 uit Figma ("Radio Card Control Bottom Group", node 88:3914):
 * Basis € 4,82, Allrisk € 5,20 — exact dezelfde bedragen als Opstal's eigen
 * Basis/Allrisk-kaart. Geen bevestigde reden gevonden of dit bewust is of
 * een gekopieerde placeholder — niet zelf gecorrigeerd, zie ook de
 * toelichting in `premie-berekenen/page.tsx` over de vergelijkbare
 * prijs-discrepantie daar.
 */
const DEKKING_OPTIES: RadioCardBottomOption[] = [
  {
    value: "basis",
    title: "Basis",
    description: "Inboedelverzekering",
    features: INBOEDEL_FEATURES.map((text, index) => ({ text, included: index < 4 })),
    price: "4,82",
  },
  {
    value: "allrisk",
    title: "Allrisk",
    description: "Inboedelverzekering",
    features: INBOEDEL_FEATURES.map((text) => ({ text, included: true })),
    price: "5,20",
  },
];

/** Bevestigd via mcp op de "Checkbox Card Control Left"-kaarten (node 88:3925/88:3926). */
const MOBIELE_ELEKTRONICA_PRICE = 9.68;
const WAARDEVOLLE_SPULLEN_PRICE = 5.3;

export default function InboedelPremieBerekenenPage() {
  const router = useRouter();
  const { state, setState } = useWoonverzekeringenFunnel();

  /** Zelfde `updateSharedData`-patroon als de Opstal-pagina — één bron van waarheid voor de velden die meerdere producten hergebruiken. */
  function updateSharedData(patch: Partial<WoonverzekeringenSharedData>) {
    setState({ ...state, sharedData: { ...state.sharedData, ...patch } });
  }

  const geboortedatum = fromIsoDatum(state.sharedData.geboortedatum);
  const adres: FieldsetAddressValue = {
    postalCode: state.sharedData.postcode,
    houseNumber: state.sharedData.huisnummer,
    addition: state.sharedData.toevoeging,
  };
  const { gezinssamenstelling, soortWoning, koopHuur, particulier, muren, dak, rietenDak } = state.sharedData;
  const addressResolved = adres.postalCode.trim().length >= 6 && adres.houseNumber.trim().length > 0;

  /**
   * Bevestigd via mcp dat "Je woning" letterlijk dezelfde velden vraagt als
   * Opstal's "Gegevens"-sectie (node 92:3277) — dus als Opstal die al heeft
   * verzameld, mogen ze hier niet opnieuw gevraagd worden (rationale punt
   * 11/12: de vraag wordt dan volledig overgeslagen, niet nogmaals getoond).
   * Zodra alle "Je woning"-velden al bekend zijn, vervalt de hele sectie
   * (inclusief kop) — is Inboedel het éérste product (geen Opstal ervoor),
   * dan zijn ze allemaal leeg en toont deze pagina exact dezelfde vragen als
   * Opstal nu zelf al doet, dus de functionaliteit blijft ook dan compleet.
   */
  const woningAlleGegevensBekend = Boolean(addressResolved && soortWoning && koopHuur && particulier && muren && dak && rietenDak);
  /** Zelfde soort volledig-overslaan als `woningAlleGegevensBekend` hierboven, nu voor "Persoonlijke gegevens" — beide velden zijn inmiddels gedeeld (`gezinssamenstelling` bleek ook door Aansprakelijkheid gevraagd te worden). */
  const persoonlijkeGegevensBekend = Boolean(gezinssamenstelling && geboortedatum);

  const [dekking, setDekking] = useState("");
  const [eigenRisico, setEigenRisico] = useState("");
  const [aanvullendeDekkingen, setAanvullendeDekkingen] = useState<string[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const stelJeInboedelRef = useRef<HTMLDivElement>(null);

  const isDataComplete = Boolean(
    gezinssamenstelling && geboortedatum && addressResolved && soortWoning && koopHuur && particulier && muren && dak && rietenDak,
  );
  /**
   * Geïnitialiseerd op de huidige waarde (niet altijd `false`) — anders
   * vuurt de skeleton+scroll-animatie hieronder ook bij een pagina die al
   * meteen compleet binnenkomt (alles al bekend uit eerdere producten), wat
   * een ongewenste flits zou geven waar de gebruiker niets voor deed. Zo
   * blijft de animatie voorbehouden aan een écht live overgang tijdens het
   * invullen op déze pagina.
   */
  const wasDataComplete = useRef(isDataComplete);

  /** Zelfde skeleton+scroll-animatie als de Opstal-pagina (bevestigd via de Figma Make-broncode voor dat product) — hier hergebruikt voor consistentie tussen productpagina's. */
  useEffect(() => {
    if (isDataComplete && !wasDataComplete.current) {
      setShowSkeleton(true);
      requestAnimationFrame(() => {
        const top = stelJeInboedelRef.current?.getBoundingClientRect().top;
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
  const mobieleElektronicaPrice = aanvullendeDekkingen.includes("mobiele-elektronica") ? MOBIELE_ELEKTRONICA_PRICE : 0;
  const waardevolleSpullenPrice = aanvullendeDekkingen.includes("waardevolle-spullen") ? WAARDEVOLLE_SPULLEN_PRICE : 0;
  const totalPrice = coveragePrice + mobieleElektronicaPrice + waardevolleSpullenPrice;

  /** Zet Inboedel's premie reactief door naar de gedeelde state — zelfde patroon als Opstal. */
  useEffect(() => {
    const premium = isDataComplete ? totalPrice : null;
    if (state.products.inboedel?.premium === premium) return;
    setState({
      ...state,
      products: { ...state.products, inboedel: { premium, isComplete: state.products.inboedel?.isComplete ?? false } },
    });
  }, [isDataComplete, totalPrice, state, setState]);

  const inboedelSection: ReceiptSection = useMemo(() => {
    if (!isDataComplete) {
      return {
        id: "inboedel",
        title: "Inboedel",
        amount: "€ -,--",
        icon: <img src="/icons/pictogram-inboedel.svg" alt="" className="size-8" />,
        groups: [{ items: [{ label: "Beantwoord de vragen om de premie te zien" }] }],
      };
    }
    const dekkingOptie = DEKKING_OPTIES.find((optie) => optie.value === dekking);
    const aanvullendeItems = [
      ...(mobieleElektronicaPrice > 0 ? [{ label: "Mobiele elektronica", amount: formatEuro(mobieleElektronicaPrice) }] : []),
      ...(waardevolleSpullenPrice > 0 ? [{ label: "Waardevolle spullen buitenshuis", amount: formatEuro(waardevolleSpullenPrice) }] : []),
    ];
    return {
      id: "inboedel",
      title: "Inboedel",
      amount: formatEuro(totalPrice),
      icon: <img src="/icons/pictogram-inboedel.svg" alt="" className="size-8" />,
      groups: [
        {
          title: "Dekking",
          items: [
            { label: dekkingOptie?.title ?? "", amount: formatEuro(coveragePrice) },
            { label: `Eigen risico € ${eigenRisico}` },
          ],
        },
        ...(aanvullendeItems.length > 0 ? [{ title: "Aanvullende dekkingen", items: aanvullendeItems }] : []),
      ],
    };
  }, [isDataComplete, dekking, eigenRisico, mobieleElektronicaPrice, waardevolleSpullenPrice, totalPrice, coveragePrice]);

  /**
   * Bevestigd via mcp: afgeronde producten staan bóven het actieve product
   * (rationale punt 6), nog niet begonnen producten eronder — anders dan de
   * Opstal-pagina (altijd het eerste product, dus nooit een "completed
   * hierboven"-geval) moet Inboedel dit wél generiek afhandelen, want Opstal
   * kan al afgerond zijn tegen de tijd dat de gebruiker hier is.
   */
  const otherProductIds = state.selectedProducts.filter((id) => id !== "inboedel");
  const completedBeforeSelf = otherProductIds.filter((id) => getProductStatus(state, id) === "completed");
  const remainingAfterSelf = otherProductIds.filter((id) => getProductStatus(state, id) !== "completed");

  const receiptSections: ReceiptSection[] = [
    ...completedBeforeSelf.map((id) => buildOtherProductReceiptSection(state, id)),
    inboedelSection,
    ...remainingAfterSelf.map((id) => buildOtherProductReceiptSection(state, id)),
  ];

  const summaryAmount = isDataComplete || getTotalPremium(state) > 0 ? formatEuro(getTotalPremium(state)) : "€ -,--";

  const nextProductId = remainingAfterSelf[0] ?? null;
  const nextLabel = nextProductId ? `verder met ${getProductMeta(nextProductId).shortTitle}` : "Volgende stap";

  /**
   * De vorige stap in de flow is het product vlak vóór Inboedel in de
   * stap-1-selectie — alleen Opstal heeft vooralsnog een echte route
   * (`PRODUCT_ROUTES`), dus zonder voorganger of zonder gebouwde route valt
   * dit terug op stap 1.
   */
  const previousProductId = (() => {
    const index = state.selectedProducts.indexOf("inboedel");
    return index > 0 ? state.selectedProducts[index - 1] : null;
  })();
  const previousRoute = (previousProductId && PRODUCT_ROUTES[previousProductId]) || "/woonverzekeringen";

  function handlePrevious() {
    router.push(previousRoute);
  }

  function handleBackToProductkeuze() {
    router.push("/woonverzekeringen");
  }

  /** Haalt een ánder product uit de selectie — de "Verwijder"-knop op de resterende-producten-rijen. */
  function handleRemoveProduct(id: WoonverzekeringenProductId) {
    const { [id]: _removed, ...remainingProductStates } = state.products;
    setState({
      ...state,
      selectedProducts: state.selectedProducts.filter((productId) => productId !== id),
      products: remainingProductStates,
    });
  }

  /**
   * Haalt Inboedel zelf uit de selectie — bevestigd via mcp dat de
   * current-state van "Multi Product Flow Item" (i.p.v. Opstal's eigen,
   * onopgeloste "Multi Entity Item"-knop) hier wél een echte "Verwijder"-
   * tekst heeft. Navigeert daarna terug naar stap 1, want deze pagina heeft
   * na verwijdering geen bestaansreden meer.
   */
  function handleRemoveSelf() {
    const { inboedel: _removed, ...remainingProductStates } = state.products;
    setState({
      ...state,
      selectedProducts: state.selectedProducts.filter((productId) => productId !== "inboedel"),
      products: remainingProductStates,
    });
    router.push("/woonverzekeringen");
  }

  /**
   * Zet Inboedel op "afgerond" zodra de gebruiker verdergaat — zelfde
   * moment als Opstal (rationale punt 9), niet al zodra het formulier
   * toevallig vol is.
   */
  function handleNext() {
    setState({
      ...state,
      products: { ...state.products, inboedel: { premium: state.products.inboedel?.premium ?? null, isComplete: true } },
    });
  }

  return (
    <FunnelPageTemplate
      headerTitle="Woonverzekeringen"
      ikzSticker
      steps={WOON_STEPS}
      activeStep={2}
      sidebarClassName="w-full"
      sidebar={<Receipt sections={receiptSections} type="collapsable" defaultActiveSectionId="inboedel" summaryAmount={summaryAmount} />}
      navigation={
        <FormNavigation previousStep previousLabel="Vorige stap" nextLabel={nextLabel} onPrevious={handlePrevious} onNext={handleNext} />
      }
    >
      <button type="button" onClick={handleBackToProductkeuze} className="flex items-center gap-2 rounded-[3px]">
        <Icon name="arrow-left" size="sm" />
        <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
          Terug naar productkeuze
        </span>
      </button>

      {/* Bevestigd via mcp (node 1:38906): ook hier "* Verplichte velden", zelfde variant als stap 1 en Opstal. */}
      <FunnelSection
        intro
        title="Bereken je premie"
        hideIntroDivider
        showRequiredFieldsNote
        requiredFieldsNote={
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="text-[#ce0a1e] text-base" style={{ fontFamily: "var(--font-avenir-book)" }}>
              *
            </span>
            <span className="text-black text-sm" style={{ fontFamily: "var(--font-avenir-book)" }}>
              Verplichte velden
            </span>
          </div>
        }
      />

      {/*
        Zelfde full-bleed-uitbraak als de Opstal-pagina (zie de toelichting
        daar) — hier bovendien met eventuele al afgeronde producten (bv.
        Opstal) bóven het huidige Inboedel-item, bevestigd als de juiste
        volgorde (rationale punt 6).
      */}
      <div className="flex w-[calc(100%+3rem)] flex-col items-start -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10">
        {completedBeforeSelf.map((id) => {
          const meta = getProductMeta(id);
          const route = PRODUCT_ROUTES[id];
          return (
            <div key={id} className="flex w-full flex-col items-start">
              <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
              <MultiEntityItem
                state="completed"
                icon={<img src={`/icons/${meta.icon}.svg`} alt="" className="size-8" />}
                title={meta.title}
                description={meta.description}
                actions={[{ label: "Wijzig", onClick: () => (route ? router.push(route) : undefined) }]}
              />
            </div>
          );
        })}
        {/*
          Altijd "current" (geel) — dit ís de pagina waar de gebruiker nu op
          zit, ongeacht of `isComplete` al eerder op `true` stond (bv. na
          "verder met ..." zonder dat de vervolgpagina al bestaat, waardoor
          je op dezelfde pagina blijft). "Completed" (wit met groen bolletje)
          hoort alleen te tonen voor dit product op een ándere productpagina
          (zie `completedBeforeSelf` hierboven), niet op zijn eigen pagina.
        */}
        <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
        <MultiEntityItem
          state="current"
          icon={<img src="/icons/pictogram-inboedel.svg" alt="" className="size-8" />}
          title="Inboedelverzekering"
          description="Bereken je premie"
          actions={[{ label: "Verwijder", onClick: handleRemoveSelf }]}
        />
      </div>

      {!persoonlijkeGegevensBekend && (
        <FunnelSection title="Persoonlijke gegevens">
          {!gezinssamenstelling && (
            <Select
              labelText="Hoe is je gezin samengesteld?"
              options={GEZINSSAMENSTELLING_OPTIONS}
              value={gezinssamenstelling}
              onChange={(value) => updateSharedData({ gezinssamenstelling: value })}
            />
          )}
          {!geboortedatum && (
            <InputDate
              labelText="Geboortedatum (dd-mm-jjjj)"
              showPickerButton
              value={geboortedatum}
              onChange={(value) => updateSharedData({ geboortedatum: value ? toIsoDatum(value) : "" })}
            />
          )}
        </FunnelSection>
      )}

      {!woningAlleGegevensBekend && (
        <FunnelSection title="Je woning" showDividerAbove>
          {!addressResolved ? (
            <FieldsetAddress
              value={adres}
              onChange={(value) => updateSharedData({ postcode: value.postalCode, huisnummer: value.houseNumber, toevoeging: value.addition })}
            />
          ) : (
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

          {!soortWoning && (
            <Select
              labelText="Wat voor soort woning heb je?"
              description="Je kunt geen recreatiewoning, woonboot, studentenkamer, monument of bedrijfspand bij ons verzekeren."
              options={SOORT_WONING_OPTIONS}
              value={soortWoning}
              onChange={(value) => updateSharedData({ soortWoning: value })}
            />
          )}

          {!koopHuur && (
            <RadioGroup
              labelText="Heb je een koop- of huurwoning?"
              options={KOOP_HUUR_OPTIONS}
              value={koopHuur}
              onChange={(value) => updateSharedData({ koopHuur: value })}
            />
          )}

          {!particulier && (
            <RadioGroup
              labelText="Gebruik je de woning particulier?"
              options={JA_NEE_OPTIONS}
              value={particulier}
              onChange={(value) => updateSharedData({ particulier: value })}
              horizontal
            />
          )}

          {!muren && (
            <RadioGroup
              labelText="Wat voor muren heeft je woning?"
              description="Geef aan van welk materiaal de muren van je woning zijn."
              options={MUREN_OPTIONS}
              value={muren}
              onChange={(value) => updateSharedData({ muren: value })}
            />
          )}

          {!dak && (
            <RadioGroup
              labelText="Is het dak van je woning schuin of plat?"
              description="Heb je beide? Kies dan het soort dak dat het grootste deel van je woning heeft."
              options={DAK_OPTIONS}
              value={dak}
              onChange={(value) => updateSharedData({ dak: value })}
            />
          )}

          {!rietenDak && (
            <RadioGroup
              labelText="Heeft je woning een rieten dak?"
              options={JA_NEE_OPTIONS}
              value={rietenDak}
              onChange={(value) => updateSharedData({ rietenDak: value })}
              horizontal
            />
          )}
        </FunnelSection>
      )}

      {/* Zelfde edge-to-edge divider als vóór Opstal's "Stel je ... samen" — zie de toelichting op die pagina. */}
      <div className="h-px w-[calc(100%+3rem)] shrink-0 bg-[rgba(0,0,0,0.08)] -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10" />

      <div ref={stelJeInboedelRef}>
        <FunnelSection title="Stel je inboedelverzekering samen">
          {!isDataComplete ? (
            <Alert
              type="warning"
              title="Vul eerst alle gegevens in om je premie te berekenen"
              description="You can use a description to better explain the alert."
            />
          ) : showSkeleton ? (
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
                labelText="Welke aanvullende dekkingen wil je?"
                options={[
                  {
                    value: "mobiele-elektronica",
                    title: "Mobiele elektronica",
                    description:
                      "Al je mobiele apparaten zoals je telefoon verzekerd voor onverwachte gebeurtenissen zoals vallen of diefstal. Overal ter wereld.",
                    price: formatEuro(MOBIELE_ELEKTRONICA_PRICE).replace("€ ", ""),
                  },
                  {
                    value: "waardevolle-spullen",
                    title: "Waardevolle spullen buitenshuis",
                    description: "Je waardevolle spullen niet alleen binnenshuis maar overal ter wereld verzekerd voor beschadiging, diefstal of verlies.",
                    price: formatEuro(WAARDEVOLLE_SPULLEN_PRICE).replace("€ ", ""),
                  },
                ]}
                values={aanvullendeDekkingen}
                onChange={setAanvullendeDekkingen}
                onMoreInfoClick={() => {}}
              />
            </>
          )}
        </FunnelSection>
      </div>

      <div className="flex w-[calc(100%+3rem)] flex-col items-start -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10">
        {remainingAfterSelf.map((id) => {
          const meta = getProductMeta(id);
          return (
            <div key={id} className="flex w-full flex-col items-start">
              <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
              <MultiEntityItem
                state="disabled"
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
