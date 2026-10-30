/**
 * Controle van de vijf voorbeeldgesprekken in de systeeminstructie. Geen taalmodel nodig:
 *   npx tsx --tsconfig tsconfig.json scripts/test-voorbeeldgesprekken.mts
 *
 * 1. Staat elke feitelijke bewering uit de voorbeelden in de kennisbank? (CLAIMS hieronder: bewering, blok, bewijs)
 * 2. Voldoen de antwoorden in de voorbeelden zelf aan de regels (lengte, zinnen, vragen, taal, afwisselende openingen)?
 * 3. Is de instructie vrij van regels die elkaar tegenspreken, en staan de voorbeelden in de systeeminstructie en niet tussen de berichten?
 * 4. Hoeveel tokens kosten de voorbeelden?
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { KENNISBANK } from "../lib/kennisbank/index";
import { VOORBEELDGESPREKKEN } from "../lib/chat/voorbeeldgesprekken";
import { GEEN_BRON, STIJLHERINNERING, systeemInstructie } from "../lib/chat/systeem-instructie";

let fouten = 0;
const mislukt = (tekst: string) => {
  fouten++;
  console.log(`✗ ${tekst}`);
};
const goed = (tekst: string) => console.log(`✓ ${tekst}`);

// 1. Feiten ---------------------------------------------------------------------------------------------------------------
type Claim = { voorbeeld: number; bewering: string; blok: string; bewijs: RegExp };
const CLAIMS: Claim[] = [
  { voorbeeld: 1, bewering: "WA vergoedt schade die je met je auto aan anderen veroorzaakt", blok: "sw-wa-wat-is", bewijs: /schade aan anderen die je met je auto veroorzaakt/i },
  { voorbeeld: 1, bewering: "schade aan je eigen auto is niet verzekerd (WA)", blok: "sw-wa-wat-is", bewijs: /Schade aan je eigen auto is niet verzekerd/i },
  { voorbeeld: 2, bewering: "bij Casco allrisk is schade aan je eigen auto verzekerd, ook als je die zelf veroorzaakt", blok: "sw-ca-eigen-schuld", bewijs: /schade aan je eigen auto die je zelf hebt veroorzaakt verzekerd/i },
  { voorbeeld: 2, bewering: "een paaltje raken valt daaronder", blok: "sw-ca-eigen-schuld", bewijs: /paaltje/i },
  { voorbeeld: 2, bewering: "het eigen risico gaat af van de vergoeding", blok: "ca-eigen-risico", bewijs: /trekken we af van de schadevergoeding/i },
  { voorbeeld: 2, bewering: "het eigen risico staat op het polisblad", blok: "ca-eigen-risico", bewijs: /polisblad/i },
  { voorbeeld: 2, bewering: "a.s.r. stelt vast hoeveel schade er is", blok: "cb-schade-vaststellen", bewijs: /stellen vast hoeveel schade/i },
  { voorbeeld: 3, bewering: "aangifte nog dezelfde dag, of de volgende ochtend als het 's nachts gebeurde", blok: "cb-aangifte", bewijs: /nog dezelfde dag aangifte doen, of de volgende ochtend als het 's avonds of 's nachts/i },
  { voorbeeld: 3, bewering: "de diefstal zo snel mogelijk bij a.s.r. melden", blok: "cb-diefstal", bewijs: /zo snel mogelijk bij a\.s\.r\./i },
  { voorbeeld: 3, bewering: "VbV 071 - 3641777, dag en nacht bereikbaar", blok: "cb-aangifte", bewijs: /071 - 3641777 \(dag en nacht bereikbaar\)|071 - 3641777, dag en nacht|071 - 3641777 \(dag en nacht/i },
  { voorbeeld: 3, bewering: "diefstal is verzekerd met Casco beperkt", blok: "cb-diefstal", bewijs: /WA \+ Casco beperkt of allrisk ben je verzekerd bij \(poging tot\) diefstal/i },
  { voorbeeld: 3, bewering: "geen vergoeding als de auto niet afgesloten was of de sleutels erin zaten", blok: "cb-diefstal", bewijs: /niet was afgesloten, de sleutels erin of erop zaten/i },
  { voorbeeld: 4, bewering: "eigen risico is het bedrag dat a.s.r. van een schadevergoeding afhaalt", blok: "cb-eigen-risico", bewijs: /bedrag dat a\.s\.r\. van een schadevergoeding afhaalt/i },
  { voorbeeld: 4, bewering: "het eigen risico staat op het polisblad", blok: "cb-eigen-risico", bewijs: /staat met het bedrag op je polisblad/i },
  { voorbeeld: 4, bewering: "€ 250 is een mogelijke keuze voor het eigen risico", blok: "sw-eigen-risico", bewijs: /€ 0, € 150, € 250 of € 500/ },
  { voorbeeld: 4, bewering: "geen eigen risico bij het repareren van een ruit", blok: "cb-eigen-risico", bewijs: /geen eigen risico bij .*het repareren van een ruit/i },
  { voorbeeld: 5, bewering: "de keuze is WA, WA + Casco beperkt of WA + Casco allrisk", blok: "sw-dekking-aanpassen", bewijs: /WA, WA \+ Casco beperkt of WA \+ Casco allrisk/ },
  { voorbeeld: 5, bewering: "WA + Casco beperkt: brand, storm en natuur, ruitschade en diefstal verzekerd", blok: "sw-cb-verzekerd", bewijs: /brand, storm en natuur, ruitschade, diefstal/i },
  { voorbeeld: 5, bewering: "schade aan je eigen auto door een aanrijding is niet verzekerd (Casco beperkt)", blok: "sw-cb-verzekerd", bewijs: /Niet verzekerd is schade aan je eigen auto door (een )?aanrijding of vandalisme/i },
  { voorbeeld: 5, bewering: "bij een auto van 6 tot 10 jaar kiezen de meeste klanten WA + Casco beperkt", blok: "sw-adviseur", bewijs: /WA \+ Casco beperkt bij 6 tot 10 jaar/i },
  { voorbeeld: 5, bewering: "a.s.r. geeft geen persoonlijk advies", blok: "sw-adviseur", bewijs: /geen persoonlijk advies/i },
  { voorbeeld: 5, bewering: "een onafhankelijk adviseur denkt met je mee", blok: "sw-adviseur", bewijs: /onafhankelijk adviseur/i },
];
const bewijsTekst = (id: string) => {
  const item = KENNISBANK.find((k) => k.id === id);
  if (!item) return null;
  const v = item.verrijking;
  return [item.tekst, v?.uitleg, ...(v?.direct ?? []), ...(v?.aandachtspunten ?? [])].filter(Boolean).join(" ");
};
console.log("== 1. Feiten uit de voorbeelden tegen de kennisbank");
for (const c of CLAIMS) {
  const tekst = bewijsTekst(c.blok);
  if (tekst === null) mislukt(`Voorbeeld ${c.voorbeeld}: blok ${c.blok} bestaat niet (${c.bewering})`);
  else if (!c.bewijs.test(tekst)) mislukt(`Voorbeeld ${c.voorbeeld}: "${c.bewering}" staat niet in ${c.blok}`);
}
if (fouten === 0) goed(`${CLAIMS.length} beweringen gevonden in de kennisbank`);

// Elk getal in de voorbeelden staat in de kennisbank, of is een bedrag in een als voorbeeld gemarkeerd rekenvoorbeeld.
const KB_ALLES = KENNISBANK.map((k) => bewijsTekst(k.id) ?? "").join(" ").replace(/[.,]/g, "");
const REKENVOORBEELD = new Set(["800", "550"]);
for (const [i, v] of VOORBEELDGESPREKKEN.entries()) {
  for (const b of v.beurten) {
    for (const getal of b.jij.replace(/071 - 3641777/g, "").match(/\d[\d.]*/g) ?? []) {
      const schoon = getal.replace(/[.,]/g, "");
      if (REKENVOORBEELD.has(schoon)) {
        if (!/Stel dat/.test(b.jij) || !/voorbeeld/i.test(b.jij)) mislukt(`Voorbeeld ${i + 1}: het rekenvoorbeeld "${getal}" staat niet als voorbeeld aangeduid`);
      } else if (!KB_ALLES.includes(schoon)) mislukt(`Voorbeeld ${i + 1}: getal "${getal}" staat nergens in de kennisbank`);
    }
  }
}

