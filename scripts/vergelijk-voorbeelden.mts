/**
 * Vergelijkt de huidige chat met de chat mét de vijf voorbeeldgesprekken, met het echte taalmodel:
 *
 *   OUD_URL=https://<huidige-versie> NIEUW_URL=https://<versie-met-voorbeelden> \
 *     npx tsx --tsconfig tsconfig.json scripts/vergelijk-voorbeelden.mts
 *
 * Dezelfde 14 gesprekken gaan naar beide versies (elke versie krijgt zijn eigen antwoorden als geschiedenis). Per antwoord
 * meten we woorden, zinnen, vragen, de opening, letterlijk overnemen uit de kennisbank en uit de voorbeelden, verzonnen
 * bedragen en de feiten die in dat gesprek moeten of niet mogen voorkomen. Het resultaat staat op het scherm en in
 * docs/chat-voorbeeldgesprekken-vergelijking.md, met alle antwoorden naast elkaar zodat je de natuurlijkheid zelf kunt lezen.
 * De route laat per IP 20 vragen per 10 minuten toe; bij een 429 wacht dit script en probeert het opnieuw.
 */
import { writeFileSync } from "node:fs";
import { KENNISBANK } from "../lib/kennisbank/index";
import { VOORBEELDGESPREKKEN } from "../lib/chat/voorbeeldgesprekken";

const OUD_URL = process.env.OUD_URL;
const NIEUW_URL = process.env.NIEUW_URL;
if (!OUD_URL || !NIEUW_URL) {
  console.error("Geef OUD_URL en NIEUW_URL mee.");
  process.exit(2);
}
const UITVOER = process.env.UITVOER ?? "docs/chat-voorbeeldgesprekken-vergelijking.md";

type Dekking = "wa" | "wa-casco-beperkt" | "wa-casco-allrisk";
type Check = { naam: string; ok: (antwoord: string) => boolean };
type Beurt = { klant: string; checks?: Check[]; /** De klant heeft een vervelende situatie: het antwoord begint met begrip. */ vervelend?: boolean; /** Dit antwoord mag een als voorbeeld gemarkeerd bedrag bevatten. */ rekenvoorbeeld?: boolean };
type Gesprek = { naam: string; dekking: Dekking; beurten: Beurt[]; /** Lijkt op een van de voorbeelden: het antwoord mag niet letterlijk gelijk zijn. */ lijktOpVoorbeeld?: number };

const moet = (naam: string, ...p: RegExp[]): Check => ({ naam: `noemt ${naam}`, ok: (t) => p.every((x) => x.test(t)) });
const mag_niet = (naam: string, p: RegExp): Check => ({ naam: `noemt niet ${naam}`, ok: (t) => !p.test(t) });

