"use client";

import { useRouter } from "next/navigation";
import { CardDetails, type DetailRowData } from "@/components/CardDetails";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelSection } from "@/components/FunnelSection";
import { formatDatum, fromIsoDatum } from "@/lib/datum";
import { straatEnHuisnummer } from "../adres";
import { BewindScherm, VerplichteVelden } from "../delen";
import { ROUTES, useBewindFunnel, type BewindState } from "../funnel-context";

const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;

const datum = (iso: string) => (iso ? formatDatum(fromIsoDatum(iso)) : "-");
const tekst = (waarde: string) => waarde.trim() || "-";
const naam = (...delen: string[]) => tekst(delen.map((d) => d.trim()).filter(Boolean).join(" "));
const bestanden = (files: File[]) => (files.length ? files.map((f) => f.name).join(", ") : "-");
const jaNee = (waarde: string) => (waarde === "ja" ? "Ja" : waarde === "nee" ? "Nee" : "-");

function postadres(s: BewindState) {
  if (s.postbus) return tekst([`Postbus ${s.postbusnummer.trim()}`, `${s.postcode.trim()} ${s.plaats.trim()}`.trim()].join(", "));
  return adres(s.straat, s.huisnummer, s.toevoeging, s.postcode, s.woonplaats);
}

/** "Archimedeslaan 10, 3584 BA Utrecht"; zonder opgehaalde straat alleen postcode en huisnummer. */
function adres(straat: string, huisnummer: string, toevoeging: string, postcode: string, plaats: string) {
  if (!straat.trim()) return naam(postcode, `${huisnummer.trim()}${toevoeging.trim()}`);
  return `${straatEnHuisnummer({ straat, huisnummer, toevoeging })}, ${naam(postcode, plaats)}`;
}

/**
 * Stap 4, "Controleren en verzenden" (Figma frame "4 Samenvatting" en de varianten): één "Card Details" per
 * stap, met de rijen die bij de gemaakte keuzes horen (Particulier/Zakelijk, betaalmail). "Wijzig" gaat
 * terug naar de juiste stap; alles wat is ingevuld blijft staan.
 */
export default function SamenvattingPage() {
  const router = useRouter();
  const { state: s } = useBewindFunnel();
  const particulier = s.soort === "particulier";

  const bewindvoerder: DetailRowData[] = [
    { label: "Particulier/Zakelijk", value: particulier ? "Particulier" : "Zakelijk" },
    ...(particulier
      ? [
          { label: "Naam", value: naam(s.voornamen, s.tussenvoegsel, s.achternaam) },
          { label: "Geboortedatum", value: datum(s.geboortedatum) },
        ]
      : [
          { label: "Statutaire naam", value: tekst(s.statutaireNaam) },
          { label: "KvK-nummer", value: tekst(s.kvkNummer) },
        ]),
    { label: "E-mailadres", value: tekst(s.email) },
    { label: "Telefoonnummer", value: s.telefoon.trim() ? `+31 ${s.telefoon.trim()}` : "-" },
    { label: "Postadres", value: postadres(s) },
  ];

  const bewindgegevens: DetailRowData[] = [
    { label: "Zaaknummer Rechtbank", value: tekst(s.zaaknummer) },
    { label: "Startdatum Bewind", value: datum(s.startdatum) },
    { label: "Einddatum Bewind", value: datum(s.einddatum) },
    { label: "Beschikking", value: bestanden(s.beschikking) },
    ...(particulier ? [{ label: "Identiteitsbewijs", value: bestanden(s.identiteitsbewijs) }] : []),
    { label: "Betaalvoorkeur", value: s.betaalvoorkeur === "email" ? "Rekening via e-mail" : "Automatische incasso" },
    ...(s.betaalvoorkeur === "email" ? [{ label: "E-mailadres betaalmail", value: tekst(s.emailBetaalmail) }] : []),
    { label: "Rekeningnummer", value: tekst(s.iban) },
    { label: "Kenmerk Cliënt", value: tekst(s.kenmerk) },
  ];

  const klant: DetailRowData[] = [
    { label: "Voornamen", value: tekst(s.klantVoornamen) },
    { label: "Naam", value: naam(s.klantVoornamen, s.klantTussenvoegsel, s.klantAchternaam) },
    { label: "Geboortedatum", value: datum(s.klantGeboortedatum) },
    { label: "Adres", value: adres(s.klantStraat, s.klantHuisnummer, s.klantToevoeging, s.klantPostcode, s.klantWoonplaats) },
    { label: "Overzicht betalingsachterstand", value: jaNee(s.betalingsachterstand) },
    { label: "Polisblad ontvangen", value: jaNee(s.polisblad) },
  ];

  return (
    <BewindScherm
      activeStep={4}
      terugLabel="Klant"
      onTerug={() => router.push(ROUTES.klant)}
      feedback
      navigation={
        <FormNavigation previousStep previousLabel="Klant" nextStep={false} submit submitLabel="Indienen" onPrevious={() => router.push(ROUTES.klant)} />
      }
    >
      <FunnelSection
        intro
        title="Controleren en verzenden"
        description={
          <>
            Controleer de ingevulde gegevens. <br />
            Klik op ‘Wijzig’ om terug te gaan naar het juiste onderdeel.
          </>
        }
        showRequiredFieldsNote
        requiredFieldsNote={<VerplichteVelden />}
      />

      <CardDetails title="Bewindvoerder" rows={bewindvoerder} onEdit={() => router.push(ROUTES.bewindvoerder)} />
      <CardDetails title="Bewindgegevens" rows={bewindgegevens} onEdit={() => router.push(ROUTES.bewindgegevens)} />
      <CardDetails title="Klant" rows={klant} onEdit={() => router.push(ROUTES.klant)} />

      <p className="w-full text-black text-lg leading-[1.5]" style={AVENIR}>
        Door dit formulier in te dienen, meld je je aan als bewindvoerder van je cliënt. <br />
        Je verklaart dat je alle gegevens naar waarheid hebt ingevuld.
      </p>
    </BewindScherm>
  );
}
