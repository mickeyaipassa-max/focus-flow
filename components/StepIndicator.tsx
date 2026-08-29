"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";
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

/**
 * Vult (of loopt leeg) met een soepele ease-in-out-animatie i.p.v. in één
 * keer van kleur te wisselen — op verzoek, zodat je bij het navigeren naar
 * de volgende stap de balk van links naar rechts groen ziet worden, en bij
 * teruggaan ziet leeglopen. De grijze track staat vast; alleen de groene
 * vulling erbovenop animeert in breedte (0% ↔ 100%), dus dit blijft correct
 * voor funnels met meer dan 2 stappen: alleen het segment waarvan
 * `completed` daadwerkelijk wisselt animeert, al voltooide segmenten
 * blijven stabiel groen staan.
 *
 * Gebruikt de Web Animations API (`el.animate(...)`) i.p.v. een CSS
 * `transition` + React-state die van waarde wisselt. Gemeten met een
 * frame-voor-frame trace: Next.js wikkelt paginanavigatie in een React
 * `startTransition`, waardoor de tussenstap (het "oude" breedte-percentage)
 * nooit een eigen geschilderd frame kreeg — de CSS-transitie had dus niets
 * om vanaf te animeren en de balk sprong in ~1 frame naar zijn eindstand.
 * `el.animate()` speelt de animatie rechtstreeks af, los van Reacts
 * render/commit-volgorde, en is daarmee immuun voor dat probleem.
 */
function StepTrail({ completed, mobile, animateDirection }: { completed: boolean; mobile: boolean; animateDirection?: "fill" | "drain" }) {
  const fillRef = useRef<HTMLDivElement>(null);

  /**
   * `useLayoutEffect` i.p.v. `useEffect`: draait vóór de browser schildert,
   * i.p.v. erna. `animateDirection` is als dependency meegegeven (i.p.v.
   * mount-only `[]`) omdat de ouder `previousStep` pas ná zijn eigen
   * post-hydration layout-effect kent (zie `StepIndicator` hieronder —
   * nodig om een hydration-mismatch te voorkomen), dus deze prop is bij de
   * EERSTE render van dit component nog `undefined`. Doordat beide
   * layout-effects zijn (ouder én kind), lost de hele ketting — lezen,
   * doorgeven, animatie starten — op vóór de eerste zichtbare paint,
   * i.p.v. na een merkbare vertraging van een paar honderd ms met gewone
   * `useEffect`s.
   */
  useLayoutEffect(() => {
    const el = fillRef.current;
    if (!animateDirection || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const keyframes =
      animateDirection === "fill" ? [{ width: "0%" }, { width: "100%" }] : [{ width: "100%" }, { width: "0%" }];
    const animation = el.animate(keyframes, { duration: 500, easing: "ease-in-out", fill: "forwards" });
    // Cancel op cleanup — anders start React 18 Strict Mode's dubbele
    // effect-aanroep (dev-only) een tweede, overlappende animatie op
    // hetzelfde element.
    return () => animation.cancel();
  }, [animateDirection]);

  return (
    <div className={["relative min-w-px flex-1 shrink", mobile ? "h-8" : "h-10"].join(" ")}>
      <div className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-[3px] overflow-hidden rounded-full bg-[rgba(0,0,0,0.12)]">
        <div
          ref={fillRef}
          className="h-full bg-[#0f865d]"
          style={animateDirection ? undefined : { width: completed ? "100%" : "0%" }}
        />
      </div>
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
  /**
   * Schakelt de vul-animatie van `StepTrail` in en identificeert de funnel
   * (bv. "mutatie") in `sessionStorage`. Nodig omdat elke stap in dit project
   * een eigen Next.js-route is: dit component wordt bij elke stap opnieuw
   * gemount, dus zonder deze brug is er geen "vorige waarde" om vanaf te
   * animeren — de balk zou anders altijd direct in zijn eindstand
   * verschijnen. Zonder deze prop (default) is er geen gedragswijziging:
   * geen animatie, exact zoals voorheen.
   */
  animationKey?: string;
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
  animationKey,
  className,
}: StepIndicatorProps) {
  /**
   * Start op `null` (matcht de server-render — die kent `sessionStorage`
   * niet — dus geen hydration-mismatch) en wordt pas ná hydration, in de
   * effect hieronder, bijgewerkt naar de echte vorige stap. Het lezen
   * gebeurt eenmalig via `hasReadRef`, los van de (wél idempotente)
   * schrijfactie erna: anders leest React 18 Strict Mode's dubbele
   * effect-aanroep (dev-only) bij de tweede keer de waarde terug die de
   * EERSTE aanroep net zelf al wegschreef, waardoor `previousStep` altijd
   * gelijk aan `activeStep` zou lijken en de animatie nooit zou starten.
   *
   * `useLayoutEffect` i.p.v. `useEffect`: zie de toelichting bij
   * `StepTrail` hierboven — laat de hele ketting vóór de eerste paint
   * oplossen i.p.v. met een merkbare vertraging erna.
   */
  const [previousStep, setPreviousStep] = useState<number | null>(null);
  const hasReadRef = useRef(false);

  useLayoutEffect(() => {
    if (!animationKey || typeof window === "undefined") return;
    const storageKey = `step-indicator-${animationKey}`;
    if (!hasReadRef.current) {
      hasReadRef.current = true;
      const stored = window.sessionStorage.getItem(storageKey);
      setPreviousStep(stored !== null ? Number(stored) : null);
    }
    window.sessionStorage.setItem(storageKey, String(activeStep));
  }, [animationKey, activeStep]);

  /** Alleen het segment waarvan `completed` daadwerkelijk wisselt (t.o.v. `previousStep`) krijgt een richting — de rest blijft statisch. */
  function trailAnimationFor(index: number): "fill" | "drain" | undefined {
    if (previousStep === null || previousStep === activeStep) return undefined;
    const wasCompleted = index + 1 < previousStep;
    const isCompleted = index + 1 < activeStep;
    if (wasCompleted === isCompleted) return undefined;
    return isCompleted ? "fill" : "drain";
  }

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
              <StepTrail
                completed={completed || index + 1 < activeStep}
                mobile={mobile}
                animateDirection={completed ? undefined : trailAnimationFor(index)}
              />
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
