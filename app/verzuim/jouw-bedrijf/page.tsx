"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { FieldsetCompanyAddress, type FieldsetCompanyAddressValue } from "@/components/FieldsetCompanyAddress";
import { RadioCardGroup } from "@/components/RadioCardGroup";
import { Select } from "@/components/Select";
import { CardDetails } from "@/components/CardDetails";
import { Alert } from "@/components/Alert";
import { List } from "@/components/List";
import { useVerzuimFunnel, type CompanyResult } from "../funnel-context";

const VERZUIM_STEPS = ["Jouw bedrijf", "Jouw dekking", "Aanvullende gegevens", "Laatste vragen", "Samenvatting"];

const NOT_IN_LIST_VALUE = "__not_in_list__";

const EMPTY_ADDRESS: FieldsetCompanyAddressValue = { postalCode: "", houseNumber: "", addition: "" };

/**
 * Placeholder voor de echte KvK/postcode-zoek-API — die bestaat nog niet in
 * dit project (bevestigd: geen enkele bestaande API-route of fetch-aanroep
 * in de codebase) en wordt hier dus niet verzonnen. Dit levert uitsluitend
 * de 3 demo-uitkomsten die Figma zelf toont (1 resultaat/"Bedrijf x", meerdere
 * resultaten, geen resultaten), gekozen op basis van de ingevoerde waarden
 * zodat alle 3 staten in de browser te testen zijn. Vervang deze functie door
 * een echte serveraanroep zodra de backend-integratie beschikbaar is.
 */
function mockSearchCompanies(postalCode: string, houseNumber: string): CompanyResult[] {
  const normalizedPostalCode = postalCode.replace(/\s/g, "").toUpperCase();

  if (normalizedPostalCode === "0000AA") {
    return [];
  }

  if (houseNumber === "1") {
    return [
      { id: "bedrijf-x", name: "Bedrijf x", postalCode: "3584 BA", address: "Archimedeslaan 6", city: "Utrecht", kvkNumber: "00000000", establishmentNumber: "000000000001", label: "Hoofdvestiging" },
      { id: "bedrijf-y", name: "Bedrijf y", postalCode: "3584 BA", address: "Archimedeslaan 6a", city: "Utrecht", kvkNumber: "00000001", establishmentNumber: "000000000002", label: "Nevenvestiging" },
      { id: "bedrijf-z", name: "Bedrijf z", postalCode: "3584 BA", address: "Archimedeslaan 6b", city: "Utrecht", kvkNumber: "00000002", establishmentNumber: "000000000003", label: "Nevenvestiging" },
    ];
  }

  return [{ id: "bedrijf-x", name: "Bedrijf x", postalCode: "3584 BA", address: "Archimedeslaan 6", city: "Utrecht", kvkNumber: "00000000", establishmentNumber: "000000000001", label: "Hoofdvestiging" }];
}

/** Wachttijd na de laatste toetsaanslag voordat de (mock) opzoeking start — voorkomt dat elke losse toets al een zoekactie triggert. Niet expliciet opgegeven door de opdracht, een redelijke default. */
const SEARCH_DEBOUNCE_MS = 500;
/** Vaste duur van de laad-simulatie, zoals gevraagd: 2 seconden spinner voordat de bedrijven getoond worden. */
const SEARCH_DURATION_MS = 2000;

/**
 * Stap 1 van 5 ("Jouw bedrijf"), sub-stap 1 van 3 ("Bedrijf zoeken" —
 * Figma node 10938:29342 t/m de gerelateerde resultaat-/foutstaten
 * 10938:29368/29421/29474/29501 en 11263:32918). Eén stateful pagina i.p.v.
 * losse routes per staat: alle 6 geanalyseerde Figma-schermen zijn geen
 * afzonderlijke navigatiestappen maar het resultaat van hetzelfde
 * zoekformulier op dit ene scherm (bevestigd doordat postcode/huisnummer,
 * Header, StepIndicator en sidebar in alle 6 identiek zijn — alleen het
 * gedeelte onder de velden verandert).
 *
 * Zoeken gebeurt automatisch zodra postcode + huisnummer zijn ingevuld (geen
 * losse zoekknop) — "Naar medewerkers" bevestigt alleen nog de gemaakte
 * keuze. Zie de `useEffect` hieronder voor de debounce + 2s laad-simulatie.
 */
