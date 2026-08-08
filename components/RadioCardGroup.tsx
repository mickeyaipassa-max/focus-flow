"use client";

import { useId } from "react";
import { Icon } from "./Icon";

export type RadioCardOption = { value: string; label: string };

type RadioCardGroupProps = {
  labelText: string;
  description?: string;
  options: RadioCardOption[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Radio Card Control Left Group" (node 10938:29381,
 * design-systeemdocumentatie: "een verticaal gestapelde set radio-opties...
 * voor eenvoudige keuzescenario's"). Dit is een ander, breder component dan
 * de bestaande `RadioGroup`: elke optie is een volle-breedte kaart met een
 * apart gearceerde radio-kolom links, i.p.v. RadioGroup's kale cirkel+tekst
 * (vertical) of pil-vorm (horizontal) — geen van beide bestaande varianten
 * dekt deze kaartvorm, vandaar een nieuw, op zichzelf staand component i.p.v.
 * een derde `RadioGroup`-variant.
 *
 * De radiostip zelf hergebruikt exact hetzelfde CSS-rand-patroon (peer-checked
 * border) als `RadioGroup`, i.p.v. Figma's losse radio-SVG's — zelfde
 * onderbouwing: een simpele cirkel met wisselende randdikte is met CSS
 * identiek na te bouwen en geeft gratis toetsenbord- en formuliersemantiek.
 */
export function RadioCardGroup({
  labelText,
  description,
  options,
  value,
  onChange,
  required = true,
  error,
  name,
  className,
}: RadioCardGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  return (
    <fieldset className={className ?? "m-0 flex w-full flex-col items-start gap-4 border-0 p-0"}>
      <div className="flex flex-col items-start justify-center gap-1">
        <legend className="flex items-center gap-1 p-0 text-lg leading-[1.5]">
          <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {labelText}
          </span>
          {required && (
            <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
              *
            </span>
          )}
        </legend>
        {description && (
          <p className="text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        {options.map((option) => {
          const checked = option.value === value;
          const inputId = `${groupName}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={[
                "flex w-full cursor-pointer items-stretch overflow-hidden rounded-[3px] border",
                checked ? "border-[#eda50f] shadow-[0px_4px_8px_rgba(0,0,0,0.12)]" : "border-[#ccc]",
              ].join(" ")}
            >
              <span
                className={[
                  "flex shrink-0 items-center justify-center border-r p-2",
                  checked ? "border-[#eda50f] bg-[#fff8e3]" : "border-[#ccc] bg-[#f6f6f7]",
                ].join(" ")}
              >
                <span className="relative inline-flex size-5 shrink-0">
                  <input
                    id={inputId}
                    type="radio"
                    name={groupName}
                    value={option.value}
                    checked={checked}
                    onChange={() => onChange?.(option.value)}
                    className="peer absolute inset-0 size-5 cursor-pointer appearance-none opacity-0"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full border border-[#565656] bg-white peer-checked:border-[6px] peer-checked:border-black peer-hover:border-2 peer-hover:border-black peer-checked:peer-hover:border-[6px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black"
                  />
                </span>
              </span>
              <span className="flex flex-1 items-center bg-white px-4 py-6">
                <span className="font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  {option.label}
                </span>
              </span>
            </label>
          );
        })}
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
