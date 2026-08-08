"use client";

import { useId } from "react";
import { Icon } from "./Icon";

type CheckboxVisualProps = { checked: boolean };

/**
 * De 20px vinkjes-visual, gedeeld tussen Checkbox (deze lijst-rij) en
 * CheckboxCardControlLeft (de kaartvariant) — bevestigd via mcp dat beide
 * exact dezelfde default/hover/selected-stijl gebruiken. JS-conditional
 * i.p.v. CSS `peer-checked` voor de gevulde staat: het vinkje-icoontje zit
 * genest ín de indicator-span, en `peer-checked` werkt alleen op een
 * *directe* sibling van het `.peer`-input — geneste elementen raakt het
 * niet. `peer-hover` wél via CSS, want die span IS een directe sibling.
 */
export function CheckboxVisual({ checked }: CheckboxVisualProps) {
  if (checked) {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[3px] bg-black"
      >
        <Icon name="checkbox-check" size="sm" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[3px] border border-[#565656] bg-white peer-hover:border-2 peer-hover:border-black peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black"
    />
  );
}

type CheckboxProps = {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Checkbox"-component (selected=false/true,
 * state=default/hover/selected). Echte `<input type="checkbox">`
 * (opacity-0, positioneel overlappend met de zichtbare visual — dezelfde,
 * inmiddels beproefde, aanpak als RadioGroup) voor gratis formuliersemantiek
 * en toetsenbordbediening (spatiebalk).
 */
export function Checkbox({ label, checked = false, onChange, name, value, id, className }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={className ?? "flex w-full cursor-pointer items-start gap-2"}>
      <span className="relative mt-[3px] inline-flex size-5 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={(event) => onChange?.(event.target.checked)}
          className="peer absolute inset-0 size-5 cursor-pointer appearance-none opacity-0"
        />
        <CheckboxVisual checked={checked} />
      </span>
      <span className="flex-1 font-[350] text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
        {label}
      </span>
    </label>
  );
}
