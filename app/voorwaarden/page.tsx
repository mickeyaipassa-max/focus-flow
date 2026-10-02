"use client";

import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TableOfContents } from "@/components/TableOfContents";
import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LinkList } from "@/components/LinkList";
import { FileList } from "@/components/FileList";
import { Accordion } from "@/components/Accordion";
import { Icon } from "@/components/Icon";
import { Card } from "@/components/Card";
import { CardContact } from "@/components/CardContact";
import { Footer, type FooterColumn } from "@/components/Footer";

/**
 * Bevestigd via screenshot van de opdrachtgever (een aparte lijst-weergave
 * met schild-icoon + modelnummer per rij) én, na verificatie tegen de live
 * a.s.r.-pagina die deze build vervangt, gecorrigeerd op twee punten:
 * "Overgenomen Aegon-polissen" bestond niet als los keuze-item (Aegon-
 * polissen horen alleen bij de wijzigingsoverzichten, niet in deze Select),
 * en "Niet meer nieuw af te sluiten" was op de live site geen eigen keuze
 * maar een kopje boven 4 losse producten — die 4 staan er nu voor in de
 * plaats. `Select` ondersteunt geen gegroepeerde/geneste opties (geen
 * Figma-precedent daarvoor), dus blijft dit bewust een platte lijst.
 */
const VERZEKERING_OPTIONS = [
  { value: "aov", label: "AOV" },
  { value: "flexibele-aov", label: "Flexibele AOV" },
  { value: "aov-2-5", label: "AOV 2.5" },
  { value: "langer-mee-aov", label: "Langer mee AOV" },
  { value: "wia-excedent", label: "WIA Excedent" },
  { value: "vaste-lasten-wia-volgend", label: "Vaste lasten WIA volgend" },
  { value: "woonlastenverzekering", label: "Woonlastenverzekering" },
  { value: "premie-terug-aov", label: "Premie Terug AOV" },
  { value: "ongevallen-en-ernstige-aandoeningen", label: "Ongevallen en ernstige aandoeningen" },
];

/** Actuele polisvoorwaarden met modelnummer — letterlijk uit Figma (node 2051:6180). Links zijn placeholders: er zijn geen echte PDF-bestanden. */
const ACTUELE_POLISVOORWAARDEN = [
  "AOV (model 231)",
  "Flexibele AOV (model 232)",
  "AOV 2.5 (model 233)",
  "Langer mee AOV (model 234)",
  "Voorwaarden WIA Excedent (model 822)",
  "Vaste lasten WIA volgend (model 681)",
  "Woonlastenverzekering (model 226)",
  "Premie Terug AOV (model 227)",
  "Ongevallen en ernstige aandoeningen (model 225)",
].map((label) => ({ label, href: "#" }));

/** Gecorrigeerd van 7 naar de echte 6 items — "Vaste lasten AOV WIA Volgend" stond er ten onrechte bij; dat product hoort bij het "niet meer nieuw af te sluiten"-kopje, niet bij verzekeringskaarten. */
const VERZEKERINGSKAARTEN = [
  { label: "AOV", href: "#" },
  { label: "AOV 2.5", href: "#" },
  { label: "Flexibele AOV", href: "#" },
  { label: "Langer mee AOV", href: "#" },
  { label: "AOV vangnet", href: "#" },
  { label: "WIA Excedent", href: "#" },
];

/**
 * Het modelnummer van de huidige/nieuwste voorwaarden — bevestigd via
 * Figma's voorbeeld (het ingevulde "211" leidt tot verwijzingen naar
 * "model 231" als de huidige voorwaarden). Vast, want er is geen echte
 * achterliggende data — zelfde soort gemockte constante als elders in dit
 * project (bv. /aichat's canned antwoorden).
 */
const HUIDIG_MODEL = "231";

type WijzigingsGroup = { title: string; modelnummers: string[] };

/**
 * Vervangt de eerdere Figma-placeholder ("Moedel 232/233/234, Oudere
 * modellen t/m 220, Aegon modellen") door de echte structuur, geëxtraheerd
 * van de live pagina die deze build moet verbeteren
 * (asr.nl/arbeidsongeschiktheidsverzekering/overzicht-voorwaarden-en-vergoedingen).
 * De live pagina toont "naar AOV-model 221/222/223/224" zelf ook al als
 * 4 eigen, losse top-level groepen (niet genest onder 231/232/233/234) —
 * dus 11 platte groepen in totaal, elk met een eigen accordion-item, i.p.v.
 * een accordion-in-accordion.
 */
