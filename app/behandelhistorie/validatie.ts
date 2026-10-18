import { fromIsoDatum } from "@/lib/datum";
import type { BehandelhistorieState } from "./funnel-context";
import { REDEN_ANDERS } from "./opties";

/*
 * Validatieregels van de "Chronische behandelhistorie doorgeven"-funnel, naar
 * het Validaties-schema in Figma (sectie "Validaties") en de draw.io.
 *
 * Foutteksten: de draw.io noemt per veld de foutmeldingen, maar die waren niet
 * leesbaar. De teksten hieronder zijn daarom voorlopig, in de stijl van de
 * standaardmeldingen van het design system ("Vul een geldig e-mailadres in",
 * "Maak een keuze"). Vervang ze hier op één plek zodra de definitieve teksten
 * er zijn.
 */
export const FOUT = {
  verzekerdennummerLeeg: "Vul een verzekerdennummer in",
  verzekerdennummerOngeldig: "Vul een geldig verzekerdennummer in. Het bestaat uit 9 cijfers en begint met 13, 46 of 47.",
  voorlettersLeeg: "Vul de voorletters in",
  achternaamLeeg: "Vul een achternaam in",
  geboortedatumLeeg: "Vul een geldige geboortedatum in",
  geboortedatumToekomst: "De geboortedatum mag niet in de toekomst liggen",
  diagnosecodeLeeg: "Vul een diagnosecode in",
  diagnosecodeOngeldig: "Vul een geldige diagnosecode in. Gebruik alleen cijfers.",
  ingangsdatumLeeg: "Vul een geldige datum in",
  ingangsdatumToekomst: "De datum mag niet in de toekomst liggen",
  situatieLeeg: "Maak een keuze",
  aantalLeeg: "Vul het aantal behandelingen in",
  aantalOngeldig: "Vul een geldig aantal in. Gebruik alleen cijfers.",
  redenLeeg: "Maak een keuze",
  toelichtingLeeg: "Licht je reden toe",
  naamPraktijkLeeg: "Vul de naam van de praktijk in",
  agbLeeg: "Vul de AGB-code van de praktijk in",
  agbOngeldig: "Vul een geldige AGB-code in. Die bestaat uit 8 cijfers.",
  emailLeeg: "Vul een e-mailadres in",
  emailOngeldig: "Vul een geldig e-mailadres in",
} as const;

export type Fouten = Partial<Record<string, string>>;

function vandaag() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Alleen cijfers (voorloopnullen blijven staan). */
const ALLEEN_CIJFERS = /^\d+$/;
const VERZEKERDENNUMMER = /^(13|46|47)\d{7}$/;
const AGB = /^\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function valideerVerzekerde(state: BehandelhistorieState): Fouten {
  const fouten: Fouten = {};
  const nummer = state.verzekerdennummer.trim();
  if (!nummer) fouten.verzekerdennummer = FOUT.verzekerdennummerLeeg;
  else if (!VERZEKERDENNUMMER.test(nummer)) fouten.verzekerdennummer = FOUT.verzekerdennummerOngeldig;

  if (!state.voorletters.trim()) fouten.voorletters = FOUT.voorlettersLeeg;
  if (!state.achternaam.trim()) fouten.achternaam = FOUT.achternaamLeeg;

  if (!state.geboortedatum) fouten.geboortedatum = FOUT.geboortedatumLeeg;
  else if (fromIsoDatum(state.geboortedatum) > vandaag()) fouten.geboortedatum = FOUT.geboortedatumToekomst;
  return fouten;
}

export function valideerBehandeling(state: BehandelhistorieState): Fouten {
  const fouten: Fouten = {};
  const code = state.diagnosecode.trim();
  if (!code) fouten.diagnosecode = FOUT.diagnosecodeLeeg;
  else if (!ALLEEN_CIJFERS.test(code)) fouten.diagnosecode = FOUT.diagnosecodeOngeldig;

  if (!state.ingangsdatum) fouten.ingangsdatum = FOUT.ingangsdatumLeeg;
  else if (fromIsoDatum(state.ingangsdatum) > vandaag()) fouten.ingangsdatum = FOUT.ingangsdatumToekomst;

  if (!state.situatie) fouten.situatie = FOUT.situatieLeeg;

  if (state.situatie === "nieuw" || state.situatie === "zelfBetaald") {
    const aantal = state.aantalBehandelingen.trim();
    if (!aantal) fouten.aantalBehandelingen = FOUT.aantalLeeg;
    else if (!ALLEEN_CIJFERS.test(aantal)) fouten.aantalBehandelingen = FOUT.aantalOngeldig;
  }

  if (state.situatie === "opnieuw") {
    if (!state.reden) fouten.reden = FOUT.redenLeeg;
    else if (state.reden === REDEN_ANDERS && !state.toelichting.trim()) fouten.toelichting = FOUT.toelichtingLeeg;
  }

  if (!state.naamPraktijk.trim()) fouten.naamPraktijk = FOUT.naamPraktijkLeeg;

  const agb = state.agbCode.trim();
  if (!agb) fouten.agbCode = FOUT.agbLeeg;
  else if (!AGB.test(agb)) fouten.agbCode = FOUT.agbOngeldig;

  const email = state.emailPraktijk.trim();
  if (!email) fouten.emailPraktijk = FOUT.emailLeeg;
  else if (!EMAIL.test(email)) fouten.emailPraktijk = FOUT.emailOngeldig;
  return fouten;
}

export const isGeldig = (fouten: Fouten) => Object.keys(fouten).length === 0;
