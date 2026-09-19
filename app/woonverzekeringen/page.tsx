"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { ToggleCardGroup, type ToggleCardOption } from "@/components/ToggleCard";
import { Icon } from "@/components/Icon";
import { useWoonverzekeringenFunnel } from "./funnel-context";
import { WOONVERZEKERINGEN_PRODUCTEN, type WoonverzekeringenProductId } from "./products";

const WOON_STEPS = ["Productkeuze", "Premie berekenen", "Gegevens", "Laatste vragen", "Samenvatting"];

/**
 * Iconen/titels/beschrijvingen komen nu uit `products.ts` (losgetrokken uit
 * deze pagina) i.p.v. hier lokaal gedupliceerd te staan — dezelfde data is
 * nodig op de productpagina's zelf (bv. Opstal's "resterende producten"-lijst
 * en de kassabon).
 */
const PRODUCT_OPTIES: ToggleCardOption[] = WOONVERZEKERINGEN_PRODUCTEN.map((product) => ({
  value: product.id,
  icon: product.icon,
  title: product.title,
  description: product.description,
}));

export default function WoonverzekeringenPage() {
  const router = useRouter();
  const { state, setState } = useWoonverzekeringenFunnel();
  const [error, setError] = useState(false);

  function handleNext() {
    if (state.selectedProducts.length === 0) {
      setError(true);
      return;
    }
    router.push("/woonverzekeringen/premie-berekenen");
  }

  return (
    <FunnelPageTemplate
      headerTitle="Woonverzekeringen"
      ikzSticker
      steps={WOON_STEPS}
      activeStep={1}
      cardClassName="flex w-full max-w-[784px] flex-col items-start overflow-hidden rounded-md bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
      navigation={<FormNavigation nextLabel="Volgende stap" onNext={handleNext} />}
    >
      {/* "Ga terug" heeft in Figma geen zichtbare bestemming (eerste stap van de funnel) — zelfde no-op-precedent als kortlopendereis' eigen "Jouw situatie"-terugknop. */}
      <button type="button" onClick={() => {}} className="flex items-center gap-2 rounded-[3px]">
        <Icon name="arrow-left" size="sm" />
        <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
          Ga terug
        </span>
      </button>

      <FunnelSection
        intro
        title="Onze woonverzekeringen"
        showRequiredFieldsNote
        /**
         * "* Verplichte velden" (asterisk eerst) i.p.v. de standaard "Velden
         * met * zijn verplicht" — bevestigd via mcp specifiek voor deze
         * funnel (node I1:25088;1277:3062 e.o.), dus hier via de override-
         * prop i.p.v. de gedeelde standaardtekst overal te wijzigen.
         */
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

      <FunnelSection title="Waarvoor wil je een premie berekenen?" description="Kies minimaal één verzekering om verder te gaan.">
        <ToggleCardGroup
          options={PRODUCT_OPTIES}
          values={state.selectedProducts}
          onChange={(values) => {
            setState({ ...state, selectedProducts: values as WoonverzekeringenProductId[] });
            setError(false);
          }}
          onMoreInfoClick={() => {}}
          error={error ? "Kies minimaal één verzekering" : undefined}
        />
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
