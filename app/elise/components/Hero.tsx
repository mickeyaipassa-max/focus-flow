const imgBanner = "/elise/assets/banner.png";

/**
 * Node 5:26 in Figma is een oversized "fill"-blok (2125×1495px, offset
 * -22/-116) dat door het frame wordt afgesneden tot een zichtbaar beeld
 * van 1920×1379px — geverifieerd met get_screenshot op node 5:26
 * (original_width/height 1920×1379). Daaronder volgt nog 114px effen
 * achtergrondkleur voordat "Behind the Surface" begint (1493 - 1379).
 *
 * Fotocontainer: `h-[1379px] w-full` — vaste hoogte, alleen de breedte
 * is fluid. De foto zelf gebruikt `object-cover object-top` om die box
 * altijd te vullen (crop past zich aan de breedte aan, hoogte blijft
 * exact Figma's 1379px), zelfde crop-ankerpunt als Figma (vanaf boven).
 *
 * Wordmark, headline (5:28) en quote-kader (5:39) liggen op Figma's
 * eigen absolute px-positie t.o.v. de volle-breedte hero (niet t.o.v.
 * de 1600px-inhoudskolom hieronder, die tussen 1440-1599px meekrimpt en
 * daarboven centreert). Eerdere versie hing deze tekst in die kolom —
 * daardoor verschoof de tekst mee zodra de kolom van breedte/marge
 * veranderde, terwijl de foto zelf altijd edge-to-edge blijft. Vast
 * op `left-[191px]` / `right-[162px]` (Figma's letterlijke 1920px-
 * referentiewaarden) staat de tekst nu op elke viewportbreedte op
 * exact dezelfde afstand tot de rand van de fótó — dus nooit meer
 * beweging, wél nog steeds een fluid, volledige breedte hero.
 */
export default function Hero() {
  return (
    <section className="relative w-full" data-node-id="5:26">
      <div className="relative h-[1379px] w-full overflow-hidden">
        <img
          alt=""
          src={imgBanner}
          className="pointer-events-none absolute inset-0 size-full object-cover object-top"
        />
        <p
          className="absolute left-1/2 top-[45px] h-[64px] w-[575px] -translate-x-1/2 text-center text-[32px] font-light text-white tracking-[40.32px]"
          data-node-id="5:23"
        >
          BY ELISE
        </p>
        <div
          className="absolute left-[191px] top-[470px] h-[323px] w-[1403px] text-[80px] font-light leading-[normal] text-white tracking-[14.4px]"
          data-node-id="5:28"
        >
          <p>Create from </p>
          <p>presence, </p>
          <p>not pressure</p>
        </div>
        <div
          className="absolute right-[162px] top-[970px] flex h-[273px] w-[273px] items-end justify-end bg-white p-[40px]"
          data-node-id="5:39"
        >
          <p className="w-[193px] text-right text-[24px] font-light uppercase tracking-[4.32px] text-black">
            There is freedom in being seen without performing
          </p>
        </div>
      </div>
      <div className="h-[114px] w-full" />
    </section>
  );
}
