import type { ChatSource } from "@/lib/chatPdf";

/**
 * De bronnen van de kennisbank: de vier voorwaardendocumenten en de drie productpagina's op asr.nl ("site-…").
 * De Algemene voorwaarden gelden bij elke dekking.
 */
export type Product = "wa" | "casco-beperkt" | "casco-allrisk" | "algemeen" | "site-wa" | "site-casco-beperkt" | "site-casco-allrisk";

/** Titel van het document, zoals die bij een antwoord als bron getoond wordt. */
export const PRODUCT_BRON: Record<Product, string> = {
  wa: "Voorwaarden Autoverzekering Wettelijke Aansprakelijkheid (WA), D AU-WA 2017-01",
  "casco-beperkt": "Voorwaarden Autoverzekering Casco Beperkt, D AU-CB 2017-01",
  "casco-allrisk": "Voorwaarden Autoverzekering Casco Allrisk, D AU-CA 2017-01",
  algemeen: "Algemene Voorwaarden Ik kies zelf van a.s.r., D 2013-01",
  "site-wa": "asr.nl - WA autoverzekering Ik kies zelf",
  "site-casco-beperkt": "asr.nl - WA + Casco beperkt autoverzekering Ik kies zelf",
  "site-casco-allrisk": "asr.nl - Allrisk autoverzekering Ik kies zelf",
};

/** Waar het document of de pagina te lezen is; zo wordt de bron onder een antwoord een link. */
export const PRODUCT_URL: Record<Product, string> = {
  wa: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57654.pdf",
  "casco-beperkt": "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57653.pdf",
  "casco-allrisk": "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57652.pdf",
  algemeen: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57626.pdf",
  "site-wa": "https://www.asr.nl/autoverzekering/wa",
  "site-casco-beperkt": "https://www.asr.nl/autoverzekering/wa-casco-beperkt-verzekering",
  "site-casco-allrisk": "https://www.asr.nl/autoverzekering/wa-casco-allrisk-verzekering",
};

/** Hoe de bron in een zin heet ("Dit staat in de voorwaarden van Casco Beperkt"). */
export const PRODUCT_NAAM: Record<Product, string> = {
  wa: "de voorwaarden van WA",
  "casco-beperkt": "de voorwaarden van Casco Beperkt",
  "casco-allrisk": "de voorwaarden van Casco Allrisk",
  algemeen: "de Algemene voorwaarden",
  "site-wa": "de WA-pagina op asr.nl",
  "site-casco-beperkt": "de WA + Casco beperkt-pagina op asr.nl",
  "site-casco-allrisk": "de Allrisk-pagina op asr.nl",
};

/**
 * Eén onderdeel van de kennisbank, in de woorden van het document (jij/je-vorm, bedragen en termijnen letterlijk).
 * Wat niet in de documenten staat, staat hier ook niet.
 *
 * `artikelen` zegt in welke documenten dit onderdeel staat en onder welk artikel; staat dezelfde tekst in meer dan
 * één document, dan staan er meer sleutels. `trefwoorden` zijn kleine letters zonder accenten; de zoekfunctie
 * normaliseert de vraag op dezelfde manier en zoekt deelstrings, dus "alcohol" vindt ook "alcoholgebruik".
 */
export type KennisItem = {
  id: string;
  artikelen: Partial<Record<Product, string>>;
  trefwoorden: string[];
  /**
   * De brontekst van dit onderdeel: de tekst waarop het antwoord gebaseerd is. Hij volgt de voorwaarden of de pagina,
   * maar is niet altijd een letterlijke kopie; zie `verrijking.brontekstSoort`.
   */
  tekst: string;
  /** Links naar documenten die bij dit onderdeel horen (bv. de PDF's van de voorwaarden); ze komen bij de bronnen. */
  links?: ChatSource[];
  /** Klantvriendelijke laag bovenop de brontekst (fase 1 van het kennisbankplan); nog niet voor elk onderdeel gevuld. */
  verrijking?: Verrijking;
};

/**
 * De klantvriendelijke laag bij een onderdeel. De chat gebruikt deze velden om kort en menselijk te antwoorden en
 * gebruikt de brontekst (`KennisItem.tekst`) om te controleren dat de inhoud klopt. Alles hier is geschreven op
 * B1-niveau, maar mag de betekenis van een voorwaarde nooit veranderen.
 */
export type Verrijking = {
  /**
   * Wat de brontekst is. "bijna-letterlijk": volgt de woorden van het document. "samenvatting": een samenvatting of
   * samenvoeging door de kennisbankmaker van meerdere passages en/of de website; geen letterlijke voorwaardentekst.
   */
  brontekstSoort: "bijna-letterlijk" | "samenvatting";
  /** 1 tot 3 korte zinnen op B1-niveau: de kern van het onderdeel. */
  uitleg: string;
  /** Deadlines en veiligheidsstappen die de chat meteen noemt, in het eerste antwoord. */
  direct: string[];
  /** Overige bedragen, voorwaarden, beperkingen en uitzonderingen; de chat noemt wat voor de klant telt. */
  aandachtspunten: string[];
  /** Welke gegevens van de klant nodig zijn om een juist antwoord te geven. */
  klantinfo: string[];
  /** Per ontbrekend gegeven de logische vervolgvraag (één per bericht, alleen als het echt nodig is). */
  vervolgvragen: { als: string; vraag: string }[];
  /** Ids van onderdelen die bij een vraag over dit onderwerp mee moeten (bv. aangifte bij diefstal). */
  gerelateerd?: string[];
  /** Controlestatus. "gecontroleerd": uitleg en punten zijn naast de bron gelegd. "handmatig-controleren": een mens moet het nakijken. */
  controle: { status: "gecontroleerd" | "handmatig-controleren"; opmerking?: string };
};
