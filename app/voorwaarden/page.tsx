"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ResultSkeleton } from "@/components/ResultSkeleton";
import { smoothScrollToElement } from "@/lib/smoothScroll";
import { InputSearch } from "@/components/InputSearch";
import { LinkList } from "@/components/LinkList";
import { FileList } from "@/components/FileList";
import { Icon } from "@/components/Icon";
import { CardContact } from "@/components/CardContact";
import { Footer, type FooterColumn } from "@/components/Footer";
import {
  ACTUELE_POLISVOORWAARDEN_DOCS,
  VERZEKERINGSKAARTEN_DOCS,
  actueleDocumentVoorModel,
  documentUrl,
  isBekendModel,
  wijzigingenVoorModel,
} from "./documenten";

/** Actuele polisvoorwaarden en verzekeringskaarten: echte links van de live pagina, zie `documenten.ts`. */
const ACTUELE_POLISVOORWAARDEN = ACTUELE_POLISVOORWAARDEN_DOCS.map((doc) => ({ label: doc.label, href: documentUrl(doc.href) }));
const VERZEKERINGSKAARTEN = VERZEKERINGSKAARTEN_DOCS;

/** Foutteksten van het zoekveld. Figma tekent geen foutstaat; de onbekend-melding geeft een vervolgstap (actuele lijst of bellen). */
const FOUT_LEEG = "Vul het modelnummer van je polisblad in.";
const FOUT_ONBEKEND =
  "We hebben geen voorwaarden gevonden voor dit modelnummer. Controleer het nummer op je polisblad. Kom je er niet uit? Bekijk hieronder de actuele polisvoorwaarden of bel (030) 278 03 35.";

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
  const [zoek, setZoek] = useState("");
  const [fout, setFout] = useState<string | undefined>();
  const [result, setResult] = useState<{ modelnummer: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultaatKop = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    return () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
    };
  }, []);

  // Zodra de laadstaat (skeleton) in de pagina staat: meteen eased naar het resultaat scrollen.
  useEffect(() => {
    if (!loading) return;
    const target = document.getElementById("resultaat");
    if (target) smoothScrollToElement(target);
  }, [loading]);

  // Zodra het resultaat er staat: focus naar de kop, zodat toetsenbord- en screenreadergebruikers weten dat het er is.
  useEffect(() => {
    if (result) resultaatKop.current?.focus({ preventScroll: true });
  }, [result]);

  /** Een nieuwe zoekopdracht begint: het oude resultaat (en een lopende zoekopdracht) mag niet blijven staan naast een veranderde invoer. */
  function wisResultaat() {
    if (loadTimer.current) clearTimeout(loadTimer.current);
    setLoading(false);
    setResult(null);
  }

  /**
   * Na "Zoeken" (of Enter): controleer het modelnummer, scroll meteen naar het resultaat, toon 1 seconde een
   * skeleton en dan pas het resultaat. De wachttijd is puur UX (er is geen echte achterliggende aanvraag).
   */
  function handleSubmit(waarde: string) {
    const modelnummer = waarde.trim();
    if (loading) return;
    if (!modelnummer) {
      setFout(FOUT_LEEG);
      return;
    }
    if (!isBekendModel(modelnummer)) {
      setFout(FOUT_ONBEKEND);
      setResult(null);
      return;
    }
    setFout(undefined);
    setResult(null);
    setLoading(true);
    loadTimer.current = setTimeout(() => {
      setResult({ modelnummer });
      setLoading(false);
    }, 1000);
  }

  const { naarDitModel, vanDitModel } = result ? wijzigingenVoorModel(result.modelnummer) : { naarDitModel: [], vanDitModel: [] };
  const pdfHref = result ? actueleDocumentVoorModel(result.modelnummer) : null;
  const beideRichtingen = naarDitModel.length > 0 && vanDitModel.length > 0;
  const wijzigingenUitleg = beideRichtingen
    ? "Bekijk wat er is veranderd tussen dit model en de oudere en nieuwere modellen."
    : naarDitModel.length > 0
      ? `Had je polis eerder een ouder model? Hier zie je per oud model wat er is veranderd naar model ${result?.modelnummer}.`
      : "Bekijk wat er is veranderd ten opzichte van de nieuwere voorwaarden.";

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
              Vind de polisvoorwaarden van je{" "}
              <span className="min-[900px]:whitespace-nowrap">arbeids&shy;ongeschikt&shy;heids&shy;verzekering</span>
            </h1>
            <p className="max-w-[880px] text-black text-base leading-[1.4] min-[600px]:text-xl" style={{ fontFamily: "var(--font-avenir-book)" }}>
              Wil je precies weten hoe het ook alweer zat met jouw AOV? Op deze pagina vind je een overzicht van de polisvoorwaarden voor onze AOV&apos;s voor ondernemers.
            </p>
          </div>
        </section>

        {/* Voorwaarden vinden — zoekveld met knop (Figma "Hero – voorwaarden zoeken"); het resultaat staat in hetzelfde crème vlak. */}
        <section id="voorwaarden-vinden" className="w-full scroll-mt-6 bg-[#fff8e3] px-6 py-6 min-[600px]:px-12 min-[600px]:py-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex max-w-[880px] flex-col gap-4 min-[600px]:gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                  Zoek je polisvoorwaarden
                </h2>
                <p className="max-w-[880px] text-black text-base leading-[1.4] min-[600px]:text-xl" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  Vul het modelnummer van je polisblad in. Dan zie je de voorwaarden en wat er is veranderd.
                </p>
              </div>

              <InputSearch
                labelText="Welk modelnummer staat op je polisblad?"
                submitButton
                id="modelnummer"
                value={zoek}
                loading={loading}
                error={fout}
                onChange={(waarde) => {
                  setZoek(waarde);
                  setFout(undefined);
                  wisResultaat();
                }}
                onSubmit={handleSubmit}
                beforeField={
                  <a href="#" className="text-[#0064a8] text-base underline" style={{ fontFamily: "var(--font-avenir-book)" }}>
                    Bekijk een voorbeeld van een polisblad
                  </a>
                }
              />

              {/* Resultaat: Figma "Result card" (880px breed, padding 40): titel, bestandskaart en de wijzigingen. */}
              {(loading || result) && (
                <div id="resultaat" className="w-full scroll-mt-6" aria-busy={loading}>
                  {/* Voor screenreaders: alleen het laden wordt aangekondigd; bij het resultaat gaat de focus naar de kop. */}
                  <p role="status" className="sr-only">
                    {loading ? "Resultaten worden geladen." : ""}
                  </p>
                  {loading || !result ? (
                    <ResultSkeleton />
                  ) : (
                    <section aria-labelledby="resultaat-kop" className="flex w-full flex-col gap-12 rounded-md bg-white p-6 shadow-[0px_4px_8px_rgba(0,0,0,0.12)] min-[600px]:p-10">
                      <div className="flex flex-col items-start gap-1">
                        <h2
                          id="resultaat-kop"
                          ref={resultaatKop}
                          tabIndex={-1}
                          className="text-black text-[20px] leading-[1.3] outline-none min-[600px]:text-[24px]"
                          style={{ fontFamily: "var(--font-memphis-medium)" }}
                        >
                          {naarDitModel.length + vanDitModel.length > 0 ? "Polisvoorwaarden en wijzigingen" : "Polisvoorwaarden"} voor model {result.modelnummer}
                        </h2>
                      </div>
                      {pdfHref ? (
                        <FileList items={[{ title: `Polisvoorwaarden model ${result.modelnummer}`, href: pdfHref }]} />
                      ) : (
                        // Alleen voor de actuele modellen bestaat een PDF; voor oudere modellen zeggen we dat eerlijk i.p.v. een dode downloadkaart.
                        <p
                          className="w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-[#fafafa] p-4 text-black text-base leading-[1.5]"
                          style={{ fontFamily: "var(--font-avenir-book)" }}
                        >
                          Voor model {result.modelnummer} hebben we geen losse polisvoorwaarden online.{" "}
                          {naarDitModel.length + vanDitModel.length > 0 ? "Bel (030) 278 03 35 of bekijk hieronder wat er is veranderd." : "Bel (030) 278 03 35 voor meer informatie."}
                        </p>
                      )}
                      {(naarDitModel.length > 0 || vanDitModel.length > 0) && (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <h3 className="text-black text-lg leading-[1.4] min-[600px]:text-[20px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
                              Wat is er veranderd?
                            </h3>
                            <p className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                              {wijzigingenUitleg}
                            </p>
                          </div>
                          {[
                            { kop: "Van oudere modellen naar dit model", items: naarDitModel },
                            { kop: "Van dit model naar nieuwere modellen", items: vanDitModel },
                          ]
                            .filter((groep) => groep.items.length > 0)
                            .map((groep) => (
                              <div key={groep.kop} className="flex flex-col gap-1">
                                {beideRichtingen && (
                                  <p className="font-bold text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                                    {groep.kop}
                                  </p>
                                )}
                                {groep.items.map((wijziging) => (
                                  <a
                                    key={wijziging.label + wijziging.href}
                                    href={wijziging.href}
                                    {...(wijziging.href === "#" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                                    className="flex items-center gap-2 py-1"
                                  >
                                    <Icon name="chevron-right" size="sm" />
                                    <span className="text-[#0064a8] text-base leading-[1.5] hover:underline" style={{ fontFamily: "var(--font-avenir-book)" }}>
                                      {wijziging.label}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            ))}
                        </div>
                      )}
                    </section>
                  )}
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
