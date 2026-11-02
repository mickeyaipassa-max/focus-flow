/**
 * De voorwaarden als pdf in de chat. Vraagt de klant om de voorwaarden (het document), dan geeft de chat ze als downloadknop (tag) mee,
 * zonder taalmodel. Weet de chat nog niet voor welke dekking, dan vraagt hij dat eerst, met een tag per dekking.
 *
 * De pdf's staan in public/voorwaarden en zijn dezelfde documenten als de kennisbank gebruikt (zie lib/kennisbank/types.ts).
 * Een vraag over de inhoud ("Wat zijn de voorwaarden bij diefstal?") gaat gewoon naar het taalmodel; alleen een vraag om het
 * document zelf komt hier terecht.
 */

/** Een knop onder een antwoord van de chat: met `url` een download (pdf), zonder `url` een keuze die als bericht van de klant verstuurd wordt. */
export type ChatActie = { label: string; url?: string };

type Document = "wa" | "casco-beperkt" | "casco-allrisk" | "algemeen";

const DOCUMENTEN: Record<Document, ChatActie> = {
  wa: { label: "Voorwaarden WA (pdf)", url: "/voorwaarden/voorwaarden-wa.pdf" },
  "casco-beperkt": { label: "Voorwaarden Casco beperkt (pdf)", url: "/voorwaarden/voorwaarden-casco-beperkt.pdf" },
  "casco-allrisk": { label: "Voorwaarden Casco allrisk (pdf)", url: "/voorwaarden/voorwaarden-casco-allrisk.pdf" },
  algemeen: { label: "Algemene voorwaarden (pdf)", url: "/voorwaarden/algemene-voorwaarden.pdf" },
};

type DekkingNaam = "wa" | "wa-casco-beperkt" | "wa-casco-allrisk" | "algemeen";

/**
 * Welke documenten bij welke keuze horen. Bij WA + Casco beperkt en allrisk gelden ook de voorwaarden van WA (dezelfde combinatie als
 * de kennisbank in app/api/chat). De Algemene voorwaarden gelden bij elke dekking.
 */
const DOCUMENTEN_PER_DEKKING: Record<DekkingNaam, Document[]> = {
  wa: ["wa", "algemeen"],
  "wa-casco-beperkt": ["casco-beperkt", "wa", "algemeen"],
  "wa-casco-allrisk": ["casco-allrisk", "wa", "algemeen"],
  algemeen: ["algemeen"],
};

/** Wat er op de keuzetags staat; dit wordt ook het bericht van de klant. */
const KEUZE_LABEL: Record<DekkingNaam, string> = {
  wa: "WA",
  "wa-casco-beperkt": "WA + Casco beperkt",
  "wa-casco-allrisk": "WA + Casco allrisk",
  algemeen: "Algemene voorwaarden",
};
const KEUZES = Object.keys(KEUZE_LABEL) as DekkingNaam[];

export const VOORWAARDEN_VRAAG = "Voor welke dekking wil je de voorwaarden?";

export type VoorwaardenAntwoord = { tekst: string; acties: ChatActie[] };

/**
 * Welke dekkingen er in de tekst genoemd worden. "WA + Casco" zonder "beperkt" of "allrisk" is niet concreet en telt niet mee,
 * net als "casco" alleen.
 */
export function dekkingenInTekst(tekst: string): DekkingNaam[] {
  const t = tekst.toLowerCase();
  const gevonden: DekkingNaam[] = [];
  if (/all[\s-]?risk/.test(t)) gevonden.push("wa-casco-allrisk");
  if (/casco\s*beperkt|beperkt\s*casco|\bwa\s*\+(?!\s*casco)|\bwa\s*plus\b|mini[\s-]?casco/.test(t)) gevonden.push("wa-casco-beperkt");
  if (/algemene\s+voorwaarden/.test(t)) gevonden.push("algemeen");
  const metCasco = /casco/.test(t);
  if (!metCasco && (/\bwa\b(?!\s*\+)|wettelijke\s+aansprakelijkheid/.test(t))) gevonden.push("wa");
  return gevonden;
}

