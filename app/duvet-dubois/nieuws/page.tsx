import Frame900 from "./components/Frame900";
import Frame1200 from "./components/Frame1200";
import Frame1440 from "./components/Frame1440";

/**
 * Same pattern as /duvet-dubois en /duvet-dubois/over-ons: drie losse
 * Figma-frames (900-1199 / 1200-1439 / 1440+), 1:1 overgenomen,
 * zichtbaarheidsgrenzen op de framegrenzen zelf. Breedte/hoogte komt
 * letterlijk uit Figma's eigen frame-canvas:
 *   Nieuws — 900-1199  → 1024 x 3482
 *   Nieuws — 1200-1439 → 1200 x 3650
 *   Nieuws — 1440+     → 1440 x 3650
 */
export default function NieuwsPage() {
  return (
    <main>
      <div className="hidden b900:block b1200:hidden relative w-[1024px] h-[3482px] mx-auto">
        <Frame900 />
      </div>
      <div className="hidden b1200:block b1440:hidden relative w-[1200px] h-[3650px] mx-auto">
        <Frame1200 />
      </div>
      <div className="hidden b1440:block relative w-full h-[3650px]">
        <Frame1440 />
      </div>
    </main>
  );
}
