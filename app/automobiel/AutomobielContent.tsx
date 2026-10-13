"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Accordion } from "@/components/Accordion";
import { Footer, type FooterColumn } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { DekkingCarousel } from "./DekkingCarousel";
import { KentekenVeld } from "./KentekenVeld";
import { OpinessBadge } from "./OpinessBadge";
import { STICKY_BAR_HEIGHT, StickyKentekenBar } from "./StickyKentekenBar";

/**
 * Mobiele autoverzekering-pagina (<600px), gebouwd uit Figma "Autoverzekering"
 * (Frame 3, node 8949:2465, 393px breed). Teksten staan er letterlijk in, ook
 * de plaatshouders uit het ontwerp ("Accordion title", "Button", "…blabla"):
 * die zijn niet aangevuld of verbeterd.
 *
 * Bewust niet overgenomen: de zwarte balk van 64px bovenaan het Figma-frame
 * (Rectangle 698) — dat is de statusbalk van de telefoon-mockup, geen
 * paginainhoud.
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

const PLACEHOLDER_FAQ = Array.from({ length: 7 }, (_, i) => ({ title: "Accordion title", id: i }));

/** Het ruitjespatroon waarmee Figma een lege afbeelding toont. */
const CHECKER =
  "bg-[#fafafa] [background-image:conic-gradient(#ececec_25%,transparent_0_50%,#ececec_0_75%,transparent_0)] [background-size:40px_40px]";

function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={className ?? "text-2xl text-black leading-[1.3]"} style={{ fontFamily: FONT_MEMPHIS }}>
      {children}
    </h2>
  );
}

function Body({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={className ?? "text-black text-sm leading-[1.5]"} style={{ fontFamily: FONT_BOOK }}>
      {children}
    </p>
  );
}

function BlackButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-[3px] bg-black px-6 py-3 font-[550] text-base text-white leading-[1.5] hover:bg-[#292929]"
      style={{ fontFamily: FONT_MEDIUM }}
    >
      {children}
    </button>
  );
}

/** Een witte kaart met 1px rand (zwart 12%) en radius 6, zoals de "Card" in Figma. */
function OutlineCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={["rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-[23px]", className].filter(Boolean).join(" ")}>{children}</div>
  );
}

const SNELKOPPELINGEN = [
  { label: "Inloggen", icon: "upload" },
  { label: "Schademelden", icon: "search" },
  { label: "Klantenservice", icon: "injury" },
  { label: "Groene kaart", icon: "user" },
];

const AANVULLENDE_DEKKINGEN = [
  {
    title: "Pechhulp",
    text: "De a.s.r. Alarmcentrale staat 24/7 voor je klaar als je niet verder kan rijden door pech.",
  },
  {
    title: "Schade inzittenden",
    text: "Passagiers en bestuurder verzekerd voor letsel en schade aan hun spullen na een ongeval.",
  },
  {
    title: "Rechtsbijstand Motorrijtuigen",
    text: "Juridische hulp bij conflicten in het verkeer waarbij je auto is betrokken.",
  },
];

const EXTRA_OPTIES = Array.from({ length: 3 }, () => ({
  title: "Rechtsbijstand Motorrijtuigen",
  text: "Juridische hulp bij conflicten in het verkeer waarbij je auto is betrokken.",
}));

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

