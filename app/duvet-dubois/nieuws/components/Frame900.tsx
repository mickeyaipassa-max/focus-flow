import Link from "next/link";
const imgLogo = "/duvet-dubois/nieuws-assets/4be20053-9f7e-4787-a161-1a97d95eeb9b.png";
const imgNewsImage = "/duvet-dubois/nieuws-assets/12f16799-e2df-4352-96d5-81e1d4fc16f0.png";
const imgEllipse = "/duvet-dubois/nieuws-assets/f8d58500-392b-41b0-9c7a-9df6cd7937ea.png";
const imgAudienceImage = "/duvet-dubois/nieuws-assets/185a5b1c-12f3-47bc-bd71-2d5e1c680be9.png";
const imgPageHeadingMarkerTriangle = "/duvet-dubois/nieuws-assets/4bcc16bc-436b-49fe-8cf1-cd304c9a43e1.svg";
const imgPhone = "/duvet-dubois/nieuws-assets/74e8c0e4-9760-4fbe-a7f2-646dfb7b8cac.svg";
const imgMail = "/duvet-dubois/nieuws-assets/bc57a4b3-1911-43ac-a95f-64e53c1d97cf.svg";
const imgEllipse1 = "/duvet-dubois/nieuws-assets/09405277-aaff-48c5-ae27-03963a940bfb.svg";
const imgSmile = "/duvet-dubois/nieuws-assets/937959b4-5715-4484-b71f-034e6948d3c6.svg";
const imgThumbsUp = "/duvet-dubois/nieuws-assets/2bf060a0-c387-4f26-aeb5-237c02ec8204.svg";
const imgShield = "/duvet-dubois/nieuws-assets/5fa35b75-d289-496c-9d29-200ad5f2e79e.svg";
const imgMessageSquare = "/duvet-dubois/nieuws-assets/b8a77d0a-0c45-4809-87ae-dd2573427e1d.svg";
const imgSearch = "/duvet-dubois/nieuws-assets/214c7951-03b4-4bf2-baee-54900942ea41.svg";
const imgFooterDivider = "/duvet-dubois/nieuws-assets/c5c9efc6-2eb3-4c1c-bc2e-1f81c1bfcb59.svg";

type ButtonProps = {
  className?: string;
};

