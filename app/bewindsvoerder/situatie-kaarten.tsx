"use client";

import { useRef, useState } from "react";
import { CardGraphic } from "@/components/CardGraphic";
import { Dialog } from "@/components/Dialog";

/*
 * "Veel voorkomende situaties" op de Service hub (Figma "Service hub page master template [DESKTOP]", node 14150:28464).
 * Elke kaart (pictogram, titel, knop "Meer info") opent een Dialog (size MD, 792px) met drie alinea's en de knop "Begrepen";
 * Figma-nodes 14175:1184, 14176:1192, 14176:1214 en 14176:1236. De alinea's staan als één tekst met lege regels ertussen,
 * zoals in de Figma-tekstlaag (`whitespace-pre-line`). Teksten letterlijk uit Figma.
 */

const SITUATIES = [
  {
    pictogram: "/bewindsvoerder/pictogram-muntgeld-euro.svg",
    title: "Mijn cliënt heeft een betalingsachterstand",
    tekst:
      "Een betalingsachterstand ontstaat als een rekening niet op tijd is betaald. Door op tijd in actie te komen, kun je helpen voorkomen dat de schuld en eventuele extra kosten oplopen.\n\nBekijk samen met je cliënt welke rekeningen nog openstaan en wat je cliënt kan betalen. Neem contact op met de schuldeiser om de mogelijkheden voor een betalingsregeling te bespreken.\n\nLukt betalen niet of zijn er meerdere schulden? De gemeente kan informatie geven over schuldhulpverlening. Bespreek met je cliënt welke hulp nodig is en vraag toestemming voordat je namens je cliënt gegevens deelt.",
  },
  {
    pictogram: "/bewindsvoerder/pictogram-hand-schudden.svg",
    title: "Ik neem de bewindvoering van een cliënt over",
    tekst:
      "Neem je de bewindvoering over van een andere bewindvoerder? Geef de wijziging dan door aan a.s.r., zodat duidelijk is wie de financiële zaken van je cliënt regelt.\n\nHoud de gegevens van je cliënt, je eigen contactgegevens en de ingangsdatum bij de hand. Met de beschikking van de rechtbank kun je aantonen dat je als bewindvoerder bent aangesteld. Vraag bij a.s.r. na welke gegevens en documenten nodig zijn en hoe je die veilig kunt aanleveren.\n\nStem met de vorige bewindvoerder af welke rekeningen nog openstaan en welke afspraken er lopen. Zo houd je overzicht tijdens de overdracht.",
  },
  {
    pictogram: "/bewindsvoerder/pictogram-bel.svg",
    title: "Ik herken een rekening van mijn cliënt niet",
    tekst:
      "Weet je niet waarvoor een rekening is? Controleer eerst de naam van de afzender, het betalingskenmerk, het bedrag en de periode waarop de rekening betrekking heeft. Vergelijk deze gegevens met de verzekering en eerdere betalingen van je cliënt.\n\nBlijft het onduidelijk? Neem contact op met a.s.r. via de contactgegevens op de officiële website. Houd de rekening en het polis- of klantnummer bij de hand, zodat je gericht om uitleg kunt vragen.\n\nTwijfel je of de rekening echt is? Gebruik dan geen links of contactgegevens uit het verdachte bericht. Controleer eerst bij a.s.r. of de rekening klopt voordat je betaalt.",
  },
  {
    pictogram: "/bewindsvoerder/pictogram-hand-stop.svg",
    title: "De bewindvoering van mijn cliënt stopt",
    tekst:
      "Stopt de bewindvoering? Geef de wijziging dan door aan a.s.r. Vermeld vanaf welke datum je niet meer als bewindvoerder optreedt en vraag welke gegevens of documenten nodig zijn om dit te verwerken.\n\nBespreek met je cliënt wie voortaan de verzekeringszaken regelt en de rekeningen betaalt. Controleer samen de contactgegevens, het betaalrekeningnummer en eventuele automatische incasso’s.\n\nZijn er nog openstaande rekeningen of betalingsafspraken? Draag deze informatie zorgvuldig over aan je cliënt of de nieuwe vertegenwoordiger. Vraag a.s.r. te bevestigen dat de wijziging is verwerkt.",
  },
];

export function SituatieKaarten() {
  const [open, setOpen] = useState<number | null>(null);
  // De Dialog heeft geen eigen focusherstel: zet de focus na sluiten terug op de knop die hem opende.
  const trigger = useRef<HTMLElement | null>(null);

  function openen(index: number) {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(index);
  }

  function sluiten() {
    setOpen(null);
    trigger.current?.focus();
  }

  const gekozen = open === null ? null : SITUATIES[open];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
        {SITUATIES.map((situatie, index) => (
          <CardGraphic key={situatie.title} pictogram={situatie.pictogram} title={situatie.title} actionLabel="Meer info" onActionClick={() => openen(index)} />
        ))}
      </div>
      <Dialog open={gekozen !== null} onClose={sluiten} title={gekozen?.title ?? ""} size="md" actions={[{ label: "Begrepen", variant: "primary", onClick: sluiten }]}>
        <p className="whitespace-pre-line">{gekozen?.tekst}</p>
      </Dialog>
    </>
  );
}
