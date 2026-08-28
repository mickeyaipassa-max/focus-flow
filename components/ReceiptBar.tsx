type ReceiptBarProps = {
  amount: string;
  /** Vaste tekst uit Figma ("per maand") — geen aparte prop-default nodig, dit component is er specifiek voor gebouwd. */
  period?: string;
  onShowDetails: () => void;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Receipt Bar" (node 8818:509/510/520, "Components"-
 * bibliotheek) — bevestigd via aparte fetches van de 600-1448px- en
 * 320-599px-varianten. Eén responsieve component i.p.v. twee losse, zelfde
 * precedent als Header/CardDetails/Dialog: alleen padding en de
 * "per maand"-typografie verschillen tussen de breekpunten (16px medium
 * desktop, 14px book mobiel), de rest is identiek.
 *
 * Bevestigd, niet voor de hand liggend: de balk is groen (`color/green-100`)
 * gevuld, niet wit — dat zag er in een eerdere losse Storybook-verkenning
 * uit als "gewoon de paginakleur die doorschijnt", maar de Figma-bron zelf
 * toont een echte groene achtergrond binnen een wit gepolsterd kaartje met
 * een zware schaduw (Shadow/LG). Volgens Figma's eigen componentbeschrijving
 * opent de "Bekijk details"-knop een Receipt Dialog — dus geen inline
 * uitklap-gedrag (dat was de eerdere, inmiddels achterhaalde aanname).
 *
 * Bewust NIET `position: fixed` gemaakt: Figma toont geen sticky/fixed-
 * annotatie op dit component, alleen de balk zelf — vast aan de viewport
 * plakken zou hier zelf verzonnen gedrag zijn en zou bovendien de
 * FormNavigation-knoppen en Footer eronder kunnen overlappen.
 */
export function ReceiptBar({ amount, period = "per maand", onShowDetails, className }: ReceiptBarProps) {
  return (
    <div
      className={
        className ??
        "flex w-full max-w-[480px] min-w-[304px] items-center gap-3 rounded-[3px] bg-white p-1 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.32)] min-[600px]:p-2"
      }
    >
      <div className="flex min-w-px flex-1 items-center justify-between gap-2 rounded-[3px] bg-[#eef4e3] pt-3 pr-2 pb-2 pl-3 min-[600px]:py-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="whitespace-nowrap font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {amount}
          </span>
          <span
            className="whitespace-nowrap text-black text-sm leading-[1.5] min-[600px]:text-base"
            style={{ fontFamily: "var(--font-avenir-book)" }}
          >
            {period}
          </span>
        </div>
        <button
          type="button"
          onClick={onShowDetails}
          className="shrink-0 whitespace-nowrap rounded-[3px] font-[550] text-base text-black underline decoration-solid [text-underline-position:from-font]"
          style={{ fontFamily: "var(--font-avenir-medium)" }}
        >
          Bekijk details
        </button>
      </div>
    </div>
  );
}
