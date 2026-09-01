"use client";

import { useId } from "react";

type ToggleProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  /** Accessibele naam — Figma toont geen zichtbaar label naast dit component, dus geen aparte `label`-slot. */
  "aria-label"?: string;
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Toggle"-component (node 14331:14, "Components"-
 * bibliotheek: selected=off/on × hover=false/true). Zelfde precedent als
 * RadioGroup/Checkbox: een echte `<input type="checkbox">` (opacity-0,
 * absoluut over de hele visual) voor gratis formuliersemantiek en
 * toetsenbordbediening, i.p.v. Figma's eigen gegenereerde `<button>`-
 * referentiecode — `role="switch"` bovenop de checkbox-semantiek zodat
 * schermlezers dit als aan/uit-schakelaar aankondigen i.p.v. een checkbox.
 *
 * De hendel is in Figma zelf, op alle 4 varianten, gewoon een vlakke witte
 * cirkel (nagetrokken uit de geëxporteerde SVG's — geen enkel visueel
 * verschil tussen de "handle"-assets) — dus als CSS `rounded-full bg-white`
 * i.p.v. een los icoon-bestand, zelfde aanpak als RadioGroup's eigen stip.
 * Het vinkje binnenin (alleen bij `selected=on`) is wél een echt uniek
 * icoon (`toggle-check.svg`, 1-op-1 geëxporteerd) — geen match met een
 * bestaand icoon in dit project (andere kleurverhouding/aspect ratio dan
 * `check.svg`/`checkbox-check.svg`).
 *
 * Positionering (padding + `justify-end` i.p.v. `translate`) en de hover-
 * kleuren (Figma's eigen dubbele-gradient-overlay herleid tot de exacte
 * samengestelde vlakke kleur — zelfde aanpak als Button.tsx) zijn letterlijk
 * overgenomen, inclusief de kleine paddingverschuiving bij hover (2px→4px
 * aan de kant van de hendel) die Figma's eigen states laten zien.
 *
 * Geen `disabled`-variant: Figma's componentset toont alleen selected ×
 * hover (4 varianten), geen disabled-staat — dus hier ook niet verzonnen.
 * `peer-focus-visible:outline` is wél toegevoegd, niet in Figma getoond
 * maar standaard toetsenbord-toegankelijkheid, zelfde precedent als
 * RadioGroup/Checkbox.
 */
export function Toggle({ checked, onChange, "aria-label": ariaLabel, name, id, className }: ToggleProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <span className={className ?? "relative inline-flex h-[28px] w-[50px] shrink-0"}>
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        name={name}
        checked={checked}
        aria-label={ariaLabel}
        onChange={(event) => onChange?.(event.target.checked)}
        className="peer absolute inset-0 z-10 size-full cursor-pointer appearance-none"
      />
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 flex items-center rounded-full",
          "bg-[#858585] py-[2px] pr-[24px] pl-[2px]",
          "transition-[padding,background-color] duration-150",
          "peer-hover:bg-[#757575] peer-hover:pl-[4px]",
          "peer-checked:justify-end peer-checked:bg-[#0f865d] peer-checked:pr-[2px] peer-checked:pl-[24px]",
          "peer-checked:peer-hover:bg-[#0d7652] peer-checked:peer-hover:pl-[24px] peer-checked:peer-hover:pr-[4px]",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black",
        ].join(" ")}
      >
        <span className="relative size-[24px] shrink-0 rounded-full bg-white">
          {checked && (
            <img
              src="/icons/toggle-check.svg"
              alt=""
              className="-translate-y-1/2 absolute top-1/2 right-[4px] size-[16px]"
            />
          )}
        </span>
      </span>
    </span>
  );
}
