"use client";

import { Icon } from "./Icon";

type InputCurrencyProps = {
  labelText: string;
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
 * Gebaseerd op Figma's "Input Currency" (node 189:9240, "Welk bedrag wil je
 * verzekeren"): zelfde input-atoompatroon als `InputPercentage`, maar met een
 * euro-icoon vóór de tekst i.p.v. een "%"-icoon erna — bevestigd via mcp dat
 * het icoon hier als prefix binnen het veld staat, links uitgelijnd, en het
 * veld zelf 320px breed is (i.p.v. InputPercentage's smalle 112px, want hier
 * gaat het om grote bedragen tot € 5.000.000).
 */
export function InputCurrency({ labelText, description, required = true, value, onChange, error, id, name, className }: InputCurrencyProps) {
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
          "flex h-[51px] w-full max-w-[320px] items-center gap-2 rounded-[3px] border bg-white px-4 py-3",
          error ? "border-[#ce0a1e]" : "border-[#565656] focus-within:border-black",
        ].join(" ")}
      >
        <Icon name="euro" size="sm" />
        <input
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-px flex-1 text-black text-lg leading-[1.5] outline-none"
          style={{ fontFamily: "var(--font-avenir)" }}
        />
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
