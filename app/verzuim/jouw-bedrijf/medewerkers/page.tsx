"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { FieldsetEmployee, EMPTY_EMPLOYEE, type EmployeeValue, type EmployeeErrors } from "@/components/FieldsetEmployee";
import { Alert } from "@/components/Alert";
import { List } from "@/components/List";
import { Receipt, type ReceiptSection } from "@/components/Receipt";
import { Icon } from "@/components/Icon";
import { useVerzuimFunnel } from "../../funnel-context";

const VERZUIM_STEPS = ["Jouw bedrijf", "Jouw dekking", "Aanvullende gegevens", "Laatste vragen", "Samenvatting"];

/**
 * Grenzen tussen de 3 staten van deze sub-stap — niet als exacte
 * bedrijfsregel bevestigd in Figma (geen `min`/`max`-property op het
 * "Aantal medewerkers"-veld), maar afgeleid uit de enige 2 geconfirmeerde
 * voorbeeldwaarden: 11 medewerkers → "veel" (optioneel doorgaan of contact),
 * 21 medewerkers → "te veel" (harde blokkade, alleen contactformulier). Ronde
 * getallen gekozen die beide voorbeelden correct indelen.
 */
const MANY_THRESHOLD = 10;
const TOO_MANY_THRESHOLD = 21;

function parseEmployeeCount(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = Number.parseInt(trimmed, 10);
  return value > 0 ? value : null;
}

function isEmployeeComplete(employee: EmployeeValue): boolean {
  return Boolean(employee.gender && employee.birthYear.trim() && employee.employment && employee.salary.trim());
}

function validateEmployee(employee: EmployeeValue): EmployeeErrors {
  const errors: EmployeeErrors = {};
  if (!employee.gender) errors.gender = "Kies een geslacht.";
  if (!employee.birthYear.trim()) errors.birthYear = "Geboortejaar is verplicht, vul een geboortejaar in.";
  if (!employee.employment) errors.employment = "Kies een dienstverband.";
  if (!employee.salary.trim()) errors.salary = "Loon voor werknemersverzekeringen is verplicht, vul een bedrag in.";
  return errors;
}

/**
 * Placeholder voor de echte premieberekening — die bestaat nog niet in dit
 * project en wordt hier dus niet verzonnen (zelfde onderbouwing als
 * `mockSearchCompanies` op stap 1/3). Geeft een oplopend, deterministisch
 * bedrag terug op basis van het aantal volledig ingevulde medewerkers, puur
 * zodat de Receipt-sidebar en zijn bestaande herberekening-animatie (zie
 * Receipt.tsx) in de browser te demonstreren en te testen zijn.
 */
function mockCalculatePremium(completedCount: number): { verzuimAmount: string; totalAmount: string } {
  const verzuim = 14.88 + completedCount * 6.4;
  const total = verzuim + 77.15;
  const format = (n: number) => `€ ${n.toFixed(2).replace(".", ",")}`;
  return { verzuimAmount: format(verzuim), totalAmount: format(total) };
}

/**
 * Sub-stap 2 van 3 ("Jouw bedrijf 2/3") — Figma node 10938:29623 en de
 * gerelateerde staten (10938:29650/29830/30072/30099/30126/30306/30487).
 * Zelfde aanpak als stap 1/3: één stateful pagina i.p.v. losse routes per
 * staat, want alle geanalyseerde schermen zijn varianten van hetzelfde
 * "aantal medewerkers" + "medewerkergegevens"-formulier, niet afzonderlijke
 * navigatiestappen.
 */
