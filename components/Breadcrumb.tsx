import { Icon } from "./Icon";

export type BreadcrumbItem = {
  label: string;
  onClick?: () => void;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

/**
 * Bevestigd via Figma Make-broncode ("service-hub-page.md"): "Home" › "Breadcrumb item" ×3 ›
 * "Current page" (laatste in gray-660, niet klikbaar), chevron-right 16px als separator.
 *
 * Onder 600px toont Figma (node 56:9267) niet de volledige keten, maar één
 * "← [vorige stap]"-terugknop — bevestigd: linkt naar de stap vlak vóór de
 * huidige pagina, niet vast naar "Home". Bij een keten van slechts 1 item
 * (geen vorige stap) wordt op mobiel niets getoond, exact zoals de volledige
 * keten dan ook niets zinnigs te tonen heeft.
 *
 * Onderrand van deze nav is onder 600px 0 i.p.v. de gebruikelijke 24px —
 * samen met de Hero-sectie's `pt-0` op mobiel (page.tsx) staat de H1 dan
 * direct tegen de breadcrumb aan, exact zoals Figma's mobiele frame
 * (56:9265: Breadcrumb eindigt op y=120, Hero begint direct daarna op
 * diezelfde y=120, dus 0px tussenruimte).
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const previous = items.length > 1 ? items[items.length - 2] : null;

  return (
    <nav
      aria-label="Kruimelpad"
      className={className ?? "w-full px-6 pt-6 pb-0 min-[600px]:px-12 min-[600px]:pb-6 min-[900px]:px-16 min-[1200px]:px-32"}
    >
      <ol className="mx-auto hidden max-w-[1200px] items-center gap-1 min-[600px]:flex">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.onClick && !isLast ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-black text-sm leading-[1.5] hover:underline"
                  style={{ fontFamily: "var(--font-avenir-book)" }}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={isLast ? "text-[#565656] text-sm leading-[1.5]" : "text-black text-sm leading-[1.5]"}
                  style={{ fontFamily: "var(--font-avenir-book)" }}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <Icon name="chevron-right" size="sm" />}
            </li>
          );
        })}
      </ol>

      {previous && (
        <ol className="mx-auto flex max-w-[1200px] items-center min-[600px]:hidden">
          <li>
            {previous.onClick ? (
              <button
                type="button"
                onClick={previous.onClick}
                className="flex items-center gap-1 text-black text-sm leading-[1.5] hover:underline"
                style={{ fontFamily: "var(--font-avenir-book)" }}
              >
                <Icon name="arrow-left" size="sm" />
                {previous.label}
              </button>
            ) : (
              <span
                className="flex items-center gap-1 text-black text-sm leading-[1.5]"
                style={{ fontFamily: "var(--font-avenir-book)" }}
              >
                <Icon name="arrow-left" size="sm" />
                {previous.label}
              </span>
            )}
          </li>
        </ol>
      )}
    </nav>
  );
}
