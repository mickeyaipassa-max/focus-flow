import type { Metadata } from "next";
import { ZorgverzekeringenContent } from "./ZorgverzekeringenContent";

export const metadata: Metadata = {
  title: "Zorgverzekeringen | a.s.r.",
};

/**
 * Deze pagina is alleen ontworpen voor mobiel (<600px), net als /automobiel.
 *
 * Onder 600px staat de inhoud gewoon op de pagina. Vanaf 600px tonen we dezelfde mobiele pagina gecentreerd in een
 * kolom van 393px: dat is een iframe, omdat de header, footer, breadcrumb en accordions uit de bibliotheek hun mobiele of
 * desktopvariant op de *viewportbreedte* kiezen. Binnen een iframe van 393px is die viewport 393px. De iframe laadt
 * `/zorgverzekeringen/inhoud` (lazy, dus niet op een telefoon).
 */
export default function ZorgverzekeringenPage() {
  return (
    <>
      <div className="min-[600px]:hidden">
        <ZorgverzekeringenContent />
      </div>

      <div className="hidden min-h-dvh items-center justify-center bg-[#f6f6f7] min-[600px]:flex">
        <iframe
          src="/zorgverzekeringen/inhoud"
          title="Zorgverzekeringen, mobiele weergave"
          loading="lazy"
          className="h-dvh max-h-[900px] w-[393px] border-0 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        />
      </div>
    </>
  );
}
