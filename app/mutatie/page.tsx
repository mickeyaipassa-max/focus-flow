"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { Button } from "@/components/Button";
import { RadioCardBottomGroup } from "@/components/RadioCardBottom";
import { RadioGroup } from "@/components/RadioGroup";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
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
 * De receipt-kaart rechts is hier inline opgebouwd (geen los component,
 * zelfde precedent als Verzuim's sidebar-lijst in app/verzuim/page.tsx) —
 * exact nagebouwd uit node 8031:10753 (drie geneste "Funnel Box"-lagen zijn
 * Figma-exportartefacten van hetzelfde component, hier samengevat tot de
 * ene laag die FunnelPageTemplate al automatisch aanbrengt, plus de eigen
 * geneste "Receipt Box"-kaart eromheen).
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
      headerTitle="Dekking Opstalverzekering wijzigen"
      cancelButton
      onCancel={() => router.push("/")}
      ikzSticker
      steps={MUTATIE_STEPS}
      activeStep={0}
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
            {isGewijzigd && (
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
