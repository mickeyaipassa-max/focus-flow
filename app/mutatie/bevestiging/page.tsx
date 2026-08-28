"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { Button } from "@/components/Button";
import { SummaryCard } from "@/components/SummaryCard";
import { List } from "@/components/List";
import { Checkbox } from "@/components/Checkbox";
import { useMutatieFunnel } from "../funnel-context";
import { PRICE_BY_DEKKING, GLAS_PRICE, CURRENT_DEKKING, CURRENT_MONTHLY_PRICE, CURRENT_EIGEN_RISICO, dekkingTitel, berekenNieuwePremie, formatEuro } from "../pricing";

const MUTATIE_STEPS = ["Jouw dekking", "Bevestiging"];

/** Vaste ingangsdatum uit Figma (node 8031:18859/8031:18881) — er bestaat geen datumkeuze-veld op stap 1 om dit uit af te leiden, dus letterlijk overgenomen i.p.v. zelf een datumlogica te verzinnen. */
const INGANGSDATUM = "01 - 10 2026";

/**
 * Bevestigingsstap van de mutatie-funnel "Dekking wijzigen" (Figma node
 * 8031:11461, "Bijna klaar! Klopt alles?"). Neemt de keuzes van stap 1 over
 * via `useMutatieFunnel` — "het startpunt is altijd jouw dekking" — i.p.v.
 * Figma's statische voorbeeldwaarden (Allrisk/Glas) hard te coderen.
 *
 * De 3 kaarten zijn `SummaryCard`-instanties (al gebouwd, eerder al
 * bevestigd tegen exact deze nodes). Twee content-issues die de audit op dit
 * scherm vond zijn hier gecorrigeerd, in overleg bevestigd: de "[product]"-
 * placeholder is ingevuld, en de dubbele "Ik heb alle gegevens eerlijk en
 * correct ingevuld."-bullet is teruggebracht tot één regel. De grammaticale
 * onhandigheid "Ik ga akkoord gaat met de" in de eerste akkoord-bullet is
 * wél letterlijk overgenomen — daar is niet expliciet om gevraagd, dus niet
 * op eigen initiatief gewijzigd.
 *
 * Header toont hier bewust geen "Annuleren" (chat-knop, zoals Figma zelf
 * laat zien) — dat verschil met stap 1 blijft, letterlijk uit Figma. De
 * titel was in Figma zelf wél korter op deze stap ("Dekking wijzigen" i.p.v.
 * stap 1's "Dekking Opstalverzekering wijzigen"), maar dat gaf twee
 * verschillende titels in dezelfde funnel — op expliciet verzoek van de
 * gebruiker hier gelijkgetrokken aan stap 1's titel.
 *
 * "Aanpassing bevestigen" navigeert bij succes naar "/" — het successcherm
 * ("Gelukt!") is niet meegebouwd, buiten scope van deze stap.
 */
