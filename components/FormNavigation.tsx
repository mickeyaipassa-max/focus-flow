import { Button } from "./Button";

type FormNavigationProps = {
  /** Toont de "Vorige stap"-knop. Default false — matcht de eerste-stap variant in Figma. */
  previousStep?: boolean;
  /** Override voor de tekst van de vorige-stap-knop — bevestigd op "Jouw bedrijf 2/3" toont deze de naam van de vorige sub-stap ("Jouw bedrijf") i.p.v. de generieke "Vorige stap". Default "Vorige stap", gelijk aan de basisvariant. */
  previousLabel?: string;
  /** Toont de "Volgende stap"-knop. Default true — matcht de basisvariant in Figma. */
  nextStep?: boolean;
  /** Override voor de knoptekst — Figma's knoplabel is per funnelstap andere content (bv. "Start met premie berekenen" op stap 1), geen vaste "Volgende stap" overal. Default "Volgende stap", gelijk aan de basisvariant. */
  nextLabel?: string;
  /** Toont de "Aanvraag versturen"-knop (submit). Default false. */
  submit?: boolean;
  /** Verticale, volle-breedte knoppen i.p.v. een horizontale rij. Default false. */
  stacked?: boolean;
  /**
   * Geen van deze handlers komt uit Figma (het ontwerp toont geen klikgedrag).
   * Dit zijn architectuur-hooks, geen ontwerpkeuzes: zonder aanhaakpunt is
   * dit component — anders dan de decoratieve Chat-knop — functioneel
   * onbruikbaar, want het IS de funnel-navigatie.
   */
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  className?: string;
};

export function FormNavigation({
  previousStep = false,
  previousLabel = "Vorige stap",
  nextStep = true,
  nextLabel = "Volgende stap",
  submit = false,
  stacked = false,
  onPrevious,
  onNext,
  onSubmit,
  className,
}: FormNavigationProps) {
  const activeCount = [previousStep, nextStep, submit].filter(Boolean).length;

  const groupAlignment = stacked
    ? "flex-col gap-2"
    : activeCount > 1
      ? "justify-between"
      : "justify-end";

  return (
    <div
      className={
        className ??
        [
          "flex w-full bg-white rounded-b-md",
          stacked ? "flex-col items-start px-6 py-4" : "items-start px-10 py-6",
        ].join(" ")
      }
    >
      <div className={["flex w-full items-start", groupAlignment].join(" ")} data-name="Button Group">
        {previousStep && (
          <Button type="secondary" iconPrepend="arrow-left" onClick={onPrevious} fullWidth={stacked} order={stacked ? 2 : undefined}>
            {previousLabel}
          </Button>
        )}
        {nextStep && (
          <Button type="primary" iconAppend="arrow-right" onClick={onNext} fullWidth={stacked}>
            {nextLabel}
          </Button>
        )}
        {submit && (
          <Button type="brand" htmlType="submit" onClick={onSubmit} fullWidth={stacked}>
            Aanvraag versturen
          </Button>
        )}
      </div>
    </div>
  );
}
