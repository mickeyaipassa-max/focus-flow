"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { Button } from "@/components/Button";
import { SummaryCard } from "@/components/SummaryCard";
import { List } from "@/components/List";
import { Checkbox } from "@/components/Checkbox";
import { Receipt, type ReceiptGroup } from "@/components/Receipt";
import { ReceiptBar } from "@/components/ReceiptBar";
import { Dialog } from "@/components/Dialog";
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
 * titel is "Dekking wijzigen" op beide stappen — Figma zelf toonde die
 * kortere titel al op deze stap; stap 1 gebruikte eerder de langere
 * "Dekking Opstalverzekering wijzigen", maar dat gaf twee verschillende
 * titels in dezelfde funnel. Op expliciet verzoek van de gebruiker eerst
 * gelijkgetrokken aan stap 1's langere titel, en later — weer op expliciet
 * verzoek — teruggebracht naar deze kortere variant, nu op beide stappen.
 *
 * "Aanpassing bevestigen" navigeert bij succes naar "/" — het successcherm
 * ("Gelukt!") is niet meegebouwd, buiten scope van deze stap.
 *
 * `activeStep={2}` (niet `{1}`): zelfde off-by-one-fix als stap 1
 * (app/mutatie/page.tsx) — `StepIndicator` is 1-indexed.
 *
 * De receipt-kaart rechts gebruikt het gedeelde `Receipt`-component (zelfde
 * precedent en zelfde reden als stap 1, app/mutatie/page.tsx) — inclusief
 * de `ReceiptBar` + Dialog onder 600px, 1-op-1 op Figma's eigen "Receipt
 * Bar"/"Receipt Dialog"-componenten gebaseerd (node 8818:509/8818:487,
 * "Components"-bibliotheek).
 *
 * Op expliciet verzoek is de Bar `fixed` aan de onderkant (16px marge)
 * zolang de gebruiker scrolt, en verdwijnt hij zodra de echte Receipt Box
 * — nu ook op mobiel zichtbaar, net als op de homepage-demo — in beeld
 * komt vlak vóór de funnel-footer (via `IntersectionObserver`), zelfde
 * precedent als stap 1.
 */
export default function MutatieBevestigingPage() {
  const router = useRouter();
  const { state } = useMutatieFunnel();
  const { dekking, eigenRisico, aanvullendeDekkingen } = state;

  const [akkoord, setAkkoord] = useState(false);
  const [akkoordError, setAkkoordError] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  const [receiptBoxVisible, setReceiptBoxVisible] = useState(false);
  const receiptBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = receiptBoxRef.current;
    if (!el) return;
    /** `rootMargin` laat de Bar al verdwijnen vlak vóórdat de Box in beeld komt — zelfde precedent als stap 1. */
    const observer = new IntersectionObserver(([entry]) => setReceiptBoxVisible(entry.isIntersecting), { rootMargin: "0px 0px 100px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const heeftGlas = aanvullendeDekkingen.includes("glas");
  const nieuwePremie = useMemo(() => berekenNieuwePremie(dekking, heeftGlas), [dekking, heeftGlas]);
  const isDekkingGewijzigd = dekking !== CURRENT_DEKKING;
  const isEigenRisicoGewijzigd = eigenRisico !== CURRENT_EIGEN_RISICO;
  const isPremieGewijzigd = Math.abs(nieuwePremie - CURRENT_MONTHLY_PRICE) > 0.001;

  const receiptGroups: ReceiptGroup[] = [
    {
      title: "Dekking",
      items: [
        { label: dekkingTitel(dekking), amount: `€ ${PRICE_BY_DEKKING[dekking]}` },
        { label: `Eigen risico € ${eigenRisico}` },
      ],
    },
    ...(heeftGlas ? [{ title: "Aanvullende dekkingen", items: [{ label: "Glas", amount: `€ ${GLAS_PRICE}` }] }] : []),
  ];

  function handleSubmit() {
    if (!akkoord) {
      setAkkoordError(true);
      return;
    }
    router.push("/");
  }

  return (
    <FunnelPageTemplate
      headerTitle="Dekking wijzigen"
      ikzSticker
      steps={MUTATIE_STEPS}
      activeStep={2}
      stepAnimationKey="mutatie"
      sidebarClassName="w-full"
      sidebar={
        <>
          {!receiptBoxVisible && (
            <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-6 min-[600px]:hidden">
              <ReceiptBar amount={formatEuro(nieuwePremie)} onShowDetails={() => setReceiptDialogOpen(true)} />
            </div>
          )}

          <div ref={receiptBoxRef} className="w-full">
            <Receipt
              title="Opstal"
              icon={<img src="/icons/pictogram-house.svg" alt="" className="size-8" />}
              type="one-section"
              sections={[{ id: "opstal", groups: receiptGroups }]}
              summaryLabel="Je gaat betalen per maand"
              summaryAmount={formatEuro(nieuwePremie)}
              summaryInfo={isPremieGewijzigd ? `Dit was: ${formatEuro(CURRENT_MONTHLY_PRICE)} per maand` : undefined}
            />
          </div>

          <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} title="Opstal">
            <Receipt
              type="one-section"
              sections={[{ id: "opstal", groups: receiptGroups }]}
              summaryLabel="Je gaat betalen per maand"
              summaryAmount={formatEuro(nieuwePremie)}
              summaryInfo={isPremieGewijzigd ? `Dit was: ${formatEuro(CURRENT_MONTHLY_PRICE)} per maand` : undefined}
              className="flex w-full flex-col items-start gap-4"
            />
          </Dialog>
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
