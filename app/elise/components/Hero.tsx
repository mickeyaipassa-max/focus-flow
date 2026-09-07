const imgBanner = "/elise/assets/banner.png";

/**
 * Node 5:26 in Figma is een oversized "fill"-blok (2125×1495px, offset
 * -22/-116) dat door het frame wordt afgesneden tot een zichtbaar beeld
 * van 1920×1379px — geverifieerd met get_screenshot op node 5:26
 * (original_width/height 1920×1379). Daaronder volgt nog 114px effen
 * achtergrondkleur voordat "Behind the Surface" begint (1493 - 1379).
 *
 * Eerdere versie gebruikte een vaste hoogte (1493px, inclusief die
 * 114px als beeld) met center-crop `object-cover` — dubbel fout: de
 * hoogte was niet fluid (klopte alleen precies op 1920px breed) én de
 * crop week af van Figma (verkeerde 114px meegerekend, en gecentreerd
 * i.p.v. Figma's eigen crop-ankerpunt).
 *
 * Fix: de foto-container krijgt `aspect-[1920/1379]` (breedte fluid,
 * hoogte volgt automatisch mee, geen vaste px) en `object-top`. Rekenwerk
 * (bronfoto 1022×1290 "cover" in een 1920×1379-vlak) komt uit op
 * exact dezelfde schaal als Figma's eigen 187.46%-transform, met alle
 * crop verticaal vanaf onderen — vandaar object-top i.p.v. de
 * CSS-default (center).
 *
 * De 1600px-kolom zelf is `w-full max-w-[1600px]`: krimpt mee tussen
 * 1440–1599px i.p.v. hard afgesneden te worden, vast op 1600px vanaf
 * 1600px viewport. Het quote-kader (5:39) stond origineel op een
 * links-offset (1325px) die uitgaat van de volle 1600px-breedte — bij
 * een smallere kolom viel het kader daardoor buiten beeld. Nu
 * rechts-uitgelijnd (`right-[2px]`, exact Figma's eigen rechtermarge)
 * zodat het op elke kolombreedte tegen de rand blijft staan.
 */
export default function Hero() {
  return (
    <section className="relative w-full" data-node-id="5:26">
      <div className="relative aspect-[1920/1379] w-full overflow-hidden">
        <img
          alt=""
          src={imgBanner}
          className="pointer-events-none absolute inset-0 size-full object-cover object-top"
        />
        <div className="relative mx-auto h-full w-full max-w-[1600px]">
          <p
            className="absolute left-1/2 top-[45px] h-[64px] w-[575px] -translate-x-1/2 text-center text-[32px] font-light text-white tracking-[40.32px]"
            data-node-id="5:23"
          >
            BY ELISE
          </p>
          <div
            className="absolute left-[31px] top-[470px] h-[323px] w-[1403px] text-[80px] font-light leading-[normal] text-white tracking-[14.4px]"
            data-node-id="5:28"
          >
            <p>Create from </p>
            <p>presence, </p>
            <p>not pressure</p>
          </div>
          <div
            className="absolute right-[2px] top-[970px] flex h-[273px] w-[273px] items-end justify-end bg-white p-[40px]"
            data-node-id="5:39"
          >
            <p className="w-[193px] text-right text-[24px] font-light uppercase tracking-[4.32px] text-black">
              There is freedom in being seen without performing
            </p>
          </div>
        </div>
      </div>
      <div className="h-[114px] w-full" />
    </section>
  );
}
