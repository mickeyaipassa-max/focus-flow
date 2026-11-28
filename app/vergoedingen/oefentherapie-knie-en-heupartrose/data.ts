/**
 * Inhoud van Figma "Vergoedingenvinder — desktop 1440" (node 4:1437) en "— mobiel 375" (node 7:515), letterlijk overgenomen.
 * Figma toont op desktop alleen de uitkomst van Basisverzekering; de teksten per aanvullende verzekering staan in het
 * mobiele frame. Desktop gebruikt die voor de andere tabs (zelfde indeling als bij Basisverzekering).
 */

export type Verzekering = {
  naam: string;
  /** Hoe de naam in "Je hebt gekozen voor …" staat (Figma: "basisverzekering" in kleine letters). */
  keuze: string;
  vergoeding: boolean;
  punten: string[];
  /** Infoblok (Alert type info) bij de aanvullende verzekeringen die niet meer of alleen via een werkgever af te sluiten zijn. */
  info?: string;
};

const NA_BASIS = "Is er geen vergoeding meer mogelijk vanuit de basisverzekering? Dan krijg je per jaar maximaal";
const EIGEN_BIJDRAGE =
  "Voor de eerste 9 behandelingen vergoed vanuit deze aanvullende verzekering geldt geen eigen bijdrage. Voor de 10e t/m de 12e behandeling geldt een eigen bijdrage van €5 per behandeling.";
const WERKGEVER = (naam: string) =>
  `De aanvullende verzekering ${naam} is alleen af te sluiten met een werkgeverscollectief. Als je deze verzekering al hebt dan behoud je deze totdat je opzegt of een andere aanvullende verzekering kiest.`;

export const VERZEKERINGEN: Verzekering[] = [
  {
    naam: "Basisverzekering",
    keuze: "basisverzekering",
    vergoeding: true,
    punten: [
      "Bij knie- en heupartrose krijg je maximaal 12 behandelingen oefentherapie gedurende 12 maanden vergoed. De eerste 12 behandelingen worden vanuit je basisverzekering vergoed.",
      "Vanaf de 13e behandeling kunnen de kosten uit de aanvullende verzekering vergoed worden. Kijk hiervoor bij jouw aanvullende verzekering.",
    ],
  },
  { naam: "ZorgInstap", keuze: "ZorgInstap", vergoeding: false, punten: [] },
  { naam: "ZorgBasis", keuze: "ZorgBasis", vergoeding: true, punten: [`${NA_BASIS} 3 behandelingen vergoed vanuit je aanvullende verzekering.`] },
  { naam: "ZorgBewust", keuze: "ZorgBewust", vergoeding: true, punten: [`${NA_BASIS} 6 behandelingen vergoed vanuit je aanvullende verzekering.`] },
  { naam: "ZorgGoed", keuze: "ZorgGoed", vergoeding: true, punten: [`${NA_BASIS} 9 behandelingen vergoed vanuit je aanvullende verzekering.`] },
  {
    naam: "ZorgBeter",
    keuze: "ZorgBeter",
    vergoeding: true,
    punten: [`${NA_BASIS} 12 behandelingen vergoed vanuit je aanvullende verzekering.`, EIGEN_BIJDRAGE],
  },
  {
    naam: "ZorgBest",
    keuze: "ZorgBest",
    vergoeding: true,
    punten: [`${NA_BASIS} 12 behandelingen vergoed vanuit je aanvullende verzekering.`, EIGEN_BIJDRAGE],
  },
  {
    naam: "Aanvulling Start",
    keuze: "Aanvulling Start",
    vergoeding: true,
    punten: [`${NA_BASIS} 9 behandelingen vergoed vanuit je aanvullende verzekering.`],
    info: WERKGEVER("Aanvulling Start"),
  },
  {
    naam: "Aanvulling Extra",
    keuze: "Aanvulling Extra",
    vergoeding: true,
    punten: [`${NA_BASIS} 15 behandelingen vergoed vanuit je aanvullende verzekering, waarvan maximaal 12 behandelingen manuele therapie.`],
    info: WERKGEVER("Aanvulling Extra"),
  },
  {
    naam: "Aanvulling Uitgebreid",
    keuze: "Aanvulling Uitgebreid",
    vergoeding: true,
    punten: [`${NA_BASIS} 21 behandelingen vergoed vanuit je aanvullende verzekering, waarvan maximaal 12 behandelingen manuele therapie.`],
    info: WERKGEVER("Aanvulling Uitgebreid"),
  },
  {
    naam: "Aanvulling Optimaal",
    keuze: "Aanvulling Optimaal",
    vergoeding: true,
    punten: [`${NA_BASIS} 36 behandelingen vergoed vanuit je aanvullende verzekering, waarvan maximaal 12 behandelingen manuele therapie.`],
    info: "De aanvullende verzekering Aanvulling Optimaal is niet meer af te sluiten. Als je deze verzekering al hebt dan behoud je deze totdat je opzegt of een andere aanvullende verzekering kiest.",
  },
];

export const VOORWAARDEN = [
  "Je hebt een chronische indicatie van je huisarts of medisch specialist.",
  "Je wordt gescreend en behandeld door een fysiotherapeut, psychosomatisch fysiotherapeut, (psychosomatisch) oefentherapeut Cesar of Mensendieck, bekkenfysiotherapeut, oedeemtherapeut, manueel therapeut of geriatrisch fysiotherapeut.",
];
