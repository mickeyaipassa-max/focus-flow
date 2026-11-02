/**
 * Controle van de voorwaarden als pdf in de chat, zonder taalmodel:
 *   npx tsx --tsconfig tsconfig.json scripts/test-voorwaarden.mts
 *
 * 1. Welke berichten zijn een vraag om het document, en welke een vraag over de inhoud (die gaat naar het taalmodel)?
 * 2. Welke dekkingen herkent de chat in een bericht; "WA + Casco" zonder "beperkt" of "allrisk" is niet concreet.
 * 3. Vraagt de chat eerst voor welke dekking als die niet genoemd is, en geeft hij daarna de juiste pdf's?
 * 4. Bestaan alle pdf's, en zijn het de documenten uit de kennisbank (titel en documentcode)?
 */
import { existsSync, readFileSync } from "node:fs";
import { dekkingenInTekst, vraagtOmVoorwaarden, voorwaardenAntwoord, VOORWAARDEN_VRAAG } from "../lib/chat/voorwaarden";

let fouten = 0;
const mislukt = (t: string) => {
  fouten++;
  console.log(`✗ ${t}`);
};
const goed = (t: string) => console.log(`✓ ${t}`);
const gelijk = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

console.log("== 1. Vraag om het document of vraag over de inhoud");
const document = [
  "Mag ik de voorwaarden hebben?",
  "Kan ik de voorwaarden downloaden?",
  "Stuur me de voorwaarden",
  "Waar vind ik de voorwaarden?",
  "Ik wil de polisvoorwaarden lezen",
  "Heb je de voorwaarden als pdf?",
  "voorwaarden",
  "De voorwaarden van WA",
  "Algemene voorwaarden",
  "Kan ik de volledige voorwaarden inzien?",
];
const inhoud = [
  "Wat zijn de voorwaarden voor diefstal?",
  "Welke voorwaarden gelden bij ruitschade?",
  "Wat staat er in de voorwaarden over eigen risico?",
  "Hoe zit het met de voorwaarden bij schade in het buitenland?",
  "Wat is eigen risico?",
  "Wat is het verschil tussen WA en allrisk?",
];
for (const tekst of document) vraagtOmVoorwaarden(tekst) ? goed(`document: "${tekst}"`) : mislukt(`"${tekst}" is een vraag om het document, maar wordt niet herkend`);
for (const tekst of inhoud) !vraagtOmVoorwaarden(tekst) ? goed(`inhoud: "${tekst}"`) : mislukt(`"${tekst}" is een vraag over de inhoud, maar wordt als vraag om het document gezien`);

console.log("\n== 2. Dekking herkennen");
const dekkingen: [string, string[]][] = [
  ["WA", ["wa"]],
  ["wa", ["wa"]],
  ["WA + Casco beperkt", ["wa-casco-beperkt"]],
  ["WA + Casco allrisk", ["wa-casco-allrisk"]],
  ["All-Risk", ["wa-casco-allrisk"]],
  ["Allrisk", ["wa-casco-allrisk"]],
  ["beperkt casco", ["wa-casco-beperkt"]],
  ["WA+", ["wa-casco-beperkt"]],
  ["Algemene voorwaarden", ["algemeen"]],
  ["De voorwaarden van WA + Casco beperkt", ["wa-casco-beperkt"]],
  ["WA + Casco", []],
  ["casco", []],
  ["de voorwaarden", []],
  ["weet ik niet", []],
];
for (const [tekst, verwacht] of dekkingen) {
  const gevonden = dekkingenInTekst(tekst);
  gelijk(gevonden, verwacht) ? goed(`"${tekst}" -> ${verwacht.join(", ") || "geen"}`) : mislukt(`"${tekst}": verwacht ${JSON.stringify(verwacht)}, kreeg ${JSON.stringify(gevonden)}`);
}

console.log("\n== 3. Gesprekken");
type B = { role: "user" | "assistant"; text: string };
const klant = (text: string): B => ({ role: "user", text });
const chat = (text: string): B => ({ role: "assistant", text });
const urls = (a: ReturnType<typeof voorwaardenAntwoord>) => (a?.acties ?? []).map((actie) => actie.url);

// 3a. Geen dekking genoemd: eerst vragen, met een tag per dekking (geen url, dus een keuze).
const vraag = voorwaardenAntwoord([klant("Mag ik de voorwaarden hebben?")]);
if (vraag?.tekst === VOORWAARDEN_VRAAG && gelijk(vraag.acties.map((a) => a.label), ["WA", "WA + Casco beperkt", "WA + Casco allrisk", "Algemene voorwaarden"]) && vraag.acties.every((a) => !a.url))
  goed("geen dekking genoemd: vraagt eerst voor welke dekking, met vier keuzetags");
else mislukt(`vraag voor dekking ontbreekt of klopt niet: ${JSON.stringify(vraag)}`);

