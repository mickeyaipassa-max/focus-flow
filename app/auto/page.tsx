"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { Select } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { InputLicensePlate, type VehicleDetails } from "@/components/InputLicensePlate";
import { InputDate } from "@/components/InputDate";
import { Dialog } from "@/components/Dialog";
import { List } from "@/components/List";
import { Rating } from "@/components/Rating";
import { Icon } from "@/components/Icon";
import { useAutoFunnel } from "./funnel-context";

const AUTO_STEPS = ["Jouw situatie", "Jouw dekking", "Jouw gegevens", "Laatste vragen", "Samenvatting"];

/** Geverifieerd op de live site (asr.nl/verzekeringen/autoverzekering/afsluiten, shadow-DOM van de echte asr-select-elementen) — geen aannames. */
const KM_OPTIONS = [
  { value: "tm-10000", label: "t/m 10.000 km" },
  { value: "10001-15000", label: "10.001 - 15.000 km" },
  { value: "15001-20000", label: "15.001 - 20.000 km" },
  { value: "20001-25000", label: "20.001 - 25.000 km" },
  { value: "25001-plus", label: ">25.001 km en meer" },
];

const BESTUURDER_OPTIONS = [
  { value: "jijzelf", label: "Jijzelf" },
  { value: "partner", label: "Je partner" },
  { value: "kind", label: "Je kind" },
];

const SVJ_OPTIONS = [
  { value: "negatief", label: "Negatieve jaren" },
  ...Array.from({ length: 31 }, (_, i) => ({ value: String(i), label: `${i} jaar` })),
  { value: "31-plus", label: "31 jaar of meer" },
];

const TWEEDE_DERDE_OPTIONS = [
  { value: "ja", label: "Ja" },
  { value: "nee", label: "Nee" },
];

type VehicleState = "default" | "loading" | "succes" | "error";

/**
 * Stap 1 van 5 ("Jouw situatie") van de Autoverzekering-funnel, Figma node
 * 3369:18682. Kenteken-opzoeking gaat tegen de echte, kosteloze RDW Open
 * Data API (via `/api/rdw-vehicle` — server-side, geen key nodig, zie
 * app/api/rdw-vehicle/route.ts). Voer een écht kenteken in (bv. 59TSB5)
 * om een echte auto terug te zien komen.
 *
 * Bewust nog niet gebouwd, apart te bespreken:
 * - "Bereken je premie zonder kenteken" opent in Figma een eigen 2-staps
 *   dialoogflow (nodes 8050:70390/70478) — hier alleen een link, nog geen
 *   sub-flow.
 * - "Bereken mijn schadevrije jaren" — geen aparte flow hiervoor
 *   geanalyseerd.
 * - De keuzelijst-opties voor postcode/huisnummer "Toevoeging" (dropdown,
 *   niet vrije tekst zoals bij Verzuim) zijn niet uit Figma of de live site
 *   gehaald — leeg gelaten i.p.v. verzonnen.
 */
