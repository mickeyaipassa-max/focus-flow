import type { ReactNode } from "react";

type MultiEntityItemAction = {
  label: string;
  onClick?: () => void;
};

type MultiEntityItemProps = {
  /**
   * `current` = product waar de gebruiker nu mee bezig is (geel/oranje ring),
   * `completed` = afgerond (groen vinkje), `disabled` = nog niet aan de beurt
   * (grijze cirkel). Bevestigd via mcp op "Multi Entity Item" (node 1:26283,
   * "Live event Funnel"): drie losse componentvarianten, geen los `active`-
   * of `done`-boolean.
   */
  state: "current" | "completed" | "disabled";
  /**
   * Het producticoon (bv. `pictogram-house.svg`). Figma's eigen "disabled"-
   * variant toont hier altijd hetzelfde generieke poppetje-in-cirkel-icoon
   * (bevestigd op alle drie de echte upcoming-rijen), maar dat oogt in de
   * praktijk als een fout zodra alle drie de resterende producten hetzelfde
   * icoon tonen i.p.v. hun eigen producticoon — daarom hier alsnog een
   * prop, met het letterlijke Figma-icoon alleen als fallback wanneer de
   * afnemer zelf geen icoon meegeeft.
   */
  icon?: ReactNode;
  title: string;
  description?: string;
  /**
   * Extra grijze regel onder de beschrijving (Figma's "Addition"-laag).
   * Optioneel: alleen de disabled/upcoming-instances op deze pagina laten
   * 'm leeg, geen enkele echte instance gebruikte 'm hier.
   */
  addition?: string;
  /**
   * Actieknop(pen) rechts. `current` heeft er in Figma 1, `completed` 2 —
   * beide instances stonden op de pagina zelf echter zonder ingevulde
   * knoptekst (lege/niet-overschreven "Button"-instance, alleen het
   * `disabled`-"Verwijder"-label was wél ingevuld). In overleg met de
   * opdrachtgever daarom bewust leeg gelaten totdat Figma dit zelf aanvult
   * — geen knop renderen i.p.v. een lege/placeholder-knop tonen aan
   * eindgebruikers. Zodra de tekst bekend is: gewoon meegeven, de styling
   * staat al klaar.
   */
  actions?: MultiEntityItemAction[];
  /** Alleen relevant bij `state="disabled"` — toont "Verwijder" (bevestigde vaste tekst). */
  onRemove?: () => void;
  className?: string;
};

function ActionButton({ label, onClick }: MultiEntityItemAction) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-6 items-center justify-center gap-2 rounded-[3px] whitespace-nowrap"
    >
      <span className="font-[550] text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir-medium)" }}>
        {label}
      </span>
    </button>
  );
}

/**
 * Gebaseerd op Figma's "Multi Entity Item" (node 1:26283, "Live event
 * Funnel"): de rij bovenaan elk productblok in stap 2 (Premie berekenen) die
 * laat zien welk product actief/afgerond/nog-niet-begonnen is — zie de
 * rationale (punt 4/5) voor het volledige completed→active→upcoming-model.
 * Nieuw component: geen bestaand stuk in deze bibliotheek dekt de
 * icoon-cirkel-met-status + titel/omschrijving/toevoeging + status-
 * afhankelijke actieknop(pen)-combinatie.
 *
 * Cirkelkleuren 1:1 uit Figma: `current` = geel (bg `#fff8e3`, rand
 * `#eda50f`, bevestigd op de echte component). Voor `completed` bleek de
 * eigen Figma-instance van de status-badge leeg/niet-op te lossen (net als
 * de actieknoppen) — hier ingevuld met dezelfde groene vink-taal
 * (`bg-[#0f865d]` + witte check) die dit designsysteem al bevestigd gebruikt
 * voor "completed" (zie `StepIndicator.tsx`), niet zelf verzonnen. `disabled`
 * = grijs (`bg-[#f6f6f7]`), met het letterlijk geëxporteerde Figma-icoon
 * (`pictogram-persoon-in-cirkel.svg`).
 */
export function MultiEntityItem({ state, icon, title, description, addition, actions, onRemove, className }: MultiEntityItemProps) {
  return (
    <div className={className ?? "flex w-full items-center justify-between gap-4 px-6 py-4 min-[600px]:px-10"}>
      <div className="flex min-w-px flex-1 items-center gap-4">
        <span className="relative flex size-14 shrink-0 items-center justify-center">
          {state === "current" && (
            <span className="flex size-14 items-center justify-center rounded-full border-2 border-[#eda50f] bg-[#fff8e3]">
              <span className="flex size-8 items-center justify-center">{icon}</span>
            </span>
          )}
          {state === "completed" && (
            <span className="relative flex size-14 items-center justify-center rounded-full bg-white drop-shadow-[0px_1px_2px_rgba(0,0,0,0.16)]">
              <span className="flex size-8 items-center justify-center">{icon}</span>
              <span className="-bottom-0.5 -right-0.5 absolute flex size-5 items-center justify-center rounded-full bg-[#0f865d]">
                <img src="/icons/check.svg" alt="" className="size-3" />
              </span>
            </span>
          )}
          {state === "disabled" && (
            <span className="flex size-14 items-center justify-center rounded-full bg-[#f6f6f7]">
              <span className="flex size-8 items-center justify-center">
                {icon ?? <img src="/icons/pictogram-persoon-in-cirkel.svg" alt="" className="size-8" />}
              </span>
            </span>
          )}
        </span>

        <div className="flex min-w-px flex-1 flex-col items-start gap-2">
          <div className="flex w-full flex-col items-start">
            <p className="w-full font-[550] text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
              {title}
            </p>
            {description && (
              <p className="w-full font-[350] text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                {description}
              </p>
            )}
            {addition && (
              <p className="w-full font-[350] text-[#565656] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                {addition}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {state === "disabled" && onRemove && <ActionButton label="Verwijder" onClick={onRemove} />}
        {state !== "disabled" && actions?.map((action, index) => <ActionButton key={index} {...action} />)}
      </div>
    </div>
  );
}
