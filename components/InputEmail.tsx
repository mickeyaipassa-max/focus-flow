"use client";

import { Icon } from "./Icon";

type InputEmailProps = {
  /** Figma's label is in beide gefetchte staten letterlijk "E-mailadres" — echte vaste UI-tekst, dus wél een default (zelfde redenering als InputPhone's "Telefoonnummer"). */
  labelText?: string;
  required?: boolean;
  /** Bevestigd op het gedeelde Label-subcomponent (zelfde node als Select/InputPhone), hier niet apart gefetcht maar wel dezelfde, al meermaals bevestigde Label-API. */
  optional?: boolean;
  description?: string;
  showInfo?: boolean;
  onInfoClick?: () => void;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Input Email" (validation=false/true) — het
 * eenvoudigste veld tot nu toe: geen hover/active-variant gefetcht (die
 * bestaan niet in Figma's variant-matrix voor dit component), dus ook niet
 * gebouwd. Wél "use client": een controlled `<input onChange>` die vanuit
 * een Server Component (zoals page.tsx) een echte handler krijgt, loopt
 * tegen dezelfde "Event handlers cannot be passed"-fout aan die CardDetails
 * eerder had — hier meteen goed gezet, i.t.t. Button/CardDetails die dat
 * nog missen (aparte, niet in deze opdracht meegenomen fix).
 *
 * `outline-none` + `focus:border-black` i.p.v. kaal `outline-none`: Figma
 * toont geen focus-state, maar een input zonder enige focus-aanduiding is
 * een toegankelijkheidsgat — dit hergebruikt het "actief = zwarte rand"-
 * patroon dat elders in deze bibliotheek al bevestigd is (Select, Radio).
 */
export function InputEmail({
  labelText = "E-mailadres",
  required = true,
  optional = false,
  description,
  showInfo = false,
  onInfoClick,
  value,
  onChange,
  placeholder,
  error,
  name,
  id,
  className,
}: InputEmailProps) {
  return (
    <div className={className ?? "flex w-full max-w-[480px] flex-col items-start gap-2"}>
      <div className="flex w-full flex-col items-start justify-center gap-1">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-1 text-lg leading-[1.5]">
            <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
              {labelText}
            </span>
            {required && (
              <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
                *
              </span>
            )}
          </div>
          {optional && (
            <span className="pl-1 font-[350] text-[#565656] text-base" style={{ fontFamily: "var(--font-avenir-book)" }}>
              (niet verplicht)
            </span>
          )}
          {showInfo && (
            <button
              type="button"
              onClick={onInfoClick}
              className="flex size-6 shrink-0 items-center justify-center rounded-[3px] p-3"
            >
              <Icon name="popover-info" size="sm" alt="Meer informatie" />
            </button>
          )}
        </div>
        {description && (
          <p className="font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        )}
      </div>

      <input
        id={id}
        name={name}
        type="email"
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={[
          "h-[51px] w-full rounded-[3px] border bg-white px-4 py-3 text-black text-lg leading-[1.5] outline-none",
          error ? "border-[#ce0a1e]" : "border-[#565656] focus:border-black",
        ].join(" ")}
        style={{ fontFamily: "var(--font-avenir)" }}
      />

      {error && (
        <div className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
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