export default function AutoJouwSituatiePage() {
  const router = useRouter();
  const funnel = useAutoFunnel();

  const [kenteken, setKenteken] = useState("");
  const [vehicleState, setVehicleState] = useState<VehicleState>("default");
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [kentekenError, setKentekenError] = useState<string | undefined>();

  const [kmPerJaar, setKmPerJaar] = useState("");
  const [regelmatigeBestuurder, setRegelmatigeBestuurder] = useState("");
  const [tweedeOfDerde, setTweedeOfDerde] = useState("");
  const [schadevrijeJaren, setSchadevrijeJaren] = useState("");
  const [svjDialogOpen, setSvjDialogOpen] = useState(false);
  const [geboortedatum, setGeboortedatum] = useState<Date | null>(null);
  const [postcode, setPostcode] = useState("");
  const [huisnummer, setHuisnummer] = useState("");
  const [toevoeging, setToevoeging] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasRestoredRef = useRef(false);
  const isRestoringRef = useRef(false);
  useEffect(() => {
    if (!funnel.isHydrated || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const saved = funnel.state.situatie;
    if (!saved) return;
    isRestoringRef.current = true;
    setKenteken(saved.kenteken);
    setVehicle(saved.vehicle);
    setVehicleState(saved.vehicle ? "succes" : "default");
    setKmPerJaar(saved.kmPerJaar);
    setRegelmatigeBestuurder(saved.regelmatigeBestuurder);
    setTweedeOfDerde(saved.tweedeOfDerdeVerzekering);
    setSchadevrijeJaren(saved.schadevrijeJaren);
    setGeboortedatum(saved.geboortedatum);
    setPostcode(saved.postcode);
    setHuisnummer(saved.huisnummer);
    setToevoeging(saved.toevoeging);
  }, [funnel.isHydrated, funnel.state.situatie]);

  const searchGenRef = useRef(0);
  useEffect(() => {
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }
    const cleaned = kenteken.replace(/[^A-Za-z0-9]/g, "");
    setVehicle(null);
    setKentekenError(undefined);

    if (cleaned.length < 6) {
      setVehicleState("default");
      return;
    }

    searchGenRef.current += 1;
    const generation = searchGenRef.current;
    const debounce = setTimeout(async () => {
      setVehicleState("loading");
      try {
        const res = await fetch(`/api/rdw-vehicle?kenteken=${cleaned}`);
        const data = await res.json();
        if (searchGenRef.current !== generation) return;
        if (!res.ok || !data.found) {
          setVehicleState("error");
          setKentekenError("Je hebt geen voertuig gevonden met dit kenteken. Controleer of je kenteken goed hebt ingevuld.");
          return;
        }
        setVehicle(data.vehicle);
        setVehicleState("succes");
      } catch {
        if (searchGenRef.current !== generation) return;
        setVehicleState("error");
        setKentekenError("Je hebt geen voertuig gevonden met dit kenteken. Controleer of je kenteken goed hebt ingevuld.");
      }
    }, 500);
    return () => clearTimeout(debounce);
  }, [kenteken]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!kmPerJaar) next.kmPerJaar = "Je hebt niks gekozen. Geef aan hoeveel kilometers je ongeveer per jaar rijdt.";
    if (!regelmatigeBestuurder) next.regelmatigeBestuurder = "Je hebt niks gekozen. Kies de regelmatige bestuurder van de auto.";
    if (!tweedeOfDerde) next.tweedeOfDerde = "Je hebt niks gekozen. Geef aan of dit jouw 2e of 3e autoverzekering wordt!";
    if (!schadevrijeJaren) next.schadevrijeJaren = "Je hebt niks gekozen. Kies het aantal schadevrije jaren.";
    if (!geboortedatum) next.geboortedatum = "Vul je geboortedatum in.";
    if (!postcode) next.postcode = "Postcode is verplicht, vul je postcode in.";
    if (!huisnummer) next.huisnummer = "Huisnummer is verplicht, vul je huisnummer in.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    funnel.setSituatieStep({
      kenteken,
      vehicle,
      kmPerJaar,
      regelmatigeBestuurder,
      tweedeOfDerdeVerzekering: tweedeOfDerde as "ja" | "nee" | "",
      schadevrijeJaren,
      geboortedatum,
      postcode,
      huisnummer,
      toevoeging,
    });
    router.push("/auto/jouw-dekking");
  }

  return (
    <FunnelPageTemplate
      headerTitle="Autoverzekering"
      ikzSticker
      steps={AUTO_STEPS}
      activeStep={1}
      sidebar={
        <div className="flex w-full flex-col items-start gap-4">
          <h2 className="w-full text-black text-2xl leading-[1.3]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            Waarom onze verzekering
          </h2>
          <List
            icon="check"
            items={[
              { text: "Tot 75% no-claimkorting" },
              { text: "Tot 3 jaar vergoeding van de nieuw- of aankoopwaarde" },
              { text: "Vakkundige reparatie via het herstelnetwerk van a.s.r." },
            ]}
          />
          <Rating score={4.5} ratingNumber="8,1" reviewCount={671} reviewsHref="https://www.asr.nl" />
        </div>
      }
      navigation={
        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-[3px] bg-black px-6 py-3 text-lg text-white leading-[1.5]"
            style={{ fontFamily: "var(--font-avenir-medium)" }}
          >
            Naar jouw dekking
            <Icon name="arrow-right" size="md" />
          </button>
        </div>
      }
    >
      <FunnelSection intro title="Jouw situatie" showRequiredFieldsNote />

      <FunnelSection title="De auto die je wil verzekeren" showDividerAbove>
        <InputLicensePlate value={kenteken} onChange={setKenteken} state={vehicleState} errorMessage={kentekenError} vehicle={vehicle ?? undefined} />
        <button
          type="button"
          className="text-left text-base text-[#0064a8] underline leading-[1.5]"
          style={{ fontFamily: "var(--font-avenir)" }}
        >
          Bereken je premie zonder kenteken
        </button>
        <Select
          labelText="Aantal kilometers per jaar"
          options={KM_OPTIONS}
          value={kmPerJaar}
          onChange={setKmPerJaar}
          error={errors.kmPerJaar}
        />
        <Select
          labelText="Regelmatige bestuurder"
          description="Wil je je partner of kind als regelmatige bestuurder opgeven? Dat kan alleen als jullie op hetzelfde adres wonen."
          options={BESTUURDER_OPTIONS}
          value={regelmatigeBestuurder}
          onChange={setRegelmatigeBestuurder}
          error={errors.regelmatigeBestuurder}
        />
      </FunnelSection>

      <FunnelSection title="Schadevrije jaren" showDividerAbove>
        <RadioGroup
          labelText="Wordt dit jouw 2e of 3e autoverzekering?"
          options={TWEEDE_DERDE_OPTIONS}
          value={tweedeOfDerde}
          onChange={setTweedeOfDerde}
          horizontal
          error={errors.tweedeOfDerde}
        />
        <div className="flex w-full flex-col items-start gap-4">
          <p className="w-full text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            Je hebt alleen schadevrije jaren als je een autoverzekering op jouw naam hebt staan. Je vindt het aantal op het polisblad
            van je huidige verzekering. Heb je lease gereden? Ook dan bouw je schadevrije jaren op.
          </p>
          <button
            type="button"
            onClick={() => setSvjDialogOpen(true)}
            className="text-left text-base text-[#0064a8] underline leading-[1.5]"
            style={{ fontFamily: "var(--font-avenir)" }}
          >
            Meer over schadevrije jaren
          </button>
          <Select
            labelText="Je schadevrije jaren"
            options={SVJ_OPTIONS}
            value={schadevrijeJaren}
            onChange={setSchadevrijeJaren}
            error={errors.schadevrijeJaren}
          />
          <button
            type="button"
            className="text-left text-base text-[#0064a8] underline leading-[1.5]"
            style={{ fontFamily: "var(--font-avenir)" }}
          >
            Bereken mijn schadevrije jaren
          </button>
        </div>
      </FunnelSection>

      <FunnelSection title="Je gegevens" showDividerAbove>
        <InputDate
          labelText="Geboortedatum (dd-mm-jjjj)"
          showPickerButton
          value={geboortedatum}
          onChange={setGeboortedatum}
          error={errors.geboortedatum}
        />
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="auto-postcode" className="flex items-center gap-1 text-lg leading-[1.5]">
              <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                Postcode
              </span>
              <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
                *
              </span>
            </label>
            <input
              id="auto-postcode"
              type="text"
              value={postcode}
              onChange={(event) => setPostcode(event.target.value)}
              className={[
                "h-[51px] w-[112px] rounded-[3px] border bg-white px-4 py-3 text-black text-lg leading-[1.5] outline-none",
                errors.postcode ? "border-[#ce0a1e]" : "border-[#565656] focus:border-black",
              ].join(" ")}
              style={{ fontFamily: "var(--font-avenir)" }}
            />
            {errors.postcode && (
              <div className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
                <Icon name="validation-error" size="sm" />
                <span className="text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
                  {errors.postcode}
                </span>
              </div>
            )}
          </div>

          <div className="flex w-full flex-wrap items-start gap-x-2 gap-y-6">
            <div className="flex w-[160px] max-w-full shrink-0 flex-col items-start gap-2">
              <label htmlFor="auto-huisnummer" className="flex items-center gap-1 text-lg leading-[1.5]">
                <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  Huisnummer
                </span>
                <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
                  *
                </span>
              </label>
              <input
                id="auto-huisnummer"
                type="text"
                value={huisnummer}
                onChange={(event) => setHuisnummer(event.target.value)}
                className={[
                  "h-[51px] w-full rounded-[3px] border bg-white px-4 py-3 text-black text-lg leading-[1.5] outline-none",
                  errors.huisnummer ? "border-[#ce0a1e]" : "border-[#565656] focus:border-black",
                ].join(" ")}
                style={{ fontFamily: "var(--font-avenir)" }}
              />
              {errors.huisnummer && (
                <div className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
                  <Icon name="validation-error" size="sm" />
                  <span className="text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
                    {errors.huisnummer}
                  </span>
                </div>
              )}
            </div>

            {/*
              Figma toont "Toevoeging" hier als dropdown i.p.v. vrije tekst
              (anders dan Verzuim's FieldsetCompanyAddress) — maar de echte
              optielijst staat nergens in de geanalyseerde schermen of de
              live site. Leeg gelaten i.p.v. verzonnen waarden; los te
              bevestigen.
            */}
            <div className="flex w-[160px] max-w-full shrink-0 flex-col items-start">
              <Select labelText="Toevoeging" required={false} options={[]} value={toevoeging} onChange={setToevoeging} />
            </div>
          </div>
        </div>
        <p className="w-full text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
          Straatnaam en plaats worden automatisch opgehaald.
        </p>
      </FunnelSection>

      <Dialog open={svjDialogOpen} onClose={() => setSvjDialogOpen(false)} title="Schadevrije jaren">
        <p className="text-lg text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
          Je schadevrije jaren bepalen je premie. Het aantal schadevrije jaren staat op het polisblad van je autoverzekering. In het
          landelijk systeem Roy-Data controleren wij of het aantal schadevrije jaren dat jij opgeeft hetzelfde is als in Roy-Data én of
          dit nog niet gebruikt is voor een andere autoverzekering.
        </p>
        <List
          icon="bullet"
          items={[
            {
              text: "Is dit aantal niet hetzelfde? Dan nemen we het aantal schadevrije jaren uit Roy-Data over. We passen je premie vanaf de ingangsdatum van je verzekering aan.",
            },
            {
              text: "Zijn de in Roy-Data vastgelegde schadevrije jaren al voor een andere autoverzekering in gebruik? Dan zetten we je schadevrije jaren op 0 en passen we je premie vanaf de ingangsdatum van je verzekering aan.",
            },
            {
              text: "Heb je negatieve schadevrije jaren? Dan kunnen we je helaas online niet verzekeren. Een onafhankelijk adviseur kan met je meekijken naar wat er in jouw situatie wél mogelijk is.",
            },
            { text: "Heb je even geen auto gehad? Bij ons zijn je schadevrije jaren 3 jaar geldig!" },
          ]}
        />
        <p className="text-lg text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
          Neem{" "}
          <a href="https://www.asr.nl/contact/vervoersverzekeringen?switch=0" target="_blank" rel="noopener noreferrer" className="text-[#0064a8] underline">
            contact
          </a>{" "}
          met ons op in geval van een buitenlandse BM-verklaring, een BM-verklaring van een verzekeraar die niet is aangesloten bij
          Roy-Data of een leaseverklaring.
        </p>
      </Dialog>
    </FunnelPageTemplate>
  );
}
