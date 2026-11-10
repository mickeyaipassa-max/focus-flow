import { Button } from "./Button";

type CardGraphicProps = {
  /** Pad naar een pictogram van 32px (bv. /bewindsvoerder/pictogram-bel.svg). */
  pictogram: string;
  title: string;
  /** Optioneel: sinds de aanpassing in Figma (Service hub, "Veel voorkomende situaties") hebben de kaarten daar geen omschrijving meer. */
  description?: string;
  actionLabel: string;
  onActionClick?: () => void;
  className?: string;
};

/**
 * "Card" met pictogram (Figma Components, "Card", variant `graphic=true`; gebruikt op de Service hub, frame "Veel voorkomende situaties",
 * node 14160:3630): witte kaart met een rand van 12% zwart en hoeken van 6px, (de rand ligt binnen de 24px padding, vandaar 23px + 1px rand) en 16px tussen de blokken.
 * Bovenaan een groene cirkel van 56px (#eef4e3, `Graphic Container`: 12px padding rond een pictogram van 32px), daaronder de titel
 * (Display/MD: Memphis 24px, regelhoogte 1,3) en de omschrijving (Text/MD: Avenir 18px), onderaan een primaire knop.
 * Een kaart is nooit in zijn geheel klikbaar: alleen de knop is interactief.
 */
export function CardGraphic({ pictogram, title, description, actionLabel, onActionClick, className }: CardGraphicProps) {
  return (
    <div className={className ?? "flex w-full min-w-px flex-col overflow-clip rounded-md border border-[rgba(0,0,0,0.12)] bg-white"}>
      <div className="flex w-full flex-col items-start gap-4 p-[23px]">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#eef4e3]">
          <img src={pictogram} alt="" width={32} height={32} className="size-8" />
        </span>
        <div className="flex w-full flex-col gap-2 text-black">
          <h3 className="w-full text-2xl leading-[1.3]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            {title}
          </h3>
          {description && (
            <p className="w-full text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              {description}
            </p>
          )}
        </div>
        <div className="flex items-start gap-2">
          <Button type="primary" onClick={onActionClick}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
