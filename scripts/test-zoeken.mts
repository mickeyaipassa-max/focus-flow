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
  // WA-voorwaarden
  { vraag: "Ben ik verzekerd in Spanje?", verwacht: ["landen"] },
  { vraag: "Ik heb een caravan achter mijn auto", verwacht: ["wa-aanhanger"] },
  { vraag: "Mijn auto wil niet starten", verwacht: ["pechhulp", "pechhulp-nederland"] },
  { vraag: "Mijn auto is kapot in Frankrijk", verwacht: ["pechhulp-buitenland", "hulpverlening-schade-buitenland", "pechhulp"] },
  { vraag: "Wie betaalt de schade van de ander?", verwacht: ["schadevergoeding-benadeelde", "wa-dekking"] },
  { vraag: "Hoe lang heb ik om te reageren op jullie besluit?", verwacht: ["reageren"] },
  { vraag: "Ik ben verhuisd, moet ik dat doorgeven?", verwacht: ["wijzigingen-doorgeven"] },
  { vraag: "Ik verhuur mijn auto via Snappcar", verwacht: ["uitsluiting-verhuur"] },
  { vraag: "Ik werk als taxichauffeur", verwacht: ["uitsluiting-zakelijk"] },
  { vraag: "Mijn rijbewijs is verlopen", verwacht: ["uitsluiting-rijbewijs"] },
  { vraag: "Hij reed in mijn auto zonder dat ik het wist", verwacht: ["uitsluiting-toestemming"] },
  { vraag: "Hoe werkt de no-claim?", verwacht: ["noclaim-uitleg"] },
  { vraag: "Telt een schade zonder schuld mee voor mijn no-claim?", verwacht: ["schade-zonder-schuld", "noclaim-geen-gevolg"] },
  { vraag: "Wat is een geselecteerde garage?", verwacht: ["garage-keuze"] },
  { vraag: "Ik moet een borg betalen om vrij te komen", verwacht: ["waarborgsom"] },
  { vraag: "Ik heb een leenauto van de garage gekregen", verwacht: ["leenauto"] },
  { vraag: "Wat is terrorisme dekking?", verwacht: ["terrorisme"] },
  { vraag: "Wat betekent molest?", verwacht: ["begrippen"] },
  { vraag: "Mijn tweede auto is beschadigd door mijn eerste auto", verwacht: ["wa-eigen-voertuigen"] },
  { vraag: "Ben ik verzekerd als ik iemand sleep?", verwacht: ["wa-slepen"] },
  { vraag: "Mijn lading is van de aanhanger gevallen", verwacht: ["wa-lading", "wa-aanhanger"] },
  { vraag: "Mijn partner is gewond geraakt als bestuurder", verwacht: ["wa-bestuurder"] },
  { vraag: "Wat doet de alarmcentrale?", verwacht: ["alarmcentrale"] },
  { vraag: "Wat is een waarborgsom?", verwacht: ["waarborgsom"] },
  { vraag: "Iemand heeft mij aansprakelijk gesteld, moet ik zelf betalen?", verwacht: ["schadevergoeding-benadeelde"] },
  // Casco beperkt: weer, dieren, ruit, sleutels, afhandeling
  { vraag: "Er is een boom op mijn auto gevallen tijdens de storm", verwacht: ["cb-storm"], producten: BEPERKT },
  { vraag: "Mijn auto heeft hagelschade", verwacht: ["cb-natuurramp"], producten: BEPERKT },
  { vraag: "Ik heb een ree aangereden", verwacht: ["cb-dieren"], producten: BEPERKT },
  { vraag: "Mijn voorruit heeft een steenslag", verwacht: ["cb-ruitschade"], producten: BEPERKT },
  { vraag: "Mijn autosleutels zijn kwijt, wat vergoeden jullie?", verwacht: ["cb-sleutels"], producten: BEPERKT },
  { vraag: "Mijn auto is in brand gevlogen", verwacht: ["cb-brand"], producten: BEPERKT },
  { vraag: "Mijn auto is total loss, hoeveel krijg ik?", verwacht: ["cb-total-loss", "cb-uitbetaling"], producten: BEPERKT },
  { vraag: "Naar welke garage mag ik voor reparatie?", verwacht: ["cb-herstelbedrijf", "cb-vergoeding-reparatie"], producten: BEPERKT },
  { vraag: "Krijg ik een leenauto tijdens de reparatie?", verwacht: ["cb-vervangend-vervoer", "sw-vervangend-vervoer"], producten: BEPERKT },
  { vraag: "Ik krijg de aankoopwaarde, wat betekent dat?", verwacht: ["cb-waarde-aankoopwaarde", "cb-aankoopwaarde-keuze"], producten: BEPERKT },
  { vraag: "Ik ga in het buitenland wonen, wat moet ik doen met mijn verzekering?", verwacht: ["cb-buitenland-verhuizen"], producten: BEPERKT },
  { vraag: "Ik verhuis volgend jaar naar België, blijft mijn autoverzekering lopen?", verwacht: ["cb-buitenland-verhuizen", "al-uitwonend-buitenland"], producten: BEPERKT },
  { vraag: "Ik ben het niet eens met de schadevaststelling", verwacht: ["cb-schade-vaststellen"], producten: BEPERKT },
  { vraag: "Mijn auto start niet meer door slijtage, is dat gedekt?", verwacht: ["cb-onderhoud-slijtage", "cb-pechhulp"], producten: BEPERKT },
  { vraag: "Ik reed in een leenauto en kreeg schade", verwacht: ["cb-leenauto"], producten: BEPERKT },
  // Casco allrisk
  { vraag: "Ik ben met mijn auto geslipt en tegen een vangrail gereden", verwacht: ["ca-aanrijding"], producten: ALLRISK },
  { vraag: "Mijn auto is te water geraakt", verwacht: ["ca-aanrijding"], producten: ALLRISK },
  { vraag: "Mijn zoon van 20 heeft een aanrijding gehad, moet ik extra betalen?", verwacht: ["ca-jeugd-eigen-risico"], producten: ALLRISK },
  { vraag: "Wat is het extra eigen risico voor jonge bestuurders?", verwacht: ["ca-jeugd-eigen-risico"], producten: ALLRISK },
  { vraag: "Mijn versnellingsbak is kapot, vergoeden jullie dat?", verwacht: ["ca-motor"], producten: ALLRISK },
  { vraag: "Mijn motor heeft een defect, auto is 2 jaar oud", verwacht: ["ca-motor"], producten: ALLRISK },
  { vraag: "Er is een fabricagefout in mijn auto", verwacht: ["ca-materiaalfouten"], producten: ALLRISK },
  { vraag: "Iemand heeft mijn auto bekrast", verwacht: ["ca-rellen-vandalisme"], producten: ALLRISK },
  { vraag: "Mijn auto is door vandalisme beschadigd, wat moet ik doen?", verwacht: ["ca-rellen-vandalisme"], producten: ALLRISK },
  { vraag: "Mijn auto heeft hagelschade", verwacht: ["ca-natuurramp"], producten: ALLRISK },
  { vraag: "Mijn auto is beschadigd tijdens vervoer per autotrein", verwacht: ["ca-transport"], producten: ALLRISK },
  { vraag: "Mijn ruit is gebarsten, betaal ik eigen risico?", verwacht: ["ca-ruitschade", "ca-eigen-risico"], producten: ALLRISK },
  { vraag: "Telt een schade door een fietser mee voor mijn no-claim?", verwacht: ["ca-noclaim-geen-gevolg"], producten: ALLRISK },
  { vraag: "Welke schade telt niet mee voor mijn schadevrije jaren?", verwacht: ["ca-noclaim-geen-gevolg"], producten: ALLRISK },
  { vraag: "Heeft schade aan een ander gevolgen voor mijn no-claim?", verwacht: ["ca-noclaim-wa-schade", "schade-zonder-schuld", "noclaim-geen-gevolg", "noclaim-uitleg"], producten: ALLRISK },
  { vraag: "Wat betekent eigen gebrek?", verwacht: ["ca-begrippen", "ca-materiaalfouten"], producten: ALLRISK },
  // asr.nl-pagina's
  { vraag: "Wat kost een autoverzekering ongeveer?", verwacht: ["sw-premie"] },
  { vraag: "Waar hangt mijn premie van af?", verwacht: ["sw-premie"] },
  { vraag: "Welke dekking moet ik kiezen voor mijn auto van 8 jaar?", verwacht: ["sw-adviseur", "sw-cb-verzekerd", "sw-vergelijken"] },
  { vraag: "Kan ik van WA naar allrisk overstappen?", verwacht: ["sw-dekking-aanpassen"] },
  { vraag: "Mag mijn vriendin mijn auto lenen?", verwacht: ["sw-iemand-anders-rijdt", "uitsluiting-toestemming"] },
  { vraag: "Welke extra dekkingen kan ik erbij nemen?", verwacht: ["sw-aanvullende-dekkingen"] },
  { vraag: "Waar vind ik de polisvoorwaarden?", verwacht: ["sw-documenten"] },
  { vraag: "Wat is het verschil tussen WA plus en allrisk?", verwacht: ["sw-vergelijken"] },
  { vraag: "Hoeveel vergoedt WA als ik iemand verwond heb?", verwacht: ["sw-wa-bedragen"] },
  { vraag: "Kan ik de nieuwwaarde langer dan een jaar meeverzekeren?", verwacht: ["sw-nieuwwaarde-aankoopwaarde"] },
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
