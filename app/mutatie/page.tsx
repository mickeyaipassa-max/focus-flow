"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { Button } from "@/components/Button";
import { RadioCardBottomGroup } from "@/components/RadioCardBottom";
import { RadioGroup } from "@/components/RadioGroup";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
import { Receipt, type ReceiptGroup } from "@/components/Receipt";
import { ReceiptBar } from "@/components/ReceiptBar";
import { Dialog } from "@/components/Dialog";
import { useMutatieFunnel } from "./funnel-context";
import { DEKKING_OPTIONS, PRICE_BY_DEKKING, GLAS_PRICE, CURRENT_MONTHLY_PRICE, dekkingTitel, berekenNieuwePremie, formatEuro, type DekkingKeuze } from "./pricing";

const MUTATIE_STEPS = ["Jouw dekking", "Bevestiging"];

const EIGEN_RISICO_OPTIES = [
  { value: "0", label: "€ 0" },
  { value: "100", label: "€ 100" },
  { value: "500", label: "€ 500" },
];

/**
 * Stap 1 van de mutatie-funnel "Dekking wijzigen" (Figma node 8031:10775,
 * de staat vóór wijziging: Basis geselecteerd, Glas uit). Pixel-getrouw
 * opgebouwd uit uitsluitend bestaande componenten (FunnelPageTemplate,
 * RadioGroup, CheckboxCardControlLeftGroup) plus één nieuw component
 * (RadioCardBottomGroup) dat nog niet in dit project bestond.
 *
 * Keuzes staan in de gedeelde `MutatieFunnelProvider` (niet lokale
 * `useState`) zodat de bevestigingsstap ze kan overnemen — "het startpunt
 * is altijd jouw dekking, neem de wijzigingen mee".
 *
 * De receipt-kaart rechts gebruikt het gedeelde `Receipt`-component
 * (`type="one-section"`, bevestigd via een aparte MCP-fetch van Figma's
 * "Components"-bibliotheek, node 8926:5568 — hetzelfde bestand als a.s.r.'s
 * publieke designsysteem-documentatie zelf naar linkt). Eerder stond hier
 * dupliceerde inline JSX; dat is nu vervangen door het al bestaande,
 * elders (Verzuim) actief gebruikte component, inclusief een nieuwe
 * `type="one-section"`-variant daarop (geen accordion-chevron, want hier is
 * maar één product) — precies zoals Figma's eigen drie Receipt Box-types.
 *
 * Onder 600px toont de sidebar Figma's eigen "Receipt Bar" (node 8818:509,
 * apart bevestigd, incl. de 320-599px-variant) i.p.v. de altijd-volledig-
 * uitgeklapte Box: een compacte balk met alleen het totaalbedrag, waarvan
 * "Bekijk details" — exact zoals Figma's componentbeschrijving het stelt —
 * een Receipt Dialog opent met dezelfde inhoud als de desktop-Box. Dit
 * verving een eerdere, op a.s.r.'s Storybook-demo gebaseerde aanname
 * (inline uitklappen i.p.v. een dialoog, en een wit i.p.v. groen gevulde
 * balk) die bij directe Figma-verificatie onjuist bleek.
 *
 * "Meer informatie"-dialogen (Basis/Allrisk/Glas) zijn in Figma wel
 * aanwezig maar bewust niet meegebouwd — buiten scope.
 */
export default function MutatieDekkingPage() {
  const router = useRouter();
  const { state, setState } = useMutatieFunnel();
  const { dekking, eigenRisico, aanvullendeDekkingen } = state;

  const heeftGlas = aanvullendeDekkingen.includes("glas");
  const nieuwePremie = useMemo(() => berekenNieuwePremie(dekking, heeftGlas), [dekking, heeftGlas]);
  const isGewijzigd = Math.abs(nieuwePremie - CURRENT_MONTHLY_PRICE) > 0.001;
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

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

  function setDekking(value: string) {
    setState({ ...state, dekking: value as DekkingKeuze });
  }
  function setEigenRisico(value: string) {
    setState({ ...state, eigenRisico: value });
  }
  function setAanvullendeDekkingen(values: string[]) {
    setState({ ...state, aanvullendeDekkingen: values });
  }

  return (
    <FunnelPageTemplate
      headerTitle="Dekking wijzigen"
      cancelButton
      onCancel={() => router.push("/")}
      ikzSticker
      steps={MUTATIE_STEPS}
      activeStep={0}
      sidebarClassName="w-full"
      sidebar={
        <>
          <div className="w-full min-[600px]:hidden">
            <ReceiptBar amount={formatEuro(nieuwePremie)} onShowDetails={() => setReceiptDialogOpen(true)} />
          </div>

          <div className="hidden w-full min-[600px]:block">
            <Receipt
              title="Opstal"
              icon={<img src="/icons/pictogram-house.svg" alt="" className="size-8" />}
              type="one-section"
              sections={[{ id: "opstal", groups: receiptGroups }]}
              summaryLabel="Je gaat betalen per maand"
              summaryAmount={formatEuro(nieuwePremie)}
              summaryInfo={isGewijzigd ? `Dit was: ${formatEuro(CURRENT_MONTHLY_PRICE)} per maand` : undefined}
            />
          </div>

          <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} title="Opstal">
            <Receipt
              type="one-section"
              sections={[{ id: "opstal", groups: receiptGroups }]}
              summaryLabel="Je gaat betalen per maand"
              summaryAmount={formatEuro(nieuwePremie)}
              summaryInfo={isGewijzigd ? `Dit was: ${formatEuro(CURRENT_MONTHLY_PRICE)} per maand` : undefined}
              className="flex w-full flex-col items-start gap-4"
            />
          </Dialog>
        </>
      }
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Jouw situatie"
          nextLabel="Naar jouw gegevens"
          onPrevious={() => router.push("/")}
          onNext={() => router.push("/mutatie/bevestiging")}
        />
      }
    >
      <Button type="tertiary" iconPrepend="arrow-left" onClick={() => router.push("/")}>
        Terug naar jouw account
      </Button>

      <FunnelSection intro title="Jouw dekking" showRequiredFieldsNote />

      <FunnelSection title="Stel je opstalverzekering samen">
        <RadioCardBottomGroup labelText="Kies je dekking" options={DEKKING_OPTIONS} value={dekking} onChange={setDekking} />

        <RadioGroup
          labelText="Kies je eigen risico"
          description="Dit is het bedrag dat wij aftrekken van een schadevergoeding. Hoe hoger je eigen risico, hoe minder je per maand betaalt."
          options={EIGEN_RISICO_OPTIES}
          value={eigenRisico}
          onChange={setEigenRisico}
        />

        <CheckboxCardControlLeftGroup
          labelText="Welke aanvullende dekking wil je?"
          options={[
            {
              value: "glas",
              title: "Glas",
              description: "Vergoeding voor de kosten van nieuwe ruiten en herstel van beschadigd schilderwerk.",
              price: GLAS_PRICE,
            },
          ]}
          values={aanvullendeDekkingen}
          onChange={setAanvullendeDekkingen}
          onMoreInfoClick={() => {}}
        />
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
