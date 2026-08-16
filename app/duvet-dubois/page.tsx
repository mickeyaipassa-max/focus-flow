import FrameMobile from "./components/FrameMobile";
import Frame900 from "./components/Frame900";
import Frame1200 from "./components/Frame1200";
import Frame1440 from "./components/Frame1440";

/**
 * Vier losse Figma-frames (<900 mobiel / 900-1199 / 1200-1439 / 1440+),
 * elk 1:1 overgenomen — geen tussenliggend responsive gedrag verzonnen.
 * Zichtbaarheidsgrenzen liggen exact op de framegrenzen zelf.
 *
 * Breedte/hoogte per frame komt letterlijk uit Figma's eigen
 * frame-canvas (get_screenshot original_width/original_height per
 * node), niet geschat of afgeleid:
 *   50:226 (mobiel, "max 600") → 393 x 6191
 *   1:707  (900-1199)          → 1024 x 3950
 *   1:382  (1200-1439)         → 1200 x 3950
 *   1:55   (1440+)             → 1440 x 3788
 *
 * Het mobiele Figma-frame heet letterlijk "max 600" en er is een
 * bewust, gedocumenteerd gat in het ontwerp tussen 600-899px. In
 * plaats van dat gat in productie leeg te laten, dekt dit mobiele
 * frame het volledige bereik onder 900px (b900:hidden zonder aparte
 * max-w-[599px] afkapping) — bewuste keuze, geen fallback-gedrag.
 */
export default function DuvetDuboisPage() {
  return (
    <main>
      <div className="block b900:hidden relative w-[393px] h-[6191px] mx-auto">
        <FrameMobile />
      </div>
      <div className="hidden b900:block b1200:hidden relative w-[1024px] h-[3950px] mx-auto">
        <Frame900 />
      </div>
      <div className="hidden b1200:block b1440:hidden relative w-[1200px] h-[3950px] mx-auto">
        <Frame1200 />
      </div>
      <div className="hidden b1440:block relative w-full h-[3788px]">
        <Frame1440 />
      </div>
    </main>
  );
}
