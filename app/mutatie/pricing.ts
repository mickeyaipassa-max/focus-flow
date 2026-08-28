import type { RadioCardBottomOption } from "@/components/RadioCardBottom";

export type DekkingKeuze = "basis" | "allrisk";

export const DEKKING_OPTIONS: RadioCardBottomOption[] = [
  {
    value: "basis",
    title: "Basis",
    description: "Opstalverzekering",
    price: "4,82",
    features: [
      { text: "Brand, bliksem en rook", included: true },
      { text: "Storm, neerslag en lekkage", included: true },
      { text: "Diefstal, inbraak en vandalisme", included: true },
      { text: "Tijdelijke woonruimte bij nood", included: true },
      { text: "Ongelukjes zoals vallen en stoten", included: false },
    ],
  },
  {
    value: "allrisk",
    title: "Allrisk",
    description: "Opstalverzekering",
    price: "5,20",
    features: [
      { text: "Brand, bliksem en rook", included: true },
      { text: "Storm, neerslag en lekkage", included: true },
      { text: "Diefstal, inbraak en vandalisme", included: true },
      { text: "Tijdelijke woonruimte bij nood", included: true },
      { text: "Ongelukjes zoals vallen en stoten", included: true },
    ],
  },
];

/** Prijzen per dekking — bevestigd via mcp uit de receipt-/samenvattingskaarten. Geen prijslogica voor andere combinaties is in Figma getoond. */
export const PRICE_BY_DEKKING: Record<DekkingKeuze, string> = { basis: "4,82", allrisk: "5,20" };
export const GLAS_PRICE = "2,63";

/** Huidige polis vóór wijziging — bevestigd via Figma's "Dit was: Basis" / "€ 4,82 per maand" op de bevestigingsstap. */
export const CURRENT_DEKKING: DekkingKeuze = "basis";
export const CURRENT_MONTHLY_PRICE = 4.82;

export function dekkingTitel(dekking: DekkingKeuze): string {
  return DEKKING_OPTIONS.find((option) => option.value === dekking)?.title ?? dekking;
}

export function parseEuro(value: string): number {
  return Number.parseFloat(value.replace(",", "."));
}

export function formatEuro(amount: number): string {
  return `€ ${amount.toFixed(2).replace(".", ",")}`;
}

export function berekenNieuwePremie(dekking: DekkingKeuze, heeftGlas: boolean): number {
  const dekkingPrijs = parseEuro(PRICE_BY_DEKKING[dekking]);
  const glasPrijs = heeftGlas ? parseEuro(GLAS_PRICE) : 0;
  return dekkingPrijs + glasPrijs;
}
