import { Fragment, type ReactNode } from "react";
import { Icon } from "./Icon";

export type DetailRowData = {
  label: string;
  value: string;
  /** Toont een "Wijzig"-knop op deze rij (Figma's `rowLevelEditing`, hier per rij i.p.v. kaartbreed). */
  editable?: boolean;
  /** Toont een "Verwijderen"-knop op deze rij. */
  removable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
};

type CardDetailsProps = {
  /** Titeltekst — Figma's eigen "Card Detail" is placeholder-demodata, dus geen default. */
  title?: string;
  /** Beschrijvingstekst — Figma's eigen "Description" is placeholder-demodata, dus geen default. */
  description?: string;
  /**
   * Figma noemt deze laag zelf letterlijk "placeholder" — dit is een lege
   * component-slot, geen vaste content. Vult de consument in, net als
   * FunnelBox's children.
   */
  pictogram?: ReactNode;
  /**
   * Bevestigde `chooseComponent`-override-slot in Figma (default toont een
   * info-Alert met vaste demo-tekst). Geen vaste tekst hardcoded hier — de
   * consument geeft een eigen <Alert> mee.
   */
  alert?: ReactNode;
  /** Label/waarde-paren — Figma's 15 losse detailRowN-booleans zijn hier gegeneraliseerd tot een array (zelfde aanpak als StepIndicator's `steps`). */
  rows: DetailRowData[];
  /** Breedte van de labelkolom bij ≥900px (bevestigde `lableWidthMd`-variant: 240px of 320px). Zonder effect onder 900px, daar staat het label altijd boven de waarde. */
  labelWidth?: "sm" | "md";
  /** Rand + padding rond de hele kaart. Default true, matcht Figma's basisvariant. */
  bordered?: boolean;
  cardActionEdit?: boolean;
  cardActionRemove?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  className?: string;
};

/**
 * Actieknop voor zowel de kaartbrede acties (altijd icoon+tekst) als de
 * rij-acties (icoon+tekst vanaf 900px, alleen icoon — 40px vierkant — daaronder).
 * Bevestigd via aparte mcp-fetches van beide breekpunt-varianten: dit is geen
 * eigen ontwerpkeuze maar een letterlijke Figma-asymmetrie.
 */
