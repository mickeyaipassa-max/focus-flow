import { fromIsoDatum } from "@/lib/datum";
import { ADRES_ONBEKEND, isOpzoekbaar } from "./adres";
import type { BewindState } from "./funnel-context";

/*
 * Validatieregels van het bewindvoerdersformulier, naar de validatiepanelen in Figma (section
 * "foutmeldingen en validaties"). Foutteksten volgen het patroon van asr.nl: "Je hebt niets ingevuld." /
 * "Je hebt niets gekozen." of "Je hebt iets niet goed ingevuld." plus uitleg. Teksten die in Figma als
 * "voorstel" staan, zijn nog niet afgestemd.
 */
export const FOUT = {
  soortLeeg: "Je hebt niets gekozen. Kies of je particulier of zakelijk bewindvoerder bent.",
  voornamenLeeg: "Je hebt niets ingevuld. Vul je voornamen in.",
  achternaamLeeg: "Je hebt niets ingevuld. Vul je achternaam in.",
  tekens: "Je hebt iets niet goed ingevuld. Gebruik alleen letters, spaties, komma’s, punten, apostroffen ' of streepjes -.",
  geboortedatumLeeg: "Je hebt niets ingevuld. Vul je geboortedatum in.",
  datumOngeldig: "Je hebt iets niet goed ingevuld. Vul een geldige datum in.",
  geboortedatumFormaat: "Je hebt iets niet goed ingevuld. Vul een geldige geboortedatum in. Bijvoorbeeld: dd-mm-jjjj.",
  jongerDan18: "Je hebt iets niet goed ingevuld. Je mag niet jonger dan 18 jaar zijn.",
  ouderDan120: "Je hebt iets niet goed ingevuld. Je moet jonger dan 121 jaar zijn.",
  emailLeeg: "Je hebt niets ingevuld. Vul je e-mailadres in.",
  emailOngeldig: "Je hebt iets niet goed ingevuld. Vul een geldig e-mailadres in. Voorbeeld: naam@voorbeeld.nl.",
  telefoonOngeldig: "Je hebt iets niet goed ingevuld. Vul een geldig telefoonnummer in. Bijvoorbeeld: 06 10 10 10 10.",
  postcodeLeeg: "Je hebt niets ingevuld. Vul je postcode in.",
  postcodeOngeldig: "Je hebt iets niet goed ingevuld. Vul een geldige postcode in. Bijvoorbeeld: 1234 AB.",
  huisnummerLeeg: "Je hebt niets ingevuld. Vul je huisnummer in.",
  huisnummerTeLaag: "Je hebt iets niet goed ingevuld. Het huisnummer mag minimaal 1 zijn.",
  huisnummerTeHoog: "Je hebt iets niet goed ingevuld. Het huisnummer mag maximaal 99999 zijn.",
  postbusnummerLeeg: "Je hebt niets ingevuld. Vul je postbusnummer in.",
  plaatsLeeg: "Je hebt niets ingevuld. Vul je plaats in.",
  statutaireNaamLeeg: "Je hebt niets ingevuld. Vul de statutaire naam in.",
  kvkLeeg: "Je hebt niets ingevuld. Vul je KvK-nummer in.",
  kvkOngeldig: "Je hebt iets niet goed ingevuld. Vul een geldig KvK-nummer in. Bijvoorbeeld: 12345678.",
  zaaknummerLeeg: "Je hebt niets ingevuld. Vul het zaaknummer van de rechtbank in.",
  startdatumLeeg: "Je hebt niets ingevuld. Vul de startdatum van het bewind in.",
  einddatumVoorStart: "Je hebt iets niet goed ingevuld. De einddatum moet na de startdatum liggen.",
  beschikkingLeeg: "Je hebt niets gekozen. Voeg de beschikking toe.",
  identiteitsbewijsLeeg: "Je hebt niets gekozen. Voeg je identiteitsbewijs toe.",
  betaalvoorkeurLeeg: "Je hebt niets gekozen. Kies hoe je wilt betalen.",
  betaalmailLeeg: "Je hebt niets ingevuld. Vul het e-mailadres voor de betaalmail in.",
  ibanLeeg: "Je hebt niets ingevuld. Vul je rekeningnummer (IBAN) in.",
  ibanOngeldig: "Je hebt iets niet goed ingevuld. Vul een Nederlands rekeningnummer (IBAN) in.",
  klantVoornamenLeeg: "Je hebt niets ingevuld. Vul de voornamen van je cliënt in.",
  klantAchternaamLeeg: "Je hebt niets ingevuld. Vul de achternaam van je cliënt in.",
  klantGeboortedatumLeeg: "Je hebt niets ingevuld. Vul de geboortedatum van je cliënt in.",
  klantPostcodeLeeg: "Je hebt niets ingevuld. Vul de postcode van je cliënt in.",
  klantHuisnummerLeeg: "Je hebt niets ingevuld. Vul het huisnummer van je cliënt in.",
  straatLeeg: "Je hebt niets ingevuld. Vul je straatnaam in.",
  woonplaatsLeeg: "Je hebt niets ingevuld. Vul je plaats in.",
  klantStraatLeeg: "Je hebt niets ingevuld. Vul de straatnaam van je cliënt in.",
  klantWoonplaatsLeeg: "Je hebt niets ingevuld. Vul de plaats van je cliënt in.",
  jaNeeLeeg: "Je hebt niets gekozen. Kies ja of nee.",
} as const;

