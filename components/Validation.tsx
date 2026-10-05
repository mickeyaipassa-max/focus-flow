import { Icon } from "./Icon";

type ValidationProps = {
  message: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Validation"-component (node 3048:3338, type=error,
 * closable=false): roze foutvlak (`#f8d3dd`, feedback/error-tint) met een
 * 16px fouticoon en een melding van 14px. Dezelfde opmaak die al inline in
 * `Input` zit; hier als eigen, herbruikbaar bestand gebouwd voor InputFile
 * (de bestaande inline-varianten blijven ongewijzigd).
 *
 * Figma tekent alleen `closable=false` en `type=error`; de sluitbare variant
 * (die het design system in code voor per-bestand-fouten gebruikt) bestaat in
 * Figma niet en is daarom ook niet gebouwd.
 *
 * In Figma staat de tekst op `nowrap`; echte meldingen zijn langer dan de
 * demotekst, dus de tekst mag hier omlopen (`min-w-0`).
 */
export function Validation({ message, className }: ValidationProps) {
  return (
    <div className={className ?? "flex w-fit max-w-full items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1"}>
      <span className="flex shrink-0 items-center pt-[3px]">
        <Icon name="validation-error" size="sm" />
      </span>
      <span className="flex min-w-0 items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
        {message}
      </span>
    </div>
  );
}