const WIJZIGINGSOVERZICHTEN: WijzigingsGroup[] = [
  { title: "Wijzigingsoverzichten naar AOV-model 231", modelnummers: ["221", "211", "198", "193", "188", "1FU"] },
  { title: "Wijzigingsoverzichten naar AOV-model 232", modelnummers: ["222", "212", "195", "194", "190"] },
  { title: "Wijzigingsoverzichten naar AOV-model 233", modelnummers: ["223", "215"] },
  { title: "Wijzigingsoverzichten naar AOV-model 234", modelnummers: ["224", "216"] },
  {
    title: "Wijzigingsoverzichten naar AOV-model 221",
    modelnummers: ["211", "198", "193", "188", "184", "183", "179", "175", "168", "167", "166", "164", "156", "1", "B64", "F76"],
  },
  { title: "Wijzigingsoverzichten naar Flexibele AOV-model 222", modelnummers: ["212", "195", "194", "190", "187"] },
  {
    title: "Aegon – volledige AOV en AOV met uitsluiting psychische klachten",
    modelnummers: ["1422", "1439", "1449", "1450", "1475"],
  },
  { title: "Aegon – AOV Ongevallen en ernstige aandoeningen", modelnummers: ["1422", "1439", "1449", "1450", "1475"] },
  { title: "Aegon – AOV Ongevallen", modelnummers: ["1422", "1439", "1449", "1450", "1475"] },
  { title: "Wijzigingsoverzichten naar AOV 2.5 model 223", modelnummers: ["215", "196", "189", "186"] },
  { title: "Wijzigingsoverzichten naar de Langer mee AOV-model 224", modelnummers: ["216", "197", "192"] },
];

function ModelHistoryList({ modelnummers }: { modelnummers: string[] }) {
  return (
    <div className="flex flex-col gap-1 pl-4">
      {modelnummers.map((modelnummer) => (
        <a key={modelnummer} href="#" className="flex items-center gap-2 py-1">
          <Icon name="chevron-right" size="sm" />
          <span className="text-[#0064a8] text-base leading-[1.5] hover:underline" style={{ fontFamily: "var(--font-avenir-book)" }}>
            Wijzigingen modelnummer {modelnummer}
          </span>
        </a>
      ))}
    </div>
  );
}

const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "Klantenservice", links: ["Inloggen", "Schade melden", "Gegevens wijzigen", "Financieel advies", "Onze apps", "Contact"] },
  { title: "Onze impact", links: ["Duurzaamheid", "Maatschappij", "Toegankelijkheid", "a.s.r. Vitality", "Doenkracht", "De raad van doen"] },
  { title: "a.s.r.", links: ["Over a.s.r.", "Blogs", "Nieuws en financiële publicaties", "Werken bij a.s.r.", "Fondsen en koersen"] },
];

/**
 * "Voorwaarden vinden" — service page, Figma node 2002:2203 ("Service page
 * master template [DESKTOP]"). Alleen het DESKTOP-frame is bevestigd via
 * MCP; het responsieve gedrag (padding-/lettergrootte-schaal per breakpoint,
 * mobiele stapeling) is op expliciet verzoek van de opdrachtgever 1-op-1
 * overgenomen van het al bevestigde patroon op `/aichat` (24/48/64/128px
 * marge-schaal, H1 32→40px, H2 24→32px, sectietekst 14→18px, hero-tekst
 * 16→20px) — geen apart mobiel Figma-frame voor déze pagina geraadpleegd.
 */
