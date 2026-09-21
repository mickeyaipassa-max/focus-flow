"use client";

import { useEffect, useRef, useState } from "react";
import { FunnelSection } from "@/components/FunnelSection";
import { InputDate } from "@/components/InputDate";
import { FieldsetAddress, type FieldsetAddressValue } from "@/components/FieldsetAddress";
import { CardDetails } from "@/components/CardDetails";
import { Select } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { SingleDekking } from "@/components/SingleDekking";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
import { Alert } from "@/components/Alert";
import { fromIsoDatum, toIsoDatum, useWoonverzekeringenFunnel, type WoonverzekeringenSharedData } from "../funnel-context";
import { formatEuro } from "../products";
import { GEZINSSAMENSTELLING_OPTIONS, KOOP_HUUR_OPTIONS } from "../woning-opties";

/** Bevestigd via mcp (node 181:7475): het basispakket, altijd inbegrepen — geen tweede keuzeoptie zichtbaar (de tweede "Radio Card Control Bottom"-instance in dezelfde node staat op hidden, op verzoek genegeerd). */
const BASISPAKKET_PRICE = 13.37;
const BASISPAKKET_ITEMS = [
  "...over een aankoop van goederen en diensten",
  "...over gezondheid en contracten",
  "...over je (vakantie)woning in Nederland",
  "...over sociale zekerheid en pensioen",
  "... met een financiële instelling",
  ".... met een onderwijsinstelling",
  "... met de buren",
  "... de overheid als het gaat over een beslissing over je woning",
];

/** Prijzen 1:1 uit Figma (node 181:7478, "Checkbox Card Control Left Group"). */
const AANVULLENDE_DEKKINGEN_PRICES: Record<string, number> = {
  "verkeer-vakantie": 2.8,
  "persoon-familie": 6.99,
  werk: 12.57,
  "fiscaal-vermogen": 3.35,
};

const AANVULLENDE_DEKKINGEN_LABELS: Record<string, string> = {
  "verkeer-vakantie": "Verkeer & Vakantie",
  "persoon-familie": "Persoon & Familie",
  werk: "Werk",
  "fiscaal-vermogen": "Fiscaal & Vermogen",
};

/** Rechtsbijstand's accordion-body — zie de toelichting in `OpstalBody.tsx` over de overgang naar het accordion-model. */
export function RechtsbijstandBody() {
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
  const { gezinssamenstelling, koopHuur } = state.sharedData;
  const addressResolved = adres.postalCode.trim().length >= 6 && adres.houseNumber.trim().length > 0;

  const [aanvullendeDekkingen, setAanvullendeDekkingen] = useState<string[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const stelJeRechtsbijstandRef = useRef<HTMLDivElement>(null);

  const isDataComplete = Boolean(gezinssamenstelling && geboortedatum && koopHuur && addressResolved);
  const wasDataComplete = useRef(isDataComplete);

  useEffect(() => {
    if (isDataComplete && !wasDataComplete.current) {
      setShowSkeleton(true);
      requestAnimationFrame(() => {
        const top = stelJeRechtsbijstandRef.current?.getBoundingClientRect().top;
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

  const aanvullendeDekkingenPrice = aanvullendeDekkingen.reduce((sum, value) => sum + (AANVULLENDE_DEKKINGEN_PRICES[value] ?? 0), 0);
  const totalPrice = BASISPAKKET_PRICE + aanvullendeDekkingenPrice;

  useEffect(() => {
    const premium = isDataComplete ? totalPrice : null;
    const aanvullendeItems = Object.entries(AANVULLENDE_DEKKINGEN_PRICES)
      .filter(([value]) => aanvullendeDekkingen.includes(value))
      .map(([, price]) => price);
    const breakdown = isDataComplete
      ? [
          { title: "Dekking", items: [{ label: "Consument & Wonen", amount: formatEuro(BASISPAKKET_PRICE) }] },
          ...(aanvullendeItems.length > 0
            ? [
                {
                  title: "Aanvullende dekkingen",
                  items: aanvullendeDekkingen.map((value) => ({
                    label: AANVULLENDE_DEKKINGEN_LABELS[value],
                    amount: formatEuro(AANVULLENDE_DEKKINGEN_PRICES[value] ?? 0),
                  })),
                },
              ]
            : []),
        ]
      : undefined;
    const current = state.products.rechtsbijstand;
    if (current?.premium === premium && JSON.stringify(current?.breakdown) === JSON.stringify(breakdown)) return;
    setState({
      ...state,
      products: { ...state.products, rechtsbijstand: { premium, isComplete: current?.isComplete ?? false, breakdown } },
    });
  }, [isDataComplete, totalPrice, aanvullendeDekkingen, state, setState]);

  /** Als geen van deze velden hier iets te tonen heeft (alles al bekend via een ander product), heeft deze sectie geen inhoud — dan moeten kop, inhoud én de scheidingslijn eronder allemaal weg i.p.v. een lege sectie achterlaten. */
  const showGegevens =
    showSharedField("gezinssamenstelling", gezinssamenstelling) ||
    showSharedField("geboortedatum", geboortedatum) ||
    showSharedField("koopHuur", koopHuur) ||
    showSharedField("postcode", adres.postalCode) ||
    addressResolved;

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

        {showSharedField("koopHuur", koopHuur) && (
          <RadioGroup
            labelText="Koop- of huurwoning"
            options={KOOP_HUUR_OPTIONS}
            value={koopHuur}
            onChange={(value) => updateSharedData({ koopHuur: value })}
            horizontal
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
      </FunnelSection>

      <div className="h-px w-[calc(100%+3rem)] shrink-0 bg-[rgba(0,0,0,0.08)] -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10" />
        </>
      )}

      <div ref={stelJeRechtsbijstandRef}>
        <FunnelSection title="Stel je Rechtsbijstandsverzekering samen">
          {!isDataComplete ? (
            <Alert
              type="warning"
              title="Vul eerst alle gegevens in om je premie te berekenen"
              description="You can use a description to better explain the alert."
            />
          ) : showSkeleton ? (
            <div className="flex w-full flex-col items-start gap-6" aria-hidden="true">
              <div className="h-96 w-full animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              <div className="flex w-full flex-col gap-3">
                <div className="h-7 w-[280px] animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                <div className="h-20 w-full animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
                <div className="h-20 w-full animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              </div>
            </div>
          ) : (
            <>
              <SingleDekking
                title="Consument & Wonen"
                description="Juridische hulp bij conflicten..."
                items={BASISPAKKET_ITEMS}
                price={BASISPAKKET_PRICE.toFixed(2).replace(".", ",")}
                onTermsClick={() => {}}
              />
              <CheckboxCardControlLeftGroup
                labelText="Kies je aanvullende dekkingen"
                options={[
                  {
                    value: "verkeer-vakantie",
                    title: "Verkeer & Vakantie",
                    price: formatEuro(AANVULLENDE_DEKKINGEN_PRICES["verkeer-vakantie"]).replace("€ ", ""),
                  },
                  {
                    value: "persoon-familie",
                    title: "Persoon & Familie",
                    price: formatEuro(AANVULLENDE_DEKKINGEN_PRICES["persoon-familie"]).replace("€ ", ""),
                  },
                  {
                    value: "werk",
                    title: "Werk",
                    price: formatEuro(AANVULLENDE_DEKKINGEN_PRICES["werk"]).replace("€ ", ""),
                  },
                  {
                    value: "fiscaal-vermogen",
                    title: "Fiscaal & Vermogen",
                    price: formatEuro(AANVULLENDE_DEKKINGEN_PRICES["fiscaal-vermogen"]).replace("€ ", ""),
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
