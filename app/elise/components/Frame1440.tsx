const imgBanner = "/elise/assets/banner-hero.png";
const imgGallery1 = "/elise/assets/gallery-1.png";
const imgGallery2 = "/elise/assets/gallery-2.png";
const imgGallery3 = "/elise/assets/gallery-3.png";
const imgPortrait = "/elise/assets/portrait-large.png";

/**
 * Figma-node 13:217 ("1440 - 1799"), voor viewport ≥1440px.
 *
 * Vervangt het oude node 4:2 ("Slide 16:9 - 3", ooit gebruikt voor alle
 * viewports ≥1440px) — dat node bestaat niet meer in het Figma-bestand
 * (get_metadata gaf "node not found"). Deze nieuwe "1440 - 1799"-frame
 * is er in de plaats gekomen, en er is geen apart ontwerp voor ≥1800px
 * meer aanwezig, dus dit frame blijft hier ook onbegrensd naar boven
 * toe gelden (`b1440:block`, geen bovengrens) — zelfde rol als het oude
 * node 4:2 had.
 *
 * Referentiebreedte van dit frame is 1799px, maar dat is puur de
 * breedte waarop Figma het gemaakt heeft — geen harde bovengrens in de
 * geïmplementeerde pagina.
 *
 * Zelfde aanpak als Frame1200.tsx: body-content vast op 1300px
 * (Figma's eigen kolombreedte voor dit frame — niet 1200 of 1600),
 * gecentreerd. Hero-foto: vaste hoogte i.p.v. aspect-ratio — Figma's
 * eigen box is 1799×1032 zonder bleed/offset (rekenwerk bevestigt dat
 * de opgegeven verticale zoom/offset (h-111.28%, top--5.64%) wiskundig
 * neerkomt op een gewone gecentreerde `object-cover`-crop, geen
 * speciaal ankerpunt nodig).
 *
 * Headline en quote-kader staan op Figma's eigen absolute px-positie
 * t.o.v. de volle-breedte hero (niet t.o.v. de 1300px-kolom, die zelf
 * recentreert als de viewport breder wordt dan 1799px) — kader
 * rechts-verankerd i.p.v. links, zelfde reden als bij Frame1200.tsx
 * (anders valt het bij de smalste viewport van dit bereik alweer
 * buiten beeld). Referentiewaarden bij 1799px: headline links=250px,
 * kader rechts=249px (1799 - 1277 - 273).
 *
 * Quote-kader is hier de "grote" variant (p-40, 24px tekst, tracking
 * 4.32, één regel) — niet de kleinere p-24/18px-variant uit
 * Frame1200.tsx. Galerij-rij is 864px breed (i.p.v. 790px), gap tussen
 * portret en tekstblok is 80px (i.p.v. 40px). Persoonlijke
 * verjaardagstekst (13:238) letterlijk overgenomen, identiek aan
 * Frame1200.tsx.
 */
export default function Frame1440() {
  return (
    <>
      <section className="relative w-full" data-node-id="13:219">
        <div className="relative h-[1032px] w-full overflow-hidden">
          <img
            alt=""
            src={imgBanner}
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
          <p
            className="absolute left-1/2 top-[45px] h-[64px] w-[575px] -translate-x-1/2 text-center text-[32px] font-light text-white tracking-[40.32px]"
            data-node-id="13:218"
          >
            BY ELISE
          </p>
          <div
            className="absolute left-[250px] top-[459px] h-[323px] w-[766px] text-[64px] font-light leading-[1.11] text-white tracking-[11.52px]"
            data-node-id="13:239"
          >
            <p>Create from </p>
            <p>presence, </p>
            <p>not pressure</p>
          </div>
          <div
            className="absolute right-[249px] top-[654px] flex h-[273px] items-end justify-end bg-white p-[40px]"
            data-node-id="13:244"
          >
            <p className="w-[193px] text-right text-[24px] font-light uppercase tracking-[4.32px] text-black">
              There is freedom in being seen without performing
            </p>
          </div>
        </div>
        <div className="h-[92px] w-full" />
      </section>

      <div className="mx-auto w-[1300px]">
        <div className="flex w-full items-end" data-node-id="13:222">
          <div className="flex flex-1 flex-col items-start font-light text-black" data-node-id="13:223">
            <p className="mb-0 w-full text-[40px] uppercase leading-[1.2] tracking-[7.2px]" data-node-id="13:224">
              Behind the Surface
            </p>
            <p className="w-[367px] text-[18px] leading-[1.5]" data-node-id="13:225">
              Letting go of expectations to make space for authenticity, presence, and creative freedom.
            </p>
          </div>
          <div className="flex h-[347px] w-[864px] items-center justify-center gap-[24px]" data-node-id="13:226">
            <div className="relative aspect-[416/517] min-w-px flex-1" data-node-id="13:227">
              <img alt="" src={imgGallery1} className="pointer-events-none absolute inset-0 size-full object-cover" />
            </div>
            <div className="relative aspect-[416/517] min-w-px flex-1" data-node-id="13:228">
              <img alt="" src={imgGallery2} className="pointer-events-none absolute inset-0 size-full object-cover" />
            </div>
            <div className="relative aspect-[416/517] min-w-px flex-1" data-node-id="13:229">
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
          data-node-id="13:230"
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

        <div className="mt-[92px] flex w-full items-end gap-[80px]" data-node-id="13:232">
          <div className="relative aspect-[552/798] flex-1" data-node-id="13:233">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                src={imgPortrait}
                className="absolute left-[-7.42%] top-0 h-full w-[114.37%] max-w-none"
              />
            </div>
          </div>
          <div className="flex w-[511px] flex-col items-start bg-black p-[24px]" data-node-id="13:234">
            <div className="flex w-full flex-col items-start font-light text-[#ECEBE5]" data-node-id="13:235">
              <p className="w-full text-[50px] leading-[1.2] tracking-[9px]" data-node-id="13:236">
                BY ELISE
              </p>
              <p className="w-[367px] text-[18px] leading-[1.5]" data-node-id="13:237">
                is about letting go of expectations and revealing what lies beneath the surface. By slowing down and being present, we create space for authenticity, curiosity, and creative freedom.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-[92px] w-[1000px] pb-[80px] text-[20px] font-light tracking-[3.6px] text-black"
        data-node-id="13:238"
      >
        <p className="leading-[1.11]">Geloof een beetje meer in jezelf. Ik doe het in ieder geval al. ❤️</p>
        <p className="leading-[1.11]">Gefeliciteerd je verjaardag! Liefs Mick, Koda en Roku</p>
      </div>
    </>
  );
}
