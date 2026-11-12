import type { RadioCardBottomOption } from "@/components/RadioCardBottom";

/**
 * Inhoud van "Jouw dekking" (stap 2 van 5) van de Autoverzekering-funnel, uit Figma "Untitled"
 * (6pTuBCHupEW7rq3Ir4mJow), sectie "JOUW DEKKING" (node 135:22205). Alle teksten staan hier letterlijk
 * zoals in Figma.
 */

export const AUTO_STEPS = ["Jouw situatie", "Jouw dekking", "Jouw gegevens", "Laatste vragen", "Samenvatting"];

export type DekkingKeuze = "wa" | "wa-casco-beperkt" | "wa-casco-allrisk";

/** Bedragen in eurocenten, zodat optellen geen afrondingsfouten geeft. */
export const DEKKING_PRIJS_CENTEN: Record<DekkingKeuze, number> = {
  wa: 6876,
  "wa-casco-beperkt": 7565,
  "wa-casco-allrisk": 11677,
};

export const DEKKING_TITEL: Record<DekkingKeuze, string> = {
  wa: "WA",
  "wa-casco-beperkt": "WA + Casco beperkt",
  "wa-casco-allrisk": "WA + Casco allrisk",
};

export const DEKKING_OPTIONS: RadioCardBottomOption[] = [
  {
    value: "wa",
    title: "WA",
    price: "68,76",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: false },
      { text: "Ruitschade", included: false },
      { text: "Diefstal", included: false },
      { text: "Schade door aanrijding en andere schades", included: false },
    ],
  },
  {
    value: "wa-casco-beperkt",
    title: "WA + Casco beperkt",
    price: "75,65",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Diefstal", included: true },
      { text: "Schade door aanrijding en andere schades", included: false },
    ],
  },
  {
    value: "wa-casco-allrisk",
    title: "WA + Casco allrisk",
    price: "116,77",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Diefstal", included: true },
      { text: "Schade door aanrijding en andere schades", included: true },
    ],
  },
];

export const EIGEN_RISICO_OPTIONS: RadioCardBottomOption[] = ["0", "150", "250", "500"].map((bedrag) => ({
  value: bedrag,
  title: `€ ${bedrag}`,
}));

export const EIGEN_RISICO_UITLEG =
  "Dit is het bedrag dat wij aftrekken van een schadevergoeding. Hoe hoger je eigen risico, hoe minder je per maand betaalt.";

export type ExtraKeuze = "schade-inzittenden" | "rechtsbijstand" | "pechhulp" | "extras-boven-1000";

export const EXTRA_DEKKINGEN: { value: ExtraKeuze; title: string; description: string; price: string; centen: number }[] = [
  {
    value: "schade-inzittenden",
    title: "Schade inzittenden",
    description: "Passagiers en bestuurder verzekerd voor letsel en schade na een ongeval.",
    price: "5,22",
    centen: 522,
  },
  {
    value: "rechtsbijstand",
    // Figma's kaart schrijft hier "motorijtuigen"; de dialog in hetzelfde ontwerp "motorrijtuigen". Hier de juiste spelling.
    title: "Rechtsbijstand motorrijtuigen",
    description: "Juridische hulp bij conflicten in het verkeer met je auto.",
    price: "5,28",
    centen: 528,
  },
  {
    value: "pechhulp",
    title: "Pechhulp",
    description: "De a.s.r. Alarmcentrale staat voor je klaar als je niet verder kan rijden door pech.",
    price: "6,16",
    centen: 616,
  },
  {
    value: "extras-boven-1000",
    title: "Extra's boven € 1000",
    description: "Dekking voor later ingebouwde extra’s zoals een geluidssysteem.",
    price: "2,61",
    centen: 261,
  },
];

export function formatCenten(centen: number): string {
  return `€ ${(centen / 100).toFixed(2).replace(".", ",")}`;
}

