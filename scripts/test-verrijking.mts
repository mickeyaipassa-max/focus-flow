/**
 * Controleert de klantvriendelijke laag van alle verrijkte kennisblokken, zonder taalmodel:  npx tsx --tsconfig tsconfig.json scripts/test-verrijking.mts
 * - structuur: uitleg 1-3 zinnen en niet te lang, zinnen niet te lang (B1), gerelateerde ids bestaan;
 * - feiten: elk getal (bedrag, termijn, percentage) in uitleg, direct en aandachtspunten staat ook in de brontekst van het blok,
 *   of anders in de brontekst van een gerelateerd blok. Getallen die nergens staan worden gemeld voor handmatige controle.
 */
import { KENNISBANK } from "../lib/kennisbank/index";

const woorden = (t: string) => t.split(/\s+/).filter(Boolean);
const zinnen = (t: string) => t.replace(/a\.s\.r\./gi, "asr").replace(/\b(bijv|enz|o\.a)\./gi, "x").split(/(?<=[.!?])\s+/).filter((z) => /\w/.test(z));
const getallen = (t: string) => (t.match(/\d+(?:[.,]\d+)*/g) ?? []).map((g) => g.replace(/[.,]$/, ""));
const platte = (t: string) => t.replace(/[.,](?=\d{3}\b)/g, "").replace(/,/g, ".");

let problemen = 0;
let aantal = 0;
const per = (id: string, tekst: string) => {
  problemen++;
  console.log(`✗ ${id}: ${tekst}`);
};
for (const item of KENNISBANK) {
  const v = item.verrijking;
  if (!v) continue;
  aantal++;
  const uitlegZinnen = zinnen(v.uitleg);
  if (uitlegZinnen.length > 3) per(item.id, `uitleg heeft ${uitlegZinnen.length} zinnen (max 3)`);
  if (woorden(v.uitleg).length > 60) per(item.id, `uitleg heeft ${woorden(v.uitleg).length} woorden (max 60)`);
  for (const [soort, tekst] of [["uitleg", v.uitleg], ...v.direct.map((t) => ["direct", t]), ...v.aandachtspunten.map((t) => ["aandachtspunt", t]), ...v.vervolgvragen.map((x) => ["vervolgvraag", x.vraag])] as [string, string][]) {
    for (const zin of zinnen(tekst)) if (woorden(zin).length > 30 && soort !== "aandachtspunt") per(item.id, `${soort}: zin van ${woorden(zin).length} woorden: "${zin.slice(0, 70)}…"`);
  }
  for (const vraag of v.vervolgvragen) if ((vraag.vraag.match(/\?/g) ?? []).length !== 1) per(item.id, `vervolgvraag heeft niet precies één vraagteken: "${vraag.vraag}"`);
  for (const id of v.gerelateerd ?? []) if (!KENNISBANK.some((k) => k.id === id)) per(item.id, `gerelateerd id bestaat niet: ${id}`);

  const bronnen = [item, ...(v.gerelateerd ?? []).flatMap((id) => KENNISBANK.filter((k) => k.id === id))].map((k) => platte(k.tekst));
  const eigen = platte(item.tekst);
  const gecheckt = [v.uitleg, ...v.direct, ...v.aandachtspunten];
  for (const tekst of gecheckt) {
    for (const g of new Set(getallen(tekst).map(platte))) {
      if (!/\d/.test(g) || /^(1|2|3|4)$/.test(g)) continue; // losse kleine getallen ("1 jaar", "2 jaar") zijn te vaag om te vergelijken
      if (eigen.includes(g)) continue;
      if (bronnen.some((b) => b.includes(g))) continue;
      per(item.id, `getal "${g}" staat niet in de brontekst (zin: "${tekst.slice(0, 90)}…")`);
    }
  }
}
console.log(`\n${aantal} verrijkte blokken gecontroleerd, ${problemen} meldingen`);
process.exit(problemen > 0 ? 1 : 0);
