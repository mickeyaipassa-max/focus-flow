/**
 * Canonieke productlijst voor de Woonverzekeringen Multi Product Funnel —
 * losgetrokken uit `app/woonverzekeringen/page.tsx` (stap 1) zodat latere
 * productstappen (Opstal, straks Inboedel/Aansprakelijkheid/Overlijdensrisico/
 * Rechtsbijstand) dezelfde titels/iconen kunnen hergebruiken voor bv. de
 * "resterende producten"-lijst en de kassabon, i.p.v. deze data per pagina
 * te dupliceren.
 */

export type WoonverzekeringenProductId = "opstal" | "inboedel" | "aansprakelijkheid" | "overlijden" | "rechtsbijstand";

export type WoonverzekeringenProductMeta = {
  id: WoonverzekeringenProductId;
  /** Volledige titel — bevestigd via mcp op stap 1 (ToggleCard) én de "Multi Entity Item"-resterende-producten-lijst (bv. "Inboedelverzekering"). */
  title: string;
  /**
   * Verkorte titel voor de kassabon — bevestigd via mcp op de Receipt
   * ("Opstal"/"Inboedel"/"Overlijdensrisico"/"Rechtsbijstand"). Voor
   * Aansprakelijkheid nog niet los op een Receipt-instance bevestigd; hier
   * consistent met dezelfde "verzekering"-strip afgeleid, geen aparte
   * mcp-bevestiging voor dit specifieke woord.
   */
  shortTitle: string;
  icon: string;
  /**
   * Overlijdensrisico- en Rechtsbijstandverzekering hebben in Figma dezelfde
   * beschrijving als Opstalverzekering gekregen (kopieerfout in het
   * bronbestand) — bewust letterlijk overgenomen i.p.v. zelf iets anders te
   * verzinnen, zie ook de toelichting in `app/woonverzekeringen/page.tsx`.
   */
  description: string;
};

export const WOONVERZEKERINGEN_PRODUCTEN: WoonverzekeringenProductMeta[] = [
  { id: "opstal", icon: "pictogram-house", title: "Opstalverzekering", shortTitle: "Opstal", description: "Verzeker je woning voor bijvoorbeeld brand, storm of inbraak." },
  { id: "inboedel", icon: "pictogram-inboedel", title: "Inboedelverzekering", shortTitle: "Inboedel", description: "Verzeker je spullen voor schade of diefstal." },
  {
    id: "aansprakelijkheid",
    icon: "pictogram-aansprakelijkheidsverzekering",
    title: "Aansprakelijkheidsverzekering",
    shortTitle: "Aansprakelijkheid",
    description: "Verzeker jezelf voor schade die jij per ongeluk veroorzaakt.",
  },
  {
    id: "overlijden",
    icon: "pictogram-overlijdensrisicoverzekering",
    title: "Overlijdensrisicoverzekering",
    shortTitle: "Overlijdensrisico",
    description: "Verzeker je woning voor bijvoorbeeld brand, storm of inbraak.",
  },
  {
    id: "rechtsbijstand",
    icon: "pictogram-rechtsbijstandsverzekering",
    title: "Rechtsbijstandverzekering",
    shortTitle: "Rechtsbijstand",
    description: "Verzeker je woning voor bijvoorbeeld brand, storm of inbraak.",
  },
];

export function getProductMeta(id: WoonverzekeringenProductId): WoonverzekeringenProductMeta {
  const meta = WOONVERZEKERINGEN_PRODUCTEN.find((product) => product.id === id);
  if (!meta) throw new Error(`Onbekend woonverzekeringen-product: ${id}`);
  return meta;
}

/**
 * Alle producten samen op één route (`/woonverzekeringen/premie-berekenen`)
 * sinds het accordion-model: elk product is nu een uitklapbaar item op
 * dezelfde pagina i.p.v. een eigen route per product — gebaseerd op de door
 * de opdrachtgever aangeleverde Figma Make-broncode ("Interactive Transition
 * for Calculator"), die alle producten als accordion-items op één pagina
 * toont in plaats van losse pagina's met eigen navigatie ertussen.
 */
export const PREMIE_BEREKENEN_ROUTE = "/woonverzekeringen/premie-berekenen";

/** Gedeelde bedrag-formattering (bv. "€ 4,82") — gebruikt door elke productpagina's premie/kassabon-weergave. */
export function formatEuro(amount: number): string {
  return `€ ${amount.toFixed(2).replace(".", ",")}`;
}
