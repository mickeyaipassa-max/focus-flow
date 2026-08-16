import FrameMobile from "./components/FrameMobile";
import Frame900 from "./components/Frame900";
import Frame1200 from "./components/Frame1200";
import Frame1440 from "./components/Frame1440";

/**
 * Same pattern as /duvet-dubois: four losse Figma-frames (<900 mobiel /
 * 900-1199 / 1200-1439 / 1440+), 1:1 overgenomen, zichtbaarheidsgrenzen op de
 * framegrenzen zelf. Breedte/hoogte komt letterlijk uit Figma's eigen
 * frame-canvas:
 *   Over ons — mobiel ("max 600") → 393 x 4979
 *   Over ons — 900-1199  → 1024 x 3668
 *   Over ons — 1200-1439 → 1200 x 3405
 *   Over ons — 1440+     → 1440 x 3454
 *
 * Het mobiele frame dekt (net als op de homepage) bewust het volledige
 * bereik onder 900px, ondanks dat het Figma-frame zelf "max 600" heet —
 * zie de toelichting in app/duvet-dubois/page.tsx.
 */
export default function OverOnsPage() {
  return (
    <main>
      <div className="block b900:hidden relative w-[393px] h-[4979px] mx-auto">
        <FrameMobile />
      </div>
      <div className="hidden b900:block b1200:hidden relative w-[1024px] h-[3668px] mx-auto">
        <Frame900 />
      </div>
      <div className="hidden b1200:block b1440:hidden relative w-[1200px] h-[3405px] mx-auto">
        <Frame1200 />
      </div>
      <div className="hidden b1440:block relative w-full h-[3454px]">
        <Frame1440 />
      </div>
    </main>
  );
}
