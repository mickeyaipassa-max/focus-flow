/**
 * Controle van de drie "voor- en nadelen"-blokken (wa-voor-en-nadelen, cb-voor-en-nadelen, ca-voor-en-nadelen):
 *   npx tsx --tsconfig tsconfig.json scripts/test-voor-nadelen.mts
 *
 * Deze blokken zijn samenvattingen. Daarom staat hier per bewering in welk ander kennisblok ze staat (en met welke woorden). Een
 * bewering die nergens in de kennisbank staat, hoort niet in zo'n blok; premievergelijkingen staan er daarom niet in.
 * Ook elk getal in de blokken moet in een ander kennisblok voorkomen.
 */
import { KENNISBANK } from "../lib/kennisbank/index";

let fouten = 0;
const mislukt = (t: string) => {
  fouten++;
  console.log(`✗ ${t}`);
};

const tekstVan = (id: string) => {
  const i = KENNISBANK.find((k) => k.id === id);
  if (!i) return null;
  const v = i.verrijking;
  return [i.tekst, v?.uitleg, ...(v?.direct ?? []), ...(v?.aandachtspunten ?? [])].filter(Boolean).join(" ");
};

type Claim = { blok: string; bewering: string; bron: string; bewijs: RegExp };
const CLAIMS: Claim[] = [
  // WA
  { blok: "wa-voor-en-nadelen", bewering: "verplicht als de auto op jouw naam staat", bron: "sw-wa-wat-is", bewijs: /wettelijk verplicht/i },
  { blok: "wa-voor-en-nadelen", bewering: "schade aan anderen en hun spullen waarvoor je aansprakelijk bent", bron: "wa-dekking", bewijs: /aan anderen en aan hun spullen en waarvoor je aansprakelijk bent/i },
  { blok: "wa-voor-en-nadelen", bewering: "€ 6.450.000 letsel en € 2.500.000 spullen", bron: "sw-wa-bedragen", bewijs: /€ 6\.450\.000 per schadegeval.*€ 2\.500\.000/i },
  { blok: "wa-voor-en-nadelen", bewering: "verweer voeren als je niet aansprakelijk bent", bron: "wa-dekking", bewijs: /Ben je niet aansprakelijk, dan kunnen wij namens jou verweer voeren/i },
  { blok: "wa-voor-en-nadelen", bewering: "geen eigen risico voor schade aan anderen", bron: "eigen-risico", bewijs: /geen eigen risico voor schade aan anderen/i },
  { blok: "wa-voor-en-nadelen", bewering: "a.s.r. regelt de afhandeling en neemt contact op met de tegenpartij", bron: "sw-wa-schade-aan-ander", bewijs: /wij regelen de afhandeling.*verzekeraar van de tegenpartij/i },
  { blok: "wa-voor-en-nadelen", bewering: "eigen auto niet verzekerd", bron: "sw-wa-wat-is", bewijs: /Schade aan je eigen auto is niet verzekerd/i },
  { blok: "wa-voor-en-nadelen", bewering: "brand/storm/ruit/diefstal/1 jaar nieuwwaarde/aanrijding niet verzekerd", bron: "sw-wa-verzekerd", bewijs: /Niet verzekerd zijn: schade door brand, storm en natuur, ruitschade, diefstal, standaard 1 jaar nieuwwaarde en schade aan je eigen auto door aanrijding of vandalisme/i },
  { blok: "wa-voor-en-nadelen", bewering: "een gestolen auto is met alleen WA niet verzekerd", bron: "cb-diefstal", bewijs: /Met alleen WA is de gestolen auto zelf niet verzekerd/i },
  { blok: "wa-voor-en-nadelen", bewering: "letsel en spullen van de bestuurder niet verzekerd", bron: "wa-bestuurder", bewijs: /niet verzekerd voor personenschade van de bestuurder/i },
  { blok: "wa-voor-en-nadelen", bewering: "Schade inzittenden dekt bestuurder en passagiers", bron: "sw-aanvullende-dekkingen", bewijs: /Schade inzittenden: passagiers en bestuurder zijn verzekerd/i },
  { blok: "wa-voor-en-nadelen", bewering: "wie alleen WA kiest (10 jaar of ouder, lagere dagwaarde, eigen auto zelf betalen)", bron: "sw-wa-verzekerd", bewijs: /10 jaar of ouder is en dus een lagere dagwaarde.*schade aan hun eigen auto zelf willen betalen/i },
  // Casco beperkt
  { blok: "cb-voor-en-nadelen", bewering: "eigen auto verzekerd voor brand, storm en natuur", bron: "sw-cb-wat-is", bewijs: /schade aan je eigen auto door brand, storm en natuur/i },
  { blok: "cb-voor-en-nadelen", bewering: "diefstal, ruit- en inbraakschade", bron: "sw-cb-wat-is", bewijs: /diefstal, ruit- en inbraakschade/i },
  { blok: "cb-voor-en-nadelen", bewering: "aanrijding of vandalisme niet verzekerd", bron: "sw-cb-verzekerd", bewijs: /Niet verzekerd is schade aan je eigen auto door aanrijding of vandalisme/i },
  { blok: "cb-voor-en-nadelen", bewering: "standaard 1 jaar nieuwwaarde", bron: "sw-cb-verzekerd", bewijs: /standaard 1 jaar nieuwwaarde/i },
  { blok: "cb-voor-en-nadelen", bewering: "nieuwwaarde of aankoopwaarde tot 3 jaar meeverzekeren", bron: "sw-nieuwwaarde-aankoopwaarde", bewijs: /nieuwwaarde tot 3 jaar meeverzekeren.*aankoopwaarde tot 3 jaar meeverzekeren/i },
  { blok: "cb-voor-en-nadelen", bewering: "no-claimkorting tot 75%", bron: "sw-cb-wat-is", bewijs: /no-claimkorting tot 75%/i },
  { blok: "cb-voor-en-nadelen", bewering: "casco beperkt is niet verplicht", bron: "sw-cb-wat-is", bewijs: /Beperkt casco is niet verplicht/i },
  { blok: "cb-voor-en-nadelen", bewering: "bij ruitschade direct een afspraak bij een aangesloten hersteller", bron: "sw-ruitschade", bewijs: /hoef je deze niet eerst bij ons te melden: maak direct een afspraak bij een van onze aangesloten herstellers/i },
  { blok: "cb-voor-en-nadelen", bewering: "een ruit laten repareren kost geen eigen risico", bron: "cb-eigen-risico", bewijs: /Een ruit laten repareren.*kost geen eigen risico/i },
  { blok: "cb-voor-en-nadelen", bewering: "gratis vervangend vervoer bij een hersteller uit het netwerk", bron: "sw-vervangend-vervoer", bewijs: /aangesloten hersteller.*gratis vervangend vervoer/i },
  { blok: "cb-voor-en-nadelen", bewering: "total loss: 5 dagen gratis leenauto", bron: "sw-vervangend-vervoer", bewijs: /total loss.*5 dagen een gratis leenauto/i },
  { blok: "cb-voor-en-nadelen", bewering: "eigen risico gaat af van de vergoeding; keuze € 0, € 150, € 250 of € 500; hoger eigen risico, lagere premie", bron: "cb-eigen-risico", bewijs: /bedrag dat a\.s\.r\. van een schadevergoeding afhaalt.*€ 0, € 150, € 250 of € 500.*Hoe hoger je eigen risico, hoe lager je premie/i },
  { blok: "cb-voor-en-nadelen", bewering: "normaal onderhoud en slijtage niet vergoed", bron: "cb-onderhoud-slijtage", bewijs: /geen vergoeding voor de kosten van normaal onderhoud.*slijtage/i },
  { blok: "cb-voor-en-nadelen", bewering: "wie Casco beperkt kiest (6 tot 10 jaar, lagere dagwaarde, ruit/diefstal/brand, meer zekerheid dan WA)", bron: "sw-cb-verzekerd", bewijs: /6 tot 10 jaar oud.*lagere dagwaarde.*ruitbreuk, diefstal en brand.*meer zekerheid/i },
  // Casco allrisk
  { blok: "ca-voor-en-nadelen", bewering: "meest uitgebreide autoverzekering", bron: "sw-ca-wat-is", bewijs: /meest uitgebreide autoverzekering/i },
  { blok: "ca-voor-en-nadelen", bewering: "eigen auto verzekerd, ook als je die zelf veroorzaakt", bron: "sw-ca-wat-is", bewijs: /schade aan je eigen auto, ook als je die zelf veroorzaakt/i },
  { blok: "ca-voor-en-nadelen", bewering: "aanrijding of vandalisme verzekerd, plus brand/storm/natuur/ruit/diefstal/1 jaar nieuwwaarde", bron: "sw-ca-verzekerd", bewijs: /brand, storm en natuur, ruitschade, diefstal, standaard 1 jaar nieuwwaarde en schade aan je eigen auto door aanrijding of vandalisme/i },
  { blok: "ca-voor-en-nadelen", bewering: "motor, aandrijving, elektrische installatie en transmissie onder strikte voorwaarden", bron: "ca-motor", bewijs: /beschadiging van de motor, de aandrijving, de elektrische installatie en\/of de transmissie.*36 maanden.*100\.000 kilometer/i },
  { blok: "ca-voor-en-nadelen", bewering: "no-claimkorting tot 75%", bron: "sw-ca-wat-is", bewijs: /no-claimkorting tot 75%/i },
  { blok: "ca-voor-en-nadelen", bewering: "allrisk is niet verplicht", bron: "sw-ca-wat-is", bewijs: /Allrisk is niet verplicht/i },
  { blok: "ca-voor-en-nadelen", bewering: "eigen risico gaat af van de vergoeding", bron: "ca-eigen-risico", bewijs: /trekken we af van de schadevergoeding/i },
  { blok: "ca-voor-en-nadelen", bewering: "extra jeugd eigen risico van € 250 bij 24 jaar of ouder en een bestuurder jonger dan 24", bron: "ca-jeugd-eigen-risico", bewijs: /extra eigen risico van € 250.*24 jaar of ouder.*jonger dan 24 jaar/i },
  { blok: "ca-voor-en-nadelen", bewering: "met opzet veroorzaakte schade nooit verzekerd", bron: "sw-ca-eigen-schuld", bewijs: /met opzet veroorzaakt is nooit verzekerd/i },
  { blok: "ca-voor-en-nadelen", bewering: "onderhoud, onvoldoende zorg en slijtage niet gedekt", bron: "ca-dekking-overzicht", bewijs: /normaal onderhoud, onvoldoende onderhoud, onvoldoende zorg/i },
  { blok: "ca-voor-en-nadelen", bewering: "wie allrisk kiest (0 tot en met 5 jaar, hoge dagwaarde, zekerheid bij onverwachte schade)", bron: "sw-ca-verzekerd", bewijs: /0 tot en met 5 jaar oud.*hoge dagwaarde.*zekerheid willen bij onverwachte schade/i },
  // Alle drie
  ...["wa-voor-en-nadelen", "cb-voor-en-nadelen", "ca-voor-en-nadelen"].map((blok) => ({ blok, bewering: "a.s.r. geeft geen persoonlijk advies", bron: "sw-adviseur", bewijs: /geen persoonlijk advies/i })),
];

