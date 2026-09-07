import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Quote from "./components/Quote";
import ImageText from "./components/ImageText";

/**
 * Figma-node 4:2 ("Slide 16:9 - 3"), 1:1 overgenomen — statische
 * presentatie, alleen voor viewport ≥1440 (er bestaat geen ontwerp voor
 * kleinere breedtes, dus die worden hier niet bediend).
 *
 * Body-content zit in een vaste 1600px kolom, gecentreerd — exact zoals
 * in Figma (1600px content in een 1920px canvas, 160px marge links/
 * rechts). Alleen de hero (banner-foto met wordmark/headline/quote
 * erover) breekt daaruit en loopt edge-to-edge over de volledige
 * viewportbreedte.
 */
export default function ElisePage() {
  return (
    <div className="hidden b1440:block bg-[#ECEBE5]" data-node-id="4:2" data-name="Slide 16:9 - 3">
      <Hero />
      <div className="mx-auto w-[1600px]">
        <Gallery />
        <Quote />
        <ImageText />
      </div>
    </div>
  );
}
