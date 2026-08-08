"use client";

type SpinnerSize = "sm" | "md" | "lg";

const sizeClass: Record<SpinnerSize, string> = {
  sm: "size-4", // 16px, Figma "SM | 16px"
  md: "size-6", // 24px, Figma "MD | 24px"
  lg: "size-8", // 32px, Figma "LG | 32px"
};

const labelSizeClass: Record<SpinnerSize, string> = {
  sm: "text-xs",
  md: "text-base",
  lg: "text-base",
};

type SpinnerProps = {
  size?: SpinnerSize;
  /** Figma's eigen "Loading..." is placeholder-demotekst — geen default, elke afnemer geeft zijn eigen tekst mee (of laat de prop weg voor een icoon-only spinner). */
  label?: string;
  /** Alleen relevant wanneer `label` is meegegeven. */
  labelPosition?: "vertical" | "horizontal";
  className?: string;
};

/**
 * Gebaseerd op Figma's "Spinner" (node 1497:756, size=SM|MD|LG × text
 * vertical/horizontal). Uit de Figma-documentatie: "A spinner is an
 * indeterminate loading indicator, meaning it's best for cases where the
 * progress or duration of a process is variable or unknown."
 *
 * De twee streepvormen ("Vector 3"/"Vector 4 (Stroke)") zijn bewust NIET via
 * de generieke <Icon>-component gerenderd: Icon.tsx rendert elk icoon op
 * zijn eigen intrinsieke SVG-grootte (zie Icon.tsx's eigen toelichting) en
 * is dus niet geschikt voor een glyph die responsief op 3 verschillende
 * maten moet renderen. De paden staan hier daarom inline als SVG en schalen
 * via viewBox mee met de gekozen size — bij nameten bleken Figma's 3
 * maatvarianten exact proportioneel geschaalde kopieën van dezelfde vorm, dus
 * één pad per streep volstaat voor alle 3 de maten.
 *
 * De rotatie zelf staat niet als losse property in Figma (de 3
 * "Orientaton=0/90/180"-varianten in de losse "Spinner Animation"-frame zijn
 * animatie-referentiestills, geen bruikbare component-props) — hier vertaald
 * naar Tailwind's `animate-spin` op de buitenste wrapper, de standaardmanier
 * voor een doorlopend draaiende loading-indicator.
 */
export function Spinner({ size = "sm", label, labelPosition = "vertical", className }: SpinnerProps) {
  const glyph = (
    <div className={["relative shrink-0 animate-spin", sizeClass[size]].join(" ")}>
      <svg
        viewBox="0 0 28 23.8995"
        preserveAspectRatio="none"
        className="absolute top-[19.06%] right-[6.25%] bottom-[6.25%] left-[6.25%]"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.1005 19.799C-1.36683 14.3317 -1.36683 5.46734 4.1005 0L5.51472 1.41421C0.828427 6.10051 0.828427 13.6985 5.51472 18.3848C10.201 23.0711 17.799 23.0711 22.4853 18.3848C27.1716 13.6985 27.1716 6.10051 22.4853 1.41421L23.8995 0C29.3668 5.46734 29.3668 14.3317 23.8995 19.799C18.4322 25.2663 9.56785 25.2663 4.1005 19.799Z"
          fill="black"
        />
      </svg>
      <svg
        viewBox="0 0 19.799 5.51472"
        preserveAspectRatio="none"
        className="absolute top-[6.25%] right-[19.06%] bottom-[76.52%] left-[19.06%]"
        fill="none"
      >
        <path
          opacity="0.2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 4.10051C5.46734 -1.36684 14.3317 -1.36683 19.799 4.10051L18.3848 5.51472C13.6985 0.828428 6.10051 0.828427 1.41421 5.51472L0 4.10051Z"
          fill="black"
        />
      </svg>
    </div>
  );

  return (
    <div
      className={
        className ??
        [
          "flex items-center",
          label ? (labelPosition === "horizontal" ? "flex-row gap-2" : "flex-col gap-2") : "",
        ].join(" ")
      }
    >
      {glyph}
      {label && (
        <p className={[labelSizeClass[size], "leading-[1.5] text-[#2a292e]"].join(" ")} style={{ fontFamily: "var(--font-avenir-book)" }}>
          {label}
        </p>
      )}
    </div>
  );
}
