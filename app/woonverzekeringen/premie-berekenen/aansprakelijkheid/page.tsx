"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { MultiEntityItem } from "@/components/MultiEntityItem";
import { InputDate } from "@/components/InputDate";
import { Select } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
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
import { EIGEN_RISICO_OPTIONS, GEZINSSAMENSTELLING_OPTIONS } from "../../woning-opties";

const WOON_STEPS = ["Productkeuze", "Premie berekenen", "Gegevens", "Laatste vragen", "Samenvatting"];

/**
 * Bedragen expliciet door de opdrachtgever doorgegeven (niet uit Figma): de
 * "Kies een maximaal verzekerd bedrag"-kaarten (node
 * 180:5051;10783:74593;1099:302;11092:3714/3715) tonen zelf geen prijs — geen
 * enkele mcp-node voor Aansprakelijkheid liet een bedrag zien (in
 * tegenstelling tot Opstal/Inboedel). Het gekozen eigen risico verandert de
 * premie niet — daar is ook geen bedrag voor doorgegeven, zelfde behandeling
 * als Inboedel's eigen risico (alleen getoond in de kassabon, niet geprijsd).
 */
const MAXIMAAL_VERZEKERD_OPTIES: RadioCardBottomOption[] = [
  { value: "1250000", title: "Tot € 1.250.000" },
  { value: "2500000", title: "Tot € 2.500.000" },
];
const MAXIMAAL_VERZEKERD_PRICES: Record<string, number> = {
  "1250000": 4.5,
  "2500000": 6.2,
};

