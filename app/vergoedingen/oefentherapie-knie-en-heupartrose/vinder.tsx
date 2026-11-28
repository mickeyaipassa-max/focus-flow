"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { List } from "@/components/List";
import { VERZEKERINGEN, VOORWAARDEN, type Verzekering } from "./data";

const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;
const AVENIR_BOLD = { fontFamily: "var(--font-avenir-bold)" } as const;
const AVENIR_MEDIUM = { fontFamily: "var(--font-avenir-medium)" } as const;

const KAART = "flex w-full flex-col items-start gap-2 rounded-[3px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.12)]";

/** Figma toont de links in deze teksten, maar geen bestemming: ze navigeren nog nergens heen. */
function Tekstlink({ children }: { children: ReactNode }) {
  return (
    <a href="#" onClick={(event) => event.preventDefault()} className="text-[#0064a8] underline hover:no-underline">
      {children}
    </a>
  );
}

const EigenRisicoTekst = () => (
  <>
    Voor deze kosten betaal je vanaf 18 jaar <Tekstlink>eigen risico</Tekstlink>.
  </>
);

const NietGecontracteerdTekst = () => (
  <>
    Bij zorgverleners waar a.s.r. geen contract mee heeft krijg je een lagere vergoeding en moet je mogelijk een deel zelf betalen. Lees meer over de{" "}
    <Tekstlink>maximale vergoeding bij niet-gecontracteerde zorgverleners</Tekstlink>. Kijk in de <Tekstlink>Zorgzoeker</Tekstlink> voor een zorgverlener met een contract.
  </>
);

const VoorwaardenLijst = () => <List icon="bullet" items={VOORWAARDEN.map((text) => ({ text }))} />;

const ACCORDEON_VOORWAARDEN = [{ title: "Voorwaarden", content: <VoorwaardenLijst /> }];

function GeenVergoeding({ naam }: { naam: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon name="cross-red" size="md" />
      <p className="min-w-0 flex-1 text-black text-lg leading-[1.5]" style={AVENIR}>
        Je krijgt <span style={AVENIR_BOLD}>geen vergoeding</span> vanuit de {naam}.
      </p>
    </div>
  );
}

function TerugLink() {
  return (
    <Link href="/vergoedingen" className="inline-flex items-center gap-2 self-start text-base leading-[1.5] text-black underline hover:no-underline" style={AVENIR_MEDIUM}>
      <Icon name="chevron-left-md" />
      Zoek een andere vergoeding
    </Link>
  );
}

function InfoKaart({ titel, tekst, knop, icoon }: { titel: string; tekst: string; knop: string; icoon?: "search" | "chevron-right-md" }) {
  return (
    <div className={KAART}>
      <h3 className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
        {titel}
      </h3>
      <p className="text-black text-base leading-[1.5]" style={AVENIR}>
        {tekst}
      </p>
      <Button type="secondary" compact iconPrepend={icoon === "search" ? "search" : undefined} iconAppend={icoon === "chevron-right-md" ? "chevron-right-md" : undefined}>
        {knop}
      </Button>
    </div>
  );
}

/** Uitkomst voor één verzekering op desktop (Figma "Uitkomst (tabpanel)"). */
function Uitkomst({ v, tabId }: { v: Verzekering; tabId: string }) {
  return (
    <div id="uitkomst-paneel" role="tabpanel" aria-labelledby={tabId} className="flex min-w-0 flex-1 flex-col gap-6">
      <p className="text-black text-base leading-[1.5]" style={AVENIR}>
        Je hebt gekozen voor <span style={AVENIR_BOLD}>{v.keuze}</span>, dit zijn de vergoedingen en voorwaarden:
      </p>

      <div className="flex w-full flex-col gap-4 bg-[#fff8e3] p-6">
        <h3 className="text-black text-[32px] leading-[1.3]" style={MEMPHIS}>
          {v.naam}
        </h3>
        {v.vergoeding ? <List icon="bullet" items={v.punten.map((text) => ({ text }))} /> : <GeenVergoeding naam={v.naam} />}
        {v.info && <Alert type="info" showTitle={false} closable={false} description={v.info} />}
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
          Eigen risico
        </h4>
        <p className="text-black text-lg leading-[1.5]" style={AVENIR}>
          <EigenRisicoTekst />
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
          Niet gecontracteerde zorg
        </h4>
        <p className="text-black text-lg leading-[1.5]" style={AVENIR}>
          <NietGecontracteerdTekst />
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
          Voorwaarden
        </h4>
        <VoorwaardenLijst />
      </div>

      <hr className="m-0 h-px w-full border-0 bg-[rgba(0,0,0,0.08)]" />
      <TerugLink />

      <InfoKaart titel="Zorgverlener zoeken?" tekst="Vind eenvoudig een gecontracteerde zorgverlener bij jou in de buurt. Zoek op zorgsoort of op naam." knop="Naar de Zorgzoeker van a.s.r." />
      <InfoKaart
        titel="Meer weten over fysiotherapie?"
        tekst="Lees hoe je fysiotherapie declareert, welke vergoedingen er zijn en waar je op let bij het kiezen van een fysiotherapeut."
        knop="Lees meer over fysiotherapie"
      />
    </div>
  );
}

