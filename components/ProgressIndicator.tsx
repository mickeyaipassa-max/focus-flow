type ProgressIndicatorProps = {
  /** Huidige sub-stap binnen deze funnelstap (1-indexed), bv. 1 in "1 van 3". */
  current: number;
  /** Totaal aantal sub-stappen, bv. 3 in "1 van 3". */
  total: number;
  className?: string;
};

const SEGMENTS = 10;

/**
 * Gebaseerd op Figma's "Progress Indicator" (instance 10938:29353, hoofdcomponent
 * "validation=-" — stepcounter=true, percentage=false, title=false, header=true).
 * Toont de voortgang binnen één funnelstap (hier: het bedrijf-zoekproces van
 * "Jouw bedrijf", niet te verwarren met de bovenliggende 5-staps `StepIndicator`).
 *
 * Het onderliggende "Progress Bar"-subcomponent heeft geen bevestigde
 * `current`/`total`-property in Figma's componentmodel — alleen een vaste balk
 * van 10 losse segmenten, waarvan er bij de enige geobserveerde instance
 * ("1 van 3") 3 gevuld waren. `Math.round((current / total) * 10)` is hier de
 * meest voor de hand liggende formule die exact op dat ene bevestigde
 * datapunt uitkomt (1/3 → 3,33 → 3) — een toegelichte afleiding, geen gok
 * over ongeziene combinaties.
 */
export function ProgressIndicator({ current, total, className }: ProgressIndicatorProps) {
  const filled = Math.min(SEGMENTS, Math.round((current / total) * SEGMENTS));

  return (
    <div className={className ?? "flex w-full flex-wrap items-center gap-x-3 gap-y-1"}>
      <div className="flex items-center gap-1 pb-[3px]">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl border-2 border-[#0f865d] px-3 py-[6px]">
          <span
            className="pt-[3px] text-center text-black text-base leading-[1.4]"
            style={{ fontFamily: "var(--font-memphis-medium)" }}
          >
            {current}
          </span>
        </div>
        <span className="pt-[3px] text-black text-base leading-[1.4]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
          van {total}
        </span>
      </div>
      <div
        className="flex h-1 flex-1 items-start overflow-hidden rounded-[3px]"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Stap ${current} van ${total}`}
      >
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <div key={index} className={["h-1 min-w-px flex-1", index < filled ? "bg-[#0f865d]" : "bg-[rgba(0,0,0,0.12)]"].join(" ")} />
        ))}
      </div>
    </div>
  );
}
