import type { ChatSource } from "@/lib/chatPdf";
import { KENNISBANK, NIEUWWAARDE_STANDAARD, NO_CLAIM_LADDER, PRODUCT_BRON, PRODUCT_NAAM, PRODUCT_URL, SCHADEVRIJE_JAREN, type KennisItem, type Product, type Verrijking } from "./index";

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
    .replace(/\+/g, " plus ")
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
/** Voor een taalmodel gaat alleen mee wat minstens zo relevant is als dit deel van de score van het beste onderdeel. */
const CONTEXT_ONDERGRENS = 0.5;
/** Een kort antwoord zonder taalmodel (zie `zoekKortAntwoord`) alleen bij een duidelijke match. */
const KORT_ANTWOORD_MIN_SCORE = 8;
/** Hoeveel gerelateerde onderdelen er per gevonden onderdeel maximaal bijkomen. */
const MAX_GERELATEERD = 2;

const KENNISBANK_GENORMALISEERD = KENNISBANK.map((item) => ({ item, trefwoorden: item.trefwoorden.map((woord) => normaliseer(woord).trim()) }));

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
 * Mensen noemen dingen anders dan de kennisbank ("mijn auto is weg", "ik wil stoppen"). Elke regel herkent zo'n
 * formulering in de genormaliseerde vraag en voegt de woorden toe waar de kennisbank op zoekt; de oorspronkelijke
 * woorden blijven staan. Zo vindt de zoekfunctie ook belangrijke aanvullende voorwaarden (bv. aangifte bij diefstal).
 */
const SYNONIEMEN: [RegExp, string][] = [
  [/\b(gejat|gepikt|gestolen|meegenomen|weggehaald|weggereden|dief)\b/, "gestolen diefstal"],
  [/\b(auto|wagen|bak)\b.{0,25}\b(weg|kwijt|verdwenen|spoorloos)\b/, "gestolen diefstal"],
  [/\b(ingebroken|inbreker|inbraak|opengebroken|geforceerd|ingeslagen|ingegooid|ingetrapt|braak\w*)\b/, "inbraak diefstal"],
  [/\b(stoppen|stopzetten|stop|beeindig\w*|annuleer\w*|opzeg\w*|opgezegd|kappen|afbreken|uitschrijven|overstappen)\b.{0,40}\b(verzekering|polis|autoverzekering|contract)\b|\b(verzekering|polis|autoverzekering|contract)\b.{0,40}\b(stoppen|stopzetten|stop|beeindig\w*|annuleer\w*|opzeg\w*|kappen|afbreken|uitschrijven|overstappen)\b/, "opzeggen opzegging beeindigen"],
  [/\b(schade|claim)\b.{0,15}\b(doorgeven|doorgeef|aanmelden|indienen|claimen|aangeven)\b|\bclaimen\b|\b(geef|geven|geeft|meld|melden)\b.{0,15}\bschade\b.{0,10}\bdoor\b/, "schade melden"],
  [/\b(niet|nooit|vergeten|te laat)\b.{0,15}\b(gemeld|melden|doorgegeven)\b|\bvorig jaar\b.{0,25}\bschade\b/, "schade melden 36 maanden"],
  [/\b(nieuwe auto|auto is nieuw|nieuw gekocht|nieuwprijs|net gekocht|pas gekocht|vers van de dealer)\b/, "nieuwwaarde nieuwwaarderegeling"],
  [/\b(eigen bijdrage|zelf bijbetalen|zelf betalen|excess|franchise)\b/, "eigen risico"],
  [/\b(aangereden|bumper|parkeerschade|gebotst|geschampt|tegen .{0,15} (aan )?gereden)\b/, "aanrijding"],
  [/\b(voorruit|ruit|raam|zonnedak)\b.{0,20}\b(stuk|gebarsten|gescheurd|kapot|gebroken|barst|gesprongen)\b|\bsterretje\b|\bsteenslag\b/, "ruitschade"],
  [/\b(boom|tak|dakpan)\b.{0,15}\b(op|tegen)\b.{0,10}\b(auto|wagen)\b|\bwindvlaag\b|\borkaan\b|\bonweer\b/, "storm"],
  [/\b(start niet|wil niet starten|accu is leeg|accu leeg|stilgevallen|staat stil|lekke band|motor slaat af)\b/, "pech pechhulp"],
  [/\b(in brand|in de fik|vlammen)\b/, "brand"],
  [/\b(vriend|vriendin|buurman|zoon|dochter|broer|zus|kennis|collega|partner)\b.{0,20}\b(rijdt|reed|rijden|geleend|leent|lenen|gereden)\b/, "lenen iemand anders rijden"],
  [/\b(gedronken|dronken|stoned|onder invloed|biertje|wijntje)\b/, "alcohol onder invloed"],
];

function breidUit(genormaliseerd: string): string {
  const toevoegingen = SYNONIEMEN.filter(([patroon]) => patroon.test(genormaliseerd)).map(([, woorden]) => woorden);
  return toevoegingen.length > 0 ? `${genormaliseerd}${toevoegingen.join(" ")} ` : genormaliseerd;
}

/** Rangschikt de onderdelen op hoe goed ze bij de vraag passen; onderdelen van de gekozen dekking krijgen voorrang. */
function rangschik(genormaliseerd: string, producten?: Product[]): { item: KennisItem; score: number }[] {
  const aanvullend = producten?.[producten.length - 1];
  return KENNISBANK_GENORMALISEERD.map(({ item, trefwoorden }) => {
    const basis = score(genormaliseerd, trefwoorden);
    const bonus = basis > 0 && producten && hoortBijDekking(item, producten) ? VOORKEUR_BONUS + (aanvullend && item.artikelen[aanvullend] ? AANVULLEND_BONUS : 0) : 0;
    return { item, basis, score: basis + bonus };
  })
    .filter(({ basis }) => basis >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);
}