export default function AansprakelijkheidPremieBerekenenPage() {
  const router = useRouter();
  const { state, setState } = useWoonverzekeringenFunnel();

  /** Zelfde `updateSharedData`-patroon als de Opstal-/Inboedel-pagina's. */
  function updateSharedData(patch: Partial<WoonverzekeringenSharedData>) {
    setState({ ...state, sharedData: { ...state.sharedData, ...patch } });
  }

  const geboortedatum = fromIsoDatum(state.sharedData.geboortedatum);

  /** Écht Aansprakelijkheid-specifiek — bewust lokale state, niet in `sharedData` (rationale punt 13). */
  const [gezinssamenstelling, setGezinssamenstelling] = useState("");
  const [maximaalVerzekerd, setMaximaalVerzekerd] = useState("");
  const [eigenRisico, setEigenRisico] = useState("");
  const [showSkeleton, setShowSkeleton] = useState(false);
  const stelJeAansprakelijkheidRef = useRef<HTMLDivElement>(null);
  const wasDataComplete = useRef(false);

  /**
   * Zelfde patroon als Opstal/Inboedel: `isDataComplete` bewaakt alleen de
   * "Gegevens"-sectie (de gegevens vóór de coveragekeuze) — de keuzes in
   * "Stel je ... samen" zelf (hier: maximaal verzekerd bedrag, eigen risico)
   * horen daar niet bij, want die worden pas zichtbaar/ingevuld nádat deze
   * sectie al compleet is.
   */
  const isDataComplete = Boolean(gezinssamenstelling && geboortedatum);

  /** Zelfde skeleton+scroll-animatie als de Opstal-/Inboedel-pagina's. */
  useEffect(() => {
    if (isDataComplete && !wasDataComplete.current) {
      setShowSkeleton(true);
      requestAnimationFrame(() => {
        const top = stelJeAansprakelijkheidRef.current?.getBoundingClientRect().top;
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

  const coveragePrice = MAXIMAAL_VERZEKERD_PRICES[maximaalVerzekerd] ?? 0;
  const totalPrice = coveragePrice;

  /** Zet Aansprakelijkheid's premie reactief door naar de gedeelde state — zelfde patroon als Opstal/Inboedel. */
  useEffect(() => {
    const premium = isDataComplete ? totalPrice : null;
    if (state.products.aansprakelijkheid?.premium === premium) return;
    setState({
      ...state,
      products: { ...state.products, aansprakelijkheid: { premium, isComplete: state.products.aansprakelijkheid?.isComplete ?? false } },
    });
  }, [isDataComplete, totalPrice, state, setState]);

  const aansprakelijkheidSection: ReceiptSection = useMemo(() => {
    if (!isDataComplete) {
      return {
        id: "aansprakelijkheid",
        title: "Aansprakelijkheid",
        amount: "€ -,--",
        icon: <img src="/icons/pictogram-aansprakelijkheidsverzekering.svg" alt="" className="size-8" />,
        groups: [{ items: [{ label: "Beantwoord de vragen om de premie te zien" }] }],
      };
    }
    const optie = MAXIMAAL_VERZEKERD_OPTIES.find((option) => option.value === maximaalVerzekerd);
    return {
      id: "aansprakelijkheid",
      title: "Aansprakelijkheid",
      amount: formatEuro(totalPrice),
      icon: <img src="/icons/pictogram-aansprakelijkheidsverzekering.svg" alt="" className="size-8" />,
      groups: [
        {
          title: "Dekking",
          items: [
            { label: optie?.title ?? "", amount: formatEuro(coveragePrice) },
            { label: `Eigen risico € ${eigenRisico}` },
          ],
        },
      ],
    };
  }, [isDataComplete, maximaalVerzekerd, eigenRisico, totalPrice, coveragePrice]);

  /** Zelfde completed-boven/upcoming-onder-logica als Inboedel (rationale punt 6). */
  const otherProductIds = state.selectedProducts.filter((id) => id !== "aansprakelijkheid");
  const completedBeforeSelf = otherProductIds.filter((id) => getProductStatus(state, id) === "completed");
  const remainingAfterSelf = otherProductIds.filter((id) => getProductStatus(state, id) !== "completed");

  const receiptSections: ReceiptSection[] = [
    ...completedBeforeSelf.map((id) => buildOtherProductReceiptSection(state, id)),
    aansprakelijkheidSection,
    ...remainingAfterSelf.map((id) => buildOtherProductReceiptSection(state, id)),
  ];

  const summaryAmount = isDataComplete || getTotalPremium(state) > 0 ? formatEuro(getTotalPremium(state)) : "€ -,--";

  const nextProductId = remainingAfterSelf[0] ?? null;
  const nextLabel = nextProductId ? `verder met ${getProductMeta(nextProductId).shortTitle}` : "Volgende stap";

  const previousProductId = (() => {
    const index = state.selectedProducts.indexOf("aansprakelijkheid");
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
    const { aansprakelijkheid: _removed, ...remainingProductStates } = state.products;
    setState({
      ...state,
      selectedProducts: state.selectedProducts.filter((productId) => productId !== "aansprakelijkheid"),
      products: remainingProductStates,
    });
    router.push("/woonverzekeringen");
  }

  function handleNext() {
    setState({
      ...state,
      products: { ...state.products, aansprakelijkheid: { premium: state.products.aansprakelijkheid?.premium ?? null, isComplete: true } },
    });
  }

  return (
    <FunnelPageTemplate
      headerTitle="Woonverzekeringen"
      ikzSticker
      steps={WOON_STEPS}
      activeStep={2}
      sidebarClassName="w-full"
      sidebar={<Receipt sections={receiptSections} type="collapsable" defaultActiveSectionId="aansprakelijkheid" summaryAmount={summaryAmount} />}
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

      {/* Zelfde full-bleed-uitbraak als Opstal/Inboedel, met eventuele al afgeronde producten bóven het huidige item (rationale punt 6). */}
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
        {/* Altijd "current" (geel) — dit ís de pagina waar de gebruiker nu op zit, zelfde redenering als Opstal/Inboedel. */}
        <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
        <MultiEntityItem
          state="current"
          icon={<img src="/icons/pictogram-aansprakelijkheidsverzekering.svg" alt="" className="size-8" />}
          title="Aansprakelijkheidsverzekering"
          description="Bereken je premie"
          actions={[{ label: "Verwijder", onClick: handleRemoveSelf }]}
        />
      </div>

      <FunnelSection title="Gegevens">
        {!gezinssamenstelling && (
          <Select
            labelText="Hoe is je gezin samengesteld?"
            options={GEZINSSAMENSTELLING_OPTIONS}
            value={gezinssamenstelling}
            onChange={setGezinssamenstelling}
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

      {/* Zelfde edge-to-edge divider als vóór Opstal/Inboedel's "Stel je ... samen". */}
      <div className="h-px w-[calc(100%+3rem)] shrink-0 bg-[rgba(0,0,0,0.08)] -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10" />

      <div ref={stelJeAansprakelijkheidRef}>
        <FunnelSection title="Stel je Aansprakelijkheidsverzekering samen">
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
                <div className="h-40 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
                <div className="h-40 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              </div>
              <div className="flex w-full flex-col gap-3">
                <div className="h-7 w-[200px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
              </div>
            </div>
          ) : (
            <>
              {/*
                "compact"-variant: deze kaarten tonen bevestigd via mcp (node
                180:5051;10783:74593;1099:302;11092:3714/3715) alleen titel +
                radio-stip, geen features/prijs/"Meer informatie" — anders
                dan Opstal/Inboedel's "Kies je dekking"-kaarten.
              */}
              <RadioCardBottomGroup
                labelText="Kies een maximaal verzekerd bedrag"
                description={
                  <>
                    <p className="mb-0 w-full text-[16px] leading-[1.5]">
                      Per schadegeval geldt een maximaal verzekerd bedrag voor alle verzekerden samen.
                    </p>
                    {/* Geen bestemming bevestigd in Figma voor deze node — zelfde no-op-precedent als "Meer informatie" elders in deze funnel. */}
                    <button
                      type="button"
                      onClick={() => {}}
                      className="w-full text-left text-[#0064a8] text-[16px] leading-[1.5] underline [text-underline-position:from-font]"
                    >
                      Bekijk wie en wat is verzekerd
                    </button>
                  </>
                }
                variant="compact"
                options={MAXIMAAL_VERZEKERD_OPTIES}
                value={maximaalVerzekerd}
                onChange={setMaximaalVerzekerd}
              />
              <RadioGroup
                labelText="Kies je eigen risico"
                description="Dit is het bedrag dat wij aftrekken van een schadevergoeding. Hoe hoger je eigen risico, hoe minder je per maand betaalt."
                options={EIGEN_RISICO_OPTIONS}
                value={eigenRisico}
                onChange={setEigenRisico}
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
