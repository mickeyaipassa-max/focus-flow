import { Fragment } from "react";
import { Icon } from "./Icon";
import { Tag } from "./Tag";

export type SummaryRowData = {
  label: string;
  value: string;
  /**
   * Toont een gele Tag-badge (bv. "Gewijzigd"/"Toegevoegd") vóór de waarde,
   * plus een oranje stip ná het label. In alle 3 bevestigde Figma-instanties
   * (Dekking, Aanvullende dekking, Nieuwe premie) komen deze twee altijd
   * samen voor — nooit los — dus hier gebundeld tot één prop i.p.v. twee.
   */
  badge?: string;
  /** Extra, grijze regel onder de waarde met de oude waarde (bv. "Dit was: Basis"). Bevestigd bij Dekking en Nieuwe premie. */
  previousValue?: string;
  /** Grijze, niet-vetgedrukte label+waarde-stijl voor niet-gewijzigde/informatieve rijen (bevestigd bij "Eigen risico"). */
  muted?: boolean;
};

type SummaryCardProps = {
  title: string;
  rows: SummaryRowData[];
  /** Toont "Wijzig" rechtsboven bij de titel (bevestigd op de "Jouw dekking"-kaart, afwezig op Ingangsdatum/Premie). Los van `onEdit` gehouden — zelfde patroon als CardDetails' `cardActionEdit` — zodat de knop ook zonder client-side handler getoond kan worden. */
  showEdit?: boolean;
  onEdit?: () => void;
  className?: string;
};

/**
 * Titel-tekststijl: Memphis (display), niet Avenir — bevestigd via mcp op
 * alle 3 kaarten (Display/MD-token). Dit wijkt af van CardDetails' titel
 * (Avenir Heavy) en is dus geen kopieerfout maar een letterlijk Figma-feit.
 */
function CardTitle({ children }: { children: string }) {
  return (
    <p
      className="w-full text-2xl text-black leading-[1.3]"
      style={{ fontFamily: "var(--font-memphis-medium)" }}
    >
      {children}
    </p>
  );
}

/**
 * Niet-responsieve icoon+onderstreepte-tekst-knop — exact de Code Connect-
 * match die mcp teruggaf voor "Wijzig" (type=text, iconPrepend=true,
 * compact=true). Dezelfde vormgeving als CardDetails' ActionButton in
 * niet-responsieve stand, hier losstaand gehouden omdat dit component een
 * eigen duplicaat is (geen gedeelde import, zoals gevraagd).
 */
function EditButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 items-center justify-center gap-2">
      <Icon name="edit" size="md" />
      <span
        className="whitespace-nowrap text-base text-black underline decoration-solid decoration-from-font [text-underline-position:from-font]"
        style={{ fontFamily: "var(--font-avenir-medium)" }}
      >
        Wijzig
      </span>
    </button>
  );
}

/**
 * Twee volledig losse DOM-structuren per rij, getoond/verborgen op basis van
 * het breekpunt (min-[600px]), i.p.v. één structuur die met utility-classes
 * wordt "omgevouwen". Bevestigd via mcp (node 8036:20816 mobiel vs.
 * 8031:18767 e.a. desktop) dat dit geen simpele stapel/uitlijn-omschakeling
 * is: de Tag verhuist van de waarde náár het label, de "gedempte"-stijl
 * (muted) vervalt volledig op mobiel, en de waardetekst wisselt van vet naar
 * Book — te veel losse assen om betrouwbaar in één set classes te vangen.
 */
