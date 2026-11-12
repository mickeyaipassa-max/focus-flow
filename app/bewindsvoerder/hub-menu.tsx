"use client";

import { useRef, useState } from "react";
import { CardContact, CardContactCollage } from "@/components/CardContact";
import { Dialog } from "@/components/Dialog";
import { TileMenu, type TileMenuItem } from "@/components/TileMenu";
import { ROUTES } from "./routes";

/*
 * Tile Menu van de Service hub (Figma "Tile Menu" naast het template: node 14160:3884 en 14160:3974, twee kolommen).
 * "Voor een Schadeverzekering" onder "Betalingsregeling aanvragen" opent de Dialog uit node 14180:30215 (size MD, 792px):
 * titel, twee alinea's, een Card Contact Collage met Telefoon en E-mail, en de knop "Sluiten". Teksten letterlijk uit Figma;
 * het telefoonnummer is daar een placeholder en het e-mailadres ontbreekt (link staat op `#`).
 */

// Figma legt de rand van de collage binnen de 24px padding van de kaarten: 23px + 1px rand.
const KAART_KLASSE = "flex min-w-px flex-1 flex-col items-start gap-8 self-stretch bg-white p-[23px]";

const BETALINGSREGELING_SCHADE =
  "Wil je een betalingsregeling aanvragen voor je schadeverzekering? Dat kan niet online. Neem hiervoor contact met ons op.\n\nBel ons of stuur een e-mail via de contactgegevens hieronder. Samen bekijken we welke mogelijkheden er zijn voor een betalingsregeling.";

export function HubMenu() {
  const [dialogOpen, setDialogOpen] = useState(false);
  // De Dialog heeft geen eigen focusherstel: zet de focus na sluiten terug op de menuregel die hem opende.
  const trigger = useRef<HTMLElement | null>(null);

  function openen() {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDialogOpen(true);
  }

  function sluiten() {
    setDialogOpen(false);
    trigger.current?.focus();
  }

  const items: TileMenuItem[] = [
    {
      label: "Aanmelden als bewindvoerder",
      pictogram: "/bewindsvoerder/pictogram-persoon-man.svg",
      // Geen diepere lagen: gaat direct naar de funnel, zonder chevron.
      href: ROUTES.bewindvoerder,
    },
    {
      label: "Betalingsregeling aanvragen",
      pictogram: "/bewindsvoerder/pictogram-muntgeld-euro.svg",
      // Figma: de drie "???" zijn placeholders en staan er letterlijk zo.
      children: [
        { label: "Voor een Zorgverzekering", href: "#" },
        { label: "Voor een Schadeverzekering", onClick: openen },
        { label: "Voor een Reisverzekering", href: "#" },
        { label: "Voor een Hypotheek", href: "#" },
        { label: "???", href: "#" },
        { label: "???", href: "#" },
        { label: "???", href: "#" },
      ],
    },
    { label: "Betalingensachterstand opvragen", pictogram: "/bewindsvoerder/pictogram-geld-en-mensen.svg", href: "#", toonChevron: true },
    { label: "Polis opvragen", pictogram: "/bewindsvoerder/pictogram-polisblad.svg", href: "#", toonChevron: true },
    { label: "Bewindvoering beëindigen", pictogram: "/bewindsvoerder/pictogram-hand-zwaaien.svg", href: "#", toonChevron: true },
    { label: "Situatie van het eigen risico opvragen", pictogram: "/bewindsvoerder/pictogram-euroteken.svg", href: "#", toonChevron: true },
  ];

  return (
    <>
      <TileMenu label="Wat wil je regelen?" items={items} kolommen={2} className="w-full" />
      <Dialog
        open={dialogOpen}
        onClose={sluiten}
        title="Betalingsregeling voor je schadeverzekering"
        size="md"
        actions={[{ label: "Sluiten", variant: "primary", onClick: sluiten }]}
        slot={
          <CardContactCollage>
            <CardContact
              title="Telefoon"
              availability="Mogelijk moet je even wachten"
              actionIcon="phone"
              actionLabel="(0800) 00 00 000"
              actionHref="tel:0800000000"
              footerText="Werkdagen 08.30 – 17.30 uur"
              footerInSection
              className={KAART_KLASSE}
            />
            <CardContact title="E-mail" availability="Binnen 10 werkdagen antwoord" actionIcon="mail" actionLabel="Stuur een e-mail" actionHref="#" className={KAART_KLASSE} />
          </CardContactCollage>
        }
      >
        <p className="whitespace-pre-line">{BETALINGSREGELING_SCHADE}</p>
      </Dialog>
    </>
  );
}
