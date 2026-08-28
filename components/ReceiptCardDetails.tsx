import type { ComponentProps } from "react";
import { Receipt } from "./Receipt";

type ReceiptCardDetailsProps = Omit<ComponentProps<typeof Receipt>, "type">;

/**
 * Gebaseerd op Figma's "Receipt Card Details" (node 11521:165163, BETA,
 * "Components"-bibliotheek) — bevestigd via een aparte fetch: qua header,
 * groepen/rijen en groene samenvatting exact hetzelfde "Receipt Section" +
 * "Receipt Summary" als Receipt Box, alleen de buitenste kaart-chrome
 * verschilt (rand + p-6 i.p.v. schaduw + p-4, dezelfde `bordered`-stijl als
 * CardDetails.tsx). Vandaar een dunne wrapper om Receipt i.p.v. de
 * groep/rij-opbouw te dupliceren — geen apart onderdeel gevonden dat hier
 * niet al 1-op-1 hetzelfde was.
 *
 * Figma's eigen beschrijving: "gebruikt op de overzichtspagina om een
 * duidelijk, compleet overzicht te tonen — gebruikt geen accordions, alles
 * is direct zichtbaar" — dus altijd `type="one-section"`, nooit collapsable.
 */
export function ReceiptCardDetails({ className, ...props }: ReceiptCardDetailsProps) {
  return (
    <Receipt
      {...props}
      type="one-section"
      className={className ?? "flex w-full flex-col items-start gap-4 rounded-[3px] border border-[#ccc] bg-white p-6"}
    />
  );
}
