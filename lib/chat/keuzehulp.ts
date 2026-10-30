/**
 * De keuzehulp op /workshop: de chat die opent via "Hulp nodig?" bij "Kies je basisdekking". De chat begint met een vaste
 * openingsvraag en vier klikbare antwoorden (tags). Elk antwoord krijgt een vast antwoord zonder aanroep van het taalmodel;
 * daarna neemt het taalmodel het gesprek over (app/api/chat, met `keuzehulp: true`).
 *
 * De antwoorden zijn gecontroleerd tegen de kennisbank (zie docs/keuzehulp-controle.md en
 * scripts/test-keuzehulp.mts). Wijzig je een antwoord, draai dan die test opnieuw.
 */

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
 * Alleen voor de route: die zoekt er extra mee bij een kort antwoord.
 */
export function zoektermenVanGesprek(klantBerichten: string[]): string {
  for (const bericht of klantBerichten) {
    const tag = keuzehulpTag(bericht);
    if (tag) return tag.zoektermen;
  }
  return "";
}
