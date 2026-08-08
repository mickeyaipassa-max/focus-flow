"use client";

import { Icon } from "./Icon";

type LabelProps = {
  /** Figma's "Label" is een placeholder-demotekst (net als "Alert title"/"Card Detail") — geen default, elke afnemer geeft zijn eigen titel mee. */
  labelText: string;
  required?: boolean;
  optional?: boolean;
  /** Helptekst onder de titelregel. Figma's eigen "Description" is ook placeholder-demotekst, dus geen default — aan-/afwezigheid van deze prop bepaalt de zichtbaarheid. */
  description?: string;
  popoverButton?: boolean;
  onPopoverClick?: () => void;
  /** Koppelt dit label aan een form-veld — rendert dan een echte `<label htmlFor>` i.p.v. Figma's kale `<div>` (zelfde toegankelijkheidsupgrade als eerder bij Select/InputEmail/FieldsetName, waar dit label-patroon tot nu toe steeds inline werd nagebouwd). */
  htmlFor?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's gedeelde "Label"-component (node 2968:630) —
 * hetzelfde component dat al inline is nagebouwd binnen Select, InputPhone,
 * InputEmail, FieldsetName en (in een vereenvoudigde vorm) RadioGroup en
 * CheckboxGroup. Dit is de eerste keer dat het als eigen, herbruikbaar
 * bestand wordt gebouwd — de eerdere componenten blijven ongewijzigd (geen
 * scope-uitbreiding naar een retro-actieve refactor van vijf bestaande
 * componenten), maar nieuwe velden kunnen dit voortaan hergebruiken.
 */
export function Label({
  labelText,
  required = true,
  optional = false,
  description,
  popoverButton = false,
  onPopoverClick,
  htmlFor,
  className,
}: LabelProps) {
  const titleRow = (
    <>
      <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
        {labelText}
      </span>
      {required && (
        <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
          *
        </span>
      )}
    </>
  );

  return (
    <div className={className ?? "flex w-full flex-col items-start justify-center gap-1"}>
      <div className="flex flex-wrap items-center gap-1">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="flex items-center gap-1 text-lg leading-[1.5]">
            {titleRow}
          </label>
        ) : (
          <div className="flex items-center gap-1 text-lg leading-[1.5]">{titleRow}</div>
        )}
        {optional && (
          <span className="pl-1 font-[350] text-[#565656] text-base" style={{ fontFamily: "var(--font-avenir-book)" }}>
            (niet verplicht)
          </span>
        )}
        {popoverButton && (
          <button
            type="button"
            onClick={onPopoverClick}
            className="flex size-6 shrink-0 items-center justify-center rounded-[3px] p-3"
          >
            <Icon name="popover-info" size="sm" alt="Meer informatie" />
          </button>
        )}
      </div>
      {description && (
        <p className="w-full font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
          {description}
        </p>
      )}
    </div>
  );
}
