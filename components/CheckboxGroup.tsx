"use client";

import { useId } from "react";
import { Checkbox } from "./Checkbox";
import { Icon } from "./Icon";

export type CheckboxOption = { value: string; label: string };

type CheckboxGroupProps = {
  labelText: string;
  options: CheckboxOption[];
  values: string[];
  onChange?: (values: string[]) => void;
  required?: boolean;
  error?: string;
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Checkbox Group" — Label + N Checkbox-rijen +
 * optionele Validation. `options`/`values` generaliseert Figma's losse
 * checkbox2..5-booleans (zelfde precedent als RadioGroup's `options`).
 *
 * Bevestigd verschil met RadioGroup: hier zijn meerdere tegelijk aan te
 * vinken (vandaar `values: string[]` i.p.v. één `value: string`) — dat is
 * exact het verschil dat Figma's eigen componentbeschrijving noemt
 * ("lets users select multiple options independently").
 *
 * De Validation-foutmelding heeft in Figma geen `w-full` (alleen
 * `shrink-0`, hugt zijn tekst) — bevestigd tijdens deze analyse, en dat
 * bleek af te wijken van hoe RadioGroup's Validation eerder was gebouwd
 * (die kreeg per ongeluk `w-full`). Hier dus bewust `w-fit`.
 */
export function CheckboxGroup({
  labelText,
  options,
  values,
  onChange,
  required = true,
  error,
  name,
  className,
}: CheckboxGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  function toggle(optionValue: string, checked: boolean) {
    if (!onChange) return;
    onChange(checked ? [...values, optionValue] : values.filter((v) => v !== optionValue));
  }

  return (
    <fieldset className={className ?? "flex w-[268px] max-w-full flex-col items-start gap-2 border-0 p-0 m-0"}>
      <legend className="mb-1 flex items-center gap-1 p-0 text-lg leading-[1.5]">
        <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
          {labelText}
        </span>
        {required && (
          <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
            *
          </span>
        )}
      </legend>

      <div className="flex w-full flex-col items-start gap-2">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            name={groupName}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={(checked) => toggle(option.value, checked)}
          />
        ))}
      </div>

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
    </fieldset>
  );
}
