import { Fragment } from "react";
import { Icon } from "./Icon";

type StepState = "completed" | "current" | "upcoming";

type StepSymbolProps = {
  state: StepState;
  stepNumber: number;
  mobile: boolean;
};

function StepSymbol({ state, stepNumber, mobile }: StepSymbolProps) {
  const size = mobile ? "size-8" : "size-10"; // 32px / 40px

  const background =
    state === "current" ? "bg-[#0f865d]" : state === "completed" ? "bg-white" : "bg-[rgba(0,0,0,0.12)]";

  return (
    <div
      className={[
        "relative flex shrink-0 items-center justify-center rounded-full",
        size,
        background,
        // Bevestigd via de master "Step Symbol"-component: alleen "completed" heeft een schaduw, "current" niet.
        state === "completed" ? "drop-shadow-[0px_4px_8px_rgba(0,0,0,0.12)]" : "",
      ].join(" ")}
    >
      {state === "completed" ? (
        <Icon name="check" size={mobile ? "sm" : "md"} />
      ) : (
        <span
          className={[
            "font-medium leading-[1.4]",
            mobile ? "text-base" : "text-xl",
            state === "current" ? "text-white" : "text-[#2a292e]",
          ].join(" ")}
          style={{ fontFamily: "var(--font-memphis-medium)" }}
        >
          {stepNumber}
        </span>
      )}
    </div>
  );
}

function StepTrail({ completed, mobile }: { completed: boolean; mobile: boolean }) {
  return (
    <div className={["relative min-w-px flex-1 shrink", mobile ? "h-8" : "h-10"].join(" ")}>
      <div
        className={[
          "-translate-y-1/2 absolute inset-x-0 top-1/2 h-[3px]",
          completed ? "bg-[#0f865d]" : "bg-[rgba(0,0,0,0.12)]",
        ].join(" ")}
      />
    </div>
  );
}

/**
 * De vervagende randjes die aangeven dat er meer stappen buiten beeld staan
 * (bv. bij een lange, scrollbare stappenlijst). Kleur volgt de richting:
 * links = "completed"-groen (wat links afvalt is per definitie al voltooid),
 * rechts = "upcoming"-grijs — bevestigd via het enige Figma-voorbeeld waarin
 * beide tegelijk voorkwamen.
 */
function StepTrailOverflow({ side, mobile }: { side: "left" | "right"; mobile: boolean }) {
  const isLeft = side === "left";
  const gradientDirection = isLeft ? "bg-gradient-to-l" : "bg-gradient-to-r";
  const stops = isLeft
    ? "from-[#0f865d] from-[10%] to-[rgba(15,134,93,0.01)] to-[80%]"
    : "from-[rgba(0,0,0,0.12)] from-[10%] to-[rgba(0,0,0,0)] to-[80%]";

  return (
    <div className={["relative shrink-0", mobile ? "size-4" : "size-10"].join(" ")}>
      <div className={["-translate-y-1/2 absolute inset-x-0 top-1/2 h-[3px]", gradientDirection, stops].join(" ")} />
    </div>
  );
}

type StepIndicatorProps = {
  /** De naam van elke stap, in volgorde — Figma's eigen voorbeeldlabels zijn placeholders, dus dit is geen default. */
  steps: string[];
  /** 1-indexed: welke stap "current" is. */
  activeStep: number;
  /** Forceert alle stappen naar de "completed"-weergave (bevestigde eindstaat-modus in Figma). */
  completed?: boolean;
  /** Labelloze, kleinere weergave — bevestigd in Figma, maar geen bewijs dat Verzuim dit gebruikt. */
  mobile?: boolean;
  /**
   * Toont/verbergt de labels onder de cirkels, onafhankelijk van `mobile`
   * (bevestigd als losse `label`-property op het Figma "Step"-component).
   * Heeft sowieso geen effect wanneer `mobile` actief is — daar toont
   * Figma nooit labels.
   */
  showLabels?: boolean;
  /** Toont de chevron-knop; het uitklappende paneel zelf is geen onderdeel van deze opdracht. */
  dropdownButton?: boolean;
  onDropdownToggle?: () => void;
  /** Vervagend randje vóór de eerste stap — er staan (voltooide) stappen buiten beeld links. */
  overflowLeft?: boolean;
  /** Vervagend randje ná de laatste stap — er staan (nog te doen) stappen buiten beeld rechts. */
  overflowRight?: boolean;
  className?: string;
};

export function StepIndicator({
  steps,
  activeStep,
  completed = false,
  mobile = false,
  showLabels = true,
  dropdownButton = false,
  onDropdownToggle,
  overflowLeft = false,
  overflowRight = false,
  className,
}: StepIndicatorProps) {
  function stateFor(index: number): StepState {
    if (completed) return "completed";
    const stepNumber = index + 1;
    if (stepNumber < activeStep) return "completed";
    if (stepNumber === activeStep) return "current";
    return "upcoming";
  }

  return (
    <div className={className ?? "flex w-full items-start justify-center"}>
      {overflowLeft && <StepTrailOverflow side="left" mobile={mobile} />}
      {steps.map((label, index) => {
        const state = stateFor(index);
        return (
          <Fragment key={label}>
            <div className={["flex shrink-0 flex-col items-center gap-2", mobile ? "w-8" : "w-10"].join(" ")}>
              <StepSymbol state={state} stepNumber={index + 1} mobile={mobile} />
              {!mobile && showLabels && (
                <p
                  className={[
                    "max-w-[240px] min-w-[32px] whitespace-nowrap text-center text-lg leading-[1.5]",
                    state === "current" ? "font-bold text-black" : "font-[350] text-[#2a292e]",
                  ].join(" ")}
                  style={{ fontFamily: state === "current" ? "var(--font-avenir-bold)" : "var(--font-avenir-book)" }}
                >
                  {label}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <StepTrail completed={completed || index + 1 < activeStep} mobile={mobile} />
            )}
          </Fragment>
        );
      })}
      {overflowRight && <StepTrailOverflow side="right" mobile={mobile} />}
      {dropdownButton && (
        <button
          type="button"
          onClick={onDropdownToggle}
          className={[
            "flex items-center justify-center rounded-full border border-[#565656]",
            "hover:border-black hover:bg-[rgba(0,0,0,0.08)] active:border-black active:bg-[rgba(0,0,0,0.08)]",
            mobile ? "size-8 p-2" : "size-10 p-2",
          ].join(" ")}
        >
          <Icon name="chevron-down" size={mobile ? "sm" : "md"} alt="Toon alle stappen" />
        </button>
      )}
    </div>
  );
}