function ActionButton({
  icon,
  label,
  onClick,
  responsive = false,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  responsive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        responsive
          ? "flex size-10 shrink-0 items-center justify-center gap-1 rounded-[3px] p-3 min-[900px]:size-auto min-[900px]:gap-2 min-[900px]:p-0"
          : "flex shrink-0 items-center justify-center gap-2 rounded-[3px]"
      }
    >
      <Icon name={icon} size="md" />
      <span
        className={
          (responsive ? "hidden min-[900px]:inline " : "") +
          "whitespace-nowrap font-[550] text-base text-black underline decoration-solid decoration-from-font [text-underline-position:from-font]"
        }
        style={{ fontFamily: "var(--font-avenir-medium)" }}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * Onder 900px staan label en waarde altijd gestapeld (bevestigd: zowel
 * 320-599px als 600-899px gebruiken dezelfde verticale rij-opbouw — het
 * omslagpunt ligt dus precies bij 900px, niet lager). Bij rijen met acties
 * groepeert de "contents"-truc (zie Header) label+waarde tot één flex-item
 * onder 900px, en ontbindt ze tot losse flex-siblings van de knoppenrij
 * erboven — want dát is Figma's eigen, andere groepering op desktop.
 */
function DetailRow({
  label,
  value,
  labelWidthClass,
  editable,
  removable,
  onEdit,
  onRemove,
}: {
  label: string;
  value: string;
  labelWidthClass: string;
  editable?: boolean;
  removable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  const hasActions = editable || removable;

  const labelEl = (
    <p
      className={["w-full font-bold text-black text-base leading-[1.5]", labelWidthClass, "min-[900px]:shrink-0"].join(" ")}
      style={{ fontFamily: "var(--font-avenir-bold)" }}
    >
      {label}
    </p>
  );
  const valueEl = (
    <p
      className="w-full font-[350] text-black text-base leading-[1.5] min-[900px]:min-w-px min-[900px]:flex-1"
      style={{ fontFamily: "var(--font-avenir-book)" }}
    >
      {value}
    </p>
  );

  if (!hasActions) {
    return (
      <div className="flex w-full flex-col gap-1 min-[900px]:flex-row min-[900px]:items-start min-[900px]:gap-6">
        {labelEl}
        {valueEl}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-6 min-[900px]:items-start">
      <div className="flex min-w-px flex-1 flex-col gap-1 min-[900px]:contents">
        {labelEl}
        {valueEl}
      </div>
      <div className="flex shrink-0 items-center gap-2 min-[900px]:gap-4">
        {editable && <ActionButton icon="edit" label="Wijzig" onClick={onEdit} responsive />}
        {removable && <ActionButton icon="delete" label="Verwijderen" onClick={onRemove} responsive />}
      </div>
    </div>
  );
}

/**
 * Gebaseerd op Figma's "Card Details"-component. Het rij↔kolom-gedrag
 * (kaartlayout, label/waarde-oriëntatie, icoon-only rij-knoppen) is één
 * responsieve DOM-structuur met `min-[900px]:`-breekpunten — consistent met
 * Header — i.p.v. losse per-viewport componenten, ook al toont Figma zelf 3
 * los vergrendelde viewport-varianten (dat is een Figma-beperking: geen
 * media queries, dus de designer moest elk breekpunt los tekenen).
 */
export function CardDetails({
  title,
  description,
  pictogram,
  alert,
  rows,
  labelWidth = "sm",
  bordered = true,
  cardActionEdit = true,
  cardActionRemove = false,
  onEdit,
  onRemove,
  className,
}: CardDetailsProps) {
  const labelWidthClass = labelWidth === "md" ? "min-[900px]:w-[320px]" : "min-[900px]:w-[240px]";
  const isRowLevelEditing = rows.some((row) => row.editable || row.removable);

  return (
    <div
      className={
        className ??
        [
          "flex w-full flex-col items-start gap-4 rounded-[3px] bg-white",
          "min-[900px]:flex-row",
          bordered ? "border border-[#ccc] p-6" : "",
        ].join(" ")
      }
    >
      {pictogram && <div className="size-12 shrink-0">{pictogram}</div>}
      <div className="flex w-full min-w-px flex-col items-start gap-4 min-[900px]:w-auto min-[900px]:flex-1">
        {title && (
          <p
            className="w-full font-bold text-black text-xl leading-[1.4] min-[900px]:pt-1"
            style={{ fontFamily: "var(--font-avenir-bold)" }}
          >
            {title}
          </p>
        )}
        {description && (
          <p className="w-full font-[350] text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        )}
        {alert}
        {rows.length > 0 && (
          <div
            className={[
              "flex w-full flex-col items-start gap-4",
              isRowLevelEditing ? "min-[900px]:gap-5" : "min-[900px]:gap-2",
            ].join(" ")}
          >
            {rows.map((row, index) => (
              <Fragment key={row.label}>
                {isRowLevelEditing && index > 0 && (
                  <div className="hidden h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)] min-[900px]:block" />
                )}
                <DetailRow
                  label={row.label}
                  value={row.value}
                  labelWidthClass={labelWidthClass}
                  editable={row.editable}
                  removable={row.removable}
                  onEdit={row.onEdit}
                  onRemove={row.onRemove}
                />
              </Fragment>
            ))}
          </div>
        )}
      </div>
      {(cardActionEdit || cardActionRemove) && (
        <div className="flex shrink-0 items-center gap-4">
          {cardActionEdit && <ActionButton icon="edit" label="Wijzig" onClick={onEdit} />}
          {cardActionRemove && <ActionButton icon="delete" label="Verwijder" onClick={onRemove} />}
        </div>
      )}
    </div>
  );
}