export default function JouwBedrijfMedewerkersPage() {
  const router = useRouter();
  const funnel = useVerzuimFunnel();

  const [countInput, setCountInput] = useState("");
  const [countError, setCountError] = useState<string | undefined>(undefined);
  const [employees, setEmployees] = useState<EmployeeValue[]>([]);
  const [employeeErrors, setEmployeeErrors] = useState<EmployeeErrors[]>([]);

  // Validatie-guard tegen het overslaan van stap 1/3: zonder bevestigd
  // bedrijf (bv. rechtstreekse URL-toegang zonder actieve funnel) hoort de
  // gebruiker eerst bij "Jouw bedrijf" te beginnen. Wacht op `isHydrated`
  // zodat een legitieme, herstelde sessie (refresh op dit scherm) niet
  // onterecht wordt teruggestuurd voordat de opgeslagen state is ingelezen.
  useEffect(() => {
    if (!funnel.isHydrated) return;
    if (!funnel.state.company) router.replace("/verzuim/jouw-bedrijf");
  }, [funnel.isHydrated, funnel.state.company, router]);

  // Herstel eerder ingevulde medewerkergegevens (refresh, of terug-dan-weer-
  // vooruit navigeren) — precies één keer, zodra de state uit sessionStorage
  // is opgehaald.
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (!funnel.isHydrated || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const saved = funnel.state.employees;
    if (!saved) return;
    setCountInput(saved.countInput);
    setEmployees(saved.employees);
  }, [funnel.isHydrated, funnel.state.employees]);

  const count = parseEmployeeCount(countInput);
  const tier = count === null ? null : count >= TOO_MANY_THRESHOLD ? "teVeel" : count >= MANY_THRESHOLD ? "veel" : "lager";

  // Aantal medewerker-kaarten volgt automatisch het ingevulde aantal — geen
  // aparte "bevestigen"-actie nodig, zelfde reactieve aanpak als de
  // automatische bedrijvenzoek-actie op stap 1/3. Bij "te veel" worden geen
  // kaarten getoond (harde blokkade, bevestigd: Figma toont daar geen
  // formuliervelden meer, alleen de waarschuwing).
  useEffect(() => {
    if (tier === null || tier === "teVeel") {
      setEmployees([]);
      return;
    }
    setEmployees((current) => {
      if (current.length === count) return current;
      if (current.length > count!) return current.slice(0, count!);
      return [...current, ...Array.from({ length: count! - current.length }, () => ({ ...EMPTY_EMPLOYEE }))];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, tier]);

  const completedCount = useMemo(() => employees.filter(isEmployeeComplete).length, [employees]);
  const showReceipt = completedCount > 0;

  const receipt = useMemo(() => mockCalculatePremium(completedCount), [completedCount]);
  const receiptSections: ReceiptSection[] = [
    {
      id: "verzuim",
      title: "Verzuim",
      amount: receipt.verzuimAmount,
      groups: [
        {
          title: "Loondoorbetaling",
          items: [{ label: "1e jaar 100%" }, { label: "2e jaar 70%" }, { label: "30 werkdagen eigen risico" }],
        },
      ],
    },
    {
      id: "aanvullend",
      title: "Aanvullende dekkingen",
      amount: "€ 77,15",
      groups: [{ items: [{ label: "Arbodienstverlening" }] }],
    },
  ];

  function updateEmployee(index: number, value: EmployeeValue) {
    setEmployees((current) => current.map((employee, i) => (i === index ? value : employee)));
    setEmployeeErrors((current) => current.map((errors, i) => (i === index ? {} : errors)));
  }

  function removeEmployee(index: number) {
    setEmployees((current) => current.filter((_, i) => i !== index));
    setEmployeeErrors((current) => current.filter((_, i) => i !== index));
    setCountInput((current) => String(Math.max(0, (parseEmployeeCount(current) ?? employees.length) - 1)));
  }

  function addEmployee() {
    setEmployees((current) => [...current, { ...EMPTY_EMPLOYEE }]);
    setCountInput((current) => String((parseEmployeeCount(current) ?? employees.length) + 1));
  }

  function handleNext() {
    if (count === null) {
      setCountError("Aantal medewerkers is verplicht, vul een geldig aantal in.");
      return;
    }
    setCountError(undefined);

    if (tier === "teVeel") return;

    const allErrors = employees.map(validateEmployee);
    setEmployeeErrors(allErrors);
    if (allErrors.some((errors) => Object.keys(errors).length > 0)) return;

    funnel.setEmployeesStep({ countInput, employees });
    router.push("/verzuim/jouw-bedrijf/extra-informatie");
  }

  return (
    <FunnelPageTemplate
      headerTitle="Verzuimverzekering"
      chatButton={false}
      steps={VERZUIM_STEPS}
      activeStep={1}
      sidebar={
        showReceipt ? (
          <Receipt title="Verzuimverzekering" sections={receiptSections} summaryLabel="Indicatie van jouw premie" summaryAmount={receipt.totalAmount} />
        ) : (
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
        )
      }
      navigation={
        tier === "teVeel" ? undefined : (
          <FormNavigation
            previousStep
            previousLabel="Jouw bedrijf"
            nextLabel="Naar extra informatie"
            onPrevious={() => router.push("/verzuim/jouw-bedrijf")}
            onNext={handleNext}
          />
        )
      }
    >
      <FunnelSection intro title="Jouw bedrijf" showRequiredFieldsNote />

      <ProgressIndicator current={2} total={3} />

      <FunnelSection title="Voer de gegevens van je medewerkers in." description="Deze gegevens hebben we nodig voor het berekenen van je premie.">
        <div className="flex w-fit flex-col items-start gap-2">
          <label htmlFor="employee-count" className="flex items-center gap-1 text-lg leading-[1.5]">
            <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
              Hoeveel medewerkers heb je in dienst?
            </span>
            <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
              *
            </span>
          </label>
          <input
            id="employee-count"
            name="employee-count"
            type="text"
            inputMode="numeric"
            value={countInput}
            onChange={(event) => {
              setCountInput(event.target.value);
              setCountError(undefined);
            }}
            aria-invalid={countError ? true : undefined}
            aria-describedby={countError ? "employee-count-error" : undefined}
            className={[
              "h-[51px] w-full max-w-[160px] rounded-[3px] border bg-white px-4 py-3 text-black text-lg leading-[1.5] outline-none",
              countError ? "border-[#ce0a1e]" : "border-[#565656] focus:border-black",
            ].join(" ")}
            style={{ fontFamily: "var(--font-avenir)" }}
          />
          {countError && (
            <div id="employee-count-error" className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
              <span className="flex shrink-0 items-center pt-[3px]">
                <Icon name="validation-error" size="sm" />
              </span>
              <span className="flex items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
                {countError}
              </span>
            </div>
          )}
        </div>

        {tier === "teVeel" && (
          <Alert
            type="warning"
            title="We helpen je graag persoonlijk verder"
            description="Vanwege het aantal opgegeven medewerkers helpen we je graag persoonlijk verder. Je kunt contact met ons opnemen via het contactformulier."
            closable
          />
        )}

        {(tier === "lager" || tier === "veel") && employees.length > 0 && (
          <div className="flex w-full flex-col items-start gap-6">
            {employees.map((employee, index) => (
              <FieldsetEmployee
                key={index}
                index={index + 1}
                value={employee}
                onChange={(value) => updateEmployee(index, value)}
                onRemove={() => removeEmployee(index)}
                errors={employeeErrors[index]}
              />
            ))}

            <button
              type="button"
              onClick={addEmployee}
              className="flex items-center justify-center gap-2 rounded-[3px] border border-[#565656] px-6 py-3 hover:border-black hover:bg-[rgba(0,0,0,0.08)]"
            >
              <img src="/icons/person-add.svg" alt="" className="size-8" />
              <span className="font-[550] text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                Medewerker toevoegen
              </span>
            </button>
          </div>
        )}

        {tier === "veel" && (
          <Alert
            type="info"
            showTitle={false}
            description="Door het aantal medewerkers dat je invulde, helpen we je graag persoonlijk verder. Je kunt zelf kiezen: ga door met de aanvraag of neem contact met ons op via het contactformulier."
            closable
          />
        )}
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
