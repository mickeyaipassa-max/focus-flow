"use client";

import { Icon } from "./Icon";
import { Toggle } from "./Toggle";

export type ToggleCardOption = {
  value: string;
  /** Bestandsnaam uit /public/icons/, zonder extensie — getoond op 32px binnen de 56px-cirkel. */
  icon: string;
  title: string;
  description: string;
};

type ToggleCardProps = {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onMoreInfoClick?: () => void;
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Tile" (node 18:6306, Woonverzekeringen-funnel
 * "Waarvoor wil je een premie berekenen?") — bevestigd via mcp-metadata,
 * geen screenshot: Container `gap-8 px-6 py-5`, icoon+tekst-rij `gap-4`,
 * tekststapel `gap-1`, cirkel 56px met 12px padding (`bg-[#eef4e3]`) rond
 * een 32px-icoon, rand `rounded-[6px]`.
 *
 * Rand: `rgba(0,0,0,0.12)` niet-geselecteerd, `#eda50f` geselecteerd
 * (bevestigd via mcp op de aangevinkte staat, node 1:38450) — beide zonder
 * schaduw (`effects: []` in Figma voor beide standen, anders dan bv.
 * `RadioCardBottom`'s eigen geselecteerde drop-shadow).
 *
 * Alleen de `Toggle` zelf is klikbaar, niet de hele kaart — dat is exact
 * wat Figma's eigen gegenereerde referentiecode (Figma Make-export) laat
 * zien (`<button>` zit alleen om de toggle, niet om de tegel). Bewust niet
 * verruimd tot een hele-kaart-klikgebied zoals bij andere kaarten in deze
 * bibliotheek — dat zou hier zelf gedrag verzinnen dat Figma niet toont.
 *
 * Icoon "1036-woonhuisverzekering": rechtstreeks als SVG geëxporteerd via
 * de Figma plugin-API (`node.exportAsync`, geen `get_screenshot`) en
 * vergeleken met de bestaande bibliotheek — bleek geometrisch identiek aan
 * het al aanwezige `pictogram-house.svg`, dus hergebruikt i.p.v. een
 * nieuw bestand toegevoegd. Alle 5 producttegels in Figma gebruiken op dit
 * moment letterlijk datzelfde icoon-component, ook waar dat inhoudelijk
 * niet past (bv. Aansprakelijkheids-/Rechtsbijstandverzekering) — dat is
 * een contentgat in Figma zelf, hier bewust niet zelf gecorrigeerd.
 */
export function ToggleCard({ icon, title, description, checked, onChange, onMoreInfoClick, name, id, className }: ToggleCardProps) {
  return (
    <div
      className={
        className ??
        [
          "flex w-full items-center gap-8 rounded-[6px] border bg-white px-6 py-5",
          checked ? "border-[#eda50f]" : "border-[rgba(0,0,0,0.12)]",
        ].join(" ")
      }
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#eef4e3] p-3">
          <Icon name={icon} size="lg" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <p className="w-full font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {title}
          </p>
          <p className="w-full font-[350] text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onMoreInfoClick?.();
            }}
            className="rounded-[3px]"
          >
            <span className="whitespace-nowrap font-[550] text-base text-black leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
              Meer informatie
            </span>
          </button>
        </div>
      </div>

      <Toggle checked={checked} onChange={onChange} name={name} id={id} aria-label={title} />
    </div>
  );
}

type ToggleCardGroupProps = {
  options: ToggleCardOption[];
  values: string[];
  onChange?: (values: string[]) => void;
  onMoreInfoClick?: (value: string) => void;
  /** Zelfde validatiefout-patroon als `RadioCardBottomGroup`'s eigen `error` — geen aparte Figma-foutstaat bevestigd voor deze tegellijst, dus hergebruikt de al bevestigde generieke stijl i.p.v. iets nieuws te verzinnen. */
  error?: string;
  name?: string;
  className?: string;
};

/**
 * Verticale lijst `ToggleCard`s, `gap-4` (16px) — bevestigd via mcp-metadata
 * op "Frame 2609884" (node 1:25833): 5 tegels van elk 124px hoog, 16px
 * ertussen.
 */
export function ToggleCardGroup({ options, values, onChange, onMoreInfoClick, error, name, className }: ToggleCardGroupProps) {
  function toggle(optionValue: string, checked: boolean) {
    if (!onChange) return;
    onChange(checked ? [...values, optionValue] : values.filter((v) => v !== optionValue));
  }

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className={className ?? "flex w-full flex-col items-start gap-4"}>
        {options.map((option) => (
          <ToggleCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            checked={values.includes(option.value)}
            onChange={(checked) => toggle(option.value, checked)}
            onMoreInfoClick={() => onMoreInfoClick?.(option.value)}
            name={name}
          />
        ))}
      </div>

      {error && (
        <div role="alert" className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
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
