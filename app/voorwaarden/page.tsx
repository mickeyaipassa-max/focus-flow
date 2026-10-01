"use client";

import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AnchorTiles } from "@/components/AnchorTiles";
import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LinkList } from "@/components/LinkList";
import { FileList } from "@/components/FileList";
import { Accordion } from "@/components/Accordion";
import { Icon } from "@/components/Icon";
import { Card } from "@/components/Card";
import { CardContact, CardContactCollage } from "@/components/CardContact";
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

      <main className="flex w-full flex-col items-start gap-6 pb-0 min-[600px]:gap-12">
        {/* Hero — H1 32px→40px, paragraaf 16px→20px, marge-schaal 24/48/64/128px: zelfde patroon als /aichat's hero. */}
        <section className="w-full px-6 pt-6 min-[600px]:px-12 min-[600px]:pt-10 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-2 min-[600px]:gap-3">
            <h1 className="text-black text-[32px] leading-[1.2] min-[600px]:text-[40px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
              Vind de voorwaarden van je arbeidsongeschiktheidsverzekering
            </h1>
            <p className="max-w-[880px] text-black text-base leading-[1.4] min-[600px]:text-xl" style={{ fontFamily: "var(--font-avenir-book)" }}>
              Kies je verzekering en het modelnummer dat op je polisblad staat. Dan laten we zien welke voorwaarden voor jou gelden.
            </p>
          </div>
        </section>

        {/* Anchor Tiles — springt naar de secties hieronder. */}
        <section className="w-full px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto w-full max-w-[1200px]">
            <AnchorTiles
              items={[
                { label: "Voorwaarden vinden", targetId: "voorwaarden-vinden" },
                { label: "Alle verzekeringskaarten", targetId: "verzekeringskaarten" },
                { label: "Oudere voorwaarden", targetId: "oudere-voorwaarden" },
                { label: "Hulp & contact", targetId: "hulp-en-contact" },
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
                  Voorwaarden vinden
                </h2>
                <p className="max-w-[880px] text-black text-base leading-[1.4] min-[600px]:text-xl" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Kies je verzekering en het modelnummer dat op je polisblad staat. Dan laten we zien welke voorwaarden daarvoor gelden.
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
                  Toon mijn voorwaarden
                </Button>
              </form>

              {/*
                Resultaat na versturen — Figma (node 2026:9511, bijgewerkt
                vanaf de eerdere versie op node 2026:9459) toont nu 3 blokken
                i.p.v. 2: het "Wijzigingen"-bestand is verhuisd van blok 1
                naar blok 2, en Verzekeringskaart/Vergelijkingskaart zijn
                verhuisd naar een nieuw derde blok "Overige documenten".
                Titels van blok 3's bestanden blijven dynamisch per gekozen
                verzekering (bevestigd door opdrachtgever), "Overige
                documenten" zelf is een vaste titel zonder verzekeringsnaam.
                De Vergelijkingskaart-beschrijving is letterlijk uit Figma
                overgenomen (noemt specifiek "AOV"/"Flexibele AOV", niet
                dynamisch). De Verzekeringskaart-beschrijving bevat nog
                steeds de bekende Figma-contentbug (duplicaat van de
                Wijzigingen-beschrijving i.p.v. een eigen tekst) — bewust
                niet stilzwijgend gecorrigeerd. "model 231" (HUIDIG_MODEL) is
                een vaste, gemockte waarde: er is geen echte achterliggende
                data over welk model daadwerkelijk het nieuwste is.
              */}
              {result && (
                <div className="flex w-full flex-col gap-12 rounded-md bg-white p-6 shadow-[0px_4px_8px_rgba(0,0,0,0.12)] min-[600px]:p-10">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-black text-[20px] leading-[1.3] min-[600px]:text-[24px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                        {result.verzekeringLabel} model {result.modelnummer}
                      </h2>
                      <p className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                        Dit zijn de voorwaarden die bij dit model horen.
                      </p>
                    </div>
                    <FileList
                      items={[
                        {
                          title: `Polisvoorwaarden model ${result.modelnummer}`,
                          description: "Dit zijn de voorwaarden die gelden voor jouw verzekering.",
                          href: "#",
                        },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-black text-[20px] leading-[1.3] min-[600px]:text-[24px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                        De nieuwste {result.verzekeringLabel}-voorwaarden
                      </h2>
                      <p className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                        Bekijk de meest recente {result.verzekeringLabel}-voorwaarden of ontdek wat er is gewijzigd tussen jouw huidige model en de nieuwste voorwaarden.
                      </p>
                    </div>
                    <FileList
                      items={[
                        {
                          title: `Polisvoorwaarden model ${HUIDIG_MODEL}`,
                          description: "Dit zijn de voorwaarden die gelden voor jouw verzekering.",
                          href: "#",
                        },
                        {
                          title: `Wijzigingen van model ${result.modelnummer} naar de nieuwste voorwaarden`,
                          description: `Bekijk welke belangrijke wijzigingen er zijn ten opzichte van de huidige voorwaarden (model ${HUIDIG_MODEL}).`,
                          href: "#",
                        },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-black text-[20px] leading-[1.3] min-[600px]:text-[24px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                        Overige documenten
                      </h2>
                      <p className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                        Bekijk de verzekeringskaart en vergelijkingskaart van de {result.verzekeringLabel}.
                      </p>
                    </div>
                    <FileList
                      items={[
                        {
                          title: `Verzekeringskaart ${result.verzekeringLabel}`,
                          description: `Bekijk welke belangrijke wijzigingen er zijn ten opzichte van de huidige voorwaarden (model ${HUIDIG_MODEL}).`,
                          href: "#",
                        },
                        {
                          title: `Vergelijkingskaart ${result.verzekeringLabel}`,
                          description:
                            "Sluit je zelf een AOV af? Dan betaal je eenmalige afsluitkosten en bij de Flexibele AOV ook jaarlijkse onderhoudskosten. Bekijk de kosten en onze dienstverlening in de vergelijkingskaart.",
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

        {/* Alle verzekeringskaarten voor de ondernemer. */}
        <section id="verzekeringskaarten" className="w-full scroll-mt-6 px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex max-w-[800px] flex-col gap-4 min-[600px]:gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                  Alle verzekeringskaarten voor de ondernemer
                </h2>
                <p className="max-w-[880px] text-black text-sm leading-[1.5] min-[600px]:text-lg" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Met een verzekeringskaart zie je in één oogopslag wat wel en niet verzekerd is als je onze verzekering afsluit. Het laat je op
                  begrijpelijke wijze zien wat de polisvoorwaarden zijn. Je kunt onze verzekeringskaarten ook goed vergelijken met de
                  verzekeringskaarten van andere verzekeraars in Nederland.
                </p>
              </div>
              <LinkList items={VERZEKERINGSKAARTEN} />
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

        {/* Kun je je voorwaarden niet vinden? */}
        <section id="hulp-en-contact" className="w-full scroll-mt-6 px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-4 min-[600px]:gap-6">
              <div className="flex max-w-[880px] flex-col gap-2">
                <h2 className="text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                  Kun je je voorwaarden niet vinden?
                </h2>
                <p className="text-black text-sm leading-[1.5] min-[600px]:text-lg" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  We helpen je graag bepalen welke voorwaarden bij jouw polis horen.
                </p>
              </div>
              <CardContactCollage>
                <CardContact
                  title="Telefoon"
                  availability="Werkdagen van 8.30 tot 17.30 uur"
                  actionIcon="phone"
                  actionLabel="(030) 278 03 35"
                  className="flex min-w-px flex-1 flex-col items-start gap-8 self-stretch rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-6"
                />
                <CardContact
                  title="Contactformulier"
                  availability="Binnen 10 werkdagen antwoord"
                  actionIcon="edit"
                  actionLabel="Contactformulier invullen"
                  className="flex min-w-px flex-1 flex-col items-start gap-8 self-stretch rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-6"
                />
              </CardContactCollage>
            </div>
          </div>
        </section>
      </main>

      <Footer columns={FOOTER_COLUMNS} centered />
    </div>
  );
}
