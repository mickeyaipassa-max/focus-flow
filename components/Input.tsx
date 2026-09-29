"use client";

import type { ReactNode } from "react";
import { Icon } from "./Icon";

type InputProps = {
  labelText: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  /** Extra inhoud tussen het label en het veld zelf — bevestigd nodig voor "Welk modelnummer staat op je polisblad?" (een link "Bekijk een voorbeeld van een polisblad" hoort daar, binnen hetzelfde label-blok, vóór het invoerveld). Zelfde precedent als Select's `beforeField`. */
  beforeField?: ReactNode;
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
 * Generiek tekst-invoerveld, gebaseerd op Figma's "Input"-component (node
 * 2002:9026) — hetzelfde basispatroon als de bestaande, meer specifieke
 * InputEmail/InputPhone, maar zonder vast `type`/validatie: dit is Figma's
 * kale "Input" zoals gebruikt voor "Welk modelnummer staat op je
 * polisblad?", geen van de bestaande getypeerde varianten past hier.
 */
export function Input({
  labelText,
  required = true,
  optional = false,
  description,
  beforeField,
  showInfo = false,
  onInfoClick,
  value,
  onChange,
  placeholder,
  error,
  name,
  id,
  className,
}: InputProps) {
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
            <button type="button" onClick={onInfoClick} className="flex size-6 shrink-0 items-center justify-center rounded-[3px] p-3">
              <Icon name="popover-info" size="sm" alt="Meer informatie" />
            </button>
          )}
        </div>
        {description && (
          <p className="font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        )}
        {beforeField}
      </div>

      <input
        id={id}
        name={name}
        type="text"
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
