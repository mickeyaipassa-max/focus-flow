"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";

export type InputSearchResult = { value: string; label: string };

type InputSearchProps = {
  /** Label boven het veld. Zonder label (bv. een zoekveld in een kop) blijft alleen het veld over. */
  labelText?: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  /** Extra inhoud tussen het label en het veld, bv. een link "Bekijk een voorbeeld van een polisblad" (zoals bij `Input`). */
  beforeField?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  /** Enter in het veld, of een klik op de zoekknop. */
  onSubmit?: (value: string) => void;
  /** Klik op het kruisje. De waarde wordt daarbij ook geleegd (`onChange("")`). */
  onClear?: () => void;
  placeholder?: string;
  /** Figma `submit button`: toont een zwarte zoekknop rechts in het veld en laat het loep-icoon links weg. */
  submitButton?: boolean;
  submitLabel?: string;
  /** Figma `loading`: een spinner in het veld, in plaats van het kruisje. */
  loading?: boolean;
  /** Figma `results`: suggesties in een lijst onder het veld. Zonder (of een lege) lijst blijft die dicht. */
  results?: InputSearchResult[];
  onSelectResult?: (result: InputSearchResult) => void;
  /** Foutmelding — aanwezigheid bepaalt de error-state (rode rand + melding), zoals bij `Input`. */
  error?: string;
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Input Search" (bestand "Components", pagina "Input",
 * component set 14355:3191; props `submit button`, `filled`, `loading` en
 * `results`): een label met sterretje, een invoerveld van 51px (rand #565656,
 * radius 3, wit) en onder het veld de optionele resultatenlijst.
 *
 * Opbouw van het veld, uit de vijf varianten:
 * - zonder zoekknop: loep-icoon links (16px marge), tekst, en rechts bij een
 *   gevulde waarde een kruisje van 40×40 (6px marge) of tijdens het laden een
 *   spinner van 24px;
 * - met zoekknop: geen loep, de zwarte knop "Zoeken" (43px hoog, 8/16px
 *   padding, 18px Medium) rechts met 4px marge, bij een gevulde waarde met het
 *   kruisje ervoor.
 * Het placeholder-tekstje "Zoeken..." is #565656, een ingevulde waarde zwart.
 *
 * De resultatenlijst is "Dropdown Menu" uit Figma: 480px breed, wit, radius 3,
 * schaduw 0/8/24 zwart 16% (zoals bij `Select`), 4px ruimte erboven, items van
 * 43px (padding 8/12, 18px Book) met bij hover een vlak van zwart 8%. Figma
 * toont geen toetsenbordgedrag; hier: pijltjes kiezen een resultaat, Enter
 * bevestigt, Escape sluit (combobox-patroon).
 *
 * Hover/focus/fout volgen `Input`/`KentekenVeld`: hover 2px zwarte rand (1px
 * rand plus 1px schaduw), focus 1px zwart, fout rood met melding.
 * Alleen het zoekveld zelf: het filteren van resultaten en het uitvoeren van
 * de zoekopdracht horen bij de pagina die het gebruikt.
 */
