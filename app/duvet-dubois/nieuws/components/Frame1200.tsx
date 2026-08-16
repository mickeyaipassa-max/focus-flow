import Link from "next/link";
const imgLogo = "/duvet-dubois/nieuws-assets/16a59c54-0518-4bc1-af21-5a9b3bfa8bfe.png";
const imgNewsImage = "/duvet-dubois/nieuws-assets/4e9ef04a-bae3-4bc4-9aa0-1cf2680aa1c8.png";
const imgEllipse = "/duvet-dubois/nieuws-assets/3d426172-bdf9-4d12-8e04-4879dfa1363e.png";
const imgAudienceImage = "/duvet-dubois/nieuws-assets/9c4ef872-b4b7-425d-85c8-69855147cb0a.png";
const imgPageHeadingMarkerTriangle = "/duvet-dubois/nieuws-assets/90bb7145-2dbf-4c75-b389-7298f5681a14.svg";
const imgPhone = "/duvet-dubois/nieuws-assets/0f4a76f3-613b-4e5c-8d74-93fc6af5cde9.svg";
const imgMail = "/duvet-dubois/nieuws-assets/5f15ed27-36d8-4534-9f90-fae061bebedf.svg";
const imgEllipse1 = "/duvet-dubois/nieuws-assets/aa493dcf-bac6-4b03-8954-2783571a4199.svg";
const imgSmile = "/duvet-dubois/nieuws-assets/64456b88-9a8b-4f2f-815d-8785ecbd9011.svg";
const imgThumbsUp = "/duvet-dubois/nieuws-assets/ecc1c0ad-6876-42d1-9386-3b7c1af11c2b.svg";
const imgShield = "/duvet-dubois/nieuws-assets/87985783-5d94-431e-943c-9f0b225350e9.svg";
const imgMessageSquare = "/duvet-dubois/nieuws-assets/c12cbe75-e932-47bd-a70a-bb9cd17d089f.svg";
const imgSearch = "/duvet-dubois/nieuws-assets/a49bda0c-27e0-4cbc-a403-ea004ac08553.svg";
const imgFooterDivider = "/duvet-dubois/nieuws-assets/99a017f2-e6af-4b26-bc83-c9d3e98b937d.svg";

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
export default function Frame1200() {
  return (
    <div className="bg-white relative size-full" data-node-id="47:188" data-name="Nieuws — 1200-1439">
      <div className="absolute content-stretch flex items-center justify-between left-[100px] py-[16px] top-0 w-[1000px]" data-node-id="47:189" data-name="header">
        <div className="content-stretch flex flex-[1_0_0] gap-[7px] items-center justify-end min-w-px relative" data-node-id="47:190" data-name="nav-links-row">
          <Link href="/duvet-dubois" className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="47:191" data-name="nav-link-home">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
              Home
            </p>
          </Link>
          <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="47:193" data-name="nav-link-diensten">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
              Diensten
            </p>
          </div>
          <Link href="/duvet-dubois/over-ons" className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="47:195" data-name="nav-link-over-ons">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
              Over ons
            </p>
          </Link>
          <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="47:197" data-name="nav-link-nieuws">
            <p className="[word-break:break-word] font-semibold leading-[normal] not-italic relative shrink-0 text-[#2c4c6d] text-[16px] whitespace-nowrap">
              Nieuws
            </p>
          </div>
          <div className="content-stretch flex items-center justify-center pl-[10px] pr-[23px] py-[10px] relative shrink-0" data-node-id="47:199" data-name="nav-link-contact">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
              Contact
            </p>
          </div>
          <div className="bg-[#2c4c6d] content-stretch flex items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" data-node-id="47:201" data-name="login-button">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
              Inloggen
            </p>
          </div>
        </div>
        <div className="absolute h-[62px] left-0 top-[16px] w-[255px]" data-node-id="47:203" data-name="logo">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
        </div>
      </div>
      <div className="[word-break:break-word] absolute content-stretch flex flex-col font-semibold gap-[17px] items-start left-[132px] not-italic text-black top-[171px] w-[606px]" data-node-id="47:204" data-name="page-heading">
        <p className="leading-none relative shrink-0 text-[48px] w-full">
          Nieuws en updates
        </p>
        <p className="leading-[normal] relative shrink-0 text-[16px] w-full">
          Actueel nieuws, relevante ontwikkelingen
        </p>
      </div>
      <div className="absolute flex items-center justify-center left-[45px] size-[46px] top-[169px]" data-node-id="47:207">
        <div className="flex-none rotate-90">
          <div className="relative size-[46px]" data-name="page-heading-marker-triangle">
            <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
              <img alt="" className="block max-w-none size-full" src={imgPageHeadingMarkerTriangle} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[100px] top-[262px] w-[1000px]" data-node-id="47:208" data-name="news-articles-list">
        <div className="bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="47:209" data-name="news-card-1">
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
        <div className="bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="47:210" data-name="news-card-2">
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
        <div className="bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="47:211" data-name="news-card-3">
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
      <div className="-translate-x-1/2 absolute bg-[#2c4c6d] h-[279px] left-1/2 rounded-[16px] top-[2676px] w-[1000px]" data-node-id="47:212" data-name="cta-bg" />
      <div className="-translate-x-1/2 [word-break:break-word] absolute content-stretch flex flex-col gap-[16px] items-center justify-center left-1/2 not-italic text-center text-white top-[2729px] w-[800px]" data-node-id="47:213" data-name="cta-heading">
        <p className="font-semibold leading-none min-w-full relative shrink-0 text-[32px] w-[min-content]">{`Maak kennis met Duvet & Dubois`}</p>
        <div className="font-normal leading-[0] relative shrink-0 text-[16px] w-[648px]">
          <p className="font-semibold leading-[normal] mb-0">Neem contact met ons op en plan een vrijblijvend kennismakingsgesprek in.</p>
          <p className="leading-[normal]">We bespreken uw situatie, beantwoorden uw vragen en kijken welke ondersteuning het beste bij uw onderneming past.</p>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute content-stretch flex gap-[25px] items-center left-[calc(50%-0.5px)] top-[2863px]" data-node-id="47:216" data-name="cta-contact-cards">
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
      <div className="absolute content-stretch flex flex-col gap-[51px] items-center left-[100px] top-[1489px] w-[1000px]" data-node-id="47:245" data-name="benefits-section">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start not-italic relative shrink-0 text-center w-[800px]" data-name="section-heading">
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
      <div className="absolute h-0 left-[100px] top-[3298px] w-[1000px]" data-name="footer-divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgFooterDivider} />
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[145px] items-start left-[100px] top-[3105px]" data-name="footer-columns">
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
      <div className="absolute content-stretch flex items-center justify-end left-[870px] top-[3307px] w-[130px]" data-name="footer-copyright">
        <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-right whitespace-nowrap">
          Copyright 20026
        </p>
      </div>
      <div className="absolute bg-[#f2f1ee] h-[429px] left-[-46px] rounded-[16px] top-[2094px] w-[1416px]" data-name="audience-bg" />
      <div className="absolute content-stretch flex flex-col gap-[17px] items-start left-[600px] top-[2144px] w-[500px]" data-name="audience-content">
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
      <div className="absolute h-[472px] left-[100px] rounded-[16px] top-[2023px] w-[460px]" data-name="audience-image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgAudienceImage} />
      </div>
    </div>
  );
}
