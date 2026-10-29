/**
 * Kiest de chat de bron die bij het antwoord past? Geen taalmodel nodig:  npx tsx scripts/test-bronkeuze.mts
 * Elk geval is een echte vraag met een antwoord uit een testgesprek op de preview. Een geval slaagt als de bron onder
 * het antwoord bij een van de verwachte onderdelen hoort.
 */
import { zoekContext } from "../lib/kennisbank/zoek";
import { bronVanAntwoord } from "../lib/chat/bron";

const BEPERKT = ["site-wa", "wa", "site-casco-beperkt", "casco-beperkt"] as never;
const ALLRISK = ["site-wa", "wa", "site-casco-allrisk", "casco-allrisk"] as never;
const WA = ["site-wa", "wa"] as never;

const gevallen: { vraag: string; antwoord: string; producten: never; verwacht: string[] }[] = [
  { vraag: "Mijn auto heeft deuken door hagel. Is dat gedekt?", producten: ALLRISK, verwacht: ["ca-natuurramp"],
    antwoord: "Ja, met WA + Casco allrisk is schade door hagel aan je eigen auto verzekerd. De deuken vallen dus onder je dekking. Wat er precies wordt vergoed, gaat volgens de voorwaarden van Casco allrisk." },
  { vraag: "Mijn autosleutels zijn gestolen. Wat krijg ik vergoed?", producten: BEPERKT, verwacht: ["cb-sleutels"],
    antwoord: "Wat vervelend. Je krijgt tot € 500 vergoed voor nieuwe sleutels, nieuwe sloten en het omcoderen van de startonderbreker. Doe nog dezelfde dag aangifte bij de politie, of de volgende ochtend als het 's avonds of 's nachts gebeurde, en stuur ons het bewijs. Laat alles binnen 24 uur na de diefstal vervangen." },
  { vraag: "Ik ben geslipt en tegen een vangrail gereden. Wordt dat vergoed?", producten: ALLRISK, verwacht: ["ca-aanrijding", "ca-jeugd-eigen-risico"],
    antwoord: "Ja, met WA + Casco allrisk is schade aan je auto door slippen verzekerd, min het eigen risico op je polisblad. Schade aan de vangrail valt onder je WA, want die is van een ander. Was de bestuurder jonger dan 24 en de vaste bestuurder op je polis niet, dan komt er € 250 eigen risico bij. Wie reed er, en hoe oud is die persoon?" },
  { vraag: "Er zit een barst in mijn voorruit door steenslag. Wat nu?", producten: BEPERKT, verwacht: ["cb-ruitschade", "ruitschade", "sw-ruitschade"],
    antwoord: "Een barst door steenslag is verzekerd met jouw dekking, als er verder geen andere schade aan je auto is. Je hoeft het niet eerst te melden: maak direct een afspraak bij een hersteller via www.glasgarant.nl. Kies je een ander bedrijf, dan krijg je € 500 minder vergoed. Bij reparatie betaal je geen eigen risico, bij vervangen wel." },
  { vraag: "Mijn auto is getakeld en nu zitten er krassen in de lak. Vergoeden jullie dat?", producten: ALLRISK, verwacht: ["ca-takelen"],
    antwoord: "Nee, krassen en andere lakschade door takelen vergoeden wij niet, ook niet met Casco allrisk. Andere schade door takelen is alleen verzekerd als de auto aan of van boord van een binnenvaartschip is getakeld. Is er naast de krassen nog andere schade aan je auto?" },
  { vraag: "Mijn auto is beschadigd door een aardbeving. Is dat gedekt?", producten: ALLRISK, verwacht: ["ca-natuurramp"],
    antwoord: "Bij WA + Casco allrisk staat een aardbeving niet in de lijst van verzekerde natuurrampen. Bij WA + Casco beperkt staat een aardbeving of aardverschuiving wel in die lijst. Of je schade bij allrisk op een andere manier vergoed kan worden, kan ik hier niet zien. Neem daarvoor contact op met de klantenservice van a.s.r." },
  { vraag: "Iemand heeft mijn auto bekrast. Wat moet ik doen?", producten: ALLRISK, verwacht: ["ca-rellen-vandalisme"],
    antwoord: "Wat vervelend, krassen die iemand expres maakt vallen onder je dekking voor vandalisme. Doe zo snel mogelijk aangifte bij de politie, en uiterlijk binnen 14 dagen. Stuur het bewijs van die aangifte daarna zo snel mogelijk naar ons. Heb je al aangifte gedaan?" },
  { vraag: "Ik ben tegen een paal gereden, krijg ik dat vergoed?", producten: BEPERKT, verwacht: ["cb-dekking-overzicht", "sw-cb-verzekerd", "sw-vergelijken"],
    antwoord: "Nee, helaas niet. Met WA + Casco beperkt is schade aan je eigen auto door een botsing of aanrijding niet verzekerd. Die schade is wel gedekt met Casco allrisk, maar dat is een andere dekking dan die jij nu bekijkt. Wil je weten welke schade aan je eigen auto wel onder Casco beperkt valt?" },
  { vraag: "Wat kost mijn autoverzekering per maand?", producten: BEPERKT, verwacht: ["sw-premie"],
    antwoord: "Een vast bedrag per maand kan ik je hier niet geven. Je premie hangt onder meer af van de leeftijd van de bestuurder, je auto, je woonplaats en je schadevrije jaren. Online reken je in 1 minuut je eigen premie uit. Kies je een hoger eigen risico, dan betaal je minder premie." },
  { vraag: "Ik verhuis volgend jaar naar België. Blijft mijn autoverzekering dan gewoon lopen?", producten: BEPERKT, verwacht: ["cb-buitenland-verhuizen", "al-uitwonend-buitenland"],
    antwoord: "Nee, niet zomaar. Verhuis jij als verzekeringnemer naar België, dan stopt je autoverzekering uiterlijk op de eerstvolgende jaarlijkse verlengingsdatum. Krijgt je auto een Belgisch kenteken, dan stopt de verzekering direct. Geef je verhuizing binnen 30 dagen aan ons door." },
  { vraag: "Kan ik later mijn dekking nog veranderen?", producten: WA, verwacht: ["sw-dekking-aanpassen"],
    antwoord: "Ja, dat kan altijd. Je kunt op elk moment overstappen naar WA, WA + Casco beperkt of WA + Casco allrisk. Dat regel je zelf in je a.s.r. account. Daar zie je meteen wat de wijziging doet met je premie." },
  { vraag: "Tot welk bedrag vergoedt WA letselschade?", producten: WA, verwacht: ["sw-wa-bedragen", "verzekerd-bedrag"],
    antwoord: "Voor letsel van anderen betaalt a.s.r. maximaal € 6.450.000 per schadegeval. Dat geldt als jij aansprakelijk bent voor de schade. Het precieze maximum voor jouw verzekering staat ook op je polisblad. Let op: letsel van de bestuurder zelf valt niet onder WA." },
  { vraag: "Mijn auto is total loss. Krijg ik een leenauto?", producten: ALLRISK, verwacht: ["cb-vervangend-vervoer", "sw-vervangend-vervoer", "cb-total-loss"],
    antwoord: "Ja, bij total loss krijg je maximaal 5 dagen een gratis leenauto. Wordt je auto gedemonteerd, dan krijg je pas je vergoeding als je de auto met extra's overdraagt. Lever dan ook het kentekenbewijs, het overschrijvingsbewijs en alle sleutels in. Wil je weten hoe de vergoeding wordt berekend?" },
  { vraag: "Mijn zoon van 22 had een aanrijding met mijn auto. Betaal ik extra eigen risico?", producten: ALLRISK, verwacht: ["ca-jeugd-eigen-risico"],
    antwoord: "Dat hangt af van wie als vaste bestuurder op je polisblad staat. Is die persoon 24 jaar of ouder, dan betaal je € 250 extra eigen risico. Dat komt boven op het eigen risico op je polisblad, ook als daar geen eigen risico staat. Sta jij als vaste bestuurder op je polisblad?" },
  { vraag: "Ik heb een fietser aangereden en jullie betalen de schade. Telt dat mee voor mijn no-claim?", producten: ALLRISK, verwacht: ["ca-noclaim-geen-gevolg", "noclaim-geen-gevolg"],
    antwoord: "Dat hangt ervan af of de bestuurder iets te verwijten valt. Kun je aantonen dat dat niet zo is, dan telt de schade niet mee voor je no-claim. Lukt dat niet, dan kan het wel gevolgen hebben voor je trede en je schadevrije jaren. Weet je al of je kunt laten zien dat het niet jouw schuld was?" },
  { vraag: "Mijn motor is kapotgegaan. Krijg ik dat vergoed?", producten: ALLRISK, verwacht: ["ca-motor"],
    antwoord: "Soms wel, maar er gelden strenge voorwaarden, ook voor het onderhoud. Je auto moet nieuw zijn geweest toen hij op jouw naam kwam. Hij mag niet ouder zijn dan 36 maanden en maximaal 100.000 kilometer hebben gereden. Hoe oud is je auto en hoeveel kilometer heeft hij gereden?" },
  { vraag: "Er is een boom op mijn auto gevallen tijdens de storm. Is dat gedekt?", producten: BEPERKT, verwacht: ["cb-storm"],
    antwoord: "Ja, schade door een boom die tijdens een storm op je auto valt is verzekerd met WA + Casco beperkt. Storm is wind van 14 meter per seconde of meer. Is je auto omgewaaid, of is er iets op gevallen?" },
  { vraag: "Ik heb een ree aangereden. Krijg ik de schade vergoed?", producten: BEPERKT, verwacht: ["cb-dieren"],
    antwoord: "Ja, met WA + Casco beperkt is schade door een botsing met een loslopend dier verzekerd. Ben je daardoor ook tegen iets anders gebotst, dan wordt die extra schade niet vergoed. Een eigen risico op je polisblad gaat van de vergoeding af. Heb je alleen de ree geraakt, of ook iets anders, zoals een boom of paal?" },
  { vraag: "Mag ik mijn schade door mijn eigen garage laten repareren?", producten: BEPERKT, verwacht: ["cb-herstelbedrijf", "cb-vergoeding-reparatie", "garage-keuze"],
    antwoord: "Ja, dat mag, maar dan krijg je € 500 minder vergoed. Bij een herstelbedrijf waar a.s.r. mee samenwerkt, geldt die korting niet. Daar betaal je alleen een eventueel eigen risico en krijg je gratis vervangend vervoer. Wil je weten welke bedrijven dat zijn?" },
  { vraag: "Het schadebedrag dat jullie noemen is mij te laag. Wat kan ik doen?", producten: BEPERKT, verwacht: ["cb-schade-vaststellen"],
    antwoord: "Dan mag je zelf een tweede expert inschakelen, in overleg met onze expert. Komen zij er samen niet uit, dan kiezen ze een derde expert. Zijn besluit geldt voor jou en voor ons. De kosten van jouw expert betalen wij tot hetzelfde bedrag als wat onze expert kost." },
  { vraag: "Mijn auto is weg.", producten: BEPERKT, verwacht: ["cb-diefstal", "cb-aangifte"],
    antwoord: "Wat vervelend. Doe nog vandaag aangifte bij de politie, of de volgende ochtend als het 's avonds of 's nachts gebeurde. Stuur ons daarna het bewijs van de aangifte. Weet je zeker dat je auto gestolen is, en niet bijvoorbeeld weggesleept?" },
  { vraag: "Ik wil mijn verzekering stoppen. Ik heb hem 3 maanden geleden afgesloten", producten: BEPERKT, verwacht: ["al-opzeggen-jij"],
    antwoord: "Dan zit je nog in je eerste verzekeringsjaar, dus gewoon opzeggen kan nu niet. Dat kan pas als er een jaar voorbij is sinds je ingangsdatum, dus over ongeveer 9 maanden. Heb je je auto verkocht, of ben je het niet eens met een wijziging van je premie of voorwaarden?" },
];

let fouten = 0;
for (const g of gevallen) {
  const context = zoekContext(g.vraag, { producten: g.producten }, 3);
  const bron = bronVanAntwoord(g.antwoord, context);
  const gekozen = context.filter((o) => o.bronnen.length > 0 && o.bronnen === bron).map((o) => o.id);
  const ok = gekozen.some((id) => g.verwacht.includes(id));
  if (!ok) fouten++;
  console.log(`${ok ? "✓" : "✗"} ${g.vraag}\n    gekozen: ${gekozen.join(", ") || "(geen)"}   context: ${context.map((o) => o.id).join(", ")}${ok ? "" : `   (verwacht: ${g.verwacht.join(" of ")})`}`);
}
console.log(`\n${gevallen.length - fouten} van ${gevallen.length} goed`);
process.exit(fouten ? 1 : 0);
