"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Accordion } from "@/components/Accordion";
import { CardProduct, type CardProductFeature } from "@/components/CardProduct";
import { Footer, type FooterColumn } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { List } from "@/components/List";
import { KaartCarousel } from "./KaartCarousel";
import { TegelMenu } from "./TegelMenu";

/**
 * Mobiele pagina Zorgverzekeringen (<600px), gebouwd uit Figma (bestand "Untitled", Frame 5, node 1:1424, 393px breed), met
 * dezelfde opzet als /automobiel. Teksten staan er letterlijk in, ook de plaatshouders uit het ontwerp ("Accordion title",
 * "Breadcrumb item", de tegels "Nieuwe auto? Zo geregeld!"): die zijn niet aangevuld of verbeterd.
 *
 * Bewust niet overgenomen: de zwarte balk van 64px bovenaan het Figma-frame (Rectangle 698) is de statusbalk van de
 * telefoon-mockup, geen paginainhoud. De knoppen "Bereken je premie", "Meer informatie" en de overige knoppen gaan nog nergens
 * heen: er bestaat voor zorg nog geen funnel of pagina om naartoe te sturen. Het tegelmenu ("Waarmee kunnen we helpen?") en de
 * antwoorden bij de veelgestelde vragen komen van de live pagina asr.nl/zorgverzekering en linken door naar asr.nl.
 */

const FONT_MEMPHIS = "var(--font-memphis-medium)";
const FONT_BOOK = "var(--font-avenir-book)";
const FONT_MEDIUM = "var(--font-avenir-medium)";

const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "Onze producten", links: [] },
  { title: "Zelf regelen", links: [] },
  { title: "Snel afsluiten", links: [] },
  { title: "a.s.r.", links: [] },
];

const PLACEHOLDER_FAQ = Array.from({ length: 3 }, (_, i) => ({ title: "Accordion title", id: i }));

function TekstLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-[#0064a8] underline">
      {children}
    </a>
  );
}

/** De vier vragen uit het ontwerp, met de antwoorden van asr.nl/zorgverzekering. */
const FAQ: { title: string; content: ReactNode }[] = [
  {
    title: "Waarom kiezen voor een gecontracteerde zorgverlener?",
    content: (
      <div className="flex flex-col gap-4">
        <Body>Kiezen voor een zorgverlener met contract heeft meerdere voordelen:</Body>
        <ul className="flex flex-col gap-2">
          {[
            "Je rekening vergoeden we 100%.",
            "Je schiet geen kosten voor. De zorgverlener stuurt de rekening rechtstreeks naar a.s.r.",
            "Wij maken afspraken over kwaliteit, maximale wachttijden en prijs.",
          ].map((tekst) => (
            <li key={tekst} className="flex items-start gap-2">
              <span className="flex shrink-0 items-start pt-1">
                <Icon name="bullet" size="sm" />
              </span>
              <Body className="min-w-px flex-1 text-base text-black leading-[1.5]">{tekst}</Body>
            </li>
          ))}
        </ul>
        <Body>
          Wil je weten of wij een contract hebben met een zorgverlener? Zoek de zorgverlener dan op in onze <TekstLink href="https://zorgzoeker.asr.nl/">Zorgzoeker</TekstLink>.
        </Body>
      </div>
    ),
  },
  {
    title: "Wat zijn de verschillen tussen de basisverzekeringen van a.s.r.?",
    content: (
      <Body>
        Bij a.s.r. kun je kiezen uit verschillende basisverzekeringen. Er zijn naturapolissen en combinatiepolissen. Bekijk en vergelijk de verschillende
        basisverzekeringen in het{" "}
        <TekstLink href="https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/44027.pdf">overzicht van ons polisaanbod</TekstLink>.
      </Body>
    ),
  },
  {
    title: "Alle wijzigingen in 2026",
    content: (
      <Body>
        Op onze pagina <TekstLink href="https://www.asr.nl/zorgverzekering/wijzigingen">wijzigingen en premies</TekstLink> vind je alle wijzigingen en premies van de
        zorgverzekeringen van a.s.r. in 2026. Zo ben je volledig op de hoogte van alle wijzigingen.
      </Body>
    ),
  },
  {
    title: "Zijn kinderen automatisch meeverzekerd?",
    content: (
      <Body>
        Bij het afsluiten van je zorgverzekering geef je aan of je je kinderen meeverzekert. Dat kost je niets extra’s. De aanvullende verzekering die jij voor
        jezelf hebt afgesloten, geldt dan ook voor hen. Ben je al bij ons verzekerd en ben je de verzekeringsnemer? Ook dan geldt je aanvullende verzekering
        automatisch voor je kinderen.
      </Body>
    ),
  },
];

