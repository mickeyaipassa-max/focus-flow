import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { Tag } from "@/components/Tag";
import { VergoedingenZoeken } from "./zoeken";

export const metadata: Metadata = { title: "Vergoedingen zorgverzekering" };

/*
 * Naar Figma "Vergoedingen overzicht — desktop 1440" (bestand Vergoedingen, node 19:937) en de mobiele tegenhanger
 * (375px, node 20:1279): SiteHeader, kruimelpad, hero, zoekkaart, "Zoek in categorieën", "Zorgverlener zoeken?" en footer.
 * Figma toont alleen deze staat: de categorieën en "Veel gezocht"-links hebben geen bestemming ontworpen en navigeren
 * dus nog nergens heen. Het kruimelpad staat letterlijk in kleine letters, zoals in Figma.
 */

const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;

// Figma geeft de content een marge van 120px op desktop (het paginaraster elders is 128px).
const PADDING = "px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-[120px]";

// Letterlijk uit Figma; Huisarts en Ziekenhuis gebruiken daar hetzelfde pictogram.
const CATEGORIEEN = [
  { label: "Alternatieve zorg", pictogram: "alternatieve-zorg" },
  { label: "Anticonceptie", pictogram: "anticonceptie" },
  { label: "Buitenland", pictogram: "buitenland" },
  { label: "Fysiotherapie", pictogram: "fysiotherapie" },
  { label: "GGZ", pictogram: "ggz" },
  { label: "Horen en spreken", pictogram: "horen-en-spreken" },
  { label: "Huid", pictogram: "huid" },
  { label: "Huisarts", pictogram: "huisarts" },
  { label: "Hulpmiddelen", pictogram: "hulpmiddelen" },
  { label: "Leefstijl en preventie", pictogram: "leefstijl-en-preventie" },
  { label: "Medicijnen", pictogram: "medicijnen" },
  { label: "Mondzorg", pictogram: "mondzorg" },
  { label: "Ogen", pictogram: "ogen" },
  { label: "Verpleging en verzorging", pictogram: "verpleging-en-verzorging" },
  { label: "Vervoer", pictogram: "vervoer" },
  { label: "Voeten", pictogram: "voeten" },
  { label: "Ziekenhuis", pictogram: "ziekenhuis" },
  { label: "Zwanger en geboorte", pictogram: "zwanger-en-geboorte" },
];

export default function VergoedingenPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <SiteHeader />
      <Breadcrumb
        items={[{ label: "home" }, { label: "zorgverzekering" }, { label: "vergoedingen" }]}
        // Figma: 24px hoog zonder boven- of onderpadding en op desktop 120px marge (het standaard kruimelpad heeft 24px erboven en eronder).
        className="w-full px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-[120px]"
      />

      <main className="flex w-full flex-col items-start">
        <section className={`w-full ${PADDING}`}>
          <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 py-6 min-[600px]:gap-4 min-[600px]:py-10">
            <Tag text="zorg" />
            <h1 className="text-black text-[32px] leading-[1.2] min-[600px]:text-[40px]" style={MEMPHIS}>
              Vergoedingen zorgverzekering
            </h1>
          </div>
        </section>

        <section className={`w-full pb-12 min-[900px]:pb-20 ${PADDING}`}>
          <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8">
            <VergoedingenZoeken />

            <div className="flex w-full flex-col items-start gap-4">
              <h2 className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
                Zoek in categorieën
              </h2>
              <ul className="m-0 grid w-full list-none grid-cols-1 gap-2 p-0 min-[600px]:grid-cols-2 min-[900px]:flex min-[900px]:flex-wrap min-[900px]:gap-4">
                {CATEGORIEEN.map(({ label, pictogram }) => (
                  <li key={label} className="min-[900px]:w-[389px]">
                    <button
                      type="button"
                      className="flex h-16 w-full items-center gap-3 rounded-[3px] border border-[#565656] bg-white px-4 py-3 text-left text-black hover:border-black hover:bg-[rgba(0,0,0,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <img src={`/vergoedingen/pictogram-${pictogram}.svg`} alt="" width={24} height={24} className="size-6 shrink-0" />
                      <span className="flex-1 text-lg leading-[1.5]" style={AVENIR}>
                        {label}
                      </span>
                      <img src="/icons/add.svg" alt="" width={24} height={24} className="size-6 shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full flex-col items-start gap-4 rounded-[3px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <h2 className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
                Zorgverlener zoeken?
              </h2>
              <p className="text-black text-lg leading-[1.5]" style={AVENIR}>
                Vind eenvoudig een gecontracteerde zorgverlener bij jou in de buurt. Zoek op zorgsoort of op naam.
              </p>
              <Button type="secondary" iconPrepend="search" fullWidth="mobile" wrap>
                Naar de Zorgzoeker van a.s.r.
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
