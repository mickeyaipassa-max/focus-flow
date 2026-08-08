import { Icon } from "./Icon";

type AlertType = "info" | "warning" | "success" | "error" | "neutral";

type AlertProps = {
  /** Titeltekst — Figma's eigen "Alert title" is placeholder-demodata, dus geen default. */
  title: string;
  /** Beschrijvingstekst — Figma's eigen voorbeeldtekst is placeholder-demodata, dus geen default. */
  description: string;
  type?: AlertType;
  /** Toont/verbergt de titelregel, los van `description` (bevestigde losse `title`-boolean in Figma). */
  showTitle?: boolean;
  /**
   * Toont de "Go to this link"-regel (bevestigde `action`-boolean in Figma).
   * De linktekst zelf is vaste Figma-copy — geen tekst-override-property in het component, dus geen prop hiervoor.
   */
  action?: boolean;
  onActionClick?: () => void;
  /**
   * Toont de sluitknop. Bevestigd via verse mcp-analyse van alle 4 varianten: de
   * "error"-variant heeft in Figma zelf geen sluitknop-laag (geen boolean, geen
   * structuur) — dus deze rendert nooit bij type="error", ongeacht deze prop.
   */
  closable?: boolean;
  onClose?: () => void;
  className?: string;
};

/**
 * Kleuren rechtstreeks uit Figma's "color/feedback/*"-tokens (achtergrond = "-tint",
 * rand/icoon = de volle kleur). Let op de token-typo in Figma zelf: "succes" i.p.v.
 * "success" — hier genegeerd, want dit is alleen de brontokennaam, niet de API van dit component.
 *
 * "neutral" is later toegevoegd op basis van Figma's losse "Highlight"-component
 * (color=gray, pictogram=true — node 10006:11073, hergebruikt binnen Verzuim-stap 1):
 * exact hetzelfde info-boxpatroon als de overige 4 types, maar met een grijze
 * achtergrond (#f6f6f7, geverifieerd via de fill van dat Figma-component) zonder
 * zichtbare rand — vandaar `border-transparent` i.p.v. een echte randkleur.
 */
const byType: Record<AlertType, { bg: string; border: string; icon: string }> = {
  info: { bg: "bg-[#d7e9f5]", border: "border-[#0064a8]", icon: "info" },
  warning: { bg: "bg-[#fff8e3]", border: "border-[#eda50f]", icon: "warning" },
  success: { bg: "bg-[#eef4e3]", border: "border-[#0f865d]", icon: "success" },
  error: { bg: "bg-[#f8d3dd]", border: "border-[#ce0a1e]", icon: "error" },
  neutral: { bg: "bg-[#f6f6f7]", border: "border-transparent", icon: "info" },
};

/**
 * Gebaseerd op Figma's "Alert"-component (type=info|warning|success|error).
 * Anders dan FunnelBox is hier geen bewijs dat de 503px uit Figma een vaste
 * componentbreedte is (geen "slot"-aanwijzing) — het is de afmeting van het
 * demo-frame op de specificatiepagina. Consistent met alle andere componenten
 * in deze bibliotheek (Header, Footer, StepIndicator, FormNavigation) vult
 * Alert daarom de breedte van zijn ouder i.p.v. een hardcoded 503px.
 *
 * Hover/active states voor de sluitknop en de actielink zijn niet opgehaald
 * (niet bevestigd via mcp voor dít component — anders dan de Chat-knop in
 * Header, die wél een eigen bevestigde hover-state had) en daarom bewust niet
 * toegevoegd.
 */
export function Alert({
  title,
  description,
  type = "info",
  showTitle = true,
  action = false,
  onActionClick,
  closable = true,
  onClose,
  className,
}: AlertProps) {
  const { bg, border, icon } = byType[type];
  const showClose = closable && type !== "error";

  return (
    <div
      className={
        className ?? ["flex items-start gap-2 rounded-[3px] border p-2", bg, border].join(" ")
      }
    >
      <div className="flex flex-1 items-start gap-2 p-2">
        <Icon name={icon} size="md" />
        <div className="flex flex-1 flex-col items-start justify-center gap-2">
          <div className="flex w-full flex-col items-start justify-center gap-1">
            {showTitle && (
              <p
                className="w-full font-bold text-black text-lg leading-[1.5]"
                style={{ fontFamily: "var(--font-avenir-bold)" }}
              >
                {title}
              </p>
            )}
            <p
              className="w-full font-[350] text-base text-black leading-[1.5]"
              style={{ fontFamily: "var(--font-avenir-book)" }}
            >
              {description}
            </p>
          </div>
          {action && (
            <button type="button" onClick={onActionClick} className="flex items-start gap-2">
              <span className="flex items-center pt-[3px]">
                <Icon name="chevron-right" size="sm" />
              </span>
              <span
                className="whitespace-nowrap font-[350] text-[#0064a8] text-base leading-[1.5]"
                style={{ fontFamily: "var(--font-avenir-book)" }}
              >
                Go to this link
              </span>
            </button>
          )}
        </div>
      </div>
      {showClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex size-10 shrink-0 items-center justify-center gap-1 rounded-[3px] p-3"
        >
          <Icon name="close" size="md" alt="Sluiten" />
        </button>
      )}
    </div>
  );
}
