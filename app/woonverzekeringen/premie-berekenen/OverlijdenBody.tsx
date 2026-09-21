"use client";

import { useEffect, useRef, useState } from "react";
import { FunnelSection } from "@/components/FunnelSection";
import { InputDate } from "@/components/InputDate";
import { InputCurrency } from "@/components/InputCurrency";
import { InputPercentage } from "@/components/InputPercentage";
import { Select } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { RadioCardGroup, type RadioCardOption } from "@/components/RadioCardGroup";
import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
import { Alert } from "@/components/Alert";
import { useWoonverzekeringenFunnel, type WoonverzekeringenSharedData } from "../funnel-context";
import { formatEuro } from "../products";
import { JA_NEE_OPTIONS, KOOP_HUUR_OPTIONS } from "../woning-opties";

/** Écht Overlijdensrisico-specifiek — geen ander product vraagt dit. */
const WIE_VERZEKEREN_OPTIONS = [
  { value: "mijzelf", label: "Mijzelf" },
  { value: "iemand-anders", label: "Iemand anders" },
  { value: "mijzelf-en-iemand-anders", label: "Mijzelf en iemand anders" },
];

/** Bevestigd via mcp (node 189:9135, "Radio Card Control Left Group") — de derde optie herhaalt in Figma zelf letterlijk dezelfde tekst als titel én subtekst, hier bewust ongewijzigd overgenomen. */
const LOOPTIJD_OPTIONS: RadioCardOption[] = [
  { value: "zo-lang-mogelijk", label: "Zo lang mogelijk", description: "Tot je 75ste verjaardag" },
  { value: "net-zo-lang-als-hypotheek", label: "Net zo lang als de hypotheek", description: "Gelijk aan de overgebleven hypotheekduur" },
  { value: "aantal-jaren", label: "Vul het aantal jaren in", description: "Vul het aantal jaren in" },
];

/**
 * Bevestigd via mcp (node 189:9926/189:9938): geen prijs per kaart, alleen
 * een featurelijst (altijd "included", geen cross-varianten) en een eigen
 * "Meer over ..."-link per kaart i.p.v. de generieke "Meer informatie".
 */
const BEDRAG_VORM_OPTIES: RadioCardBottomOption[] = [
  {
    value: "gelijkblijvend",
    title: "Gelijkblijvend bedrag",
    features: [
      { text: "Verzekerd bedrag blijft hetzelfde", included: true },
      { text: "Als je verwacht dat de kosten gelijkblijven voor je nabestaanden", included: true },
    ],
    moreInfoLabel: "Meer over Gelijkblijvend bedrag",
  },
  {
    value: "annuitair-dalend",
    title: "Annuïtair dalend bedrag",
    features: [
      { text: "Verzekerd bedrag daalt eerst langzaam, daarna sneller tot € 0", included: true },
      { text: "Als de kosten voor je nabestaanden eerst langzaam afnemen en daarna sneller afnemen", included: true },
    ],
    moreInfoLabel: "Meer over Annuïtair dalend bedrag",
  },
  {
    value: "lineair-dalend",
    title: "Lineair dalend bedrag",
    features: [
      { text: "Verzekerd bedrag daalt ieder jaar met hetzelfde bedrag tot € 0", included: true },
      { text: "Als de kosten voor je nabestaanden in de toekomst langzaam afnemen", included: true },
    ],
    moreInfoLabel: "Meer over Lineair dalend bedrag",
  },
];

/** Geen mcp-bevestiging van de daadwerkelijke opties — de Figma-instance toont alleen de "Maak een keuze"-placeholder. Gangbare premie-betaaltermijnen gebruikt, zelfde behandeling als eerdere niet-bevestigde optielijsten (bv. SOORT_WONING_OPTIONS). */
const PREMIE_BETALEN_PER_OPTIONS = [
  { value: "maand", label: "Maand" },
  { value: "kwartaal", label: "Kwartaal" },
  { value: "jaar", label: "Jaar" },
];

