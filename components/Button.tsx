import type { ReactNode } from "react";
import { Icon } from "./Icon";

type ButtonType = "primary" | "secondary" | "tertiary" | "text" | "brand";

type ButtonProps = {
  children: ReactNode;
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
 * "compact" en "icon-only" zijn bewust niet gebouwd: geen van de bestaande
 * componenten in dit project gebruikt ze.
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
  className,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] text-lg font-[550] leading-[1.5]";

  const byType: Record<ButtonType, string> = {
    primary:
      "bg-black px-6 py-3 text-white " +
      "hover:border hover:border-black hover:bg-[#292929] " +
      "active:bg-[#292929]",
    secondary:
      "border border-[#565656] px-6 py-3 text-black " +
      "hover:border-black hover:bg-[rgba(0,0,0,0.08)] " +
      "active:border-black active:bg-[rgba(0,0,0,0.08)]",
    // Hover/active van "tertiary" zijn niet opgehaald (geen bestaand component
    // gebruikt dit type) — alleen de bevestigde default-state hier.
    tertiary: "px-4 py-3 text-black underline",
    text: "px-0 py-0 text-black underline hover:no-underline active:no-underline",
    brand:
      "border-b-2 border-[rgba(0,0,0,0.08)] bg-[#eda50f] px-6 py-3 text-black " +
      "hover:border hover:border-b hover:border-[#f0b335] hover:bg-[#f0b335] " +
      "active:border-0 active:bg-[#f0b335]",
  };

  return (
    <button
      type={htmlType}
      onClick={onClick}
      className={
        className ??
        [
          base,
          byType[type],
          fullWidth === true ? "w-full" : fullWidth === "mobile" ? "w-full min-[600px]:w-auto" : "",
        ].join(" ")
      }
      style={{ fontFamily: "var(--font-avenir-medium)", order }}
    >
      {iconPrepend && <Icon name={iconPrepend} size="md" />}
      {children}
      {iconAppend && <Icon name={iconAppend} size="md" />}
    </button>
  );
}
