"use client";

import { Icon } from "./Icon";

type TextareaProps = {
  labelText: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  /** Foutmelding — aanwezigheid bepaalt de error-state (rode rand + melding), zoals bij `Input`. */
  error?: string;
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Meerregelig tekstveld, gebaseerd op Figma's "Textarea" (Formulier-
 * behandelhistorie, "Licht je reden toe": veld van 272×128px). Opgebouwd als
 * `Input`: zelfde label, `*`, hint, rand (#565656, zwart bij focus, rood bij
 * fout) en foutmelding; alleen het veld is een `<textarea>` van 128px hoog.
 * Figma tekent geen sleepgreep, dus het formaat is vast (`resize-none`).
 */
export function Textarea({
  labelText,
  required = true,
  optional = false,
  description,
  value,
  onChange,
  placeholder,
  maxLength,
  error,
  name,
  id,
  className,
}: TextareaProps) {
  return (
    <div className={className ?? "flex w-full max-w-[272px] flex-col items-start gap-2"}>
      <div className="flex w-full flex-col items-start justify-center gap-1">
        <div className="flex flex-wrap items-center gap-1">
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
          {optional && (
            <span className="pl-1 font-[350] text-[#565656] text-base" style={{ fontFamily: "var(--font-avenir-book)" }}>
              (niet verplicht)
            </span>
          )}
        </div>
        {description && (
          <p className="font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        )}
      </div>

      <textarea
        id={id}
        name={name}
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={[
          "h-[128px] w-full resize-none rounded-[3px] border bg-white px-4 py-3 text-black text-lg leading-[1.5] outline-none",
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
