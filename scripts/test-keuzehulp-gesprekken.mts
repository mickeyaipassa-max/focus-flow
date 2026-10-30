/**
 * Gesprekken met de keuzehulp op /workshop, met het echte taalmodel:
 *
 *   BASE_URL=https://<deploy-preview>.netlify.app npx tsx --tsconfig tsconfig.json scripts/test-keuzehulp-gesprekken.mts
 *
 * Elk gesprek begint zoals in de pagina: de klant kiest een tag, de chat geeft het vaste antwoord (zonder taalmodel), en pas daarna gaat
 * het gesprek naar /api/chat met `keuzehulp: true` en de geselecteerde dekking. Het rapport staat op het scherm en in
 * docs/keuzehulp-gesprekken.md. De route laat per IP 20 vragen per 10 minuten toe; bij een 429 wacht dit script.
 */
import { writeFileSync } from "node:fs";
import { KEUZEHULP_OPENING, keuzehulpTag } from "../lib/chat/keuzehulp";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

type Dekking = "wa" | "wa-casco-beperkt" | "wa-casco-allrisk";
type Check = { naam: string; ok: (antwoord: string) => boolean };
type Gesprek = { naam: string; dekking: Dekking; /** Het label van de tag, of null voor een eigen vraag zonder tag. */ tag: string | null; klant: { tekst: string; checks?: Check[] }[] };

const moet = (naam: string, ...p: RegExp[]): Check => ({ naam: `noemt ${naam}`, ok: (t) => p.every((x) => x.test(t)) });
const mag_niet = (naam: string, p: RegExp): Check => ({ naam: `noemt niet ${naam}`, ok: (t) => !p.test(t) });
const GEEN_ADVIES = mag_niet("een stellige aanbeveling", /ik raad (je )?(aan|dit aan)|je moet (kiezen|nemen)|neem (dan )?(gewoon )?(WA|casco)/i);