export type Fouten = Partial<Record<string, string>>;

const NAAM = /^[\p{L} ,.'’-]+$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTCODE = /^\d{4} ?[a-zA-Z]{2}$/;
const DATUM_FORMAAT = /^\d{2}-\d{2}-\d{4}$/;
const KVK = /^\d{8}$/;
/** Nederlands nummer: 10 cijfers met voorloop-0, of 9 cijfers na +31. */
const TELEFOON = /^0?\d{9}$/;

function vandaag() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function leeftijd(geboren: Date) {
  const nu = vandaag();
  let jaren = nu.getFullYear() - geboren.getFullYear();
  if (nu.getMonth() < geboren.getMonth() || (nu.getMonth() === geboren.getMonth() && nu.getDate() < geboren.getDate())) jaren--;
  return jaren;
}

/** IBAN-controle (mod 97) beperkt tot Nederlandse rekeningnummers, zoals asr.nl. */
export function isNederlandseIban(waarde: string) {
  const iban = waarde.replace(/\s/g, "").toUpperCase();
  if (!/^NL\d{2}[A-Z]{4}\d{10}$/.test(iban)) return false;
  const herschikt = iban.slice(4) + iban.slice(0, 4);
  const cijfers = herschikt.replace(/[A-Z]/g, (letter) => String(letter.charCodeAt(0) - 55));
  let rest = 0;
  for (const cijfer of cijfers) rest = (rest * 10 + Number(cijfer)) % 97;
  return rest === 1;
}

/** Datumveld: leeg, verkeerd formaat of geen bestaande datum. `null` als de datum geldig is. */
function datumFout(iso: string, tekst: string, leeg: string, metFormaat = false): string | null {
  if (iso) return null;
  const getypt = tekst.trim();
  if (!getypt) return leeg;
  if (metFormaat && !DATUM_FORMAAT.test(getypt)) return FOUT.geboortedatumFormaat;
  return FOUT.datumOngeldig;
}

function naam(waarde: string, leeg: string) {
  const v = waarde.trim();
  if (!v) return leeg;
  return NAAM.test(v) ? null : FOUT.tekens;
}

function huisnummer(waarde: string, leeg: string) {
  const v = waarde.trim();
  if (!v) return leeg;
  const n = Number(v);
  if (!/^\d+$/.test(v) || n < 1) return FOUT.huisnummerTeLaag;
  return n > 99999 ? FOUT.huisnummerTeHoog : null;
}

/** Geldige postcode + huisnummer die niet gevonden zijn en niet handmatig zijn ingevuld: adres onbekend. */
function adres(fouten: Fouten, postcode: string, nummer: string, handmatig: boolean, gevonden: boolean, veld: string) {
  if (!handmatig && !gevonden && !fouten[veld] && isOpzoekbaar(postcode, nummer)) fouten[veld] = ADRES_ONBEKEND;
}

function zet(fouten: Fouten, veld: string, fout: string | null) {
  if (fout) fouten[veld] = fout;
}

export function valideerBewindvoerder(s: BewindState): Fouten {
  const f: Fouten = {};
  if (s.soort === "particulier") {
    zet(f, "voornamen", naam(s.voornamen, FOUT.voornamenLeeg));
    if (s.tussenvoegsel.trim() && !NAAM.test(s.tussenvoegsel.trim())) f.tussenvoegsel = FOUT.tekens;
    zet(f, "achternaam", naam(s.achternaam, FOUT.achternaamLeeg));
    const datum = datumFout(s.geboortedatum, s.geboortedatumTekst, FOUT.geboortedatumLeeg, true);
    if (datum) f.geboortedatum = datum;
    else {
      const jaren = leeftijd(fromIsoDatum(s.geboortedatum));
      if (jaren < 18) f.geboortedatum = FOUT.jongerDan18;
      else if (jaren > 120) f.geboortedatum = FOUT.ouderDan120;
    }
  } else {
    if (!s.statutaireNaam.trim()) f.statutaireNaam = FOUT.statutaireNaamLeeg;
    const kvk = s.kvkNummer.trim();
    if (!kvk) f.kvkNummer = FOUT.kvkLeeg;
    else if (!KVK.test(kvk)) f.kvkNummer = FOUT.kvkOngeldig;
  }

  const email = s.email.trim();
  if (!email) f.email = FOUT.emailLeeg;
  else if (!EMAIL.test(email)) f.email = FOUT.emailOngeldig;

  const telefoon = s.telefoon.replace(/[\s-]/g, "");
  if (telefoon && !TELEFOON.test(telefoon)) f.telefoon = FOUT.telefoonOngeldig;

  const postcode = s.postcode.trim();
  if (!postcode) f.postcode = FOUT.postcodeLeeg;
  else if (!POSTCODE.test(postcode)) f.postcode = FOUT.postcodeOngeldig;

  if (s.postbus) {
    if (!s.postbusnummer.trim()) f.postbusnummer = FOUT.postbusnummerLeeg;
    if (!s.plaats.trim()) f.plaats = FOUT.plaatsLeeg;
  } else {
    zet(f, "huisnummer", huisnummer(s.huisnummer, FOUT.huisnummerLeeg));
    adres(f, s.postcode, s.huisnummer, s.handmatig, s.adresGevonden, "huisnummer");
    if (s.handmatig) {
      if (!s.straat.trim()) f.straat = FOUT.straatLeeg;
      if (!s.woonplaats.trim()) f.woonplaats = FOUT.woonplaatsLeeg;
    }
  }
  return f;
}

export function valideerBewindgegevens(s: BewindState): Fouten {
  const f: Fouten = {};
  if (!s.zaaknummer.trim()) f.zaaknummer = FOUT.zaaknummerLeeg;
  zet(f, "startdatum", datumFout(s.startdatum, s.startdatumTekst, FOUT.startdatumLeeg));
  if (s.einddatumTekst.trim() && !s.einddatum) f.einddatum = FOUT.datumOngeldig;
  else if (s.einddatum && s.startdatum && fromIsoDatum(s.einddatum) <= fromIsoDatum(s.startdatum)) f.einddatum = FOUT.einddatumVoorStart;
  if (!s.beschikking.length) f.beschikking = FOUT.beschikkingLeeg;
  if (s.soort === "particulier" && !s.identiteitsbewijs.length) f.identiteitsbewijs = FOUT.identiteitsbewijsLeeg;
  if (s.betaalvoorkeur === "email") {
    const mail = s.emailBetaalmail.trim();
    if (!mail) f.emailBetaalmail = FOUT.betaalmailLeeg;
    else if (!EMAIL.test(mail)) f.emailBetaalmail = FOUT.emailOngeldig;
  }
  if (!s.iban.trim()) f.iban = FOUT.ibanLeeg;
  else if (!isNederlandseIban(s.iban)) f.iban = FOUT.ibanOngeldig;
  return f;
}

export function valideerKlant(s: BewindState): Fouten {
  const f: Fouten = {};
  zet(f, "klantVoornamen", naam(s.klantVoornamen, FOUT.klantVoornamenLeeg));
  if (s.klantTussenvoegsel.trim() && !NAAM.test(s.klantTussenvoegsel.trim())) f.klantTussenvoegsel = FOUT.tekens;
  zet(f, "klantAchternaam", naam(s.klantAchternaam, FOUT.klantAchternaamLeeg));
  zet(f, "klantGeboortedatum", datumFout(s.klantGeboortedatum, s.klantGeboortedatumTekst, FOUT.klantGeboortedatumLeeg, true));
  const postcode = s.klantPostcode.trim();
  if (!postcode) f.klantPostcode = FOUT.klantPostcodeLeeg;
  else if (!POSTCODE.test(postcode)) f.klantPostcode = FOUT.postcodeOngeldig;
  zet(f, "klantHuisnummer", huisnummer(s.klantHuisnummer, FOUT.klantHuisnummerLeeg));
  adres(f, s.klantPostcode, s.klantHuisnummer, s.klantHandmatig, s.klantAdresGevonden, "klantHuisnummer");
  if (s.klantHandmatig) {
    if (!s.klantStraat.trim()) f.klantStraat = FOUT.klantStraatLeeg;
    if (!s.klantWoonplaats.trim()) f.klantWoonplaats = FOUT.klantWoonplaatsLeeg;
  }
  if (!s.betalingsachterstand) f.betalingsachterstand = FOUT.jaNeeLeeg;
  if (!s.polisblad) f.polisblad = FOUT.jaNeeLeeg;
  return f;
}

export const isGeldig = (fouten: Fouten) => Object.keys(fouten).length === 0;
