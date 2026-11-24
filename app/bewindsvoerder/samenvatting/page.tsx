"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardDetails, type DetailRowData } from "@/components/CardDetails";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelSection } from "@/components/FunnelSection";
import { formatDatum, fromIsoDatum } from "@/lib/datum";
import { straatEnHuisnummer } from "../adres";
import { BewindScherm, VerplichteVelden } from "../delen";
import { ROUTES, useBewindFunnel, type BewindState } from "../funnel-context";
import { FOUT } from "../validatie";

/** Wat er in de samenvatting staat bij alles wat (nog) niet is ingevuld, ook bij optionele velden. */
const NIET_INGEVULD = "Nog niet ingevuld";

const datum = (iso: string) => (iso ? formatDatum(fromIsoDatum(iso)) : NIET_INGEVULD);
const tekst = (waarde: string) => waarde.trim() || NIET_INGEVULD;
const naam = (...delen: string[]) => tekst(delen.map((d) => d.trim()).filter(Boolean).join(" "));
const bestanden = (files: File[]) => (files.length ? files.map((f) => f.name).join(", ") : NIET_INGEVULD);

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
 * terug naar de juiste stap; alles wat is ingevuld blijft staan. Onderaan staat de verplichte bevestiging (Figma
 * "Checkbox Group" "Bevestiging"); "Indienen" werkt pas als die is aangevinkt.
 */
export default function SamenvattingPage() {
  const router = useRouter();
  const { state: s } = useBewindFunnel();
  const [bevestigd, setBevestigd] = useState<string[]>([]);
  const [bevestigingFout, setBevestigingFout] = useState<string | undefined>();
  const particulier = s.soort === "particulier";
  const zakelijk = s.soort === "zakelijk";

  const bewindvoerder: DetailRowData[] = [
    { label: "Soort bewindvoerder", value: particulier ? "Particulier" : zakelijk ? "Zakelijk" : NIET_INGEVULD },
    ...(particulier
      ? [
          { label: "Naam", value: naam(s.voornamen, s.tussenvoegsel, s.achternaam) },
          { label: "Geboortedatum", value: datum(s.geboortedatum) },
        ]
      : zakelijk
        ? [
            { label: "Statutaire naam", value: tekst(s.statutaireNaam) },
            { label: "KvK-nummer", value: tekst(s.kvkNummer) },
          ]
        : []),
    { label: "E-mailadres bewindvoerder", value: tekst(s.email) },
    ...(zakelijk && s.anderEmail === "ja" ? [{ label: "E-mailadres correspondentie", value: tekst(s.emailCorrespondentie) }] : []),
    { label: "Telefoonnummer", value: s.telefoon.trim() ? `+31 ${s.telefoon.trim()}` : NIET_INGEVULD },
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

  function handleSubmit() {
    if (!bevestigd.length) {
      setBevestigingFout(FOUT.bevestigingLeeg);
      return;
    }
    router.push(ROUTES.gelukt);
  }

  return (
    <BewindScherm
      activeStep={4}
      terugLabel="Klant"
      onTerug={() => router.push(ROUTES.klant)}
      feedback
      navigation={
        <FormNavigation previousStep previousLabel="Klant" nextStep={false} submit submitLabel="Indienen" onPrevious={() => router.push(ROUTES.klant)} onSubmit={handleSubmit} />
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

      <CheckboxGroup
        className="m-0 flex w-full flex-col items-start gap-2 border-0 p-0"
        labelText="Bevestiging"
        options={[{ value: "bevestigd", label: "Ik bevestig dat ik de bewindvoerder van deze cliënt ben en alle gegevens naar waarheid heb ingevuld." }]}
        values={bevestigd}
        error={bevestigingFout}
        onChange={(waarden) => {
          setBevestigd(waarden);
          setBevestigingFout(undefined);
        }}
      />
    </BewindScherm>
  );
}
