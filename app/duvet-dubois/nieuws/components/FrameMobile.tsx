import type { ReactNode } from "react";

import MobileMenu from "../../components/MobileMenu";

const imgLogo = "/duvet-dubois/mobile-assets/nieuws-logo.png";
const imgNewsImage = "/duvet-dubois/mobile-assets/nieuws-news-image.png";
const imgAudienceImage = "/duvet-dubois/mobile-assets/nieuws-audience-image.png";
const imgEllipse = "/duvet-dubois/mobile-assets/nieuws-ellipse-bas.png";
const imgSmile = "/duvet-dubois/mobile-assets/nieuws-smile.svg";
const imgThumbsUp = "/duvet-dubois/mobile-assets/nieuws-thumbs-up.svg";
const imgShield = "/duvet-dubois/mobile-assets/nieuws-shield.svg";
const imgMessageSquare = "/duvet-dubois/mobile-assets/nieuws-message-square.svg";
const imgSearch = "/duvet-dubois/mobile-assets/nieuws-search.svg";
const imgPhone = "/duvet-dubois/mobile-assets/nieuws-phone.svg";
const imgMail = "/duvet-dubois/mobile-assets/nieuws-mail.svg";
const imgEllipse1 = "/duvet-dubois/mobile-assets/nieuws-ellipse-frans.svg";
const imgFooterDivider = "/duvet-dubois/mobile-assets/nieuws-footer-divider.svg";

type ButtonProps = {
  type?: "Brand" | "Primary" | "Tertiary";
  className?: string;
  children: ReactNode;
};

/**
 * Figma "Button" component, size=Compact (component set 2:608).
 * Fixed height 48px, hugged width (padding-driven), text 14px.
 * Idle/hover/active colors + weight/underline states per type, matching
 * the group/hover/active pattern already used for the desktop CTA buttons
 * in /duvet-dubois/components/Frame900.tsx.
 */
function Button({ type = "Primary", className, children }: ButtonProps) {
  const typeStyles: Record<string, string> = {
    Brand: "bg-[#e4c5a1] hover:bg-[#f4e3cf] active:bg-[#f4e3cf] text-black",
    Primary: "bg-[#2c4c6d] hover:bg-[#09223e] active:bg-[#09223e] text-white",
    Tertiary: "bg-transparent text-black",
  };
  return (
    <div
      className={
        className ||
        `group ${typeStyles[type]} content-stretch flex h-[48px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 transition-colors cursor-pointer`
      }
      data-name="Button"
    >
      <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline">
        {children}
      </p>
    </div>
  );
}

