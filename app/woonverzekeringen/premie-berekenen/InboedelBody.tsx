"use client";

import { useEffect, useRef, useState } from "react";
import { FunnelSection } from "@/components/FunnelSection";
import { InputDate } from "@/components/InputDate";
import { FieldsetAddress, type FieldsetAddressValue } from "@/components/FieldsetAddress";
import { CardDetails } from "@/components/CardDetails";
import { Select } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
import { Alert } from "@/components/Alert";
import { fromIsoDatum, toIsoDatum, useWoonverzekeringenFunnel, type WoonverzekeringenSharedData } from "../funnel-context";
import { formatEuro } from "../products";
import {
  DAK_OPTIONS,
  EIGEN_RISICO_OPTIONS,
  GEZINSSAMENSTELLING_OPTIONS,
  JA_NEE_OPTIONS,
  KOOP_HUUR_OPTIONS,
  MUREN_OPTIONS,
  SOORT_WONING_OPTIONS,
} from "../woning-opties";

const INBOEDEL_FEATURES = [
  "Brand, bliksem en rook",
  "Storm, neerslag en lekkage",
  "Diefstal, inbraak en vandalisme",
  "Cybercriminaliteit zoals phishing",
  "Ongelukjes zoals vallen en stoten",
];

/**
 * Prijzen 1:1 uit Figma ("Radio Card Control Bottom Group", node 88:3914):
 * Basis € 4,82, Allrisk € 5,20 — exact dezelfde bedragen als Opstal's eigen
 * Basis/Allrisk-kaart. Geen bevestigde reden gevonden of dit bewust is of
 * een gekopieerde placeholder — niet zelf gecorrigeerd.
 */
const DEKKING_OPTIES: RadioCardBottomOption[] = [
  {
    value: "basis",
    title: "Basis",
    description: "Inboedelverzekering",
    features: INBOEDEL_FEATURES.map((text, index) => ({ text, included: index < 4 })),
    price: "4,82",
  },
  {
    value: "allrisk",
    title: "Allrisk",
    description: "Inboedelverzekering",
    features: INBOEDEL_FEATURES.map((text) => ({ text, included: true })),
    price: "5,20",
  },
];

/** Bevestigd via mcp op de "Checkbox Card Control Left"-kaarten (node 88:3925/88:3926). */
const MOBIELE_ELEKTRONICA_PRICE = 9.68;
const WAARDEVOLLE_SPULLEN_PRICE = 5.3;

