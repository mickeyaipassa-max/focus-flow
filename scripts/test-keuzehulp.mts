/**
 * Controle van de keuzehulp op /workshop, zonder taalmodel:
 *   npx tsx --tsconfig tsconfig.json scripts/test-keuzehulp.mts
 *
 * 1. Staan de opening en de vier vaste antwoorden letterlijk zoals opgegeven?
 * 2. Staat elke inhoudelijke bewering in de vaste antwoorden in de kennisbank (of, voor "voordeligste", in de prijzen op de kaarten)?
 * 3. Volgen de vaste antwoorden de regels (2 tot 4 korte zinnen, hooguit één vraag, je/jij, geen juridische taal)?
 * 4. Vindt de route bij een kort vervolgantwoord ("5 jaar", "ja") nog steeds passende kennisbankonderdelen?
 * 5. Bevat de systeeminstructie de keuzehulpregels alleen in de keuzehulp, en weet de chat welke dekking is geselecteerd?
 */
import { readFileSync } from "node:fs";
import { KENNISBANK } from "../lib/kennisbank/index";
import { zoekContext } from "../lib/kennisbank/zoek";
import { KEUZEHULP_OPENING, KEUZEHULP_TAGS, keuzehulpContext, zoektermenVanGesprek } from "../lib/chat/keuzehulp";
import { systeemInstructie } from "../lib/chat/systeem-instructie";

let fouten = 0;
const mislukt = (t: string) => {
  fouten++;
  console.log(`✗ ${t}`);
};
const goed = (t: string) => console.log(`✓ ${t}`);

// 1. Letterlijk zoals opgegeven ---------------------------------------------------------------------------------------------
console.log("== 1. Opening en vaste antwoorden zoals opgegeven");
const OPGEGEVEN = {
  opening: "Ik help je graag kiezen! 😊\nWat vind je belangrijk bij je autoverzekering?",
  tags: [
    ["Vooral een lage premie", "Dan is WA vaak de voordeligste keuze. Daarmee verzeker je schade die je met je auto bij anderen veroorzaakt. Vind je het belangrijk dat diefstal en ruitschade ook verzekerd zijn?"],
    ["Ook mijn eigen auto verzekeren", "Dan kijken we naar WA + Casco beperkt en WA + Casco allrisk. Welke dekking past, hangt af van je auto en welke schades je wilt verzekeren. Hoe oud is je auto?"],
    ["Dat weet ik nog niet", "Geen probleem, we kijken er samen naar. Hoe oud is je auto?"],
    // De opgegeven tag heet "💬 Ik heb een andere vraag": de tag toont al een spraakballon, dus de emoji staat niet nog eens in de tekst.
    ["Ik heb een andere vraag", "Natuurlijk! Waar kan ik je mee helpen?"],
  ],
};
if (KEUZEHULP_OPENING !== OPGEGEVEN.opening) mislukt("de openingstekst wijkt af");
if (KEUZEHULP_TAGS.length !== 4) mislukt(`er zijn ${KEUZEHULP_TAGS.length} tags in plaats van 4`);
OPGEGEVEN.tags.forEach(([label, antwoord], i) => {
  const tag = KEUZEHULP_TAGS[i];
  if (!tag || tag.label !== label) mislukt(`tag ${i + 1}: label "${tag?.label}" i.p.v. "${label}"`);
  if (!tag || tag.antwoord !== antwoord) mislukt(`tag ${i + 1}: het vaste antwoord wijkt af`);
});
if (fouten === 0) goed("opening, vier tags en vier antwoorden komen overeen");

