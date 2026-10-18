import type { RadioOption } from "@/components/RadioGroup";
import type { SelectOption } from "@/components/Select";

/** Waarden van "Welke situatie is van toepassing?" — bepalen welke vervolgvraag verschijnt. */
export type Situatie = "nieuw" | "opnieuw" | "zelfBetaald";

/** Teksten letterlijk uit Figma (Formulier-behandelhistorie, frame "02 - Gegevens behandeling"). */
export const SITUATIES: (RadioOption & { value: Situatie })[] = [
  {
    value: "nieuw",
    label: "De verzekerde is nieuw bij a.s.r. en heeft vorig jaar al behandelingen ontvangen op basis van een chronische indicatie.",
  },
  { value: "opnieuw", label: "De verzekerde krijgt opnieuw een chronische indicatie." },
  {
    value: "zelfBetaald",
    label: "De eerste 20 behandelingen (of minder) die niet onder de basisverzekering vallen zijn geheel of gedeeltelijk door de verzekerde betaald.",
  },
];

/** Waarde van de keuze waarbij de vervolgvraag "Licht je reden toe" verschijnt. */
export const REDEN_ANDERS = "anders";

/**
 * Opties van "Waarom is er een nieuwe chronische indicatie van toepassing?".
 * De eerste vijf zijn aangeleverd; de laatste is Figma's "Anders, namelijk",
 * die de vervolgvraag "Licht je reden toe" toont.
 */
export const REDENEN: SelectOption[] = [
  { value: "heroperatie", label: "Nieuwe operatie/heroperatie (dezelfde aandoening)" },
  { value: "andere-zijde", label: "Operatie aan andere zijde (links/rechts) of andere lichaamslocatie" },
  { value: "nieuw-trauma", label: "Nieuw trauma, ongeval of blessure aan hetzelfde lichaamsdeel" },
  { value: "revisie-prothese", label: "Revisieoperatie of vervanging van prothese" },
  { value: "na-afgesloten-traject", label: "Nieuwe chronische indicatie na eerder afgesloten traject" },
  { value: REDEN_ANDERS, label: "Anders, namelijk" },
];
