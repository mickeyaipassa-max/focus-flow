import type { SelectOption } from "@/components/Select";

/**
 * Opzegredenen, uit de referentie-screenshot in Figma ("Referentie
 * opzegredenen", bestand "Mutatie funnels", pagina "-> Royeren"). De
 * `value`-sleutels zijn eigen keuzes; Figma bevat alleen de labels.
 */
export const REDENEN: SelectOption[] = [
  { value: "overlijden", label: "Overlijden" },
  { value: "total-loss", label: "Total loss" },
  { value: "verkoop-auto", label: "Verkoop auto" },
  { value: "naar-de-sloop", label: "Naar de sloop" },
  { value: "overig", label: "Overig" },
];

/**
 * Redenen waarbij een bewijsstuk (vrijwaringsbewijs) geüpload moet worden.
 * Uit Figma's reden-varianten van "Je opzegging": "Verkoop auto" en "Naar de
 * sloop" hebben het Input File-veld, "Overlijden", "Total loss" en "Overig"
 * niet.
 */
const REDENEN_MET_BEWIJSSTUK = ["verkoop-auto", "naar-de-sloop"];

export const BEWIJSSTUK_LABEL = "Upload het vrijwaringsbewijs";

/** Beschrijving onder het uploadlabel (letterlijk uit Figma, met de gekozen reden ingevuld); `undefined` als bij deze reden geen bewijsstuk nodig is. */
export function bewijsstukBeschrijving(redenValue: string): string | undefined {
  if (!REDENEN_MET_BEWIJSSTUK.includes(redenValue)) return undefined;
  const reden = REDENEN.find((option) => option.value === redenValue)?.label;
  return `Je wil je autoverzekering opzeggen met als reden ${reden}. Dit kan alleen als je een vrijwaringsbewijs hebt. Daarnaast doen wij een check bij de RDW wanneer de tenaamstelling van het kenteken gewijzigd is. Upload hier je vrijwaringsbewijs.`;
}
