export type CampaignDef = {
  /** Stabiele URL-vriendelijke sleutel, gebruikt als ?campaign=... waarde. */
  slug: string;
  /** Naam zoals getoond op de tab. */
  label: string;
  /** YYYY-MM-DD — bepaalt de tabvolgorde (nieuwste eerst). */
  sentAt: string;
  /**
   * MailerLite campagne-ID('s) die samen deze ene tab vormen. Meestal één,
   * maar als dezelfde mail naar meerdere lijsten/segmenten apart is
   * verstuurd (zoals de allereerste), horen die ID's bij elkaar en worden
   * ze hier server-side samengevoegd tot één rij per ontvanger.
   */
  mailerliteIds: string[];
};

/**
 * Eén regel per verstuurde campagne. Er hoeft verder niets in de rest van
 * het dashboard aangepast te worden: nieuwe campagne versturen? Voeg hier
 * een object toe met de MailerLite campagne-ID('s) — de tab verschijnt dan
 * vanzelf, als nieuwste vooraan, en telt automatisch mee in "Alle
 * campagnes".
 */
export const CAMPAIGNS: CampaignDef[] = [
  {
    slug: "hoeveel-talent-2026-09-23",
    label: "Hoeveel talent is bij jou al uit beeld?",
    sentAt: "2026-09-23",
    mailerliteIds: ["199395607668851900", "199377868890834346"],
  },
];

/** Campagnes gesorteerd op verzenddatum, nieuwste eerst. */
export function campaignsByRecency(): CampaignDef[] {
  return [...CAMPAIGNS].sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

export function findCampaign(slug: string): CampaignDef | undefined {
  return CAMPAIGNS.find((c) => c.slug === slug);
}