console.log("== Beweringen tegen de kennisbank");
for (const c of CLAIMS) {
  const tekst = tekstVan(c.bron);
  if (tekst === null) mislukt(`${c.blok}: bronblok ${c.bron} bestaat niet (${c.bewering})`);
  else if (!c.bewijs.test(tekst)) mislukt(`${c.blok}: "${c.bewering}" staat niet in ${c.bron}`);
}
const perBlok = (id: string) => CLAIMS.filter((c) => c.blok === id).length;
if (fouten === 0) console.log(`✓ ${perBlok("wa-voor-en-nadelen")} + ${perBlok("cb-voor-en-nadelen")} + ${perBlok("ca-voor-en-nadelen")} beweringen gevonden in andere kennisblokken`);

console.log("\n== Elk getal in de blokken staat in een ander kennisblok");
const GEEN_PREMIE = /€\s?\d+[,.]\d{2}\b|per maand/i;
for (const id of ["wa-voor-en-nadelen", "cb-voor-en-nadelen", "ca-voor-en-nadelen"]) {
  const item = KENNISBANK.find((k) => k.id === id);
  if (!item) {
    mislukt(`${id} bestaat niet`);
    continue;
  }
  const rest = KENNISBANK.filter((k) => k.id !== id).map((k) => tekstVan(k.id) ?? "").join(" ").replace(/[.,]/g, "");
  for (const getal of item.tekst.match(/\d[\d.]*/g) ?? []) {
    if (!rest.includes(getal.replace(/[.,]/g, ""))) mislukt(`${id}: getal "${getal}" staat in geen ander blok`);
  }
  if (GEEN_PREMIE.test(item.tekst + JSON.stringify(item.verrijking ?? {}))) mislukt(`${id}: bevat een premiebedrag of 'per maand'`);
  if (item.verrijking?.brontekstSoort !== "samenvatting") mislukt(`${id}: brontekstSoort is geen samenvatting`);
}
if (fouten === 0) console.log("✓ alle getallen komen elders in de kennisbank voor; geen premiebedragen");

console.log(fouten ? `\n${fouten} controle(s) mislukt` : "\nAlle controles geslaagd");
process.exit(fouten ? 1 : 0);
