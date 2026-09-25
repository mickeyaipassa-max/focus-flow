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
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Kruimelpad" className={className ?? "w-full px-32 py-6"}>
      <ol className="mx-auto flex max-w-[1200px] items-center gap-1">
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
    </nav>
  );
}
