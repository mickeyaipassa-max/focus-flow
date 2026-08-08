"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

export type PopoverPosition = "bottom center" | "bottom left" | "bottom right" | "top left" | "top center" | "top right";

/**
 * Pijltje-positionering, letterlijk overgenomen uit alle 6 gefetchte Figma-
 * varianten (niet gesymmetriseerd — bottom-links staat op 8px, bottom-
 * rechts op 7.86px, top-links/rechts allebei op 11.86px; dat zijn Figma's
 * eigen, niet-perfect-symmetrische waarden).
 */
const arrowPositionClass: Record<PopoverPosition, string> = {
  "bottom center": "bottom-[-18px] left-1/2 -translate-x-1/2 rotate-45",
  "bottom left": "bottom-[-18px] left-2 rotate-45",
  "bottom right": "bottom-[-18px] right-[7.86px] rotate-45",
  "top left": "top-[-14px] left-[11.86px] -rotate-135",
  "top center": "top-[-14px] left-1/2 -translate-x-1/2 -rotate-135",
  "top right": "top-[-14px] right-[11.86px] -rotate-135",
};

/** Paneelpositie t.o.v. de trigger, afgeleid van dezelfde pijltje-plek: "bottom X" = paneel boven de trigger, "top X" = paneel eronder. */
const panelPositionClass: Record<PopoverPosition, string> = {
  "bottom center": "bottom-full left-1/2 mb-[18px] -translate-x-1/2",
  "bottom left": "bottom-full left-0 mb-[18px]",
  "bottom right": "bottom-full right-0 mb-[18px]",
  "top left": "top-full left-0 mt-[14px]",
  "top center": "top-full left-1/2 mt-[14px] -translate-x-1/2",
  "top right": "top-full right-0 mt-[14px]",
};

type PopoverProps = {
  /** Figma's "Title" is placeholder-demotekst; `popoverTitle` was een losse boolean, hier vervangen door aan-/afwezigheid van deze prop (zelfde patroon als Alert). */
  title?: string;
  /** De inhoud — Figma's "The quick brown fox..." is duidelijk lorem-ipsum-achtige placeholder, dus verplicht, geen default. */
  children: ReactNode;
  position?: PopoverPosition;
  /** Vaste, bevestigde Nederlandse linktekst; alleen zichtbaar als er ook een `linkHref` is (geen link zonder bestemming). */
  linkText?: string;
  linkHref?: string;
  /** Toegankelijke naam voor de info-knop. */
  triggerLabel?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Popover" (6 position-varianten, alle 6 vers
 * gefetcht) + "Popover Button" (de info-icoon-trigger, ook gefetcht).
 * Zelfstandig component: bevat zijn eigen trigger-knop én beheert zelf
 * open/dicht — dit vervangt de tot nu toe inerte `showInfo`/`onInfoClick`-
 * stub-props in Label/Select/InputEmail/CheckboxCardControlLeft met een
 * echt werkende popover. Die bestaande componenten zijn niet met
 * terugwerkende kracht aangepast om dít component te gebruiken (zelfde
 * scope-grens als bij Label.tsx eerder).
 *
 * Figma's documentatietekst is expliciet: "Only one Popover can be open at
 * a time and is closed by clicking outside or using the close button."
 * Klik-buiten + Escape + sluitknop zijn gebouwd; het "maar één tegelijk
 * open, paginabreed"-deel zou een gedeelde context vereisen die hier
 * bewust niet is toegevoegd (elke Popover regelt alleen zijn eigen state) —
 * een bewuste, toegelichte scope-grens, geen gok.
 */
export function Popover({ title, children, position = "bottom center", linkText = "Meer informatie", linkHref, triggerLabel = "Meer informatie", className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

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

  return (
    <div ref={rootRef} className={className ?? "relative inline-flex"}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={triggerLabel}
        onClick={() => setOpen((current) => !current)}
        className="flex size-6 shrink-0 items-center justify-center rounded-[3px] p-3"
      >
        <Icon name="popover-info" size="sm" />
      </button>

      {open && (
        <div
          id={panelId}
          role="tooltip"
          className={[
            "absolute z-20 flex w-[282px] flex-col items-start rounded-[3px] bg-white p-1 shadow-[0px_8px_12px_rgba(0,0,0,0.16)]",
            panelPositionClass[position],
          ].join(" ")}
        >
          <div className="flex w-full items-start gap-2">
            <div className="flex min-w-px flex-1 flex-col items-start py-2 pl-2">
              {title && (
                <p className="w-full font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  {title}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Sluiten"
              className="flex size-10 shrink-0 items-center justify-center gap-1 rounded-[3px]"
            >
              <Icon name="close" size="md" />
            </button>
          </div>

          <div className="flex w-full flex-col items-start gap-2 px-2 pt-1 pb-2">
            <p className="w-full font-[350] text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {children}
            </p>
            {linkHref && (
              <a
                href={linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2"
              >
                <span className="flex items-center pt-[3px]">
                  <Icon name="chevron-right" size="sm" />
                </span>
                <span className="whitespace-nowrap font-[350] text-[#0064a8] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  {linkText}
                </span>
                <span className="flex items-start pt-[2px]">
                  <Icon name="new-tab" size="sm" />
                </span>
              </a>
            )}
          </div>

          <img
            src="/icons/popover-arrow.svg"
            alt=""
            aria-hidden="true"
            className={["pointer-events-none absolute size-5", arrowPositionClass[position]].join(" ")}
          />
        </div>
      )}
    </div>
  );
}
