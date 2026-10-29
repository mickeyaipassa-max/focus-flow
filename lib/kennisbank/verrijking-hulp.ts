import type { Verrijking } from "./types";

/** Hulpfuncties voor de bestanden met de klantvriendelijke laag (verrijking-*.ts). */

/** Een `Verrijking` met de gebruikelijke standaardwaarden: bijna-letterlijke brontekst, gecontroleerd, geen extra punten. */
export const b = (x: Partial<Verrijking> & Pick<Verrijking, "uitleg">): Verrijking => ({
  brontekstSoort: "bijna-letterlijk",
  direct: [],
  aandachtspunten: [],
  klantinfo: [],
  vervolgvragen: [],
  controle: { status: "gecontroleerd" },
  ...x,
});

/** Een vervolgvraag: de vraag die past als de gegeven informatie ontbreekt. */
export const q = (als: string, vraag: string) => ({ als, vraag });

/** Controlestatus voor een blok dat een mens moet nakijken. */
export const HANDMATIG = (opmerking: string) => ({ status: "handmatig-controleren" as const, opmerking });
