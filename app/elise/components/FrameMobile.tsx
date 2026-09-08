const imgBanner = "/elise/assets/banner-hero.png";
const imgGallery1 = "/elise/assets/gallery-1.png";
const imgGallery2 = "/elise/assets/gallery-2.png";
const imgGallery3 = "/elise/assets/gallery-3.png";
const imgPortrait = "/elise/assets/portrait-large.png";

/**
 * Figma-node 46:2 ("iPhone 16 - 1"), voor viewport 0–599px. Referentie-
 * breedte 393px, maar body is hier fluid (`px-[24px]` marge, geen vaste
 * kolombreedte zoals bij de grotere breakpoints) — logisch, gezien het
 * enorme breedtebereik van telefoons (320–599px) dat dit ene ontwerp
 * moet dekken. Bewust gat tussen 600-1199px: geen ontwerp voor dat
 * bereik aanwezig in Figma.
 *
 * Hero-foto: vaste hoogte (506px, zelfde "vaste hoogte i.p.v. aspect-
 * ratio"-principe als de andere breakpoints), maar de crop is hier veel
 * agressiever ingezoomd dan op desktop (geverifieerd met een losse
 * screenshot van node 46:3 — duidelijk dichter op het gezicht).
 * Letterlijke Figma-transform overgenomen (`w-[211.7%] h-[105.12%]
 * left--65.14% top--5.33%`) i.p.v. object-cover: percentages zijn
 * relatief aan de eigen box, schalen dus vanzelf netjes mee met elke
 * telefoonbreedte — geen aparte berekening nodig zoals bij de bleed-
 * situaties op desktop. Bronfoto is bevestigd identiek aan
 * banner-hero.png (zelfde MD5-hash als het desktop-asset).
 *
 * Headline en quote-kader zijn hier geen flex-rij zoals bij de grotere
 * breakpoints — losse elementen, maar wel beide op exact de bodymarge
 * (24px) vanaf de rand: headline `left-[24px]`, kader `right-[24px]`.
 * Omdat de body zelf al fluid is (vaste marge, geen vaste breedte),
 * is een aparte "body-wrapper" zoals bij desktop hier niet nodig — een
 * simpele vaste inset vanaf de viewportrand komt op elke telefoon-
 * breedte overeen met de bodyrand.
 *
 * Content-secties (Gallery/Quote/Portret/Tekstblok/Verjaardagstekst)
 * staan verticaal gestapeld met een consistente 40px gap (geverifieerd:
 * exact 40px tussen alle vijf blokken), 10px padding-top, 80px padding-
 * bottom. Layout wijkt op een paar plekken af van desktop: de 3
 * galerijfoto's staan onder elkaar i.p.v. naast elkaar, en het zwarte
 * tekstblok staat ónder de grote foto i.p.v. ernaast (volle breedte
 * i.p.v. vaste 511px).
 */
export default function FrameMobile() {
  return (
    <>
      <section className="relative w-full" data-node-id="46:3">
        <div className="relative h-[506px] w-full overflow-hidden">
          <img
            alt=""
            src={imgBanner}
            className="pointer-events-none absolute left-[-65.14%] top-[-5.33%] h-[105.12%] w-[211.7%] max-w-none"
          />
          <p
            className="absolute left-1/2 top-[22px] w-full -translate-x-1/2 text-center text-[18px] font-light text-white tracking-[22.68px]"
            data-node-id="46:5"
          >
            BY ELISE
          </p>
          <div
            className="absolute left-[24px] top-[156px] w-[327px] text-[32px] font-light leading-[1.11] text-white tracking-[5.76px]"
            data-node-id="46:13"
          >
            <p>Create from </p>
            <p>presence, </p>
            <p>not pressure</p>
          </div>
          <div
            className="absolute right-[24px] top-[329px] flex size-[153px] items-end justify-end bg-white p-[16px]"
            data-node-id="46:10"
          >
            <p className="text-right text-[14px] font-light uppercase tracking-[2.52px] text-black">
              There is freedom in being seen without performing
            </p>
          </div>
        </div>
        <div className="h-[40px] w-full" />
      </section>

      <div className="flex w-full flex-col gap-[40px] px-[24px] pb-[80px] pt-[10px]">
        <div className="flex flex-col gap-[24px]" data-node-id="46:33">
          <div className="flex flex-col gap-[8px] font-light text-black">
            <p className="text-[32px] uppercase leading-[1.2] tracking-[5.76px]" data-node-id="46:35">
              Behind the Surface
            </p>
            <p className="text-[14px] leading-[1.5]" data-node-id="46:36">
              Letting go of expectations to make space for authenticity, presence, and creative freedom.
            </p>
          </div>
          <div className="flex flex-col gap-[24px]" data-node-id="46:37">
            <div className="relative aspect-[416/517] w-full" data-node-id="46:38">
              <img alt="" src={imgGallery1} className="pointer-events-none absolute inset-0 size-full object-cover" />
            </div>
            <div className="relative aspect-[416/517] w-full" data-node-id="46:39">
              <img alt="" src={imgGallery2} className="pointer-events-none absolute inset-0 size-full object-cover" />
            </div>
            <div className="relative aspect-[416/517] w-full" data-node-id="46:40">
              <img
                alt=""
                src={imgGallery3}
                className="pointer-events-none absolute inset-0 size-full object-cover object-bottom"
              />
            </div>
          </div>
        </div>

        <div
          className="w-full text-[40px] uppercase leading-[1.2] tracking-[7.2px] text-black"
          data-node-id="46:45"
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

        <div className="relative aspect-[552/798] w-full" data-node-id="46:47">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              alt=""
              src={imgPortrait}
              className="absolute left-[-7.42%] top-0 h-full w-[114.37%] max-w-none"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-[8px] bg-black p-[24px] font-light text-[#ECEBE5]" data-node-id="46:50">
          <p className="text-[32px] tracking-[5.76px]" data-node-id="46:51">
            BY ELISE
          </p>
          <p className="text-[14px] leading-[1.5]" data-node-id="46:52">
            is about letting go of expectations and revealing what lies beneath the surface. By slowing down and being present, we create space for authenticity, curiosity, and creative freedom.
          </p>
        </div>

        <div
          className="w-full text-[16px] font-light tracking-[2.88px] text-black"
          data-node-id="46:59"
        >
          <p className="leading-[1.11]">Geloof een beetje meer in jezelf. Ik doe het in ieder geval al. ❤️</p>
          <p className="leading-[1.11]">Gefeliciteerd je verjaardag! Liefs Mick, Koda en Roku</p>
        </div>
      </div>
    </>
  );
}
