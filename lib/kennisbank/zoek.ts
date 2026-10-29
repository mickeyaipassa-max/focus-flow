import type { ChatSource } from "@/lib/chatPdf";
import { KENNISBANK, NIEUWWAARDE_STANDAARD, NO_CLAIM_LADDER, PRODUCT_BRON, PRODUCT_NAAM, PRODUCT_URL, SCHADEVRIJE_JAREN, type KennisItem, type Product } from "./index";

export type KennisAntwoord = {
  tekst: string;
  bronnen: ChatSource[];
};

export type ZoekOpties = {
  /**
   * De voorwaarden die bij de gekozen dekking horen (de Algemene voorwaarden gelden altijd). Daar krijgen onderdelen
   * voorrang; komt het antwoord uit een ander document, dan zegt het antwoord dat erbij. Zonder opties zoekt de
   * kennisbank in alle documenten.
   */
  producten?: Product[];
};

/** Kleine letters, zonder accenten en leestekens, zodat "No-claim" en "no claim" (en "w.a.m.") hetzelfde zoeken. */
function normaliseer(tekst: string): string {
  return ` ${tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9€ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/** Een trefwoord telt zo zwaar als het lang is (een zin als "gestolen in het buitenland" wint van "buitenland"), met een plafond. */
const MAX_GEWICHT = 12;
/** Onder deze score is het geen echte match; de chat valt dan eerlijk terug. */
const MIN_SCORE = 4;
/** Een onderdeel van de gekozen dekking wint van een onderdeel van een ander document met (bijna) dezelfde score. */
const VOORKEUR_BONUS = 2;
/** Bij een combinatie (WA + Casco) wint het onderdeel van de aanvullende dekking van dat van de basisdekking, want dat is specifieker. */
const AANVULLEND_BONUS = 1;
/** Een tweede onderdeel krijgt een "Zie ook" als het minstens zo dicht bij het beste onderdeel zit. */
const ZIE_OOK_VERHOUDING = 0.75;

const GENORMALISEERD = KENNISBANK.map((item) => ({ item, trefwoorden: item.trefwoorden.map((woord) => normaliseer(woord).trim()) }));

function productenVan(item: KennisItem): Product[] {
  return Object.keys(item.artikelen) as Product[];
}

function hoortBijDekking(item: KennisItem, producten: Product[]): boolean {
  return productenVan(item).some((product) => product === "algemeen" || producten.includes(product));
}

/** De bronnen van een onderdeel: bij voorkeur de bronnen van de gekozen dekking, anders alle bronnen waarin het staat; plus de links die bij het onderdeel horen. */
function bronnen(item: KennisItem, producten?: Product[]): ChatSource[] {
  const alle = productenVan(item);
  const gekozen = producten ? alle.filter((product) => product === "algemeen" || producten.includes(product)) : alle;
  const bronnen = (gekozen.length > 0 ? gekozen : alle).map((product) => ({ title: `${PRODUCT_BRON[product]}, ${item.artikelen[product]}`, url: PRODUCT_URL[product] }));
  // Heeft het onderdeel eigen links (de PDF's), dan volstaat één pagina als bron en komen die links erbij.
  return item.links ? [...bronnen.slice(0, 1), ...item.links] : bronnen;
}

/** Zegt erbij dat het antwoord uit een ander document komt dan dat van de gekozen dekking. */
function metOpmerking(tekst: string, productenVanAntwoord: Product[], producten?: Product[]): string {
  if (!producten || productenVanAntwoord.some((product) => product === "algemeen" || producten.includes(product))) return tekst;
  const namen = productenVanAntwoord.map((product) => PRODUCT_NAAM[product]).join(" en ");
  return `Let op: dit staat in ${namen} en niet bij jouw gekozen dekking.\n\n${tekst}`;
}

function score(vraag: string, trefwoorden: string[]): number {
  return trefwoorden.reduce((totaal, woord) => (woord && vraag.includes(woord) ? totaal + Math.min(woord.length, MAX_GEWICHT) : totaal), 0);
}

const SCHADES = ["0 schades", "1 schade", "2 schades", "3 schades", "4 of meer schades"];

function procent(waarde: number): string {
  return `${waarde.toFixed(1).replace(".", ",")}%`;
}

/** Vraag naar één trede, bv. "wat is trede 12": de korting en de trede van het volgende jaar uit de no-claimladder (WA 6.1). */
function antwoordTrede(vraag: string, producten?: Product[]): KennisAntwoord | null {
  const treffer = vraag.match(/\btrede (\d{1,2})\b/);
  const rij = treffer && NO_CLAIM_LADDER.find((trede) => trede.trede === Number(treffer[1]));
  if (!rij) return null;
  const vervolg = rij.volgende.map((volgende, index) => `${SCHADES[index]}: trede ${volgende}`).join("; ");
  return {
    tekst: metOpmerking(
      `Op trede ${rij.trede} van de no-claimladder krijg je ${rij.korting} korting op je premie. Je trede in het volgende verzekeringsjaar is bij ${vervolg}. De korting geldt niet voor de premie van de dekking Pechhulp.`,
      ["wa", "casco-allrisk"],
      producten,
    ),
    bronnen: [{ title: `${PRODUCT_BRON.wa}, 6.1 De no-claimladder`, url: PRODUCT_URL.wa }, ...(producten?.includes("casco-allrisk") ? [{ title: `${PRODUCT_BRON["casco-allrisk"]}, 7.1 De no-claimladder`, url: PRODUCT_URL["casco-allrisk"] }] : [])],
  };
}

/** Vraag naar een aantal schadevrije jaren, bv. "12 schadevrije jaren": het aantal volgend jaar uit de tabel in WA 6.2. */
function antwoordSchadevrijeJaren(vraag: string, producten?: Product[]): KennisAntwoord | null {
  const treffer = vraag.match(/\b(\d{1,2}) schadevrije? jaren?\b/);
  if (!treffer) return null;
  const jaren = Number(treffer[1]);
  const rij = SCHADEVRIJE_JAREN.find((tabelrij) => tabelrij.jaren === Math.min(jaren, 16));
  if (!rij) return null;
  // Bij 16 of meer komt er zonder schade 1 jaar bij; bij schade val je altijd terug volgens de tabel.
  const volgende = jaren > 16 ? [jaren + 1, ...rij.volgende.slice(1)] : rij.volgende;
  const vervolg = volgende.map((aantal, index) => `${SCHADES[index]}: ${aantal}`).join("; ");
  return {
    tekst: metOpmerking(`Met ${jaren} schadevrije jaren heb je in het volgende verzekeringsjaar bij ${vervolg} schadevrije jaren.`, ["wa", "casco-allrisk"], producten),
    bronnen: [{ title: `${PRODUCT_BRON.wa}, 6.2 De tabel schadevrije jaren`, url: PRODUCT_URL.wa }, ...(producten?.includes("casco-allrisk") ? [{ title: `${PRODUCT_BRON["casco-allrisk"]}, 7.2 De tabel schadevrije jaren`, url: PRODUCT_URL["casco-allrisk"] }] : [])],
  };
}

/** Vraag naar de nieuwwaarde in een bepaalde maand, bv. "nieuwwaarde 18e maand": de percentages uit de tabel in 4.1 van Casco Beperkt en Casco Allrisk (dezelfde tabel). */
function antwoordNieuwwaarde(vraag: string, producten?: Product[]): KennisAntwoord | null {
  if (!vraag.includes("nieuwwaarde")) return null;
  const treffer = vraag.match(/\b(\d{1,2})e? maand/);
  if (!treffer) return null;
  const maand = Number(treffer[1]);
  if (maand < 1) return null;
  const bron = (["casco-beperkt", "casco-allrisk"] as const)
    .filter((product) => !producten || producten.includes(product))
    .map((product) => ({ title: `${PRODUCT_BRON[product]}, 4.1 Beschadiging of diefstal van de auto`, url: PRODUCT_URL[product] }));
  if (maand > 36) {
    return {
      tekst: metOpmerking(
        `Na de 36e maand na de afgiftedatum is de waarde van de auto de dagwaarde: de verkoopwaarde van de auto net voor de schade.`,
        ["casco-beperkt", "casco-allrisk"],
        producten,
      ),
      bronnen: bron,
    };
  }
  const standaard: [number, number] = maand <= 12 ? [100, 100] : NIEUWWAARDE_STANDAARD[maand - 13];
  const tweeJaar: [number, number] = maand <= 24 ? [100, 100] : NIEUWWAARDE_STANDAARD[maand - 25];
  const regel = (naam: string, [eerste, meerdere]: [number, number]) => `${naam}: ${procent(eerste)} over de eerste € 12.500 van de nieuwwaarde en ${procent(meerdere)} over het meerdere boven € 12.500`;
  return {
    tekst: metOpmerking(
      `Voor een nieuw in Nederland gekochte auto met een cataloguswaarde tot € 80.000 inclusief BTW is de waarde van de auto in de ${maand}e maand na de afgiftedatum bij de standaard nieuwwaarderegeling: ${procent(standaard[0])} over de eerste € 12.500 van de nieuwwaarde en ${procent(standaard[1])} over het meerdere boven € 12.500. ${regel("Met Nieuwwaarde 2 jaar", tweeJaar)}. ${regel("Met Nieuwwaarde 3 jaar", [100, 100])}. Maximaal geldt 110% van de cataloguswaarde op je polisblad.`,
      ["casco-beperkt", "casco-allrisk"],
      producten,
    ),
    bronnen: bron,
  };
}

/**
 * Zoekt het best passende antwoord in de kennisbank (de vier voorwaardendocumenten en de productpagina's op asr.nl). Geen taalmodel: de
 * tekst van het beste onderdeel komt letterlijk terug, met het document en artikel als bron. `null` betekent "daar
 * heb ik niets over", zodat de aanroeper eerlijk kan terugvallen in plaats van iets te verzinnen.
 */
export function zoekInKennisbank(vraag: string, { producten }: ZoekOpties = {}): KennisAntwoord | null {
  const genormaliseerd = normaliseer(vraag);

  const tabelAntwoord = antwoordTrede(genormaliseerd, producten) ?? antwoordSchadevrijeJaren(genormaliseerd, producten) ?? antwoordNieuwwaarde(genormaliseerd, producten);
  if (tabelAntwoord) return tabelAntwoord;

  const gerangschikt = GENORMALISEERD.map(({ item, trefwoorden }) => {
    const basis = score(genormaliseerd, trefwoorden);
    const aanvullend = producten?.[producten.length - 1];
    const bonus = basis > 0 && producten && hoortBijDekking(item, producten) ? VOORKEUR_BONUS + (aanvullend && item.artikelen[aanvullend] ? AANVULLEND_BONUS : 0) : 0;
    return { item, basis, score: basis + bonus };
  })
    .filter(({ basis }) => basis >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);
  const [beste] = gerangschikt;
  if (!beste) return null;

  // Een onderdeel met dezelfde tekst als het beste (zelfde passage in twee documenten) is geen "Zie ook".
  const tweede = gerangschikt.find(({ item }) => item !== beste.item && item.tekst !== beste.item.tekst);
  const zieOok =
    tweede && tweede.score >= beste.score * ZIE_OOK_VERHOUDING
      ? ` Zie ook: ${Object.values(tweede.item.artikelen)[0]} (in ${PRODUCT_NAAM[productenVan(tweede.item)[0]]}).`
      : "";
  return { tekst: metOpmerking(`${beste.item.tekst}${zieOok}`, productenVan(beste.item), producten), bronnen: bronnen(beste.item, producten) };
}
