"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { InputDate } from "@/components/InputDate";
import { useMutatieFunnel } from "../funnel-context";
import {
  DEKKING_OPTIONS,
  PRICE_BY_DEKKING,
  GLAS_PRICE,
  CURRENT_MONTHLY_PRICE,
  dekkingTitel,
  berekenNieuwePremie,
  formatEuro,
  toIsoDatum,
  fromIsoDatum,
  type DekkingKeuze,
} from "../pricing";

/** Vroegst mogelijke ingangsdatum: morgen — op verzoek moet de wijziging minimaal in de toekomst liggen, dus vandaag zelf telt niet meer mee. */
function morgen(): Date {
  const vandaag = new Date();
  return new Date(vandaag.getFullYear(), vandaag.getMonth(), vandaag.getDate() + 1);
}

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
 * Op expliciet verzoek is de Bar `fixed` aan de onderkant van het scherm
 * (16px marge) zolang de gebruiker door de pagina scrolt, en verdwijnt hij
 * zodra de echte Receipt Box — dezelfde kaart als op de homepage-demo,
 * hier nu ook zichtbaar op mobiel i.p.v. alleen ≥600px — in beeld komt, net
 * vóór de funnel-footer. Bevestigd via een `IntersectionObserver` op die
 * kaart i.p.v. een vaste scroll-drempel, zodat het exact klopt ongeacht
 * hoe lang het formulier is.
 *
 * `activeStep={1}` (niet `{0}`): `StepIndicator` is 1-indexed (zie zijn eigen
 * prop-doc) — de `{0}` hier was een off-by-one bug die de stap-cirkel nooit
 * als "current" liet renderen en de vul-animatie tussen stap 1 en 2 nooit
 * liet triggeren. Ontdekt en hier gefixt bij het bouwen van die animatie;
 * bewust niet meegenomen in andere funnels (Verzuim/Auto) die dezelfde
 * 0-indexed aanroep gebruiken — buiten scope van dit verzoek.
 *
 * "Meer informatie"-dialogen (Basis/Allrisk/Glas) zijn in Figma wel
 * aanwezig maar bewust niet meegebouwd — buiten scope.
 *
 * Ingangsdatum-veld: op verzoek leeg als standaardwaarde (geen
 * vooringevulde datum meer) — dus "Naar bevestigen" valideert nu eerst of
 * er een datum gekozen is, zelfde patroon als de bevestigingsstap z'n
 * eigen "Ja, ik ga akkoord"-validatie. `InputDate`'s eigen root-breedte
 * (`w-[333px]`, nodig voor de compacte homepage-showcase) is hier
 * overschreven naar `w-full` via de `className`-prop — anders knijpt die
 * vaste breedte het lange labelopschrift in een onnodig smalle kolom,
 * zelfde soort bug als `RadioGroup`'s eerdere 272px-fix.
 */
export default function MutatieDekkingPage() {
  const router = useRouter();
  const { state, setState } = useMutatieFunnel();
  const { dekking, eigenRisico, aanvullendeDekkingen, ingangsdatum } = state;

  const heeftGlas = aanvullendeDekkingen.includes("glas");
  const nieuwePremie = useMemo(() => berekenNieuwePremie(dekking, heeftGlas, eigenRisico), [dekking, heeftGlas, eigenRisico]);
  const isGewijzigd = Math.abs(nieuwePremie - CURRENT_MONTHLY_PRICE) > 0.001;

  /** Prijzen op de dekkingkaarten zelf ("Basis"/"Allrisk") volgen het gekozen eigen risico — op verzoek, zonder glas (dat is een losse, eigen-risico-onafhankelijke aanvulling erna). */
  const dekkingOpties = useMemo(
    () =>
      DEKKING_OPTIONS.map((option) => ({
        ...option,
        price: berekenNieuwePremie(option.value as DekkingKeuze, false, eigenRisico).toFixed(2).replace(".", ","),
      })),
    [eigenRisico],
  );
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [ingangsdatumError, setIngangsdatumError] = useState(false);

  const [receiptBoxVisible, setReceiptBoxVisible] = useState(false);
  const receiptBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = receiptBoxRef.current;
    if (!el) return;
    /** `rootMargin` laat de Bar al verdwijnen vlak vóórdat de Box in beeld komt (i.p.v. pas op het exacte moment) — anders overlapt de fixed Bar heel even de "Jouw situatie"-knop erboven. */
    const observer = new IntersectionObserver(([entry]) => setReceiptBoxVisible(entry.isIntersecting), { rootMargin: "0px 0px 100px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
  function setIngangsdatum(value: Date | null) {
    setState({ ...state, ingangsdatum: value ? toIsoDatum(value) : "" });
    if (value) setIngangsdatumError(false);
  }
  function handleNext() {
    if (!ingangsdatum) {
      setIngangsdatumError(true);
      return;
    }
    router.push("/mutatie/bevestiging");
  }

  return (
    <FunnelPageTemplate
      headerTitle="Dekking wijzigen"
      cancelButton
      onCancel={() => router.push("/mutatie")}
      ikzSticker
      steps={MUTATIE_STEPS}
      activeStep={1}
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
              summaryLabel={isGewijzigd ? "Je gaat betalen per maand" : "Je betaalt per maand"}
              summaryAmount={formatEuro(nieuwePremie)}
              summaryInfo={isGewijzigd ? `Dit was: ${formatEuro(CURRENT_MONTHLY_PRICE)} per maand` : undefined}
            />
          </div>

          <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} title="Opstal">
            <Receipt
              type="one-section"
              sections={[{ id: "opstal", groups: receiptGroups }]}
              summaryLabel={isGewijzigd ? "Je gaat betalen per maand" : "Je betaalt per maand"}
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
          previousLabel="Terug naar jouw account"
          nextLabel="Naar bevestigen"
          onPrevious={() => router.push("/mutatie")}
          onNext={handleNext}
        />
      }
    >
      <Button type="tertiary" iconPrepend="arrow-left" onClick={() => router.push("/mutatie")}>
        Terug naar jouw account
      </Button>

      <FunnelSection intro title="Jouw dekking" showRequiredFieldsNote />

      <FunnelSection title="Stel je opstalverzekering samen">
        <RadioCardBottomGroup labelText="Kies je dekking" options={dekkingOpties} value={dekking} onChange={setDekking} />

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

        <InputDate
          className="relative isolate flex w-full flex-col items-start gap-2"
          labelText="Per wanneer wil je dat de wijziging ingaat?"
          showPickerButton
          minDate={morgen()}
          value={ingangsdatum ? fromIsoDatum(ingangsdatum) : null}
          onChange={setIngangsdatum}
          error={ingangsdatumError ? "Kies een datum" : undefined}
        />
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
