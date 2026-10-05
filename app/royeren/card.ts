/*
 * Vaste kaartbreedte zonder sidebar (zoals Woonverzekeringen), gedeeld door de
 * schermen van de Royeren-funnel. Volledige klassenamen als losse strings, want
 * Tailwind kan geen dynamisch samengestelde klassen (`max-w-[${n}px]`) vinden.
 */
const CARD_BASE = "flex w-full flex-col items-start overflow-hidden rounded-md bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.12)]";

/** Kaart van "Je opzegging" en "Succes" in Figma: 784px. */
export const ROYEREN_CARD_CLASS = `${CARD_BASE} max-w-[784px]`;

/**
 * Kaart van "Bevestigen" in Figma: 763px, smaller dan de andere drie schermen
 * (784px). Letterlijk overgenomen; gebruik `ROYEREN_CARD_CLASS` om gelijk te trekken.
 */
export const ROYEREN_BEVESTIGEN_CARD_CLASS = `${CARD_BASE} max-w-[763px]`;
