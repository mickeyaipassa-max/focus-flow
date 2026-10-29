/** Fase 2: schrijft docs/kennisbank-proefartikelen.md met per proefartikel de oude en de nieuwe structuur.  npx tsx --tsconfig tsconfig.json scripts/kennisbank-overzicht.mts */
import { writeFileSync } from "node:fs";
import { KENNISBANK, PRODUCT_BRON, VERRIJKING_GROEPEN } from "../lib/kennisbank/index";

const groep = process.argv[2] ?? "proefartikelen";
const ids = Object.keys(VERRIJKING_GROEPEN[groep] ?? {});
if (ids.length === 0) throw new Error(`Onbekende groep "${groep}". Kies uit: ${Object.keys(VERRIJKING_GROEPEN).join(", ")}`);
const proef = KENNISBANK.filter((item) => ids.includes(item.id));
const lijst = (regels: string[]) => regels.map((r) => `- ${r}`).join("\n");
const uit: string[] = [
  `# Kennisbank: ${groep}`,
  "",
  `${proef.length} kennisblokken in deze groep (van in totaal ${KENNISBANK.length}; ${KENNISBANK.filter((i) => i.verrijking).length} hebben nu de klantvriendelijke laag). Per blok staat eerst wat er was (brontekst met zoekwoorden en bron) en daaronder wat erbij is gekomen. Blokken met controlestatus "handmatig controleren" zijn hieronder bovenaan gemeld.`,
  "",
];
proef.forEach((item, i) => {
  const v = item.verrijking!;
  uit.push(
    `## ${i + 1}. ${item.id}`,
    "",
    `**Controle:** ${v.controle.status === "gecontroleerd" ? "gecontroleerd tegen de bron" : "HANDMATIG CONTROLEREN"}${v.controle.opmerking ? ` — ${v.controle.opmerking}` : ""}`,
    "",
    "### Oud",
    `**Bronverwijzing:** ${Object.entries(item.artikelen).map(([p, a]) => `${PRODUCT_BRON[p as keyof typeof PRODUCT_BRON]}, ${a}`).join("; ")}`,
    `**Zoekwoorden (${item.trefwoorden.length}):** ${item.trefwoorden.slice(0, 12).join(", ")}${item.trefwoorden.length > 12 ? ", …" : ""}`,
    `**Tekst (${item.tekst.split(/\s+/).length} woorden):** ${item.tekst}`,
    "",
    "### Nieuw",
    `**Brontekst:** dezelfde tekst als hierboven. Soort: ${v.brontekstSoort === "samenvatting" ? "samenvatting door de kennisbankmaker, geen letterlijke voorwaardentekst" : "volgt de woorden van het document (bijna letterlijk)"}.`,
    `**Klantvriendelijke uitleg (${v.uitleg.split(/\s+/).length} woorden):** ${v.uitleg}`,
    `**Noem direct:**\n${lijst(v.direct)}`,
    `**Belangrijke aandachtspunten:**\n${lijst(v.aandachtspunten)}`,
    `**Benodigde klantinformatie:**\n${lijst(v.klantinfo)}`,
    `**Gespreksaanpak (vervolgvraag):**\n${lijst(v.vervolgvragen.map((x) => `Als ${x.als.charAt(0).toLowerCase()}${x.als.slice(1)} → "${x.vraag}"`))}`,
    v.gerelateerd?.length ? `**Haalt ook op:** ${v.gerelateerd.join(", ")}` : "",
    "",
  );
});
const handmatig = proef.filter((item) => item.verrijking!.controle.status === "handmatig-controleren");
uit.splice(4, 0, `**Handmatig controleren (${handmatig.length}):** ${handmatig.map((item) => `${item.id}`).join(", ") || "geen"}`, "");
const bestand = groep === "proefartikelen" ? "docs/kennisbank-proefartikelen.md" : `docs/kennisbank-${groep}.md`;
writeFileSync(bestand, uit.filter((r) => r !== undefined).join("\n"));
console.log(`${bestand} geschreven: ${proef.length} blokken, ${handmatig.length} handmatig controleren`);