function Button({ className }: ButtonProps) {
  return (
    <div className={className || "bg-[#2c4c6d] content-stretch flex h-[56px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px]"}>
      <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
        Titel button
      </p>
    </div>
  );
}
export default function Frame900() {
  return (
    <div className="bg-white relative size-full" data-node-id="47:345" data-name="Nieuws — 900-1199">
      <div className="absolute content-stretch flex items-center justify-between left-0 px-[48px] py-[16px] top-0 w-[1024px]" data-node-id="47:346" data-name="header">
        <div className="content-stretch flex flex-[1_0_0] gap-[7px] items-center justify-end min-w-px relative" data-node-id="47:347" data-name="nav-links-row">
          <Link href="/duvet-dubois" className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="47:348" data-name="nav-link-home">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
              Home
            </p>
          </Link>
          <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="47:350" data-name="nav-link-diensten">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
              Diensten
            </p>
          </div>
          <Link href="/duvet-dubois/over-ons" className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="47:352" data-name="nav-link-over-ons">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
              Over ons
            </p>
          </Link>
          <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="47:354" data-name="nav-link-nieuws">
            <p className="[word-break:break-word] font-semibold leading-[normal] not-italic relative shrink-0 text-[#2c4c6d] text-[16px] whitespace-nowrap">
              Nieuws
            </p>
          </div>
          <div className="content-stretch flex items-center justify-center pl-[10px] pr-[23px] py-[10px] relative shrink-0" data-node-id="47:356" data-name="nav-link-contact">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
              Contact
            </p>
          </div>
          <div className="bg-[#2c4c6d] content-stretch flex items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" data-node-id="47:358" data-name="login-button">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
              Inloggen
            </p>
          </div>
        </div>
        <div className="absolute h-[62px] left-0 top-[16px] w-[255px]" data-node-id="47:360" data-name="logo">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
        </div>
      </div>
      <div className="[word-break:break-word] absolute content-stretch flex flex-col font-semibold gap-[17px] items-start left-[112px] not-italic text-black top-[171px] w-[606px]" data-node-id="47:361" data-name="page-heading">
        <p className="leading-none relative shrink-0 text-[48px] w-full">
          Nieuws en updates
        </p>
        <p className="leading-[normal] relative shrink-0 text-[16px] w-full">
          Actueel nieuws, relevante ontwikkelingen
        </p>
      </div>
      <div className="absolute flex items-center justify-center left-[25px] size-[46px] top-[169px]" data-node-id="47:364">
        <div className="flex-none rotate-90">
          <div className="relative size-[46px]" data-name="page-heading-marker-triangle">
            <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
              <img alt="" className="block max-w-none size-full" src={imgPageHeadingMarkerTriangle} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[112px] top-[262px] w-[800px]" data-node-id="47:365" data-name="news-articles-list">
        <div className="bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="47:366" data-name="news-card-1">
          <div className="relative rounded-[16px] shrink-0 size-[321px]" data-name="news-image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNewsImage} />
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-name="news-content">
            <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[32px] w-[min-content]">
              Onze aanpak
            </p>
            <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">
              We zorgen ervoor dat uw administratie zorgvuldig en overzichtelijk wordt bijgehouden, zodat u altijd inzicht heeft in de financiële gezondheid van uw onderneming. Daarbij kijken we verder dan alleen de cijfers. We denken proactief met u mee, signaleren fiscale kansen en informeren u tijdig over belangrijke ontwikkelingen.
            </p>
            <Button className="bg-[#2c4c6d] content-stretch flex h-[56px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" />
          </div>
        </div>
        <div className="bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="47:367" data-name="news-card-2">
          <div className="relative rounded-[16px] shrink-0 size-[321px]" data-name="news-image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNewsImage} />
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-name="news-content">
            <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[32px] w-[min-content]">
              Onze aanpak
            </p>
            <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">
              We zorgen ervoor dat uw administratie zorgvuldig en overzichtelijk wordt bijgehouden, zodat u altijd inzicht heeft in de financiële gezondheid van uw onderneming. Daarbij kijken we verder dan alleen de cijfers. We denken proactief met u mee, signaleren fiscale kansen en informeren u tijdig over belangrijke ontwikkelingen.
            </p>
            <Button className="bg-[#2c4c6d] content-stretch flex h-[56px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" />
          </div>
        </div>
        <div className="bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="47:368" data-name="news-card-3">
          <div className="relative rounded-[16px] shrink-0 size-[321px]" data-name="news-image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNewsImage} />
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-name="news-content">
            <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[32px] w-[min-content]">
              Onze aanpak
            </p>
            <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">
              We zorgen ervoor dat uw administratie zorgvuldig en overzichtelijk wordt bijgehouden, zodat u altijd inzicht heeft in de financiële gezondheid van uw onderneming. Daarbij kijken we verder dan alleen de cijfers. We denken proactief met u mee, signaleren fiscale kansen en informeren u tijdig over belangrijke ontwikkelingen.
            </p>
            <Button className="bg-[#2c4c6d] content-stretch flex h-[56px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" />
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-[#2c4c6d] h-[279px] left-1/2 rounded-[16px] top-[2760px] w-[800px]" data-node-id="47:369" data-name="cta-bg" />
      <div className="-translate-x-1/2 [word-break:break-word] absolute content-stretch flex flex-col gap-[16px] items-center justify-center left-1/2 not-italic text-center text-white top-[2813px] w-[800px]" data-node-id="47:370" data-name="cta-heading">
        <p className="font-semibold leading-none min-w-full relative shrink-0 text-[32px] w-[min-content]">{`Maak kennis met Duvet & Dubois`}</p>
        <div className="font-normal leading-[0] relative shrink-0 text-[16px] w-[648px]">
          <p className="font-semibold leading-[normal] mb-0">Neem contact met ons op en plan een vrijblijvend kennismakingsgesprek in.</p>
          <p className="leading-[normal]">We bespreken uw situatie, beantwoorden uw vragen en kijken welke ondersteuning het beste bij uw onderneming past.</p>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute content-stretch flex gap-[25px] items-center left-[calc(50%-0.5px)] top-[2947px] w-[707px]" data-node-id="47:373" data-name="cta-contact-cards">
        <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center px-[40px] py-[24px] relative rounded-[8px] shrink-0" data-name="contact-card-bas-neijenhuis">
          <div className="relative shrink-0 size-[122px]" data-name="ellipse">
            <img alt="" className="absolute block inset-0 max-w-none size-full" height="122" src={imgEllipse} width="122" />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0">
            <div className="content-stretch flex items-center relative shrink-0">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[18px] text-black whitespace-nowrap">
                Bas Neijenhuis
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[24px]" data-name="phone">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
              </div>
              <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
                +31 (0)6 24 835 810
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[24px]" data-name="mail">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
              </div>
              <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-pre">{`bas@ddad.nl      `}</p>
            </div>
          </div>
        </div>
        <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center px-[40px] py-[24px] relative rounded-[8px] shrink-0" data-name="contact-card-frans-van-den-bosch">
          <div className="relative shrink-0 size-[122px]" data-name="ellipse">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0">
            <div className="content-stretch flex items-center relative shrink-0">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[18px] text-black whitespace-nowrap">
                Frans van den Bosch
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[24px]" data-name="phone">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
              </div>
              <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
                +31 (0)6 24 835 810
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <div className="relative shrink-0 size-[24px]" data-name="mail">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
              </div>
              <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-pre">{`bas@ddad.nl      `}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[51px] items-center left-[112px] top-[1489px] w-[800px]" data-node-id="47:402" data-name="benefits-section">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start not-italic relative shrink-0 text-center w-full" data-name="section-heading">
          <p className="font-semibold leading-none relative shrink-0 text-[#2c4c6d] text-[32px] w-full">{`Waarom kiezen voor Duvet & Dubois?`}</p>
          <p className="font-normal leading-[normal] relative shrink-0 text-[16px] text-black w-full">
            Wij geloven dat een administratiekantoor meer moet zijn dan een verwerker van cijfers.
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="benefits-section-row-1">
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="benefits-section-row-2">
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-name="benefit-card-persoonlijk-betrokken">
              <div className="relative shrink-0 size-[24px]" data-name="smile">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSmile} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full">
                    Persoonlijk betrokken
                  </p>
                </div>
                <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                  Een vast aanspreekpunt dat uw onderneming kent.
                </p>
              </div>
            </div>
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-name="benefit-card-proactief-advies">
              <div className="relative shrink-0 size-[24px]" data-name="thumbs-up">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgThumbsUp} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full">
                    Proactief advies
                  </p>
                </div>
                <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full whitespace-pre-wrap">
                  <p className="leading-[1.4] mb-0">{`Wij denken mee en signaleren kansen `}</p>
                  <p className="leading-[1.4]">op tijd.</p>
                </div>
              </div>
            </div>
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-name="benefit-card-betrouwbaar-en-nauwkeurig">
              <div className="relative shrink-0 size-[24px]" data-name="shield">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShield} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full">
                    Betrouwbaar en nauwkeurig
                  </p>
                </div>
                <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full whitespace-pre-wrap">
                  <p className="leading-[1.4] mb-0">{`Uw administratie is altijd zorgvuldig `}</p>
                  <p className="leading-[1.4]">en up-to-date.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="benefits-section-row-3">
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-name="benefit-card-duidelijke-communicatie">
              <div className="relative shrink-0 size-[24px]" data-name="message-square">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMessageSquare} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full">
                    Duidelijke communicatie
                  </p>
                </div>
                <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                  <p className="leading-[1.4] mb-0">Heldere uitleg, zonder ingewikkelde vaktaal.</p>
                  <p className="leading-[1.4]">​</p>
                </div>
              </div>
            </div>
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-name="benefit-card-altijd-inzicht">
              <div className="relative shrink-0 size-[24px]" data-name="search">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full">
                    Altijd inzicht
                  </p>
                </div>
                <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                  U weet waar uw onderneming financieel staat.
                </p>
              </div>
            </div>
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-name="benefit-card-korte-lijnen">
              <div className="relative shrink-0 size-[24px]" data-name="phone">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full">
                    Korte lijnen
                  </p>
                </div>
                <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full whitespace-pre-wrap">
                  <p className="leading-[1.4] mb-0">{`Snel contact en een vlotte reactie `}</p>
                  <p className="leading-[1.4]">op uw vragen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-0 left-[112px] top-[3382px] w-[800px]" data-name="footer-divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgFooterDivider} />
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[145px] items-start left-[112px] top-[3189px]" data-name="footer-columns">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="footer-column-menu">
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Menu</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Home</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Diensten</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Over ons</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Nieuws</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Contact</p></div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="footer-column-diensten">
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Diensten</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Administratie</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Belastingadvies</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Jaarrekening</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Salarisadministratie</p></div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="footer-column-nieuws">
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Nieuws</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 1</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 2</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 3</p></div>
          <div className="content-stretch flex items-center relative shrink-0 w-full"><p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 4</p></div>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-end left-[782px] top-[3391px] w-[130px]" data-name="footer-copyright">
        <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-right whitespace-nowrap">
          Copyright 20026
        </p>
      </div>
      <div className="absolute bg-[#f2f1ee] h-[429px] left-[-46px] rounded-[16px] top-[2178px] w-[1416px]" data-name="audience-bg" />
      <div className="absolute content-stretch flex flex-col gap-[17px] items-start left-[484px] top-[2228px] w-[428px]" data-name="audience-content">
        <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[32px] w-[min-content]">
          Voor wie werken wij?
        </p>
        <p className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">
          Wij ondersteunen onder andere:
        </p>
        <div className="[word-break:break-word] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-black w-[1344px]">
          <p className="font-normal mb-0">
            <span className="leading-[1.4] text-[#0f865d]">✓</span>
            <span className="leading-[1.4]">{` Zelfstandigen (zzp)`}<br aria-hidden /></span>
            <span className="leading-[1.4] text-[#0f865d]">✓</span>
            <span className="leading-[1.4]">{` Eenmanszaken`}<br aria-hidden /></span>
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
        <div className="[word-break:break-word] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content] whitespace-pre-wrap">
          <p className="leading-[1.4] mb-0">{`Ongeacht de fase waarin uw onderneming zich bevindt, `}</p>
          <p className="leading-[1.4]">denken wij graag met u mee. Wilt u weten wat wij voor u kunnen betekenen?</p>
        </div>
        <div className="bg-[#2c4c6d] content-stretch flex h-[56px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" data-name="audience-cta-button">
          <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
            Plan een vrijblijvend kennismakingsgesprek
          </p>
        </div>
      </div>
      <div className="absolute h-[349px] left-[112px] rounded-[16px] top-[2107px] w-[340px]" data-name="audience-image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgAudienceImage} />
      </div>
    </div>
  );
}
