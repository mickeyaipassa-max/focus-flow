import { KENNISBANK_ALGEMEEN } from "./algemene-voorwaarden";
import { PROEFARTIKELEN } from "./proefartikelen";
import { VERRIJKING_ALGEMEEN } from "./verrijking-algemeen";
import { VERRIJKING_CASCO_ALLRISK } from "./verrijking-casco-allrisk";
import { VERRIJKING_CASCO_BEPERKT } from "./verrijking-casco-beperkt";
import { VERRIJKING_WA } from "./verrijking-wa";
import { KENNISBANK_WEBSITE } from "./website-asr";
import { KENNISBANK_CASCO_ALLRISK } from "./autoverzekering-casco-allrisk";
import { KENNISBANK_CASCO_BEPERKT } from "./autoverzekering-casco-beperkt";
import { KENNISBANK_WA } from "./autoverzekering-wa";
import type { KennisItem, Verrijking } from "./types";

export { NIEUWWAARDE_STANDAARD } from "./autoverzekering-casco-beperkt";
export { NO_CLAIM_LADDER, SCHADEVRIJE_JAREN } from "./autoverzekering-wa";
export { PRODUCT_BRON, PRODUCT_NAAM, PRODUCT_URL, type KennisItem, type Product, type Verrijking } from "./types";

/**
 * Onderdelen die in de WA-voorwaarden en in de Casco Beperkt-voorwaarden met dezelfde tekst staan: id van het
 * WA-item en het artikel in de Casco Beperkt-voorwaarden. Elke tekst staat zo één keer in de kennisbank.
 */
const OOK_IN_CASCO_BEPERKT: Record<string, string> = {
  "polis-en-voorrang": "Je polis en de voorwaarden",
  landen: "2.2 In welke landen ben je verzekerd?",
  "algemene-uitsluitingen": "3.1 Algemene uitsluitingen",
  "uitsluiting-alcohol": "3.1 Uitsluiting 1 - alcohol, geneesmiddelen en drugs",
  "uitsluiting-rijbewijs": "3.1 Uitsluiting 2 en 3 - rijbewijs en rijbevoegdheid",
  "uitsluiting-wedstrijden": "3.1 Uitsluiting 4 - wedstrijden",
  "uitsluiting-verhuur": "3.1 Uitsluiting 5 - verhuur of lease",
  "uitsluiting-zakelijk": "3.1 Uitsluiting 6 - zakelijk gebruik",
  "uitsluiting-kenteken": "3.1 Uitsluiting 7 - kenteken niet op naam",
  "uitsluiting-toestemming": "3.1 Uitsluiting 8 - geen toestemming",
  "hulpverlening-nederland": "3.3 Hulpverlening in Nederland",
  "hulpverlening-diefstal-buitenland": "3.3 Gebeurtenis 2 - auto gestolen in het buitenland",
  "hulpverlening-schade-buitenland": "3.3 Gebeurtenis 3 - auto beschadigd in het buitenland",
  alarmcentrale: "3.3, 3.6, 4.5 en 6.5 - Alarmcentrale",
  "pechhulp-nederland": "3.6 Gebeurtenis 1 - pech in Nederland",
  "pechhulp-buitenland": "3.6 Gebeurtenis 2 en 3 - pech in het buitenland",
  "vergoeding-anderen": "4.7 Vergoeding door anderen",
  reageren: "5.5 Tot wanneer kun je op onze beslissing reageren?",
  "juiste-gegevens": "6.1 De juiste gegevens opgeven",
  "schade-melden": "6.3 Schade melden",
  "gevolgen-verplichtingen": "6.8 Gevolgen als je je niet aan je verplichtingen houdt",
  "auto-verkopen": "8.2 Wat als je je auto verkoopt?",
  opzet: "8.3 Opzet of roekeloosheid",
  fraude: "8.4 Fraude",
  "criminele-activiteiten": "8.5 Criminele of strafbare activiteiten",
  terrorisme: "8.6 en Clausuleblad terrorismedekking",
  "contact-en-bedrijf": "Colofon",
};

/** Onderdelen van de WA-voorwaarden die in Casco Allrisk met dezelfde tekst staan, onder dat artikel (zelfde artikel als bij Casco Beperkt tenzij hier anders). */
const WA_OOK_IN_CASCO_ALLRISK: Record<string, string> = {
  "noclaim-uitleg": "6 en 7.1 De no-claimladder",
  "schadevrije-jaren": "7.2 De tabel schadevrije jaren",
};

