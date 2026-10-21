"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { CardProduct } from "@/components/CardProduct";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { Footer, type FooterColumn } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { List } from "@/components/List";
import { Tile } from "@/components/Tile";
import { smoothScrollToElement } from "@/lib/smoothScroll";
import { Preventiecheck } from "./Preventiecheck";

/**
 * Product Group-pagina "Woonverzekeringen" (`/woonv2`), gebouwd op de Figma-template "Een huis kopen v1
 * [collection]" (bestand "Woonverzekeringen", node 110:12884) met de inhoud uit de briefing.
 *
 * Kleuren en lettertypes volgen onze bestaande componenten en de template (a.s.r.-tokens: zwart, crème
 * #fff8e3, geel #eda50f, lichtgroen #eef4e3, Memphis + Avenir), niet de donkergroene stijl uit de briefing.
 * Responsief gedrag: dezelfde marge-schaal als /aichat en /voorwaarden (24/48/64/128px, max 1200px).
 *
 * Bewust niet gebouwd of verzonnen: premiebedragen, foto's (neutrale placeholders met beeldomschrijving), de
 * vragen 2 t/m 5 van de preventiecheck, en bestemmingen van links waarvoor nog geen pagina bestaat (die staan
 * op "#"). "Bereken je premie" en "Help mij kiezen" gaan naar de bestaande funnel op /woonverzekeringen.
 */

const SECTIE_PADDING = "px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32";
const H2_KLASSE = "text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]";
const BODY_KLASSE = "text-black text-base leading-[1.5] min-[600px]:text-lg";
const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;

const FUNNEL_ROUTE = "/woonverzekeringen";

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Wat is het verschil tussen een inboedel- en opstalverzekering?",
    answer:
      "Een opstalverzekering is voor je woning en onderdelen die eraan vastzitten. Een inboedelverzekering is voor de spullen in je huis, zoals meubels, kleding en elektronica. Welke schade precies gedekt is, hangt af van de oorzaak, je gekozen dekking en de polisvoorwaarden.",
  },
  {
    question: "Welke verzekering heb ik nodig als huurder?",
    answer:
      "Als huurder is een inboedelverzekering vaak het meest passend, omdat die je eigen spullen dekt. Of je ook een opstalverzekering nodig hebt, hangt af van je huurcontract en wat je zelf in je woning hebt aangebracht. Kijk daarvoor in je huurcontract of vraag het je verhuurder.",
  },
  {
    question: "Zijn zonnepanelen, een warmtepomp en thuisbatterij verzekerd?",
    answer:
      "Dat kan, maar het hangt af van de verzekering die je kiest en van de polisvoorwaarden. Onderdelen die aan je woning vastzitten horen vaak bij de opstalverzekering. Kijk bij je dekking en in de polisvoorwaarden of jouw installatie is meeverzekerd.",
  },
  {
    question: "Is schade door kortsluiting altijd verzekerd?",
    answer:
      "Nee, niet altijd. Of schade door kortsluiting gedekt is, hangt af van de oorzaak van de schade, de verzekering die je hebt gekozen en de polisvoorwaarden. Kijk in je polis welke dekking voor jou geldt.",
  },
  {
    question: "Kan ik inboedel en opstal samen afsluiten?",
    answer:
      "Ja, je kunt beide verzekeringen in één berekening bekijken. Zo zie je wat past bij je woning en situatie. Wat je krijgt aangeboden hangt af van je persoonlijke situatie.",
  },
];

const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "Woonverzekeringen", links: ["Inboedelverzekering", "Opstalverzekering", "Premie berekenen", "Verzekeringen vergelijken"] },
  { title: "Schade en service", links: ["Schade melden", "Verzekering wijzigen", "Inloggen", "Contact"] },
  { title: "Veilig wonen", links: ["Fietsaccu veilig opladen", "Thuisbatterij veilig gebruiken", "Kortsluiting voorkomen", "Expertadvies"] },
  { title: "Over a.s.r.", links: ["Over a.s.r.", "Werken bij a.s.r.", "Nieuws", "Duurzaamheid"] },
];

