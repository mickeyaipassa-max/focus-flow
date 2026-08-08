"use client";

import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { List } from "@/components/List";
import { Alert } from "@/components/Alert";
import { CardContact, CardContactCollage } from "@/components/CardContact";

const VERZUIM_STEPS = ["Jouw bedrijf", "Jouw dekking", "Aanvullende gegevens", "Laatste vragen", "Samenvatting"];

/**
 * Stap 1 van de Verzuim-funnel ("Intro" — Figma node 10938:29278).
 * Pixel-perfect nagebouwd met uitsluitend bestaande en licht-uitgebreide
 * designsysteemcomponenten; zie het eindrapport voor de volledige
 * Figma-naar-component mapping. Vervolgstappen (Jouw bedrijf, Jouw dekking,
 * ...) zijn bewust niet meegebouwd — die volgen apart.
 */
export default function VerzuimStap1Page() {
  const router = useRouter();

  return (
    <FunnelPageTemplate
      headerTitle="Verzuimverzekering"
      chatButton={false}
      steps={VERZUIM_STEPS}
      activeStep={0}
      sidebar={
        // Titel + lijst horen als één blok bij elkaar met 16px ertussen
        // (Figma: 16px tussen "Funnel box title" en de content) — FunnelBox's
        // eigen `gap-10` (40px) is bedoeld om zulke blokken van elkáár te
        // scheiden, niet om de titel van zijn eigen content te scheiden.
        <div className="flex w-full flex-col items-start gap-4">
          <h2 className="w-full text-black text-2xl leading-[1.3]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            Waarom onze verzekering
          </h2>
          <List
            icon="check"
            items={[
              { text: "Hulp bij verkorten van verzuim" },
              { text: "Eerste 2 jaar verzuim verzekerd" },
              { text: "Wij zorgen voor een goede aanpak bij elke ziekmelding" },
            ]}
          />
        </div>
      }
      navigation={
        <FormNavigation nextLabel="Start met premie berekenen" onNext={() => router.push("/verzuim/jouw-bedrijf")} />
      }
    >
      <FunnelSection intro title="Bereken je premie en sluit direct je verzuimverzekering af" />

      <div className="flex w-full flex-col items-start gap-6">
        <div className="flex w-full flex-col items-start gap-2">
          <h2 className="w-full font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            Welke gegevens heb je nodig om de premie te berekenen?
          </h2>
          <List
            icon="bullet"
            items={[
              { label: "Voor je bedrijf:", text: "verzuimpercentages van de afgelopen 3 jaar." },
              { label: "Per medewerker:", text: "geboortedatum, loon (voor werknemersverzekeringen), type dienstverband" },
            ]}
          />
        </div>

        <div className="flex w-full flex-col items-start gap-10">
          <Alert
            type="neutral"
            showTitle={false}
            description="Je kunt de gegevens opvragen bij je salarisadministratie of arbodienst."
            closable={false}
          />

          <div className="flex w-full flex-col items-start gap-4">
            <h2 className="w-full font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
              Hulp nodig?
            </h2>
            <CardContactCollage>
              <CardContact
                title="Telefoon"
                availability="Mogelijk moet je even wachten"
                actionIcon="phone"
                actionLabel="(0800) 00 00 000"
                footerText="Werkdagen 08.30 – 17.30 uur"
              />
              <CardContact
                title="Contactformulier"
                availability="Binnen 10 werkdagen antwoord"
                actionIcon="edit"
                actionLabel="Contactformulier invullen"
              />
            </CardContactCollage>
          </div>
        </div>
      </div>
    </FunnelPageTemplate>
  );
}
