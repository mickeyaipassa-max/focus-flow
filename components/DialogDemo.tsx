"use client";

import { useState } from "react";
import { Dialog } from "./Dialog";

/**
 * Losse client-wrapper puur voor de verificatieharness op de pagina —
 * page.tsx zelf blijft een Server Component (zelfde conventie als de rest
 * van deze bibliotheek), dus de open/dicht-state moet hier zitten.
 */
export function DialogDemo() {
  const [smOpen, setSmOpen] = useState(false);
  const [mdOpen, setMdOpen] = useState(false);
  const [noActionsOpen, setNoActionsOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-start gap-4">
      <button
        type="button"
        onClick={() => setSmOpen(true)}
        className="rounded-[3px] bg-black px-6 py-3 font-[550] text-lg text-white"
        style={{ fontFamily: "var(--font-avenir-medium)" }}
      >
        Open SM dialoog (werkgeverslasten)
      </button>
      <button
        type="button"
        onClick={() => setMdOpen(true)}
        className="rounded-[3px] border border-[#565656] px-6 py-3 font-[550] text-black text-lg"
        style={{ fontFamily: "var(--font-avenir-medium)" }}
      >
        Open MD dialoog (lange uitleg, scrollt)
      </button>
      <button
        type="button"
        onClick={() => setNoActionsOpen(true)}
        className="rounded-[3px] border border-[#565656] px-6 py-3 font-[550] text-black text-lg"
        style={{ fontFamily: "var(--font-avenir-medium)" }}
      >
        Open dialoog zonder acties
      </button>

      <Dialog
        open={smOpen}
        onClose={() => setSmOpen(false)}
        title="Werkgeverslasten"
        size="sm"
        actions={[
          { label: "Begrepen", variant: "primary", onClick: () => setSmOpen(false) },
          { label: "Annuleren", variant: "secondary", onClick: () => setSmOpen(false) },
        ]}
      >
        <p>
          Werkgeverslasten zijn de kosten die je als werkgever bovenop het brutosalaris betaalt, zoals
          sociale premies, pensioenopbouw en de Zorgverzekeringswet-bijdrage.
        </p>
        <p className="mt-4">Gemiddeld liggen deze lasten tussen de 20% en 30% van het brutosalaris.</p>
      </Dialog>

      <Dialog
        open={mdOpen}
        onClose={() => setMdOpen(false)}
        title="Uitgebreide toelichting"
        size="md"
        actions={[{ label: "Sluiten", variant: "primary", onClick: () => setMdOpen(false) }]}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <p key={index} className={index > 0 ? "mt-4" : ""}>
            Dit is alinea {index + 1} van een lange uitleg, bedoeld om te testen of de sluitknop
            vastgeplakt blijft rechtsboven terwijl de inhoud zelf scrolt.
          </p>
        ))}
      </Dialog>

      <Dialog open={noActionsOpen} onClose={() => setNoActionsOpen(false)} title="Zonder actieknoppen">
        <p>Deze dialoog toont alleen een titel, inhoud en de sluitknop — geen Divider of knoppenrij.</p>
      </Dialog>
    </div>
  );
}