export type KennisContext = {
  id: string;
  /** De brontekst van het onderdeel (zie `Verrijking.brontekstSoort`): wat de chat gebruikt om de inhoud te controleren. */
  tekst: string;
  /** De klantvriendelijke laag, als het onderdeel die al heeft. */
  verrijking?: Verrijking;
  /** Waar de tekst staat, bv. "Voorwaarden Autoverzekering Casco Beperkt, D AU-CB 2017-01, 3.1 Gebeurtenis 17 - storm". */
  herkomst: string;
  /** Klopt dit bij de dekking die de klant bekijkt? `false`: het staat in de voorwaarden van een andere dekking. */
  bijGekozenDekking: boolean;
  /** Dit onderdeel komt mee omdat een gevonden onderdeel ernaar verwijst (bv. aangifte bij diefstal), niet omdat het zelf paste. */
  aanvullend: boolean;
  bronnen: ChatSource[];
};

function alsContext(item: KennisItem, producten: Product[] | undefined, aanvullend: boolean): KennisContext {
  const itemBronnen = bronnen(item, producten);
  return {
    id: item.id,
    tekst: item.tekst,
    verrijking: item.verrijking,
    herkomst: itemBronnen.slice(0, 2).map((bron) => bron.title).join("; "),
    bijGekozenDekking: !producten || hoortBijDekking(item, producten),
    aanvullend,
    bronnen: itemBronnen,
  };
}

/**
 * De best passende onderdelen als context voor een taalmodel (zie app/api/chat): de `aantal` beste, en alleen die
 * minstens half zo relevant zijn als de beste. Verwijst een gevonden onderdeel naar andere onderdelen (`gerelateerd`),
 * dan komen die erbij, zodat belangrijke aanvullende voorwaarden niet ontbreken. Een vraag naar een trede, schadevrije
 * jaren of nieuwwaarde in een bepaalde maand levert daarnaast het exacte tabelantwoord, vooraan.
 */
export function zoekContext(vraag: string, { producten }: ZoekOpties = {}, aantal = 3): KennisContext[] {
  const genormaliseerd = breidUit(normaliseer(vraag));
  const context: KennisContext[] = [];

  const tabelAntwoord = antwoordTrede(genormaliseerd) ?? antwoordSchadevrijeJaren(genormaliseerd) ?? antwoordNieuwwaarde(genormaliseerd);
  if (tabelAntwoord) context.push({ id: "tabel", tekst: tabelAntwoord.tekst, herkomst: tabelAntwoord.bronnen.map((bron) => bron.title).join("; "), bijGekozenDekking: true, aanvullend: false, bronnen: tabelAntwoord.bronnen });

  const gerangschikt = rangschik(genormaliseerd, producten);
  const beste = gerangschikt[0]?.score ?? 0;
  const gezien = new Set<string>(context.map((onderdeel) => onderdeel.tekst));
  const gevonden: KennisItem[] = [];
  for (const { item, score: waarde } of gerangschikt) {
    if (context.length >= aantal) break;
    if (waarde < beste * CONTEXT_ONDERGRENS) break;
    // Dezelfde passage in twee documenten hoeft maar één keer mee.
    if (gezien.has(item.tekst)) continue;
    gezien.add(item.tekst);
    gevonden.push(item);
    context.push(alsContext(item, producten, false));
  }

  for (const item of gevonden) {
    let toegevoegd = 0;
    for (const id of item.verrijking?.gerelateerd ?? []) {
      if (toegevoegd >= MAX_GERELATEERD) break;
      const gerelateerd = KENNISBANK.find((kandidaat) => kandidaat.id === id);
      if (!gerelateerd || gezien.has(gerelateerd.tekst) || (producten && !hoortBijDekking(gerelateerd, producten))) continue;
      gezien.add(gerelateerd.tekst);
      context.push(alsContext(gerelateerd, producten, true));
      toegevoegd++;
    }
  }
  return context;
}

/**
 * Een kort, gecontroleerd antwoord zonder taalmodel, voor als het model er niet is. Alleen bij een duidelijke match met
 * een onderdeel dat een gecontroleerde uitleg heeft en bij de gekozen dekking hoort, of bij een tabelvraag (exacte
 * data); anders `null`. De aanroeper zegt dan eerlijk dat de vraag nu niet goed te beantwoorden is, in plaats van een
 * lange voorwaardentekst te tonen.
 */
export function zoekKortAntwoord(vraag: string, { producten }: ZoekOpties = {}): KennisAntwoord | null {
  const genormaliseerd = breidUit(normaliseer(vraag));
  const tabelAntwoord = antwoordTrede(genormaliseerd, producten) ?? antwoordSchadevrijeJaren(genormaliseerd, producten) ?? antwoordNieuwwaarde(genormaliseerd, producten);
  if (tabelAntwoord) return tabelAntwoord;

  const beste = rangschik(genormaliseerd, producten)[0];
  const verrijking = beste?.item.verrijking;
  if (!beste || beste.score < KORT_ANTWOORD_MIN_SCORE || verrijking?.controle.status !== "gecontroleerd") return null;
  if (producten && !hoortBijDekking(beste.item, producten)) return null;
  return { tekst: verrijking.uitleg, bronnen: bronnen(beste.item, producten) };
}
