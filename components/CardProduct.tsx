/** Vinkje en kruisje zoals Figma ze in de 16px-cirkel tekent: kleine glyphs (±12/10px), vinkje groen, kruisje gray-660. */
function CheckGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13 4.5L6.5 11 3 7.5" stroke="#0F865D" strokeWidth="1.5" />
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="#565656" strokeWidth="1.5" />
    </svg>
  );
}

export type CardProductFeature = {
  text: string;
  included: boolean;
};

type CardProductProps = {
  title: string;
  /** Kleine regel onder de titel (Figma: "Meest gekozen … auto's van 10 jaar en ouder"). */
  subtitle?: string;
  features: CardProductFeature[];
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Card Product" (node 8979:9356, Autoverzekering-
 * bestand): witte kaart met 1px rand (zwart 12%) en radius 6, bovenin een
 * gecentreerde titel (24px Avenir Heavy) met kleine ondertitel (12px, gray-660),
 * daaronder een kenmerkenlijst met groen vinkje (green-100 cirkel) of grijs
 * kruisje (gray-30 cirkel) en een 1px lijn tussen de regels (niet na de
 * laatste), dan een lijn over de volle breedte en onderaan een zwarte
 * primaire knop met een tekstknop eronder.
 *
 * De kaart is bewust 320px breed (zoals in Figma) zodat hij in een
 * horizontale carrousel past; `className` kan dat overschrijven.
 *
 * Geen prijs: Figma toont er geen op deze kaart en het component verzint er
 * dus ook geen.
 */
export function CardProduct({
  title,
  subtitle,
  features,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
  className,
}: CardProductProps) {
  return (
    <div
      className={
        className ?? "flex w-[320px] shrink-0 flex-col overflow-clip rounded-md border border-[rgba(0,0,0,0.12)] bg-white"
      }
    >
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="flex w-full flex-col text-center">
          <p className="-mb-0.5 text-2xl text-black leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {title}
          </p>
          {subtitle && (
            <p className="text-[#565656] text-xs leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {subtitle}
            </p>
          )}
        </div>

        <ul className="flex w-full flex-col gap-2">
          {features.map((feature, index) => (
            <li key={feature.text} className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span
                  className={[
                    "flex shrink-0 items-center rounded-full p-1",
                    feature.included ? "bg-[#eef4e3]" : "bg-[#f6f6f7]",
                  ].join(" ")}
                >
                  {feature.included ? <CheckGlyph /> : <CrossGlyph />}
                </span>
                <span className="min-w-0 flex-1 pt-px text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  {feature.text.trim()}
                  <span className="sr-only">{feature.included ? " (inbegrepen)" : " (niet inbegrepen)"}</span>
                </span>
              </div>
              {index < features.length - 1 && (
                <div className="flex h-px items-center justify-center px-8" aria-hidden="true">
                  <div className="h-px w-full bg-[rgba(0,0,0,0.08)]" />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px w-full bg-[rgba(0,0,0,0.12)]" />

      <div className="flex flex-col gap-4 p-6">
        <button
          type="button"
          onClick={onPrimaryClick}
          className="flex w-full items-center justify-center gap-2 rounded-[3px] bg-black px-6 py-3 font-[550] text-sm text-white leading-[1.5] hover:bg-[#292929]"
          style={{ fontFamily: "var(--font-avenir-medium)" }}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={onSecondaryClick}
          className="flex w-full items-center justify-center gap-2 rounded-[3px] font-[550] text-black text-sm leading-[1.5] hover:underline"
          style={{ fontFamily: "var(--font-avenir-medium)" }}
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}