// 3b. De klant kiest een tag of typt de dekking; dan komen de pdf's.
const verwachtPerKeuze: [string, string[]][] = [
  ["WA", ["/voorwaarden/voorwaarden-wa.pdf", "/voorwaarden/algemene-voorwaarden.pdf"]],
  ["WA + Casco beperkt", ["/voorwaarden/voorwaarden-casco-beperkt.pdf", "/voorwaarden/voorwaarden-wa.pdf", "/voorwaarden/algemene-voorwaarden.pdf"]],
  ["WA + Casco allrisk", ["/voorwaarden/voorwaarden-casco-allrisk.pdf", "/voorwaarden/voorwaarden-wa.pdf", "/voorwaarden/algemene-voorwaarden.pdf"]],
  ["Algemene voorwaarden", ["/voorwaarden/algemene-voorwaarden.pdf"]],
  ["allrisk graag", ["/voorwaarden/voorwaarden-casco-allrisk.pdf", "/voorwaarden/voorwaarden-wa.pdf", "/voorwaarden/algemene-voorwaarden.pdf"]],
];
for (const [keuze, verwacht] of verwachtPerKeuze) {
  const antwoord = voorwaardenAntwoord([klant("Mag ik de voorwaarden hebben?"), chat(VOORWAARDEN_VRAAG), klant(keuze)]);
  gelijk(urls(antwoord), verwacht) ? goed(`na "${keuze}": ${verwacht.length} pdf('s)`) : mislukt(`na "${keuze}": verwacht ${JSON.stringify(verwacht)}, kreeg ${JSON.stringify(urls(antwoord))}`);
}

// 3c. De dekking staat al in het verzoek: meteen de pdf's, geen vraag.
const meteen = voorwaardenAntwoord([klant("Kan ik de voorwaarden van WA + Casco allrisk downloaden?")]);
gelijk(urls(meteen), ["/voorwaarden/voorwaarden-casco-allrisk.pdf", "/voorwaarden/voorwaarden-wa.pdf", "/voorwaarden/algemene-voorwaarden.pdf"])
  ? goed("dekking in het verzoek: meteen de pdf's")
  : mislukt(`dekking in het verzoek: kreeg ${JSON.stringify(urls(meteen))}`);

// 3d. "Alle voorwaarden": alle vier.
const alle = voorwaardenAntwoord([klant("Stuur me alle voorwaarden")]);
urls(alle).length === 4 ? goed("alle voorwaarden: vier pdf's") : mislukt(`alle voorwaarden: kreeg ${urls(alle).length} pdf('s)`);

// 3e. Een vraag over de inhoud of een gewone vraag gaat naar het taalmodel (null).
for (const tekst of ["Wat zijn de voorwaarden voor diefstal?", "Wat is eigen risico?", "WA"]) {
  const antwoord = voorwaardenAntwoord([klant(tekst)]);
  antwoord === null ? goed(`naar het taalmodel: "${tekst}"`) : mislukt(`"${tekst}" had naar het taalmodel gemoeten, maar kreeg ${JSON.stringify(antwoord)}`);
}

// 3f. Een tag als antwoord telt alleen na onze vraag; "WA" ergens anders in het gesprek is gewoon een bericht.
const zonderVraag = voorwaardenAntwoord([klant("Hallo"), chat("Waar kan ik je mee helpen?"), klant("WA")]);
zonderVraag === null ? goed('"WA" zonder voorafgaande vraag naar de voorwaarden gaat naar het taalmodel') : mislukt('"WA" zonder voorafgaande vraag had niet als keuze gezien mogen worden');

// 3g. Wat de chat zegt: geen "niet beschikbaar", en de Algemene voorwaarden worden genoemd.
const wa = voorwaardenAntwoord([klant("Voorwaarden van WA")]);
if (wa && /Algemene voorwaarden gelden bij elke dekking/.test(wa.tekst) && !/niet/i.test(wa.tekst)) goed("antwoordtekst noemt de Algemene voorwaarden en zegt nergens dat iets niet beschikbaar is");
else mislukt(`antwoordtekst klopt niet: ${wa?.tekst}`);

console.log("\n== 4. De pdf's");
const titels: [string, RegExp][] = [
  ["public/voorwaarden/voorwaarden-wa.pdf", /Wettelijke Aansprakelijkheid/],
  ["public/voorwaarden/voorwaarden-casco-beperkt.pdf", /Casco Beperkt/],
  ["public/voorwaarden/voorwaarden-casco-allrisk.pdf", /Casco Allrisk/],
  ["public/voorwaarden/algemene-voorwaarden.pdf", /Algemene Voorwaarden/],
];
for (const [pad] of titels) {
  if (!existsSync(pad)) mislukt(`${pad} ontbreekt`);
  else if (readFileSync(pad).subarray(0, 5).toString() !== "%PDF-") mislukt(`${pad} is geen pdf`);
  else goed(`${pad} bestaat en is een pdf (${Math.round(readFileSync(pad).length / 1024)} kB)`);
}
const kennisbank = readFileSync("lib/kennisbank/types.ts", "utf8");
for (const code of ["D AU-WA 2017-01", "D AU-CB 2017-01", "D AU-CA 2017-01", "D 2013-01"]) {
  kennisbank.includes(code) ? goed(`kennisbank gebruikt ${code}`) : mislukt(`kennisbank noemt ${code} niet`);
}

console.log(fouten ? `\n${fouten} controle(s) mislukt` : "\nAlle controles geslaagd");
process.exit(fouten ? 1 : 0);
