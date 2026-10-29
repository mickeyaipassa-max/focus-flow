/** Fase 2: schrijft docs/kennisbank-proefartikelen.md met per proefartikel de oude en de nieuwe structuur.  npx tsx --tsconfig tsconfig.json scripts/kennisbank-overzicht.mts */
import { writeFileSync } from "node:fs";
import { KENNISBANK, PRODUCT_BRON } from "../lib/kennisbank/index";

const proef = KENNISBANK.filter((item) => item.verrijking);
const lijst = (regels: string[]) => regels.map((r) => `- ${r}`).join("\n");
const uit: string[] = [
  "# Kennisbank: de tien proefartikelen",
  "",
  `${proef.length} van ${KENNISBANK.length} kennisblokken hebben nu de klantvriendelijke laag. De overige ${KENNISBANK.length - proef.length} blijven ongewijzigd tot jij de proefartikelen hebt goedgekeurd. Per onderwerp staat links wat er was (alleen een brontekst met zoekwoorden en bron) en daaronder wat erbij is gekomen.`,
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
writeFileSync("docs/kennisbank-proefartikelen.md", uit.filter((r) => r !== undefined).join("\n"));
console.log(`docs/kennisbank-proefartikelen.md geschreven: ${proef.length} proefartikelen`);
