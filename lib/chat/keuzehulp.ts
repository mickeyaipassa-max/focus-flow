/**
 * De keuzehulp op /workshop: de chat die opent via "Hulp nodig?" bij "Kies je basisdekking". De chat begint met een vaste
 * openingsvraag en vier klikbare antwoorden (tags). Elk antwoord krijgt een vast antwoord zonder aanroep van het taalmodel;
 * daarna neemt het taalmodel het gesprek over (app/api/chat, met `keuzehulp: true`).
 *
 * De antwoorden zijn gecontroleerd tegen de kennisbank (zie docs/keuzehulp-controle.md en
 * scripts/test-keuzehulp.mts). Wijzig je een antwoord, draai dan die test opnieuw.
 */

import { zoekContext, type KennisContext, type ZoekOpties } from "@/lib/kennisbank/zoek";

/** Een bericht korter dan dit aantal woorden ("en bij allrisk?") zoekt ook op de vraag ervoor. */
export const KORTE_VRAAG_WOORDEN = 7;

export const KEUZEHULP_OPENING = "Ik help je graag kiezen! 😊\nWat vind je belangrijk bij je autoverzekering?";

export type KeuzehulpTag = {
  /** Wat op de tag staat en als bericht van de klant in het gesprek komt. */
  label: string;
  /** Het vaste antwoord van de chat. */
  antwoord: string;
  /**
   * Zoektermen voor het vervolggesprek: antwoordt de klant kort ("5 jaar", "ja"), dan zoekt de route ook op dit onderwerp, anders
   * vindt een kort antwoord geen passend onderdeel in de kennisbank.
   */
  zoektermen: string;
};

export const KEUZEHULP_TAGS: KeuzehulpTag[] = [
  {
    label: "Vooral een lage premie",
    antwoord:
      "Dan is WA vaak de voordeligste keuze. Daarmee verzeker je schade die je met je auto bij anderen veroorzaakt. Vind je het belangrijk dat diefstal en ruitschade ook verzekerd zijn?",
    zoektermen: "welke dekking WA + Casco beperkt verschil dekkingen vergelijken wat is verzekerd met WA",
  },
  {
    label: "Ook mijn eigen auto verzekeren",
    antwoord:
      "Dan kijken we naar WA + Casco beperkt en WA + Casco allrisk. Welke dekking past, hangt af van je auto en welke schades je wilt verzekeren. Hoe oud is je auto?",
    zoektermen: "welke dekking WA + Casco beperkt allrisk verschil dekkingen vergelijken hoe oud moet mijn auto zijn",
  },
  {
    label: "Dat weet ik nog niet",
    antwoord: "Geen probleem, we kijken er samen naar. Hoe oud is je auto?",
    zoektermen: "welke dekking WA + Casco beperkt allrisk verschil dekkingen vergelijken hoe oud moet mijn auto zijn",
  },
  {
    label: "Ik heb een andere vraag",
    antwoord: "Natuurlijk! Waar kan ik je mee helpen?",
    zoektermen: "",
  },
];

export const keuzehulpTag = (label: string): KeuzehulpTag | undefined => KEUZEHULP_TAGS.find((tag) => tag.label === label);

/**
 * De zoektermen van de tag die de klant eerder in dit gesprek koos (de eerste klantbericht-tag), of "" als er geen is.
 * Alleen voor `keuzehulpContext`.
 */
export function zoektermenVanGesprek(klantBerichten: string[]): string {
  for (const bericht of klantBerichten) {
    const tag = keuzehulpTag(bericht);
    if (tag) return tag.zoektermen;
  }
  return "";
}

/**
 * De kennisbankonderdelen voor het laatste klantbericht in de keuzehulp. Eerst zoeken we op het bericht zelf (met de vraag ervoor als het kort
 * is, behalve als die vraag een tag was). Een eigen vraag als "Wat betekent eigen risico?" vindt zo zijn eigen onderdelen. Vindt dat niets, zoals
 * bij een kort antwoord ("5 jaar", "ja"), dan zoeken we ook op het onderwerp van de tag die de klant koos. Andersom (altijd de tagtermen erbij) werd
 * een korte eigen vraag overstemd door die termen.
 */
export function keuzehulpContext(klantBerichten: string[], opties: ZoekOpties, aantal: number): KennisContext[] {
  const laatste = klantBerichten[klantBerichten.length - 1] ?? "";
  const vorige = klantBerichten.length > 1 ? klantBerichten[klantBerichten.length - 2] : "";
  const kort = laatste.split(/\s+/).length < KORTE_VRAAG_WOORDEN;
  const vorigeOnderwerp = keuzehulpTag(vorige) ? "" : vorige;
  const vraag = kort && vorigeOnderwerp ? `${vorigeOnderwerp} ${laatste}` : laatste;
  const context = zoekContext(vraag, opties, aantal);
  if (context.length > 0 || !kort) return context;
  const zoektermen = zoektermenVanGesprek(klantBerichten);
  return zoektermen ? zoekContext(`${zoektermen} ${vraag}`, opties, aantal) : context;
}