export default function JouwBedrijfBedrijfZoekenPage() {
  const router = useRouter();
  const funnel = useVerzuimFunnel();

  const [address, setAddress] = useState<FieldsetCompanyAddressValue>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<{ postalCode?: string; houseNumber?: string }>({});
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<CompanyResult[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [selectionError, setSelectionError] = useState<string | undefined>(undefined);

  const hasSearched = results !== null;
  const noResultsFound = hasSearched && results.length === 0;
  const notInList = selectedId === NOT_IN_LIST_VALUE;
  const selectedCompany = results?.find((company) => company.id === selectedId);
  const showNavigation = !noResultsFound && !notInList;

  const postalCode = address.postalCode.trim();
  const houseNumber = address.houseNumber.trim();

  // Herstel eerder ingevulde adres + keuze uit de gedeelde funnelstate (bv.
  // na een refresh, of terugnavigeren vanaf 2/3) — precies één keer, zodra
  // de state uit sessionStorage is opgehaald. `isRestoringRef` zorgt dat de
  // hieronder staande zoek-effect deze restore niet meteen weer wist.
  const hasRestoredRef = useRef(false);
  const isRestoringRef = useRef(false);
  useEffect(() => {
    if (!funnel.isHydrated || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const saved = funnel.state.company;
    if (!saved) return;
    isRestoringRef.current = true;
    setAddress(saved.address);
    setResults(mockSearchCompanies(saved.address.postalCode, saved.address.houseNumber));
    setSelectedId(saved.selectedCompany.id);
  }, [funnel.isHydrated, funnel.state.company]);

  // Automatisch opzoeken zodra postcode + huisnummer bekend zijn — geen
  // klik op "Naar medewerkers" meer nodig om te zoeken (die knop bevestigt
  // alleen nog de gekozen keuze). Debounce + een generatie-guard voorkomen
  // dat een trage opzoeking van een inmiddels alweer gewijzigd adres alsnog
  // resultaten toont.
  const searchGenerationRef = useRef(0);
  useEffect(() => {
    // Direct na een restore (zie hierboven) is het adres al bekend en zijn
    // resultaat + keuze al hersteld — niet opnieuw resetten en zoeken.
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }

    searchGenerationRef.current += 1;
    const generation = searchGenerationRef.current;

    setResults(null);
    setSelectedId(undefined);
    setSelectionError(undefined);
    setIsSearching(false);
    setAddressErrors({});

    if (!postalCode || !houseNumber) return;

    let cleanupSearchTimeout: (() => void) | undefined;
    const debounceTimeout = setTimeout(() => {
      setIsSearching(true);
      const searchTimeout = setTimeout(() => {
        if (searchGenerationRef.current !== generation) return;
        setIsSearching(false);
        setResults(mockSearchCompanies(postalCode, houseNumber));
      }, SEARCH_DURATION_MS);
      cleanupSearchTimeout = () => clearTimeout(searchTimeout);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceTimeout);
      cleanupSearchTimeout?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postalCode, houseNumber]);

  function validateAddress(): boolean {
    const errors: { postalCode?: string; houseNumber?: string } = {};
    if (!postalCode) errors.postalCode = "Postcode is verplicht, vul je postcode in.";
    if (!houseNumber) errors.houseNumber = "Huisnummer is verplicht, vul je huisnummer in.";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNext() {
    if (!hasSearched) {
      // Velden zijn leeg (of de opzoeking loopt nog) — toont alleen de
      // verplicht-veld-meldingen; het zoeken zelf gebeurt automatisch.
      validateAddress();
      return;
    }

    if (results && results.length > 0) {
      if (!selectedId) {
        setSelectionError("Je hebt niets gekozen. Kies een bedrijf uit de lijst.");
        return;
      }
      if (!selectedCompany) return;
      funnel.setCompanyStep({ address, selectedCompany });
      router.push("/verzuim/jouw-bedrijf/medewerkers");
    }
  }

  function handleSelect(value: string) {
    setSelectedId(value);
    setSelectionError(undefined);
  }

  return (
    <FunnelPageTemplate
      headerTitle="Verzuimverzekering"
      phoneNumber="(0800) 00 00 000"
      steps={VERZUIM_STEPS}
      activeStep={1}
      sidebar={
        <div className="flex w-full flex-col items-start gap-4">
          <h2 className="w-full text-black text-2xl leading-[1.3]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            Waarom onze verzekering
          </h2>
          <List
            icon="check"
            items={[
              { text: "Hulp bij verkorten van verzuim" },
              { text: "Eerste 2 jaar verzuim verzekerd" },
              { text: "Wij zorgen voor een goede aanpak bij elke ziekmelding" },
            ]}
          />
        </div>
      }
      navigation={showNavigation ? <FormNavigation nextLabel="Naar  medewerkers" onNext={handleNext} /> : undefined}
    >
      <FunnelSection intro title="Jouw bedrijf" showRequiredFieldsNote />

      <ProgressIndicator current={1} total={3} />

      <FunnelSection title="Zoek jouw bedrijf" description="Vul de postcode en het huisnummer van jouw bedrijf in.">
        <FieldsetCompanyAddress value={address} onChange={setAddress} errors={addressErrors} isLoading={isSearching} />

        {hasSearched && results.length > 0 && results.length === 1 && (
          <RadioCardGroup
            labelText="Kies jouw bedrijf"
            description="We hebben de volgende bedrijven gevonden"
            options={[...results.map((company) => ({ value: company.id, label: company.name })), { value: NOT_IN_LIST_VALUE, label: "Mijn bedrijf staat er niet tussen" }]}
            value={selectedId}
            onChange={handleSelect}
            error={selectionError}
          />
        )}

        {hasSearched && results.length > 1 && (
          <>
            <Select
              labelText="Kies jouw bedrijf"
              description="We hebben de volgende bedrijven gevonden"
              options={[...results.map((company) => ({ value: company.id, label: company.name })), { value: NOT_IN_LIST_VALUE, label: "Mijn bedrijf staat er niet tussen" }]}
              value={selectedId}
              onChange={handleSelect}
              error={selectionError}
              fieldWidth="lg"
            />
            {selectedCompany && (
              <CardDetails
                title={selectedCompany.name}
                cardActionEdit={false}
                rows={[
                  { label: "Postcode", value: selectedCompany.postalCode },
                  { label: "Adres", value: selectedCompany.address },
                  { label: "Woonplaats", value: selectedCompany.city },
                  { label: "KvK-nummer", value: selectedCompany.kvkNumber },
                  { label: "Vestigingsnummer", value: selectedCompany.establishmentNumber },
                  { label: "Label", value: selectedCompany.label },
                ]}
              />
            )}
          </>
        )}

        {notInList && (
          <Alert
            type="warning"
            title="Kun je je bedrijf niet vinden?"
            description="Je kunt niet verder zonder een bedrijf te kiezen. Wij helpen je graag. Bel ons op (0800) 00 00 000. Bereikbaar op werkdagen tussen 08:00 en 17:30."
            closable
            onClose={() => {
              setSelectedId(undefined);
            }}
          />
        )}

        {noResultsFound && (
          <Alert
            type="error"
            title="Er zijn geen bedrijven gevonden op dit adres"
            description="Je kunt niet verder zonder een bedrijf te kiezen. Wij helpen je graag. Bel ons op (0800) 00 00 000. Bereikbaar op werkdagen tussen 08:00 en 17:30."
          />
        )}
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