const GESPREKKEN: Gesprek[] = [
  { naam: "WA uitleg", dekking: "wa", lijktOpVoorbeeld: 1, beurten: [{ klant: "Wat is een WA-verzekering?", checks: [moet("schade aan anderen", /ander/i), moet("dat de eigen auto niet verzekerd is", /eigen auto/i, /niet/i)] }] },
  { naam: "Paaltje (allrisk)", dekking: "wa-casco-allrisk", lijktOpVoorbeeld: 2, beurten: [
    { klant: "Ben ik verzekerd voor deze schade?" },
    { klant: "Ik ben tegen een paaltje gereden.", checks: [moet("dat het verzekerd is", /verzekerd|gedekt|\bja\b|vergoed/i), moet("het eigen risico", /eigen risico/i), mag_niet("een vraag naar de dekking (die is bekend)", /welke dekking|heb je (WA|allrisk|casco)/i)] },
  ] },
  { naam: "Diefstal", dekking: "wa-casco-beperkt", lijktOpVoorbeeld: 3, beurten: [
    { klant: "Mijn auto is gestolen!", vervelend: true, checks: [moet("aangifte", /aangifte/i), moet("de deadline", /dezelfde dag|vandaag|volgende ochtend/i)] },
    { klant: "Nee, nog niet.", checks: [moet("aangifte", /aangifte/i), mag_niet("dezelfde vraag opnieuw", /heb je (al )?aangifte gedaan/i)] },
  ] },
  { naam: "Eigen risico uitleg", dekking: "wa-casco-beperkt", lijktOpVoorbeeld: 4, beurten: [
    { klant: "Wat is eigen risico?" },
    { klant: "Ik snap het niet helemaal.", rekenvoorbeeld: true, checks: [moet("een voorbeeld", /stel|bijvoorbeeld|voorbeeld/i)] },
    { klant: "Dus ik betaal altijd hetzelfde bedrag?", checks: [moet("het polisblad of de keuze", /polisblad|€ 0|150|250|500|kies/i), mag_niet("een vast bedrag als zeker", /ja,? je betaalt altijd/i)] },
  ] },
  { naam: "Dekking kiezen", dekking: "wa", lijktOpVoorbeeld: 5, beurten: [
    { klant: "Ik heb een auto van acht jaar oud." },
    { klant: "Ook diefstal en ruitschade.", checks: [moet("Casco beperkt", /casco beperkt|wa ?\+|wa plus/i)] },
    { klant: "Nee, dat hoeft niet.", checks: [moet("dat a.s.r. geen persoonlijk advies geeft of een adviseur", /advies|adviseur/i), mag_niet("een stellige aanbeveling", /ik raad (je )?(aan|dit aan)|je moet (kiezen|nemen)/i), mag_niet("een vraag over wat de klant al zei", /diefstal en ruitschade\?|wil je (ook )?diefstal/i)] },
  ] },
  { naam: "Voorruit steenslag", dekking: "wa-casco-beperkt", beurten: [{ klant: "Er zit een barst in mijn voorruit door steenslag. Wat nu?", checks: [moet("een hersteller of afspraak", /afspraak|hersteller|ruitschadeherstel|glasgarant/i)] }] },
  { naam: "Ree aangereden", dekking: "wa-casco-beperkt", beurten: [{ klant: "Ik heb een ree aangereden. Krijg ik de schade vergoed?", checks: [moet("dat het verzekerd is", /verzekerd|gedekt|\bja\b|vergoed/i)] }] },
  { naam: "Zoon rijdt (allrisk)", dekking: "wa-casco-allrisk", beurten: [
    { klant: "Mijn zoon van 20 rijdt soms in mijn auto. Hoe zit dat?" },
    { klant: "Ik sta zelf als vaste bestuurder op de polis, ik ben 45.", checks: [moet("het extra eigen risico", /250|extra eigen risico|jeugd/i)] },
    { klant: "En als hij schade maakt?", checks: [mag_niet("opnieuw vragen naar de leeftijd van de zoon of de vaste bestuurder", /hoe oud (is|ben)/i)] },
  ] },
  { naam: "Premie", dekking: "wa", beurten: [{ klant: "Wat kost mijn verzekering?", checks: [mag_niet("een premiebedrag", /€\s?\d[\d.,]*\s*(per maand|p\.m\.|per jaar)|\d+\s?euro per (maand|jaar)/i)] }] },
  { naam: "Opzeggen na 3 maanden", dekking: "wa-casco-beperkt", beurten: [
    { klant: "Hoe zeg ik mijn verzekering op?" },
    { klant: "Ik heb hem 3 maanden geleden afgesloten.", checks: [moet("het eerste jaar", /eerste (verzekerings)?jaar|nog niet|een jaar/i)] },
  ] },
  { naam: "Total loss", dekking: "wa-casco-allrisk", beurten: [
    { klant: "Mijn auto is total loss!", vervelend: true },
    { klant: "Ik heb de auto nieuw gekocht, hij is anderhalf jaar oud.", checks: [moet("de waarde (nieuwwaarde)", /nieuwwaarde|waarde/i)] },
  ] },
  { naam: "Vage melding", dekking: "wa-casco-beperkt", beurten: [
    { klant: "Mijn auto is beschadigd, wat nu?", vervelend: true, checks: [moet("een vraag", /\?/)] },
    { klant: "Er is een boom op gevallen.", checks: [moet("storm of dat het verzekerd is", /storm|verzekerd|gedekt|\bja\b/i), mag_niet("dezelfde vraag opnieuw", /wat is er (precies )?gebeurd/i)] },
  ] },
  { naam: "Sleutels kwijt", dekking: "wa-casco-beperkt", beurten: [{ klant: "Ik ben mijn autosleutels kwijt.", vervelend: true, checks: [moet("dat verlies niet vergoed wordt", /geen vergoeding|niet (verzekerd|vergoed)|vergoeden (wij|we) .{0,30}niet|helaas niet/i), moet("gestolen als uitzondering", /gestolen|diefstal/i)] }] },
  { naam: "Bedankje", dekking: "wa", beurten: [
    { klant: "Wat is een WA-verzekering?" },
    { klant: "Dank je wel!", checks: [{ naam: "blijft kort (maximaal 25 woorden)", ok: (t) => woorden(t).length <= 25 }, mag_niet("een nieuwe vraag", /\?/)] },
  ] },
];