function SummaryRow({ label, value, badge, previousValue, muted }: SummaryRowData) {
  const labelFont = muted ? "var(--font-avenir-book)" : "var(--font-avenir-bold)";
  const valueFont = muted ? "var(--font-avenir-book)" : "var(--font-avenir-bold)";
  const textColor = muted ? "text-[#565656]" : "text-black";

  return (
    <>
      {/* Mobiel (<600px): label + badge op één regel, waarde (+ "was"-regel) eronder, links uitgelijnd. Geen stip, geen gedempte stijl — bevestigd: ook "Eigen risico" is hier zwart/Book, ongeacht `muted`. */}
      <div className="flex w-full flex-col gap-1 min-[600px]:hidden">
        <div className="flex w-full items-center gap-2">
          <p className="whitespace-nowrap text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {label}
          </p>
          {badge && <Tag text={badge} color="yellow" compact />}
        </div>
        <div>
          <p className="text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {value}
          </p>
          {previousValue && (
            <p className="text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {previousValue}
            </p>
          )}
        </div>
      </div>
      {/* Desktop (≥600px): label links (met stip bij badge), waarde rechts uitgelijnd, badge naast de waarde. */}
      <div className="hidden w-full items-start gap-4 min-[600px]:flex">
        <div className="w-[250px] min-w-[160px] shrink-0">
          <p className={["text-base leading-[1.5]", textColor].join(" ")} style={{ fontFamily: labelFont }}>
            {label}
            {badge && <span className="text-[#eda50f]"> •</span>}
          </p>
        </div>
        <div className="flex min-w-px flex-1 flex-col items-end justify-center gap-1">
          <div className="flex items-center justify-end gap-2">
            {badge && <Tag text={badge} color="yellow" compact />}
            <p className={["whitespace-nowrap text-right text-base leading-[1.5]", textColor].join(" ")} style={{ fontFamily: valueFont }}>
              {value}
            </p>
          </div>
          {previousValue && (
            <p className="text-right text-base text-[#565656] leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {previousValue}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Gebaseerd op Figma's "Card Details"-instanties op de bevestigingsstap van
 * de mutatie-funnel (node 8031:18767 "Jouw dekking", 8031:18859
 * "Ingangsdatum", 8031:18899 "Premie") — een duplicaat van CardDetails,
 * omgebouwd naar déze specifieke variant. Bewust weggelaten t.o.v.
 * CardDetails: pictogram-slot, alert-slot, rij-niveau acties en de
 * labelWidth-responsive-variant — geen van deze is in de 3 opgehaalde
 * instanties aangetroffen, dus niet meegenomen (geen aanname).
 *
 * Randstijl (wit, rand #ccc, rounded-sm, p-6) is identiek aan CardDetails'
 * `bordered`-variant — dat deel is dus geen verschil, gewoon hetzelfde
 * basiskaartpatroon.
 *
 * De 8px-gap tussen badge en waarde is de meerderheidsvariant (2 van de 3
 * instanties); de "Dekking"-rij wijkt in Figma zelf af met 16px — vermoedelijk
 * een kleine inconsistentie in het bronbestand, hier niet als aparte
 * prop overgenomen om geen ongeteste combinatie te introduceren.
 *
 * Responsive breekpunt: 600px, bevestigd door de gebruiker (niet uit Figma
 * afgeleid — er stond geen tussenliggende viewport, alleen een los
 * 327px-mobielframe naast de bestaande 1440px-desktopkaarten).
 *
 * Onder 600px (node 8036:20816, alleen bevestigd voor "Jouw dekking", maar
 * het rijpatroon zelf is generiek — dezelfde 3 rij-varianten: met badge+"was",
 * zonder badge, met badge zonder "was" — dus toepasbaar op elke kaart):
 * - kaart-gap 16px i.p.v. 24px op desktop (bevestigd, andere token-waarde),
 * - een divider ná elke rij (incl. vóór de Wijzig-knop, die daardoor mee
 *   verschuift van rechtsboven bij de titel naar onderaan de kaart).
 */
export function SummaryCard({ title, rows, showEdit = false, onEdit, className }: SummaryCardProps) {
  return (
    <div
      className={
        className ??
        "flex w-full flex-col items-start gap-4 rounded-[3px] border border-[#ccc] bg-white p-6 min-[600px]:gap-6"
      }
    >
      <div className="flex w-full items-start gap-4">
        <CardTitle>{title}</CardTitle>
        {showEdit && (
          <div className="hidden flex-1 flex-col items-end min-[600px]:flex">
            <EditButton onClick={onEdit} />
          </div>
        )}
      </div>
      {rows.length > 0 && (
        <div className="flex w-full flex-col items-start gap-4">
          {rows.map((row) => (
            <Fragment key={row.label}>
              <SummaryRow {...row} />
              <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)] min-[600px]:hidden" />
            </Fragment>
          ))}
        </div>
      )}
      {showEdit && (
        <div className="min-[600px]:hidden">
          <EditButton onClick={onEdit} />
        </div>
      )}
    </div>
  );
}