const GESPREKKEN: Gesprek[] = [
  { naam: "Lage premie, diefstal en ruit belangrijk", dekking: "wa", tag: "Vooral een lage premie", klant: [
    { tekst: "Ja, diefstal en ruitschade vind ik wel belangrijk", checks: [moet("WA + Casco beperkt", /casco beperkt|wa ?\+|wa plus/i), GEEN_ADVIES] },
  ] },
  { naam: "Lage premie, niet belangrijk (andere dekking geselecteerd)", dekking: "wa-casco-allrisk", tag: "Vooral een lage premie", klant: [
    { tekst: "Nee, dat hoeft niet voor mij", checks: [mag_niet("dat allrisk de beste keuze is", /allrisk (is|past) (de )?beste/i), GEEN_ADVIES] },
  ] },
  { naam: "Eigen auto, 5 jaar oud", dekking: "wa-casco-beperkt", tag: "Ook mijn eigen auto verzekeren", klant: [
    { tekst: "5 jaar", checks: [moet("wat klanten meestal kiezen bij 0 tot en met 5 jaar", /allrisk/i), moet("dat a.s.r. geen persoonlijk advies geeft", /geen (persoonlijk )?advies|zelf (kiezen|beslissen)|adviseur/i), mag_niet("opnieuw de leeftijd vragen", /hoe oud is (je|jouw) auto/i)] },
  ] },
  { naam: "Eigen auto, 12 jaar oud", dekking: "wa", tag: "Ook mijn eigen auto verzekeren", klant: [
    { tekst: "12 jaar", checks: [moet("wat klanten meestal kiezen bij 10 jaar of ouder", /\bWA\b/), mag_niet("opnieuw de leeftijd vragen", /hoe oud is (je|jouw) auto/i), GEEN_ADVIES] },
  ] },
  { naam: "Weet ik nog niet, daarna wat belangrijk is", dekking: "wa-casco-beperkt", tag: "Dat weet ik nog niet", klant: [
    { tekst: "Mijn auto is 8 jaar oud", checks: [mag_niet("opnieuw de leeftijd vragen", /hoe oud is (je|jouw) auto/i)] },
    { tekst: "Ik wil vooral dat diefstal en ruitschade verzekerd zijn", checks: [moet("WA + Casco beperkt", /casco beperkt/i), moet("6 tot 10 jaar", /6 tot 10|zes tot tien/i), mag_niet("opnieuw naar diefstal en ruitschade vragen", /diefstal en ruitschade\?/i), GEEN_ADVIES] },
  ] },
  { naam: "Weet ik nog niet, vaag antwoord", dekking: "wa-casco-beperkt", tag: "Dat weet ik nog niet", klant: [
    { tekst: "Geen idee eigenlijk", checks: [mag_niet("opnieuw dezelfde vraag", /hoe oud is (je|jouw) auto\?.*hoe oud is/i)] },
  ] },
  { naam: "Andere vraag: eigen risico", dekking: "wa-casco-beperkt", tag: "Ik heb een andere vraag", klant: [
    { tekst: "Wat is eigen risico?", checks: [moet("het eigen risico", /eigen risico/i), mag_niet("de openingsvraag opnieuw", /waar kan ik je mee helpen|wat vind je belangrijk bij je autoverzekering/i)] },
  ] },
  { naam: "Andere vraag: opzeggen", dekking: "wa", tag: "Ik heb een andere vraag", klant: [
    { tekst: "Hoe zeg ik mijn verzekering op?", checks: [moet("online opzeggen of het eerste jaar", /online|eerste (verzekerings)?jaar/i)] },
  ] },
  { naam: "Eigen auto, nieuw, daarna prijs", dekking: "wa-casco-allrisk", tag: "Ook mijn eigen auto verzekeren", klant: [
    { tekst: "Hij is nog helemaal nieuw", checks: [mag_niet("opnieuw de leeftijd vragen", /hoe oud is (je|jouw) auto/i), GEEN_ADVIES] },
    { tekst: "Wat kost dat dan per maand?", checks: [mag_niet("een premiebedrag", /€\s?\d[\d.,]*\s*(per maand|p\.m\.|per jaar)|\d+\s?euro per (maand|jaar)/i)] },
  ] },
  // Gevonden bij de analyse van de live chat (ditismick.com/workshop): deze gesprekken gingen mis.
  { naam: "Eigen auto, daarna een korte eigen vraag over eigen risico", dekking: "wa-casco-beperkt", tag: "Ook mijn eigen auto verzekeren", klant: [
    { tekst: "Wat betekent eigen risico eigenlijk?", checks: [moet("wat eigen risico is", /eigen risico/i, /(afhaalt|af van|zelf (betaalt|betaal)|aftrekt)/i)] },
  ] },
  { naam: "Lage premie, ruit, daarna prijs en 'simpeler'", dekking: "wa-casco-beperkt", tag: "Vooral een lage premie", klant: [
    { tekst: "Ja, ruitschade wil ik wel verzekerd hebben, maar diefstal vind ik minder belangrijk" },
    { tekst: "Wat kost dat dan ongeveer per maand?", checks: [moet("de kaarten op de pagina", /kaart/i), mag_niet("een premiebedrag (de eigen-risicokeuzes € 0 tot € 500 mogen wel)", /€\s?(?!(?:0|150|250|500)\b)\d/)] },
    { tekst: "Ik snap het niet zo goed. Kun je het simpeler zeggen?", checks: [mag_niet("opnieuw dat hij het niet weet", /(weet|kan) ik .{0,30}niet|niet in mijn informatie|niet (te )?zien/i), mag_niet("een premiebedrag", /€\s?(?!(?:0|150|250|500)\b)\d/)] },
  ] },
  { naam: "Gestolen auto, daarna opzeggen", dekking: "wa-casco-beperkt", tag: "Ik heb een andere vraag", klant: [
    { tekst: "Mijn auto is net gestolen!", checks: [moet("aangifte", /aangifte/i)] },
    { tekst: "Moet ik mijn verzekering nu opzeggen?" },
  ] },
  { naam: "Eigen vraag zonder tag", dekking: "wa-casco-allrisk", tag: null, klant: [
    { tekst: "Wat is het verschil tussen WA+ en allrisk?", checks: [moet("aanrijding of vandalisme", /aanrijding|vandalisme|eigen schuld/i), mag_niet("de openingsvraag", /wat vind je belangrijk bij je autoverzekering/i)] },
  ] },
];

