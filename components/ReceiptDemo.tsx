"use client";

import { useState } from "react";
import { Receipt } from "./Receipt";

const PREMIE_OPTIES = ["€ 89,50", "€ 102,00"];

/** Losse client-wrapper voor de verificatieharness — zelfde reden als DialogDemo.tsx. */
export function ReceiptDemo() {
  const [premieIndex, setPremieIndex] = useState(0);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <button
        type="button"
        onClick={() => setPremieIndex((current) => (current + 1) % PREMIE_OPTIES.length)}
        className="rounded-[3px] border border-[#565656] px-4 py-2 font-[550] text-base"
        style={{ fontFamily: "var(--font-avenir-medium)" }}
      >
        Simuleer premiewijziging (toont 1 sec de spinner)
      </button>
      <Receipt
        title="Verzuimverzekering"
        description="Overzicht van je premie"
        summaryAmount={PREMIE_OPTIES[premieIndex]}
        summaryInfo="Inclusief poliskosten en assurantiebelasting"
        showSummaryInfoButton
        onSummaryInfoClick={() => console.log("info geklikt")}
        defaultActiveSectionId="basis"
        sections={[
          {
            id: "basis",
            title: "Basisdekking",
            date: "01-01-2026",
            amount: "€ 65,00",
            onEdit: () => console.log("wijzig geklikt"),
            groups: [
              {
                title: "Medewerkers",
                items: [
                  { label: "J. de Vries", date: "12-03-1990", amount: "€ 32,50", onRemove: () => console.log("verwijder J. de Vries") },
                  { label: "A. Bakker", date: "04-07-1985", amount: "€ 32,50", onRemove: () => console.log("verwijder A. Bakker") },
                ],
              },
            ],
          },
          {
            id: "aanvullend",
            title: "Aanvullende dekking",
            amount: "€ 24,50",
          },
        ]}
      />
    </div>
  );
}