// 2. Regels voor de antwoorden zelf ----------------------------------------------------------------------------------------
console.log("\n== 2. De antwoorden in de voorbeelden volgen de regels");
const woorden = (t: string) => t.split(/\s+/).filter(Boolean);
const zinnen = (t: string) => t.replace(/a\.s\.r\./gi, "asr").split(/(?<=[.!?])\s+/).filter((z) => /\w/.test(z));
const openingen: string[] = [];
let eindigtMetVraag = 0;
let antwoorden = 0;
for (const [i, v] of VOORBEELDGESPREKKEN.entries()) {
  for (const [j, b] of v.beurten.entries()) {
    const label = `Voorbeeld ${i + 1}, beurt ${j + 1}`;
    const n = woorden(b.jij).length;
    antwoorden++;
    openingen.push(woorden(b.jij).slice(0, 2).join(" ").toLowerCase());
    if (b.jij.trim().endsWith("?")) eindigtMetVraag++;
    if (n > 70) mislukt(`${label}: ${n} woorden`);
    if (zinnen(b.jij).length > 4) mislukt(`${label}: meer dan 4 zinnen`);
    if (zinnen(b.jij).some((z) => woorden(z).length > 20)) mislukt(`${label}: een zin van meer dan 20 woorden`);
    if ((b.jij.match(/\?/g) ?? []).length > 1) mislukt(`${label}: meer dan één vraag`);
    if (/\b(dient|conform|overeenkomstig|ingevolge|bepalingen|artikel \d)/i.test(b.jij)) mislukt(`${label}: juridische taal`);
    if (/\b(u|uw)\b/.test(b.jij)) mislukt(`${label}: u in plaats van je`);
    if (/^(goede vraag|ik help je graag|dat hangt af van verschillende factoren)/i.test(b.jij)) mislukt(`${label}: verboden opener`);
    if (/[*#|]|\[\[/.test(b.jij)) mislukt(`${label}: opmaak of marker in de tekst`);
    if (/\?\s+Dan\b/.test(b.jij)) mislukt(`${label}: retorische vraag ("? Dan ...")`);
    if (b.geenBron && !b.jij.includes("?")) mislukt(`${label}: geenBron zonder vraag aan de klant`);
  }
}
if (new Set(openingen).size !== openingen.length) mislukt(`Openingen komen dubbel voor: ${openingen.join(" | ")}`);
else goed(`${antwoorden} antwoorden, alle openingen verschillend`);
// Niet elk antwoord eindigt met een vraag: de voorbeelden mogen het patroon niet aanleren.
if (eindigtMetVraag / antwoorden > 0.5) mislukt(`${eindigtMetVraag} van ${antwoorden} voorbeeldantwoorden eindigen met een vraag (maximaal de helft)`);
else goed(`${eindigtMetVraag} van ${antwoorden} voorbeeldantwoorden eindigen met een vraag`);

// 3. Tegenstrijdigheden en plaats van de voorbeelden ---------------------------------------------------------------------------
console.log("\n== 3. Systeeminstructie");
const prompt = systeemInstructie("wa-casco-beperkt");
const VERBODEN: [RegExp, string][] = [
  [/Wil je ook weten hoe/, "nodigt uit tot een vraag aan het eind van elk antwoord"],
  [/stel daarna die ene vraag/, "dwingt een vraag na elk antwoord af"],
  [/Voorbeelden van de stijl/, "het oude voorbeeldenblok (drie van de vier antwoorden eindigden met een vraag)"],
  [/Klant: '/, "een voorbeeld in de oude notatie"],
];
for (const [patroon, reden] of VERBODEN) if (patroon.test(prompt)) mislukt(`De instructie bevat "${patroon.source}": ${reden}`);
if ((prompt.match(/<voorbeeldgesprekken>/g) ?? []).length !== 1) mislukt("De voorbeelden staan niet precies één keer in de instructie");
if (!prompt.includes("<klantbericht>") || !/geen echte klanten en geen eerdere berichten/.test(prompt)) mislukt("De scheiding tussen voorbeelden en het echte klantbericht ontbreekt");
if (prompt.indexOf("De klant bekijkt nu de dekking WA + Casco beperkt") > prompt.indexOf("<voorbeeldgesprekken>")) mislukt("De regel met de gekozen dekking staat na de voorbeelden");
if (!prompt.includes(GEEN_BRON)) mislukt("De geen-bron-marker staat niet in de voorbeelden");
if (!STIJLHERINNERING.includes("sluit niet standaard af met een vraag")) mislukt("De stijlherinnering noemt niet dat de chat niet standaard met een vraag afsluit");
const route = readFileSync("app/api/chat/route.ts", "utf8");
if (/voorbeeld/i.test(route.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, ""))) mislukt("route.ts verwijst naar voorbeelden; ze horen alleen in de systeeminstructie");
else goed("de voorbeelden staan alleen in de systeeminstructie, niet tussen de berichten");
if (fouten === 0) goed("geen tegenstrijdige instructies gevonden");

// 4. Tokens ----------------------------------------------------------------------------------------------------------------
console.log("\n== 4. Omvang");
const oud = execSync("git show main:lib/chat/systeem-instructie.ts", { encoding: "utf8" });
writeFileSync("scripts/.oud-systeem-instructie.mts", oud);
const { systeemInstructie: oudeInstructie } = (await import("./.oud-systeem-instructie.mts")) as { systeemInstructie: (d?: string) => string };
rmSync("scripts/.oud-systeem-instructie.mts");
const schat = (t: string) => Math.round(t.length / 3.3); // Nederlands: ongeveer 3,3 tekens per token (schatting)
const oudeTekst = oudeInstructie("wa-casco-beperkt");
console.log(`oude instructie:  ${oudeTekst.length} tekens, ca. ${schat(oudeTekst)} tokens`);
console.log(`nieuwe instructie: ${prompt.length} tekens, ca. ${schat(prompt)} tokens (${prompt.length >= oudeTekst.length ? "+" : ""}${schat(prompt) - schat(oudeTekst)} per vraag, +${Math.round(((prompt.length - oudeTekst.length) / oudeTekst.length) * 100)}%)`);
const blok = prompt.slice(prompt.indexOf("<voorbeeldgesprekken>"));
console.log(`waarvan de vijf voorbeelden: ${blok.length} tekens, ca. ${schat(blok)} tokens`);

console.log(fouten ? `\n${fouten} controle(s) mislukt` : "\nAlle controles geslaagd");
process.exit(fouten ? 1 : 0);