/** Inboedel's accordion-body — zie de toelichting in `OpstalBody.tsx` over de overgang naar het accordion-model. */
export function InboedelBody() {
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
  const adres: FieldsetAddressValue = {
    postalCode: state.sharedData.postcode,
    houseNumber: state.sharedData.huisnummer,
    addition: state.sharedData.toevoeging,
  };
  const { gezinssamenstelling, soortWoning, koopHuur, particulier, muren, dak, rietenDak } = state.sharedData;
  const addressResolved = adres.postalCode.trim().length >= 6 && adres.houseNumber.trim().length > 0;

  const [dekking, setDekking] = useState("");
  const [eigenRisico, setEigenRisico] = useState("");
  const [aanvullendeDekkingen, setAanvullendeDekkingen] = useState<string[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const stelJeInboedelRef = useRef<HTMLDivElement>(null);

  const isDataComplete = Boolean(
    gezinssamenstelling && geboortedatum && addressResolved && soortWoning && koopHuur && particulier && muren && dak && rietenDak,
  );
  const wasDataComplete = useRef(isDataComplete);

  useEffect(() => {
    if (isDataComplete && !wasDataComplete.current) {
      setShowSkeleton(true);
      requestAnimationFrame(() => {
        const top = stelJeInboedelRef.current?.getBoundingClientRect().top;
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

  const coveragePrice = dekking === "basis" ? 4.82 : dekking === "allrisk" ? 5.2 : 0;
  const mobieleElektronicaPrice = aanvullendeDekkingen.includes("mobiele-elektronica") ? MOBIELE_ELEKTRONICA_PRICE : 0;
  const waardevolleSpullenPrice = aanvullendeDekkingen.includes("waardevolle-spullen") ? WAARDEVOLLE_SPULLEN_PRICE : 0;
  const totalPrice = coveragePrice + mobieleElektronicaPrice + waardevolleSpullenPrice;

  useEffect(() => {
    const premium = isDataComplete ? totalPrice : null;
    const dekkingOptie = DEKKING_OPTIES.find((optie) => optie.value === dekking);
    const aanvullendeItems = [
      ...(mobieleElektronicaPrice > 0 ? [{ label: "Mobiele elektronica", amount: formatEuro(mobieleElektronicaPrice) }] : []),
      ...(waardevolleSpullenPrice > 0 ? [{ label: "Waardevolle spullen buitenshuis", amount: formatEuro(waardevolleSpullenPrice) }] : []),
    ];
    const breakdown = isDataComplete
      ? [
          {
            title: "Dekking",
            items: [
              { label: dekkingOptie?.title ?? "", amount: formatEuro(coveragePrice) },
              { label: `Eigen risico € ${eigenRisico}` },
            ],
          },
          ...(aanvullendeItems.length > 0 ? [{ title: "Aanvullende dekkingen", items: aanvullendeItems }] : []),
        ]
      : undefined;
    const current = state.products.inboedel;
    if (current?.premium === premium && JSON.stringify(current?.breakdown) === JSON.stringify(breakdown)) return;
    setState({
      ...state,
      products: { ...state.products, inboedel: { premium, isComplete: current?.isComplete ?? false, breakdown } },
    });
  }, [isDataComplete, totalPrice, dekking, eigenRisico, mobieleElektronicaPrice, waardevolleSpullenPrice, coveragePrice, state, setState]);

  return (
    <>
      <FunnelSection title="Persoonlijke gegevens">
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

      <FunnelSection title="Je woning" showDividerAbove>
        {showSharedField("postcode", adres.postalCode) && (
          <FieldsetAddress
            value={adres}
            onChange={(value) => updateSharedData({ postcode: value.postalCode, huisnummer: value.houseNumber, toevoeging: value.addition })}
            helperText={addressResolved ? "" : undefined}
          />
        )}

        {addressResolved && (
          <CardDetails
            title="Deze gegevens hebben we opgehaald"
            cardActionEdit={false}
            rows={[
              { label: "Straat en huisnummer", value: "Dorpslaan 10" },
              { label: "Plaats", value: "Utrecht" },
              { label: "Oppervlakte", value: "119 m²" },
              { label: "Bouwjaar", value: "1972" },
            ]}
          />
        )}

        {showSharedField("soortWoning", soortWoning) && (
          <Select
            labelText="Wat voor soort woning heb je?"
            description="Je kunt geen recreatiewoning, woonboot, studentenkamer, monument of bedrijfspand bij ons verzekeren."
            options={SOORT_WONING_OPTIONS}
            value={soortWoning}
            onChange={(value) => updateSharedData({ soortWoning: value })}
          />
        )}

        {showSharedField("koopHuur", koopHuur) && (
          <RadioGroup
            labelText="Heb je een koop- of huurwoning?"
            options={KOOP_HUUR_OPTIONS}
            value={koopHuur}
            onChange={(value) => updateSharedData({ koopHuur: value })}
          />
        )}

        {showSharedField("particulier", particulier) && (
          <RadioGroup
            labelText="Gebruik je de woning particulier?"
            options={JA_NEE_OPTIONS}
            value={particulier}
            onChange={(value) => updateSharedData({ particulier: value })}
            horizontal
          />
        )}

        {showSharedField("muren", muren) && (
          <RadioGroup
            labelText="Wat voor muren heeft je woning?"
            description="Geef aan van welk materiaal de muren van je woning zijn."
            options={MUREN_OPTIONS}
            value={muren}
            onChange={(value) => updateSharedData({ muren: value })}
          />
        )}

        {showSharedField("dak", dak) && (
          <RadioGroup
            labelText="Is het dak van je woning schuin of plat?"
            description="Heb je beide? Kies dan het soort dak dat het grootste deel van je woning heeft."
            options={DAK_OPTIONS}
            value={dak}
            onChange={(value) => updateSharedData({ dak: value })}
          />
        )}

        {showSharedField("rietenDak", rietenDak) && (
          <RadioGroup
            labelText="Heeft je woning een rieten dak?"
            options={JA_NEE_OPTIONS}
            value={rietenDak}
            onChange={(value) => updateSharedData({ rietenDak: value })}
            horizontal
          />
        )}
      </FunnelSection>

      <div className="h-px w-[calc(100%+3rem)] shrink-0 bg-[rgba(0,0,0,0.08)] -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10" />

      <div ref={stelJeInboedelRef}>
        <FunnelSection title="Stel je inboedelverzekering samen">
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
                <div className="h-80 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
                <div className="h-80 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              </div>
              <div className="flex w-full flex-col gap-3">
                <div className="h-7 w-[200px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-[22px] w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
              </div>
              <div className="flex w-full flex-col gap-3">
                <div className="h-7 w-[280px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-20 w-full animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              </div>
            </div>
          ) : (
            <>
              <RadioCardBottomGroup labelText="Kies je dekking" options={DEKKING_OPTIES} value={dekking} onChange={setDekking} onMoreInfoClick={() => {}} />
              <RadioGroup
                labelText="Kies je eigen risico"
                description="Dit is het bedrag dat wij aftrekken van een schadevergoeding. Hoe hoger je eigen risico, hoe minder je per maand betaalt."
                options={EIGEN_RISICO_OPTIONS}
                value={eigenRisico}
                onChange={setEigenRisico}
              />
              <CheckboxCardControlLeftGroup
                labelText="Welke aanvullende dekkingen wil je?"
                options={[
                  {
                    value: "mobiele-elektronica",
                    title: "Mobiele elektronica",
                    description:
                      "Al je mobiele apparaten zoals je telefoon verzekerd voor onverwachte gebeurtenissen zoals vallen of diefstal. Overal ter wereld.",
                    price: formatEuro(MOBIELE_ELEKTRONICA_PRICE).replace("€ ", ""),
                  },
                  {
                    value: "waardevolle-spullen",
                    title: "Waardevolle spullen buitenshuis",
                    description: "Je waardevolle spullen niet alleen binnenshuis maar overal ter wereld verzekerd voor beschadiging, diefstal of verlies.",
                    price: formatEuro(WAARDEVOLLE_SPULLEN_PRICE).replace("€ ", ""),
                  },
                ]}
                values={aanvullendeDekkingen}
                onChange={setAanvullendeDekkingen}
                onMoreInfoClick={() => {}}
              />
            </>
          )}
        </FunnelSection>
      </div>
    </>
  );
}
