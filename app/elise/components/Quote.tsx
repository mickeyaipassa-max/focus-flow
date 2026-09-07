/**
 * Node 5:41 — tekstinhoud en het gemengde Light/Medium-gewicht per woord
 * letterlijk uit Figma overgenomen ("freedom is" en "nothing" en "to
 * perform" zijn Medium, de rest ExtraLight). uppercase komt via CSS,
 * de onderliggende tekst-nodes zelf zijn niet in hoofdletters.
 */
export default function Quote() {
  return (
    <div
      className="mt-[163px] w-full text-[80px] uppercase leading-[1.2] tracking-[14.4px] text-black"
      data-node-id="5:40"
    >
      <p>
        <span className="font-extralight">Maybe </span>
        <span className="font-medium">freedom </span>
        <span className="font-medium">is</span>
        <span className="font-extralight"> simply </span>
      </p>
      <p>
        <span className="font-extralight">having </span>
        <span className="font-medium">nothing </span>
        <span className="font-extralight">left </span>
      </p>
      <p className="font-medium">to perform</p>
    </div>
  );
}