// Hulp -------------------------------------------------------------------------------------------------------------------
const woorden = (t: string) => t.split(/\s+/).filter(Boolean);
const zinnen = (t: string) => t.replace(/a\.s\.r\./gi, "asr").split(/(?<=[.!?])\s+/).filter((z) => /\w/.test(z));
const normaal = (t: string) => ` ${t.toLowerCase().replace(/a\.s\.r\./g, "asr").replace(/[^a-z0-9€ ]+/g, " ").replace(/\s+/g, " ").trim()} `;
const KENNISTEKSTEN = KENNISBANK.map((item) => normaal(item.tekst));
const KB_GETALLEN = KENNISBANK.map((i) => [i.tekst, i.verrijking?.uitleg, ...(i.verrijking?.direct ?? []), ...(i.verrijking?.aandachtspunten ?? [])].join(" ")).join(" ").replace(/[.,]/g, "");
const VOORBEELD_TEKSTEN = VOORBEELDGESPREKKEN.flatMap((v) => v.beurten.map((b) => normaal(b.jij)));

/** Staat een stuk van `n` woorden uit het antwoord letterlijk in een van de teksten? */
function gedeeldeReeks(antwoord: string, teksten: string[], n: number): string | null {
  const w = normaal(antwoord).trim().split(" ");
  for (let i = 0; i + n <= w.length; i++) {
    const stuk = ` ${w.slice(i, i + n).join(" ")} `;
    if (teksten.some((t) => t.includes(stuk))) return w.slice(i, i + n).join(" ");
  }
  return null;
}
const VERBODEN_OPENER = /^(goede vraag|ik help je graag|dat hangt af van verschillende factoren|natuurlijk,? ik help)/i;
const BEGRIP = /\b(vervelend|jammer|balen|naar voor je|schrik|sneu|rot|lastig|spijt)/i;
const JURIDISCH = /\b(dient|conform|overeenkomstig|ingevolge|bepalingen|artikel \d)/i;

type Antwoord = { tekst: string; bronnen: number; fout?: string };
async function vraag(basis: string, berichten: { role: string; text: string }[], dekking: Dekking): Promise<Antwoord> {
  for (let poging = 0; poging < 14; poging++) {
    const response = await fetch(`${basis}/api/chat`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ berichten, dekking }) });
    let data: { tekst?: string; bronnen?: unknown[]; fout?: string } = {};
    try {
      data = (await response.json()) as typeof data;
    } catch {
      /* geen JSON, bv. een foutpagina */
    }
    if (response.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 60_000));
      continue;
    }
    if (response.status !== 200 || !data.tekst) return { tekst: "", bronnen: 0, fout: `${response.status} ${data.fout ?? ""}`.trim() };
    return { tekst: data.tekst, bronnen: (data.bronnen ?? []).length };
  }
  return { tekst: "", bronnen: 0, fout: "rem" };
}

type Rij = { gesprek: string; klant: string; antwoord: Antwoord; fouten: string[]; woorden: number; zinnen: number; vragen: number; eindigtMetVraag: boolean; opening: string; kbKopie: string | null; voorbeeldKopie: string | null; begrip: boolean | null };

