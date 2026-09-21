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
import { DAK_OPTIONS, EIGEN_RISICO_OPTIONS, JA_NEE_OPTIONS, KOOP_HUUR_OPTIONS, MUREN_OPTIONS, SOORT_WONING_OPTIONS } from "../woning-opties";

const OPSTAL_FEATURES = [
  "Brand, bliksem en rook",
  "Storm, neerslag en lekkage",
  "Diefstal, inbraak en vandalisme",
  "Tijdelijke woonruimte bij nood",
  "Ongelukjes zoals vallen en stoten",
];

/**
 * Prijzen 1:1 uit Figma ("Radio Card Control Bottom Group", node 1:38255):
 * Basis € 4,82, Allrisk € 5,20, beide "Opstalverzekering". Let op: de
 * rechter Receipt-kaart in Figma toont voor Basis + eigen risico € 100 een
 * ander bedrag (€ 15,06) dat niet uit deze kaartprijs is af te leiden (geen
 * bevestigde regel legt het verband tussen eigen risico en prijs) — bewust
 * niet zelf een correctiefactor verzonnen om dat bedrag te forceren.
 */
const DEKKING_OPTIES: RadioCardBottomOption[] = [
  {
    value: "basis",
    title: "Basis",
    description: "Opstalverzekering",
    features: OPSTAL_FEATURES.map((text, index) => ({ text, included: index < 4 })),
    price: "4,82",
  },
  {
    value: "allrisk",
    title: "Allrisk",
    description: "Opstalverzekering",
    features: OPSTAL_FEATURES.map((text) => ({ text, included: true })),
    price: "5,20",
  },
];

const GLAS_PRICE = 2.63;

/**
 * Opstal's accordion-body — bevat alleen de "Gegevens"/"Stel je ... samen"-
 * velden van dit ene product. De statusregel (MultiEntityItem), het
 * uit-/inklappen en de navigatie tussen producten horen sinds het
 * accordion-model (Figma Make-broncode "Interactive Transition for
 * Calculator") bij de hoofdpagina (`page.tsx`), niet meer bij dit component
 * — dit was voorheen een losse, volledige pagina met eigen routing.
 */
export function OpstalBody() {
  const { state, setState } = useWoonverzekeringenFunnel();

  /**
   * Houdt bij welke gedeelde velden ÍN DIT product zijn beantwoord — zo'n
   * veld blijft daarna gewoon zichtbaar (met het ingevulde antwoord, nog
   * steeds aanpasbaar) i.p.v. te verdwijnen zodra het is ingevuld. Een veld
   * dat al bekend was TOEN dit component het las (dus door een ánder,
   * eerder ingevuld product) wordt wél overgeslagen — dat voorkomt dubbele
   * vragen tussen producten, zonder dat je eigen zojuist gegeven antwoord
   * verdwijnt.
   */
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
  const { soortWoning, koopHuur, particulier, muren, dak, rietenDak } = state.sharedData;

  const [dekking, setDekking] = useState("basis");
  const [eigenRisico, setEigenRisico] = useState("100");
  const [glas, setGlas] = useState<string[]>(["glas"]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const stelJeOpstalRef = useRef<HTMLDivElement>(null);

  const addressResolved = adres.postalCode.trim().length >= 6 && adres.houseNumber.trim().length > 0;

  const isDataComplete = Boolean(
    geboortedatum && addressResolved && soortWoning && koopHuur && particulier && muren && dak && rietenDak,
  );
  const wasDataComplete = useRef(isDataComplete);

  useEffect(() => {
    if (isDataComplete && !wasDataComplete.current) {
      setShowSkeleton(true);
      requestAnimationFrame(() => {
        const top = stelJeOpstalRef.current?.getBoundingClientRect().top;
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
  const glasPrice = glas.includes("glas") ? GLAS_PRICE : 0;
  const totalPrice = coveragePrice + glasPrice;

  /**
   * Zet Opstal's premie én kassabon-detail reactief door naar de gedeelde
   * state — sinds het accordion-model leest de hoofdpagina dit terug om de
   * kassabon voor ALLE producten te bouwen (`buildProductReceiptSection`),
   * niet meer alleen voor "de pagina waar je nu op zit".
   */
  useEffect(() => {
    const premium = isDataComplete ? totalPrice : null;
    const dekkingOptie = DEKKING_OPTIES.find((o) => o.value === dekking);
    const breakdown = isDataComplete
      ? [
          {
            title: "Dekking",
            items: [
              { label: dekkingOptie?.title ?? "", amount: formatEuro(coveragePrice) },
              { label: `Eigen risico € ${eigenRisico}` },
            ],
          },
          ...(glasPrice > 0 ? [{ title: "Aanvullende dekkingen", items: [{ label: "Glas", amount: formatEuro(glasPrice) }] }] : []),
        ]
      : undefined;
    const current = state.products.opstal;
    if (current?.premium === premium && JSON.stringify(current?.breakdown) === JSON.stringify(breakdown)) return;
    setState({
      ...state,
      products: { ...state.products, opstal: { premium, isComplete: current?.isComplete ?? false, breakdown } },
    });
  }, [isDataComplete, totalPrice, dekking, eigenRisico, glasPrice, coveragePrice, state, setState]);

  /** Als geen van deze velden hier iets te tonen heeft (alles al bekend via een ander product), heeft deze sectie geen inhoud — dan moeten kop, inhoud én de scheidingslijn eronder allemaal weg i.p.v. een lege sectie achterlaten. */
  const showGegevens =
    showSharedField("geboortedatum", geboortedatum) ||
    showSharedField("postcode", adres.postalCode) ||
    addressResolved ||
    showSharedField("soortWoning", soortWoning) ||
    showSharedField("koopHuur", koopHuur) ||
    showSharedField("particulier", particulier) ||
    showSharedField("muren", muren) ||
    showSharedField("dak", dak) ||
    showSharedField("rietenDak", rietenDak);

  return (
    <>
      {showGegevens && (
        <>
      <FunnelSection title="Gegevens">
        {showSharedField("geboortedatum", geboortedatum) && (
          <InputDate
            labelText="Geboortedatum (dd-mm-jjjj)"
            showPickerButton
            value={geboortedatum}
            onChange={(value) => updateSharedData({ geboortedatum: value ? toIsoDatum(value) : "" })}
          />
        )}

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
        </>
      )}

      <div ref={stelJeOpstalRef}>
        <FunnelSection title="Stel je opstalverzekering samen">
          {!isDataComplete ? (
            <Alert type="warning" title="Vul eerst alle gegevens in om je premie te berekenen" description="You can use a description to better explain the alert." />
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
                labelText="Welke aanvullende dekking wil je?"
                options={[
                  {
                    value: "glas",
                    title: "Glas",
                    description: "Vergoeding voor de kosten van nieuwe ruiten en herstel van beschadigd schilderwerk.",
                    price: formatEuro(GLAS_PRICE).replace("€ ", ""),
                  },
                ]}
                values={glas}
                onChange={setGlas}
                onMoreInfoClick={() => {}}
              />
            </>
          )}
        </FunnelSection>
      </div>
    </>
  );
}
