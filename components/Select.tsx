"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";

export type SelectOption = { value: string; label: string };

type FieldWidth = "xs" | "sm" | "md" | "lg";

/** Bevestigde breedtes uit Figma (96/160/320/480px). Als `max-w-*` i.p.v. vaste `w-*`, zodat het veld niet overflowt in een smallere ouder — zelfde redenering als bij Alert. */
const fieldWidthClass: Record<FieldWidth, string> = {
  xs: "max-w-24",
  sm: "max-w-40",
  md: "max-w-80",
  lg: "max-w-[480px]",
};

type SelectProps = {
  labelText: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Figma's eigen vaste tekst — hier wél als echte default, i.t.t. "Alert title"/"Card Detail": dit lijkt een systeemplaceholder (zoals een HTML `<select>`'s "-- kies --"), geen per-instance demo-inhoud. */
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  /** Toont de info-knop naast het label (Figma's `popoverButton`). Alleen de knop zelf is geïmplementeerd — Figma toont geen popover-paneelinhoud, dus die is niet gebouwd. */
  showInfo?: boolean;
  onInfoClick?: () => void;
  compact?: boolean;
  fieldWidth?: FieldWidth;
  /** Foutmelding — aanwezigheid bepaalt de error-state (rode rand + Validation-bericht), matcht Figma's `validation`-boolean. */
  error?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Select"-component (2 losse componentsets: de losse
 * "Selectbox" voor state=default/hover/active/error/disabled, en "Select"
 * voor de complete velden incl. label/validatie/dropdown). Interactief
 * (open/dicht, keuze maken) — daarom de eerste "use client"-component in
 * deze bibliotheek; alle eerdere componenten kwamen weg met pure CSS
 * :hover/:active.
 *
 * Bewust niet gebouwd: volledige ARIA-combobox-toetsenbordnavigatie (pijltjes
 * op/neer door de lijst). Wél: Escape sluit, klik-buiten sluit, correcte
 * button/listbox/option-rollen. Figma toont geen toetsenbordgedrag, dus dit
 * is een bewuste, toegelichte scope-grens — geen gok.
 */
export function Select({
  labelText,
  options,
  value,
  onChange,
  placeholder = "Maak een keuze",
  required = true,
  optional = false,
  description,
  showInfo = false,
  onInfoClick,
  compact = false,
  fieldWidth = "md",
  error,
  disabled = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

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

  const selected = options.find((option) => option.value === value);

  function handleSelect(optionValue: string) {
    onChange?.(optionValue);
    setOpen(false);
  }

  const triggerClasses = (() => {
    const base = "flex w-full items-center gap-2 rounded-[3px] text-left " + (compact ? "px-3 py-2" : "h-[51px] px-4 py-3");
    if (disabled) return base + " cursor-not-allowed border border-[#9d9d9d] bg-[#f6f6f7]";
    if (error) return base + " cursor-pointer border border-[#ce0a1e] bg-white";
    if (open) return base + " cursor-pointer border border-black bg-white";
    return base + " cursor-pointer border border-[#565656] bg-white hover:border-2 hover:border-black";
  })();

  return (
    <div ref={rootRef} className={className ?? ["flex w-full flex-col items-start gap-2", fieldWidthClass[fieldWidth]].join(" ")}>
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

      <div className="relative w-full">
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((o) => !o)}
          className={triggerClasses}
        >
          <span
            className={[
              "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg leading-[1.5]",
              selected ? "text-black" : "text-[#565656]",
            ].join(" ")}
            style={{ fontFamily: "var(--font-avenir)" }}
          >
            {selected ? selected.label : placeholder}
          </span>
          <Icon name={open ? "chevron-up" : "chevron-down"} size="md" />
        </button>

        {open && !disabled && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 top-full z-10 mt-1 flex max-h-[206px] w-full flex-col items-start overflow-y-auto rounded-[3px] bg-white py-1 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)]"
          >
            <button
              type="button"
              role="option"
              aria-selected={!selected}
              onClick={() => handleSelect("")}
              className="flex w-full items-start px-1"
            >
              <span className="flex flex-1 items-center gap-2 rounded-[3px] px-3 py-2 text-left text-lg leading-[1.5] hover:bg-[rgba(0,0,0,0.08)]">
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-black" style={{ fontFamily: "var(--font-avenir)" }}>
                  {placeholder}
                </span>
                {!selected && (
                  <span className="flex shrink-0 items-center pt-1">
                    <Icon name="dropdown-check" size="sm" />
                  </span>
                )}
              </span>
            </button>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className="flex w-full items-start px-1"
                >
                  <span className="flex flex-1 items-center gap-2 rounded-[3px] px-3 py-2 text-left text-lg leading-[1.5] hover:bg-[rgba(0,0,0,0.08)]">
                    <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-black" style={{ fontFamily: "var(--font-avenir)" }}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="flex shrink-0 items-center pt-1">
                        <Icon name="dropdown-check" size="sm" />
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="flex w-full items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
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
