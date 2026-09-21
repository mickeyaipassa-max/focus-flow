"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { MultiEntityItem } from "@/components/MultiEntityItem";
import { Receipt } from "@/components/Receipt";
import { Icon } from "@/components/Icon";
import { ProductAccordionSkeleton } from "@/components/ProductAccordionSkeleton";
import { buildProductReceiptSection, getTotalPremium, useWoonverzekeringenFunnel } from "../funnel-context";
import { formatEuro, getProductMeta, type WoonverzekeringenProductId } from "../products";
import { OpstalBody } from "./OpstalBody";
import { InboedelBody } from "./InboedelBody";
import { AansprakelijkheidBody } from "./AansprakelijkheidBody";
import { RechtsbijstandBody } from "./RechtsbijstandBody";
import { OverlijdenBody, OVERLIJDEN_AFSLUITKOSTEN_INFO } from "./OverlijdenBody";

const WOON_STEPS = ["Productkeuze", "Premie berekenen", "Gegevens", "Laatste vragen", "Samenvatting"];

/**
 * Zelfde self-omschrijving als voorheen op Opstal's eigen pagina bevestigd
 * ("Verzeker je woning voor bijvoorbeeld brand, storm of inbraak.") — de
 * andere 4 producten gebruikten op hun eigen pagina allemaal "Bereken je
 * premie" i.p.v. hun generieke productomschrijving. Bewust niet
 * gelijkgetrokken: elk van deze teksten is los bevestigd op de betreffende
 * productpagina, dus hier per product overgenomen i.p.v. zelf een
 * standaardtekst te verzinnen.
 */
function getActiveDescription(id: WoonverzekeringenProductId): string {
  return id === "opstal" ? getProductMeta(id).description : "Bereken je premie";
}

function ProductBody({ id }: { id: WoonverzekeringenProductId }) {
  switch (id) {
    case "opstal":
      return <OpstalBody />;
    case "inboedel":
      return <InboedelBody />;
    case "aansprakelijkheid":
      return <AansprakelijkheidBody />;
    case "rechtsbijstand":
      return <RechtsbijstandBody />;
    case "overlijden":
      return <OverlijdenBody />;
  }
}

/**
 * "Premie berekenen" — sinds de door de opdrachtgever aangeleverde Figma
 * Make-broncode ("Interactive Transition for Calculator") één gedeelde
 * pagina voor alle geselecteerde producten, elk een uitklapbaar accordion-
 * item, i.p.v. de eerdere aparte pagina per product (`/inboedel`,
 * `/aansprakelijkheid`, `/rechtsbijstand`, `/overlijden` — nu verwijderd).
 *
 * Overgang tussen producten (bevestigd via diezelfde broncode, `handleSave`):
 * 1. Direct bij "verder met ...": huidig product → afgerond (blijft nog wel
 *    1s zichtbaar open — de rij-status flipt meteen naar groen, maar
 *    `activeId` zelf verandert pas na de pauze hieronder).
 * 2. Na 1000ms: dit accordion klapt dicht, het volgende klapt open.
 * 3. Na nog eens 320ms (wachten op de 300ms-dichtklap-animatie): smooth
 *    scroll zodat het volgende product 80px vanaf de bovenkant staat.
 * 4. Vanaf stap 2 tot in totaal 3000ms: een generieke skeleton
 *    (`ProductAccordionSkeleton`) i.p.v. de echte velden van het volgende
 *    product — dat is een ándere, grovere skeleton dan elk product-body's
 *    eigen "Gegevens → samenstellen"-skeleton (die blijft bestaan voor de
 *    overgang БІННEN één product, ongewijzigd uit de vorige, aparte pagina's
 *    overgenomen).
 *
 * Alle product-bodies blijven continu gemount (niet voorwaardelijk op
 * `activeId`) — alleen CSS (`accordion-grid`/`.open`) verbergt de dichte.
 * Zo blijft lokale state (dekking/eigen risico/etc.) behouden als de
 * gebruiker via "Wijzig" heen en weer navigeert tussen producten, en blijft
 * elk product zijn premie/kassabon-detail reactief doorzetten naar de
 * gedeelde state, ongeacht of het accordion open of dicht staat.
 */
