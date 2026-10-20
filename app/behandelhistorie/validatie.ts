import { fromIsoDatum } from "@/lib/datum";
import type { BehandelhistorieState } from "./funnel-context";
import { REDEN_ANDERS } from "./opties";

/*
 * Validatieregels van de "Chronische behandelhistorie doorgeven"-funnel, naar
 * het Validaties-schema in Figma (sectie "Validaties") en de draw.io
 * "Webform Fysio historie Zorg".
 *
 * Foutteksten: overgenomen uit de draw.io, met de aanspreekvorm "je" (de
 * draw.io gebruikt deels "U"; "U heeft heeft" is daarbij "Je hebt" geworden).
 * Teksten die de draw.io niet kent, staan hieronder apart als "aanname".
 */
export const FOUT = {
  verzekerdennummerLeeg: "Je hebt niets ingevuld. Vul het verzekerde nummer in.",
  verzekerdennummerOngeldig:
    "Dit is een niet bestaand verzekerdenummer. Het verzekerdenummer begint altijd met een 13, 46 of 47 en bestaat uit 9 getallen. Je vindt het verzekerde nummer op de zorgpas en in de Zorg app",
  // De draw.io heeft één naamveld; de melding geldt hier voor Voorletters en Achternaam.
  voorlettersLeeg: "Je hebt niets ingevuld. Vul de naam van de verzekerde in.",
  achternaamLeeg: "Je hebt niets ingevuld. Vul de naam van de verzekerde in.",
  geboortedatumLeeg: "Je hebt niets ingevuld. Vul de geboortedatum in.",
  geboortedatumOngeldig: "Je hebt geen geldige datum ingevuld. Vul een geldige geboortedatum in.",
  diagnosecodeLeeg: "Je hebt niets ingevuld. Vul de diagnosecode in.",
  diagnosecodeTeLang: "Dit is een niet bestaande diagnose code. Een diagnose code bevat maximaal 10 cijfers.",
  diagnosecodeGeenCijfers: "Dit is een niet bestaande diagnose code. Een diagnose code bevat alleen cijfers.",
  ingangsdatumLeeg: "Je hebt niets ingevuld. Vul de ingangsdatum in.",
  ingangsdatumToekomst: "Je hebt een datum in de toekomst ingevuld. Vul een geldige ingangsdatum in.",
  situatieLeeg: "Je hebt geen situatie gekozen. Kies een situatie.",
  aantalLeeg: "Je hebt niets ingevuld. Vul het aantal behandelingen op chronische indicatie in.",
  redenLeeg: "Je hebt niets ingevuld. Vul de reden voor de nieuwe chronische indicatie in.",
  toelichtingLeeg: "Je hebt niets ingevuld. Vul de reden voor de nieuwe chronische indicatie in.",
  naamPraktijkLeeg: "Je hebt niets ingevuld. Vul de naam van de praktijk in.",
  agbLeeg: "Je hebt niets ingevuld. Vul de AGB code van de praktijk in.",
  agbOngeldig: "Je hebt niet een juiste AGB code. De AGB code van de praktijk bestaat uit 8 cijfers.",
  emailLeeg: "Je hebt niets ingevuld. Vul een e-mailadres in waarop we je kunnen bereiken.",
  emailOngeldig: "Je hebt iets niet goed ingevuld. Vul een geldig e-mailadres in.",

  // Aannames: de draw.io heeft hier geen melding voor.
  /** Ingangsdatum die geen bestaande datum is: zelfde patroon als bij de geboortedatum. */
  ingangsdatumOngeldig: "Je hebt geen geldige datum ingevuld. Vul een geldige ingangsdatum in.",
  /** Aantal behandelingen buiten 0 tot 99 of geen getal (de draw.io noemt alleen de waarden "tussen 0 en 99"). */
  aantalOngeldig: "Je hebt iets niet goed ingevuld. Vul een aantal tussen 0 en 99 in.",
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

  if (!state.geboortedatum) {
    // Niets getypt: "niets ingevuld". Wel getypt maar geen bestaande datum: "geen geldige datum".
    fouten.geboortedatum = state.geboortedatumTekst.trim() ? FOUT.geboortedatumOngeldig : FOUT.geboortedatumLeeg;
  } else if (fromIsoDatum(state.geboortedatum) > vandaag()) fouten.geboortedatum = FOUT.geboortedatumOngeldig;
  return fouten;
}

export function valideerBehandeling(state: BehandelhistorieState): Fouten {
  const fouten: Fouten = {};
  const code = state.diagnosecode.trim();
  if (!code) fouten.diagnosecode = FOUT.diagnosecodeLeeg;
  else if (!ALLEEN_CIJFERS.test(code)) fouten.diagnosecode = FOUT.diagnosecodeGeenCijfers;
  else if (code.length > 10) fouten.diagnosecode = FOUT.diagnosecodeTeLang;

  if (!state.ingangsdatum) fouten.ingangsdatum = state.ingangsdatumTekst.trim() ? FOUT.ingangsdatumOngeldig : FOUT.ingangsdatumLeeg;
  else if (fromIsoDatum(state.ingangsdatum) > vandaag()) fouten.ingangsdatum = FOUT.ingangsdatumToekomst;

  if (!state.situatie) fouten.situatie = FOUT.situatieLeeg;

  if (state.situatie === "nieuw" || state.situatie === "zelfBetaald") {
    const aantal = state.aantalBehandelingen.trim();
    if (!aantal) fouten.aantalBehandelingen = FOUT.aantalLeeg;
    else if (!ALLEEN_CIJFERS.test(aantal) || aantal.length > 2) fouten.aantalBehandelingen = FOUT.aantalOngeldig;
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
