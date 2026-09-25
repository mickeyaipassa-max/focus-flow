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

function FooterLinkColumn({ column }: { column: FooterColumn }) {
  return (
    <div className="flex flex-1 flex-col items-start gap-2">
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
  );
}

function FooterAppBadgesColumn({ className }: { className?: string }) {
  return (
    <div className={className ?? "flex flex-1 flex-col items-start gap-2"}>
      <p className="text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
        a.s.r. app
      </p>
      <div className="flex flex-wrap items-start gap-3">
        <img src="/badges/app-store-nl.svg" alt="Download in de App Store" className="h-12 w-36" />
        <img src="/badges/google-play-nl.svg" alt="Ontdek het op Google Play" className="h-12 w-[162px]" />
      </div>
    </div>
  );
}

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
  /**
   * Centreert de inhoud op 1200px (achtergrond blijft edge-to-edge) i.p.v.
   * de bestaande responsieve-padding-schaal — nodig voor pagina's als
   * `/aichat` waar élke sectie (header, hero, tiles, FAQ, contact) al op
   * dezelfde `mx-auto max-w-[1200px]`-breedte staat: zonder deze prop trok
   * de footer op brede viewports (>1456px) breder dan de rest van de
   * pagina, want de bestaande padding-schaal begrenst de inhoud niet echt,
   * alleen de marge. Standaard `false` = exact het bestaande gedrag voor
   * alle funnels, die dit probleem niet hebben (hun content is altijd
   * smaller dan 1200px).
   */
  centered?: boolean;
};

export function Footer({ className, columns, showAppBadges, centered = false }: FooterProps) {
  const content = (
    <>
      {columns && columns.length > 0 && (
        <>
          {/* Bestaande enkele rij van kolommen — ongewijzigd onder 900px, en weer vanaf 1440px (bevestigd via Figma's aparte 900px- en 1200px-breakpointframes, die beide tussen 900-1439px dezelfde gesplitste indeling tonen). */}
          <div className="flex w-full flex-col items-start gap-8 min-[900px]:hidden min-[1440px]:flex">
            {columns.map((column) => (
              <FooterLinkColumn key={column.title} column={column} />
            ))}
            {showAppBadges && <FooterAppBadgesColumn />}
          </div>

          {/* Tussen 900-1439px splitst Figma dit in twee rijen: de kolommen op één rij (gap 16px), de app-badges op een eigen rij daaronder (gap 40px) — bevestigd via node 50:2075 (1200-1439px) en 54:5294 (900-1199px). */}
          <div className="hidden w-full flex-col items-start gap-10 min-[900px]:flex min-[1440px]:hidden">
            <div className="flex w-full items-start gap-4">
              {columns.map((column) => (
                <FooterLinkColumn key={column.title} column={column} />
              ))}
            </div>
            {showAppBadges && <FooterAppBadgesColumn />}
          </div>
        </>
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
    </>
  );

  if (centered) {
    return (
      <footer className={className ?? "flex w-full flex-col items-center bg-white px-32 py-8"}>
        <div className="flex w-full max-w-[1200px] flex-col items-start gap-8">{content}</div>
      </footer>
    );
  }

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
      {content}
    </footer>
  );
}
