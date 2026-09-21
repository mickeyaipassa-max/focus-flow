"use client";

import { useEffect, useRef, useState } from "react";
import { FunnelSection } from "@/components/FunnelSection";
import { InputDate } from "@/components/InputDate";
import { Select } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
import { Alert } from "@/components/Alert";
import { fromIsoDatum, toIsoDatum, useWoonverzekeringenFunnel, type WoonverzekeringenSharedData } from "../funnel-context";
import { formatEuro } from "../products";
import { EIGEN_RISICO_OPTIONS, GEZINSSAMENSTELLING_OPTIONS } from "../woning-opties";

/**
 * Bedragen expliciet door de opdrachtgever doorgegeven (niet uit Figma): de
 * "Kies een maximaal verzekerd bedrag"-kaarten (node
 * 180:5051;10783:74593;1099:302;11092:3714/3715) tonen zelf geen prijs — geen
 * enkele mcp-node voor Aansprakelijkheid liet een bedrag zien (in
 * tegenstelling tot Opstal/Inboedel). Het gekozen eigen risico verandert de
 * premie niet — daar is ook geen bedrag voor doorgegeven.
 */
const MAXIMAAL_VERZEKERD_OPTIES: RadioCardBottomOption[] = [
  { value: "1250000", title: "Tot € 1.250.000" },
  { value: "2500000", title: "Tot € 2.500.000" },
];
const MAXIMAAL_VERZEKERD_PRICES: Record<string, number> = {
  "1250000": 4.5,
  "2500000": 6.2,
};

