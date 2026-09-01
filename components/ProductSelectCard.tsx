import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { Toggle } from "./Toggle";

type ProductSelectCardProps = {
  /** Figma's "Pictogram"-slot ("Select the pictogram type") — een echte slot i.p.v. een vast icoon, zelfde precedent als Receipt's `icon`. */
  icon: ReactNode;
  title: string;
  /** Figma's eigen voorbeeldinhoud ("Dekt schade aan je huis." / "Vanaf € x,- p/m") is letterlijk placeholder-tekst (de "x" is geen bedrag) — dus geen default, vrije content i.p.v. losse beschrijving/prijs-props. */
  description: ReactNode;
  selected: boolean;
  /** Optioneel, zelfde precedent als Toggle's eigen `onChange` — een Server Component (bv. app/page.tsx) kan sowieso geen event handlers doorgeven aan dit Client Component. */
  onSelectedChange?: (selected: boolean) => void;
  /** Zonder handler geen "Meer informatie"-link — bevestigd via Figma's Button-instance op deze kaart (Code Connect: type="text", iconAppend, compact), maar niet elk gebruik hoeft 'm te tonen. */
  onMoreInfoClick?: () => void;
  /**
   * Bevestigd géén vaste eigenschap van de kaart: bij hergebruik van dit
   * component in de woonverzekeringen-funnel (3 kaarten, node 1:4300) bleek
   * `iconAppend` per instance te verschillen — alleen Opstal had 'm daar
   * (`true`), Inboedel/Aansprakelijkheid niet (`false`). Default `true`
   * behoudt het bestaande, apart bevestigde gedrag van de losstaande
   * "Product select card" (node 1:5617, ProductSelectCardDemo).
   */
  showMoreInfoChevron?: boolean;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Product select card" (node 1:5617, bestand
 * "Untitled": state=Default/Selected). Hergebruikt het net gebouwde
 * `Toggle`-component (bevestigd 1-op-1 dezelfde instance, off in Default,
 * on in Selected) — geen los click-gedrag op de hele kaart, alleen de
 * Toggle bestuurt de selectie, exact zoals Figma's eigen structuur (Toggle
 * en de "Meer informatie"-knop zijn losse, onafhankelijke elementen binnen
 * de kaart, geen omliggend klikbaar kaart-element).
 *
 * De pictogram-cirkel is in Figma een losse achtergrond-SVG (vlakke
 * `#fff8e3`-cirkel) + genest icoon — hier als CSS `rounded-full bg-[#fff8e3]`
 * i.p.v. een los cirkel-bestand, zelfde aanpak als Toggle's eigen witte
 * hendel-cirkel. Het huis-pictogram zelf (voorbeeldinhoud in Figma) is een
 * vrije `icon`-slot, geen vast onderdeel van dit component.
 *
 * De "Meer informatie"-link zat niet in de eerste `get_design_context`-fetch
 * — pas zichtbaar geworden via een aparte `get_metadata`-check die een
 * extra "Button"-child blootlegde die de gegenereerde referentiecode had
 * overgeslagen. Bevestigd via Code Connect als Button `type="text"`,
 * `compact`, `iconAppend` (zie `showMoreInfoChevron`) — maar bestaande
 * `Button.tsx` heeft geen compact-formaat (vaste text-lg/24px-icoon), dus
 * hier inline opgebouwd op de bevestigde 16px/medium/underline-stijl,
 * zelfde precedent als CheckboxCardControlLeft's eigen "Meer informatie".
 *
 * Selected-staat: oranje rand (`#eda50f`, brand/asr) + Shadow/SM
 * (`0px_4px_16px_rgba(0,0,0,0.12)`) i.p.v. de standaard grijze
 * 16%-opacity-rand — letterlijk overgenomen, geen eigen invulling.
 */
export function ProductSelectCard({
  icon,
  title,
  description,
  selected,
  onSelectedChange,
  onMoreInfoClick,
  showMoreInfoChevron = true,
  className,
}: ProductSelectCardProps) {
  return (
    <div
      className={
        className ??
        [
          "relative flex w-full flex-col items-start overflow-hidden rounded-md bg-white",
          selected ? "border border-[#eda50f] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]" : "border border-[rgba(0,0,0,0.16)]",
        ].join(" ")
      }
    >
      <div className="z-[1] flex w-full items-center gap-3 px-4 py-3">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#fff8e3] p-3">{icon}</div>

        <div className="flex min-w-px flex-1 flex-col items-start">
          <p className="w-full text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            {title}
          </p>

          <div className="flex w-full flex-col items-start gap-2">
            <div className="w-full text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {description}
            </div>

            {onMoreInfoClick && (
              <button type="button" onClick={onMoreInfoClick} className="flex items-center gap-1 rounded-[3px]">
                <span className="font-[550] text-base text-black underline leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                  Meer informatie
                </span>
                {showMoreInfoChevron && <Icon name="chevron-right-sm" size="sm" />}
              </button>
            )}
          </div>
        </div>

        <Toggle checked={selected} onChange={onSelectedChange} aria-label={title} />
      </div>
    </div>
  );
}
