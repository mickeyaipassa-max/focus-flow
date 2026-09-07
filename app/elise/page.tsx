import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Quote from "./components/Quote";
import ImageText from "./components/ImageText";
import Frame1200 from "./components/Frame1200";

/**
 * Twee losse Figma-frames, elk 1:1 overgenomen — geen tussenliggend
 * responsive gedrag verzonnen. Er bestaat geen ontwerp onder 1200px,
 * dus daaronder wordt niets getoond.
 *
 *   5:111 ("1200 - 1439", 1200–1439px)     → Frame1200
 *   4:2   ("Slide 16:9 - 3", 1440px+)      → Hero/Gallery/Quote/ImageText
 *
 * Beide volgen hetzelfde patroon: body-content in een vaste kolom
 * (1200px resp. 1600px), gecentreerd — alleen de hero (banner-foto met
 * wordmark/headline/quote erover) breekt daaruit en loopt edge-to-edge
 * over de volledige viewportbreedte.
 */
export default function ElisePage() {
  return (
    <>
      <div
        className="hidden b1200:block b1440:hidden bg-[#ECEBE5]"
        data-node-id="5:111"
        data-name="1200 - 1439"
      >
        <Frame1200 />
      </div>
      <div className="hidden b1440:block bg-[#ECEBE5]" data-node-id="4:2" data-name="Slide 16:9 - 3">
        <Hero />
        <div className="mx-auto w-full max-w-[1600px]">
          <Gallery />
          <Quote />
          <ImageText />
        </div>
      </div>
    </>
  );
}
