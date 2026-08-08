type IconSize = "sm" | "md" | "lg";

const sizeClass: Record<IconSize, string> = {
  sm: "size-4", // 16px kader
  md: "size-6", // 24px kader
  lg: "size-8", // 32px kader
};

type IconProps = {
  /** Welk icoon-bestand uit /public/icons/ getoond wordt, bv. "chevron-down". */
  name: string;
  /** SM/MD/LG uit Figma = 16/24/32px kader. */
  size?: IconSize;
  alt?: string;
  className?: string;
};

/**
 * Generieke maat-wrapper voor icoon-glyphs, gebaseerd op Figma's "Icon"-component
 * (size=SM|MD|LG, 16/24/32px).
 *
 * Belangrijk, exact nagerekend uit Figma's eigen inset-percentages: de SM/MD/LG-
 * maat is het *kader* (klik-/spacing-vak), niet de grootte van de glyph zelf.
 * Figma plaatst elk icoon op zijn eigen natuurlijke, ongeschaalde pixelgrootte
 * middenin dat kader (bv. de pijl-iconen zijn zelf altijd 16px, ook binnen een
 * 24px-kader). Daarom rendert de <img> hier op zijn intrinsieke SVG-grootte
 * (geen width/height forcering) en centreert de buitenste span alleen — zo
 * wordt een icoon nooit opgeschaald tot het kader, exact zoals in Figma.
 *
 * Micro-detail bewust niet gerepliceerd: Figma's inset is bij richting-iconen
 * (bv. arrow-left vs. arrow-right) een paar tiende pixels asymmetrisch
 * (optisch gebalanceerd naar de wijsrichting). Simpele centrering hier is
 * symmetrisch — een verschil van ~1px dat een aparte inset-tabel per icoon
 * zou vergen voor een nauwelijks zichtbaar effect.
 *
 * Figma's "color"-property is bewust niet overgenomen: elk icoon dat ik tot
 * nu toe gedownload heb heeft een vaste, ingebakken fill-kleur in de SVG
 * zelf — geen enkele gebruikt CSS currentColor.
 */
export function Icon({ name, size = "md", alt = "", className }: IconProps) {
  return (
    <span className={className ?? [sizeClass[size], "inline-flex shrink-0 items-center justify-center"].join(" ")}>
      <img src={`/icons/${name}.svg`} alt={alt} />
    </span>
  );
}