// 2. Feiten tegen de kennisbank --------------------------------------------------------------------------------------------
console.log("\n== 2. Feiten tegen de kennisbank");
const bewijsTekst = (id: string) => {
  const item = KENNISBANK.find((k) => k.id === id);
  if (!item) return null;
  const v = item.verrijking;
  return [item.tekst, v?.uitleg, ...(v?.direct ?? []), ...(v?.aandachtspunten ?? [])].filter(Boolean).join(" ");
};
const CLAIMS: { tag: number; bewering: string; blok: string; bewijs: RegExp }[] = [
  { tag: 1, bewering: "met WA verzeker je schade die je met je auto bij anderen veroorzaakt", blok: "sw-wa-wat-is", bewijs: /schade aan anderen die je met je auto veroorzaakt/i },
  { tag: 1, bewering: "diefstal en ruitschade zijn met WA niet verzekerd (daarom de vraag)", blok: "sw-wa-verzekerd", bewijs: /Niet verzekerd zijn:.*ruitschade, diefstal/i },
  { tag: 2, bewering: "de keuzes heten WA + Casco beperkt en WA + Casco allrisk", blok: "sw-dekking-aanpassen", bewijs: /WA, WA \+ Casco beperkt of WA \+ Casco allrisk/ },
  { tag: 2, bewering: "welke dekking past hangt af van de auto (leeftijd)", blok: "sw-adviseur", bewijs: /auto van 6 tot 10 jaar/i },
  { tag: 2, bewering: "... en van welke schades je zelf wilt betalen", blok: "sw-cb-verzekerd", bewijs: /schade door ruitbreuk, diefstal en brand niet zelf willen betalen/i },
];
for (const c of CLAIMS) {
  const tekst = bewijsTekst(c.blok);
  if (tekst === null) mislukt(`Tag ${c.tag}: blok ${c.blok} bestaat niet (${c.bewering})`);
  else if (!c.bewijs.test(tekst)) mislukt(`Tag ${c.tag}: "${c.bewering}" staat niet in ${c.blok}`);
}
if (fouten === 0) goed(`${CLAIMS.length} beweringen gevonden in de kennisbank`);

// "WA is vaak de voordeligste keuze" staat niet in de kennisbank (die noemt geen premies) maar wel in de prijzen op de kaarten van de pagina.
const pagina = readFileSync("app/workshop/page.tsx", "utf8");
const kaartPrijs = (titel: string) => {
  const m = pagina.match(new RegExp(`title: "${titel.replace(/[+]/g, "\\+")}",\\s*price: "([\\d,]+)"`));
  return m ? Number(m[1].replace(",", ".")) : NaN;
};
const prijzen = { wa: kaartPrijs("WA"), beperkt: kaartPrijs("WA + Casco beperkt"), allrisk: kaartPrijs("WA + Casco allrisk") };
if (Object.values(prijzen).some(Number.isNaN)) mislukt(`prijzen op de kaarten niet gevonden: ${JSON.stringify(prijzen)}`);
else if (!(prijzen.wa < prijzen.beperkt && prijzen.wa < prijzen.allrisk)) mislukt(`WA is niet de voordeligste kaart: ${JSON.stringify(prijzen)}`);
else goed(`"WA vaak de voordeligste": WA € ${prijzen.wa} is goedkoper dan WA + Casco beperkt € ${prijzen.beperkt} en allrisk € ${prijzen.allrisk} (prijzen op de kaarten, niet in de kennisbank)`);

// 3. Regels voor de antwoorden -----------------------------------------------------------------------------------------------
console.log("\n== 3. De vaste antwoorden volgen de regels");
const woorden = (t: string) => t.split(/\s+/).filter(Boolean);
const zinnen = (t: string) => t.replace(/a\.s\.r\./gi, "asr").split(/(?<=[.!?])\s+/).filter((z) => /\w/.test(z));
for (const tag of KEUZEHULP_TAGS) {
  const a = tag.antwoord;
  if (zinnen(a).length > 4) mislukt(`"${tag.label}": meer dan 4 zinnen`);
  if (zinnen(a).some((z) => woorden(z).length > 25)) mislukt(`"${tag.label}": een zin van meer dan 25 woorden`);
  if ((a.match(/\?/g) ?? []).length > 1) mislukt(`"${tag.label}": meer dan één vraag`);
  if (/\b(u|uw)\b/.test(a) || /\b(dient|conform|overeenkomstig|ingevolge|bepalingen|artikel \d)/i.test(a)) mislukt(`"${tag.label}": formele of juridische taal`);
}
if (fouten === 0) goed("2 tot 4 zinnen, hooguit één vraag, je/jij, geen juridische taal");

