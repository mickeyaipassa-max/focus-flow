import { Icon } from "./Icon";

export type AnchorTileItem = {
  label: string;
  /** Id van de sectie verderop op de pagina (zonder `#`) waar deze tegel naartoe springt. */
  targetId: string;
};

type AnchorTilesProps = {
  items: AnchorTileItem[];
  className?: string;
};

/**
 * Gebaseerd op Figma ("Voorwaarden vinden", node 2025:4953, "Tile Group"):
 * dezelfde rij-tegel met crème pictogram-cirkel die op de klantenservice-
 * pagina al bestaat (page.tsx's `TILE_ITEMS`), maar met een ander doel en
 * icoon — dit zijn geen links naar andere pagina's/tools, maar
 * in-page anchor-links: elke tegel springt naar een sectie verderop op
 * dezelfde pagina (labels komen letterlijk overeen met de secties eronder).
 * Daarom `<a href="#...">` i.p.v. `<button>` — correct native ankergedrag
 * (werkt zonder JS, verschijnt in de URL, "open in nieuw tabblad" werkt),
 * en het pijl-omlaag-icoon i.p.v. chevron-right, exact zoals bevestigd via
 * `get_design_context` (nieuw gedownload asset `arrow-down.svg`, 24×24).
 *
 * Responsief gedrag (1 kolom < 600px, 4 kolommen vanaf 600px) is nog niet
 * bevestigd via een mobiel Figma-frame voor déze pagina — hier bewust
 * hetzelfde patroon aangehouden als de bevestigde klantenservice-tegels,
 * als redelijke aanname totdat een mobiel frame dit bevestigt.
 */
export function AnchorTiles({ items, className }: AnchorTilesProps) {
  return (
    <div
      className={
        className ?? "grid w-full grid-cols-1 overflow-hidden rounded-md min-[600px]:grid-cols-4"
      }
      style={{ background: "rgba(0,0,0,0.16)", gap: 1, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
    >
      {items.map(({ label, targetId }) => (
        <a
          key={targetId}
          href={`#${targetId}`}
          className="group flex items-center gap-3 bg-white px-4 py-3 text-left hover:bg-[#fafafa]"
        >
          <span className="flex size-10 min-[1440px]:size-12 shrink-0 scale-100 items-center justify-center rounded-full bg-[#fff8e3] group-hover:scale-[1.2] motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0,-0.4,0.4,1.6)]">
            <Icon name="arrow-down" size="md" />
          </span>
          <span className="text-black text-sm leading-[1.5] min-[600px]:text-base min-[1440px]:text-lg" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            {label}
          </span>
        </a>
      ))}
    </div>
  );
}
