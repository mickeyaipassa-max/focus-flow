const imgBanner = "/elise/assets/banner.png";

/**
 * Node 5:26 in Figma is een vast 2125×1495px "fill"-blok met een eigen
 * zoom/crop-percentage, gekalibreerd op het 1920px-referentiecanvas — dat
 * werkt niet meer zodra deze sectie edge-to-edge over een variabele
 * viewportbreedte moet lopen (het enige stuk dat bewust buiten de
 * 1600px-kolom breekt, zie ElisePage). Daarom hier vervangen door een
 * simpele fluid full-bleed `object-cover`: zelfde art-directed crop-
 * intentie (foto vult het vlak, afgesneden waar nodig), maar werkt op
 * elke breedte ≥1440px i.p.v. alleen op precies 1920px.
 *
 * Wordmark, headline en het quote-kader liggen wél weer in de gewone
 * 1600px-kolom (mx-auto), zodat ze op dezelfde grid staan als de rest
 * van de pagina — ze overlappen alleen visueel de full-bleed foto.
 */
export default function Hero() {
  return (
    <section className="relative h-[1493px] w-full overflow-hidden" data-node-id="5:26">
      <img
        alt=""
        src={imgBanner}
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      <div className="relative mx-auto h-full w-[1600px]">
        <p
          className="absolute left-1/2 top-[45px] h-[64px] w-[575px] -translate-x-1/2 text-center text-[32px] font-light text-white tracking-[40.32px]"
          data-node-id="5:23"
        >
          BY ELISE
        </p>
        <div
          className="absolute left-[31px] top-[470px] h-[323px] w-[1403px] text-[80px] font-light leading-[1.15] text-white tracking-[14.4px]"
          data-node-id="5:28"
        >
          <p>Create from </p>
          <p>presence, </p>
          <p>not pressure</p>
        </div>
        <div
          className="absolute left-[1325px] top-[970px] flex h-[273px] w-[273px] items-end justify-end bg-white p-[40px]"
          data-node-id="5:39"
        >
          <p className="w-[193px] text-right text-[24px] font-light uppercase tracking-[4.32px] text-black">
            There is freedom in being seen without performing
          </p>
        </div>
      </div>
    </section>
  );
}
