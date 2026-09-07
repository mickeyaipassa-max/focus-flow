const imgBanner = "/elise/assets/banner-hero.png";
const imgGallery1 = "/elise/assets/gallery-1.png";
const imgGallery2 = "/elise/assets/gallery-2.png";
const imgGallery3 = "/elise/assets/gallery-3.png";
const imgPortrait = "/elise/assets/portrait-large.png";

/**
 * Figma-node 5:111 ("1200 - 1439"), voor viewport 1200–1439px.
 * Herverifieerd via MCP op 2026-09-07 (opnieuw gewijzigd sinds de vorige
 * build): Frame8 heeft geen bleed/offset meer (was -22/-116, nu 0/0,
 * breedte exact gelijk aan het frame) — de banner-foto is dus een
 * gewone `aspect-[2804/1790]`-fill zonder clipping-berekening. Bij
 * referentiebreedte 1440px komt dat uit op hoogte 919px — vaste hoogte
 * i.p.v. aspect-ratio (bewuste keuze, zie Frame1440.tsx), gewone
 * gecentreerde `object-cover` (geen top-anchor: geen asymmetrische crop
 * meer zoals in een eerdere versie).
 *
 * Headline (5:140) en quote-kader (5:142) staan in Figma op absolute
 * px-posities t.o.v. de volle 1439/1440px-frame — maar geverifieerd
 * (net als bij Frame1440.tsx / node 13:247) dat die waarden neerkomen
 * op een vaste positie t.o.v. de 1200px-body (Frame 7), niet t.o.v. de
 * viewport: frame-links 131px - bodymarge 120px = 11px vanaf de
 * bodylinkerrand voor de headline; frame-links 1081px - bodymarge
 * 120px = 961px vanaf de bodylinkerrand voor het kader (rechterrand
 * kader = 961+241=1202, 2px voorbij de bodyrand — Figma's eigen
 * afronding, vergelijkbaar met andere frames). Anders dan bij
 * Frame1440.tsx is dit hier geen flex-rij in Figma — headline en
 * kader zijn losse, onafhankelijk gepositioneerde elementen, alleen
 * beide t.o.v. dezelfde 1200px-bodykolom.
 *
 * Nieuw: persoonlijke verjaardagstekst (11:185) onderaan de hero-
 * wrapper, letterlijk uit Figma overgenomen — 92px marge erboven,
 * 80px marge eronder (Figma's eigen pb-[80px] op Frame8).
 */
export default function Frame1200() {
  return (
    <>
      <section className="relative w-full" data-node-id="5:132">
        <div className="relative h-[919px] w-full overflow-hidden">
          <img
            alt=""
            src={imgBanner}
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
          <p
            className="absolute left-1/2 top-[45px] h-[64px] w-[575px] -translate-x-1/2 text-center text-[32px] font-light text-white tracking-[40.32px]"
            data-node-id="5:114"
          >
            BY ELISE
          </p>
          <div className="absolute left-1/2 top-0 h-full w-[1200px] -translate-x-1/2">
            <div
              className="absolute left-[11px] top-[434px] h-[323px] w-[766px] text-[64px] font-light leading-[1.11] text-white tracking-[11.52px]"
              data-node-id="5:140"
            >
              <p>Create from </p>
              <p>presence, </p>
              <p>not pressure</p>
            </div>
            <div
              className="absolute left-[961px] top-[757px] flex items-end justify-end bg-white p-[24px]"
              data-node-id="5:142"
            >
              <div className="w-[193px] text-right text-[18px] font-light uppercase tracking-[0.9px] text-black">
                <p className="leading-[1.2]">There is freedom </p>
                <p className="leading-[1.2]">in being seen without performing</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[92px] w-full" />
      </section>

      <div className="mx-auto w-[1200px]">
        <div className="flex w-full items-end" data-node-id="5:116">
          <div className="flex flex-1 flex-col items-start font-light text-black" data-node-id="5:117">
            <p className="mb-0 w-full text-[40px] uppercase leading-[1.2] tracking-[7.2px]" data-node-id="5:118">
              Behind the Surface
            </p>
            <p className="w-[367px] text-[18px] leading-[1.5]" data-node-id="5:119">
              Letting go of expectations to make space for authenticity, presence, and creative freedom.
            </p>
          </div>
          <div className="flex h-[317px] w-[790px] items-center justify-center gap-[24px]" data-node-id="5:120">
            <div className="relative aspect-[416/517] min-w-px flex-1" data-node-id="5:121">
              <img alt="" src={imgGallery1} className="pointer-events-none absolute inset-0 size-full object-cover" />
            </div>
            <div className="relative aspect-[416/517] min-w-px flex-1" data-node-id="5:122">
              <img alt="" src={imgGallery2} className="pointer-events-none absolute inset-0 size-full object-cover" />
            </div>
            <div className="relative aspect-[416/517] min-w-px flex-1" data-node-id="5:123">
              <img
                alt=""
                src={imgGallery3}
                className="pointer-events-none absolute inset-0 size-full object-cover object-bottom"
              />
            </div>
          </div>
        </div>

        <div
          className="mt-[92px] w-full text-[72px] uppercase leading-[1.2] tracking-[12.96px] text-black"
          data-node-id="5:128"
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

        <div className="mt-[92px] flex w-full items-end gap-[40px]" data-node-id="5:133">
          <div className="relative aspect-[552/798] flex-1" data-node-id="5:134">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                src={imgPortrait}
                className="absolute left-[-7.42%] top-0 h-full w-[114.37%] max-w-none"
              />
            </div>
          </div>
          <div className="flex w-[511px] flex-col items-start bg-black p-[24px]" data-node-id="5:135">
            <div className="flex w-full flex-col items-start font-light text-[#ECEBE5]" data-node-id="5:136">
              <p className="w-full text-[50px] leading-[1.2] tracking-[9px]" data-node-id="5:137">
                BY ELISE
              </p>
              <p className="w-[367px] text-[18px] leading-[1.5]" data-node-id="5:138">
                is about letting go of expectations and revealing what lies beneath the surface. By slowing down and being present, we create space for authenticity, curiosity, and creative freedom.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-[92px] w-[1000px] pb-[80px] text-[20px] font-light tracking-[3.6px] text-black"
        data-node-id="11:185"
      >
        <p className="leading-[1.11]">Geloof een beetje meer in jezelf. Ik doe het in ieder geval al. ❤️</p>
        <p className="leading-[1.11]">Gefeliciteerd je verjaardag! Liefs Mick, Koda en Roku</p>
      </div>
    </>
  );
}
