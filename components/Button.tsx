import type { ReactNode } from "react";
import { Icon } from "./Icon";

type ButtonType = "primary" | "secondary" | "tertiary" | "text" | "brand";

type ButtonProps = {
  children?: ReactNode;
  type?: ButtonType;
  /** Icoonnaam uit /public/icons/, vóór de tekst. */
  iconPrepend?: string;
  /** Icoonnaam uit /public/icons/, ná de tekst. */
  iconAppend?: string;
  htmlType?: "button" | "submit";
  onClick?: () => void;
  /**
   * Laat de knop de volle breedte van zijn ouder vullen (bv. in FormNavigation's
   * stacked-modus). `"mobile"` = volle breedte tot 600px, daarna automatische
   * breedte — voor FormNavigation's responsieve auto-stack op smalle schermen,
   * i.t.t. `true` dat altijd volle breedte blijft (de bewuste, altijd-gestapelde
   * variant).
   */
  fullWidth?: boolean | "mobile";
  /** Extra CSS-order, voor layout-herschikking (bv. FormNavigation's stacked-volgorde). */
  order?: number;
  /** Compacte variant: 8px/16px padding en 16px tekst (secondary gemeten in Figma: 40px hoog inclusief de rand, dus 7px + 1px rand). Alleen voor types met de gewone 12px/24px padding (primary, secondary, brand). */
  compact?: boolean;
  /** Staat tekstomloop toe i.p.v. de standaard `nowrap` — nodig voor knoppen met langere tekst die anders buiten hun vaste-breedte ouder uitsteken (bv. Card's CTA's). */
  wrap?: boolean;
  /** Alleen een icoon (via `iconPrepend`), geen tekst: vierkant, 40×40 bij `compact` (24px icoon + 8px padding). Geef dan altijd een `ariaLabel` mee. */
  iconOnly?: boolean;
  /** Toegankelijke naam — verplicht bij `iconOnly`, waar geen zichtbare tekst is. */
  ariaLabel?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Button"-component (type=primary|secondary|tertiary|text|brand,
 * state=default|hover|active). De hover/active-kleuren die Figma als een dubbele
 * "gradient" van twee identieke kleurstops exporteert, zijn hier herleid tot hun
 * exacte samengestelde vlakke kleur (bv. wit 16%-overlay op zwart = #292929) —
 * visueel identiek, maar als simpele achtergrondkleur i.p.v. een overbodige
 * CSS-gradient met twee gelijke stops.
 *
 * Interactie-states zijn hier native CSS :hover/:active i.p.v. React-state:
 * Figma's varianten beschrijven hetzelfde gedrag dat de browser al gratis geeft.
 *
 * "compact" is alleen gebouwd voor padding/tekstmaat (zie prop); "icon-only"
 * is bewust niet gebouwd: geen van de bestaande componenten gebruikt het.
 */
export function Button({
  children,
  type = "primary",
  iconPrepend,
  iconAppend,
  htmlType = "button",
  onClick,
  fullWidth = false,
  order,
  wrap = false,
  compact = false,
  iconOnly = false,
  ariaLabel,
  className,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[3px] font-[550] leading-[1.5] " +
    (compact ? "text-base " : "text-lg ") +
    (wrap ? "text-center whitespace-normal" : "whitespace-nowrap");

  const byType: Record<ButtonType, string> = {
    primary:
      "bg-black px-6 py-3 text-white " +
      "hover:border hover:border-black hover:bg-[#292929] " +
      "active:bg-[#292929]",
    secondary:
      // 23px/11px i.p.v. 24px/12px: Figma's rand ligt binnen het kader (51px hoog), de CSS-rand van 1px erbuiten.
      "border border-[#565656] px-[23px] py-[11px] text-black " +
      "hover:border-black hover:bg-[rgba(0,0,0,0.08)] " +
      "active:border-black active:bg-[rgba(0,0,0,0.08)]",
    // Hover (zwart 8% vlak + 1px rand van 8%) en active (zwart 8% vlak, geen rand)
    // uit Figma's tertiary-varianten. De hover-rand is een inset-schaduw i.p.v.
    // een echte border, zodat de knop niet 2px groter wordt.
    tertiary:
      "px-4 py-3 text-black underline " +
      "hover:bg-[rgba(0,0,0,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] " +
      "active:bg-[rgba(0,0,0,0.08)] active:shadow-none",
    text: "px-0 py-0 text-black underline hover:no-underline active:no-underline",
    brand:
      // pb-2.5 i.p.v. pb-3: Figma's onderrand van 2px ligt binnen het kader (51px hoog), de CSS-rand erbuiten.
      "border-b-2 border-[rgba(0,0,0,0.08)] bg-[#eda50f] px-6 pt-3 pb-2.5 text-black " +
      "hover:border hover:border-b hover:border-[#f0b335] hover:bg-[#f0b335] " +
      "active:border-0 active:bg-[#f0b335]",
  };

  const regularPadding = type === "secondary" ? "px-[23px] py-[11px]" : type === "brand" ? "px-6 pt-3 pb-2.5" : "px-6 py-3";
  const compactPadding = type === "secondary" ? "px-[15px] py-[7px]" : "px-4 py-2";
  let classes = compact ? byType[type].replace(regularPadding, compactPadding) : byType[type];
  // Icon-only: vierkant, geen tekstonderstreping. Compact = 40×40 (Figma "icon-only=true, compact=true").
  if (iconOnly) classes = classes.replace(/px-\d+ py-\[?\d+\]?/, compact ? "size-10 p-2" : "size-[51px] p-[13.5px]").replace(" underline", "");

  return (
    <button
      type={htmlType}
      onClick={onClick}
      aria-label={ariaLabel}
      className={
        className ??
        [
          base,
          classes,
          fullWidth === true ? "w-full" : fullWidth === "mobile" ? "w-full min-[600px]:w-auto" : "",
        ].join(" ")
      }
      style={{ fontFamily: "var(--font-avenir-medium)", order }}
    >
      {iconPrepend && <Icon name={iconPrepend} size="md" />}
      {!iconOnly && children}
      {iconAppend && <Icon name={iconAppend} size="md" />}
    </button>
  );
}