const woorden = (t: string) => t.split(/\s+/).filter(Boolean);
const zinnen = (t: string) => t.replace(/a\.s\.r\./gi, "asr").split(/(?<=[.!?])\s+/).filter((z) => /\w/.test(z));
const ALGEMEEN: Check[] = [
  { naam: "maximaal 70 woorden", ok: (t) => woorden(t).length <= 70 },
  { naam: "maximaal 4 zinnen", ok: (t) => zinnen(t).length <= 4 },
  { naam: "hooguit één vraag", ok: (t) => (t.match(/\?/g) ?? []).length <= 1 },
  { naam: "geen opmaak, marker of 'kennisbank'", ok: (t) => !/[*#|]|\[\[|kennisbank/i.test(t) },
  { naam: "je/jij, geen juridische taal", ok: (t) => !/\b(u|uw)\b/.test(t) && !/\b(dient|conform|overeenkomstig|ingevolge|bepalingen|artikel \d)/i.test(t) },
  { naam: "zegt niet 'hier niet zien'", ok: (t) => !/hier (helaas )?niet (te )?zien|zie ik hier niet/i.test(t) },
  { naam: "herhaalt de openingsvraag niet", ok: (t) => !/wat vind je belangrijk bij je autoverzekering/i.test(t) },
];

async function vraag(berichten: { role: string; text: string }[], dekking: Dekking): Promise<{ status: number; tekst?: string; bronnen?: { title: string }[]; fout?: string }> {
  for (let poging = 0; poging < 14; poging++) {
    const response = await fetch(`${BASE_URL}/api/chat`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ berichten, dekking, keuzehulp: true }) });
    let data: { tekst?: string; bronnen?: { title: string }[]; fout?: string } = {};
    try {
      data = (await response.json()) as typeof data;
    } catch {
      /* geen JSON */
    }
    if (response.status !== 429) return { status: response.status, ...data };
    console.log("  (rem op het aantal vragen; ik wacht 60 seconden)");
    await new Promise((resolve) => setTimeout(resolve, 60_000));
  }
  return { status: 429, fout: "rem" };
}

let mislukt = 0;
let aantal = 0;
let aanroepen = 0;
let totaalWoorden = 0;
let metVraagAan = 0;
const rapport: string[] = [`# Gesprekken met de keuzehulp (${new Date().toISOString().slice(0, 10)})`, "", `Getest tegen ${BASE_URL}. Opening: "${KEUZEHULP_OPENING.replace(/\n/g, " / ")}"`, ""];
for (const gesprek of GESPREKKEN) {
  console.log(`\n=== ${gesprek.naam} [geselecteerd: ${gesprek.dekking}]`);
  rapport.push(`## ${gesprek.naam}`, `Geselecteerde dekking op de pagina: ${gesprek.dekking}`, "");
  const berichten: { role: "user" | "assistant"; text: string }[] = [];
  const tag = gesprek.tag ? keuzehulpTag(gesprek.tag) : undefined;
  if (tag) {
    berichten.push({ role: "user", text: tag.label }, { role: "assistant", text: tag.antwoord });
    console.log(`Klant (tag): ${tag.label}\nChat (vast, geen taalmodel): ${tag.antwoord}`);
    rapport.push(`**Klant (tag):** ${tag.label}`, "", `**Chat (vast antwoord, geen taalmodel):** ${tag.antwoord}`, "");
  }
  for (const beurt of gesprek.klant) {
    berichten.push({ role: "user", text: beurt.tekst });
    const data = await vraag(berichten, gesprek.dekking);
    aanroepen++;
    console.log(`Klant: ${beurt.tekst}`);
    rapport.push(`**Klant:** ${beurt.tekst}`, "");
    if (data.status !== 200 || !data.tekst) {
      console.log(`  FOUT ${data.status} ${data.fout ?? ""}`);
      rapport.push(`**FOUT ${data.status} ${data.fout ?? ""}**`, "");
      mislukt++;
      break;
    }
    const fouten = [...ALGEMEEN, ...(beurt.checks ?? [])].filter((c) => !c.ok(data.tekst!)).map((c) => c.naam);
    aantal++;
    totaalWoorden += woorden(data.tekst).length;
    if (data.tekst.includes("?")) metVraagAan++;
    mislukt += fouten.length;
    console.log(`Chat (${woorden(data.tekst).length} woorden): ${data.tekst.replace(/\n/g, " / ")}`);
    console.log(`  bron: ${(data.bronnen ?? []).map((b) => b.title).join(" | ") || "(geen)"}`);
    for (const f of fouten) console.log(`  ✗ ${f}`);
    rapport.push(`**Chat** (${woorden(data.tekst).length} woorden): ${data.tekst.replace(/\n/g, " / ")}`, "", `Bron: ${(data.bronnen ?? []).map((b) => b.title).join("; ") || "geen"}`, "", fouten.length ? `Controles mislukt: ${fouten.join("; ")}` : "Alle controles geslaagd.", "");
    berichten.push({ role: "assistant", text: data.tekst });
  }
}
const samenvatting = `${aantal} antwoorden van het taalmodel (${aanroepen} aanroepen), gemiddeld ${Math.round(totaalWoorden / Math.max(aantal, 1))} woorden, ${metVraagAan} met een vraag, ${mislukt} controles mislukt`;
console.log(`\n${samenvatting}`);
rapport.splice(3, 0, `**${samenvatting}**`, "");
writeFileSync("docs/keuzehulp-gesprekken.md", rapport.join("\n"));
process.exit(mislukt > 0 ? 1 : 0);
