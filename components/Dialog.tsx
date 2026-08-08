"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

type DialogSize = "sm" | "md";

export type DialogAction = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Vrije content i.p.v. Figma's kale `bodyText`-string — een "uitgebreide uitleg" heeft vaak meerdere alinea's, dat kan de consument zelf indelen. */
  children?: ReactNode;
  size?: DialogSize;
  closable?: boolean;
  /**
   * Bevestigde `slot`-property in Figma ("swap this" — expliciet Figma's
   * eigen dev-placeholder, net als bij CardDetails/CheckboxCard/Popover),
   * hier een echte inhoud-slot i.p.v. de roze plaatshouder na te bouwen.
   */
  slot?: ReactNode;
  /** Rendert de Divider + knoppenrij onderaan — alleen als er echte acties zijn (Figma's eigen "Button"/"Button"-labels zijn placeholders, geen defaults). */
  actions?: DialogAction[];
  className?: string;
};

/**
 * Gebaseerd op Figma's "Dialog" (backdrop, geannoteerd: "when the height
 * exceeds the gray area, set the dialog window from hug content to fill
 * container" — hier vertaald naar `max-h-[...] overflow-y-auto` op het
 * venster) + "Dialog Window" (size=SM/MD × viewport=320-599/600-1440, 4×
 * vers gefetcht).
 *
 * Bevestigde, niet voor de hand liggende details, letterlijk overgenomen:
 * - Titel-lettergrootte is viewport-gestuurd (24px desktop → 20px mobiel),
 *   ónafhankelijk van size=SM/MD (die bepaalt alleen de breedte: 588px vs
 *   792px).
 * - Padding rondom is ook viewport-gestuurd: 24px desktop → 20px mobiel.
 * - De sluitknop gebruikt een "sticky binnen een absolute full-height
 *   wrapper"-truc, zodat hij zichtbaar blijft vastgeplakt rechtsboven
 *   wanneer de body-tekst intern scrollt (nodig bij lange uitleg, bv.
 *   werkgeverslasten) — 1-op-1 gereproduceerd, niet vereenvoudigd tot een
 *   gewone `sticky`-div op de knop zelf.
 *
 * Toegevoegd, niet in Figma getoond maar standaard modal-gedrag: sluiten
 * via Escape en klik-op-backdrop, `document.body`-scroll-lock zolang open,
 * en rendering via een React Portal (voorkomt z-index/overflow-clip-
 * problemen door voorouder-containers). Geen volledige focus-trap gebouwd —
 * zelfde bewuste scope-grens als bij Select/Popover.
 */
export function Dialog({ open, onClose, title, children, size = "sm", closable = true, slot, actions, className }: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const sizeClass = size === "md" ? "max-w-[792px]" : "max-w-[588px]";

  return createPortal(
    <div
      ref={backdropRef}
      onClick={(event) => {
        if (event.target === backdropRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.32)] px-6 py-10 backdrop-blur-[4px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={className ?? ["flex w-full max-h-full flex-col items-start overflow-y-auto rounded-[3px] bg-white", sizeClass].join(" ")}
      >
        <div className="flex w-full flex-col items-start gap-5 p-5 min-[600px]:gap-6 min-[600px]:p-6">
          <div className="flex w-full items-start pt-2 pr-12 min-[600px]:pt-1">
            <p
              id={titleId}
              className="min-w-px flex-1 font-medium text-black text-xl leading-[1.4] min-[600px]:text-2xl min-[600px]:leading-[1.3]"
              style={{ fontFamily: "var(--font-memphis-medium)" }}
            >
              {title}
            </p>
          </div>

          {children && (
            <div className="flex w-full flex-col items-start gap-4">
              <div className="w-full font-[350] text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                {children}
              </div>
            </div>
          )}

          {slot && <div className="flex w-full flex-col items-start">{slot}</div>}

          {closable && (
            <div className="pointer-events-none absolute top-0 right-5 bottom-0 h-full min-[600px]:right-6">
              <div className="sticky top-0 h-[60px] w-10 min-[600px]:h-16">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Sluiten"
                  className="pointer-events-auto absolute top-5 right-0 flex size-10 items-center justify-center gap-1 rounded-[3px] bg-white min-[600px]:top-6"
                >
                  <Icon name="close" size="md" />
                </button>
              </div>
            </div>
          )}
        </div>

        {actions && actions.length > 0 && (
          <>
            <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
            <div className="flex w-full flex-col items-start p-5 min-[600px]:p-6">
              <div className="flex w-full flex-wrap items-start gap-2">
                {actions.map((action, index) => (
                  <button
                    key={action.label + index}
                    type="button"
                    onClick={action.onClick}
                    className={
                      action.variant === "secondary"
                        ? "flex items-center justify-center gap-2 rounded-[3px] border border-[#565656] px-6 py-3 font-[550] text-black text-lg leading-[1.5]"
                        : "flex items-center justify-center gap-2 rounded-[3px] bg-black px-6 py-3 font-[550] text-white text-lg leading-[1.5]"
                    }
                    style={{ fontFamily: "var(--font-avenir-medium)" }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