export default function PremieBerekenenPage() {
  const router = useRouter();
  const { state, setState } = useWoonverzekeringenFunnel();

  const [activeId, setActiveId] = useState<WoonverzekeringenProductId | null>(null);
  const [loadingId, setLoadingId] = useState<WoonverzekeringenProductId | null>(null);
  const didInitRef = useRef(false);
  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /** Eenmalige initialisatie zodra de gedeelde state (uit sessionStorage) beschikbaar is — daarna beheren handleNext/handleWijzig/handleRemove `activeId` zelf. */
  useEffect(() => {
    if (didInitRef.current || state.selectedProducts.length === 0) return;
    didInitRef.current = true;
    const firstIncomplete = state.selectedProducts.find((id) => !state.products[id]?.isComplete);
    setActiveId(firstIncomplete ?? state.selectedProducts[0]);
  }, [state.selectedProducts, state.products]);

  const allDone = state.selectedProducts.length > 0 && state.selectedProducts.every((id) => state.products[id]?.isComplete);

  function findNextIncomplete(afterId: WoonverzekeringenProductId): WoonverzekeringenProductId | undefined {
    const idx = state.selectedProducts.indexOf(afterId);
    return state.selectedProducts.find((id, i) => i > idx && !state.products[id]?.isComplete);
  }

  function handlePrevious() {
    router.push("/woonverzekeringen");
  }

  function handleNext() {
    if (allDone || !activeId) return;
    const next = findNextIncomplete(activeId);

    setState({
      ...state,
      products: {
        ...state.products,
        [activeId]: { ...(state.products[activeId] ?? { premium: null, isComplete: false }), isComplete: true },
      },
    });

    if (next) {
      setLoadingId(next);
      setTimeout(() => {
        setActiveId(next);
        setTimeout(() => {
          const el = productRefs.current[next];
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }, 320);
      }, 1000);
      setTimeout(() => setLoadingId(null), 1000 + 2000);
    } else {
      setActiveId(null);
    }
  }

  /** Heropent een al afgerond product om het aan te passen — de rij toont dan weer "current" (geel), ongeacht de onderliggende `isComplete`-vlag (die blijft `true` tot de gebruiker hier weer op "verder met ..." klikt). */
  function handleWijzig(id: WoonverzekeringenProductId) {
    setActiveId(id);
    requestAnimationFrame(() => {
      productRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleRemove(id: WoonverzekeringenProductId) {
    const { [id]: _removed, ...remainingProducts } = state.products;
    const remainingSelected = state.selectedProducts.filter((productId) => productId !== id);
    setState({ ...state, selectedProducts: remainingSelected, products: remainingProducts });

    if (remainingSelected.length === 0) {
      router.push("/woonverzekeringen");
      return;
    }
    if (activeId === id) {
      const firstIncomplete = remainingSelected.find((productId) => !remainingProducts[productId]?.isComplete);
      setActiveId(firstIncomplete ?? remainingSelected[0]);
    }
  }

  const receiptSections = state.selectedProducts.map((id) => buildProductReceiptSection(state, id));
  const totalPremium = getTotalPremium(state);
  const summaryAmount = totalPremium > 0 ? formatEuro(totalPremium) : "€ -,--";
  const summaryInfo = state.products.overlijden?.premium != null ? OVERLIJDEN_AFSLUITKOSTEN_INFO : undefined;

  const nextLabel = (() => {
    if (allDone) return "Ga naar samenvatting";
    if (!activeId) return "Volgende stap";
    const next = findNextIncomplete(activeId);
    return next ? `verder met ${getProductMeta(next).shortTitle}` : "Volgende stap";
  })();

  return (
    <FunnelPageTemplate
      headerTitle="Woonverzekeringen"
      ikzSticker
      steps={WOON_STEPS}
      activeStep={2}
      sidebarClassName="w-full"
      sidebar={
        <Receipt
          key={activeId ?? "none"}
          sections={receiptSections}
          type="collapsable"
          defaultActiveSectionId={activeId}
          summaryAmount={summaryAmount}
          summaryInfo={summaryInfo}
        />
      }
      navigation={
        <FormNavigation previousStep previousLabel="Vorige stap" nextLabel={nextLabel} onPrevious={handlePrevious} onNext={handleNext} />
      }
    >
      <button type="button" onClick={handlePrevious} className="flex items-center gap-2 rounded-[3px]">
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

      <FunnelSection title="Gegevens" />

      <div className="flex w-full flex-col items-start">
        {state.selectedProducts.map((id) => {
          const meta = getProductMeta(id);
          const isActive = id === activeId;
          const isCompleted = Boolean(state.products[id]?.isComplete) && !isActive;
          const rowState: "current" | "completed" | "disabled" = isActive ? "current" : isCompleted ? "completed" : "disabled";

          return (
            <div
              key={id}
              ref={(el) => {
                productRefs.current[id] = el;
              }}
              className="flex w-full flex-col items-start"
            >
              {/*
                Alleen de statusregel zelf breekt edge-to-edge uit de kaart-
                padding (zelfde `-mx-6`/`w-[calc(100%+...)]`-patroon als de
                vorige, aparte pagina's) — de Gegevens-/samenstel-velden
                hieronder horen bínnen de normale kaart-padding te blijven.
                Beide in dezelfde outbreak-wrapper zetten (zoals de eerste
                versie van deze pagina deed) duwde per ongeluk ook al die
                velden tegen de randen aan.
              */}
              <div className="flex w-[calc(100%+3rem)] flex-col items-start -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10">
                <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
                <MultiEntityItem
                  state={rowState}
                  icon={<img src={`/icons/${meta.icon}.svg`} alt="" className="size-8" />}
                  title={meta.title}
                  description={rowState === "current" ? getActiveDescription(id) : rowState === "completed" ? meta.description : undefined}
                  actions={
                    rowState === "current"
                      ? [{ label: "Verwijder", onClick: () => handleRemove(id) }]
                      : rowState === "completed"
                        ? [{ label: "Wijzig", onClick: () => handleWijzig(id) }]
                        : undefined
                  }
                  onRemove={rowState === "disabled" ? () => handleRemove(id) : undefined}
                />
              </div>
              <div className={`accordion-grid w-full ${isActive ? "open" : ""}`}>
                <div className="accordion-inner w-full">
                  <div className="flex w-full flex-col items-start gap-10 pt-10 pb-10">
                    {loadingId === id ? <ProductAccordionSkeleton /> : <ProductBody id={id} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FunnelPageTemplate>
  );
}
