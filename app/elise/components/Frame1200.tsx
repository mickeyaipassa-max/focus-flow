const imgBanner = "/elise/assets/banner.png";
const imgGallery1 = "/elise/assets/gallery-1.png";
const imgGallery2 = "/elise/assets/gallery-2.png";
const imgGallery3 = "/elise/assets/gallery-3.png";
const imgPortrait = "/elise/assets/portrait-large.png";

/**
 * Figma-node 5:111 ("MacBook Air - 1"), voor viewport 1200–1439px.
 * Zelfde aanpak als de 1440+ variant (Hero/Gallery/Quote/ImageText):
 * body-content vast op 1200px, gecentreerd — alleen de hero (banner-foto
 * met wordmark/headline/quote erover) breekt daaruit en loopt edge-to-
 * edge over de volledige viewportbreedte. Figma geeft dit breakpoint
 * eigen, kleinere maten (fontsize/tracking/gap) t.o.v. de 1440+-versie —
 * die zijn hier 1:1 overgenomen, niet berekend of geschaald vanuit de
 * andere breakpoint.
 *
 * Hergebruikt dezelfde brondown-beeldbestanden als de 1440+-route:
 * identieke foto's (zelfde crop-percentages in Figma bevestigen dit),
 * Figma exporteerde alleen een andere resolutie per frame.
 *
 * De banner-foto (5:112) is, net als bij de 1440+ Hero, een oversized
 * fill-blok dat door het frame wordt afgesneden tot een zichtbaar beeld
 * van 1436×895px (geverifieerd met get_screenshot op node 5:112),
 * gevolgd door 92px effen achtergrond (expliciete Figma auto-layout
 * gap) voordat "Behind the Surface" begint. Vaste hoogte + center-crop
 * `object-cover` was dus dubbel fout — nu `aspect-[1439/895]` (fluid
 * breedte, hoogte volgt mee) plus `object-top`, zelfde rekenwerk als
 * bij Hero.tsx.
 */
export default function Frame1200() {
  return (
    <>
      <section className="relative w-full" data-node-id="5:132">
        <div className="relative aspect-[1439/895] w-full overflow-hidden">
          <img
            alt=""
            src={imgBanner}
            className="pointer-events-none absolute inset-0 size-full object-cover object-top"
          />
          <div className="relative mx-auto h-full w-[1200px]">
            <p
              className="absolute left-1/2 top-[45px] h-[64px] w-[575px] -translate-x-1/2 text-center text-[32px] font-light text-white tracking-[40.32px]"
              data-node-id="5:114"
            >
              BY ELISE
            </p>
            <div
              className="absolute left-[11.5px] top-[500px] h-[323px] w-[1403px] text-[72px] font-light leading-[1.11] text-white tracking-[12.96px]"
              data-node-id="5:140"
            >
              <p>Create from </p>
              <p>presence, </p>
              <p>not pressure</p>
            </div>
            <div
              className="absolute left-[961.5px] top-[607px] flex items-end justify-end bg-white p-[24px]"
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
    </>
  );
}
