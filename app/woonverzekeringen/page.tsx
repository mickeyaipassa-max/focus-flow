"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { ToggleCardGroup, type ToggleCardOption } from "@/components/ToggleCard";
import { Icon } from "@/components/Icon";

const WOON_STEPS = ["Productkeuze", "Premie berekenen", "Gegevens", "Laatste vragen", "Samenvatting"];

/**
 * Iconen opnieuw gecontroleerd via mcp (bestand "Live event Funnel", node
 * 1:23578) nadat bleek dat het bestand was bijgewerkt: elke tegel heeft nu
 * wél zijn eigen icoon-component. Elk rechtstreeks als SVG geëxporteerd via
 * de Figma plugin-API (`node.exportAsync`, geen screenshot):
 * "1036-woonhuisverzekering" (Opstal, matcht het al aanwezige
 * `pictogram-house`) en "1020-inboedelverzekering" (matcht het al aanwezige
 * `pictogram-inboedel`) zijn hergebruikt; "1003-aansprakelijkheidsverzekering"
 * bleek NIET hetzelfde als het al aanwezige `pictogram-aansprakelijkheid`
 * (ander viewBox/andere paden) — dus als apart, nieuw bestand toegevoegd
 * i.p.v. dat bestaande bestand te overschrijven of te hergebruiken.
 * "1028-overlijdensrisicoverzekering" en "1030-rechtsbijstandsverzekering"
 * bestonden nog helemaal niet, ook nieuw toegevoegd.
 *
 * Overlijdens-/Rechtsbijstandverzekering hebben in Figma dezelfde
 * beschrijving als Opstalverzekering gekregen (kopieerfout) — bewust
 * letterlijk overgenomen i.p.v. zelf een andere tekst te verzinnen.
 */
const PRODUCT_OPTIES: ToggleCardOption[] = [
  { value: "opstal", icon: "pictogram-house", title: "Opstalverzekering", description: "Verzeker je woning voor bijvoorbeeld brand, storm of inbraak." },
  { value: "inboedel", icon: "pictogram-inboedel", title: "Inboedelverzekering", description: "Verzeker je spullen voor schade of diefstal." },
  {
    value: "aansprakelijkheid",
    icon: "pictogram-aansprakelijkheidsverzekering",
    title: "Aansprakelijkheidsverzekering",
    description: "Verzeker jezelf voor schade die jij per ongeluk veroorzaakt.",
  },
  {
    value: "overlijden",
    icon: "pictogram-overlijdensrisicoverzekering",
    title: "Overlijdensrisicoverzekering",
    description: "Verzeker je woning voor bijvoorbeeld brand, storm of inbraak.",
  },
  {
    value: "rechtsbijstand",
    icon: "pictogram-rechtsbijstandsverzekering",
    title: "Rechtsbijstandverzekering",
    description: "Verzeker je woning voor bijvoorbeeld brand, storm of inbraak.",
  },
];

export default function WoonverzekeringenPage() {
  const router = useRouter();
  const [producten, setProducten] = useState<string[]>([]);
  const [error, setError] = useState(false);

  function handleNext() {
    if (producten.length === 0) {
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
          values={producten}
          onChange={(values) => {
            setProducten(values);
            setError(false);
          }}
          onMoreInfoClick={() => {}}
          error={error ? "Kies minimaal één verzekering" : undefined}
        />
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
