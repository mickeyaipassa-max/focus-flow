import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { Tag } from "@/components/Tag";
import { VergoedingenCategorieen } from "./categorieen";
import { VergoedingenZoeken } from "./zoeken";

export const metadata: Metadata = { title: "Vergoedingen zorgverzekering" };

/*
 * Naar Figma "Vergoedingen overzicht — desktop 1440" (bestand Vergoedingen, node 19:937) en de mobiele tegenhanger
 * (375px, node 20:1279): SiteHeader, kruimelpad, hero, zoekkaart, "Zoek in categorieën", "Zorgverlener zoeken?" en footer.
 * Figma toont alleen de dichte staat. Het opengeklapte categoriepaneel is nagebouwd naar de live pagina (zie categorieen.tsx);
 * de links daarin en de "Veel gezocht"-links hebben geen bestemming en navigeren dus nog nergens heen.
 * Het kruimelpad staat letterlijk in kleine letters, zoals in Figma.
 */

const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;

// Figma geeft de content een marge van 120px op desktop (het paginaraster elders is 128px).
const PADDING = "px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-[120px]";

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
              <VergoedingenCategorieen />
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
