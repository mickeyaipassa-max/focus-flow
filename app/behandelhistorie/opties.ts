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
 *
 * LET OP: de draw.io ("Webform Fysio Zorg") noemt hier zes opties, maar die
 * waren in het aangeleverde plaatje niet leesbaar en Figma toont alleen het
 * gekozen "Anders, namelijk". Daarom staat hier voorlopig alleen die ene,
 * letterlijk uit Figma. De overige opties moeten uit de draw.io hierboven
 * worden aangevuld (voeg ze vóór "Anders, namelijk" toe).
 */
export const REDENEN: SelectOption[] = [{ value: REDEN_ANDERS, label: "Anders, namelijk" }];
