"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/Dialog";
import { Icon } from "@/components/Icon";
import { Receipt, type ReceiptGroup } from "@/components/Receipt";
import { ReceiptBar } from "@/components/ReceiptBar";
import { PREMIE_UITLEG, PREMIE_UITLEG_TITEL, formatCenten } from "./data";

type PremieKassabonProps = {
  /** Totale maandpremie in eurocenten. `null` zolang er geen basisdekking is gekozen (dan valt er niets te tonen). */
  totaalCenten: number | null;
  dekkingTitel: string;
  dekkingCenten: number;
  eigenRisico: string;
  extras: { titel: string; centen: number }[];
};

/** Hoogte van de Header (Figma "Header Funnel": 93px desktop, ± 117px mobiel) plus ademruimte: zo ver zakt de balk bovenaan de pagina onder de header. */
const BALK_TOP_START = 105;
const BALK_TOP_START_MOBIEL = 125;
const BALK_TOP_GESCROLD = 16;

/**
 * Figma-annotatie bij de "Receipt Bar": "Omdat we een full-width layout gebruiken, passen we de floating
 * Receipt Bar toe (ipv de Receipt Box aan de rechterkant)". Hier dus een zwevende, gecentreerde balk die
 * bovenaan de pagina onder de header begint en bij scrollen op 16px van de bovenrand blijft staan.
 * "Bekijk details" opent de "Receipt Dialog" ("Je verzekering"); "Meer over de opbouw van de premie"
 * opent de popover "Wat bepaalt je premie?".
 */
export function PremieKassabon({ totaalCenten, dekkingTitel, dekkingCenten, eigenRisico, extras }: PremieKassabonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [balkTop, setBalkTop] = useState(BALK_TOP_START);

  useEffect(() => {
    function update() {
      const start = window.innerWidth < 600 ? BALK_TOP_START_MOBIEL : BALK_TOP_START;
      setBalkTop(Math.max(BALK_TOP_GESCROLD, start - window.scrollY));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function sluitDialog() {
    setDialogOpen(false);
    setPopoverOpen(false);
  }

  if (totaalCenten === null) return null;

  const totaal = formatCenten(totaalCenten);
  const groups: ReceiptGroup[] = [
    {
      title: "Dekking",
      items: [{ label: dekkingTitel, amount: formatCenten(dekkingCenten) }, ...(eigenRisico ? [{ label: `Eigen risico € ${eigenRisico}` }] : [])],
    },
  ];
  if (extras.length > 0) {
    groups.push({ title: "Aanvullende dekkingen", items: extras.map((extra) => ({ label: extra.titel, amount: formatCenten(extra.centen) })) });
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4" style={{ top: balkTop }}>
        <div className="pointer-events-auto w-full max-w-[480px]">
          <ReceiptBar
            amount={totaal}
            onShowDetails={() => setDialogOpen(true)}
            className="flex w-full items-center gap-3 rounded-[3px] bg-white p-1 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.32)] min-[600px]:p-2"
          />
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={sluitDialog} title="Je verzekering">
        <div className="relative">
          <Receipt
            type="one-section"
            sections={[
              {
                id: "auto",
                title: "Auto",
                amount: totaal,
                icon: <img src="/icons/pictogram-car.svg" alt="" className="size-8" />,
                groups,
              },
            ]}
            summaryAmount={totaal}
            summaryInfo="Meer over de opbouw van de premie"
            showSummaryInfoButton
            onSummaryInfoClick={() => setPopoverOpen((open) => !open)}
            className="flex w-full flex-col items-start gap-4"
          />

          {popoverOpen && (
            <div
              role="tooltip"
              className="relative mt-[14px] ml-3 flex w-[282px] max-w-[calc(100%-12px)] flex-col items-start rounded-[3px] bg-white p-1 shadow-[0px_8px_12px_rgba(0,0,0,0.16)]"
            >
              <div className="flex w-full items-start gap-2">
                <div className="flex min-w-px flex-1 flex-col items-start py-2 pl-2">
                  <p className="w-full font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                    {PREMIE_UITLEG_TITEL}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPopoverOpen(false)}
                  aria-label="Sluiten"
                  className="flex size-10 shrink-0 items-center justify-center gap-1 rounded-[3px]"
                >
                  <Icon name="close" size="md" />
                </button>
              </div>
              <p className="w-full px-2 pt-1 pb-2 font-[350] text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                {PREMIE_UITLEG}
              </p>
              <img
                src="/icons/popover-arrow.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute top-[-14px] left-[11.86px] size-5 -rotate-135"
              />
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
