"use client";

import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { ProductSelectCard } from "@/components/ProductSelectCard";
import { useWoonverzekeringenFunnel } from "./funnel-context";

const WOONVERZEKERINGEN_STEPS = ["Productkeuze", "Jouw situatie", "Jouw dekking", "Jouw gegevens", "Laatste vragen", "Samenvatting"];

type Product = {
  slug: string;
  icon: string;
  title: string;
  description: string;
  /** Voorlopige prijzen — Figma toont zelf letterlijk "Vanaf € x,- p/m" (placeholder). Opstal hergebruikt het al bevestigde basisbedrag uit de mutatie-funnel (`pricing.ts`); Inboedel/Aansprakelijkheid hebben nog geen bevestigd bedrag. */
  price: string;
};

const PRODUCTS: Product[] = [
  {
    slug: "opstal",
    icon: "/icons/pictogram-house.svg",
    title: "Opstal",
    description: "Dekt schade aan je huis.",
    price: "Vanaf € 4,82 p/m",
  },
  {
    slug: "inboedel",
    icon: "/icons/pictogram-inboedel.svg",
    title: "Inboedel",
    description: "Dekt schade aan je spullen.",
    price: "Vanaf € x,- p/m",
  },
  {
    slug: "aansprakelijkheid",
    icon: "/icons/pictogram-aansprakelijkheid.svg",
    title: "Aansprakelijkheid",
    // Figma zelf: "Desk schade die jij per ongeluk veroorzaakt." — letterlijke typo, hier op verzoek gecorrigeerd naar "Dekt".
    description: "Dekt schade die jij per ongeluk veroorzaakt.",
    price: "Vanaf € x,- p/m",
  },
];

/**
 * Stap 1 "Productkeuze" van de nieuwe "Woonverzekeringen"-funnel (Figma
 * node 1:4300, "Productkeuze/Idle"). Hergebruikt volledig bestaande
 * componenten — `FunnelPageTemplate` (geen sidebar: dit is Figma's "Multi
 * Product Template", single column, exact dezelfde kaart-schaduw als
 * `FunnelBox`'s default), `FunnelSection` (de 40px "Onze verzekeringen"-
 * intro en de 32px "Waarvoor wil je een premie berekenen?"-titel matchen
 * al 1-op-1 met de bestaande `intro`/normale titel-tiers, geen aanpassing
 * nodig), en het net gebouwde `ProductSelectCard` + `Toggle` 3x.
 *
 * Op expliciet verzoek: geen chevron op "Meer informatie" (Figma zelf was
 * hier inconsistent — alleen Opstal had 'm, Inboedel/Aansprakelijkheid
 * niet — nu voor alle 3 uniform uit via `ProductSelectCard`'s nieuwe
 * `showMoreInfoChevron`-prop), en de "Desk schade..."-typo in
 * Aansprakelijkheid's beschrijving is gecorrigeerd naar "Dekt".
 *
 * Twee pictogrammen (`pictogram-inboedel.svg`, `pictogram-aansprakelijkheid.svg`)
 * zijn nieuw geëxporteerd — Aansprakelijkheid's Code Connect-referentie gaf
 * een generieke "Placeholder", dus 1-op-1 opgehaald via `use_figma`
 * (instance → mainComponent → vector → exportAsync), zelfde aanpak als
 * eerder bij het huis-pictogram (mutatie-funnel) — niet vertrouwd op het
 * eerste, mogelijk niet-opgeloste asset.
 *
 * Geen "vorige stap"-knop: Figma toont hier geen zichtbare, al bevestigde
 * knop is enkel de primaire "Naar jouw situatie" — een verborgen
 * "button-back"-node bestaat wel in de metadata maar is in deze
 * "Idle"-staat niet zichtbaar, dus niet meegebouwd.
 *
 * Nog niet gebouwd/bevestigd, bewust buiten scope van deze stap: validatie
 * op "Kies minimaal één verzekering" (geen Figma-foutstaat gevonden),
 * mobiele viewport (geen mobiel mockup gevonden voor dit scherm), en de
 * daaropvolgende stappen (2 t/m 6, alleen labels in de Step Indicator
 * bevestigd).
 */
export default function WoonverzekeringenProductkeuzePage() {
  const router = useRouter();
  const { state, setState } = useWoonverzekeringenFunnel();

  function toggleProduct(slug: string, selected: boolean) {
    const next = selected ? [...state.selectedProducts, slug] : state.selectedProducts.filter((p) => p !== slug);
    setState({ ...state, selectedProducts: next });
  }

  return (
    <FunnelPageTemplate
      headerTitle="Woonverzekeringen"
      ikzSticker
      steps={WOONVERZEKERINGEN_STEPS}
      activeStep={1}
      stepAnimationKey="woonverzekeringen"
      navigation={
        <FormNavigation nextLabel="Naar jouw situatie" onNext={() => router.push("/woonverzekeringen/jouw-situatie")} />
      }
    >
      <FunnelSection intro title="Onze verzekeringen" showRequiredFieldsNote />

      <FunnelSection title="Waarvoor wil je een premie berekenen?" description="Kies minimaal één verzekering.">
        <div className="flex w-full flex-col items-start gap-2">
          {PRODUCTS.map((product) => (
            <ProductSelectCard
              key={product.slug}
              icon={<img src={product.icon} alt="" className="size-8" />}
              title={product.title}
              description={
                <>
                  {product.description}
                  <br />
                  {product.price}
                </>
              }
              selected={state.selectedProducts.includes(product.slug)}
              onSelectedChange={(selected) => toggleProduct(product.slug, selected)}
              onMoreInfoClick={() => {}}
              showMoreInfoChevron={false}
            />
          ))}
        </div>
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