/** Neutrale fotografie-placeholder: een grijs vlak met de omschrijving van het beeld dat er later komt. */
function FotoPlaceholder({ beschrijving, className }: { beschrijving: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Placeholder voor foto: ${beschrijving}`}
      className={["flex items-end rounded-md bg-[#f6f6f7] p-4 text-[#565656] text-sm leading-[1.5]", className ?? "min-h-[240px]"].join(" ")}
      style={AVENIR}
    >
      <span>Fotografie-placeholder: {beschrijving}</span>
    </div>
  );
}

/** Sectie met de gedeelde marge-schaal en een gecentreerde kolom van maximaal 1200px. */
function Sectie({ id, achtergrond, children, className }: { id?: string; achtergrond?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={["w-full scroll-mt-6 py-6 min-[600px]:py-12", SECTIE_PADDING, achtergrond ?? ""].join(" ")}>
      <div className={["mx-auto max-w-[1200px]", className ?? ""].join(" ")}>{children}</div>
    </section>
  );
}

function Kop({ children, intro }: { children: ReactNode; intro?: string }) {
  return (
    <div className="mb-6 flex max-w-[880px] flex-col gap-2 min-[600px]:mb-8">
      <h2 className={H2_KLASSE} style={MEMPHIS}>
        {children}
      </h2>
      {intro && (
        <p className={BODY_KLASSE} style={AVENIR}>
          {intro}
        </p>
      )}
    </div>
  );
}

/** Tekstlink met duidelijke hover- en focusstaat; bestemming `#` zolang er nog geen pagina voor is. */
function TekstLink({ href, children, onClick }: { href: string; children: ReactNode; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="inline-flex items-center gap-2 text-black text-base underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black min-[600px]:text-lg"
      style={{ fontFamily: "var(--font-avenir-medium)" }}
    >
      {children}
      <Icon name="arrow-right-black" size="sm" />
    </a>
  );
}

export default function WoonV2Page() {
  const router = useRouter();
  const naarFunnel = () => router.push(FUNNEL_ROUTE);
  const scrollNaar = (id: string) => {
    const doel = document.getElementById(id);
    if (doel) smoothScrollToElement(doel);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-white">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home" }, { label: "Verzekeringen" }, { label: "Woonverzekeringen" }]} />

      <main className="flex w-full flex-col items-start">
        {/* 2. Hero — twee kolommen: tekst links, foto-placeholder rechts (Figma Hero layout C). */}
        <section className={["w-full bg-[#fff8e3] py-8 min-[600px]:py-12", SECTIE_PADDING].join(" ")}>
          <div className="mx-auto grid max-w-[1200px] items-center gap-8 min-[900px]:grid-cols-2 min-[900px]:gap-12">
            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-black text-sm uppercase leading-[1.5] tracking-[0.12em]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  Woonverzekeringen
                </p>
                <h1 className="text-black text-[32px] leading-[1.2] min-[600px]:text-[40px]" style={MEMPHIS}>
                  Verzeker je huis en spullen goed
                </h1>
                <p className="text-black text-base leading-[1.4] min-[600px]:text-xl" style={AVENIR}>
                  Met de woonverzekeringen van a.s.r. kies je de bescherming die past bij jouw woning en situatie.
                </p>
              </div>
              <List
                icon="check"
                items={[
                  { text: "Kies inboedel, opstal of allebei" },
                  { text: "Binnen enkele minuten geregeld" },
                  { text: "Ook oplossingen voor een steeds elektrischer huis" },
                ]}
              />
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button type="brand" onClick={naarFunnel}>
                  Bereken je premie
                </Button>
                <TekstLink
                  href="#keuzehulp"
                  onClick={() => scrollNaar("keuzehulp")}
                >
                  Welke verzekering heb ik nodig?
                </TekstLink>
              </div>
            </div>
            <FotoPlaceholder
              className="min-h-[280px] min-[900px]:min-h-[440px]"
              beschrijving="een gezin van 30 tot 50 jaar in een eigentijdse woning, met subtiel een e-bike, zonnepanelen of laadpunt in beeld"
            />
          </div>
        </section>

        {/* 3. Quick access bar — vier compacte acties. */}
        <Sectie>
          <ul className="grid gap-4 min-[600px]:grid-cols-2 min-[1200px]:grid-cols-4">
            {[
              { titel: "Premie berekenen", icoon: "euro", actie: naarFunnel },
              { titel: "Verzekeringen vergelijken", icoon: "list-check", actie: () => scrollNaar("productkeuze") },
              { titel: "Schade melden", icoon: "warning", actie: undefined },
              { titel: "Service en contact", icoon: "phone", actie: undefined },
            ].map((item) => (
              <li key={item.titel} className="flex">
                <Tile
                  icon={<Icon name={item.icoon} size="md" />}
                  title={item.titel}
                  onClick={item.actie}
                  className="flex w-full items-center gap-3 rounded-md bg-white px-4 py-4 text-left shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] hover:bg-[#fafafa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                />
              </li>
            ))}
          </ul>
        </Sectie>

        {/* 4. Productkeuze — drie vergelijkbare kaarten, de derde met extra nadruk. */}
        <Sectie id="productkeuze">
          <Kop intro="Kies de verzekering die past bij je woning en spullen.">Welke woonverzekering past bij jou?</Kop>
          <div className="grid items-stretch gap-6 min-[900px]:grid-cols-3">
            <CardProduct
              className="flex w-full flex-col overflow-clip rounded-md border border-[rgba(0,0,0,0.12)] bg-white"
              title="Inboedelverzekering"
              description="Voor je meubels, kleding, elektronica en andere spullen in huis."
              features={[
                { text: "Ook je spullen in de tuin of op het balkon", included: true },
                { text: "Mobiele elektronica aanvullend mee te verzekeren", included: true },
              ]}
              primaryLabel="Bekijk de inboedelverzekering"
              secondaryLabel="Bereken je premie"
              onSecondaryClick={naarFunnel}
            />
            <CardProduct
              className="flex w-full flex-col overflow-clip rounded-md border border-[rgba(0,0,0,0.12)] bg-white"
              title="Opstalverzekering"
              description="Voor je woning en alles wat eraan vastzit."
              features={[
                { text: "Zonnepanelen en thuisbatterij", included: true },
                { text: "Warmtepomp en laadpaal", included: true },
                { text: "Garantie tegen onderverzekering", included: true },
              ]}
              primaryLabel="Bekijk de opstalverzekering"
              secondaryLabel="Bereken je premie"
              onSecondaryClick={naarFunnel}
            />
            <CardProduct
              className="flex w-full flex-col overflow-clip rounded-md border-2 border-black bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.16)]"
              emphasis
              tag="Vaak gekozen"
              title="Inboedel + opstal"
              description="Bescherm je woning én je spullen in één berekening."
              features={[
                { text: "Eén overzichtelijke berekening", included: true },
                { text: "Een combinatie passend bij je woonsituatie", included: true },
              ]}
              primaryLabel="Bereken beide verzekeringen"
              onPrimaryClick={naarFunnel}
            />
          </div>
          <p className="mt-4 text-[#565656] text-sm leading-[1.5]" style={AVENIR}>
            Wat gedekt is, hangt af van je gekozen verzekering, de oorzaak van de schade en de polisvoorwaarden.
          </p>
        </Sectie>

        {/* 5. Keuzehulp — lichtgroen vlak met drie situaties. */}
        <Sectie id="keuzehulp" achtergrond="bg-[#eef4e3]">
          <Kop>Snel zien wat je nodig hebt</Kop>
          <ul className="grid gap-4 min-[900px]:grid-cols-3">
            {[
              { titel: "Huurwoning", tekst: "meestal een inboedelverzekering" },
              { titel: "Koopwoning", tekst: "meestal inboedel én opstal" },
              { titel: "Appartement", tekst: "controleer of de opstal via de VvE loopt" },
            ].map((situatie) => (
              <li key={situatie.titel} className="flex flex-col gap-1 rounded-md bg-white p-6">
                <p className="text-black text-xl leading-[1.4]" style={MEMPHIS}>
                  {situatie.titel}
                </p>
                <p className={BODY_KLASSE} style={AVENIR}>
                  {situatie.tekst}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button type="primary" onClick={naarFunnel}>
              Help mij kiezen
            </Button>
          </div>
        </Sectie>

        {/* 6. Campagneblok — foto links, tekst rechts. */}
        <Sectie>
          <div className="grid items-center gap-8 min-[900px]:grid-cols-2 min-[900px]:gap-12">
            <FotoPlaceholder
              className="min-h-[260px] min-[900px]:min-h-[380px]"
              beschrijving="een herkenbare woonsituatie waarin één elektrisch apparaat duidelijk centraal staat"
            />
            <div className="flex flex-col items-start gap-4">
              <h2 className={H2_KLASSE} style={MEMPHIS}>
                Je huis wordt steeds elektrischer
              </h2>
              <p className={BODY_KLASSE} style={AVENIR}>
                Zonnepanelen, een e-bike, warmtepomp of thuisbatterij maken het dagelijks leven makkelijker. Ontdek hoe je verzekerd bent bij gedekte schade door elektrische apparaten en wat je zelf kunt doen om schade te voorkomen.
              </p>
              <Button type="secondary" onClick={() => undefined}>
                Bekijk wat verzekerd is
              </Button>
            </div>
          </div>
        </Sectie>

        {/* 7. Interactieve preventiecheck. */}
        <Sectie achtergrond="bg-[#fff8e3]">
          <Kop intro="Beantwoord vijf korte vragen en ontvang praktische tips om schade te voorkomen.">Hoe veilig is jouw elektrische huis?</Kop>
          <div className="max-w-[880px]">
            <Preventiecheck />
          </div>
        </Sectie>

        {/* 8. Voordelen — zes compacte voordelen met iconen. */}
        <Sectie>
          <Kop>Daarom kies je voor woonverzekeringen van a.s.r.</Kop>
          <ul className="grid gap-6 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3">
            {[
              { tekst: "Binnen enkele minuten geregeld", icoon: "clock" },
              { tekst: "Inboedel en opstal te combineren", icoon: "add" },
              { tekst: "Duurzame installaties mee te verzekeren", icoon: "success" },
              { tekst: "Garantie tegen onderverzekering", icoon: "info" },
              { tekst: "Hulp bij het voorkomen van schade", icoon: "chat" },
              { tekst: "Vakkundig herstel na schade", icoon: "star-full" },
            ].map((voordeel) => (
              <li key={voordeel.tekst} className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fff8e3]">
                  <Icon name={voordeel.icoon} size="md" />
                </span>
                <span className={BODY_KLASSE} style={{ fontFamily: "var(--font-avenir-medium)" }}>
                  {voordeel.tekst}
                </span>
              </li>
            ))}
          </ul>
        </Sectie>

        {/* 9. Contentkaarten — drie kaarten met beeldplaceholder. */}
        <Sectie>
          <Kop>Veilig omgaan met elektrische apparaten</Kop>
          <div className="grid gap-6 min-[900px]:grid-cols-3">
            {[
              { titel: "Laad je fietsaccu veilig op", tekst: "Praktische tips om het risico op brand te verkleinen.", link: "Bekijk de tips voor je fietsaccu", beeld: "een fietsaccu die veilig wordt opgeladen" },
              { titel: "Gebruik je thuisbatterij veilig", tekst: "Ontdek waarop je let bij plaatsing, opladen en dagelijks gebruik.", link: "Bekijk de tips voor thuisbatterijen", beeld: "een thuisbatterij in een technische ruimte" },
              { titel: "Voorkom kortsluiting en overspanning", tekst: "Herken mogelijke risico's en beperk de kans op schade.", link: "Bekijk de veiligheidstips", beeld: "een stekkerdoos en meterkast in een woning" },
            ].map((kaart) => (
              <article key={kaart.titel} className="flex flex-col overflow-clip rounded-md border border-[rgba(0,0,0,0.12)] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
                <FotoPlaceholder className="min-h-[200px] rounded-none" beschrijving={kaart.beeld} />
                <div className="flex flex-1 flex-col items-start gap-3 p-6">
                  <h3 className="text-black text-xl leading-[1.3]" style={MEMPHIS}>
                    {kaart.titel}
                  </h3>
                  <p className={BODY_KLASSE} style={AVENIR}>
                    {kaart.tekst}
                  </p>
                  <div className="mt-auto pt-2">
                    <TekstLink href="#">{kaart.link}</TekstLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Sectie>

        {/* 10. Expertblok — tekst links, foto rechts. */}
        <Sectie achtergrond="bg-[#eef4e3]">
          <div className="grid items-center gap-8 min-[900px]:grid-cols-2 min-[900px]:gap-12">
            <div className="flex flex-col items-start gap-4 min-[900px]:order-1">
              <h2 className={H2_KLASSE} style={MEMPHIS}>
                Veilig of niet? De expert kijkt mee
              </h2>
              <p className={BODY_KLASSE} style={AVENIR}>
                Een schadepreventiespecialist beoordeelt herkenbare situaties bij mensen thuis en legt uit wat beter kan, waarom dat belangrijk is en wat je zelf kunt doen.
              </p>
              <Button type="primary" onClick={() => undefined}>
                Bekijk het expertadvies
              </Button>
            </div>
            <FotoPlaceholder
              className="min-h-[260px] min-[900px]:order-2 min-[900px]:min-h-[380px]"
              beschrijving="een deskundige die samen met een bewoner naar een elektrische installatie of apparaat kijkt"
            />
          </div>
        </Sectie>

        {/* 11. Service voor bestaande klanten — vier taakgerichte tegels. */}
        <Sectie>
          <Kop>Al verzekerd bij a.s.r.?</Kop>
          <ul className="grid gap-4 min-[600px]:grid-cols-2">
            {[
              { titel: "Schade melden", icoon: "warning" },
              { titel: "Verzekering wijzigen", icoon: "edit" },
              { titel: "Inloggen op je a.s.r. account", icoon: "user" },
              { titel: "Contact opnemen", icoon: "phone" },
            ].map((taak) => (
              <li key={taak.titel} className="flex">
                <Tile
                  icon={<Icon name={taak.icoon} size="md" />}
                  title={taak.titel}
                  className="flex w-full items-center gap-4 rounded-md bg-white px-6 py-5 text-left shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] hover:bg-[#fafafa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                />
              </li>
            ))}
          </ul>
        </Sectie>

        {/* 12. FAQ — werkende accordion met vijf vragen. */}
        <Sectie>
          <Kop>Veelgestelde vragen</Kop>
          <div className="max-w-[880px]">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </Sectie>

        {/* 13. Afsluitende CTA — opvallend vlak in a.s.r.-geel. */}
        <section className={["w-full bg-[#eda50f] py-8 min-[600px]:py-12", SECTIE_PADDING].join(" ")}>
          <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-4">
            <h2 className={H2_KLASSE} style={MEMPHIS}>
              Klaar om je huis goed te verzekeren?
            </h2>
            <p className="max-w-[880px] text-black text-base leading-[1.5] min-[600px]:text-xl" style={AVENIR}>
              Beantwoord enkele vragen over je huishouden en woning en bekijk je mogelijkheden.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button type="primary" onClick={naarFunnel}>
                Bereken je premie
              </Button>
              <Button type="secondary" onClick={() => undefined}>
                Praat met een adviseur
              </Button>
            </div>
          </div>
        </section>

        {/* Compacte disclaimer boven de footer. */}
        <p className={["w-full py-6 text-[#565656] text-sm leading-[1.5]", SECTIE_PADDING].join(" ")} style={AVENIR}>
          <span className="mx-auto block max-w-[1200px]">
            Aan deze pagina kunnen geen rechten worden ontleend. Of schade gedekt is, hangt af van de oorzaak, de verzekering die je hebt gekozen, je persoonlijke situatie en de polisvoorwaarden.
          </span>
        </p>
      </main>

      <Footer columns={FOOTER_COLUMNS} showAppBadges centered linkSection />
    </div>
  );
}
