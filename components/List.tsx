import { Icon } from "./Icon";

export type ListItemData = {
  /** Vetgedrukt beginstuk van de regel (bv. "Voor je bedrijf:"). Optioneel — niet elk item heeft een label-lead-in. */
  label?: string;
  text: string;
};

type ListProps = {
  /** "bullet" = groene stip (Figma's "icon=bullet"), "check" = groen vinkje (Figma's "icon=check"). */
  icon: "bullet" | "check";
  items: ListItemData[];
  className?: string;
};

/**
 * Gebaseerd op Figma's gedeelde "List"-component (node 8030:130551,
 * icon=bullet|check, description=false, compact=false) — hergebruikt op
 * twee plekken binnen stap 1: de "Welke gegevens heb je nodig..."-bullets
 * in de hoofdkaart, en de "Waarom onze verzekering"-checklist in de
 * sidebar. Beide gebruiken exact dezelfde 18px/Avenir Book-tekststijl en
 * 8px-tussenruimte, alleen het icoon en de eventuele vetgedrukte lead-in
 * per item verschillen.
 */
export function List({ icon, items, className }: ListProps) {
  return (
    <ul className={className ?? "flex w-full flex-col items-start gap-2"}>
      {items.map((item, index) => (
        <li key={index} className="flex w-full items-start gap-2">
          <span className="flex shrink-0 items-start pt-1">
            <Icon name={icon} size="sm" />
          </span>
          <p className="min-w-px flex-1 text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {item.label && (
              <span className="font-bold" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                {item.label}{" "}
              </span>
            )}
            {item.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