export default function FrameMobile() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[40px] items-start relative size-full" data-node-id="69:271" data-name="Nieuws — mobile max 600">
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="50:1068">
        <div className="bg-white content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="69:272" data-name="header">
          <div className="content-stretch flex flex-col items-start py-[10px] relative shrink-0 w-[186px]" data-node-id="69:273" data-name="header-logo">
            <div className="aspect-[283/69] relative shrink-0 w-full" data-node-id="69:274" data-name="logo">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
            </div>
          </div>
          <MobileMenu />
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="50:1067">
          <div className="[word-break:break-word] content-stretch flex flex-col font-semibold gap-[12px] items-start leading-[normal] not-italic overflow-clip px-[24px] relative shrink-0 text-black w-full" data-node-id="69:422" data-name="page-heading">
            <p className="relative shrink-0 text-[24px] w-full" data-node-id="69:424">
              Nieuws en updates
            </p>
            <p className="relative shrink-0 text-[16px] w-full" data-node-id="69:425">
              Actueel nieuws, relevante ontwikkelingen
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip px-[24px] relative shrink-0 w-full" data-node-id="69:426" data-name="news-articles-list">
            <div className="bg-[#f4f4f4] content-stretch flex flex-col gap-[39px] items-start justify-end p-[24px] relative rounded-[8px] shrink-0 w-full" data-node-id="69:427" data-name="News Card">
              <div className="h-[321px] relative rounded-[16px] shrink-0 w-full" data-node-id="I69:427;43:325" data-name="news-image">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNewsImage} />
              </div>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="I69:427;43:326" data-name="news-content">
                <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[18px] w-[min-content]" data-node-id="I69:427;43:327">
                  Onze aanpak
                </p>
                <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[14px] text-black w-[min-content]" data-node-id="I69:427;43:328">
                  We zorgen ervoor dat uw administratie zorgvuldig en overzichtelijk wordt bijgehouden, zodat u altijd inzicht heeft in de financiële gezondheid van uw onderneming. Daarbij kijken we verder dan alleen de cijfers. We denken proactief met u mee, signaleren fiscale kansen en informeren u tijdig over belangrijke ontwikkelingen.
                </p>
                <Button type="Primary">Titel button</Button>
              </div>
            </div>
            <div className="bg-[#f4f4f4] content-stretch flex flex-col gap-[39px] items-start justify-end p-[24px] relative rounded-[8px] shrink-0 w-full" data-node-id="69:434" data-name="News Card">
              <div className="h-[321px] relative rounded-[16px] shrink-0 w-full" data-node-id="I69:434;43:325" data-name="news-image">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNewsImage} />
              </div>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="I69:434;43:326" data-name="news-content">
                <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[18px] w-[min-content]" data-node-id="I69:434;43:327">
                  Onze aanpak
                </p>
                <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[14px] text-black w-[min-content]" data-node-id="I69:434;43:328">
                  We zorgen ervoor dat uw administratie zorgvuldig en overzichtelijk wordt bijgehouden, zodat u altijd inzicht heeft in de financiële gezondheid van uw onderneming. Daarbij kijken we verder dan alleen de cijfers. We denken proactief met u mee, signaleren fiscale kansen en informeren u tijdig over belangrijke ontwikkelingen.
                </p>
                <Button type="Primary">Titel button</Button>
              </div>
            </div>
            <div className="bg-[#f4f4f4] content-stretch flex flex-col gap-[39px] items-start justify-end p-[24px] relative rounded-[8px] shrink-0 w-full" data-node-id="69:441" data-name="News Card">
              <div className="h-[321px] relative rounded-[16px] shrink-0 w-full" data-node-id="I69:441;43:325" data-name="news-image">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNewsImage} />
              </div>
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="I69:441;43:326" data-name="news-content">
                <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[18px] w-[min-content]" data-node-id="I69:441;43:327">
                  Onze aanpak
                </p>
                <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[14px] text-black w-[min-content]" data-node-id="I69:441;43:328">
                  We zorgen ervoor dat uw administratie zorgvuldig en overzichtelijk wordt bijgehouden, zodat u altijd inzicht heeft in de financiële gezondheid van uw onderneming. Daarbij kijken we verder dan alleen de cijfers. We denken proactief met u mee, signaleren fiscale kansen en informeren u tijdig over belangrijke ontwikkelingen.
                </p>
                <Button type="Primary">Titel button</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start px-[24px] relative shrink-0 w-full" data-node-id="69:281" data-name="benefits-grid">
        <div className="[word-break:break-word] font-semibold leading-[0] not-italic relative shrink-0 text-[#2c4c6d] text-[20px] text-center w-full whitespace-pre-wrap" data-node-id="69:282">
          <p className="leading-none mb-0">{`Waarom kiezen voor `}</p>
          <p className="leading-none">{`Duvet & Dubois?`}</p>
        </div>
        <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full" data-node-id="69:283">
          Wij geloven dat een administratiekantoor meer moet zijn dan een verwerker van cijfers.
        </p>
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-node-id="69:284" data-name="benefits-grid-row-1">
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="69:285" data-name="benefit-card-persoonlijk-betrokken">
            <div className="relative shrink-0 size-[24px]" data-node-id="69:286" data-name="smile">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSmile} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="69:291" data-name="card-heading">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="69:292" data-name="item-persoonlijk-betrokken">
                <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="69:293">
                  Persoonlijk betrokken
                </p>
              </div>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full" data-node-id="69:294">
                Een vast aanspreekpunt dat uw onderneming kent.
              </p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="69:295" data-name="benefit-card-proactief-advies">
            <div className="relative shrink-0 size-[24px]" data-node-id="69:296" data-name="thumbs-up">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgThumbsUp} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="69:298" data-name="card-heading">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="69:299" data-name="item-proactief-advies">
                <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="69:300">
                  Proactief advies
                </p>
              </div>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full" data-node-id="69:301">
                Wij denken mee en signaleren kansen op tijd.
              </p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="69:302" data-name="benefit-card-betrouwbaar-en-nauwkeurig">
            <div className="relative shrink-0 size-[24px]" data-node-id="69:303" data-name="shield">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShield} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="69:305" data-name="card-heading">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="69:306" data-name="item-betrouwbaar-en-nauwkeurig">
                <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="69:307">
                  Betrouwbaar en nauwkeurig
                </p>
              </div>
              <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center w-full whitespace-pre-wrap" data-node-id="69:308">
                <p className="leading-[1.4] mb-0">{`Uw administratie is altijd zorgvuldig `}</p>
                <p className="leading-[1.4]">en up-to-date.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-node-id="69:309" data-name="benefits-grid-row-2">
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="69:310" data-name="benefit-card-duidelijke-communicatie">
            <div className="relative shrink-0 size-[24px]" data-node-id="69:311" data-name="message-square">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMessageSquare} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="69:313" data-name="card-heading">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="69:314" data-name="item-duidelijke-communicatie">
                <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="69:315">
                  Duidelijke communicatie
                </p>
              </div>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full" data-node-id="69:316">
                Heldere uitleg, zonder ingewikkelde vaktaal.
              </p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="69:317" data-name="benefit-card-altijd-inzicht">
            <div className="relative shrink-0 size-[24px]" data-node-id="69:318" data-name="search">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="69:321" data-name="card-heading">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="69:322" data-name="item-altijd-inzicht">
                <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="69:323">
                  Altijd inzicht
                </p>
              </div>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full" data-node-id="69:324">
                U weet waar uw onderneming financieel staat.
              </p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="69:325" data-name="benefit-card-korte-lijnen">
            <div className="relative shrink-0 size-[24px]" data-node-id="69:326" data-name="phone">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="69:328" data-name="card-heading">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="69:329" data-name="item-korte-lijnen">
                <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="69:330">
                  Korte lijnen
                </p>
              </div>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="69:331">
                Snel contact en een vlotte reactie op uw vragen.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[24px] items-center justify-center px-[24px] relative shrink-0 w-full" data-node-id="69:332" data-name="audience-section">
        <div className="h-[398px] relative shrink-0 w-[387px]" data-node-id="69:333" data-name="rectangle">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAudienceImage} />
        </div>
        <div className="content-stretch flex flex-col gap-[17px] items-start relative shrink-0 w-full" data-node-id="69:334" data-name="group">
          <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[20px] w-[min-content]" data-node-id="69:335">
            Voor wie werken wij?
          </p>
          <p className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]" data-node-id="69:336">
            Wij ondersteunen onder andere:
          </p>
          <div className="[word-break:break-word] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-black w-[1344px]" data-node-id="69:337">
            <p className="font-normal mb-0">
              <span className="leading-[1.4] text-[#0f865d]">✓</span>
              <span className="leading-[1.4]">
                {` Zelfstandigen (zzp)`}
                <br aria-hidden />
              </span>
              <span className="leading-[1.4] text-[#0f865d]">✓</span>
              <span className="leading-[1.4]">
                {` Eenmanszaken`}
                <br aria-hidden />
              </span>
              <span className="leading-[1.4] text-[#0f865d]">✓</span>
              <span className="leading-[1.4]">{` Vennootschappen onder firma (vof)`}</span>
            </p>
            <p className="font-normal mb-0">
              <span className="leading-[1.4] text-[#0f865d]">✓</span>
              <span className="leading-[1.4]">{` Besloten vennootschappen (bv)`}</span>
            </p>
            <p className="font-normal">
              <span className="leading-[1.4] text-[#0f865d]">✓</span>
              <span className="leading-[1.4]">{` Kleine en middelgrote ondernemingen`}</span>
            </p>
          </div>
          <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]" data-node-id="69:338">
            Ongeacht de fase waarin uw onderneming zich bevindt, denken wij graag met u mee. Wilt u weten wat wij voor u kunnen betekenen?
          </p>
          <Button type="Primary">Plan een vrijblijvend kennismakingsgesprek</Button>
        </div>
      </div>
      <div className="bg-[#2c4c6d] content-stretch flex flex-col gap-[16px] items-center justify-center p-[24px] relative shrink-0 w-full" data-node-id="69:340" data-name="cta-heading">
        <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-center text-white w-full" data-node-id="69:341">{`Maak kennis met Duvet & Dubois`}</p>
        <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[0px] text-center text-white w-full" data-node-id="69:342">
          <p className="font-semibold leading-[1.4] mb-0 text-[14px]">Neem contact met ons op en plan een vrijblijvend kennismakingsgesprek in.</p>
          <p className="leading-[1.4] text-[14px]">We bespreken uw situatie, beantwoorden uw vragen en kijken welke ondersteuning het beste bij uw onderneming past.</p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-node-id="69:343" data-name="cta-contact-cards">
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center p-[24px] relative rounded-[8px] shrink-0 w-full" data-node-id="69:344" data-name="contact-card-bas-neijenhuis">
            <div className="relative shrink-0 size-[80px]" data-node-id="69:345" data-name="ellipse">
              <img alt="" className="absolute block inset-0 max-w-none size-full" height="80" src={imgEllipse} width="80" />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0" data-node-id="69:346" data-name="item-bas-neijenhuis">
              <div className="content-stretch flex items-center relative shrink-0" data-node-id="69:347" data-name="item-bas-neijenhuis">
                <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="69:348">
                  Bas Neijenhuis
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="69:349" data-name="item-31-06-24-835">
                <div className="relative shrink-0 size-[24px]" data-node-id="69:350" data-name="phone">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="69:352">
                  +31 (0)6 24 835 810
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="69:353" data-name="item-basddadnl">
                <div className="relative shrink-0 size-[24px]" data-node-id="69:354" data-name="mail">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-pre" data-node-id="69:357">{`bas@ddad.nl      `}</p>
              </div>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center p-[24px] relative rounded-[8px] shrink-0 w-full" data-node-id="69:358" data-name="contact-card-frans-van-den-bosch">
            <div className="relative shrink-0 size-[80px]" data-node-id="69:359" data-name="ellipse">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0" data-node-id="69:360" data-name="item-frans-van-den-bosch">
              <div className="content-stretch flex items-center relative shrink-0" data-node-id="69:361" data-name="item-frans-van-den-bosch">
                <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="69:362">
                  Frans van den Bosch
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="69:363" data-name="item-31-06-24-835">
                <div className="relative shrink-0 size-[24px]" data-node-id="69:364" data-name="phone">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="69:366">
                  +31 (0)6 24 835 810
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="69:367" data-name="item-basddadnl">
                <div className="relative shrink-0 size-[24px]" data-node-id="69:368" data-name="mail">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-pre" data-node-id="69:371">{`bas@ddad.nl      `}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-center pb-[40px] relative shrink-0 w-full" data-node-id="69:372" data-name="footer-section">
        <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0" data-node-id="69:373" data-name="footer-columns">
          <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-node-id="69:374" data-name="footer-column-menu">
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:375" data-name="item-menu">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap" data-node-id="69:376">
                Menu
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:377" data-name="item-home">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap" data-node-id="69:378">
                Home
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:379" data-name="item-diensten">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap" data-node-id="69:380">
                Diensten
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:381" data-name="item-over-ons">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap" data-node-id="69:382">
                Over ons
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:383" data-name="item-nieuws">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap" data-node-id="69:384">
                Nieuws
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:385" data-name="item-contact">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap" data-node-id="69:386">
                Contact
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="69:387" data-name="footer-column-diensten">
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:388" data-name="item-diensten">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:389">
                Diensten
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:390" data-name="item-administratie">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:391">
                Administratie
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:392" data-name="item-belastingadvies">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:393">
                Belastingadvies
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:394" data-name="item-jaarrekening">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:395">
                Jaarrekening
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:396" data-name="item-salarisadministratie">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:397">
                Salarisadministratie
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-node-id="69:398" data-name="footer-column-nieuws">
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:399" data-name="item-nieuws">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:400">
                Nieuws
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:401" data-name="item-item-1">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:402">
                Item 1
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:403" data-name="item-item-2">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:404">
                Item 2
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:405" data-name="item-item-3">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:406">
                Item 3
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-node-id="69:407" data-name="item-item-4">
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="69:408">
                Item 4
              </p>
            </div>
          </div>
        </div>
        <div className="h-[20px] relative shrink-0 w-full" data-node-id="69:409" data-name="footer-divider-container">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFooterDivider} />
        </div>
        <div className="content-stretch flex items-center justify-end relative shrink-0 w-[130px]" data-node-id="69:411" data-name="footer-copyright">
          <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-right whitespace-nowrap" data-node-id="69:412">
            Copyright 20026
          </p>
        </div>
      </div>
    </div>
  );
}