const VERZOEK_STERK = /\b(download\w*|pdf|document\w*|stuur\w*|sturen|mail\w*|opsturen|print\w*|opslaan|inzien|inkijken|link|bijlage|bestand)\b/;
const VERZOEK_ZWAK = /\b(lezen|bekijk\w*|kijken|vinden|vind|krijgen|krijg|zien|toon\w*|geef\w*|heb|hebben|hebt|opvragen|ontvangen|beschikbaar|waar)\b/;
const INHOUDSVRAAG = /\b(wat|welke|hoe|waarom|wanneer|geldt|gelden|staat|staan|moet|betekent|betekenen)\b|voorwaarden\s+(voor|bij|over)\b/;

/** Vraagt de klant om het document met de voorwaarden (en niet om wat erin staat)? */
export function vraagtOmVoorwaarden(tekst: string): boolean {
  const t = tekst.toLowerCase();
  if (!/voorwaarden/.test(t)) return false;
  if (VERZOEK_STERK.test(t)) return true;
  // Een kort bericht als "voorwaarden", "de voorwaarden van WA" of "algemene voorwaarden" is een verzoek om het document.
  const woorden = t.split(/\s+/).filter(Boolean).length;
  if (woorden <= 5 && !INHOUDSVRAAG.test(t)) return true;
  return VERZOEK_ZWAK.test(t) && !INHOUDSVRAAG.test(t);
}

const keuzeTags = (): ChatActie[] => KEUZES.map((dekking) => ({ label: KEUZE_LABEL[dekking] }));

function downloads(dekkingen: DekkingNaam[]): VoorwaardenAntwoord {
  const documenten = [...new Set(dekkingen.flatMap((dekking) => DOCUMENTEN_PER_DEKKING[dekking]))];
  const tekst =
    dekkingen.length === 1 && dekkingen[0] === "algemeen"
      ? "Hier zijn de Algemene voorwaarden. Die gelden bij elke dekking."
      : dekkingen.length === 1
        ? `Hier staan de voorwaarden van ${KEUZE_LABEL[dekkingen[0]]}. De Algemene voorwaarden gelden bij elke dekking, die staan er ook bij.`
        : "Hier staan de voorwaarden. De Algemene voorwaarden gelden bij elke dekking, die staan er ook bij.";
  return { tekst, acties: documenten.map((document) => DOCUMENTEN[document]) };
}

/**
 * De voorwaarden als pdf voor het laatste bericht van de klant, of `null` als dit geen vraag om het document is (dan beantwoordt het taalmodel het).
 * De geselecteerde dekking op de pagina telt niet mee: die staat standaard ergens op, de klant heeft nog niets gekozen. Noemt de klant geen
 * dekking, dan komt eerst de vraag voor welke dekking, met een tag per dekking; het antwoord daarop (een tag of getypt) levert de download.
 */
export function voorwaardenAntwoord(berichten: { role: "user" | "assistant"; text: string }[]): VoorwaardenAntwoord | null {
  const laatste = berichten[berichten.length - 1];
  if (!laatste || laatste.role !== "user") return null;
  const genoemd = dekkingenInTekst(laatste.text);
  const vorigeChat = berichten.length >= 2 ? berichten[berichten.length - 2] : undefined;
  const beantwoordtVraag = vorigeChat?.role === "assistant" && vorigeChat.text === VOORWAARDEN_VRAAG;

  if (beantwoordtVraag && genoemd.length > 0) return downloads(genoemd);
  if (!vraagtOmVoorwaarden(laatste.text)) return null;
  if (genoemd.length > 0) return downloads(genoemd);
  if (/\balle\b|allemaal|\balles\b/.test(laatste.text.toLowerCase())) return downloads(KEUZES);
  return { tekst: VOORWAARDEN_VRAAG, acties: keuzeTags() };
}
