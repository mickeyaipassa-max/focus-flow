"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardDetails } from "@/components/CardDetails";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelSection } from "@/components/FunnelSection";
import { formatDatum, fromIsoDatum } from "@/lib/datum";
import { BehandelhistorieScherm, TerugKnop, VerplichteVelden } from "../delen";
import { ROUTES, useBehandelhistorieFunnel } from "../funnel-context";
import { REDENEN, REDEN_ANDERS, SITUATIES } from "../opties";
import { isGeldig, valideerBehandeling, valideerVerzekerde } from "../validatie";

/** Figma tekent de rand binnen het kader; de CSS-rand van 1px erbuiten wordt met 23px padding gecompenseerd (zoals Royeren). */
const CARD_CLASS = "flex w-full flex-col items-start gap-4 rounded-[3px] border border-[#ccc] bg-white p-[23px] min-[900px]:flex-row";

const PARAGRAPH_CLASS = "w-full font-[350] text-black text-lg leading-[1.5]";

/**
 * Stap 3, "Controleren en verzenden" (Figma-bestand "Formulier-
 * behandelhistorie", frame "03"): drie kaarten met de ingevulde gegevens en
 * "Wijzig" terug naar de betreffende stap, de verklaring en "Indienen".
 *
 * De kaart "Gegevens behandeling" toont in Figma alleen Diagnosecode,
 * Ingangsdatum, Situatie en Aantal behandelingen. Voor de situatie "opnieuw
 * een chronische indicatie" komen daar "Reden" (en bij "Anders, namelijk" een
 * "Toelichting") bij — die rijen staan niet in Figma maar horen bij de
 * antwoorden uit stap 2.
 *
 * Er is nog geen backend: "Indienen" gaat rechtstreeks naar het
 * bevestigingsscherm. Zonder complete gegevens (rechtstreeks geopend of na een
 * refresh) gaat de gebruiker terug naar de eerste stap die nog niet klopt.
 */
export default function ControlerenPage() {
  const router = useRouter();
  const { state } = useBehandelhistorieFunnel();

  const verzekerdeOk = isGeldig(valideerVerzekerde(state));
  const behandelingOk = isGeldig(valideerBehandeling(state));

  useEffect(() => {
    if (!verzekerdeOk) router.replace(ROUTES.verzekerde);
    else if (!behandelingOk) router.replace(ROUTES.behandeling);
  }, [verzekerdeOk, behandelingOk, router]);

  const naam = [state.voorletters.trim(), state.tussenvoegsel.trim(), state.achternaam.trim()].filter(Boolean).join(" ");
  const situatie = SITUATIES.find((optie) => optie.value === state.situatie)?.label ?? "";
  const reden = REDENEN.find((optie) => optie.value === state.reden)?.label ?? "";

  const behandelingRijen = [
    { label: "Diagnosecode", value: state.diagnosecode },
    { label: "Ingangsdatum chronische periode", value: state.ingangsdatum ? formatDatum(fromIsoDatum(state.ingangsdatum)) : "" },
    { label: "Situatie", value: situatie },
    ...(state.situatie === "nieuw" || state.situatie === "zelfBetaald"
      ? [{ label: "Aantal behandelingen", value: state.aantalBehandelingen }]
      : []),
    ...(state.situatie === "opnieuw" ? [{ label: "Reden nieuwe chronische indicatie", value: reden }] : []),
    ...(state.situatie === "opnieuw" && state.reden === REDEN_ANDERS ? [{ label: "Toelichting", value: state.toelichting }] : []),
  ];

  return (
    <BehandelhistorieScherm
      activeStep={3}
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Gegevens behandeling"
          nextStep={false}
          submit
          submitLabel="Indienen"
          onPrevious={() => router.push(ROUTES.behandeling)}
          onSubmit={() => router.push(ROUTES.gelukt)}
        />
      }
    >
      <TerugKnop onClick={() => router.push(ROUTES.behandeling)}>Gegevens behandeling</TerugKnop>

      <FunnelSection
        intro
        title="Controleren en verzenden"
        description="Controleer de ingevulde gegevens. Klik op ‘Wijzigen’ om terug te gaan naar het juiste onderdeel."
        showRequiredFieldsNote
        requiredFieldsNote={<VerplichteVelden />}
      />

      <div className="flex w-full flex-col items-start gap-10">
        <CardDetails
          className={CARD_CLASS}
          title="Gegevens verzekerde"
          onEdit={() => router.push(ROUTES.verzekerde)}
          rows={[
            { label: "Verzekerdennummer", value: state.verzekerdennummer },
            { label: "Naam", value: naam },
            { label: "Geboortedatum", value: state.geboortedatum ? formatDatum(fromIsoDatum(state.geboortedatum)) : "" },
          ]}
        />
        <CardDetails className={CARD_CLASS} title="Gegevens behandeling" onEdit={() => router.push(ROUTES.behandeling)} rows={behandelingRijen} />
        <CardDetails
          className={CARD_CLASS}
          title="Gegevens praktijk"
          onEdit={() => router.push(ROUTES.behandeling)}
          rows={[
            { label: "Naam praktijk", value: state.naamPraktijk },
            { label: "AGB-code praktijk", value: state.agbCode },
            { label: "E-mailadres", value: state.emailPraktijk },
          ]}
        />
      </div>

      <div className="flex w-full flex-col items-start gap-6" style={{ fontFamily: "var(--font-avenir-book)" }}>
        <p className={PARAGRAPH_CLASS}>
          Door het indienen van dit formulier verstuur je jouw aanvraag voor je cliënt en verklaar je alle gegevens naar waarheid te hebben ingevuld.
        </p>
        <p className={PARAGRAPH_CLASS}>Wij verwerken je aanvraag zo snel mogelijk. Binnen 10 werkdagen ontvang je van ons een reactie op je aanvraag.</p>
      </div>
    </BehandelhistorieScherm>
  );
}
