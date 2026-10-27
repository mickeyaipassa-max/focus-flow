"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { FunnelSection } from "@/components/FunnelSection";
import { BewindScherm, Scheidingslijn } from "../delen";
import { BEWIND_STEPS, ROUTES, useBewindFunnel } from "../funnel-context";
import { isGeldig, valideerBewindgegevens, valideerBewindvoerder, valideerKlant } from "../validatie";

/**
 * Succespagina na "Indienen" (Figma frame "5 Succes"): alle vier de stappen afgevinkt (`activeStep` één
 * voorbij de laatste), "Gelukt!", de succesmelding, "Wat nu?" en de knop. Er wordt nog niets echt
 * verstuurd. Zonder volledig ingevuld formulier (rechtstreeks geopend of na een refresh) gaat de gebruiker
 * terug naar het begin, net als bij de behandelhistorie-funnel.
 *
 * De knop heet in Figma nog "Naar [Pagina]": de bestemming is niet bekend, dus hij gaat nog nergens heen.
 */
export default function GeluktPage() {
  const router = useRouter();
  const { state } = useBewindFunnel();
  const compleet =
    isGeldig(valideerBewindvoerder(state)) && isGeldig(valideerBewindgegevens(state)) && isGeldig(valideerKlant(state));

  useEffect(() => {
    if (!compleet) router.replace(ROUTES.bewindvoerder);
  }, [compleet, router]);

  return (
    <BewindScherm activeStep={BEWIND_STEPS.length + 1} feedback>
      <FunnelSection intro title="Gelukt!" />

      <div className="w-full">
        <Alert
          className="flex items-start gap-2 rounded-[3px] bg-[#eef4e3] p-2"
          type="success"
          closable={false}
          title="Je aanmelding is verzonden"
          description="Je aanmelding als bewindvoerder is succesvol naar ons verstuurd."
        />
      </div>

      <FunnelSection
        title="Wat nu?"
        description="We zoeken je cliënt op in onze administratie en controleren je gegevens aan de hand van de beschikking van de rechtbank. Is alles in orde, dan leggen we het bewind vast. Kunnen we je cliënt niet vinden of klopt er iets niet, dan nemen we contact met je op."
      />

      <Scheidingslijn />

      <Button type="primary">Naar [Pagina]</Button>
    </BewindScherm>
  );
}
