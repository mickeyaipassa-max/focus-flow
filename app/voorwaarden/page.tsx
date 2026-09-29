"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AnchorTiles } from "@/components/AnchorTiles";
import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LinkList } from "@/components/LinkList";
import { Accordion } from "@/components/Accordion";
import { CardContact, CardContactCollage } from "@/components/CardContact";
import { Footer, type FooterColumn } from "@/components/Footer";

/**
 * De 7 echte verzekeringstypes, bevestigd via screenshot van de
 * opdrachtgever (een aparte lijst-weergave met schild-icoon + modelnummer
 * per rij). Alleen het label gaat in deze Select — icoon en modelnummer
 * horen daar expliciet niet in, op verzoek van de opdrachtgever.
 */
const VERZEKERING_OPTIONS = [
  { value: "aov", label: "AOV" },
  { value: "flexibele-aov", label: "Flexibele AOV" },
  { value: "aov-2-5", label: "AOV 2.5" },
  { value: "langer-mee-aov", label: "Langer mee AOV" },
  { value: "wia-excedent", label: "WIA Excedent" },
  { value: "overgenomen-aegon-polissen", label: "Overgenomen Aegon-polissen" },
  { value: "niet-meer-nieuw-af-te-sluiten", label: "Niet meer nieuw af te sluiten" },
];

const VERZEKERINGSKAARTEN = [
  { label: "AOV", href: "#" },
  { label: "AOV 2.5", href: "#" },
  { label: "Flexibele AOV", href: "#" },
  { label: "Vaste lasten AOV WIA Volgend", href: "#" },
  { label: "Langer mee AOV", href: "#" },
  { label: "AOV vangnet", href: "#" },
  { label: "WIA Excedent", href: "#" },
];

/** "Moedel 232/233/234" letterlijk uit Figma overgenomen — vermoedelijke tikfout (i.p.v. "Model"), bewust niet stilzwijgend gecorrigeerd; nog te bevestigen. */
const OUDERE_MODELLEN = ["Moedel 232", "Moedel 233", "Moedel 234", "Oudere modellen t/m 220", "Aegon modellen"];

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

              <form className="flex flex-col items-start gap-6" onSubmit={(event) => event.preventDefault()}>
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
                  Alle eerdere modellen
                </h2>
                <p className="max-w-[880px] text-black text-sm leading-[1.5] min-[600px]:text-lg" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Zoek je voorwaarden van een ouder model? Bekijk de volledige lijst met historische modellen.
                </p>
              </div>
              <Accordion items={OUDERE_MODELLEN.map((title) => ({ title }))} />
            </div>
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
                  availability="Availability"
                  actionIcon="phone"
                  actionLabel="(0800) 00 00 000"
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
