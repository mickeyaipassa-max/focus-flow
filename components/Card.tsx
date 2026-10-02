import { Button } from "./Button";

type CardAction = {
  label: string;
  onClick?: () => void;
};

type CardProps = {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  primaryAction: CardAction;
  secondaryAction: CardAction;
  className?: string;
};

/**
 * Gebaseerd op Figma's generieke "Card"-component (node 2048:1959, "nooit
 * volledig klikbaar, interactieve elementen zoals knoppen/links staan
 * erin"). Deze instantie: tekst + verticale knoppenstapel links, foto rechts
 * (`object-cover`, vult de resterende breedte/hoogte). De secundaire knop
 * staat in Figma op `compact=true` (40px hoog, 16px tekst) en beide knoppen
 * zijn even breed (de breedste bepaalt).
 *
 * Figma toont alleen het desktop-frame (1184px breed, tekst/knoppen links
 * naast de foto rechts) — geen mobiel frame beschikbaar. Onder 600px stapelt
 * de foto daarom boven de tekst (`flex-col`), op dezelfde manier als de
 * Hero-secties elders op deze pagina al stapelen; dit is een eigen, niet via
 * Figma bevestigde aanname, niet overgenomen uit een specifiek mobiel frame.
 */
export function Card({ title, description, image, imageAlt = "", primaryAction, secondaryAction, className }: CardProps) {
  return (
    <div
      className={
        className ??
        "flex w-full flex-col items-stretch overflow-hidden rounded-md border border-[rgba(0,0,0,0.12)] bg-white min-[600px]:flex-row"
      }
    >
      <div className="order-2 flex min-w-px flex-col items-start gap-4 p-6 min-[600px]:order-1 min-[600px]:w-1/2 min-[600px]:shrink-0 min-[600px]:py-[23px]">
        <div className="flex flex-col items-start gap-2 text-black">
          <h2 className="w-full text-[24px] leading-[1.3]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            {title}
          </h2>
          <p className="w-full text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-2 min-[600px]:w-fit">
          <Button type="primary" wrap onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
          <Button type="secondary" compact wrap onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        </div>
      </div>
      <div className="relative order-1 h-52 min-w-px p-3 min-[600px]:order-2 min-[600px]:h-auto min-[600px]:w-1/2 min-[600px]:shrink-0 min-[600px]:py-[11px] min-[600px]:pr-[11px] min-[600px]:pl-0">
        {/* Absoluut gepositioneerd zodat de foto de kaarthoogte niet bepaalt: in Figma bepaalt de tekstkolom de hoogte (283px) en wordt de foto (580×259) bijgesneden. Vanaf 600px 23px/11px i.p.v. 24px/12px: Figma's rand ligt binnen het kader, de CSS-rand van 1px erbuiten, dus de binnenruimte is 1px per kant kleiner. */}
        <div className="relative size-full">
          <img src={image} alt={imageAlt} className="absolute inset-0 size-full rounded-[3px] object-cover" />
        </div>
      </div>
    </div>
  );
}
