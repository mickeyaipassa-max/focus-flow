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
import { SingleDekking } from "@/components/SingleDekking";
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
import { GEZINSSAMENSTELLING_OPTIONS, KOOP_HUUR_OPTIONS } from "../../woning-opties";

const WOON_STEPS = ["Productkeuze", "Premie berekenen", "Gegevens", "Laatste vragen", "Samenvatting"];

/** Bevestigd via mcp (node 181:7475): het basispakket, altijd inbegrepen — geen tweede keuzeoptie zichtbaar (de tweede "Radio Card Control Bottom"-instance in dezelfde node staat op hidden, op verzoek genegeerd). */
const BASISPAKKET_PRICE = 13.37;
const BASISPAKKET_ITEMS = [
  "...over een aankoop van goederen en diensten",
  "...over gezondheid en contracten",
  "...over je (vakantie)woning in Nederland",
  "...over sociale zekerheid en pensioen",
  "... met een financiële instelling",
  ".... met een onderwijsinstelling",
  "... met de buren",
  "... de overheid als het gaat over een beslissing over je woning",
];

/** Prijzen 1:1 uit Figma (node 181:7478, "Checkbox Card Control Left Group"). */
const AANVULLENDE_DEKKINGEN_PRICES: Record<string, number> = {
  "verkeer-vakantie": 2.8,
  "persoon-familie": 6.99,
  werk: 12.57,
  "fiscaal-vermogen": 3.35,
};

