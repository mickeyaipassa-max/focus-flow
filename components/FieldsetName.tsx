"use client";

import { useId } from "react";
import { Icon } from "./Icon";

export type FieldsetNameValue = {
  initials: string;
  infix: string;
  lastName: string;
};

type FieldsetNameErrors = Partial<Record<keyof FieldsetNameValue, string>>;

type NameFieldProps = {
  id: string;
  name: string;
  labelText: string;
  required: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className: string;
};

function NameField({ id, name, labelText, required, value, onChange, error, className }: NameFieldProps) {
  return (
    <div className={className}>
      <div className="flex w-full flex-col items-start justify-center gap-1">
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
      </div>
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
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

const EMPTY_VALUE: FieldsetNameValue = { initials: "", infix: "", lastName: "" };

type FieldsetNameProps = {
  value?: FieldsetNameValue;
  onChange?: (value: FieldsetNameValue) => void;
  /**
   * Niet bevestigd als losse Figma-variant voor dít component (alleen
   * "initials"/"first name" bestaan als top-level varianten, geen
   * validatie-as) — maar wél de bevestigde foutstijl van het onderliggende,
   * door Figma zelf gelinkte "Input"-atoom (dezelfde rode rand + Validation-
   * bericht als Select/InputEmail/InputPhone). Hergebruikt, niet gegokt.
   */
  errors?: FieldsetNameErrors;
  /** Voorvoegsel voor de drie input-name-attributen, bijv. "aanvrager" → "aanvrager-initials". */
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Fieldset Name", variant="initials" (de gevraagde
 * variant; "first name" bestaat ook in Figma maar is niet opgevraagd).
 * Drie velden gebouwd uit hetzelfde "Input"-atoom dat InputEmail al
 * gebruikt: Voorletters (verplicht) + Tussenvoegsel (niet verplicht) naast
 * elkaar (`gap: 24px 8px` — rij-afstand 24px, kolom-afstand 8px), Achternaam
 * (verplicht) eronder op volle breedte.
 *
 * Figma's vaste 160px-breedte per veld is hier `flex-1 min-w-[160px]`
 * i.p.v. een harde `w-[160px]` — zelfde redenering als Select's
 * `fieldWidth`: de velden mogen meegroeien met een bredere ouder in plaats
 * van altijd exact 160px te blijven.
 */
export function FieldsetName({ value = EMPTY_VALUE, onChange, errors, name, className }: FieldsetNameProps) {
  const generatedName = useId();
  const fieldName = name ?? generatedName;

  function set(key: keyof FieldsetNameValue, fieldValue: string) {
    onChange?.({ ...value, [key]: fieldValue });
  }

  return (
    <div className={className ?? "flex w-full flex-col items-start gap-6"}>
      <div className="flex w-full flex-wrap items-start gap-x-2 gap-y-6">
        <NameField
          id={`${fieldName}-initials`}
          name={`${fieldName}-initials`}
          labelText="Voorletters"
          required
          value={value.initials}
          onChange={(v) => set("initials", v)}
          error={errors?.initials}
          className="flex min-w-[160px] flex-1 flex-col items-start gap-2"
        />
        <NameField
          id={`${fieldName}-infix`}
          name={`${fieldName}-infix`}
          labelText="Tussenvoegsel"
          required={false}
          value={value.infix}
          onChange={(v) => set("infix", v)}
          error={errors?.infix}
          className="flex min-w-[160px] flex-1 flex-col items-start gap-2"
        />
      </div>
      <NameField
        id={`${fieldName}-last-name`}
        name={`${fieldName}-last-name`}
        labelText="Achternaam"
        required
        value={value.lastName}
        onChange={(v) => set("lastName", v)}
        error={errors?.lastName}
        className="flex w-full flex-col items-start gap-2"
      />
    </div>
  );
}