export function InputSearch({
  labelText,
  required = true,
  optional = false,
  description,
  beforeField,
  value = "",
  onChange,
  onSubmit,
  onClear,
  placeholder = "Zoeken...",
  submitButton = false,
  submitLabel = "Zoeken",
  loading = false,
  results,
  onSelectResult,
  error,
  name,
  id,
  className,
}: InputSearchProps) {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-search`;
  const listId = `${generatedId}-results`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(-1);

  const hasResults = Boolean(results && results.length > 0);
  const open = hasResults && focused && !dismissed;
  const filled = value.length > 0;

  // Klik buiten het component sluit de lijst.
  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setDismissed(true);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function select(result: InputSearchResult) {
    onChange?.(result.label);
    onSelectResult?.(result);
    setDismissed(true);
    setActive(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && hasResults) {
      event.preventDefault();
      setDismissed(false);
      setActive((current) => (current + 1) % results!.length);
    } else if (event.key === "ArrowUp" && hasResults) {
      event.preventDefault();
      setDismissed(false);
      setActive((current) => (current <= 0 ? results!.length - 1 : current - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (open && active >= 0 && results) select(results[active]);
      else onSubmit?.(value);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setDismissed(true);
      setActive(-1);
    }
  }

  const fieldRing = error
    ? "border-[#ce0a1e]"
    : "border-[#565656] hover:border-black hover:shadow-[0_0_0_1px_#000] focus-within:border-black focus-within:shadow-none";

  return (
    <div ref={rootRef} className={className ?? "flex w-full max-w-[480px] flex-col items-start gap-2"}>
      {(labelText || description || beforeField) && (
        <div className="flex w-full flex-col items-start justify-center gap-1">
          {labelText && (
            <div className="flex flex-wrap items-center gap-1">
              <label htmlFor={inputId} className="flex items-center gap-1 text-lg leading-[1.5]">
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
          )}
          {description && (
            <p className="font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {description}
            </p>
          )}
          {beforeField}
        </div>
      )}

      <div className="relative w-full">
      <div
        role="search"
        className={[
          // Figma's rand ligt binnen het kader (51px hoog): de paddings zijn 1px kleiner dan in Figma (16/6/4/12) vanwege de CSS-rand erbuiten.
          "flex h-[51px] w-full items-center gap-2 rounded-[3px] border bg-white pl-[15px]",
          submitButton ? "pr-[3px]" : loading ? "pr-[11px]" : filled ? "pr-[5px]" : "pr-[15px]",
          fieldRing,
        ].join(" ")}
      >
        {!submitButton && <Icon name="search" size="md" />}
        <input
          id={inputId}
          name={name}
          type="search"
          role={hasResults ? "combobox" : undefined}
          aria-expanded={hasResults ? open : undefined}
          aria-controls={hasResults ? listId : undefined}
          aria-autocomplete={hasResults ? "list" : undefined}
          aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            onChange?.(event.target.value);
            setDismissed(false);
            setActive(-1);
          }}
          onFocus={() => {
            setFocused(true);
            setDismissed(false);
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent text-black text-lg leading-[1.5] outline-none placeholder:text-[#565656] [&::-webkit-search-cancel-button]:hidden"
          style={{ fontFamily: "var(--font-avenir-book)" }}
        />

        {loading ? (
          <span className="flex size-6 shrink-0 items-center justify-center" role="status" aria-label="Laden">
            <Spinner size="md" />
          </span>
        ) : (
          filled && (
            <button
              type="button"
              aria-label="Zoekopdracht wissen"
              onClick={() => {
                onChange?.("");
                onClear?.();
              }}
              className="flex size-10 shrink-0 items-center justify-center rounded-[3px] hover:bg-[rgba(0,0,0,0.08)] active:bg-[rgba(0,0,0,0.08)]"
            >
              <Icon name="close" size="md" />
            </button>
          )
        )}

        {submitButton && (
          <button
            type="button"
            onClick={() => onSubmit?.(value)}
            className="flex h-[43px] shrink-0 items-center justify-center rounded-[3px] bg-black px-4 py-2 font-[550] text-lg text-white leading-[1.5] whitespace-nowrap hover:bg-[#292929] active:bg-[#292929]"
            style={{ fontFamily: "var(--font-avenir-medium)" }}
          >
            {submitLabel}
          </button>
        )}
      </div>

      {open && results && (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full left-0 z-10 mt-1 flex max-h-[206px] w-full flex-col overflow-y-auto rounded-[3px] bg-white py-1 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)]"
        >
          {results.map((result, index) => (
            <li
              key={result.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              // mousedown i.p.v. click: de input verliest anders eerst de focus en de lijst sluit voor de klik.
              onMouseDown={(event) => {
                event.preventDefault();
                select(result);
              }}
              onMouseEnter={() => setActive(index)}
              className="flex w-full cursor-pointer px-1"
            >
              <span
                className={[
                  "flex flex-1 items-center rounded-[3px] px-3 py-2 text-black text-lg leading-[1.5]",
                  index === active ? "bg-[rgba(0,0,0,0.08)]" : "",
                ].join(" ")}
                style={{ fontFamily: "var(--font-avenir-book)" }}
              >
                {result.label}
              </span>
            </li>
          ))}
        </ul>
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
