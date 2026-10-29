import type { ChatSource } from "@/lib/chatPdf";
import { KENNISBANK } from "@/lib/kennisbank";
import type { KennisContext } from "@/lib/kennisbank/zoek";

const inhoudswoorden = (tekst: string) => new Set(tekst.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[a-z0-9]{5,}/g) ?? []);

const onderdeelWoorden = (onderdeel: Pick<KennisContext, "tekst" | "verrijking">) => {
  const v = onderdeel.verrijking;
  return inhoudswoorden([onderdeel.tekst, v?.uitleg, ...(v?.direct ?? []), ...(v?.aandachtspunten ?? [])].filter(Boolean).join(" "));
};

/**
 * Hoe zeldzamer een woord in de kennisbank, hoe zwaarder het telt: "schade" of "casco" zegt weinig, "hagel" of
 * "sleutels" veel. Het gewicht is kwadratisch, zodat een paar zeldzame woorden opwegen tegen veel algemene.
 */
let documentFrequentie: Map<string, number> | null = null;
function gewicht(woord: string): number {
  if (!documentFrequentie) {
    documentFrequentie = new Map();
    for (const item of KENNISBANK) for (const w of onderdeelWoorden(item)) documentFrequentie.set(w, (documentFrequentie.get(w) ?? 0) + 1);
  }
  return Math.log((KENNISBANK.length + 1) / ((documentFrequentie.get(woord) ?? 0) + 1)) ** 2;
}

/** Een onderdeel dat de zoekfunctie hoger zette, krijgt een kleine voorsprong; het eerste onderdeel het meest. */
const RANGBONUS = [1.25, 1.1, 1];

/**
 * De vervolgvraag aan het eind ("Heb je je auto verkocht, of ben je het niet eens met een wijziging?") somt opties op
 * en bevat geen feiten uit het onderdeel; die telt niet mee. Blijft er te weinig over, dan telt de hele tekst.
 */
function zonderVervolgvraag(tekst: string): string {
  const zinnen = tekst.replace(/a\.s\.r\./gi, "asr").split(/(?<=[.!?])\s+/);
  while (zinnen.length > 1 && zinnen[zinnen.length - 1].trim().endsWith("?")) zinnen.pop();
  const rest = zinnen.join(" ");
  return rest.split(/\s+/).length >= 8 ? rest : tekst;
}

/**
 * De bron onder het antwoord is die van het onderdeel waar het antwoord het meest op lijkt, niet automatisch die van het
 * eerst gevonden onderdeel. Woorden die in weinig onderdelen voorkomen ("hagel", "sleutels") tellen zwaarder dan woorden
 * die overal staan ("schade", "casco", "voorwaarden"), en de rangorde van de zoekfunctie telt licht mee. Lijkt het
 * antwoord op niets, dan geen bron.
 */
export function bronVanAntwoord(tekst: string, context: KennisContext[]): ChatSource[] {
  const antwoord = inhoudswoorden(zonderVervolgvraag(tekst));
  let beste = { score: 0, bronnen: [] as ChatSource[] };
  context.forEach((onderdeel, rang) => {
    const woorden = onderdeelWoorden(onderdeel);
    const gemeen = [...antwoord].filter((woord) => woorden.has(woord));
    if (gemeen.length < 3) return;
    const score = (gemeen.reduce((som, woord) => som + gewicht(woord), 0) / Math.sqrt(woorden.size || 1)) * (RANGBONUS[rang] ?? 1);
    if (score > beste.score) beste = { score, bronnen: onderdeel.bronnen };
  });
  return beste.bronnen;
}