export default function VoorwaardenPage() {
  const [verzekering, setVerzekering] = useState("");
  const [modelnummer, setModelnummer] = useState("");
  const [result, setResult] = useState<{ verzekeringLabel: string; modelnummer: string } | null>(null);

  const verzekeringLabel = VERZEKERING_OPTIONS.find((option) => option.value === verzekering)?.label ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!verzekeringLabel || !modelnummer.trim()) return;
    setResult({ verzekeringLabel, modelnummer: modelnummer.trim() });
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-white">
      <SiteHeader />

      <Breadcrumb
        items={[{ label: "Home" }, { label: "Breadcrumb item" }, { label: "Breadcrumb item" }, { label: "Breadcrumb item" }, { label: "Current page" }]}
      />

      <main className="flex w-full flex-col items-start gap-6 pb-6 min-[600px]:gap-12 min-[600px]:pb-12">
        {/* Hero — H1 32px→40px, paragraaf 16px→20px, marge-schaal 24/48/64/128px: zelfde patroon als /aichat's hero. */}
        <section className="w-full px-6 pt-6 min-[600px]:px-12 min-[600px]:pt-10 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-2 min-[600px]:gap-3">
            <h1 className="text-black text-[32px] leading-[1.2] min-[600px]:text-[40px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
              Vind de voorwaarden van je arbeidsongeschiktheidsverzekering
            </h1>
            <p className="max-w-[880px] text-black text-base leading-[1.4] min-[600px]:text-xl" style={{ fontFamily: "var(--font-avenir-book)" }}>
              Wil je precies weten hoe het ook alweer zat met jouw AOV? Op deze pagina vind je een overzicht van de polisvoorwaarden voor onze AOV&apos;s voor ondernemers.
            </p>
          </div>
        </section>

        {/* Inhoudsopgave — springt naar de secties hieronder (Figma node 2061:7049). */}
        <section className="w-full px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto w-full max-w-[1200px]">
            <TableOfContents
              items={[
                { label: "Bekijk je voorwaarden en documenten", targetId: "voorwaarden-vinden" },
                { label: "Actuele polisvoorwaarden", targetId: "actuele-polisvoorwaarden" },
                { label: "Alle eerdere modellen", targetId: "oudere-voorwaarden" },
                { label: "Gratis advies", targetId: "gratis-advies" },
                { label: "Hulp nodig", targetId: "hulp-en-contact" },
              ]}
            />
          </div>
        </section>

        {/* Voorwaarden vinden — zoekformulier. py-6 mobiel i.p.v. de vaste py-12, zelfde aanpassing als AIChatBlock's crème sectie op /aichat. */}
        <section id="voorwaarden-vinden" className="w-full scroll-mt-6 bg-[#fff8e3] px-6 py-6 min-[600px]:px-12 min-[600px]:py-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex max-w-[800px] flex-col gap-4 min-[600px]:gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                  Bekijk je voorwaarden en documenten
                </h2>
                <p className="max-w-[880px] text-black text-base leading-[1.4] min-[600px]:text-xl" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Kies je verzekering en vul het modelnummer op je polisblad in. Zo zie je welke voorwaarden en documenten bij jouw verzekering horen.
                </p>
              </div>

              <form className="flex flex-col items-start gap-6" onSubmit={handleSubmit}>
                <Select
                  labelText="Welke verzekering heb je?"
                  options={VERZEKERING_OPTIONS}
                  value={verzekering}
                  onChange={setVerzekering}
                  placeholder="Maak een keuze..."
                  fieldWidth="lg"
                />
                <Input
                  labelText="Welk modelnummer staat op je polisblad?"
                  value={modelnummer}
                  onChange={setModelnummer}
                  beforeField={
                    <a href="#" className="text-[#0064a8] text-base underline" style={{ fontFamily: "var(--font-avenir-book)" }}>
                      Bekijk een voorbeeld van een polisblad
                    </a>
                  }
                />
                <Button type="primary" htmlType="submit">
                  Bekijk voorwaarden en documenten
                </Button>
              </form>

              {/*
                Resultaat na versturen — Figma node 2026:9488 (derde versie):
                hoofdtitel bovenaan de kaart, daarna 3 blokken zonder
                introtekst. Alle "AOV"-verwijzingen zijn dynamisch per gekozen
                verzekering (bevestigd door opdrachtgever), net als model
                {modelnummer}. "model 231" (HUIDIG_MODEL) is een vaste,
                gemockte waarde: er is geen echte achterliggende data over
                welk model daadwerkelijk het nieuwste is.
              */}
              {result && (
                <div className="flex w-full flex-col gap-12 rounded-md bg-white p-6 shadow-[0px_4px_8px_rgba(0,0,0,0.12)] min-[600px]:p-10">
                  <h2 className="text-black text-[20px] leading-[1.3] min-[600px]:text-[24px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                    Voorwaarden en documenten voor jouw {result.verzekeringLabel}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-black text-lg leading-[1.4] min-[600px]:text-[20px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                      Jouw {result.verzekeringLabel}-voorwaarden
                    </h3>
                    <FileList
                      items={[
                        {
                          title: `Polisvoorwaarden model ${result.modelnummer}`,
                          description: `Dit zijn de voorwaarden die gelden voor deze ${result.verzekeringLabel}-verzekering.`,
                          href: "#",
                        },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-black text-lg leading-[1.4] min-[600px]:text-[20px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                      Nieuwste {result.verzekeringLabel}-voorwaarden
                    </h3>
                    <FileList
                      items={[
                        {
                          title: `Polisvoorwaarden model ${HUIDIG_MODEL}`,
                          description: `Dit zijn de nieuwste voorwaarden die gelden voor onze ${result.verzekeringLabel}-verzekering`,
                          href: "#",
                        },
                        {
                          title: "Bekijk wat er is veranderd",
                          description: `Bekijk de verschillen tussen model ${result.modelnummer} en model ${HUIDIG_MODEL}.`,
                          href: "#",
                        },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-black text-lg leading-[1.4] min-[600px]:text-[20px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                      Overige documenten
                    </h3>
                    <FileList
                      items={[
                        {
                          title: `Verzekeringskaart ${result.verzekeringLabel}`,
                          description:
                            "Met een verzekeringskaart zie je in één oogopslag wat wel en niet verzekerd is. Zo vergelijk je onze verzekering eenvoudig met die van andere verzekeraars.",
                          href: "#",
                        },
                        {
                          title: `Vergelijkingskaart ${result.verzekeringLabel}`,
                          description: `Sluit je bij a.s.r. zelf een ${result.verzekeringLabel} af? Bekijk dan de afsluit- en onderhoudskosten en wat je van onze dienstverlening kunt verwachten.`,
                          href: "#",
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Actuele polisvoorwaarden & verzekeringskaarten — Figma node 2051:5490. Twee lijsten naast elkaar (80px ertussen) vanaf 900px, daaronder gestapeld: eigen aanname, geen mobiel frame. */}
        <section id="actuele-polisvoorwaarden" className="w-full scroll-mt-6 px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-4 min-[600px]:gap-6">
              <div className="flex max-w-[880px] flex-col gap-2">
                <h2 className="text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                  Alle actuele polisvoorwaarden en verzekeringskaarten van onze AOV&apos;s
                </h2>
                <p className="text-black text-sm leading-[1.5] min-[600px]:text-lg" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Bekijk de actuele polisvoorwaarden en verzekeringskaarten van onze AOV’s. In de polisvoorwaarden lees je wat er precies is verzekerd. Met de verzekeringskaart zie je de belangrijkste dekkingen in één oogopslag.
                </p>
              </div>
              <div className="flex flex-col items-start gap-8 min-[900px]:flex-row min-[900px]:gap-20">
                <LinkList
                  title="Actuele polisvoorwaarden"
                  items={ACTUELE_POLISVOORWAARDEN}
                  className="flex flex-col items-start gap-2"
                />
                <LinkList title="Alle verzekeringskaarten" items={VERZEKERINGSKAARTEN} className="flex flex-col items-start gap-2" />
              </div>
            </div>
          </div>
        </section>

        {/* Alle eerdere modellen. Grijze achtergrond, zelfde 24px-mobiel-py-aanpassing als de andere secties op deze pagina. */}
        <section id="oudere-voorwaarden" className="w-full scroll-mt-6 bg-[#f6f6f7] px-6 py-6 min-[600px]:px-12 min-[600px]:py-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex max-w-[800px] flex-col gap-4 min-[600px]:gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                  Wijzigingsoverzichten
                </h2>
                <p className="max-w-[880px] text-black text-sm leading-[1.5] min-[600px]:text-lg" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Klik op de versie met je oude modelnummer en je ziet wat de belangrijkste wijzigingen zijn ten opzichte van het nieuwe modelnummer.
                </p>
              </div>
              <Accordion
                items={WIJZIGINGSOVERZICHTEN.map((group) => ({
                  title: group.title,
                  content: <ModelHistoryList modelnummers={group.modelnummers} />,
                }))}
              />
            </div>
          </div>
        </section>

        {/* Gratis advies voor je AOV — Figma node 2048:2701, toegevoegd na de eerste build van deze pagina. */}
        <section id="gratis-advies" className="w-full scroll-mt-6 px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto max-w-[1200px]">
            <Card
              title="Gratis advies voor je AOV"
              description="Je sluit niet elke dag een arbeidsongeschiktheidsverzekering af. Daarom bieden wij je de mogelijkheid vragen te stellen tijdens een vrijblijvend informatiegesprek. Wij helpen je graag."
              image="/voorwaarden/aov-advies.png"
              primaryAction={{ label: "Vraag een vrijblijvend AOV-gesprek aan" }}
              secondaryAction={{ label: "Kijk hier of je een AOV nodig hebt" }}
            />
          </div>
        </section>

        {/* Hulp nodig? */}
        <section id="hulp-en-contact" className="w-full scroll-mt-6 px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-4 min-[600px]:gap-6">
              <div className="flex max-w-[880px] flex-col gap-2">
                <h2 className="text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                  Hulp nodig?
                </h2>
                <p className="text-black text-sm leading-[1.5] min-[600px]:text-lg" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Kun je je voorwaarden niet vinden? We helpen je graag bepalen welke voorwaarden bij jouw polis horen.
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-4 min-[600px]:grid-cols-2 min-[1200px]:grid-cols-3">
                <CardContact
                  title="Telefoon"
                  availability="Werkdagen van 8.30 tot 17.30 uur"
                  actionIcon="phone"
                  actionLabel="(030) 278 03 35"
                  className="flex w-full flex-col items-start gap-8 self-start rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-[23px]"
                />
                <CardContact
                  title="Contactformulier"
                  availability="Binnen 10 werkdagen antwoord"
                  actionIcon="edit"
                  actionLabel="Contactformulier invullen"
                  className="flex w-full flex-col items-start gap-8 self-start rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-[23px]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer columns={FOOTER_COLUMNS} showAppBadges centered linkSection />
    </div>
  );
}
