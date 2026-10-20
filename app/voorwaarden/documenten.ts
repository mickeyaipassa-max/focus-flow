/**
 * Echte documentlinks van de live a.s.r.-pagina
 * asr.nl/arbeidsongeschiktheidsverzekering/overzicht-voorwaarden-en-vergoedingen
 * (overgenomen op 20 oktober 2026). De pagina verwijst met paden naar
 * https://www.asr.nl; hier staan alleen die paden, `documentUrl` zet er de host voor.
 *
 * Let op bij de live pagina:
 * - "Vaste lasten WIA volgend (model 681)" verwijst live naar een lokaal bestand
 *   (`file:///C:/Users/…/Downloads/…pdf`); die link werkt daar niet en staat hier op "#".
 * - Vier overzichten verwijzen live naar `/api/pod/getpdfbyid?id=1688x…` (211 → 221, 212 → 222,
 *   215 → 223, 216 → 224). Die geven op 20 oktober 2026 ook op asr.nl zelf een 404; ze staan hier
 *   zoals live, zodat ze vanzelf werken als a.s.r. ze herstelt.
 * - De Aegon-links zijn live verpakt in Outlook SafeLinks (met o.a. een e-mailadres
 *   van een medewerker); hier staat het uitgepakte asr.nl-adres.
 */
const ASR = "https://www.asr.nl";

export const documentUrl = (path: string) => (path.startsWith("/") ? ASR + path : path);

