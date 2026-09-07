import type { ReactNode } from "react";
import { Icon } from "./Icon";

type TileProps = {
  /** Figma's "Pictogram circle"-slot — vrije icoon-content, zelfde precedent als ProductSelectCard's `icon`. */
  icon: ReactNode;
  title: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Tile" (node 8233:24257 → "Tile List", bv. "Opzeggen",
 * "Contact met a.s.r."). Witte kaart met Shadow/SM, een grijze pictogram-cirkel
 * links, titel, en een chevron-right rechts — een klikbare rij naar een
 * vervolgactie/pagina.
 */
export function Tile({ icon, title, onClick, className }: TileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ??
        "flex w-full items-center gap-4 rounded-md bg-white px-6 py-5 text-left shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]"
      }
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#f6f6f7] p-3">{icon}</div>
      <p className="min-w-0 flex-1 font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
        {title}
      </p>
      <Icon name="chevron-right" size="md" />
    </button>
  );
}