function Tab({
  v,
  id,
  geselecteerd,
  onSelect,
  onKeyDown,
  refCallback,
}: {
  v: Verzekering;
  id: string;
  geselecteerd: boolean;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  refCallback: (element: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={refCallback}
      id={id}
      type="button"
      role="tab"
      aria-selected={geselecteerd}
      aria-controls="uitkomst-paneel"
      tabIndex={geselecteerd ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={`flex h-20 w-full items-center gap-4 rounded-[3px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
        geselecteerd
          ? "border-2 border-black bg-[#f6f6f7] pr-[18px] pl-[22px] shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
          : "border border-[rgba(0,0,0,0.16)] bg-white pr-[19px] pl-[23px] hover:border-black"
      }`}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-black text-[20px] leading-[1.4]" style={MEMPHIS}>
          {v.naam}
        </span>
        <span className="flex items-center gap-1">
          <Icon name={v.vergoeding ? "check-sm" : "cross-red-sm"} size="sm" />
          <span className="text-black text-sm leading-[1.5]" style={AVENIR}>
            {v.vergoeding ? "Vergoeding mogelijk" : "Geen vergoeding"}
          </span>
        </span>
      </span>
      <Icon name="chevron-right-md" />
    </button>
  );
}

/**
 * "Kijk wat je vergoed krijgt:" — Figma "Vergoedingenvinder (finder)".
 * Desktop (vanaf 900 px): links de lijst met verzekeringen als tabs, rechts de uitkomst van de gekozen verzekering.
 * Mobiel: de uitkomst van de basisverzekering met klapitems, daaronder alle aanvullende verzekeringen als kaarten,
 * zoals in het mobiele frame; daar is geen keuze nodig.
 */
export function Vinder() {
  const [gekozen, setGekozen] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function kies(index: number) {
    const volgende = (index + VERZEKERINGEN.length) % VERZEKERINGEN.length;
    setGekozen(volgende);
    tabs.current[volgende]?.focus();
  }

  function toets(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowDown") kies(index + 1);
    else if (event.key === "ArrowUp") kies(index - 1);
    else if (event.key === "Home") kies(0);
    else if (event.key === "End") kies(VERZEKERINGEN.length - 1);
    else return;
    event.preventDefault();
  }

  const basis = VERZEKERINGEN[0];
  const aanvullend = VERZEKERINGEN.slice(1);

  return (
    <>
      {/* Desktop */}
      <section aria-labelledby="vinder-titel" className="hidden w-full flex-col gap-6 min-[900px]:flex">
        <h2 id="vinder-titel" className="text-black text-[40px] leading-[1.2]" style={MEMPHIS}>
          Kijk wat je vergoed krijgt:
        </h2>
        <div className="flex w-full items-start gap-8">
          <div className="flex w-[min(384px,40%)] shrink-0 flex-col gap-2">
            <p id="tabs-label" className="text-black text-base leading-[1.5]" style={AVENIR}>
              Kies je (aanvullende) verzekering:
            </p>
            <div role="tablist" aria-orientation="vertical" aria-labelledby="tabs-label" className="flex flex-col gap-2">
              {VERZEKERINGEN.map((v, index) => (
                <Tab
                  key={v.naam}
                  v={v}
                  id={`tab-${index}`}
                  geselecteerd={gekozen === index}
                  onSelect={() => setGekozen(index)}
                  onKeyDown={(event) => toets(event, index)}
                  refCallback={(element) => {
                    tabs.current[index] = element;
                  }}
                />
              ))}
            </div>
            <InfoKaart titel="Heb je een a.s.r. Doorgaan verzekering?" tekst="Heb je een a.s.r. Doorgaan verzekering? Bekijk je vergoeding." knop="Naar a.s.r. Doorgaan" icoon="chevron-right-md" />
            <InfoKaart titel="Heb je een VvAA verzekering?" tekst="Heb je een VvAA verzekering? Bekijk je vergoeding." knop="Naar VvAA" icoon="chevron-right-md" />
          </div>
          <Uitkomst v={VERZEKERINGEN[gekozen]} tabId={`tab-${gekozen}`} />
        </div>
      </section>

      {/* Mobiel */}
      <div className="flex w-full flex-col gap-6 min-[900px]:hidden">
        <h2 className="text-black text-[32px] leading-[1.3]" style={MEMPHIS}>
          Kijk wat je vergoed krijgt:
        </h2>
        <div className="flex w-full flex-col gap-2">
          <h3 className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
            {basis.naam}
          </h3>
          <div className="bg-[#d7e9f5] p-4">
            <List icon="bullet" items={basis.punten.map((text) => ({ text }))} />
          </div>
          <Accordion
            className="flex w-full flex-col gap-1"
            items={[
              { title: "Eigen risico", content: <p className="text-black text-lg leading-[1.5]" style={AVENIR}><EigenRisicoTekst /></p> },
              { title: "Niet gecontracteerde zorg", content: <p className="text-black text-lg leading-[1.5]" style={AVENIR}><NietGecontracteerdTekst /></p> },
              { title: "Voorwaarden", content: <VoorwaardenLijst /> },
            ]}
          />
        </div>
      </div>

      {/* Aanvullende verzekeringen: over de volle breedte van het scherm (Figma: 375 px, gele achtergrond). */}
      <section aria-labelledby="aanvullend-titel" className="-mx-4 mt-2 flex flex-col gap-4 bg-[#fff8e3] px-4 py-8 min-[600px]:-mx-12 min-[600px]:px-12 min-[900px]:hidden">
        <h3 id="aanvullend-titel" className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
          Vergoeding vanuit Aanvullende verzekeringen:
        </h3>
        {aanvullend.map((v) => (
          <div key={v.naam} className="flex w-full flex-col gap-4 bg-white p-6">
            <h4 className="text-black text-[20px] leading-[1.4]" style={MEMPHIS}>
              {v.naam}
            </h4>
            {v.vergoeding ? <List icon="bullet" items={v.punten.map((text) => ({ text }))} /> : <GeenVergoeding naam={v.naam} />}
            {v.info && <Alert type="info" showTitle={false} closable={false} description={v.info} />}
            {v.vergoeding && <Accordion className="flex w-full flex-col gap-1" items={ACCORDEON_VOORWAARDEN} />}
          </div>
        ))}
      </section>

      {/* Mobiel: Figma "Tip en terug" en "Infoblokken" (16 px marge, samen 32 px ertussen). */}
      <div className="-mt-2 flex w-full flex-col gap-8 min-[900px]:hidden">
        <div className="flex w-full flex-col gap-4">
          <p className="text-black text-base leading-[1.5]" style={AVENIR}>
            <span style={AVENIR_BOLD}>Tip!</span> Ben je verzekerd bij a.s.r.? Bekijk dan welke aanvullende verzekering jij hebt en <Tekstlink>log in</Tekstlink> met DigiD bij jouw a.s.r. account.
          </p>
          <TerugLink />
        </div>
        <div className="flex w-full flex-col gap-6">
          <InfoKaart titel="Heb je een a.s.r. Doorgaan verzekering?" tekst="Heb je een a.s.r. Doorgaan verzekering? Bekijk je vergoeding." knop="Naar a.s.r. Doorgaan" icoon="chevron-right-md" />
          <InfoKaart titel="Heb je een VvAA verzekering?" tekst="Heb je een VvAA verzekering? Bekijk je vergoeding." knop="Naar VvAA" icoon="chevron-right-md" />
          <InfoKaart titel="Zorgverlener zoeken?" tekst="Vind eenvoudig een gecontracteerde zorgverlener bij jou in de buurt. Zoek op zorgsoort of op naam." knop="Naar de Zorgzoeker van a.s.r." icoon="search" />
        </div>
      </div>
    </>
  );
}
