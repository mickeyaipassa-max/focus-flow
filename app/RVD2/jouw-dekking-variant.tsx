"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
import { Dialog } from "@/components/Dialog";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { Icon } from "@/components/Icon";
import { RadioCardBottomGroup } from "@/components/RadioCardBottom";
import { RadioGroup } from "@/components/RadioGroup";
import { Select } from "@/components/Select";
import {
  AUTO_STEPS,
  DEKKING_OPTIONS_V2,
  DEKKING_PRIJS_CENTEN,
  DEKKING_TITEL,
  EIGEN_RISICO_SELECT_OPTIONS,
  EIGEN_RISICO_UITLEG,
  EXTRA_DEKKINGEN,
  NIEUWWAARDE_DIALOG_TEKST,
  NIEUWWAARDE_DIALOG_TITEL,
  NIEUWWAARDE_UITLEG,
  type DekkingKeuze,
  type ExtraKeuze,
} from "../RVD/data";
import { DekkingDialog, ExtraDialog, Highlight, PdfLink } from "../RVD/info-dialogs";
import { PremieKassabon } from "../RVD/premie-kassabon";

const JA_NEE = [
  { value: "ja", label: "Ja" },
  { value: "nee", label: "Nee" },
];

const BOOK = { fontFamily: "var(--font-avenir-book)" } as const;
const BOLD = { fontFamily: "var(--font-avenir-bold)" } as const;

/** Figma toont in deze variant 3 aanvullende dekkingen; "Extra's boven € 1000" ontbreekt. */
const EXTRA_OPTIES = EXTRA_DEKKINGEN.filter((extra) => extra.value !== "extras-boven-1000");

/**
 * Variant van "Jouw dekking" (stap 2 van 5) naar Figma "Untitled" (6pTuBCHupEW7rq3Ir4mJow), node 144:30187:
 * één staat met alle vragen direct zichtbaar, kaarten zonder "Diefstal"-regel en met de badge "Meest gekozen",
 * één grijs voorwaardenvak onder de kaarten, het eigen risico als dropdown, drie aanvullende dekkingen en de
 * nieuwwaarderegeling met Ja/Nee. De navigatie heeft "Bewaar voor later" als knop en "Je zit nergens aan vast".
 * Hergebruikt de data, dialogs en de zwevende Receipt Bar van `/RVD`.
 *
 * Niet in dit frame: validaties, jaren-keuze bij de nieuwwaarderegeling, de opties van de dropdown (hier dezelfde
 * bedragen als op /RVD) en de trigger van de nieuwwaarde-dialog (hier het info-icoon achter de vraag, op basis
 * van het losse Figma-frame "Meer over de nieuwwaarderegeling").
 */
