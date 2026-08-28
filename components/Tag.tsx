import { Icon } from "./Icon";

type TagColor =
  | "neutral"
  | "yellow"
  | "green"
  | "pink"
  | "blue"
  | "blur"
  | "red"
  | "brand"
  | "succes"
  | "error"
  | "warning"
  | "info";

type TagProps = {
  text: string;
  color?: TagColor;
  compact?: boolean;
  /**
   * Toont een icoon vóór de tekst. Bij color=succes/error/warning/info toont
   * Figma altijd het bijpassende statusicoon — er bestaat geen icon=false-variant
   * voor die 4 kleuren — dus deze prop wordt daar genegeerd.
   */
  icon?: boolean;
  /**
   * Icoonnaam uit /public/icons/, alleen relevant bij icon=true op een
   * niet-statuskleur. Figma toont daar een leeg "swap this"-icoonslot (geen
   * vaste glyph) — de daadwerkelijke icoon is dus aanroeper-gebonden, zelfde
   * patroon als Button's iconPrepend/iconAppend.
   */
  iconName?: string;
  /** Toont een sluitkruisje i.p.v. tekst-only. In Figma alleen bevestigd voor color=neutral. */
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
};

const bgByColor: Record<TagColor, string> = {
  neutral: "bg-[rgba(0,0,0,0.08)]",
  yellow: "bg-[#fff8e3]",
  green: "bg-[#eef4e3]",
  pink: "bg-[#ffdaea]",
  blue: "bg-[#d7e9f5]",
  red: "bg-[#f8d3dd]",
  brand: "bg-[#eda50f]",
  blur: "backdrop-blur-[2px] bg-[rgba(255,255,255,0.88)]",
  succes: "bg-[#eef4e3]",
  error: "bg-[#f8d3dd]",
  warning: "bg-[#fff8e3]",
  info: "bg-[#d7e9f5]",
};

/**
 * Vaste icoon-koppeling voor de 4 statuskleuren (bevestigd via mcp: voor
 * succes/error/warning/info bestaat geen icon=false-variant in Figma — het
 * icoon hoort onlosmakelijk bij de kleur, dus geen `iconName`-override nodig
 * of mogelijk voor deze 4).
 */
const statusIcon: Partial<Record<TagColor, string>> = {
  succes: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

/**
 * Gebaseerd op Figma's "Tag"-component (node 13631:16541; color, compact,
 * icon, removable, state=default|hover). Zoals bij Button is de hover-state
 * hier native CSS :hover i.p.v. React-state — Figma's enige "state"-variant
 * (removable, hover) beschrijft exact het gedrag dat de browser al gratis geeft.
 *
 * "removable" is in Figma alleen bevestigd voor color=neutral (geen enkele
 * removable+kleur-combinatie bestaat in de variantenset) — de removable-tak
 * hieronder gebruikt dus altijd de neutrale wit/rand-stijl, ongeacht `color`.
 *
 * De statusiconen (succes/error/warning/info) gebruiken bij compact=true de
 * losse "*-sm"-bestanden: de bestaande success/error/warning/info.svg zijn
 * ~21px nativief (bevestigd correct voor Alert's size="md"/24px-gebruik),
 * maar te groot voor Tag's 16px compact-icoonvak. De "*-sm"-varianten zijn
 * losstaand toegevoegd met exact dezelfde 16px-Figma-brondata i.p.v. de
 * bestaande bestanden te herschalen (zou Alert kunnen breken) — zelfde
 * aanpak als het bestaande chevron-right(-sm) duo in /public/icons/.
 *
 * Voor niet-statuskleuren toont Figma bij icon=true een leeg "swap this"-
 * icoonslot (geen vaste glyph) — vandaar de losse `iconName`-prop, analoog
 * aan Button's iconPrepend. Zonder `iconName` valt zo'n Tag terug op de
 * tekst-only-layout in plaats van een gebroken <img>.
 */
export function Tag({
  text,
  color = "neutral",
  compact = true,
  icon = false,
  iconName,
  removable = false,
  onRemove,
  className,
}: TagProps) {
  const status = statusIcon[color];
  const effectiveIconName = status ?? (icon ? iconName : undefined);
  const showIcon = Boolean(effectiveIconName) && !removable;

  const textClass = [
    "whitespace-nowrap leading-[1.5] text-black",
    compact ? "text-sm" : "text-base",
  ].join(" ");
  const textStyle = { fontFamily: "var(--font-avenir-medium)" };

  if (removable) {
    return (
      <div
        className={
          className ??
          [
            "inline-flex h-8 items-center justify-center gap-1 rounded-full border",
            "border-[rgba(0,0,0,0.12)] bg-white",
            "hover:border-[rgba(0,0,0,0.16)] hover:bg-[rgba(0,0,0,0.08)]",
            compact ? "py-1 pl-3 pr-2" : "py-2 pl-4 pr-3",
          ].join(" ")
        }
      >
        <p className={textClass} style={textStyle}>
          {text}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="flex shrink-0 items-center justify-center"
          aria-label={`${text} verwijderen`}
        >
          <Icon name="close" size="sm" />
        </button>
      </div>
    );
  }

  if (showIcon) {
    const resolvedName = status ? `${effectiveIconName}${compact ? "-sm" : ""}` : effectiveIconName;
    return (
      <div
        className={
          className ??
          [
            "inline-flex h-8 items-center justify-center rounded-full",
            bgByColor[color],
            compact ? "gap-1 py-1 pl-2 pr-3" : "gap-2 py-2 pl-3 pr-4",
          ].join(" ")
        }
      >
        <Icon name={resolvedName!} size={compact ? "sm" : "md"} />
        <p className={textClass} style={textStyle}>
          {text}
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        className ??
        [
          "inline-flex h-8 items-center justify-center rounded-full",
          bgByColor[color],
          compact ? "px-3 py-1" : "px-4 py-2",
        ].join(" ")
      }
    >
      <p className={textClass} style={textStyle}>
        {text}
      </p>
    </div>
  );
}