export default function MutatieBevestigingPage() {
  const router = useRouter();
  const { state } = useMutatieFunnel();
  const { dekking, eigenRisico, aanvullendeDekkingen } = state;

  const [akkoord, setAkkoord] = useState(false);
  const [akkoordError, setAkkoordError] = useState(false);

  const heeftGlas = aanvullendeDekkingen.includes("glas");
  const nieuwePremie = useMemo(() => berekenNieuwePremie(dekking, heeftGlas), [dekking, heeftGlas]);
  const isDekkingGewijzigd = dekking !== CURRENT_DEKKING;
  const isEigenRisicoGewijzigd = eigenRisico !== CURRENT_EIGEN_RISICO;
  const isPremieGewijzigd = Math.abs(nieuwePremie - CURRENT_MONTHLY_PRICE) > 0.001;

  function handleSubmit() {
    if (!akkoord) {
      setAkkoordError(true);
      return;
    }
    router.push("/");
  }

  return (
    <FunnelPageTemplate
      headerTitle="Dekking Opstalverzekering wijzigen"
      ikzSticker
      steps={MUTATIE_STEPS}
      activeStep={1}
      sidebarClassName="flex w-full flex-col items-start gap-4 rounded-[3px] bg-white p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]"
      sidebar={
        <>
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full items-start gap-4">
              <img src="/icons/pictogram-house.svg" alt="" className="size-8 shrink-0" />
              <p className="flex-1 font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                Opstal
              </p>
            </div>

            <div className="flex w-full flex-col items-start gap-3">
              <p className="w-full font-bold text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                Dekking
              </p>
              <div className="flex w-full items-start gap-2">
                <p className="flex-1 text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  {dekkingTitel(dekking)}
                </p>
                <p className="whitespace-nowrap text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  € {PRICE_BY_DEKKING[dekking]}
                </p>
              </div>
              <p className="w-full text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                Eigen risico € {eigenRisico}
              </p>
            </div>

            {heeftGlas && (
              <div className="flex w-full flex-col items-start gap-3">
                <p className="w-full font-bold text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  Aanvullende dekkingen
                </p>
                <div className="flex w-full items-start gap-2">
                  <p className="flex-1 text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                    Glas
                  </p>
                  <p className="whitespace-nowrap text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                    € {GLAS_PRICE}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full flex-col items-start gap-4 rounded-[3px] bg-[#eef4e3] p-3">
            <div className="flex w-full items-start gap-2">
              <p className="flex-1 font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                Je gaat betalen per maand
              </p>
              <p className="whitespace-nowrap text-right font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                {formatEuro(nieuwePremie)}
              </p>
            </div>
            {isPremieGewijzigd && (
              <p className="w-full text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                Dit was: {formatEuro(CURRENT_MONTHLY_PRICE)} per maand
              </p>
            )}
          </div>
        </>
      }
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Laatste vragen"
          nextStep={false}
          submit
          submitLabel="Aanpassing bevestigen"
          onPrevious={() => router.push("/mutatie")}
          onSubmit={handleSubmit}
        />
      }
    >
      <Button type="tertiary" iconPrepend="arrow-left" onClick={() => router.push("/mutatie")}>
        Dekking wijzigen
      </Button>

      <FunnelSection intro title="Bevestiging" showRequiredFieldsNote />

      <FunnelSection title="Bijna klaar! Klopt alles?">
        <SummaryCard
          title="Jouw dekking"
          showEdit
          onEdit={() => router.push("/mutatie")}
          rows={[
            {
              label: "Dekking",
              value: dekkingTitel(dekking),
              badge: isDekkingGewijzigd ? "Gewijzigd" : undefined,
              previousValue: isDekkingGewijzigd ? `Dit was: ${dekkingTitel(CURRENT_DEKKING)}` : undefined,
            },
            {
              label: "Eigen risico",
              value: `€ ${eigenRisico}`,
              muted: !isEigenRisicoGewijzigd,
              badge: isEigenRisicoGewijzigd ? "Gewijzigd" : undefined,
              previousValue: isEigenRisicoGewijzigd ? `Dit was: € ${CURRENT_EIGEN_RISICO}` : undefined,
            },
            ...(heeftGlas ? [{ label: "Aanvullende dekking", value: "Glas", badge: "Toegevoegd" }] : []),
          ]}
        />

        <SummaryCard title="Ingangsdatum" rows={[{ label: "De opstalverzekering gaat in per", value: INGANGSDATUM }]} />

        <SummaryCard
          title="Premie"
          rows={[
            {
              label: "Nieuwe premie",
              value: `${formatEuro(nieuwePremie)} per maand`,
              badge: isPremieGewijzigd ? "Gewijzigd" : undefined,
              previousValue: isPremieGewijzigd ? `Dit was: ${formatEuro(CURRENT_MONTHLY_PRICE)} per maand` : undefined,
            },
          ]}
        />
      </FunnelSection>

      <FunnelSection title="Geef je akkoord" description="Je verklaart:">
        <List
          icon="bullet"
          items={[
            {
              content: (
                <>
                  Ik ga akkoord gaat met de{" "}
                  <a href="#" className="text-[#0064a8] underline">
                    Algemene voorwaarden Ik kies zelf van a.s.r.
                  </a>{" "}
                  en de nieuwe voorwaarden van de{" "}
                  <a href="#" className="text-[#0064a8] underline">
                    Opstalverzekering
                  </a>{" "}
                  Ik kies zelf van a.s.r.
                </>
              ),
            },
            { text: "Ik heb alle gegevens eerlijk en correct ingevuld." },
            { text: "Ik ga ermee akkoord dat a.s.r. alleen per e-mail en telefoon met mij correspondeert." },
          ]}
        />

        <div className="flex w-full flex-col items-start gap-2">
          <Checkbox
            label={
              <>
                Ja, ik ga akkoord <span className="text-[#ce0a1e]">*</span>
              </>
            }
            checked={akkoord}
            onChange={(checked) => {
              setAkkoord(checked);
              if (checked) setAkkoordError(false);
            }}
          />
          {akkoordError && (
            <p className="text-[#ce0a1e] text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              Je moet akkoord gaan om je aanpassing te kunnen bevestigen.
            </p>
          )}
        </div>
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