export function JouwDekkingVariant() {
  const router = useRouter();

  const [dekking, setDekking] = useState<DekkingKeuze | "">("");
  const [eigenRisico, setEigenRisico] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [nieuwwaarde, setNieuwwaarde] = useState("");

  const [dekkingInfo, setDekkingInfo] = useState<DekkingKeuze | null>(null);
  const [extraInfo, setExtraInfo] = useState<ExtraKeuze | null>(null);
  const [nieuwwaardeInfoOpen, setNieuwwaardeInfoOpen] = useState(false);

  const gekozenExtras = EXTRA_OPTIES.filter((extra) => extras.includes(extra.value));
  const totaalCenten =
    dekking === "" ? null : DEKKING_PRIJS_CENTEN[dekking] + gekozenExtras.reduce((som, extra) => som + extra.centen, 0);

  return (
    <>
      <FunnelPageTemplate
        headerTitle="Autoverzekering"
        ikzSticker
        steps={AUTO_STEPS}
        activeStep={2}
        navigation={
          <div className="flex w-full flex-col items-stretch gap-4 rounded-b-md bg-white px-6 py-4 min-[600px]:flex-row min-[600px]:items-start min-[600px]:justify-between min-[600px]:px-10 min-[600px]:py-6">
            <Button type="tertiary" iconPrepend="arrow-left" onClick={() => router.push("/auto")}>
              Jouw situatie
            </Button>
            <div className="flex flex-col items-stretch gap-4 min-[600px]:flex-row min-[600px]:items-start">
              <Button type="secondary" iconPrepend="mail" onClick={() => {}} fullWidth="mobile">
                Bewaar voor later
              </Button>
              <div className="flex flex-col items-center gap-2">
                {/* "Naar jouw gegevens" (stap 3) bestaat nog niet; zelfde keuze als /RVD: de pagina blijft staan. */}
                <Button type="primary" iconAppend="arrow-right" onClick={() => {}} fullWidth="mobile">
                  Naar jouw gegevens
                </Button>
                <p className="text-center text-black text-xs italic leading-[1.25]" style={BOOK}>
                  Je zit nergens aan vast
                </p>
              </div>
            </div>
          </div>
        }
      >
        <button
          type="button"
          onClick={() => router.push("/auto")}
          className="-mb-4 flex items-center gap-2 rounded-[3px] text-base text-black leading-[1.5]"
          style={{ fontFamily: "var(--font-avenir-medium)" }}
        >
          <Icon name="arrow-left" size="sm" />
          <span className="underline">Jouw situatie</span>
        </button>

        <FunnelSection intro title="Jouw dekking" showRequiredFieldsNote />

        <FunnelSection title="Stel je autoverzekering samen">
          <div className="flex w-full flex-col items-start gap-6">
            <RadioCardBottomGroup
              labelText="Kies je basisdekking"
              options={DEKKING_OPTIONS_V2}
              contentTopClassName="mt-2"
              value={dekking}
              onChange={(waarde) => setDekking(waarde as DekkingKeuze)}
              onMoreInfoClick={(waarde) => setDekkingInfo(waarde as DekkingKeuze)}
            />

            <Highlight>
              <div className="flex w-full flex-col gap-1">
                <p className="font-bold text-black text-lg leading-[1.5]" style={BOLD}>
                  Voorwaarden en dekking
                </p>
                <p className="text-black text-base leading-[1.5]" style={BOOK}>
                  Lees de voorwaarden en ontdek wat verzekerd is, welke uitzonderingen gelden en welke afspraken bij jouw dekking horen.
                </p>
              </div>
              <PdfLink naam="Polisvoorwaarden WA, WA+ en Allrisk" />
            </Highlight>

            <Select
              labelText="Kies je eigen risico"
              description={EIGEN_RISICO_UITLEG}
              options={EIGEN_RISICO_SELECT_OPTIONS}
              value={eigenRisico}
              onChange={setEigenRisico}
              fieldWidth="md"
            />

            <CheckboxCardControlLeftGroup
              labelText="Welke aanvullende dekkingen wil je?"
              className="flex w-full max-w-[680px] flex-col items-start gap-2"
              options={EXTRA_OPTIES}
              values={extras}
              onChange={setExtras}
              onMoreInfoClick={(waarde) => setExtraInfo(waarde as ExtraKeuze)}
            />
          </div>
        </FunnelSection>

        <FunnelSection showDividerAbove title="Nieuwwaarderegeling" description={NIEUWWAARDE_UITLEG}>
          <RadioGroup
            labelText="Wil je gebruik maken van de nieuwwaarderegeling?"
            horizontal
            options={JA_NEE}
            value={nieuwwaarde}
            onChange={setNieuwwaarde}
            labelAction={
              <button
                type="button"
                onClick={() => setNieuwwaardeInfoOpen(true)}
                aria-label="Meer informatie over de nieuwwaarderegeling"
                className="flex size-6 items-center justify-center rounded-[3px]"
              >
                <Icon name="popover-info" size="sm" />
              </button>
            }
          />
        </FunnelSection>
      </FunnelPageTemplate>

      <PremieKassabon
        totaalCenten={totaalCenten}
        dekkingTitel={dekking ? DEKKING_TITEL[dekking] : ""}
        dekkingCenten={dekking ? DEKKING_PRIJS_CENTEN[dekking] : 0}
        eigenRisico={eigenRisico}
        extras={gekozenExtras.map((extra) => ({ titel: extra.title, centen: extra.centen }))}
      />
      <DekkingDialog keuze={dekkingInfo} onClose={() => setDekkingInfo(null)} />
      <ExtraDialog keuze={extraInfo} onClose={() => setExtraInfo(null)} />
      <Dialog open={nieuwwaardeInfoOpen} onClose={() => setNieuwwaardeInfoOpen(false)} title={NIEUWWAARDE_DIALOG_TITEL} size="md">
        <p className="whitespace-pre-line">{NIEUWWAARDE_DIALOG_TEKST}</p>
      </Dialog>
    </>
  );
}