/** Aansprakelijkheid's accordion-body — zie de toelichting in `OpstalBody.tsx` over de overgang naar het accordion-model. */
export function AansprakelijkheidBody() {
  const { state, setState } = useWoonverzekeringenFunnel();

  /** Zie de toelichting in `OpstalBody.tsx`: een gedeeld veld dat hier is beantwoord blijft zichtbaar; een veld dat al bekend was via een ander product wordt overgeslagen. */
  const answeredHereRef = useRef<Set<keyof WoonverzekeringenSharedData>>(new Set());

  function updateSharedData(patch: Partial<WoonverzekeringenSharedData>) {
    (Object.keys(patch) as (keyof WoonverzekeringenSharedData)[]).forEach((key) => answeredHereRef.current.add(key));
    setState({ ...state, sharedData: { ...state.sharedData, ...patch } });
  }

  function showSharedField(key: keyof WoonverzekeringenSharedData, value: unknown): boolean {
    return !value || answeredHereRef.current.has(key);
  }

  const geboortedatum = fromIsoDatum(state.sharedData.geboortedatum);
  const { gezinssamenstelling } = state.sharedData;

  const [maximaalVerzekerd, setMaximaalVerzekerd] = useState("");
  const [eigenRisico, setEigenRisico] = useState("");
  const [showSkeleton, setShowSkeleton] = useState(false);
  const stelJeAansprakelijkheidRef = useRef<HTMLDivElement>(null);

  const isDataComplete = Boolean(gezinssamenstelling && geboortedatum);
  const wasDataComplete = useRef(isDataComplete);

  useEffect(() => {
    if (isDataComplete && !wasDataComplete.current) {
      setShowSkeleton(true);
      requestAnimationFrame(() => {
        const top = stelJeAansprakelijkheidRef.current?.getBoundingClientRect().top;
        if (top !== undefined) {
          window.scrollTo({ top: top + window.scrollY - 80, behavior: "smooth" });
        }
      });
      const timeout = setTimeout(() => setShowSkeleton(false), 1000);
      wasDataComplete.current = isDataComplete;
      return () => clearTimeout(timeout);
    }
    wasDataComplete.current = isDataComplete;
  }, [isDataComplete]);

  const coveragePrice = MAXIMAAL_VERZEKERD_PRICES[maximaalVerzekerd] ?? 0;
  const totalPrice = coveragePrice;

  useEffect(() => {
    const premium = isDataComplete ? totalPrice : null;
    const optie = MAXIMAAL_VERZEKERD_OPTIES.find((option) => option.value === maximaalVerzekerd);
    const breakdown = isDataComplete
      ? [
          {
            title: "Dekking",
            items: [
              { label: optie?.title ?? "", amount: formatEuro(coveragePrice) },
              { label: `Eigen risico € ${eigenRisico}` },
            ],
          },
        ]
      : undefined;
    const current = state.products.aansprakelijkheid;
    if (current?.premium === premium && JSON.stringify(current?.breakdown) === JSON.stringify(breakdown)) return;
    setState({
      ...state,
      products: { ...state.products, aansprakelijkheid: { premium, isComplete: current?.isComplete ?? false, breakdown } },
    });
  }, [isDataComplete, totalPrice, maximaalVerzekerd, eigenRisico, coveragePrice, state, setState]);

  /** Als beide velden al via een ander product bekend zijn, heeft deze sectie geen enkel veld om te tonen — dan moeten kop, inhoud én de scheidingslijn eronder allemaal weg i.p.v. een lege sectie achterlaten. */
  const showGegevens = showSharedField("gezinssamenstelling", gezinssamenstelling) || showSharedField("geboortedatum", geboortedatum);

  return (
    <>
      {showGegevens && (
        <>
          <FunnelSection title="Gegevens">
            {showSharedField("gezinssamenstelling", gezinssamenstelling) && (
              <Select
                labelText="Hoe is je gezin samengesteld?"
                options={GEZINSSAMENSTELLING_OPTIONS}
                value={gezinssamenstelling}
                onChange={(value) => updateSharedData({ gezinssamenstelling: value })}
              />
            )}
            {showSharedField("geboortedatum", geboortedatum) && (
              <InputDate
                labelText="Geboortedatum (dd-mm-jjjj)"
                showPickerButton
                value={geboortedatum}
                onChange={(value) => updateSharedData({ geboortedatum: value ? toIsoDatum(value) : "" })}
              />
            )}
          </FunnelSection>

          <div className="h-px w-[calc(100%+3rem)] shrink-0 bg-[rgba(0,0,0,0.08)] -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10" />
        </>
      )}

      <div ref={stelJeAansprakelijkheidRef}>
        <FunnelSection title="Stel je Aansprakelijkheidsverzekering samen">
          {!isDataComplete ? (
            <Alert
              type="warning"
              title="Vul eerst alle gegevens in om je premie te berekenen"
              description="You can use a description to better explain the alert."
            />
          ) : showSkeleton ? (
            <div className="flex w-full flex-col items-start gap-6" aria-hidden="true">
              <div className="h-7 w-[180px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
              <div className="flex w-full gap-4">
                <div className="h-40 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
                <div className="h-40 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              </div>
              <div className="flex w-full flex-col gap-3">
                <div className="h-7 w-[200px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
              </div>
            </div>
          ) : (
            <>
              <RadioCardBottomGroup
                labelText="Kies een maximaal verzekerd bedrag"
                description={
                  <>
                    <p className="mb-0 w-full text-[16px] leading-[1.5]">
                      Per schadegeval geldt een maximaal verzekerd bedrag voor alle verzekerden samen.
                    </p>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="w-full text-left text-[#0064a8] text-[16px] leading-[1.5] underline [text-underline-position:from-font]"
                    >
                      Bekijk wie en wat is verzekerd
                    </button>
                  </>
                }
                variant="compact"
                options={MAXIMAAL_VERZEKERD_OPTIES}
                value={maximaalVerzekerd}
                onChange={setMaximaalVerzekerd}
              />
              <RadioGroup
                labelText="Kies je eigen risico"
                description="Dit is het bedrag dat wij aftrekken van een schadevergoeding. Hoe hoger je eigen risico, hoe minder je per maand betaalt."
                options={EIGEN_RISICO_OPTIONS}
                value={eigenRisico}
                onChange={setEigenRisico}
              />
            </>
          )}
        </FunnelSection>
      </div>
    </>
  );
}