/** Actuele polisvoorwaarden (modelnummer in het label), in dezelfde volgorde als op de pagina. */
export const ACTUELE_POLISVOORWAARDEN_DOCS: { label: string; href: string }[] = [
  { label: "AOV (model 231)", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44141_2025.pdf" },
  { label: "Flexibele AOV (model 232)", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44154_2025.pdf" },
  { label: "AOV 2.5 (model 233)", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44153_2025.pdf" },
  { label: "Langer mee AOV (model 234)", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44155_2025.pdf" },
  { label: "Voorwaarden WIA Excedent (model 822)", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43440_2025.pdf" },
  { label: "Vaste lasten WIA volgend (model 681)", href: "#" },
  { label: "Woonlastenverzekering (model 226)", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/53940_2024.pdf" },
  { label: "Premie Terug AOV (model 227)", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44098_2024.pdf" },
  { label: "Ongevallen en ernstige aandoeningen (model 225)", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44105_2024.pdf" },
];

/** Verzekeringskaarten: externe pagina's op verzekeringskaarten.nl. */
export const VERZEKERINGSKAARTEN_DOCS: { label: string; href: string }[] = [
  { label: "AOV", href: "https://verzekeringskaarten.nl/asr/AOV" },
  { label: "AOV 2.5", href: "https://verzekeringskaarten.nl/asr/Arbeidsongeschiktheidsverzekering-AOV25" },
  { label: "Flexibele AOV", href: "https://verzekeringskaarten.nl/asr/Flexibele-AOV" },
  { label: "Langer mee AOV", href: "https://verzekeringskaarten.nl/asr/langer-mee-aov" },
  { label: "AOV vangnet", href: "https://verzekeringskaarten.nl/asr/aov-vangnet" },
  { label: "WIA Excedent", href: "https://verzekeringskaarten.nl/asr/individuele-wia-excedentverzekering" },
];

/** Link naar de actuele voorwaarden van het huidige model (231), voor het resultaatblok. */
export const HUIDIG_MODEL_DOCUMENT = "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44141_2025.pdf";

export type WijzigingsLink = { modelnummer: string; href: string };
export type WijzigingsGroep = { title: string; links: WijzigingsLink[] };

/**
 * Wijzigingsoverzichten, per "naar"-model, in de volgorde van de live pagina. Een modelnummer kan
 * in meer dan één groep voorkomen (bv. 211: naar 231 én naar 221); `wijzigingenVoorModel` zoekt ze op.
 */
export const WIJZIGINGSOVERZICHTEN_DOCS: WijzigingsGroep[] = [
  {
    title: "Wijzigingsoverzichten naar AOV-model 231",
    links: [
      { modelnummer: "221", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44170.pdf" },
      { modelnummer: "211", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44171.pdf" },
      { modelnummer: "198", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44172.pdf" },
      { modelnummer: "193", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44173.pdf" },
      { modelnummer: "188", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44174.pdf" },
      { modelnummer: "1FU", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44175.pdf" },
    ],
  },
  {
    title: "Wijzigingsoverzichten naar AOV-model 232",
    links: [
      { modelnummer: "222", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44182.pdf" },
      { modelnummer: "212", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44176.pdf" },
      { modelnummer: "195", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44177.pdf" },
      { modelnummer: "194", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44178.pdf" },
      { modelnummer: "190", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44179.pdf" },
    ],
  },
  {
    title: "Wijzigingsoverzichten naar AOV-model 233",
    links: [
      { modelnummer: "223", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44183.pdf" },
      { modelnummer: "215", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44180.pdf" },
    ],
  },
  {
    title: "Wijzigingsoverzichten naar AOV-model 234",
    links: [
      { modelnummer: "224", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44184.pdf" },
      { modelnummer: "216", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44181.pdf" },
    ],
  },
  {
    title: "Wijzigingsoverzichten naar AOV-model 221",
    links: [
      { modelnummer: "211", href: "/api/pod/getpdfbyid?id=16886&name=Wijzigingen%20van%20Model%20211%20naar%20Model%20221.pdf" },
      { modelnummer: "198", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43456_0522.pdf&name=Wijzigingen%20modelnummer%20198" },
      { modelnummer: "193", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43352_0522.pdf&name=Wijzigingen%20modelnummer%20193" },
      { modelnummer: "188", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43359_0522.pdf&name=Wijzigingen%20modelnummer%20188" },
      { modelnummer: "184", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43348_0522.pdf&name=Wijzigingen%20modelnummer%20184" },
      { modelnummer: "183", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43347_0522.pdf&name=Wijzigingen%20modelnummer%20183" },
      { modelnummer: "179", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43346_0522.pdf&name=Wijzigingen%20modelnummer%20179" },
      { modelnummer: "175", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43345_0522.pdf&name=Wijzigingen%20modelnummer%20175" },
      { modelnummer: "168", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43344_0522.pdf&name=Wijzigingen%20modelnummer%20168" },
      { modelnummer: "167", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43343_0522.pdf&name=Wijzigingen%20modelnummer%20167" },
      { modelnummer: "166", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43342_0522.pdf&name=Wijzigingen%20modelnummer%20166" },
      { modelnummer: "164", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43341_0522.pdf&name=Wijzigingen%20modelnummer%20164" },
      { modelnummer: "156", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43340_0522.pdf&name=Wijzigingen%20modelnummer%20156" },
      { modelnummer: "1", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43339_0522.pdf&name=Wijzigingen%20modelnummer%201" },
      { modelnummer: "B64", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43355_0522.pdf&name=Wijzigingen%20modelnummer%20B64" },
      { modelnummer: "F76", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43356_0522.pdf&name=Wijzigingen%20modelnummer%20F76" },
    ],
  },
  {
    title: "Wijzigingsoverzichten naar Flexibele AOV-model 222",
    links: [
      { modelnummer: "212", href: "/api/pod/getpdfbyid?id=16887&name=wijzigingen%20van%20Model%20212%20naar%20Model%20222.pdf" },
      { modelnummer: "195", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43453_0522.pdf&name=Wijzigingen%20modelnummer%20195" },
      { modelnummer: "194", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43353_0522.pdf&name=Wijzigingen%20modelnummer%20194" },
      { modelnummer: "190", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43482_0522.pdf&name=Wijzigingen%20modelnummer%20190" },
      { modelnummer: "187", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43350_0522.pdf&name=Wijzigingen%20modelnummer%20187" },
    ],
  },
  {
    title: "Aegon – volledige AOV en AOV met uitsluiting psychische klachten",
    links: [
      { modelnummer: "1422", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44107.pdf" },
      { modelnummer: "1439", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44107.pdf" },
      { modelnummer: "1449", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44107.pdf" },
      { modelnummer: "1450", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/58204.pdf" },
      { modelnummer: "1475", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/58204.pdf" },
    ],
  },
  {
    title: "Aegon – AOV Ongevallen en ernstige aandoeningen",
    links: [
      { modelnummer: "1422", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44106.pdf" },
      { modelnummer: "1439", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44106.pdf" },
      { modelnummer: "1449", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44106.pdf" },
      { modelnummer: "1450", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44102.pdf" },
      { modelnummer: "1475", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44102.pdf" },
    ],
  },
  {
    title: "Aegon – AOV Ongevallen",
    links: [
      { modelnummer: "1422", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44106.pdf" },
      { modelnummer: "1439", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44106.pdf" },
      { modelnummer: "1449", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44106.pdf" },
      { modelnummer: "1450", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44101.pdf" },
      { modelnummer: "1475", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44101.pdf" },
    ],
  },
  {
    title: "Wijzigingsoverzichten naar AOV 2.5 model 223",
    links: [
      { modelnummer: "215", href: "/api/pod/getpdfbyid?id=16888&name=wijzigingen%20van%20Model%20215%20naar%20Model%20223.pdf" },
      { modelnummer: "196", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43454_0522.pdf&name=Wijzigingen%20modelnummer%20196" },
      { modelnummer: "189", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43351_0522.pdf&name=Wijzigingen%20modelnummer%20189" },
      { modelnummer: "186", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43349_0522.pdf&name=Wijzigingen%20modelnummer%20186" },
    ],
  },
  {
    title: "Wijzigingsoverzichten naar de Langer mee AOV-model 224",
    links: [
      { modelnummer: "216", href: "/api/pod/getpdfbyid?id=16889&name=wijzigingen%20van%20Model%20216%20naar%20Model%20224.pdf" },
      { modelnummer: "197", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43455_0522.pdf&name=Wijzigingen%20modelnummer%20197" },
      { modelnummer: "192", href: "/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/43354_0522.pdf&name=Wijzigingen%20modelnummer%20192" },
    ],
  },
];

/** Alle wijzigingsoverzichten waarin dit modelnummer voorkomt, met de groep ("naar model …") erbij. */
export function wijzigingenVoorModel(modelnummer: string): { groep: string; href: string }[] {
  const gezocht = modelnummer.trim().toUpperCase();
  return WIJZIGINGSOVERZICHTEN_DOCS.flatMap((groep) =>
    groep.links.filter((link) => link.modelnummer.toUpperCase() === gezocht).map((link) => ({ groep: groep.title, href: documentUrl(link.href) })),
  );
}

/** Het modelnummer uit een label als "AOV (model 231)", of null. */
const modelUitLabel = (label: string) => label.match(/\(model ([^)]+)\)/)?.[1] ?? null;

/** Echte PDF van de actuele voorwaarden voor dit modelnummer, of null als dit geen actueel model is (of het document ontbreekt). */
export function actueleDocumentVoorModel(modelnummer: string): string | null {
  const gezocht = modelnummer.trim().toUpperCase();
  const doc = ACTUELE_POLISVOORWAARDEN_DOCS.find((d) => modelUitLabel(d.label)?.toUpperCase() === gezocht);
  return doc && doc.href !== "#" ? documentUrl(doc.href) : null;
}

/** Een modelnummer is bekend als het een actueel model is of in een wijzigingsoverzicht voorkomt. */
export function isBekendModel(modelnummer: string): boolean {
  const gezocht = modelnummer.trim().toUpperCase();
  if (!gezocht) return false;
  return (
    ACTUELE_POLISVOORWAARDEN_DOCS.some((d) => modelUitLabel(d.label)?.toUpperCase() === gezocht) ||
    WIJZIGINGSOVERZICHTEN_DOCS.some((groep) => groep.links.some((link) => link.modelnummer.toUpperCase() === gezocht))
  );
}
