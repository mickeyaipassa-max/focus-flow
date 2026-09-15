"use client";

import { useId, type ReactNode } from "react";
import { Icon } from "./Icon";
import { CheckboxVisual } from "./Checkbox";
import { Tag } from "./Tag";

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
  /**
   * Voorkomt aanvinken en dimt de checkbox — bevestigd op de
   * Reisverzekering-funnel "Jouw dekking"-stap (node 2416:2956): "Extra
   * sportuitrusting" is daar niet aan te vinken zolang "Bagage" niet is
   * gekozen. Los van `checked`/`onChange`, want een uitgeschakelde optie kan
   * ook (nog) niet aangevinkt zijn.
   */
  disabled?: boolean;
  /**
   * Toont een groene "Inbegrepen"-pil i.p.v. checkbox+prijs, en het hele
   * kaartje wordt dan niet-interactief (geen `<label>`/checkbox) — bevestigd
   * op de Reisverzekering-funnel "Jouw dekking"-stap bij Optimaal: "Bagage"
   * en "Geld" horen daar al standaard bij de gekozen basisdekking, dus niet
   * meer los aan te vinken. Overschrijft `checked`/`price`/`actionSlot`.
   */
  included?: boolean;
  /** Verbergt "per maand" onder de prijs — zelfde reden/precedent als `RadioCardBottomOption.showPricePeriod`. Default `true`. */
  showPricePeriod?: boolean;
  /**
   * Centreert het prijs-/tag-/actionSlot-blok verticaal t.o.v. de volledige
   * kaarthoogte, ook wanneer er een `description` is (die anders naar
   * `items-start` schakelt) — bevestigd op de Reisverzekering-funnel "Jouw
   * dekking"-stap (nodes 2416:3155 en 2416:3520): de "Inbegrepen"-pil en de
   * prijs/info-box staan daar verticaal gecentreerd t.o.v. de hele kaart
   * (incl. de "Meer informatie"-regel eronder), niet uitgelijnd met de titel.
   * Default `false`: geen Figma-bevestiging hiervan voor de andere bestaande
   * aanroepen van dit component (mutatie-funnel, Auto-funnel), dus daar blijft
   * het bestaande `items-start`-gedrag ongewijzigd.
   */
  centerActionSlot?: boolean;
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
  disabled = false,
  included = false,
  showPricePeriod = true,
  centerActionSlot = false,
  name,
  value,
  id,
  className,
}: CheckboxCardControlLeftProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const alignTop = description && !centerActionSlot;

  const meerInfoButton = showMoreInfoButton && (
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
  );

  const titleAndActionRow = (
    <div className={["flex w-full gap-6", alignTop ? "items-start" : "items-center"].join(" ")}>
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
        {/*
          Bij `centerActionSlot` verhuist "Meer informatie" mee in deze
          linkerkolom (i.p.v. als losse rij onder `titleAndActionRow`) zodat
          de rij se eigen `items-center` het prijs-/tag-blok verticaal
          centreert t.o.v. de VOLLEDIGE kaarthoogte (titel+beschrijving+
          "Meer informatie"), niet alleen t.o.v. titel+beschrijving —
          bevestigd via mcp (node 2416:3155): de info-box/prijs staat daar
          gecentreerd tussen de titel-top en de "Meer informatie"-regel.
        */}
        {centerActionSlot && meerInfoButton}
      </div>
      {(actionSlot || price || included) && (
        <div
          className={[
            /**
             * `gap-6` (24px) i.p.v. `gap-2` tussen `actionSlot` (bv. de
             * blauwe info-alert) en de prijs — bevestigd via mcp-metadata op
             * node 2416:3155 ("Frame 627", `itemSpacing: 24`): dezelfde 24px
             * die ook tussen de titel-kolom en `actionSlot` wordt gebruikt
             * (het `gap-6` op de rij hierboven), niet de kleinere 8px.
             */
            "flex shrink-0 items-center justify-end gap-6",
            alignTop ? "items-start" : description ? "items-center" : "h-[49px] items-center",
          ].join(" ")}
        >
          {included ? (
            <Tag text="Inbegrepen" color="green" />
          ) : (
            <>
              {actionSlot}
              {price && (
                <div className="flex shrink-0 flex-col items-end">
                  <p
                    className="mb-[-1px] w-full text-right font-bold text-black text-xl leading-[1.4]"
                    style={{ fontFamily: "var(--font-memphis-bold)" }}
                  >
                    + € {price}
                  </p>
                  {showPricePeriod && (
                    <p className="w-full text-right font-[350] text-[#565656] text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                      per maand
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );

  const content = (
    <div className={["flex flex-1 flex-col items-start justify-center gap-4 min-w-px", compact ? "gap-3 px-4 py-3" : "px-4 py-6"].join(" ")}>
      {titleAndActionRow}
      {!centerActionSlot && meerInfoButton}
    </div>
  );

  if (included || disabled) {
    /**
     * Geen `<label>`/interactieve checkbox, maar de GRIJZE KOLOM zelf blijft
     * wél staan (leeg, zonder input/vinkje) — bevestigd door bij mcp in te
     * zoomen op zowel het "Inbegrepen"-geval (node 2416:3520) als het
     * uitgeschakelde geval (node 2416:3155): in beide gevallen staat er een
     * volledig lege, grijze kolom over de hele kaarthoogte, met dezelfde
     * breedte/rand als een normale checkbox-kolom — alleen het witte
     * vinkje-vakje zelf ontbreekt. Eerdere aanname dat de hele kolom weg zou
     * moeten, was fout (te snel naar een verkleind screenshot gekeken).
     */
    return (
      <div className={className ?? "flex w-full items-start overflow-hidden rounded-[3px] border border-[#ccc]"}>
        <div className="flex shrink-0 items-center justify-center self-stretch border-r border-[#ccc] bg-[#f6f6f7] p-2">
          <span className="relative inline-flex size-5 shrink-0" />
        </div>
        {content}
      </div>
    );
  }

  return (
    <label
      htmlFor={inputId}
      className={
        className ??
        [
          "flex w-full items-start overflow-hidden rounded-[3px] border",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
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
            disabled={disabled}
            onChange={(event) => onChange?.(event.target.checked)}
            className="peer absolute inset-0 size-5 cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
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
  /**
   * Zet deze optie op disabled en toont dit bericht i.p.v. een klikbare
   * checkbox — bevestigd op de Reisverzekering-funnel "Jouw dekking"-stap:
   * "Extra sportuitrusting" toont daar "Kan alleen worden meeverzekerd als
   * dekking Bagage is afgesloten" zolang "Bagage" niet is aangevinkt. De
   * afnemer berekent zelf wanneer dit van toepassing is (afhankelijkheid
   * tussen opties is pagina-specifieke logica, geen generieke componentregel).
   */
  disabledMessage?: string;
  /** Zelfde patroon als `CheckboxCardControlLeft`'s eigen `included` — toont de "Inbegrepen"-pil i.p.v. checkbox+prijs voor deze optie. */
  included?: boolean;
  /** Zelfde patroon als `CheckboxCardControlLeft`'s eigen `showPricePeriod`. Default `true`. */
  showPricePeriod?: boolean;
  /** Zelfde patroon als `CheckboxCardControlLeft`'s eigen `centerActionSlot`. Default `false`. */
  centerActionSlot?: boolean;
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
            disabled={Boolean(option.disabledMessage)}
            included={option.included}
            showPricePeriod={option.showPricePeriod ?? true}
            centerActionSlot={option.centerActionSlot}
            actionSlot={
              option.disabledMessage && (
                // Zelfde kleurtokens als Alert's type="info" (bg-[#d7e9f5]/border-[#0064a8]/icon="info")
                // — geverifieerd via mcp dat dit letterlijk een Alert-instance is in Figma. Niet de
                // volledige `Alert` hergebruikt: die is groter opgezet (p-2+p-2, md-icoon, text-base)
                // dan dit compacte inline blokje (sm-icoon, text-sm, geen titel/actie/sluitknop).
                <div className="flex max-w-[280px] items-start gap-2 rounded-[3px] border border-[#0064a8] bg-[#d7e9f5] px-2 py-1">
                  <span className="flex shrink-0 items-center pt-[3px]">
                    <Icon name="info-sm" size="sm" />
                  </span>
                  <span className="flex items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
                    {option.disabledMessage}
                  </span>
                </div>
              )
            }
            showMoreInfoButton={Boolean(onMoreInfoClick)}
            onMoreInfoClick={() => onMoreInfoClick?.(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
