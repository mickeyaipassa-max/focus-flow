import type { Metadata } from "next";
import { Accordion, type AccordionItem } from "@/components/Accordion";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CardContact } from "@/components/CardContact";
import { CardGraphic } from "@/components/CardGraphic";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { TileMenu, type TileMenuItem } from "@/components/TileMenu";
import { ROUTES } from "./routes";
import { FOOTER_COLUMNS } from "./footer-kolommen";

export const metadata: Metadata = { title: "Bewindvoering bij a.s.r." };

/*
 * Service hub voor bewindvoerders, naar Figma "Service hub page master template [DESKTOP]" (Bewindvoerdersformulier,
 * node 14150:28464): SiteHeader, kruimelpad, hero, "Wat wil je regelen?" met de Tile Menu (twee kolommen), de crème band
 * "Veel voorkomende situaties", "Veelgestelde vragen", "Liever echt contact?" en de footer.
 * Het aanmeldformulier staat sinds deze pagina op /bewindsvoerder/bewindvoerder (stap 1).
 * Waar Figma nog placeholdertekst heeft ("Button", "Description", "Availability", "Description bottom", kruimelnamen)
 * staat die hier letterlijk zo.
 */

const SECTIE_PADDING = "px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32";
const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;
// pb-2: de Figma-".Heading" is 42px tekst + 8px onderpadding (50px hoog).
const H2_KLASSE = "pb-2 text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]";

const MENU_ITEMS: TileMenuItem[] = [
  {
    label: "Aanmelden als bewindvoerder",
    pictogram: "/bewindsvoerder/pictogram-persoon-man.svg",
    children: [
      { label: "Aanmelden voor een zorgverzekering", href: ROUTES.bewindvoerder },
      { label: "Aanmelden voor een andere verzekering", href: ROUTES.bewindvoerder },
    ],
  },
  { label: "Betalingsregeling aanvragen", pictogram: "/bewindsvoerder/pictogram-muntgeld-euro.svg", href: "#", toonChevron: true },
  { label: "Betalingensachterstand opvragen", pictogram: "/bewindsvoerder/pictogram-geld-en-mensen.svg", href: "#", toonChevron: true },
  { label: "Polis opvragen", pictogram: "/bewindsvoerder/pictogram-polisblad.svg", href: "#", toonChevron: true },
  { label: "Bewindvoering beëindigen", pictogram: "/bewindsvoerder/pictogram-hand-zwaaien.svg", href: "#", toonChevron: true },
  { label: "Situatie van het eigen risico opvragen", pictogram: "/bewindsvoerder/pictogram-euroteken.svg", href: "#", toonChevron: true },
];

const SITUATIES = [
  { pictogram: "/bewindsvoerder/pictogram-muntgeld-euro.svg", title: "Mijn cliënt heeft een betalingsachterstand", description: "Ik herken een rekening van mijn cliënt niet" },
  { pictogram: "/bewindsvoerder/pictogram-hand-schudden.svg", title: "Ik neem de bewindvoering van een cliënt over", description: "Description" },
  { pictogram: "/bewindsvoerder/pictogram-bel.svg", title: "Ik herken een rekening van mijn cliënt niet", description: "Ik herken een rekening van mijn cliënt niet" },
  { pictogram: "/bewindsvoerder/pictogram-hand-stop.svg", title: "De bewindvoering van mijn cliënt stopt", description: "Description" },
];

// Figma toont alleen de dichte staat; de antwoorden zijn niet ontworpen, dus klapt een item niet open.
const VRAGEN: AccordionItem[] = [
  { title: "Welke documenten heb ik nodig om me aan te melden?" },
  { title: "Hoe weet ik of mijn aanmelding is verwerkt?" },
  { title: "Kan ik meerdere cliënten aanmelden?" },
  { title: "Hoe geef ik door dat de bewindvoering is beëindigd?" },
];

export default function BewindvoeringHubPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <SiteHeader />
      <Breadcrumb items={[{ label: "Home" }, { label: "Service & contact" }, { label: "Bewindvoerders" }]} />

      <main className="flex w-full flex-col items-start gap-6 pb-6 min-[600px]:gap-12 min-[600px]:pb-12">
        {/* Hero: pictogram + H1 + inleiding, zonder knop (Figma "Hero", layout met alleen titel en tekst). */}
        <section className={`w-full ${SECTIE_PADDING}`}>
          <div className="mx-auto flex max-w-[1200px] flex-col gap-2 pt-6 min-[600px]:py-10">
            <div className="flex items-start gap-4">
              <img src="/bewindsvoerder/pictogram-personen-vrouw-en-man.svg" alt="" width={48} height={48} className="size-12 shrink-0" />
              <h1 className="pt-1 text-black text-[32px] leading-[1.2] min-[600px]:text-[40px]" style={MEMPHIS}>
                Bewindvoering bij a.s.r.
              </h1>
            </div>
            <p className="max-w-[880px] text-black text-base leading-[1.4] min-[600px]:text-xl" style={AVENIR}>
              Regel je als bewindvoerder de financiële zaken van iemand met een verzekering bij a.s.r.? Dan helpen we je graag. Op deze pagina lees je hoe je je aanmeldt als bewindvoerder en wat je voor jouw cliënt kunt regelen.
            </p>
          </div>
        </section>

        <section className={`w-full ${SECTIE_PADDING}`}>
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
            <h2 className={H2_KLASSE} style={MEMPHIS}>
              Wat wil je regelen?
            </h2>
            <TileMenu label="Wat wil je regelen?" items={MENU_ITEMS} kolommen={2}className="w-full" />
          </div>
        </section>

        {/* Crème band: Figma geeft deze sectie een eigen breedte van 1200px (marge 120px) in plaats van het paginaraster (128px). */}
        <section className="w-full bg-[#fff8e3] px-6 py-6 min-[600px]:px-12 min-[600px]:py-12 min-[900px]:px-16 min-[1200px]:px-[120px]">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
            <h2 className={H2_KLASSE} style={MEMPHIS}>
              Veel voorkomende situaties
            </h2>
            <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
              {SITUATIES.map((situatie) => (
                <CardGraphic key={situatie.title} pictogram={situatie.pictogram} title={situatie.title} description={situatie.description} actionLabel="Button" />
              ))}
            </div>
          </div>
        </section>

        <section className={`w-full ${SECTIE_PADDING}`}>
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
            <h2 className={H2_KLASSE} style={MEMPHIS}>
              Veelgestelde vragen
            </h2>
            <Accordion items={VRAGEN} className="flex w-full flex-col gap-1" />
          </div>
        </section>

        <section className={`w-full ${SECTIE_PADDING}`}>
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
            <h2 className={H2_KLASSE} style={MEMPHIS}>
              Liever echt contact?
            </h2>
            <div className="grid w-full grid-cols-1 gap-4 min-[600px]:grid-cols-2 min-[1200px]:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <CardContact
                  key={i}
                  title="Telefoon"
                  availability="Availability"
                  actionIcon="phone"
                  actionLabel="(0800) 00 00 000"
                  footerText="Description bottom"
                  footerInSection
                  className="flex w-full flex-col items-start gap-8 self-start rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-[23px]"
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer columns={FOOTER_COLUMNS} showAppBadges centered linkSection />
    </div>
  );
}