/** Het ruitjespatroon waarmee Figma een lege afbeelding toont. */
const CHECKER =
  "bg-[#fafafa] [background-image:conic-gradient(#ececec_25%,transparent_0_50%,#ececec_0_75%,transparent_0)] [background-size:40px_40px]";

function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-2xl text-black leading-[1.3]" style={{ fontFamily: FONT_MEMPHIS }}>
      {children}
    </h2>
  );
}

function Body({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={className ?? "text-base text-black leading-[1.5]"} style={{ fontFamily: FONT_BOOK }}>
      {children}
    </p>
  );
}

function BlackButton({ children, ariaLabel }: { children: ReactNode; ariaLabel?: string }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-[3px] bg-black px-6 py-3 font-[550] text-base text-white leading-[1.5] hover:bg-[#292929]"
      style={{ fontFamily: FONT_MEDIUM }}
    >
      {children}
    </button>
  );
}

/** Een witte kaart met 1px rand (zwart 12%) en radius 6, zoals de "Card" in Figma. */
function OutlineCard({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-[23px]">{children}</div>;
}

/** Groene cirkel van 56px met een pictogram erin (Figma: Graphic Container, 32px-kader). */
function Graphic({ src }: { src: string }) {
  return (
    <span className="relative flex size-14 shrink-0 items-center justify-center" aria-hidden="true">
      <img src="/zorgverzekeringen/graphic-cirkel.svg" alt="" className="absolute inset-0 size-full" />
      <img src={src} alt="" className="relative size-8" />
    </span>
  );
}

/** Figma: Tile Group, volgorde en pictogrammen (16px-maat) zoals in het ontwerp. */
const SNELKOPPELINGEN = [
  { label: "Declaratie indienen", icon: "hand-met-zak-geld-sm" },
  { label: "Vergoedingen zoeken", icon: "search-sm" },
  { label: "Zorgverlener zoeken", icon: "heart-sm" },
  { label: "Inloggen", icon: "user-sm" },
];

const kenmerken = (ggz: string, overig: string): CardProductFeature[] => [
  { title: "Ziekenhuizen", text: "100% vrije keuze", included: true },
  { title: "Gecontracteerde zorg", text: "100% vergoeding", included: true },
  { title: "Niet-gecontracteerde GGZ en wijkverpleging", text: ggz, included: true },
  { title: "Overige niet-gecontracteerde zorg", text: overig, included: true },
];

const ZORGVERZEKERINGEN = [
  { title: "Bewuste Keuze", subtitle: "Naturaverzekering", icon: "/zorgverzekeringen/pictogram-handen-met-hart.svg", price: "€ 149,80", features: kenmerken("65% van de gemiddeld afgesproken prijs", "65% van de gemiddeld afgesproken prijs") },
  { title: "Ruime Keuze", subtitle: "Naturaverzekering", icon: "/zorgverzekeringen/pictogram-handen-met-hart.svg", price: "€ 154,50", features: kenmerken("75% van de gemiddeld afgesproken prijs", "85% van de gemiddeld afgesproken prijs") },
  { title: "Eigen Keuze", subtitle: "Combinatieverzekering", icon: "/zorgverzekeringen/pictogram-hart-met-plus.svg", price: "€ 185", features: kenmerken("80% van de gemiddeld afgesproken prijs", "100% van de marktconforme of wettelijke prijs") },
];

const EXTRA_INFORMATIE = [
  { title: "Ongevallendekking Fysio & Tand", price: "+ € 0,75", features: [{ title: "Extra vergoeding na een ongeval", text: "Tot € 20.000 voor fysiotherapie en tandartskosten", included: true }] },
  {
    title: "Ongevallendekking Fysio & Tand + Buitenland",
    price: "+ € 1,50",
    features: [
      { title: "Extra vergoeding na een ongeval", text: "Tot € 20.000 voor fysiotherapie en tandartskosten", included: true },
      {
        title: "Buitenland (spoedeisende zorg)",
        text: "Maximaal € 20.000 extra vergoeding voor fysiotherapie en tandartskosten na een ongeval. 100% vergoeding voor spoedeisende zorg wereldwijd.",
        included: true,
      },
    ],
  },
  {
    title: "Bril en lenzen € 100",
    price: "+ € 3,95",
    features: [
      { title: "Bril en lenzen", text: "€ 100 vergoeding per jaar voor brillen en lenzen op sterkte", included: true },
      { title: "Exclusief", text: "Via Pearle en GrandOptical", included: true },
    ],
  },
  {
    title: "Bril en lenzen € 200",
    price: "+ € 7,95",
    features: [
      { title: "Bril en lenzen", text: "€ 200 vergoeding per jaar voor brillen en lenzen op sterkte", included: true },
      { title: "Exclusief", text: "Via Pearle en GrandOptical", included: true },
    ],
  },
] satisfies { title: string; price: string; features: CardProductFeature[] }[];

const VOORDELEN = [
  { title: "100% vrije ziekenhuiskeuze", text: "Voor alle ziekenhuizen in Nederland", icon: "/zorgverzekeringen/voordeel-ongevallen-verzekering.svg" },
  { title: "Eenvoudig declareren", text: "Snel uitbetaald", icon: "/zorgverzekeringen/voordeel-zak-met-geld.svg" },
  {
    title: (
      <>
        3 extra fysio via
        <br />
        Zorg voor jezelf
      </>
    ),
    text: "Met elke aanvullende verzekering",
    icon: "/zorgverzekeringen/voordeel-bewegend-persoon.svg",
  },
];

const FOTO_TEGELS: { id: string; title: ReactNode; label: string }[] = [
  { id: "herstelnetwerk", title: "Zo werkt het herstelnetwerk van a.s.r.", label: "Zo werkt het herstelnetwerk van a.s.r." },
  { id: "schadeafhandeling", title: "Directe schadeafhandeling.", label: "Directe schadeafhandeling." },
  {
    id: "nieuwe-auto",
    title: (
      <>
        Nieuwe auto?
        <br />
        Zo geregeld!
      </>
    ),
    label: "Nieuwe auto? Zo geregeld!",
  },
];

const LINKLIJST = ["Auto verzekeren", "Extra verzekeringen", "Service", "Informatie"];

/** Kaart van de productcarrousels: dezelfde `CardProduct` als bij de autoverzekering, met de opt-in onderdelen voor zorg. */
const kaartKlasse = "flex w-full flex-col overflow-clip rounded-md border border-[rgba(0,0,0,0.12)] bg-white";

export function ZorgverzekeringenContent() {
  const router = useRouter();

  return (
    <div className="w-full bg-white">
      <SiteHeader />

      {/* Figma: "Breadcrumb item" is de plaatshouder voor de vorige pagina. */}
      <Breadcrumb items={[{ label: "Breadcrumb item", onClick: () => router.push("/") }, { label: "Zorgverzekeringen" }]} className="w-full px-6 pt-6 pb-6" />

      <main>
        {/* Hero: foto, witte kaart met rating en CTA, en de snelkoppelingen. */}
        <section aria-labelledby="hero-titel" className="relative bg-white">
          <img src="/zorgverzekeringen/hero.jpg" alt="" className="block h-[131px] w-full object-cover object-top" />

          <div className="relative -mt-[51px] mx-auto flex w-[343px] max-w-[calc(100%-32px)] flex-col gap-10">
            <div className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.12)]">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Icon name="star-full" size="md" />
                  <div className="flex items-baseline leading-[1.5]">
                    <span className="text-base text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                      8,1
                    </span>
                    <span className="ml-1 text-base text-[#565656]" style={{ fontFamily: FONT_MEDIUM }}>
                      /10
                    </span>
                  </div>
                </div>
                <button type="button" className="flex items-start gap-2">
                  <span className="text-base text-[#0064a8] leading-[1.5] underline" style={{ fontFamily: FONT_BOOK }}>
                    671 reviews
                  </span>
                  <span className="flex items-start pt-0.5">
                    <Icon name="new-tab" size="sm" />
                  </span>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <h1 id="hero-titel" className="text-[28px] text-black leading-[1.3]" style={{ fontFamily: FONT_MEMPHIS }}>
                    De zorgverzekeringen van a.s.r.
                  </h1>
                  <Body>Bij a.s.r. ben je altijd goed verzekerd vanaf € 149,80 per maand</Body>
                </div>

                <ul className="flex flex-col gap-2">
                  {["3 jaar nieuw- of aankoopwaarde vergoed", "No-claimkorting tot 75%", "Snelle hulp en betrouwbare service"].map((tekst) => (
                    <li key={tekst} className="flex items-start gap-2">
                      <span className="flex items-start pt-0.5">
                        <Icon name="check" size="sm" />
                      </span>
                      <Body className="min-w-0 flex-1 text-black text-sm leading-[1.5]">{tekst}</Body>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="flex h-[51px] w-full items-center justify-center rounded-[3px] border-[rgba(0,0,0,0.08)] border-b-2 bg-[#eda50f] px-6 font-[550] text-base text-black leading-[1.5] hover:bg-[#f0b335]"
                  style={{ fontFamily: FONT_MEDIUM }}
                >
                  Bereken je premie
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-px overflow-clip rounded-md bg-[rgba(0,0,0,0.16)] shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              {SNELKOPPELINGEN.map((tegel) => (
                <li key={tegel.label} className="bg-white">
                  <button type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fff8e3]">
                      <Icon name={tegel.icon} size="sm" />
                    </span>
                    <span className="flex-1 font-[550] text-base text-black leading-[1.5]" style={{ fontFamily: FONT_MEDIUM }}>
                      {tegel.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Zorgverzekeringen van a.s.r.: gele band met de drie zorgverzekeringen. */}
        <section aria-labelledby="zorgverzekeringen-titel" className="mt-[61px] flex flex-col gap-4 bg-[#fff8e3] pt-10 pb-9">
          <div className="flex flex-col px-6">
            <SectionTitle id="zorgverzekeringen-titel">Zorgverzekeringen van a.s.r.</SectionTitle>
          </div>
          <KaartCarousel
            label="Zorgverzekeringen"
            items={ZORGVERZEKERINGEN.map((verzekering) => ({
              key: verzekering.title,
              label: verzekering.title,
              content: (
                <CardProduct
                  title={verzekering.title}
                  subtitle={verzekering.subtitle}
                  subtitleLarge
                  icon={<Graphic src={verzekering.icon} />}
                  features={verzekering.features}
                  price={verzekering.price}
                  primaryLabel="Bereken je premie"
                  primaryAriaLabel={`Bereken je premie voor ${verzekering.title}`}
                  secondaryLabel="Meer informatie"
                  secondaryAriaLabel={`Meer informatie over ${verzekering.title}`}
                  secondaryAsLink
                  className={kaartKlasse}
                />
              ),
            }))}
          />
        </section>

        {/* Breid je zorgverzekering uit. */}
        <section aria-labelledby="uitbreiden-titel" className="flex flex-col items-center bg-white px-[30px] pt-6 pb-[58px]">
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col">
              <SectionTitle id="uitbreiden-titel">Breid je zorgverzekering uit</SectionTitle>
              <Body>
                Niet alle zorg is verzekerd vanuit de basisverzekering. Denk bijvoorbeeld aan fysiotherapie, orthodontie of tandartskosten vanaf 18 jaar.
                Verwacht je extra zorgkosten? Of wil je je verzekeren tegen onverwachte kosten? Kies dan een aanvullende verzekering of tandartsverzekering
                die bij jou past.
              </Body>
            </div>
            <div className="flex flex-col gap-6">
              {[
                { vanaf: "Vanaf € 4,95 per maand", titel: "Aanvullende verzekering", punten: ["Fysiotherapie", "Anticonceptie", "Vervangende mantelzorg", "Gezondheidscheck"], knop: "Bekijk aanvullende verzekeringen" },
                {
                  vanaf: "Vanaf € 10,- per maand",
                  titel: "Tandartsverzekering",
                  punten: ["Vergoeding vanaf 18 jaar", "Normale behandelingen", "Gebitsreiniging", "Uitgebreide behandelingen", "Spoedeisende hulp in het buitenland"],
                  knop: "Bekijk tandartsverzekeringen",
                },
              ].map((kaart) => (
                <OutlineCard key={kaart.titel}>
                  <div className="flex flex-col gap-4">
                    <Body className="text-base text-[#565656] leading-[1.5]">{kaart.vanaf}</Body>
                    <h3 className="text-xl text-black leading-[1.4]" style={{ fontFamily: FONT_MEMPHIS }}>
                      {kaart.titel}
                    </h3>
                  </div>
                  <List icon="check-sm" items={kaart.punten.map((text) => ({ text }))} />
                  <div>
                    <BlackButton>{kaart.knop}</BlackButton>
                  </div>
                </OutlineCard>
              ))}
            </div>
          </div>
        </section>

        {/* Extra modules: kop en vier kaarten in een carrousel, op een gele band. */}
        <section aria-labelledby="modules-titel" className="flex flex-col gap-3 bg-[#fff8e3] pt-[34px] pb-[35px]">
          <div className="pr-12 pl-6">
            <SectionTitle id="modules-titel">Extra modules bij je zorgverzekering</SectionTitle>
          </div>
          <KaartCarousel
            label="Extra modules"
            items={EXTRA_INFORMATIE.map((module) => ({
              key: module.title,
              label: module.title,
              content: (
                <CardProduct
                  title={module.title}
                  subtitle="Module"
                  subtitleLarge
                  features={module.features}
                  price={module.price}
                  primaryLabel="Bereken je premie"
                  primaryAriaLabel={`Bereken je premie voor ${module.title}`}
                  secondaryLabel="Meer informatie"
                  secondaryAriaLabel={`Meer informatie over ${module.title}`}
                  secondaryAsLink
                  className={kaartKlasse}
                />
              ),
            }))}
          />
        </section>

        {/* Verplicht eigen risico. */}
        <section className="bg-[#eef4e3] px-6 py-10">
          <OutlineCard>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl text-black leading-[1.3]" style={{ fontFamily: FONT_MEMPHIS }}>
                Verplicht eigen risico
              </h2>
              <Body>
                Ben je 18 jaar of ouder? Dan betaal je verplicht eigen risico voor zorg uit de basisverzekering. Het verplichte eigen risico is € 385. Je kunt dit
                bedrag verhogen tot maximaal € 885. Zo krijg je korting op je zorgverzekering.
              </Body>
            </div>
            <div>
              <BlackButton>Lees meer over het eigen risico</BlackButton>
            </div>
          </OutlineCard>
        </section>

        {/* Waarmee kunnen we helpen? Het tegelmenu met twee niveaus. */}
        <section aria-labelledby="helpen-titel" className="flex flex-col gap-[10px] bg-[#f6f6f7] px-6 py-10">
          <div className="flex flex-col">
            <SectionTitle id="helpen-titel">Waarmee kunnen we helpen?</SectionTitle>
            <Body>Vind snel de juiste informatie over jouw zorgverzekering.</Body>
          </div>
          <TegelMenu label="Waarmee kunnen we helpen?" />
        </section>

        {/* Collectieve zorgverzekering. */}
        <section className="bg-white px-6 py-10">
          <OutlineCard>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl text-black leading-[1.3]" style={{ fontFamily: FONT_MEMPHIS }}>
                Korting met een collectieve zorgverzekering
              </h2>
              <Body>Biedt jouw werkgever een collectieve zorgverzekering aan? Dan krijgen jij en je medeverzekerden extra vergoedingen en korting op je aanvullende verzekeringen.</Body>
            </div>
            <div>
              <BlackButton>Bekijk collectieve zorgverzekering</BlackButton>
            </div>
          </OutlineCard>
        </section>

        {/* Drie voordelen op een gele band. */}
        <section aria-label="Voordelen" className="flex flex-col gap-[10px] bg-[#fff8e3] px-6 py-10">
          {VOORDELEN.map((voordeel, index) => (
            <div key={index} className="flex flex-col items-center gap-4 rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-6 text-center">
              <span className="relative flex shrink-0 items-center justify-center p-3" aria-hidden="true">
                <img src="/zorgverzekeringen/graphic-cirkel.svg" alt="" className="absolute inset-0 size-full" />
                <img src={voordeel.icon} alt="" className="relative size-8" />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl text-black leading-[1.3]" style={{ fontFamily: FONT_MEMPHIS }}>
                  {voordeel.title}
                </h2>
                <Body>{voordeel.text}</Body>
              </div>
            </div>
          ))}
        </section>

        {/* Overstappen. */}
        <section className="bg-white px-6 py-10">
          <div className="flex flex-col rounded-md border border-[rgba(0,0,0,0.12)] bg-white">
            <div className="px-[11px] pt-[11px]">
              <img src="/zorgverzekeringen/overstappen.jpg" alt="Een adviseur in gesprek met een klant" className="block h-[200px] w-full rounded-[3px] object-cover" />
            </div>
            <div className="flex flex-col gap-4 px-[23px] pt-6 pb-[23px]">
              <div className="flex flex-col gap-2">
                <SectionTitle>Overstappen van zorgverzekering</SectionTitle>
                <Body>Overstappen van zorgverzekering is alleen mogelijk vanaf 1 januari van het volgende jaar. In sommige gevallen kun je overstappen tijdens het kalenderjaar.</Body>
              </div>
              <div>
                <BlackButton>Lees alles over overstappen</BlackButton>
              </div>
            </div>
          </div>
        </section>

        {/* Wat vergoedt je zorgverzekering? */}
        <section aria-labelledby="vergoedt-titel" className="bg-[#eef4e3] px-[30px] py-10">
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col">
              <SectionTitle id="vergoedt-titel">Wat vergoedt je zorgverzekering?</SectionTitle>
              {/* Zo staat het in Figma: de vraag staat daar nog een keer als eerste regel van de tekst. */}
              <Body>
                Wat vergoedt je zorgverzekering?
                <br />
                Je zorgverzekering vergoedt kosten voor zorg. Welke kosten we vergoeden, hangt af van de verzekering die je hebt afgesloten. En of je zorgverlener
                een contract met a.s.r. heeft.
              </Body>
            </div>
            <div className="flex flex-col gap-6">
              {[
                { titel: "Bekijk je vergoedingen", tekst: "Kijk of jouw verzekering je behandeling vergoedt.", knop: "Bekijk aanvullende verzekeringen" },
                { titel: "Zoek een zorgverlener", tekst: "Bekijk of jouw zorgverlener een contract heeft met a.s.r.", knop: "Ga naar de Zorgzoeker" },
              ].map((kaart) => (
                <OutlineCard key={kaart.titel}>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl text-black leading-[1.4]" style={{ fontFamily: FONT_MEMPHIS }}>
                      {kaart.titel}
                    </h3>
                    <Body>{kaart.tekst}</Body>
                  </div>
                  <div>
                    <BlackButton>{kaart.knop}</BlackButton>
                  </div>
                </OutlineCard>
              ))}
            </div>
          </div>
        </section>

        {/* Veelgestelde vragen. */}
        <section className="flex flex-col gap-4 bg-white px-6 pt-10 pb-12">
          <SectionTitle>Veelgestelde vragen</SectionTitle>
          <Accordion items={FAQ} />
        </section>

        {/* Extra informatie en documenten. */}
        <section className="flex flex-col gap-4 bg-[#f6f6f7] px-6 py-10">
          <SectionTitle>Extra informatie en documenten</SectionTitle>
          <Accordion items={PLACEHOLDER_FAQ.map((item) => ({ title: item.title }))} />
        </section>

        {/* Drie fototegels. */}
        <section className="flex flex-col gap-4 bg-white px-6 py-10">
          {FOTO_TEGELS.map((tegel) => (
            <div key={tegel.id} className="flex flex-col overflow-clip rounded-md bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <div className={`h-[200px] w-full ${CHECKER}`} role="img" aria-label="Afbeelding volgt" />
              <div className="flex flex-col gap-[5px] p-6">
                <h2 className="text-2xl text-black leading-[1.3]" style={{ fontFamily: FONT_MEMPHIS }}>
                  {tegel.title}
                </h2>
                <div className="flex justify-end">
                  <button type="button" aria-label={tegel.label} className="flex size-10 items-center justify-center rounded-full bg-[#fff8e3]">
                    <Icon name="arrow-right-black" size="md" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Link-lijst. */}
        <section className="bg-white px-[33px] py-10">
          <Accordion compactTitles items={LINKLIJST.map((title) => ({ title }))} />
        </section>
      </main>

      <Footer linkSection compactText columns={FOOTER_COLUMNS} />
    </div>
  );
}
