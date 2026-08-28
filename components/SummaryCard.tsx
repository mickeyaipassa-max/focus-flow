import { Fragment } from "react";
import { Icon } from "./Icon";
import { Tag } from "./Tag";

export type SummaryRowData = {
  label: string;
  value: string;
  /**
   * Toont een gele Tag-badge naast het label (bv. "Gewijzigd"/"Toegevoegd").
   * Stond eerder naast de waarde met een losse oranje stip na het label —
   * op node 8043:21049 (na de gebruiker's eigen Figma-aanpassing) bevestigd
   * verhuisd náár het label, stip vervallen.
   */
  badge?: string;
  /** Extra regel onder de waarde met de oude waarde (bv. "Dit was: Basis"). Bevestigd bij Dekking en Nieuwe premie. Zelfde kleur als de waarde zelf (zwart, of grijs bij `muted`) — niet apart grijs, dat was een aanname uit de vorige versie. */
  previousValue?: string;
  /**
   * Grijze wáárde-kleur voor niet-gewijzigde/informatieve rijen (bevestigd
   * bij "Eigen risico"). Beïnvloedt sinds de herziening van node 8043:21049
   * alléén de waarde, niet meer het label: het label is nu altijd
   * vetgedrukt/zwart, ook bij "Eigen risico" — dat was voorheen ook grijs
   * en niet-vet, een aanname die deze herziening rechtzet.
   */
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
 * 8043:21049 desktop, na de gebruiker's eigen Figma-aanpassing van de
 * desktopkaart) dat dit geen simpele stapel/uitlijn-omschakeling is: de
 * "gedempte"-stijl (muted) vervalt volledig op mobiel, en de waardetekst
 * wisselt van vet naar Book — te veel losse assen om betrouwbaar in één set
 * classes te vangen. De Tag-naast-het-label-plaatsing is inmiddels wél op
 * beide breekpunten gelijk (voorheen niet).
 */
function SummaryRow({ label, value, badge, previousValue, muted }: SummaryRowData) {
  const valueColor = muted ? "text-[#565656]" : "text-black";

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
      {/*
        Desktop (≥600px), bevestigd op node 8043:21049 (de herziene kaart):
        - Label is nu áltijd vetgedrukt/zwart, ook bij "Eigen risico" — niet
          langer gekoppeld aan `muted`. Badge staat naast het lábel (niet
          meer naast de waarde), geen stip meer. Bij een badge hugt de
          label+badge-groep zijn eigen breedte i.p.v. de vaste 250px-kolom —
          die kolom blijft alleen voor badge-loze rijen zoals "Eigen risico".
        - Waarde (en "was"-regel) is nu áltijd Avenir Book — niet langer vet
          bij niet-gewijzigde rijen. Alleen de kléur blijft aan `muted`
          gekoppeld (grijs bij "Eigen risico", zwart bij een badge-rij).
      */}
      <div className="hidden w-full items-start gap-4 min-[600px]:flex">
        <div className={badge ? "flex shrink-0 items-center gap-2" : "w-[250px] min-w-[160px] shrink-0"}>
          <p className="whitespace-nowrap text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {label}
          </p>
          {badge && <Tag text={badge} color="yellow" compact />}
        </div>
        <div className="flex min-w-px flex-1 flex-col items-end justify-center gap-1">
          <p className={["whitespace-nowrap text-right text-base leading-[1.5]", valueColor].join(" ")} style={{ fontFamily: "var(--font-avenir-book)" }}>
            {value}
          </p>
          {previousValue && (
            <p className={["text-right text-base leading-[1.5]", valueColor].join(" ")} style={{ fontFamily: "var(--font-avenir-book)" }}>
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
 * de mutatie-funnel — oorspronkelijk node 8031:18767 "Jouw dekking",
 * 8031:18859 "Ingangsdatum", 8031:18899 "Premie" (duplicaat van
 * CardDetails, omgebouwd naar déze variant); de "Jouw dekking"-kaart is
 * nadien in Figma zelf herzien naar node 8043:21049 (zie hieronder). Bewust
 * weggelaten t.o.v. CardDetails: pictogram-slot, alert-slot, rij-niveau
 * acties en de labelWidth-responsive-variant — geen van deze is aangetroffen,
 * dus niet meegenomen (geen aanname).
 *
 * Randstijl (wit, rand #ccc, rounded-sm, p-6) is identiek aan CardDetails'
 * `bordered`-variant — dat deel is dus geen verschil, gewoon hetzelfde
 * basiskaartpatroon.
 *
 * Responsive breekpunt: 600px, bevestigd door de gebruiker (niet uit Figma
 * afgeleid — er stond geen tussenliggende viewport, alleen een los
 * 327px-mobielframe naast de bestaande 1440px-desktopkaarten).
 *
 * Onder 600px (node 8036:20816, alleen bevestigd voor "Jouw dekking", maar
 * het rijpatroon zelf is generiek — dezelfde 3 rij-varianten: met badge+"was",
 * zonder badge, met badge zonder "was" — dus toepasbaar op elke kaart):
 * kaart-gap 16px i.p.v. 24px op desktop (bevestigd, andere token-waarde).
 *
 * Dividers tussen rijen (node 8043:21049, de door de gebruiker herziene
 * "Jouw dekking"-kaart): ná élke rij op mobiel (incl. vóór de Wijzig-knop,
 * die daardoor mee verschuift van rechtsboven bij de titel naar onderaan de
 * kaart) — en, sinds deze herziening, ook op desktop ná élke rij behálve de
 * laatste (geen trailing divider vóór de knoppenrij/kaartrand op desktop).
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
          {rows.map((row, index) => {
            const isLastRow = index === rows.length - 1;
            return (
              <Fragment key={row.label}>
                <SummaryRow {...row} />
                {/* Mobiel: na élke rij (ook de laatste, vóór de Wijzig-knop). Desktop (bevestigd op node 8043:21049): na élke rij behálve de laatste. */}
                <div className={["h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]", isLastRow ? "min-[600px]:hidden" : ""].join(" ")} />
              </Fragment>
            );
          })}
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
