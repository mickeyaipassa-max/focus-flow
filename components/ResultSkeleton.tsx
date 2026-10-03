const bar = "motion-safe:animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]";
const row = "motion-safe:animate-pulse w-full rounded-md bg-[rgba(0,0,0,0.06)]";

/**
 * Rijhoogtes per breakpoint (<600px / 600-899px / vanaf 900px), gemeten aan het
 * echte resultaat (5 bestanden): de skeleton is zo hoog als het resultaat, zodat
 * de pagina eronder niet verspringt als het resultaat verschijnt. Bij andere
 * teksten kunnen de echte hoogtes iets afwijken; dit is een benadering.
 */
const ROW_HEIGHTS = [
  "h-[216px] min-[600px]:h-[152px] min-[900px]:h-[77px]",
  "h-[240px] min-[600px]:h-[152px] min-[900px]:h-[101px]",
  "h-[216px] min-[600px]:h-[101px] min-[900px]:h-[77px]",
  "h-[384px] min-[600px]:h-[197px] min-[900px]:h-[125px]",
  "h-[312px] min-[600px]:h-[173px] min-[900px]:h-[125px]",
];

function SkeletonBlock({ rows, headingWidth }: { rows: number[]; headingWidth: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`${bar} h-7`} style={{ width: headingWidth }} />
      {rows.map((index) => (
        <div key={index} className={`${row} ${ROW_HEIGHTS[index]}`} />
      ))}
    </div>
  );
}

/**
 * Laadstaat van de resultaatkaart op /voorwaarden: zelfde witte kaart en
 * zelfde opbouw als het echte resultaat (hoofdtitel + drie blokken met 1, 2 en
 * 2 bestanden). Zelfde balk-stijl als `ProductAccordionSkeleton`, met
 * `motion-safe:` zodat de puls bij `prefers-reduced-motion` uitblijft.
 */
export function ResultSkeleton() {
  return (
    <div
      role="status"
      className="flex w-full flex-col gap-12 rounded-md bg-white p-6 shadow-[0px_4px_8px_rgba(0,0,0,0.12)] min-[600px]:p-10"
    >
      <span className="sr-only">Voorwaarden en documenten worden geladen</span>
      <div aria-hidden="true" className="flex flex-col gap-12">
        <div className={`${bar} h-8 min-[600px]:h-[31px]`} style={{ width: 360, maxWidth: "100%" }} />
        <SkeletonBlock rows={[0]} headingWidth={200} />
        <SkeletonBlock rows={[1, 2]} headingWidth={240} />
        <SkeletonBlock rows={[3, 4]} headingWidth={180} />
      </div>
    </div>
  );
}
