import { Icon } from "./Icon";

export type LinkListItem = {
  label: string;
  href: string;
};

type LinkListProps = {
  items: LinkListItem[];
  className?: string;
};

/**
 * Gebaseerd op Figma's "Link List" (node 28:6233, "Link List > use when
 * linking to external pages or different routes within the site"). Elke
 * regel: chevron-right + label + new-tab-icoon, alle drie in blauw
 * (`#0064a8`) — bevestigd via `get_design_context`, geen `underline` op de
 * tekst zelf (dat is expliciet alleen bevestigd voor de losse Link-tekst in
 * Select/Input, niet hier), dus `hover:underline` als redelijke, met de rest
 * van deze bibliotheek (FooterButton) consistente hover-aanduiding.
 * `target="_blank"` + `rel` passen bij het new-tab-icoon.
 */
export function LinkList({ items, className }: LinkListProps) {
  return (
    <div className={className ?? "flex w-full max-w-[800px] flex-col items-start gap-2"}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2"
        >
          <span className="flex shrink-0 items-center pt-1">
            <Icon name="chevron-right" size="sm" />
          </span>
          <span className="text-[#0064a8] text-lg leading-[1.5] hover:underline" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {item.label}
          </span>
          <span className="flex shrink-0 items-start pt-1">
            <Icon name="new-tab" size="sm" />
          </span>
        </a>
      ))}
    </div>
  );
}