async function draai(basis: string): Promise<Rij[]> {
  const rijen: Rij[] = [];
  for (const gesprek of GESPREKKEN) {
    const berichten: { role: "user" | "assistant"; text: string }[] = [];
    for (const beurt of gesprek.beurten) {
      berichten.push({ role: "user", text: beurt.klant });
      const antwoord = await vraag(basis, berichten, gesprek.dekking);
      const t = antwoord.tekst;
      const fouten: string[] = [];
      if (antwoord.fout) fouten.push(`FOUT ${antwoord.fout}`);
      else {
        for (const c of beurt.checks ?? []) if (!c.ok(t)) fouten.push(c.naam);
        if (woorden(t).length > 70) fouten.push("meer dan 70 woorden");
        if (zinnen(t).length > 4) fouten.push("meer dan 4 zinnen");
        if (zinnen(t).some((z) => woorden(z).length > 25)) fouten.push("zin langer dan 25 woorden");
        if ((t.match(/\?/g) ?? []).length > 1) fouten.push("meer dan één vraag");
        if (JURIDISCH.test(t) || /\b(u|uw)\b/.test(t)) fouten.push("formele of juridische taal");
        if (VERBODEN_OPENER.test(t)) fouten.push("verboden opener");
        if (/[*#|]|\[\[|kennisbank/i.test(t)) fouten.push("opmaak, marker of het woord kennisbank");
        for (const bedrag of t.match(/€\s?\d[\d.,]*/g) ?? []) {
          const getal = bedrag.replace(/[^\d]/g, "");
          if (!beurt.rekenvoorbeeld && !KB_GETALLEN.includes(getal) && !berichten.some((b) => b.text.includes(getal))) fouten.push(`verzonnen bedrag ${bedrag}`);
        }
      }
      const kbKopie = t ? gedeeldeReeks(t, KENNISTEKSTEN, 10) : null;
      const voorbeeldKopie = t ? gedeeldeReeks(t, VOORBEELD_TEKSTEN, 8) : null;
      if (kbKopie) fouten.push(`letterlijk uit de kennisbank ("${kbKopie}")`);
      if (voorbeeldKopie) fouten.push(`letterlijk uit een voorbeeld ("${voorbeeldKopie}")`);
      rijen.push({
        gesprek: gesprek.naam, klant: beurt.klant, antwoord, fouten,
        woorden: woorden(t).length, zinnen: zinnen(t).length, vragen: (t.match(/\?/g) ?? []).length, eindigtMetVraag: t.trim().endsWith("?"),
        opening: woorden(t).slice(0, 2).join(" ").toLowerCase(), kbKopie, voorbeeldKopie, begrip: beurt.vervelend ? BEGRIP.test(zinnen(t)[0] ?? "") : null,
      });
      if (antwoord.fout) break;
      berichten.push({ role: "assistant", text: t });
    }
  }
  return rijen;
}

// Uitvoeren --------------------------------------------------------------------------------------------------------------
console.log("Ik draai de gesprekken op beide versies tegelijk; dat duurt een paar minuten tot een kwartier (rem van 20 vragen per 10 minuten per versie).");
const [oud, nieuw] = await Promise.all([draai(OUD_URL), draai(NIEUW_URL)]);

const gemiddeld = (rijen: Rij[], f: (r: Rij) => number) => (rijen.length ? rijen.reduce((s, r) => s + f(r), 0) / rijen.length : 0);
const pct = (n: number, totaal: number) => (totaal ? `${Math.round((n / totaal) * 100)}%` : "-");
function samenvat(rijen: Rij[]) {
  const ok = rijen.filter((r) => !r.antwoord.fout);
  const begripRijen = ok.filter((r) => r.begrip !== null);
  const metBron = ok.filter((r) => r.antwoord.bronnen > 0).length;
  return {
    antwoorden: ok.length,
    fouten: rijen.length - ok.length,
    woorden: gemiddeld(ok, (r) => r.woorden),
    zinnen: gemiddeld(ok, (r) => r.zinnen),
    zinLengte: gemiddeld(ok, (r) => r.woorden / Math.max(r.zinnen, 1)),
    metVraag: pct(ok.filter((r) => r.vragen > 0).length, ok.length),
    eindigtMetVraag: pct(ok.filter((r) => r.eindigtMetVraag).length, ok.length),
    meerVragen: ok.filter((r) => r.vragen > 1).length,
    verschillendeOpeningen: `${new Set(ok.map((r) => r.opening)).size} van ${ok.length}`,
    begrip: begripRijen.length ? `${begripRijen.filter((r) => r.begrip).length} van ${begripRijen.length}` : "-",
    kbKopie: ok.filter((r) => r.kbKopie).length,
    voorbeeldKopie: ok.filter((r) => r.voorbeeldKopie).length,
    metBron: `${metBron} van ${ok.length}`,
    mislukteChecks: ok.reduce((s, r) => s + r.fouten.filter((f) => !f.startsWith("letterlijk")).length, 0),
  };
}
const so = samenvat(oud);
const sn = samenvat(nieuw);
const f1 = (n: number) => n.toFixed(1);
const REGELS: [string, string, string][] = [
  ["Antwoorden ontvangen (fouten)", `${so.antwoorden} (${so.fouten})`, `${sn.antwoorden} (${sn.fouten})`],
  ["Gemiddeld aantal woorden", f1(so.woorden), f1(sn.woorden)],
  ["Gemiddeld aantal zinnen", f1(so.zinnen), f1(sn.zinnen)],
  ["Gemiddelde zinslengte (woorden)", f1(so.zinLengte), f1(sn.zinLengte)],
  ["Antwoorden met een vraag", so.metVraag, sn.metVraag],
  ["Antwoorden die eindigen met een vraag", so.eindigtMetVraag, sn.eindigtMetVraag],
  ["Antwoorden met meer dan één vraag", String(so.meerVragen), String(sn.meerVragen)],
  ["Verschillende openingen (eerste twee woorden)", so.verschillendeOpeningen, sn.verschillendeOpeningen],
  ["Begrip in de eerste zin (vervelende situatie)", so.begrip, sn.begrip],
  ["Letterlijk uit de kennisbank (10 woorden)", String(so.kbKopie), String(sn.kbKopie)],
  ["Letterlijk uit een voorbeeld (8 woorden)", String(so.voorbeeldKopie), String(sn.voorbeeldKopie)],
  ["Antwoorden met een bronverwijzing", so.metBron, sn.metBron],
  ["Mislukte inhoudelijke controles", String(so.mislukteChecks), String(sn.mislukteChecks)],
];

const uit: string[] = [`# Vergelijking chat: huidig en met voorbeeldgesprekken (${new Date().toISOString().slice(0, 10)})`, "", `Huidig: ${OUD_URL}  \nMet voorbeelden: ${NIEUW_URL}`, "", "| Meting | Huidig | Met voorbeelden |", "|---|---|---|", ...REGELS.map(([a, b, c]) => `| ${a} | ${b} | ${c} |`), ""];
for (const gesprek of GESPREKKEN) {
  uit.push(`## ${gesprek.naam} (${gesprek.dekking})`, "");
  const o = oud.filter((r) => r.gesprek === gesprek.naam);
  const n = nieuw.filter((r) => r.gesprek === gesprek.naam);
  for (let i = 0; i < gesprek.beurten.length; i++) {
    uit.push(`**Klant:** ${gesprek.beurten[i].klant}`, "");
    for (const [label, rijen] of [["Huidig", o], ["Met voorbeelden", n]] as const) {
      const r = rijen[i];
      if (!r) uit.push(`- *${label}:* (geen antwoord, het gesprek stopte eerder)`);
      else uit.push(`- *${label}* (${r.woorden} woorden): ${r.antwoord.fout ? `FOUT ${r.antwoord.fout}` : r.antwoord.tekst.replace(/\n/g, " / ")}${r.fouten.length ? `  \n  Let op: ${r.fouten.join("; ")}` : ""}`);
    }
    uit.push("");
  }
}
writeFileSync(UITVOER, uit.join("\n"));

console.log("\n" + ["Meting".padEnd(50), "Huidig".padEnd(10), "Nieuw"].join(" "));
for (const [a, b, c] of REGELS) console.log([a.padEnd(50), b.padEnd(10), c].join(" "));
console.log(`\nRapport: ${UITVOER}`);