/** dd-mm-jjjj, zoals Figma de datums toont. */
export function formatDatum(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

export function plusJaren(date: Date, jaren: number): Date {
  return new Date(date.getFullYear() + jaren, date.getMonth(), date.getDate());
}

export const NIEUWWAARDE_UITLEG =
  "Je krijgt bij ons standaard het eerste jaar de nieuwwaarde vergoed bij diefstal of total loss. Dit is het bedrag waarmee je dezelfde auto nieuw kunt kopen. Met de nieuwwaarderegeling kun je dit verlengen tot 2 of 3 jaar.";

export const AANKOOPWAARDE_UITLEG =
  "Als je auto gestolen wordt of total loss raakt, dan krijg je standaard de dagwaarde van je auto vergoed. Dat is het bedrag dat je auto op dat moment waard is. Wil je in plaats van de dagwaarde het aankoopbedrag vergoed krijgen? Kies dan voor de aankoopwaarderegeling.";

export const PREMIE_UITLEG_TITEL = "Wat bepaalt je premie?";
export const PREMIE_UITLEG =
  "De premie voor je autoverzekering komt tot stand op basis van verschillende factoren. Zo bepalen o.a. het gewicht van je auto, de te rijden kilometers per jaar, de regio waar je woont en het aantal schadevrije jaren de premie van je verzekering. Tenslotte laten wij ook de tarieven van andere verzekeringsmaatschappijen meewegen om de uiteindelijke premie te bepalen. Hierdoor kunnen we onze premieberekeningen aanpassen naar de marktomstandigheden.";

/* ---------- Teksten van de "Meer informatie"-dialogs ---------- */

export type DekkingBlok = { kop: string; bullets: string[] };

const SCHADE_ANDEREN: DekkingBlok = {
  kop: "Schade aan anderen",
  bullets: [
    "Schade die door of met je auto aan anderen wordt veroorzaakt.",
    "Schade door of met je auto veroorzaakt aan een andere auto of aanhanger van jezelf.",
  ],
};
const BRAND_STORM: DekkingBlok = {
  kop: "Schade aan je auto door brand, storm en natuur",
  bullets: [
    "Schade door brand, ontploffing, blikseminslag, zelfontbranding en kortsluiting.",
    "Schade als (direct gevolg van) storm, aardbeving, hagel, lawine, overstroming etc.",
  ],
};
const RUITSCHADE: DekkingBlok = {
  kop: "Ruitschade",
  bullets: [
    "Schade aan je autoruit door bijvoorbeeld een steentje of een voorwerp op de weg",
    "Schade aan je zonnedak door bijvoorbeeld een steentje of een voorwerp op de weg",
  ],
};
const DIEFSTAL: DekkingBlok = {
  kop: "Diefstal",
  bullets: [
    "Schade door (poging tot) diefstal, oplichting en verduistering.",
    "Schade door (poging tot) joyriding.",
    "Schade door (poging tot) inbraak.",
  ],
};
const AANRIJDING: DekkingBlok = {
  kop: "Schade aan je auto door aanrijding en overige schade",
  bullets: [
    "Schade door aanrijding, een botsing of van de weg raken.",
    "Schade door een oorzaak van buitenaf die niet onder WA + Casco Beperkt genoemd is.",
  ],
};

export type DekkingInfo = {
  /** Eén of twee koppen: "Wat is verzekerd met …?" en daaronder soms "Wat is niet verzekerd met …?". */
  delen: { titel: string; blokken: DekkingBlok[] }[];
  pdf: { naam: string; href: string };
};

export const DEKKING_INFO: Record<DekkingKeuze, DekkingInfo> = {
  wa: {
    delen: [
      { titel: "Wat is verzekerd met WA?", blokken: [SCHADE_ANDEREN] },
      { titel: "Wat is niet verzekerd met WA?", blokken: [BRAND_STORM, RUITSCHADE, DIEFSTAL, AANRIJDING] },
    ],
    pdf: {
      naam: "Polisvoorwaarden a.s.r. IKZ Voorwaarden Auto Wettelijke Aansprakelijkheid",
      href: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57654.pdf",
    },
  },
  "wa-casco-beperkt": {
    delen: [
      { titel: "Wat is verzekerd met WA + Casco beperkt?", blokken: [SCHADE_ANDEREN, BRAND_STORM, RUITSCHADE, DIEFSTAL] },
      { titel: "Wat is niet verzekerd met WA + Casco beperkt?", blokken: [AANRIJDING] },
    ],
    pdf: {
      naam: "Polisvoorwaarden a.s.r. IKZ Voorwaarden Auto Casco Beperkt",
      href: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57653.pdf",
    },
  },
  "wa-casco-allrisk": {
    delen: [
      { titel: "Wat is verzekerd met WA + Casco allrisk?", blokken: [SCHADE_ANDEREN, BRAND_STORM, RUITSCHADE, DIEFSTAL, AANRIJDING] },
    ],
    pdf: {
      naam: "Polisvoorwaarden a.s.r. IKZ Voorwaarden Auto Casco Allrisk",
      href: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57652.pdf",
    },
  },
};

export type ExtraInfo = {
  titel: string;
  intro?: string;
  vinkjes: string[];
  outro?: string;
  /** "tekst" = grijs vak met uitleg; "pdf" = vak met uitleg + bestandslink; "verwijzing" = tekst met links naar Casco-voorwaarden. */
  vak:
    | { soort: "pdf"; tekst: string; bestand: string }
    | { soort: "verwijzing"; voor: string; links: string[]; na: string };
};

export const EXTRA_INFO: Record<ExtraKeuze, ExtraInfo> = {
  "schade-inzittenden": {
    titel: "Wat is verzekerd met Schade inzittenden",
    intro: "Schade (ook eventueel smartengeld) die inzittenden in je auto lijden door een verkeersongeval, zoals:",
    vinkjes: ["Schade aan personen", "Schade aan spullen"],
    outro: "We vergoeden alle schade zoals die volgens de wet verhaald kan worden op iemand die aansprakelijk is. Ook als er niemand aansprakelijk is.",
    vak: {
      soort: "pdf",
      tekst: "Wil je weten waar je precies voor verzekerd bent? Lees de a.s.r. IKZ Voorwaarden Schade Inzittenden.",
      bestand: " IKZ Voorwaarden Schade Inzittenden",
    },
  },
  rechtsbijstand: {
    titel: "Wat is verzekerd met Rechtsbijstand motorrijtuigen",
    intro: "Rechtsbijstand via ons door DAS Nederlandse Rechtsbijstand Verzekeringmaatschappij N.V bij:",
    vinkjes: [
      "Het verhalen van letsel- en/of materiële schade, die is ontstaan door deelname met je auto aan het verkeer",
      "Geschillen ontstaan bij de aankoop, verkoop of onderhoud/reparatie van je auto",
      "Strafzaken in verband met deelname met je auto aan het verkeer",
    ],
    vak: {
      soort: "pdf",
      tekst: "Wil je weten waar je precies voor verzekerd bent? Lees de a.s.r. IKZ Voorwaarden Rechtsbijstand Motorrijtuigen.",
      bestand: "IKZ Voorwaarden Rechtsbijstand Motorrijtuigen ",
    },
  },
  pechhulp: {
    titel: "Wat is verzekerd met Pechhulp",
    vinkjes: [
      "Reparatie ter plaatse",
      "In heel Europao ook in je eigen woonplaats",
      "Vervoer van je auto en passagiers als reparatie niet direct mogelijk is",
      "Huur van een vervangende auto",
    ],
    vak: {
      soort: "verwijzing",
      voor: "De voorwaarden van de aanvullende dekking Pechhulp zijn in de voorwaarden van ",
      links: ["Casco Beperkt", "Casco Allrisk"],
      na: " opgenomen.",
    },
  },
  "extras-boven-1000": {
    titel: "Wat is verzekerd met Extra's boven € 1.000",
    intro: "Schade aan alles wat niet in de fabriek maar later is ingebouwd, en wat niet in de catalogusprijs van de auto zit of zat, zoals:",
    vinkjes: ["Navigatiesysteem", "Geluidsinstallatie", "LPG-installatie"],
    outro:
      "We vergoeden maximaal € 2.500 bovenop de standaarddekking van € 1.000. Dus maximaal € 3.500. Maar voor beeld-, geluids- en navigatieapparatuur krijg je nooit meer dan € 500. Dit geldt ook voor de standaarddekking.",
    vak: {
      soort: "verwijzing",
      voor: "De voorwaarden van de aanvullende dekking Extra's boven € 1.000 zijn in de voorwaarden van ",
      links: ["Casco Allrisk"],
      na: " opgenomen.",
    },
  },
};

/* ---------- Variant /RVD2 (Figma node 144:30187) ---------- */

/** Zelfde kaarten, maar zonder "Diefstal"-regel en met de badge "Meest gekozen" op WA + Casco beperkt. */
export const DEKKING_OPTIONS_V2: RadioCardBottomOption[] = DEKKING_OPTIONS.map((option) => ({
  ...option,
  features: option.features?.filter((feature) => feature.text !== "Diefstal"),
  highlightLines: option.value === "wa-casco-beperkt" ? ["Meest gekozen"] : undefined,
}));

/** De dropdown-opties staan niet in Figma; hier dezelfde bedragen als de kaarten op /RVD. */
export const EIGEN_RISICO_SELECT_OPTIONS = ["0", "150", "250", "500"].map((bedrag) => ({ value: bedrag, label: `€ ${bedrag}` }));

export const NIEUWWAARDE_DIALOG_TITEL = "Nieuwwaarderegeling";
export const NIEUWWAARDE_DIALOG_TEKST =
  "Ben je de eerste eigenaar van een auto van maximaal 1 jaar oud? \nMet onze Cascodekking krijg je standaard 1 jaar de nieuwwaarde vergoed bij diefstal of total loss. Dit is het bedrag waarmee je dezelfde auto nieuw kunt kopen. \n\nMet de nieuwwaarderegeling kun je dit verlengen tot 2 of 3 jaar.";
