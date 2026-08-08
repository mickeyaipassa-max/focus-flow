"use client";

import { useId } from "react";
import { Icon } from "./Icon";

export type RadioOption = { value: string; label: string };

type RadioGroupProps = {
  labelText: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  /**
   * Bevestigd via Figma: de "Radio Group" belichaamt zelf geen losse
   * `boxed`-eigenschap — de horizontale variant gebruikt altijd de
   * "boxed"-radio-stijl (rand om elke optie), de verticale altijd de kale
   * cirkel+tekst-stijl. Geen aparte `boxed`-prop dus, want die combinatie
   * bestaat niet als eigen Figma-variant.
   */
  horizontal?: boolean;
  error?: string;
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Radio Group"-component, opgebouwd uit het losse
 * "Radio"-component (state=default/hover/selected, boxed=true/false).
 *
 * De radio-cirkel zelf is in Figma een simpele SVG-cirkel met wisselende
 * stroke-breedte (1px grijs → 2px zwart bij hover → 6px zwart bij
 * geselecteerd, altijd binnen eenzelfde 20px-cirkel). Dat is exact na te
 * bouwen met een CSS-rand op een `rounded-full`-div — vandaar geen losse
 * SVG-bestanden voor de radio-stip, i.t.t. Select's iconen die echte
 * vormen waren. Hierdoor kan dit een echte `<input type="radio">` zijn
 * (`peer` + `peer-checked`/`peer-hover`), met gratis toetsenbordnavigatie
 * (pijltjes) en formuliersemantiek van de browser zelf.
 *
 * `<fieldset>`/`<legend>` i.p.v. Figma's kale divs voor het label — een
 * bewuste toegankelijkheidsupgrade (screenreaders koppelen de legend
 * correct aan de hele groep), net zoals eerdere componenten div's al naar
 * `<button>` upgraden.
 */
export function RadioGroup({
  labelText,
  options,
  value,
  onChange,
  required = true,
  horizontal = false,
  error,
  name,
  className,
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  return (
    <fieldset
      className={
        className ??
        ["flex flex-col items-start gap-2 border-0 p-0 m-0", horizontal ? "w-fit" : "w-[272px] max-w-full"].join(" ")
      }
    >
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

      <div className={horizontal ? "flex w-fit flex-wrap items-start gap-2" : "flex w-full flex-col items-start gap-2"}>
        {options.map((option) => {
          const checked = option.value === value;
          const inputId = `${groupName}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={
                horizontal
                  ? [
                      "flex shrink-0 cursor-pointer items-center gap-2 rounded-[3px] border px-4 py-3",
                      checked ? "border-[#eda50f] bg-[#fff8e3]" : "border-[#9d9d9d] bg-white",
                    ].join(" ")
                  : "flex w-full cursor-pointer items-start gap-2"
              }
            >
              <span className={["relative inline-flex shrink-0 size-5", horizontal ? "" : "mt-[3px]"].join(" ")}>
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
              <span
                className="flex-1 font-[350] text-black text-lg leading-[1.5]"
                style={{ fontFamily: "var(--font-avenir-book)" }}
              >
                {option.label}
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
