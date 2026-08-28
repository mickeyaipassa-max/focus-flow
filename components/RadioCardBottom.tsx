"use client";

import { Fragment, useId } from "react";
import { Icon } from "./Icon";

export type RadioCardBottomFeature = { text: string; included: boolean };

export type RadioCardBottomOption = {
  value: string;
  title: string;
  description: string;
  features: RadioCardBottomFeature[];
  /** Getoond als "€ {price} per maand" — geen placeholder-cijfers, dus een echte waarde vereist. */
  price: string;
};

type RadioCardBottomGroupProps = {
  labelText: string;
  required?: boolean;
  options: RadioCardBottomOption[];
  value?: string;
  onChange?: (value: string) => void;
  onMoreInfoClick?: (value: string) => void;
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Radio Card Control Bottom (Group)" — bevestigd via
 * mcp op de mutatie-funnel "Kies je dekking"-stap (node 8031:10820, cards
 * "Basis"/"Allrisk"). Zelfde naam als de bestaande `RadioCardGroup`, maar
 * een structureel ander component: radio-indicator ónderaan i.p.v. een
 * losse kolom links, plus een featurelijst (check/cross) en prijsblok die
 * `RadioCardGroup` niet heeft — geen van beide bestaande componenten dekt
 * deze variant, vandaar een nieuw, eigen component.
 *
 * `<label>` + verborgen `<input type="radio">` i.p.v. Figma's letterlijke
 * `<button>`-element — zelfde toegankelijkheidsredenering als
 * `RadioCardGroup`/`RadioGroup`: gratis formuliersemantiek en
 * toetsenbordnavigatie, geen nieuw patroon t.o.v. wat al in dit project
 * bestaat.
 *
 * De check/cross-iconen binnen de featurelijst zijn losse nieuwe bestanden
 * (`list-check`/`list-cross`) i.p.v. de bestaande `check`/`x`: die bestaande
 * bestanden zijn een ander glyph met een andere kleur/verhouding (bevestigd
 * via een directe mcp-vergelijking) — hergebruik zou hier zelf een icoon
 * verzinnen zijn.
 */
export function RadioCardBottomGroup({
  labelText,
  required = true,
  options,
  value,
  onChange,
  onMoreInfoClick,
  name,
  className,
}: RadioCardBottomGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  return (
    <fieldset className={className ?? "m-0 flex w-full flex-col items-start gap-4 border-0 p-0"}>
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

      <div className="flex w-full flex-col items-stretch gap-4 min-[600px]:flex-row">
        {options.map((option) => {
          const checked = option.value === value;
          const inputId = `${groupName}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={[
                "flex min-w-px flex-1 cursor-pointer flex-col items-start rounded-[3px]",
                checked ? "drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]" : "",
              ].join(" ")}
            >
              <input
                id={inputId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={checked}
                onChange={() => onChange?.(option.value)}
                className="sr-only"
              />

              <div
                className={[
                  "flex w-full flex-col items-center gap-4 rounded-t-[3px] border-t border-r border-l bg-white px-6 pt-6 pb-4",
                  checked ? "border-[#eda50f]" : "border-[#ccc]",
                ].join(" ")}
              >
                <div className="flex w-full flex-col items-start text-center">
                  <p className="w-full font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                    {option.title}
                  </p>
                  <p className="w-full font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                    {option.description}
                  </p>
                </div>

                <div className="flex w-full flex-col items-start gap-2">
                  {option.features.map((feature, index) => (
                    <Fragment key={index}>
                      <div className="flex w-full items-start gap-2">
                        <span
                          className={[
                            "flex shrink-0 items-center justify-center rounded-full p-1",
                            feature.included ? "bg-[#eef4e3]" : "bg-[#f6f6f7]",
                          ].join(" ")}
                        >
                          <Icon name={feature.included ? "list-check" : "list-cross"} size="sm" />
                        </span>
                        <p className="min-w-px flex-1 pt-px text-left text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                          {feature.text}
                        </p>
                      </div>
                      {index < option.features.length - 1 && <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />}
                    </Fragment>
                  ))}
                </div>

                <div className="flex w-full flex-col items-center border-t border-[#e5e5e5] pt-4 text-center">
                  <p className="w-full text-2xl text-black leading-[1.3]" style={{ fontFamily: "var(--font-memphis-bold)" }}>
                    € {option.price}
                  </p>
                  <p className="w-full font-[350] text-[#565656] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                    per maand
                  </p>
                </div>

                {/*
                  Losse, lokale knop i.p.v. het gedeelde `Button`-component:
                  deze knop zit genest in het `<label>` van de radio, dus een
                  klik moet de radio-selectie niet meenemen. Zelfde
                  stopPropagation-aanpak als CheckboxCardControlLeft's eigen
                  "Meer informatie"-knop, die voor exact dezelfde reden ook
                  geen gedeeld `Button` gebruikt (dat component accepteert
                  geen event-object in `onClick`).
                */}
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onMoreInfoClick?.(option.value);
                  }}
                  className="flex w-full items-center gap-2 rounded-[3px]"
                >
                  <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                    Meer informatie
                  </span>
                </button>
              </div>

              <div
                className={[
                  "flex w-full items-center justify-center rounded-b-[3px] border px-6 py-2",
                  checked ? "border-[#eda50f] bg-[#fff8e3]" : "border-[#ccc] bg-[#f6f6f7]",
                ].join(" ")}
              >
                <span className="relative inline-flex size-5 shrink-0">
                  <span
                    aria-hidden="true"
                    className={[
                      "pointer-events-none absolute inset-0 rounded-full border bg-white",
                      checked ? "border-[6px] border-black" : "border-[#565656]",
                    ].join(" ")}
                  />
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
