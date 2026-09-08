import FrameMobile from "./components/FrameMobile";
import Frame1200 from "./components/Frame1200";
import Frame1440 from "./components/Frame1440";

/**
 * Drie Figma-frames, elk 1:1 overgenomen — geen tussenliggend responsive
 * gedrag verzonnen. Bewust gat tussen 600-1199px: geen ontwerp voor dat
 * bereik aanwezig in Figma, dus daar wordt niets getoond.
 *
 *   46:2   ("iPhone 16 - 1", 0–599px)     → FrameMobile
 *   5:111  ("1200 - 1439", 1200–1439px)   → Frame1200
 *   13:217 ("1440 - 1799", ≥1440px)       → Frame1440
 *
 * Node 4:2 (het oude "1440+"-ontwerp) bestaat niet meer in Figma — is
 * vervangen door 13:217. Er is geen apart ontwerp voor ≥1800px, dus
 * Frame1440 blijft ook daarboven gelden (geen bovengrens), zelfde rol
 * als het oude 4:2 had.
 */
export default function ElisePage() {
  return (
    <>
      <div className="block b600:hidden bg-[#ECEBE5]" data-node-id="46:2" data-name="iPhone 16 - 1">
        <FrameMobile />
      </div>
      <div
        className="hidden b1200:block b1440:hidden bg-[#ECEBE5]"
        data-node-id="5:111"
        data-name="1200 - 1439"
      >
        <Frame1200 />
      </div>
      <div className="hidden b1440:block bg-[#ECEBE5]" data-node-id="13:217" data-name="1440 - 1799">
        <Frame1440 />
      </div>
    </>
  );
}