// 4. Zoeken in het vervolggesprek (dezelfde functie als app/api/chat) -----------------------------------------------------
console.log("\n== 4. Het vervolggesprek vindt de juiste kennisbankonderdelen");
const VERVOLG: { naam: string; klant: string[]; verwacht: string[] }[] = [
  { naam: "lage premie, daarna 'Ja' (diefstal en ruitschade belangrijk)", klant: ["Vooral een lage premie", "Ja, dat vind ik belangrijk"], verwacht: ["sw-vergelijken", "sw-wa-verzekerd", "sw-cb-verzekerd"] },
  { naam: "lage premie, daarna 'Nee'", klant: ["Vooral een lage premie", "Nee, dat hoeft niet"], verwacht: ["sw-wa-verzekerd", "sw-wa-wat-is", "sw-vergelijken", "sw-premie"] },
  { naam: "eigen auto verzekeren, daarna '5 jaar'", klant: ["Ook mijn eigen auto verzekeren", "5 jaar"], verwacht: ["sw-adviseur", "sw-vergelijken", "sw-ca-verzekerd"] },
  { naam: "eigen auto verzekeren, daarna 'Acht jaar oud'", klant: ["Ook mijn eigen auto verzekeren", "Acht jaar oud"], verwacht: ["sw-adviseur", "sw-vergelijken", "sw-cb-verzekerd"] },
  { naam: "dat weet ik nog niet, daarna '12 jaar'", klant: ["Dat weet ik nog niet", "12 jaar"], verwacht: ["sw-adviseur", "sw-vergelijken", "sw-wa-verzekerd"] },
  { naam: "dat weet ik nog niet, '3 jaar', daarna 'Wat is het verschil?'", klant: ["Dat weet ik nog niet", "3 jaar", "Wat is het verschil?"], verwacht: ["sw-vergelijken", "sw-adviseur"] },
  // Een korte eigen vraag na een tag mag niet worden overstemd door de zoektermen van die tag (gevonden bij de analyse van de live chat).
  { naam: "eigen auto, daarna een eigen korte vraag over eigen risico", klant: ["Ook mijn eigen auto verzekeren", "Wat betekent eigen risico eigenlijk?"], verwacht: ["eigen-risico", "cb-eigen-risico", "sw-eigen-risico"] },
  { naam: "dat weet ik nog niet, daarna een eigen korte vraag over eigen risico", klant: ["Dat weet ik nog niet", "Wat is eigen risico?"], verwacht: ["eigen-risico", "cb-eigen-risico", "sw-eigen-risico"] },
  { naam: "lage premie, daarna 'Wat kost dat dan ongeveer per maand?'", klant: ["Vooral een lage premie", "Wat kost dat dan ongeveer per maand?"], verwacht: ["sw-premie"] },
  { naam: "lage premie, ruit, daarna de prijs", klant: ["Vooral een lage premie", "Ja, ruitschade wil ik wel verzekerd hebben, maar diefstal vind ik minder belangrijk", "Wat kost dat dan ongeveer per maand?"], verwacht: ["sw-premie"] },
  { naam: "eigen auto, 4 jaar, daarna 'Is allrisk dan niet veel te duur?'", klant: ["Ook mijn eigen auto verzekeren", "Mijn auto is 4 jaar oud", "Is allrisk dan niet veel te duur?"], verwacht: ["ca-voor-en-nadelen", "ca-dekking-overzicht", "sw-ca-verzekerd", "sw-premie"] },
];
for (const v of VERVOLG) {
  const ids = keuzehulpContext(v.klant, {}, 3).map((c) => c.id);
  if (!ids.some((id) => v.verwacht.includes(id))) mislukt(`${v.naam}: gevonden ${ids.join(", ") || "(niets)"}, verwacht een van ${v.verwacht.join(", ")}`);
}
// Een eigen vraag zonder tag zoekt zoals voorheen.
if (keuzehulpContext(["Wat dekt WA?"], {}, 3).map((c) => c.id).join() !== zoekContext("Wat dekt WA?", {}, 3).map((c) => c.id).join()) mislukt("een eigen vraag zonder tag wordt anders doorzocht dan voorheen");
if (zoektermenVanGesprek(["Wat dekt WA?"]) !== "") mislukt("zoektermen zonder tag zouden leeg moeten zijn");
if (fouten === 0) goed(`${VERVOLG.length} vervolggesprekken vinden een passend onderdeel; een eigen vraag zoekt zoals voorheen`);

