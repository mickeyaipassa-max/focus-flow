import { Button } from "./Button";
import { Icon } from "./Icon";

type FormNavigationProps = {
  /** Toont de "Vorige stap"-knop. Default false — matcht de eerste-stap variant in Figma. */
  previousStep?: boolean;
  /** Override voor de tekst van de vorige-stap-knop — bevestigd op "Jouw bedrijf 2/3" toont deze de naam van de vorige sub-stap ("Jouw bedrijf") i.p.v. de generieke "Vorige stap". Default "Vorige stap", gelijk aan de basisvariant. */
  previousLabel?: string;
  /** Toont de "Volgende stap"-knop. Default true — matcht de basisvariant in Figma. */
  nextStep?: boolean;
  /** Override voor de knoptekst — Figma's knoplabel is per funnelstap andere content (bv. "Start met premie berekenen" op stap 1), geen vaste "Volgende stap" overal. Default "Volgende stap", gelijk aan de basisvariant. */
  nextLabel?: string;
  /** Toont de submit-knop. Default false. */
  submit?: boolean;
  /** Override voor de submit-knoptekst — bevestigd op de mutatie-funnel "Bevestiging"-stap ("Aanpassing bevestigen" i.p.v. "Aanvraag versturen"). */
  submitLabel?: string;
  /** Verticale, volle-breedte knoppen i.p.v. een horizontale rij. Default false. */
  stacked?: boolean;
  /**
   * Toont de "Bewaar voor later"-link met envelop-icoon boven de knoppenrij
   * — bevestigd op de Reisverzekering-funnel "Jouw dekking"-stap (node
   * 2416:2956). In Figma zelf staat deze link in een verticale stapel boven
   * alléén de hoofdknop (niet de volledige rij) — hier vereenvoudigd tot een
   * eigen, rechts uitgelijnde regel boven de hele knoppenrij, want de exacte
   * per-knop-stapeling zou dit component onevenredig complex maken voor een
   * secundaire actie. Geen icoon-asset bevestigd via mcp (de Figma-instance
   * bleek een niet-oplosbare geneste icon-swap) — `mail.svg` is hier zelf
   * getekend, geen Figma-export.
   */
  saveForLater?: boolean;
  onSaveForLater?: () => void;
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
  submitLabel = "Aanvraag versturen",
  stacked = false,
  saveForLater = false,
  onSaveForLater,
  onPrevious,
  onNext,
  onSubmit,
  className,
}: FormNavigationProps) {
  const activeCount = [previousStep, nextStep, submit].filter(Boolean).length;

  /**
   * `stacked=false` (de meerderheid van de aanroepen) betekende voorheen
   * altijd een horizontale rij, ook op mobiel — waardoor 2 knoppen met tekst
   * ("Jouw situatie" / "Naar jouw gegevens") niet meer pasten en aan beide
   * randen werden afgesneden. Nu automatisch gestapeld onder 600px, ongeacht
   * `stacked`; expliciet `stacked=true` blijft daarboven óók gestapeld (de
   * bewuste, altijd-verticale variant — nu ongewijzigd in gedrag).
   */
  const groupAlignment = stacked
    ? "flex-col gap-2"
    : activeCount > 1
      ? "flex-col gap-2 min-[600px]:flex-row min-[600px]:justify-between"
      : "flex-col gap-2 min-[600px]:flex-row min-[600px]:justify-end";

  const buttonFullWidth = stacked ? true : "mobile";

  return (
    <div
      className={
        className ??
        [
          "flex w-full bg-white rounded-b-md",
          stacked
            ? "flex-col items-start px-6 py-4"
            : "flex-col items-start px-6 py-4 min-[600px]:flex-row min-[600px]:px-10 min-[600px]:py-6",
        ].join(" ")
      }
    >
      {saveForLater && (
        <button type="button" onClick={onSaveForLater} className="mb-2 flex w-full items-center justify-end gap-2 rounded-[3px]">
          <Icon name="mail" size="sm" />
          <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            Bewaar voor later
          </span>
        </button>
      )}
      <div className={["flex w-full items-start", groupAlignment].join(" ")} data-name="Button Group">
        {previousStep && (
          <Button type="secondary" iconPrepend="arrow-left" onClick={onPrevious} fullWidth={buttonFullWidth} order={stacked ? 2 : undefined}>
            {previousLabel}
          </Button>
        )}
        {nextStep && (
          <Button type="primary" iconAppend="arrow-right" onClick={onNext} fullWidth={buttonFullWidth}>
            {nextLabel}
          </Button>
        )}
        {submit && (
          <Button type="brand" htmlType="submit" onClick={onSubmit} fullWidth={buttonFullWidth}>
            {submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