/** Onderdelen van Casco Beperkt die in Casco Allrisk met dezelfde tekst staan: id en artikel in Casco Allrisk. */
const CASCO_BEPERKT_OOK_IN_ALLRISK: Record<string, string> = {
  "cb-wie-verzekerd": "1 Wie zijn verzekerd?",
  "cb-welke-auto": "2.1 Welke auto is verzekerd?",
  "cb-extras": "3, 3.2 en 4.3 Extra's",
  "cb-bevriezing": "3.1 Gebeurtenis 2 - bevriezing",
  "cb-bliksem": "3.1 Gebeurtenis 3 - blikseminslag",
  "cb-brand": "3.1 Gebeurtenis 4 - brand",
  "cb-diefstal": "3.1 Gebeurtenis 5 - diefstal, inbraak of joyrijden",
  "cb-sleutels": "3.1 Gebeurtenis 6 - diefstal sleutels",
  "cb-kortsluiting": "3.1 Gebeurtenis 7 - kortsluiting",
  "cb-luchtverkeer": "3.1 Gebeurtenis 8 - luchtverkeer",
  "cb-storm": "3.1 Gebeurtenis 20 - storm",
  "cb-onderhoud-slijtage": "3.1 Gebeurtenis 12, 14 en 19 - onderhoud en slijtage",
  "cb-onvoldoende-zorg": "3.1 Gebeurtenis 15 - onvoldoende zorg",
  "cb-hulpverlening": "3.3 Dekking Hulpverlening",
  "cb-hulp-geen-recht": "3.3 Wanneer heb je geen recht op hulpverlening?",
  "cb-nieuwwaarde-keuze": "3.4 Keuzedekking Nieuwwaarde 2 jaar of Nieuwwaarde 3 jaar",
  "cb-aankoopwaarde-keuze": "3.5 Keuzedekking Aankoopwaarde 1 jaar, 2 jaar of 3 jaar",
  "cb-pechhulp": "3.6 Keuzedekking Pechhulp",
  "cb-pech-geen-recht": "3.6 Wanneer heb je geen recht op pechhulp?",
  "cb-vergoeding-reparatie": "4.1 Beschadiging of diefstal van de auto",
  "cb-herstelbedrijf": "4.1 Geselecteerd herstelbedrijf",
  "cb-waarde-nieuwwaarde": "4.1 Waarde van een nieuw in Nederland gekochte auto (nieuwwaarde)",
  "cb-waarde-aankoopwaarde": "4.1 Waarde van een tweedehands of in het buitenland gekochte auto (aankoopwaarde)",
  "cb-dagwaarde": "4.1 en Begrippenlijst - dagwaarde",
  "cb-total-loss": "4.1 en 5.3 Total loss",
  "cb-kosten-vergoed": "4.4 Welke kosten vergoeden wij ook?",
  "cb-extra-kosten-diefstal": "4.4 Gebeurtenis 4 - extra kosten bij joyrijden of diefstal",
  "cb-vervangend-vervoer": "3.3, 3.6, 4.1 en 4.4 - vervangend vervoer en haal- en brengservice",
  "cb-schade-vaststellen": "5.1 Vaststelling van de schade",
  "cb-diefstal-afwikkeling": "5.2 Diefstal van de auto",
  "cb-uitbetaling": "5.4 Uitbetaling",
  "cb-aangifte": "6.2 Aangifte doen",
  "cb-medewerking": "6.6 Medewerking verlenen",
  "cb-wijzigingen": "6.7 Wijzigingen doorgeven",
  "cb-leenauto": "8.1 Schade met een leenauto van de garage",
  "cb-buitenland-verhuizen": "8.7 en 8.8 Verhuizing, buitenlands kenteken en stalling in het buitenland",
};

const WA_MET_CASCO: KennisItem[] = KENNISBANK_WA.map((item) => {
  const artikelCasco = OOK_IN_CASCO_BEPERKT[item.id];
  const artikelAllrisk = WA_OOK_IN_CASCO_ALLRISK[item.id] ?? artikelCasco;
  if (!artikelCasco && !artikelAllrisk) return item;
  const artikelen = { ...item.artikelen };
  if (artikelCasco) artikelen["casco-beperkt"] = artikelCasco;
  if (artikelAllrisk) artikelen["casco-allrisk"] = artikelAllrisk;
  return { ...item, artikelen };
});

const CASCO_BEPERKT_MET_ALLRISK: KennisItem[] = KENNISBANK_CASCO_BEPERKT.map((item) => {
  const artikelAllrisk = CASCO_BEPERKT_OOK_IN_ALLRISK[item.id];
  return artikelAllrisk ? { ...item, artikelen: { ...item.artikelen, "casco-allrisk": artikelAllrisk } } : item;
});

/**
 * De klantvriendelijke laag per uitrolgroep (zie `Verrijking`): eerst de tien proefartikelen, daarna per document.
 * `scripts/kennisbank-overzicht.mts <groep>` maakt per groep het overzicht oud/nieuw.
 */
export const VERRIJKING_GROEPEN: Record<string, Record<string, Verrijking>> = {
  proefartikelen: PROEFARTIKELEN,
  "algemene-voorwaarden": VERRIJKING_ALGEMEEN,
  wa: VERRIJKING_WA,
  "casco-beperkt": VERRIJKING_CASCO_BEPERKT,
  "casco-allrisk": VERRIJKING_CASCO_ALLRISK,
};
const VERRIJKINGEN: Record<string, Verrijking> = Object.assign({}, ...Object.values(VERRIJKING_GROEPEN));

/**
 * Alle onderdelen: de vier voorwaardendocumenten (WA, Casco Beperkt, Casco Allrisk met de gedeelde teksten, Algemene
 * voorwaarden) en de productpagina's op asr.nl. De website staat als laatste: bij gelijke score wint de voorwaardentekst.
 */
export const KENNISBANK: KennisItem[] = [...WA_MET_CASCO, ...CASCO_BEPERKT_MET_ALLRISK, ...KENNISBANK_CASCO_ALLRISK, ...KENNISBANK_ALGEMEEN, ...KENNISBANK_WEBSITE].map((item) => {
  const verrijking = VERRIJKINGEN[item.id];
  return verrijking ? { ...item, verrijking } : item;
});
