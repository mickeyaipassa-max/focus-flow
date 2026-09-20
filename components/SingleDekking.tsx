import { List } from "./List";

export type SingleDekkingProps = {
  title: string;
  description?: string;
  /** Platte bullet-lijst (Figma's "List", icon=bullet) — geen included/excluded-onderscheid zoals `RadioCardBottomGroup`'s features, hier gewoon een opsomming van wat is meeverzekerd. */
  items: string[];
  /** Getoond als "€ {price} per maand" — geen placeholder-cijfer, dus een echte waarde vereist. */
  price: string;
  priceFrom?: boolean;
  showPricePeriod?: boolean;
  /** Default "Bekijk de voorwaarden" — bevestigd via mcp dat dit hier andere tekst is dan de "Meer informatie"-link op de Basis/Allrisk-kaarten elders. */
  termsLabel?: string;
  onTermsClick?: () => void;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Radio Card Control Bottom" (node 181:7475, "Consument
 * & Wonen") op de Rechtsbijstandsverzekering-pagina — bevestigd via mcp dat
 * dit een structureel ándere kaart is dan `RadioCardBottomGroup`'s
 * Basis/Allrisk-kaarten: hier is er maar één pakket (geen groep om tussen te
 * kiezen, dus geen `<input type="radio">`-semantiek nodig), de featurelijst
 * is een platte bullet-opsomming (Figma's gedeelde `List`-component,
 * icon=bullet) i.p.v. de check/cross-featurelijst, en de link heet "Bekijk de
 * voorwaarden" i.p.v. "Meer informatie". Het tweede "Radio Card Control
 * Bottom"-instance in dezelfde Figma-node staat op `hidden` — geen tweede
 * pakket getoond, dus hier bewust als één vast (altijd "geselecteerd" ogend)
 * kaartje gebouwd i.p.v. een keuzegroep te verzinnen die niet bevestigd is.
 *
 * Radio-indicator onderaan is puur decoratief (`aria-hidden`, geen echte
 * `<input>`) — er is niets om tussen te kiezen, dus geen formuliersemantiek
 * ervoor nodig, alleen de visuele "geselecteerd"-stijl uit Figma (gele rand +
 * gevulde zwarte stip) exact overgenomen.
 */
export function SingleDekking({
  title,
  description,
  items,
  price,
  priceFrom,
  showPricePeriod = true,
  termsLabel = "Bekijk de voorwaarden",
  onTermsClick,
  className,
}: SingleDekkingProps) {
  return (
    <div className={className ?? "flex w-full flex-col items-start rounded-[3px] drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"}>
      <div className="flex w-full flex-col items-center gap-4 rounded-t-[3px] border-t border-r border-l border-[#eda50f] bg-white px-6 pt-6 pb-4">
        <div className="flex w-full flex-col items-start text-left">
          <p className="w-full font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {title}
          </p>
          {description && (
            <p className="w-full font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {description}
            </p>
          )}
        </div>

        <List icon="bullet" items={items.map((text) => ({ text }))} />

        <div className="flex w-full flex-col items-center border-t border-[#e5e5e5] pt-4 text-center">
          {priceFrom && (
            <p className="w-full font-[350] text-[#565656] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              vanaf
            </p>
          )}
          <p className="w-full text-2xl text-black leading-[1.3]" style={{ fontFamily: "var(--font-memphis-bold)" }}>
            € {price}
          </p>
          {showPricePeriod && (
            <p className="w-full font-[350] text-[#565656] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              per maand
            </p>
          )}
        </div>

        <button type="button" onClick={onTermsClick} className="flex w-full items-center justify-center gap-2 rounded-[3px]">
          <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            {termsLabel}
          </span>
        </button>
      </div>

      <div className="flex w-full items-center justify-center rounded-b-[3px] border border-[#eda50f] bg-[#fff8e3] px-6 py-2">
        <span aria-hidden="true" className="relative inline-flex size-5 shrink-0">
          <span className="pointer-events-none absolute inset-0 rounded-full border-[6px] border-black bg-white" />
        </span>
      </div>
    </div>
  );
}
