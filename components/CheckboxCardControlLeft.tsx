"use client";

import { useId, type ReactNode } from "react";
import { Icon } from "./Icon";
import { CheckboxVisual } from "./Checkbox";

type CheckboxCardControlLeftProps = {
  title: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Wordt getoond als "+ € {price}" — geen placeholder-cijfers ("--,--") gebruikt, dus vereist een echte waarde van de consument. */
  price?: string;
  /**
   * Bevestigde `slot`/`swapMe`-property in Figma — de "Swap me"-roze kader
   * is Figma's eigen dev-placeholdermarkering (net als FunnelBox's "swap
   * this"), dus hier een echte lege slot i.p.v. die placeholder na te bouwen.
   */
  actionSlot?: ReactNode;
  showMoreInfoButton?: boolean;
  onMoreInfoClick?: () => void;
  showInfo?: boolean;
  onInfoClick?: () => void;
  compact?: boolean;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Checkbox Card Control Left" (state=default/hover/
 * active × compact × description × popover button × viewport). De
 * responsieve verplaatsing van het prijsblok (naast de titel op ≥600px,
 * eronder met een divider op <600px) is bewust niet gerepliceerd — te veel
 * extra DOM-complexiteit voor een secundair, optioneel onderdeel. Prijs
 * blijft hier altijd naast de titel staan, net als op desktop. Expliciet
 * gemeld, geen stille afwijking.
 */
export function CheckboxCardControlLeft({
  title,
  description,
  checked = false,
  onChange,
  price,
  actionSlot,
  showMoreInfoButton = false,
  onMoreInfoClick,
  showInfo = false,
  onInfoClick,
  compact = false,
  name,
  value,
  id,
  className,
}: CheckboxCardControlLeftProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const titleAndActionRow = (
    <div className={["flex w-full gap-6", description ? "items-start" : "items-center"].join(" ")}>
      <div className="flex flex-1 flex-col items-start justify-center gap-2 min-w-px">
        <p
          className={["w-full font-bold text-black", compact ? "text-lg leading-[1.5]" : "text-xl leading-[1.4]"].join(" ")}
          style={{ fontFamily: "var(--font-avenir-bold)" }}
        >
          {title}
        </p>
        {description && (
          <p className="w-full font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        )}
      </div>
      {(actionSlot || price) && (
        <div className={["flex shrink-0 items-center justify-end gap-2", description ? "items-start" : "h-[49px] items-center"].join(" ")}>
          {actionSlot}
          {price && (
            <div className="flex shrink-0 flex-col items-end">
              <p
                className="mb-[-1px] w-full text-right font-bold text-black text-xl leading-[1.4]"
                style={{ fontFamily: "var(--font-memphis-bold)" }}
              >
                + € {price}
              </p>
              <p className="w-full text-right font-[350] text-[#565656] text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                per maand
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const content = (
    <div className={["flex flex-1 flex-col items-start justify-center gap-4 min-w-px", compact ? "gap-3 px-4 py-3" : "px-4 py-6"].join(" ")}>
      {titleAndActionRow}
      {showMoreInfoButton && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onMoreInfoClick?.();
          }}
          className="flex w-full items-center gap-2 rounded-[3px]"
        >
          <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            Meer informatie
          </span>
        </button>
      )}
    </div>
  );

  return (
    <label
      htmlFor={inputId}
      className={
        className ??
        [
          "flex w-full cursor-pointer items-start overflow-hidden rounded-[3px] border",
          checked ? "border-[#eda50f] drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]" : "border-[#ccc]",
        ].join(" ")
      }
    >
      <div
        className={[
          "flex shrink-0 items-center justify-center self-stretch border-r p-2",
          checked ? "border-[#eda50f] bg-[#fff8e3]" : "border-[#ccc] bg-[#f6f6f7]",
        ].join(" ")}
      >
        <span className="relative inline-flex size-5 shrink-0">
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
      </div>

      {showInfo ? (
        <div className="flex flex-1 items-start gap-2 py-2 pr-2 pl-4 min-w-px">
          {content}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onInfoClick?.();
            }}
            className="flex size-6 shrink-0 items-center justify-center rounded-[3px] p-3"
          >
            <Icon name="popover-info" size="sm" alt="Meer informatie" />
          </button>
        </div>
      ) : (
        content
      )}
    </label>
  );
}

export type CheckboxCardOption = {
  value: string;
  title: string;
  description?: string;
  price?: string;
};

type CheckboxCardControlLeftGroupProps = {
  labelText?: string;
  description?: string;
  options: CheckboxCardOption[];
  values: string[];
  onChange?: (values: string[]) => void;
  /** Toont "Meer informatie" op elke kaart (bevestigd: Figma's `button`-property op "Checkbox Card Control Left", bv. de "Glas"-kaart in de mutatie-funnel). Zonder handler geen link — was tot nu toe niet doorgegeven vanuit de Group-variant. */
  onMoreInfoClick?: (value: string) => void;
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Checkbox Card Control Left Group" — optioneel
 * Label+Description-blok boven een verticaal gestapelde lijst kaarten
 * (gap-2, 8px). `options`/`values` generaliseert Figma's checkboxCard2..6-
 * booleans, zelfde precedent als overal in deze bibliotheek.
 */
export function CheckboxCardControlLeftGroup({
  labelText,
  description,
  options,
  values,
  onChange,
  onMoreInfoClick,
  name,
  className,
}: CheckboxCardControlLeftGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  function toggle(optionValue: string, checked: boolean) {
    if (!onChange) return;
    onChange(checked ? [...values, optionValue] : values.filter((v) => v !== optionValue));
  }

  return (
    <div className={className ?? "flex w-full flex-col items-start gap-2"}>
      {labelText && (
        <div className="flex flex-col items-start justify-center gap-1">
          <p className="font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {labelText}
          </p>
          {description && (
            <p className="font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className="flex w-full flex-col items-start gap-2">
        {options.map((option) => (
          <CheckboxCardControlLeft
            key={option.value}
            title={option.title}
            description={option.description}
            price={option.price}
            name={groupName}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={(checked) => toggle(option.value, checked)}
            showMoreInfoButton={Boolean(onMoreInfoClick)}
            onMoreInfoClick={() => onMoreInfoClick?.(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