/**
 * Bevestigd via mcp (node 189:10244, "Receipt Summary"): een vast bedrag
 * (€ 2,41 per maand), niet afgeleid van een zichtbare formule op basis van
 * verzekerd bedrag/looptijd/rentepercentage/rookgedrag. De eenmalige
 * afsluitkosten-tekst staat letterlijk in dezelfde node.
 */
const PREMIUM = 2.41;
/** Geëxporteerd zodat de hoofdpagina 'm kan tonen in de gedeelde kassabon-footer (`Receipt`'s `summaryInfo` is één tekst voor de hele kassabon, geen per-product-slot). */
export const OVERLIJDEN_AFSLUITKOSTEN_INFO =
  "Je betaalt eenmalig € 55,- afsluitkosten voor de verzekering, samen met je eerste premie. Dit zijn de kosten voor het verwerken van je aanvraag. Daarom is de eerste betaling hoger dan de premie die je daarna betaalt.";

/** Overlijdensrisico's accordion-body — zie de toelichting in `OpstalBody.tsx` over de overgang naar het accordion-model. */
export function OverlijdenBody() {
  const { state, setState } = useWoonverzekeringenFunnel();

  function updateSharedData(patch: Partial<WoonverzekeringenSharedData>) {
    setState({ ...state, sharedData: { ...state.sharedData, ...patch } });
  }

  const { koopHuur } = state.sharedData;

  const [wieVerzekeren, setWieVerzekeren] = useState("");
  const [gerookt, setGerookt] = useState("");
  const [ingangsdatum, setIngangsdatum] = useState<Date | null>(null);
  const [looptijd, setLooptijd] = useState("");
  const [verzekerdBedrag, setVerzekerdBedrag] = useState("");
  const [bedragVorm, setBedragVorm] = useState("");
  const [rentepercentage, setRentepercentage] = useState("");
  const [premieBetalenPer, setPremieBetalenPer] = useState("");
  const [voorHypotheekAflossen, setVoorHypotheekAflossen] = useState("");
  const [showSkeleton, setShowSkeleton] = useState(false);
  const stelJeOverlijdenRef = useRef<HTMLDivElement>(null);

  const isDataComplete = Boolean(wieVerzekeren && gerookt && koopHuur && ingangsdatum && looptijd);
  const wasDataComplete = useRef(isDataComplete);

  useEffect(() => {
    if (isDataComplete && !wasDataComplete.current) {
      setShowSkeleton(true);
      requestAnimationFrame(() => {
        const top = stelJeOverlijdenRef.current?.getBoundingClientRect().top;
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

  const isVolledigIngevuld = Boolean(
    isDataComplete && verzekerdBedrag && bedragVorm && rentepercentage && premieBetalenPer && voorHypotheekAflossen,
  );
  const totalPrice = isVolledigIngevuld ? PREMIUM : 0;

  useEffect(() => {
    const premium = isVolledigIngevuld ? totalPrice : null;
    const bedragVormOptie = BEDRAG_VORM_OPTIES.find((optie) => optie.value === bedragVorm);
    const breakdown = isVolledigIngevuld
      ? [
          {
            title: "Dekking",
            items: [{ label: bedragVormOptie?.title ?? "" }, { label: `Verzekerd bedrag € ${verzekerdBedrag}` }],
          },
        ]
      : undefined;
    const current = state.products.overlijden;
    if (current?.premium === premium && JSON.stringify(current?.breakdown) === JSON.stringify(breakdown)) return;
    setState({
      ...state,
      products: { ...state.products, overlijden: { premium, isComplete: current?.isComplete ?? false, breakdown } },
    });
  }, [isVolledigIngevuld, totalPrice, bedragVorm, verzekerdBedrag, state, setState]);

  return (
    <>
      {!isDataComplete && (
        <FunnelSection title="Gegevens">
          {!wieVerzekeren && (
            <RadioGroup labelText="Wie wil je verzekeren" options={WIE_VERZEKEREN_OPTIONS} value={wieVerzekeren} onChange={setWieVerzekeren} />
          )}

          {!gerookt && (
            <RadioGroup
              labelText="Heb je de afgelopen twee jaar gerookt?"
              options={JA_NEE_OPTIONS}
              value={gerookt}
              onChange={setGerookt}
              horizontal
            />
          )}

          {!koopHuur && (
            <RadioGroup
              labelText="Koop- of huurwoning"
              options={KOOP_HUUR_OPTIONS}
              value={koopHuur}
              onChange={(value) => updateSharedData({ koopHuur: value })}
              horizontal
            />
          )}

          {!ingangsdatum && (
            <InputDate
              labelText="Wanneer wil je dat de verzekering begint? (dd-mm-jjjj)"
              showPickerButton
              value={ingangsdatum}
              onChange={setIngangsdatum}
            />
          )}

          {!looptijd && (
            <RadioCardGroup
              labelText="Hoelang wil je dat de verzekering duurt?"
              description="De verzekering moet tussen de 1 en 50 jaar duren. Je mag niet ouder zijn dan 75 jaar op de einddatum van de verzekering. Verandert jouw situatie? Dan kun je later nog aanpassen hoe lang je wil dat de verzekering duurt."
              options={LOOPTIJD_OPTIONS}
              value={looptijd}
              onChange={setLooptijd}
            />
          )}
        </FunnelSection>
      )}

      <div className="h-px w-[calc(100%+3rem)] shrink-0 bg-[rgba(0,0,0,0.08)] -mx-6 min-[1200px]:w-[calc(100%+5rem)] min-[1200px]:-mx-10" />

      <div ref={stelJeOverlijdenRef}>
        <FunnelSection title="Stel je Overlijdensrisicoverzekering samen">
          {!isDataComplete ? (
            <Alert
              type="warning"
              title="Vul eerst alle gegevens in om je premie te berekenen"
              description="You can use a description to better explain the alert."
            />
          ) : showSkeleton ? (
            <div className="flex w-full flex-col items-start gap-6" aria-hidden="true">
              <div className="h-32 w-full max-w-[320px] animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              <div className="flex w-full gap-4">
                <div className="h-72 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
                <div className="h-72 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
                <div className="h-72 flex-1 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              </div>
              <div className="h-[86px] w-[272px] animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              <div className="h-[86px] w-[480px] animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
              <div className="h-[113px] w-full animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
            </div>
          ) : (
            <>
              <InputCurrency
                id="verzekerd-bedrag"
                labelText="Welk bedrag wil je verzekeren"
                description="Het verzekerde bedrag moet minimaal € 5.000 en kan maximaal € 5.000.000 zijn. Alleen hele bedragen zonder komma zijn toegestaan."
                value={verzekerdBedrag}
                onChange={setVerzekerdBedrag}
              />

              <RadioCardBottomGroup
                labelText="Wil je dat het verzekerd bedrag gelijk blijft of daalt?"
                description="Kies of het verzekerd bedrag tot het einde van de verzekering gelijk blijft. Of dat het bedrag daalt naar €0. Het bedrag kan op 2 manieren dalen. Kies de verzekeringsvorm die bij jouw situatie past."
                options={BEDRAG_VORM_OPTIES}
                value={bedragVorm}
                onChange={setBedragVorm}
                onMoreInfoClick={() => {}}
              />

              <InputPercentage
                id="rentepercentage"
                labelText="Wat is het rentepercentage van je hypotheek?"
                value={rentepercentage}
                onChange={setRentepercentage}
              />

              <Select
                labelText="Je wilt je premie betalen per"
                options={PREMIE_BETALEN_PER_OPTIONS}
                value={premieBetalenPer}
                onChange={setPremieBetalenPer}
                fieldWidth="lg"
              />

              <RadioGroup
                labelText="Sluit je deze verzekering af om na overlijden een hypotheek of (zakelijke) schulden af te lossen?"
                options={JA_NEE_OPTIONS}
                value={voorHypotheekAflossen}
                onChange={setVoorHypotheekAflossen}
                horizontal
              />
            </>
          )}
        </FunnelSection>
      </div>
    </>
  );
}
