"use client";

import { Icon } from "./Icon";

type InputPercentageProps = {
  /** Label boven het veld — bv. de volledige vraag ("Wat was het verzuimpercentage in 2025?") of alleen een jaartal (bij meerdere velden onder één gedeelde vraag). */
  labelText: string;
  /** Helptekst onder het label — alleen gebruikt bij een losse (1-jaar) vraag; bij meerdere jaren staat deze eenmalig gedeeld boven de losse jaar-rijen, dus dan hier weglaten. */
  description?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id: string;
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Input Percentage" (node 10053:6448): "allows users
 * to enter or edit percentage values." Rechtstreeks vergelijkbaar met het
 * bestaande input-atoompatroon (label + `*` + rode-rand-foutstaat +
 * Validation-bericht) dat `InputEmail`/`FieldsetCompanyAddress` al
 * gebruiken, met als enige verschil een "%"-icoon aan het eind van het veld
 * i.p.v. een prefix-icoon (zoals het euro-icoon bij `FieldsetEmployee`'s
 * loonveld) — vaste 112px-breedte, bevestigd in Figma op zowel de losse
 * (1-jaar) als de per-jaar-rij (meerdere jaren) variant.
 */
export function InputPercentage({ labelText, description, required = true, value, onChange, error, id, name, className }: InputPercentageProps) {
  return (
    <div className={className ?? "flex w-full flex-col items-start gap-2"}>
      <div className="flex w-full flex-col items-start gap-1">
        <label htmlFor={id} className="flex items-center gap-1 text-lg leading-[1.5]">
          <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {labelText}
          </span>
          {required && (
            <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
              *
            </span>
          )}
        </label>
        {description && (
          <p className="w-full text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        )}
      </div>
      <div
        className={[
          "flex h-[51px] w-[112px] items-center justify-end gap-2 rounded-[3px] border bg-white px-4 py-3",
          error ? "border-[#ce0a1e]" : "border-[#565656] focus-within:border-black",
        ].join(" ")}
      >
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-px flex-1 text-black text-lg leading-[1.5] outline-none"
          style={{ fontFamily: "var(--font-avenir)" }}
        />
        <Icon name="percentage" size="sm" />
      </div>
      {error && (
        <div id={`${id}-error`} className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
          <span className="flex shrink-0 items-center pt-[3px]">
            <Icon name="validation-error" size="sm" />
          </span>
          <span className="flex items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
