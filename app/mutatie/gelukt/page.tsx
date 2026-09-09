"use client";

import { useRouter } from "next/navigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { useMutatieFunnel } from "../funnel-context";
import { fromIsoDatum, formatDatum } from "../pricing";

const MUTATIE_STEPS = ["Jouw dekking", "Bevestiging"];

/**
 * Successcherm van de mutatie-funnel "Dekking wijzigen" (Figma node
 * 8031:11638, "Dekking 13"). Volgt na "Aanpassing bevestigen" op de
 * bevestigingsstap. Geen formulierstap meer — geen sidebar, geen
 * FormNavigation, alleen één primaire knop terug naar de polisdetailpagina.
 *
 * `activeStep={3}` (één voorbij de laatste stap, `MUTATIE_STEPS.length`):
 * `StepIndicator` toont een stap als "completed" zodra `stepNumber <
 * activeStep`, dus dit zet beide stappen op de bevestigde "completed"-staat
 * (groene vinkjes, volledig groene balk) zonder dat het component zelf
 * aangepast hoeft te worden.
 *
 * Op verzoek gecorrigeerd t.o.v. Figma's letterlijke content: de headertitel
 * was hier "Risico adres wijzigen" (overduidelijk hergebruikt van een andere
 * mutatie-funnel-sjabloon) — gelijkgetrokken aan "Dekking wijzigen", net als
 * stap 1 en de bevestigingsstap.
 *
 * De ingangsdatum ("Deze gaat in per ...") was in Figma een vaste
 * voorbeelddatum ("17-09-2025"). Eerst dynamisch berekend (eerste van de
 * eerstvolgende maand), en op verzoek daarna vervangen door een echt
 * invoerveld op stap 1 ("Per wanneer wil je dat de wijziging ingaat?") —
 * dit scherm toont nu de daadwerkelijk gekozen datum uit de gedeelde
 * `MutatieFunnelProvider`-state, i.p.v. zelf iets te berekenen.
 *
 * `Alert` met `type="success"` matcht Figma's kleuren 1-op-1
 * (`feedback/succes-tint` #eef4e3 / groen-700 #0f865d); `closable={false}`
 * want Figma toont hier geen sluitknop op deze melding, anders dan Alert's
 * eigen default.
 */
export default function MutatieGeluktPage() {
  const router = useRouter();
  const { state } = useMutatieFunnel();

  return (
    <FunnelPageTemplate
      headerTitle="Dekking wijzigen"
      cancelButton
      onCancel={() => router.push("/mutatie")}
      ikzSticker
      steps={MUTATIE_STEPS}
      activeStep={MUTATIE_STEPS.length + 1}
      navigation={
        /*
         * `FunnelPageTemplate`'s `navigation`-slot geeft zelf geen padding
         * mee (dat levert normaliter `FormNavigation` zelf, `px-6 py-4
         * min-[600px]:px-10 min-[600px]:py-6`) — zonder deze wrapper stond
         * de knop hier plat tegen de kaartranden aan.
         */
        <div className="flex w-full items-start bg-white rounded-b-md px-6 py-4 min-[600px]:px-10 min-[600px]:py-6">
          <Button type="primary" onClick={() => router.push("/mutatie")}>
            Naar je account
          </Button>
        </div>
      }
    >
      <FunnelSection intro title="Gelukt!" />

      <Alert
        type="success"
        closable={false}
        title="Het is gelukt!"
        description={`We hebben je wijziging verwerkt. Deze gaat in per ${state.ingangsdatum ? formatDatum(fromIsoDatum(state.ingangsdatum)) : "–"}.`}
      />

      <FunnelSection title="Wat nu?" description="Je krijgt binnen een paar minuten een e-mail met de bevestiging van je wijziging." />
    </FunnelPageTemplate>
  );
}
