/**
 * Fase 4: vindt de zoekfunctie de juiste kennisblokken, ook bij andere formuleringen dan de zoekwoorden?
 * Geen taalmodel nodig:  npx tsx scripts/test-zoeken.mts
 * Een vraag slaagt als het verwachte blok in de context zit (de gevonden blokken en de gerelateerde blokken erbij).
 */
import { zoekContext } from "../lib/kennisbank/zoek";

const BEPERKT = ["site-wa", "wa", "site-casco-beperkt", "casco-beperkt"] as const;
const ALLRISK = ["site-wa", "wa", "site-casco-allrisk", "casco-allrisk"] as const;
const WA = ["site-wa", "wa"] as const;

const gevallen: { vraag: string; verwacht: string[]; producten?: readonly string[] }[] = [
  // Diefstal en inbraak, in andere woorden
  { vraag: "Mijn auto is gestolen.", verwacht: ["cb-diefstal", "cb-aangifte"] },
  { vraag: "Mijn auto is weg.", verwacht: ["cb-diefstal", "cb-aangifte"] },
  { vraag: "Mijn auto is vannacht gejat", verwacht: ["cb-diefstal", "cb-aangifte"] },
  { vraag: "Er is ingebroken in mijn auto.", verwacht: ["cb-diefstal"] },
  { vraag: "Ze hebben mijn ruit ingeslagen en mijn tas meegenomen", verwacht: ["cb-diefstal"] },
  { vraag: "Mijn autosleutel is gestolen", verwacht: ["cb-sleutels"] },
  // Opzegging
  { vraag: "Ik wil mijn verzekering stoppen.", verwacht: ["al-opzeggen-jij"] },
  { vraag: "Kan ik mijn polis beëindigen?", verwacht: ["al-opzeggen-jij"] },
  { vraag: "Hoe annuleer ik mijn autoverzekering?", verwacht: ["al-opzeggen-jij"] },
  { vraag: "Ik wil overstappen naar een andere verzekeraar", verwacht: ["al-opzeggen-jij"] },
  { vraag: "Ik heb mijn auto verkocht, wat nu met mijn verzekering?", verwacht: ["auto-verkopen"] },
  // Schade melden
  { vraag: "Hoe geef ik schade door?", verwacht: ["schade-melden"] },
  { vraag: "Ik wil een claim indienen", verwacht: ["schade-melden"] },
  { vraag: "Ik heb schade, wat moet ik doen?", verwacht: ["schade-melden"] },
  // Eigen risico
  { vraag: "Moet ik zelf bijbetalen bij schade?", verwacht: ["cb-eigen-risico"] },
  { vraag: "Wat is mijn eigen bijdrage bij een ruit?", verwacht: ["cb-eigen-risico"] },
  // Dekkingen
  { vraag: "Wat dekt allrisk?", verwacht: ["ca-dekking-overzicht"], producten: ALLRISK },
  { vraag: "Ben ik verzekerd als ik zelf schuld heb aan een aanrijding?", verwacht: ["ca-aanrijding", "ca-dekking-overzicht", "sw-ca-eigen-schuld"], producten: ALLRISK },
  { vraag: "Wat dekt WA+?", verwacht: ["cb-dekking-overzicht", "sw-cb-wat-is"] },
  { vraag: "Wat is er verzekerd met alleen WA?", verwacht: ["wa-dekking", "sw-wa-verzekerd"], producten: WA },
  { vraag: "Is schade aan mijn eigen auto gedekt met WA?", verwacht: ["wa-dekking", "eigen-auto-schade", "sw-wa-verzekerd"], producten: WA },
  // Schadevrije jaren en nieuwwaarde
  { vraag: "Wat gebeurt er met mijn schadevrije jaren als ik schade heb?", verwacht: ["schadevrije-jaren"] },
  { vraag: "Ik heb mijn no-claim opgebouwd, wat als ik een ongeluk krijg?", verwacht: ["schadevrije-jaren", "noclaim-uitleg"] },
  { vraag: "Mijn auto is nieuw, hoeveel krijg ik bij schade?", verwacht: ["cb-waarde-nieuwwaarde"] },
  { vraag: "Wat is de nieuwwaarderegeling?", verwacht: ["cb-waarde-nieuwwaarde"] },
  // Uitsluitingen
  { vraag: "Mijn vriend heeft gedronken en reed mijn auto, ben ik verzekerd?", verwacht: ["uitsluiting-alcohol"] },
  { vraag: "Hoeveel promille mag ik hebben?", verwacht: ["uitsluiting-alcohol"] },
  { vraag: "Wanneer krijg ik geen vergoeding?", verwacht: ["sw-geen-vergoeding", "algemene-uitsluitingen"] },
  // Algemene voorwaarden
  { vraag: "Ik heb mijn premie niet betaald", verwacht: ["al-premie-betalen"] },
  { vraag: "Wat gebeurt er als ik niet betaal?", verwacht: ["al-premie-betalen"] },
  { vraag: "Wanneer gaat mijn verzekering in?", verwacht: ["al-begin"] },
  { vraag: "Is mijn verzekering al ingegaan?", verwacht: ["al-begin"] },
  { vraag: "Ik ga naar Duitsland verhuizen", verwacht: ["al-uitwonend-buitenland", "cb-buitenland-verhuizen"] },
  { vraag: "Mijn zoon gaat op kamers wonen", verwacht: ["al-uitwonend-buitenland"] },
  { vraag: "Mijn premie wordt duurder, mag dat?", verwacht: ["al-premie-wijzigen"] },
  { vraag: "Mag a.s.r. mijn verzekering opzeggen als ik schade heb gehad?", verwacht: ["al-opzeggen-wij"] },
  { vraag: "Ik wil een klacht indienen", verwacht: ["al-klacht"] },
  { vraag: "Wat is fraude?", verwacht: ["al-fraude"] },
  { vraag: "Kan ik een telefoongesprek terugluisteren?", verwacht: ["al-telefoongesprekken"] },
  { vraag: "Wat doen jullie met mijn gegevens?", verwacht: ["al-persoonsgegevens"] },
  { vraag: "Ik ben ooit failliet geweest, is dat erg?", verwacht: ["al-verklaring-financieel"] },
  { vraag: "Mijn auto is total loss, wat gebeurt er met mijn verzekering?", verwacht: ["al-geen-belang"] },
  { vraag: "Ik wil mijn afschrijving laten terugboeken", verwacht: ["al-storneren"] },
  { vraag: "Welk recht geldt er voor mijn verzekering?", verwacht: ["al-recht"] },
];

let mislukt = 0;
for (const { vraag, verwacht, producten } of gevallen) {
  const context = zoekContext(vraag, { producten: (producten ?? BEPERKT) as never }, 3);
  const ids = context.map((onderdeel) => onderdeel.id);
  const ok = verwacht.some((id) => ids.includes(id));
  if (!ok) mislukt++;
  console.log(`${ok ? "✓" : "✗"} ${vraag}\n    -> ${ids.join(", ") || "(niets)"}${ok ? "" : `   (verwacht: ${verwacht.join(" of ")})`}`);
}
console.log(`\n${gevallen.length - mislukt} van ${gevallen.length} gevonden`);
process.exit(mislukt > 0 ? 1 : 0);
