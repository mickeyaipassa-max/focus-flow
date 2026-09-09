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
/** Huidig eigen risico vóór wijziging — zelfde waarde als de default state in funnel-context.tsx. Elke wijziging t.o.v. dit bedrag moet een "Gewijzigd"-badge krijgen op de bevestigingsstap, net als Dekking en Premie al doen. */
export const CURRENT_EIGEN_RISICO = "100";

export function dekkingTitel(dekking: DekkingKeuze): string {
  return DEKKING_OPTIONS.find((option) => option.value === dekking)?.title ?? dekking;
}

export function parseEuro(value: string): number {
  return Number.parseFloat(value.replace(",", "."));
}

export function formatEuro(amount: number): string {
  return `€ ${amount.toFixed(2).replace(".", ",")}`;
}

/**
 * Procentuele premie-aanpassing per gekozen eigen risico. `PRICE_BY_DEKKING`
 * is het al bevestigde Figma-bedrag bij het huidige/standaard eigen risico
 * (€ 100, zie `CURRENT_EIGEN_RISICO`) — dus dat blijft het ankerpunt (factor
 * 1, geen aanpassing), om de al bevestigde € 4,82/€ 5,20-bedragen niet met
 * terugwerkende kracht te veranderen. € 0 en € 500 zijn hiertegen afgezet
 * met het midden van de opgegeven bandbreedtes (€0→€100: 3–5%, €100→€500:
 * 8–12%) — geen exacte percentages gegeven, dus hier gekozen (4% resp. 10%).
 * Intern consistent: het resulterende €0→€500-verschil komt op ~13,6%,
 * binnen de opgegeven 10–15%-bandbreedte.
 */
const EIGEN_RISICO_FACTOR: Record<string, number> = {
  "0": 1 / (1 - 0.04),
  "100": 1,
  "500": 1 - 0.1,
};

export function berekenNieuwePremie(dekking: DekkingKeuze, heeftGlas: boolean, eigenRisico: string): number {
  const dekkingPrijs = parseEuro(PRICE_BY_DEKKING[dekking]) * (EIGEN_RISICO_FACTOR[eigenRisico] ?? 1);
  const glasPrijs = heeftGlas ? parseEuro(GLAS_PRICE) : 0;
  return dekkingPrijs + glasPrijs;
}

/**
 * Ingangsdatum van de wijziging: de eerste van de eerstvolgende maand vanaf
 * vandaag — gebruikelijke a.s.r.-conventie voor poliswijzigingen, en
 * gebruikt door zowel de bevestigingsstap als het successcherm (Figma toonde
 * op elk scherm een andere vaste voorbeelddatum met een ander formaat;
 * op verzoek nu overal dezelfde, dynamisch berekende datum).
 */
export function ingangsdatum(vandaag: Date = new Date()): Date {
  return new Date(vandaag.getFullYear(), vandaag.getMonth() + 1, 1);
}

export function formatDatum(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}
