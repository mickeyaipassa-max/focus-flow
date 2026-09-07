"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { CardDetails } from "@/components/CardDetails";
import { Tile } from "@/components/Tile";

/**
 * "Klantdetail + uitleg" (Figma node 8233:24257, bestand "Mutatie funnels").
 * Geen funnelstap in de gebruikelijke zin — geen Step Indicator, sidebar of
 * vorige/volgende-navigatie — maar een losstaande polisdetailpagina voor een
 * bestaande "Opstal verzekering", van waaruit de klant via losse "Wijzig"-
 * knoppen de mutatie-funnel ("Dekking wijzigen", `/mutatie`) in kan.
 *
 * Volledig opgebouwd uit bestaande componenten (Button `type="tertiary"` voor
 * "Hulp", CardDetails 4x, Icon, Logo-precedent) plus twee nieuwe: `Tile` (de
 * "Ga snel naar"-rijen) en CardDetails' nieuwe `downloadable`-rijvariant (voor
 * "Documenten voor deze verzekering") en waarde-loze rij (voor "Mijn Schades").
 *
 * Op verzoek gecorrigeerd t.o.v. Figma's letterlijke content:
 * - Hero-pictogram was een auto-icoon (`vast/vast/1004-autoverzekering`,
 *   overduidelijk een kopieerfout uit een sjabloon) — vervangen door het al
 *   bestaande `pictogram-house.svg` (opstal), zelfde asset als de
 *   woonverzekeringen-funnel.
 * - "Bouwjaar"-waarde was `!980` — gecorrigeerd naar `1980`.
 * - Het lege "partners"-icoonslot naast het "wijzer 1"-logo in de footer is
 *   op verzoek weggelaten (geen vervangende inhoud gevonden in Figma).
 * - Het verborgen alternatieve blok "Frame 686" (ander adres, 3 knoppen, een
 *   reviews-widget) stond niet in de zichtbare schermstaat en is op verzoek
 *   niet meegebouwd.
 *
 * De 224px-desktoppadding uit Figma (1448px-canvas) komt overeen met een
 * 1000px-inhoudskolom — hier als `max-w-[1000px] mx-auto` met `px-4`-fallback
 * op smalle schermen, want er is geen apart mobiel Figma-scherm voor dit
 * component gevonden (net als bij de woonverzekeringen-funnel bewust niet
 * verzonnen).
 *
 * Nog niet gekoppeld (geen bijbehorende flow/bestand bevestigd in Figma):
 * "Wijzig" op "De verzekering is voor", alle "Downloaden"-knoppen, en de
 * "Opzeggen"/"Contact met a.s.r."-tegels — knoppen zijn wel zichtbaar,
 * conform Figma, maar zonder eigen bestemming (`onClick` bewust leeg).
 *
 * Op verzoek: "Wijzig" op "Basis dekking" en "Eigen risico" gaat naar de
 * eerste stap van de mutatie-funnel "Dekking wijzigen" (`/mutatie`) — dat
 * scherm regelt precies deze twee velden (RadioGroup voor eigen risico,
 * dekkingskeuze). "De verzekering is voor" heeft geen overeenkomstige flow
 * in Figma en blijft daarom bewust ongekoppeld.
 */
export default function KlantdetailUitlegPage() {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-start gap-10 bg-[#fff8e3]">
      <div className="flex h-[72px] w-full items-center justify-end bg-white px-4 py-[26px]">
        <Button type="tertiary" iconPrepend="comment">
          Hulp
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center gap-8 px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="flex size-32 items-center justify-center rounded-full border-[3px] border-[#46c2e6] bg-[#f6f6f7]">
              <img src="/icons/pictogram-house.svg" alt="" className="size-16" />
            </div>
            <img src="/header/ikz-sticker-arrow-up.svg" alt="Ik kies zelf" className="h-[37px] w-[124px]" />
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-[40px] text-black leading-[1.2]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
              Opstal verzekering
            </p>
            <p
              className="text-base text-black leading-[28px] tracking-[0.18px]"
              style={{ fontFamily: "var(--font-avenir-medium)" }}
            >
              Archimedeslaan 10, Polisnr. 56765965
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 rounded-md bg-white p-10 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.12)]">
          <CardDetails
            title="De basis"
            cardActionEdit={false}
            rows={[
              { label: "Polisnummer", value: "7586645060" },
              { label: "Basis dekking", value: "€ 104,75 per maand", editable: true, onEdit: () => router.push("/mutatie") },
              { label: "Eigen risico", value: "€ 100", editable: true, onEdit: () => router.push("/mutatie") },
              { label: "De verzekering is voor", value: "Archimedeslaan 10, 3584 BA, Utrecht", editable: true },
            ]}
          />
          <CardDetails
            title="Documenten voor deze verzekering"
            cardActionEdit={false}
            rows={[
              { label: "Schademeldformulier", downloadable: true },
              { label: "Je polisblad", downloadable: true },
              { label: "Opstal voorwaarden", downloadable: true },
              { label: "Algemene voorwaarden", downloadable: true },
            ]}
          />
          <CardDetails
            title="Premie"
            cardActionEdit={false}
            rows={[
              { label: "Premie (inclusief 21% assurantiebelasting)", value: "€ 4,82" },
              { label: "Betaaltermijn", value: "Per maand" },
            ]}
          />
          <CardDetails
            title="Details"
            cardActionEdit={false}
            rows={[
              { label: "Oppervlakte", value: "120 m²" },
              { label: "Bouwjaar", value: "1980" },
              { label: "Soort woning", value: "Koopwoning" },
              { label: "Gebruik woning", value: "Particulier" },
              { label: "Ingangsdatum verzekering", value: "05-09-2025" },
            ]}
          />
          <CardDetails title="Mijn Schades" cardActionEdit={false} rows={[{ label: "Geen lopende schades" }]} />
        </div>

        <div className="flex w-full flex-col items-start gap-4">
          <p className="w-full font-bold text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            Ga snel naar
          </p>
          <div className="flex w-full flex-col gap-2">
            <Tile icon={<img src="/icons/pictogram-opzeggen.svg" alt="" className="size-8" />} title="Opzeggen" />
            <Tile icon={<Icon name="chat" size="lg" />} title="Contact met a.s.r." />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center bg-white">
        <div className="flex w-full max-w-[1200px] flex-col gap-4 px-4 py-8">
          <div className="flex w-full items-center justify-end">
            <img src="/footer/wijzer-1.svg" alt="Wijzer in geldzaken" className="size-11" />
          </div>
          <div className="h-px w-full bg-[#f6f6f7]" />
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-start gap-6 text-[#2a292e] text-xs leading-[17px]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
              <p>disclaimer</p>
              <p>privacyverklaring</p>
              <p>cookies</p>
              <p>fraudebeleid</p>
              <p>beleggingsbeleid</p>
              <p>meldpunt digitale kwetsbaarheden</p>
            </div>
            <p className="text-[#9d9d9d] text-xs leading-[16px]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
              © a.s.r.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