export function AutomobielContent() {
  const router = useRouter();
  const [kenteken, setKenteken] = useState("");
  const [stickyZichtbaar, setStickyZichtbaar] = useState(false);
  const voorbijProductkaartenRef = useRef<HTMLDivElement>(null);

  /**
   * De sticky balk verschijnt zodra de productkaarten voorbij zijn gescrold:
   * een onzichtbaar markeerpunt direct onder de gele productsectie is dan
   * boven de bovenrand van het scherm. Terug omhoog scrollen verbergt hem weer.
   *
   * Scroll-listener i.p.v. een IntersectionObserver: die meldt niets als het
   * markeerpunt in één sprong van boven het scherm naar eronder gaat (bv.
   * "terug naar boven"), en dan bleef de balk onterecht staan.
   */
  useEffect(() => {
    const markeerpunt = voorbijProductkaartenRef.current;
    if (!markeerpunt) return;
    let frame = 0;
    function bepaal() {
      frame = 0;
      setStickyZichtbaar(markeerpunt!.getBoundingClientRect().top < 0);
    }
    function planBepaling() {
      if (!frame) frame = requestAnimationFrame(bepaal);
    }
    bepaal();
    window.addEventListener("scroll", planBepaling, { passive: true });
    window.addEventListener("resize", planBepaling);
    return () => {
      window.removeEventListener("scroll", planBepaling);
      window.removeEventListener("resize", planBepaling);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /** Naar de funnel; een ingevuld kenteken gaat mee, `/auto` zoekt het zelf op. */
  function naarFunnel() {
    const schoon = kenteken.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    router.push(schoon ? `/auto?kenteken=${encodeURIComponent(schoon)}` : "/auto");
  }

  function handleKentekenSubmit(event: FormEvent) {
    event.preventDefault();
    naarFunnel();
  }

  return (
    <div className="w-full bg-white">
      <SiteHeader />

      {/* Figma: "Breadcrumb item" is de plaatshouder voor de vorige pagina. */}
      <Breadcrumb
        items={[{ label: "Breadcrumb item", onClick: () => router.push("/") }, { label: "Autoverzekering" }]}
        className="w-full px-6 pt-6 pb-6"
      />

      <main>
        {/* Hero: foto, witte kaart met rating/kenteken/CTA en de snelkoppelingen. */}
        <section aria-labelledby="hero-titel" className="relative bg-white">
          <img src="/automobiel/hero.png" alt="" className="block aspect-[900/300] w-full object-cover" />

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
                    Autoverzekering
                  </h1>
                  <Body className="text-base text-black leading-[1.5]">Met een autoverzekering van a.s.r. ga je met een gerust gevoel de weg op.</Body>
                </div>

                <form onSubmit={handleKentekenSubmit} className="flex flex-col gap-4">
                  <KentekenVeld id="kenteken" value={kenteken} onChange={setKenteken} />

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center h-[51px] rounded-[3px] border-[rgba(0,0,0,0.08)] border-b-2 bg-[#eda50f] px-6 font-[550] text-base text-black leading-[1.5] hover:bg-[#f0b335]"
                    style={{ fontFamily: FONT_MEDIUM }}
                  >
                    Bereken je premie
                  </button>
                </form>
              </div>

              <ul className="-mt-[3px] flex flex-col gap-2">
                {["3 jaar nieuw- of aankoopwaarde vergoed", "No-claimkorting tot 75%", "Snelle hulp en betrouwbare service"].map((tekst) => (
                  <li key={tekst} className="flex items-start gap-2">
                    <span className="flex items-start pt-0.5">
                      <Icon name="check" size="sm" />
                    </span>
                    <Body className="min-w-0 flex-1 text-black text-sm leading-[1.5]">{tekst}</Body>
                  </li>
                ))}
              </ul>
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

        {/* Welke autoverzekering heb ik nodig? — gele band met de drie dekkingskaarten. */}
        <section aria-labelledby="dekking-titel" className="mt-[37px] flex flex-col gap-4 bg-[#fff8e3] pt-10 pb-9">
          <div className="flex flex-col px-6">
            <SectionTitle>
              <span id="dekking-titel">
                Welke autoverzekering
                <br />
                heb ik nodig?
              </span>
            </SectionTitle>
            <Body className="max-w-[328px] text-base text-black leading-[1.5]">
              Als je een auto hebt, is een WA-verzekering verplicht. Hiermee is schade aan anderen verzekerd die je met je auto veroorzaakt. Wil je dat
              schade aan je eigen auto ook verzekerd is? Kies dan voor Casco beperkt of Casco allrisk.
            </Body>
          </div>
          <DekkingCarousel onBerekenen={naarFunnel} />
        </section>
        <div ref={voorbijProductkaartenRef} aria-hidden="true" className="h-px" />

        {/* Opiness-badge op een lichtgroene band (Figma: #eef4e3, 237px hoog). */}
        <section className="bg-[#eef4e3] px-6 pt-6 pb-[23px]">
          <div className="flex flex-col items-center">
            <div className="p-2.5">
              <OpinessBadge />
            </div>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl text-black leading-[1.3]" style={{ fontFamily: FONT_MEMPHIS }}>
                Als beste beoordeeld in 2026
              </h2>
              <Body>Klanten hebben ons….. blabla</Body>
            </div>
          </div>
        </section>

        {/* Aanvullende dekkingen en extra opties. */}
        <section className="flex flex-col bg-white px-[30px] pt-[41px] pb-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <SectionTitle>
                Aanvullende dekkingen
                <br />
                &amp; Extra opties
              </SectionTitle>
              <Body className="text-base text-black leading-[1.5]">
                Wil je meer zekerheid? Breid dan je autoverzekering uit met aanvullende dekkingen en opties.
              </Body>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-[20px] text-black leading-[1.3]" style={{ fontFamily: FONT_MEMPHIS }}>
                  Aanvullende dekkingen
                </h3>
                {AANVULLENDE_DEKKINGEN.map((dekking) => (
                  <OutlineCard key={dekking.title} className="flex flex-col gap-4">
                    {(
                      <span className="flex size-14 items-center justify-center rounded-full bg-[#fff8e3]" aria-hidden="true">
                        {/* Figma toont hier een plaatshouder-afbeeldingsicoon. */}
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="9" cy="9" r="1.6" />
                          <path d="M21 16l-5-5-8 8" />
                        </svg>
                      </span>
                    )}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[20px] text-black leading-[1.4]" style={{ fontFamily: FONT_MEMPHIS }}>
                        {dekking.title}
                      </h4>
                      <Body className="text-base text-black leading-[1.5]">{dekking.text}</Body>
                    </div>
                    <button type="button" className="flex items-center gap-1 self-start font-[550] text-base text-black leading-[1.5]" style={{ fontFamily: FONT_MEDIUM }}>
                      Button
                      <Icon name="chevron-right-sm" size="md" />
                    </button>
                  </OutlineCard>
                ))}
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <h3 className="text-[20px] text-black leading-[1.3]" style={{ fontFamily: FONT_MEMPHIS }}>
                  Extra opties
                </h3>
                {EXTRA_OPTIES.map((optie, index) => (
                  <OutlineCard key={index} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[20px] text-black leading-[1.4]" style={{ fontFamily: FONT_MEMPHIS }}>
                        {optie.title}
                      </h4>
                      <Body className="text-base text-black leading-[1.5]">{optie.text}</Body>
                    </div>
                    <button type="button" className="flex items-center gap-1 self-start font-[550] text-base text-black leading-[1.5]" style={{ fontFamily: FONT_MEDIUM }}>
                      Button
                      <Icon name="chevron-right-sm" size="md" />
                    </button>
                  </OutlineCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Zakelijke autoverzekering. */}
        <section className="bg-[#f6f6f7] px-6 py-10">
          <OutlineCard className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <SectionTitle>Op zoek naar een zakelijke autoverzekering?</SectionTitle>
              <Body className="text-base text-black leading-[1.5]">
                Staat je auto op naam van je bedrijf? Of gebruik je de auto zakelijk? Kies dan voor onze zakelijke autoverzekering.
              </Body>
            </div>
            <div>
              <BlackButton>Bekijk de zakelijke autoverzekering</BlackButton>
            </div>
          </OutlineCard>
        </section>

        {/* Schadevrije jaren en tweede auto korting. */}
        <section className="flex flex-col gap-4 bg-white px-[32px] py-10">
          <div className="flex flex-col">
            <SectionTitle>Schadevrije jaren en tweede auto korting</SectionTitle>
            <Body className="text-base text-black leading-[1.5]">Wil je meer zekerheid? Breid dan je autoverzekering uit met aanvullende dekkingen en opties.</Body>
          </div>
          <div className="flex flex-col gap-4">
            <OutlineCard className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-[20px] text-black leading-[1.4]" style={{ fontFamily: FONT_MEMPHIS }}>
                  Schadevrije jaren
                </h3>
                <Body className="text-base text-black leading-[1.5]">
                  Hoe langer je schadevrij rijdt, hoe meer no-claimkorting je krijgt op je autoverzekering. Tot wel 75%. We leggen je uit hoe je
                  schadevrije jaren en korting opbouwt en wat er gebeurt als je schade veroorzaakt.
                </Body>
              </div>
              <div>
                <BlackButton>Meer over schadevrije jaren</BlackButton>
              </div>
            </OutlineCard>
            <OutlineCard className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-[20px] text-black leading-[1.4]" style={{ fontFamily: FONT_MEMPHIS }}>
                  Tweede auto korting
                </h3>
                <Body className="text-base text-black leading-[1.5]">
                  Verzeker je meerdere auto’s bij Ik kies zelf van a.s.r.? Met de tweede auto kortingsregeling krijg je 10% korting op al je
                  verzekerde auto’s. Dit is een extra korting naast je no-claimkorting.
                </Body>
              </div>
              <div>
                <BlackButton>Meer over deze kortingsregeling</BlackButton>
              </div>
            </OutlineCard>
          </div>
        </section>

        {/* Onafhankelijk advies. */}
        <section className="bg-[#fff8e3] px-6 py-10">
          <div className="flex flex-col rounded-md border border-[rgba(0,0,0,0.12)] bg-white">
            <div className="px-[11px] pt-[11px]">
              <div className={`h-[200px] w-full ${CHECKER}`} role="img" aria-label="Afbeelding volgt" />
            </div>
            <div className="flex flex-col gap-4 px-6 pt-6 pb-[23px]">
              <div className="flex flex-col gap-2">
                <SectionTitle>Liever onafhankelijk advies?</SectionTitle>
                <Body className="text-base text-black leading-[1.5]">
                  Onze autoverzekering Ik kies zelf van a.s.r. sluit je zelf online af. Wil je liever advies? Een onafhankelijk adviseur denkt met je
                  mee en zoekt de autoverzekering die het beste bij jouw situatie past.
                </Body>
              </div>
              <div>
                {/* Knoptekst letterlijk uit Figma — die verwijst naar de zakelijke autoverzekering, niet naar advies. */}
                <BlackButton>Bekijk onze zakelijke autoverzekering</BlackButton>
              </div>
            </div>
          </div>
        </section>

        {/* Veelgestelde vragen. */}
        <section className="flex flex-col gap-4 bg-white px-6 py-10">
          <SectionTitle>Veelgestelde vragen</SectionTitle>
          <Accordion items={PLACEHOLDER_FAQ.map((item) => ({ title: item.title }))} />
        </section>

        {/* Extra informatie en documenten. */}
        <section className="flex flex-col gap-4 bg-[#f6f6f7] px-6 py-10">
          <SectionTitle>Extra informatie en documenten</SectionTitle>
          <Accordion items={PLACEHOLDER_FAQ.slice(0, 3).map((item) => ({ title: item.title }))} />
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

      {/* Ruimte onderaan, zodat de sticky balk de footer niet bedekt. */}
      <div aria-hidden="true" style={{ height: STICKY_BAR_HEIGHT }} />

      <StickyKentekenBar visible={stickyZichtbaar} value={kenteken} onChange={setKenteken} onSubmit={naarFunnel} />
    </div>
  );
}
