import { Icon } from "./Icon";

type FooterButtonProps = {
  label: string;
  children?: React.ReactNode;
};

/**
 * Figma's eigen "Footer Link"-component modelleert dit als een <div>
 * (default) resp. <button> (hover) zonder href/URL-informatie — geen
 * <a>. Ik volg dat: een niet-navigerende knop, zonder verzonnen href.
 * Hover-styling (underline + gray-840) is wél een bevestigde Figma-state
 * en puur CSS, dus als :hover geïmplementeerd.
 */
function FooterButton({ label, children }: FooterButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center justify-center whitespace-nowrap text-sm text-black leading-[1.5] hover:text-[#2a292e] hover:underline"
      style={{ fontFamily: "var(--font-avenir)" }}
    >
      {children ?? label}
    </button>
  );
}

const LEGAL_LINKS = ["Disclaimer", "Privacyverklaring", "Cookies", "Toegankelijkheid", "Veilig online"];

export type FooterColumn = {
  title: string;
  links: string[];
};

type FooterProps = {
  className?: string;
  /**
   * Optionele link-kolommen boven de bestaande onderbalk (legal links +
   * social + mini-logo, die ongewijzigd blijven) — bevestigd via Figma Make-
   * broncode ("service-hub-page.md") voor de Service hub-pagina. Geen enkele
   * bestaande funnel gebruikt dit, dus standaard `undefined` = exact het
   * huidige, ongewijzigde gedrag i.p.v. een aparte footer te dupliceren.
   */
  columns?: FooterColumn[];
  /** Toont de App Store/Google Play-badges als 4e kolom, naast `columns`. */
  showAppBadges?: boolean;
};

export function Footer({ className, columns, showAppBadges }: FooterProps) {
  return (
    <footer
      className={
        className ??
        [
          "flex flex-col items-start gap-6 bg-white p-6",
          "min-[600px]:px-12",
          "min-[900px]:px-16",
          "min-[1200px]:gap-8 min-[1200px]:px-32 min-[1200px]:py-8",
        ].join(" ")
      }
    >
      {columns && columns.length > 0 && (
        <div className="flex w-full flex-col items-start gap-8 min-[900px]:flex-row">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-1 flex-col items-start gap-2">
              <p className="text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                {column.title}
              </p>
              {column.links.map((link) => (
                <button
                  key={link}
                  type="button"
                  className="text-left text-[#2a292e] text-lg leading-[1.5] hover:underline"
                  style={{ fontFamily: "var(--font-avenir-book)" }}
                >
                  {link}
                </button>
              ))}
            </div>
          ))}
          {showAppBadges && (
            <div className="flex flex-1 flex-col items-start gap-2">
              <p className="text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                a.s.r. app
              </p>
              <div className="flex flex-wrap items-start gap-3">
                <img src="/badges/app-store-nl.svg" alt="Download in de App Store" className="h-12 w-36" />
                <img src="/badges/google-play-nl.svg" alt="Ontdek het op Google Play" className="h-12 w-[162px]" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Links + copyright */}
      <div className="flex w-full flex-col items-start gap-6 min-[900px]:flex-row min-[900px]:items-start min-[900px]:gap-8">
        <div className="flex flex-wrap content-start items-start gap-x-5 gap-y-2 min-[900px]:flex-1">
          {LEGAL_LINKS.map((label) => (
            <FooterButton key={label} label={label} />
          ))}
        </div>
        <p
          className="w-full text-right text-sm text-[#565656] leading-[1.5] whitespace-nowrap min-[900px]:w-auto"
          style={{ fontFamily: "var(--font-avenir)" }}
        >
          © 1720 - 2026 a.s.r.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#e5e5e5]" />

      {/* Social iconen + mini-logo */}
      <div className="flex h-4 w-full items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FooterButton label="Instagram">
            <Icon name="instagram" size="sm" alt="Instagram" />
          </FooterButton>
          <FooterButton label="YouTube">
            <Icon name="youtube" size="sm" alt="YouTube" />
          </FooterButton>
          <FooterButton label="Facebook">
            <Icon name="facebook" size="sm" alt="Facebook" />
          </FooterButton>
          <FooterButton label="X">
            <Icon name="x" size="sm" alt="X" />
          </FooterButton>
          <FooterButton label="LinkedIn">
            <Icon name="linkedin" size="sm" alt="LinkedIn" />
          </FooterButton>
        </div>

        <div className="relative h-4 w-[133.751px]" role="img" aria-label="a.s.r. — Wijzer in geldzaken">
          <img src="/footer/logo-mini-1.svg" alt="" className="absolute inset-[0_91.33%_38.96%_0] h-auto w-auto" />
          <img src="/footer/logo-mini-2.svg" alt="" className="absolute inset-[21.68%_94.82%_64.24%_3.49%] h-auto w-auto" />
          <img src="/footer/logo-mini-3.svg" alt="" className="absolute inset-[14.6%_50.65%_0_10.58%] h-auto w-auto" />
          <img src="/footer/logo-mini-4.svg" alt="" className="absolute inset-[13.34%_0_0_52.82%] h-auto w-auto" />
        </div>
      </div>
    </footer>
  );
}