// 5. Systeeminstructie ---------------------------------------------------------------------------------------------------------
console.log("\n== 5. Systeeminstructie");
const gewoon = systeemInstructie("wa-casco-beperkt");
const hulp = systeemInstructie("wa-casco-beperkt", true);
const hulpZonder = systeemInstructie(undefined, true);
if (/Keuzehulp\n/.test(gewoon)) mislukt("de keuzehulpregels staan ook in de gewone instructie");
if (!/Keuzehulp\n/.test(hulp)) mislukt("de keuzehulpregels ontbreken in de keuzehulp");
if (!hulp.includes("Op de pagina staat nu WA + Casco beperkt geselecteerd, maar de klant heeft nog niet gekozen")) mislukt("de geselecteerde dekking staat niet als context in de instructie");
if (!hulpZonder.includes("Op de pagina is nog geen dekking geselecteerd")) mislukt("zonder geselecteerde dekking staat dat niet in de instructie");
if (!/Ga er niet van uit dat de geselecteerde dekking de beste keuze is/.test(hulp)) mislukt("de regel dat de geselecteerde dekking niet de beste keuze hoeft te zijn ontbreekt");
if (!/stel de openingsvraag niet opnieuw/.test(hulp)) mislukt("de regel om de openingsvraag niet te herhalen ontbreekt");
if (/De klant bekijkt nu de dekking/.test(hulp)) mislukt("de keuzehulp zegt nog 'bekijkt nu de dekking' (de klant kiest nog)");
// Regels uit de analyse van de live chat: natuurlijker taal, prijs naar de kaarten, simpeler uitleggen.
if (gewoon.includes("'Dat kan ik hier niet zien.'")) mislukt("de instructie laat de chat nog 'Dat kan ik hier niet zien' zeggen");
if (!gewoon.includes("Dat staat niet in mijn informatie")) mislukt("de natuurlijker formulering voor 'dat weet ik niet' ontbreekt");
if (!gewoon.includes("Vraagt de klant om het simpeler te zeggen")) mislukt("de regel om simpeler uit te leggen ontbreekt");
if (!hulp.includes("op de kaarten op deze pagina staat") || !hulp.includes("Noem geen bedragen")) mislukt("de prijsregel (verwijs naar de kaarten, noem geen bedragen) ontbreekt in de keuzehulp");
if (gewoon.includes("op de kaarten op deze pagina staat")) mislukt("de prijsregel staat ook buiten de keuzehulp, waar er geen kaarten zijn");
if (fouten === 0) goed("keuzehulpregels alleen in de keuzehulp; geselecteerde dekking als context; geen voorkeur voor die dekking");

console.log(fouten ? `\n${fouten} controle(s) mislukt` : "\nAlle controles geslaagd");
process.exit(fouten ? 1 : 0);