export default function RechtsbijstandPremieBerekenenPage() {
  const router = useRouter();
  const { state, setState } = useWoonverzekeringenFunnel();

  /** Zelfde `updateSharedData`-patroon als de andere productpagina's. */
  function updateSharedData(patch: Partial<WoonverzekeringenSharedData>) {
    setState({ ...state, sharedData: { ...state.sharedData, ...patch } });
  }

  const geboortedatum = fromIsoDatum(state.sharedData.geboortedatum);
  const adres: FieldsetAddressValue = {
    postalCode: state.sharedData.postcode,
    houseNumber: state.sharedData.huisnummer,
    addition: state.sharedData.toevoeging,
  };
  const { gezinssamenstelling, koopHuur } = state.sharedData;
  const addressResolved = adres.postalCode.trim().length >= 6 && adres.houseNumber.trim().length > 0;

  const [aanvullendeDekkingen, setAanvullendeDekkingen] = useState<string[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const stelJeRechtsbijstandRef = useRef<HTMLDivElement>(null);

  /**
   * Bevestigd via mcp (node 180:4566, Rechtsbijstand's "Gegevens"-sectie):
   * alleen gezinssamenstelling, geboortedatum, koop-/huurwoning en adres —
   * geen soortWoning/particulier/muren/dak/rietenDak zoals Opstal, dus een
   * kortere lijst dan de andere productpagina's.
   */
  const isDataComplete = Boolean(gezinssamenstelling && geboortedatum && koopHuur && addressResolved);
  /** Zelfde initialisatie-op-huidige-waarde als de andere productpagina's — voorkomt de skeleton+scroll-flits als deze pagina al meteen compleet binnenkomt. */
  const wasDataComplete = useRef(isDataComplete);

  useEffect(() => {
    if (isDataComplete && !wasDataComplete.current) {
      setShowSkeleton(true);
      requestAnimationFrame(() => {
        const top = stelJeRechtsbijstandRef.current?.getBoundingClientRect().top;
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

  const aanvullendeDekkingenPrice = aanvullendeDekkingen.reduce((sum, value) => sum + (AANVULLENDE_DEKKINGEN_PRICES[value] ?? 0), 0);
  const totalPrice = BASISPAKKET_PRICE + aanvullendeDekkingenPrice;

  /** Zet Rechtsbijstand's premie reactief door naar de gedeelde state — zelfde patroon als de andere productpagina's. */
  useEffect(() => {
    const premium = isDataComplete ? totalPrice : null;
    if (state.products.rechtsbijstand?.premium === premium) return;
    setState({
      ...state,
      products: { ...state.products, rechtsbijstand: { premium, isComplete: state.products.rechtsbijstand?.isComplete ?? false } },
    });
  }, [isDataComplete, totalPrice, state, setState]);

  const rechtsbijstandSection: ReceiptSection = useMemo(() => {
    if (!isDataComplete) {
      return {
        id: "rechtsbijstand",
        title: "Rechtsbijstand",
        amount: "€ -,--",
        icon: <img src="/icons/pictogram-rechtsbijstandsverzekering.svg" alt="" className="size-8" />,
        groups: [{ items: [{ label: "Beantwoord de vragen om de premie te zien" }] }],
      };
    }
    const aanvullendeItems = Object.entries(AANVULLENDE_DEKKINGEN_PRICES)
      .filter(([value]) => aanvullendeDekkingen.includes(value))
      .map(([, price]) => price);
    const labels: Record<string, string> = {
      "verkeer-vakantie": "Verkeer & Vakantie",
      "persoon-familie": "Persoon & Familie",
      werk: "Werk",
      "fiscaal-vermogen": "Fiscaal & Vermogen",
    };
    return {
      id: "rechtsbijstand",
      title: "Rechtsbijstand",
      amount: formatEuro(totalPrice),
      icon: <img src="/icons/pictogram-rechtsbijstandsverzekering.svg" alt="" className="size-8" />,
      groups: [
        { title: "Dekking", items: [{ label: "Consument & Wonen", amount: formatEuro(BASISPAKKET_PRICE) }] },
        ...(aanvullendeItems.length > 0
          ? [
              {
                title: "Aanvullende dekkingen",
                items: aanvullendeDekkingen.map((value) => ({ label: labels[value], amount: formatEuro(AANVULLENDE_DEKKINGEN_PRICES[value] ?? 0) })),
              },
            ]
          : []),
      ],
    };
  }, [isDataComplete, aanvullendeDekkingen, totalPrice]);

  const otherProductIds = state.selectedProducts.filter((id) => id !== "rechtsbijstand");
  const completedBeforeSelf = otherProductIds.filter((id) => getProductStatus(state, id) === "completed");
  const remainingAfterSelf = otherProductIds.filter((id) => getProductStatus(state, id) !== "completed");

  const receiptSections: ReceiptSection[] = [
    ...completedBeforeSelf.map((id) => buildOtherProductReceiptSection(state, id)),
    rechtsbijstandSection,
    ...remainingAfterSelf.map((id) => buildOtherProductReceiptSection(state, id)),
  ];

  const summaryAmount = isDataComplete || getTotalPremium(state) > 0 ? formatEuro(getTotalPremium(state)) : "€ -,--";

  const nextProductId = remainingAfterSelf[0] ?? null;
  const nextLabel = nextProductId ? `verder met ${getProductMeta(nextProductId).shortTitle}` : "Volgende stap";

  const previousProductId = (() => {
    const index = state.selectedProducts.indexOf("rechtsbijstand");
    return index > 0 ? state.selectedProducts[index - 1] : null;
  })();
  const previousRoute = (previousProductId && PRODUCT_ROUTES[previousProductId]) || "/woonverzekeringen";

  function handlePrevious() {
    router.push(previousRoute);
  }

  function handleBackToProductkeuze() {
    router.push("/woonverzekeringen");
  }

  function handleRemoveProduct(id: WoonverzekeringenProductId) {
    const { [id]: _removed, ...remainingProductStates } = state.products;
    setState({
      ...state,
      selectedProducts: state.selectedProducts.filter((productId) => productId !== id),
      products: remainingProductStates,
    });
  }

  function handleRemoveSelf() {
    const { rechtsbijstand: _removed, ...remainingProductStates } = state.products;
    setState({
      ...state,
      selectedProducts: state.selectedProducts.filter((productId) => productId !== "rechtsbijstand"),
      products: remainingProductStates,
    });
    router.push("/woonverzekeringen");
  }

  function handleNext() {
    setState({
      ...state,
      products: { ...state.products, rechtsbijstand: { premium: state.products.rechtsbijstand?.premium ?? null, isComplete: true } },
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
        <Receipt sections={receiptSections} type="collapsable" defaultActiveSectionId="rechtsbijstand" summaryAmount={summaryAmount} />
      }
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
        <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
        <MultiEntityItem
          state="current"
          icon={<img src="/icons/pictogram-rechtsbijstandsverzekering.svg" alt="" className="size-8" />}
          title="Rechtsbijstandsverzekering"
          description="Bereken je premie"
          actions={[{ label: "Verwijder", onClick: handleRemoveSelf }]}
        />
      </div>

      {/* Volledig overgeslagen zodra alle velden hieronder al uit een eerder product bekend zijn (rationale punt 11/12). */}
      {!isDataComplete && (
        <FunnelSection title="Gegevens">
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

          {!koopHuur && (
            <RadioGroup
              labelText="Koop- of huurwoning"
              options={KOOP_HUUR_OPTIONS}
              value={koopHuur}
              onChange={(value) => updateSharedData({ koopHuur: value })}
              horizontal
            />
          )}

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
        </FunnelSection>
      )}

      <div className="h-px w-[calc(100%+3rem)] shrink-0 bg-[rgba(0,0,0,0.08)] -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10" />

      <div ref={stelJeRechtsbijstandRef}>
        <FunnelSection title="Stel je Rechtsbijstandsverzekering samen">
          {!isDataComplete ? (
            <Alert
              type="warning"
              title="Vul eerst alle gegevens in om je premie te berekenen"
              description="You can use a description to better explain the alert."
            />
          ) : showSkeleton ? (
            <div className="flex w-full flex-col items-start gap-6" aria-hidden="true">
              <div className="h-96 w-full animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              <div className="flex w-full flex-col gap-3">
                <div className="h-7 w-[280px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-20 w-full animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
                <div className="h-20 w-full animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              </div>
            </div>
          ) : (
            <>
              <SingleDekking
                title="Consument & Wonen"
                description="Juridische hulp bij conflicten..."
                items={BASISPAKKET_ITEMS}
                price={BASISPAKKET_PRICE.toFixed(2).replace(".", ",")}
                onTermsClick={() => {}}
              />
              <CheckboxCardControlLeftGroup
                labelText="Kies je aanvullende dekkingen"
                options={[
                  {
                    value: "verkeer-vakantie",
                    title: "Verkeer & Vakantie",
                    price: formatEuro(AANVULLENDE_DEKKINGEN_PRICES["verkeer-vakantie"]).replace("€ ", ""),
                  },
                  {
                    value: "persoon-familie",
                    title: "Persoon & Familie",
                    price: formatEuro(AANVULLENDE_DEKKINGEN_PRICES["persoon-familie"]).replace("€ ", ""),
                  },
                  {
                    value: "werk",
                    title: "Werk",
                    price: formatEuro(AANVULLENDE_DEKKINGEN_PRICES["werk"]).replace("€ ", ""),
                  },
                  {
                    value: "fiscaal-vermogen",
                    title: "Fiscaal & Vermogen",
                    price: formatEuro(AANVULLENDE_DEKKINGEN_PRICES["fiscaal-vermogen"]).replace("€ ", ""),
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
