import { Icon } from "./Icon";

type StarState = "full" | "half" | "empty";

function Star({ state }: { state: StarState }) {
  const iconName = state === "full" ? "star-full" : state === "half" ? "star-half" : "star-empty";
  return (
    <span className="relative flex size-6 shrink-0 items-center justify-center overflow-clip">
      <img src={`/icons/${iconName}.svg`} alt="" />
    </span>
  );
}

/** Zet een score 0-5 (in stappen van 0,5, zoals Figma's 11 losse score-variants) om naar 5 sterstaten. */
function starsForScore(score: number): StarState[] {
  const rounded = Math.round(score * 2) / 2;
  return Array.from({ length: 5 }, (_, i) => {
    const remainder = rounded - i;
    if (remainder >= 1) return "full";
    if (remainder >= 0.5) return "half";
    return "empty";
  });
}

type RatingProps = {
  /** Sterscore 0-5 (in stappen van 0,5) — bepaalt welke van de 5 sterren vol/half/leeg zijn. In compact-modus wordt dit genegeerd: Figma toont daar altijd één vaste volle ster. */
  score: number;
  /** De getoonde waardering, bv. "8,1" — losse property van `score` in Figma, geen automatische omrekening tussen beide schalen. */
  ratingNumber: string;
  /** Aantal reviews voor de linktekst ("{reviewCount} reviews"). */
  reviewCount: number;
  reviewsHref?: string;
  reviewLink?: boolean;
  compact?: boolean;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Rating" (node 16981:1567, compact=false/true), die
 * op zijn beurt "Star Rating" (16981:1497, score=0..5 in stappen van 0,5)
 * en "Star" (16981:1486, state=full/half/empty) hergebruikt.
 *
 * "Star Rating" is in Figma 11 losse, hardgecodeerde score-variants — hier
 * vertaald naar één formule (`starsForScore`) in plaats van 11 bijna-
 * identieke JSX-blokken: dezelfde score levert altijd dezelfde 5 sterstaten
 * op, dus dat is geen aanname maar een direct uit de 11 variants afgeleide
 * regel (elke variant volgt exact "floor(score) sterren vol, dan evt. één
 * half, de rest leeg").
 *
 * De "leeg"-ster is geen aparte outline-stijl maar dezelfde goudkleur
 * (#EDA50F) als vol/half — het pad zelf tekent een dunne sterrand met een
 * gat in het midden, dus puur op geometrie, niet op kleur.
 */
export function Rating({ score, ratingNumber, reviewCount, reviewsHref, reviewLink = true, compact = false, className }: RatingProps) {
  const scoreText = (
    <div className="flex h-[23px] items-baseline gap-0">
      <p className="h-[19px] w-[30px] text-[20px] leading-[1.4] text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
        {ratingNumber}
      </p>
      <p className="h-4 w-6 text-base leading-[1.5] text-[#565656]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
        /10
      </p>
    </div>
  );

  const link = reviewLink && (
    <a
      href={reviewsHref}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-4 shrink-0 items-start gap-2"
    >
      <span className="whitespace-nowrap text-base leading-[1.5] text-[#0064a8] underline" style={{ fontFamily: "var(--font-avenir)" }}>
        {reviewCount} reviews
      </span>
      <span className="flex items-start pt-[2px]">
        <Icon name="new-tab" size="sm" />
      </span>
    </a>
  );

  if (compact) {
    return (
      <div className={className ?? "flex items-center gap-2"}>
        <div className="flex shrink-0 items-center gap-1">
          <Star state="full" />
          {scoreText}
        </div>
        {link}
      </div>
    );
  }

  return (
    <div className={className ?? "flex w-[333px] flex-wrap items-center gap-x-2 gap-y-1"}>
      <div className="flex shrink-0 items-end gap-2">
        <div className="flex shrink-0 items-start">
          {starsForScore(score).map((state, i) => (
            <Star key={i} state={state} />
          ))}
        </div>
        {scoreText}
      </div>
      {link}
    </div>
  );
}
