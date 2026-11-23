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

/** Postbus: drie losse rijen (Figma "4 Samenvatting – variant Postbusadres"); anders één rij "Postadres". */
function postadresRijen(s: BewindState): DetailRowData[] {
  if (s.postbus)
    return [
      { label: "Postbus", value: tekst(s.postbusnummer) },
      { label: "Postcode", value: tekst(s.postcode) },
      { label: "Plaatsnaam", value: tekst(s.plaats) },
    ];
  return [{ label: "Postadres", value: adres(s.straat, s.huisnummer, s.toevoeging, s.postcode, s.woonplaats) }];
}

/** "Archimedeslaan 10, 3584 BA Utrecht"; zonder opgehaalde straat alleen postcode en huisnummer. */
function adres(straat: string, huisnummer: string, toevoeging: string, postcode: string, plaats: string) {
  if (!straat.trim()) return naam(postcode, `${huisnummer.trim()}${toevoeging.trim()}`);
  return `${straatEnHuisnummer({ straat, huisnummer, toevoeging })}, ${naam(postcode, plaats)}`;
}

/**
 * Stap 4, "Controleren en verzenden" (Figma frame "4 Samenvatting" en de varianten): één "Card Details" per
 * stap, met de rijen die bij de gemaakte keuzes horen (soort bewindvoerder, e-mailadres correspondentie). "Wijzig" gaat
 * terug naar de juiste stap; alles wat is ingevuld blijft staan.
 */
export default function SamenvattingPage() {
  const router = useRouter();
  const { state: s } = useBewindFunnel();
  const particulier = s.soort === "particulier";

  const bewindvoerder: DetailRowData[] = [
    { label: "Soort bewindvoerder", value: particulier ? "Particulier" : "Zakelijk" },
    ...(particulier
      ? [
          { label: "Naam", value: naam(s.voornamen, s.tussenvoegsel, s.achternaam) },
          { label: "Geboortedatum", value: datum(s.geboortedatum) },
        ]
      : [
          { label: "Statutaire naam", value: tekst(s.statutaireNaam) },
          { label: "KvK-nummer", value: tekst(s.kvkNummer) },
        ]),
    { label: "E-mailadres bewindvoerder", value: tekst(s.email) },
    ...(!particulier && s.anderEmail === "ja" ? [{ label: "E-mailadres correspondentie", value: tekst(s.emailCorrespondentie) }] : []),
    { label: "Telefoonnummer", value: s.telefoon.trim() ? `+31 ${s.telefoon.trim()}` : "-" },
    ...postadresRijen(s),
  ];

  const bewindgegevens: DetailRowData[] = [
    { label: "Zaaknummer rechtbank", value: tekst(s.zaaknummer) },
    { label: "Startdatum bewind", value: datum(s.startdatum) },
    { label: "Einddatum bewind", value: datum(s.einddatum) },
    { label: "Beschikking", value: bestanden(s.beschikking) },
    ...(particulier ? [{ label: "Identiteitsbewijs", value: bestanden(s.identiteitsbewijs) }] : []),
    { label: "Betaalvoorkeur", value: s.betaalvoorkeur === "email" ? "Zelf overmaken, rekening via e-mail" : "Automatisch betalen" },
    { label: "Rekeningnummer", value: tekst(s.iban) },
    { label: "Klantnaam, klantnummer of dossiernummer", value: tekst(s.kenmerk) },
  ];

  const klant: DetailRowData[] = [
    { label: "Voornaam", value: tekst(s.klantVoornamen) },
    { label: "Naam", value: naam(s.klantVoornamen, s.klantTussenvoegsel, s.klantAchternaam) },
    { label: "Geboortedatum", value: datum(s.klantGeboortedatum) },
    { label: "Adres", value: adres(s.klantStraat, s.klantHuisnummer, s.klantToevoeging, s.klantPostcode, s.klantWoonplaats) },
  ];

  return (
    <BewindScherm
      activeStep={4}
      terugLabel="Klant"
      onTerug={() => router.push(ROUTES.klant)}
      feedback
      navigation={
        <FormNavigation previousStep previousLabel="Klant" nextStep={false} submit submitLabel="Indienen" onPrevious={() => router.push(ROUTES.klant)} onSubmit={() => router.push(ROUTES.gelukt)} />
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
        Met dit formulier meld je jezelf aan als bewindvoerder van jouw cliënt. Je bevestigt dat je alle gegevens eerlijk en juist invulde.
      </p>
    </BewindScherm>
  );
}
