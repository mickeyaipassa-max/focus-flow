"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

export type PhoneCountryOption = {
  /** Bijv. "+31". */
  dialCode: string;
  /** Weergavenaam in de dropdown, bijv. "Nederland (+31)". */
  name: string;
  flag: ReactNode;
};

/**
 * De enige vlag die Figma zelf levert voor dit component (".NL -
 * Netherlands"). Figma's volledige landenkeuzelijst bevat 200+ landen met
 * eigen vlag-SVG's — die stuk voor stuk downloaden en hardcoden zou geen
 * "uit Figma gehaald" data meer zijn maar een eigen, willekeurig gekozen
 * subset. Daarom: alleen Nederland als bevestigde default; de consument
 * geeft zelf een `countries`-lijst mee voor de volledige picker.
 */
const NETHERLANDS: PhoneCountryOption = {
  dialCode: "+31",
  name: "Nederland (+31)",
  flag: <img src="/icons/flag-nl.svg" alt="" className="h-3 w-4" />,
};

type InputPhoneProps = {
  /** Figma's label is in elke gefetchte staat letterlijk "Telefoonnummer" — echte vaste UI-tekst, geen placeholder-demo, dus wél een default. */
  labelText?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  dialCode?: string;
  onDialCodeChange?: (dialCode: string) => void;
  /** Ontbreekt = alleen Nederland beschikbaar in de (nog wel functionele) dropdown. */
  countries?: PhoneCountryOption[];
  /** Bevestigde Figma-variant: verbergt de land-kiezer volledig, toont alleen een statische "+31"-prefix. */
  nlOnly?: boolean;
  error?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Input Phone" (NL-only × active × filled ×
 * validation). Net als Select een "use client"-component met een eigen
 * open/dicht-dropdown (klik-buiten + Escape) — maar met één bevestigd
 * verschil: het chevron-icoon blijft hier bij "active" gewoon
 * "chevron down" (Figma laat 'm bewust of per ongeluk niet omklappen zoals
 * bij Select) en de buitenrand van het veld verandert niet van kleur zodra
 * de land-dropdown openstaat. Beide letterlijk overgenomen, niet
 * "gecorrigeerd" voor consistentie met Select.
 */
export function InputPhone({
  labelText = "Telefoonnummer",
  required = true,
  value,
  onChange,
  dialCode = "+31",
  onDialCodeChange,
  countries,
  nlOnly = false,
  error,
  placeholder,
  name,
  id,
  className,
}: InputPhoneProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = useId();

  const options = countries ?? [NETHERLANDS];
  const selected = options.find((country) => country.dialCode === dialCode) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleSelect(country: PhoneCountryOption) {
    onDialCodeChange?.(country.dialCode);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={className ?? "flex w-full max-w-[480px] flex-col items-start gap-2"}>
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

      <div
        className={[
          "relative flex h-[51px] w-full items-center gap-2 rounded-[3px] border bg-white py-3 pr-3 pl-px",
          error ? "border-[#ce0a1e]" : "border-[#565656] focus-within:border-black",
        ].join(" ")}
      >
        {nlOnly ? (
          <div
            className="flex h-6 shrink-0 items-center pl-4 text-black text-lg leading-[1.5]"
            style={{ fontFamily: "var(--font-avenir)" }}
          >
            +31
          </div>
        ) : (
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            onClick={() => setOpen((current) => !current)}
            className="flex shrink-0 items-center gap-1 rounded-tl-[1px] rounded-bl-[1px] pl-4"
          >
            <span className="inline-flex h-3 w-4 shrink-0 overflow-hidden">{selected.flag}</span>
            <span className="flex items-center gap-1">
              <span className="text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
                {selected.dialCode}
              </span>
              <Icon name="chevron-down" size="sm" />
            </span>
            <span className="ml-1 h-[49px] w-px shrink-0 bg-[#e5e5e5]" />
          </button>
        )}

        <input
          id={inputId}
          name={name}
          type="tel"
          value={value ?? ""}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 text-black text-lg leading-[1.5] outline-none"
          style={{ fontFamily: "var(--font-avenir)" }}
        />

        {open && !nlOnly && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 top-full z-10 mt-1 flex max-h-[206px] w-full flex-col items-start overflow-y-auto rounded-[3px] bg-white py-1 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)]"
          >
            {options.map((country, index) => (
              <div key={country.dialCode} className="w-full">
                <button
                  type="button"
                  role="option"
                  aria-selected={country.dialCode === selected.dialCode}
                  onClick={() => handleSelect(country)}
                  className="flex w-full items-start px-1"
                >
                  <span className="flex flex-1 items-center gap-2 rounded-[3px] px-3 py-2 text-left text-lg leading-[1.5] hover:bg-[rgba(0,0,0,0.08)]">
                    <span className="flex items-center pt-1">
                      <span className="inline-flex h-3 w-4 shrink-0 overflow-hidden">{country.flag}</span>
                    </span>
                    <span
                      className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-black"
                      style={{ fontFamily: "var(--font-avenir)" }}
                    >
                      {country.name}
                    </span>
                  </span>
                </button>
                {index === 0 && options.length > 1 && <div className="my-1 h-px w-full bg-[#e5e5e5]" />}
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
}
