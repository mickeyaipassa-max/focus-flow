/**
 * Generieke skeleton getoond tijdens de overgang náár een net actief geworden
 * product (2 seconden, gebaseerd op de door de opdrachtgever aangeleverde
 * Figma Make-broncode "Interactive Transition for Calculator"'s
 * `SkeletonForm`) — bewust generiek (niet per product), want op dit moment
 * is nog niet bekend welk product-specifiek scherm er zo dadelijk verschijnt.
 * Dit is een ándere skeleton dan elk product-body's eigen "Gegevens →
 * samenstellen"-skeleton (die blijft product-specifiek, zie bv.
 * `OpstalBody.tsx`): deze hier vervangt de hele body tijdens de overgang
 * tússen twee producten.
 */
export function ProductAccordionSkeleton() {
  return (
    <div className="flex w-full flex-col gap-8 px-10 py-10 pb-10" aria-hidden="true">
      <div className="h-8 w-48 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" />
      {[200, 160, 280, 240, 200].map((width, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="h-5 animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.08)]" style={{ width }} />
          <div className="h-[51px] w-[160px] animate-pulse rounded-[3px] bg-[rgba(0,0,0,0.06)]" />
        </div>
      ))}
    </div>
  );
}
