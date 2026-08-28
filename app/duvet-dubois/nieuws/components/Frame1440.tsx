import Link from "next/link";
const imgNewsImage = "/duvet-dubois/nieuws-assets/de18fe81-deff-4764-b5b6-93024eab9bdf.png";
const imgLogo = "/duvet-dubois/nieuws-assets/7f0cb7fa-825d-40b4-8f0b-8a1fb3e11ce1.png";
const imgEllipse = "/duvet-dubois/nieuws-assets/aaf6ce95-a300-4698-91db-726794d1d149.png";
const imgAudienceImage = "/duvet-dubois/nieuws-assets/c0535625-a091-4677-a511-3c19b0b6a613.png";
const imgPageHeadingMarkerTriangle = "/duvet-dubois/nieuws-assets/82072ca6-dae4-4bd6-a07c-1c83c260b80c.svg";
const imgPhone = "/duvet-dubois/nieuws-assets/1edf6831-3d03-41f6-8e35-5847bad2ccbc.svg";
const imgMail = "/duvet-dubois/nieuws-assets/aef5c30c-ab9d-4ba9-9bb8-e2d41736880a.svg";
const imgEllipse1 = "/duvet-dubois/nieuws-assets/ff1e36be-b8ec-469b-a5ab-583fb89b26ab.svg";
const imgSmile = "/duvet-dubois/nieuws-assets/6b6e6812-a339-434e-82a6-ae01bd71e698.svg";
const imgThumbsUp = "/duvet-dubois/nieuws-assets/6a571eee-bf18-42e6-a8a8-1911eb806ba8.svg";
const imgShield = "/duvet-dubois/nieuws-assets/9dc4110b-1343-4449-81d7-169058eb7043.svg";
const imgMessageSquare = "/duvet-dubois/nieuws-assets/fca9e89e-0152-4ab4-985f-ce7566f29a81.svg";
const imgSearch = "/duvet-dubois/nieuws-assets/f7c42103-1133-4421-a851-af022c151034.svg";
const imgFooterDivider = "/duvet-dubois/nieuws-assets/6269ec10-6cc8-478f-b295-5c87475551de.svg";

type ButtonProps = {
  className?: string;
  state?: "Default";
  type?: "Primary";
};

function Button({ className, state = "Default", type = "Primary" }: ButtonProps) {
  return (
    <div className={className || "bg-[#2c4c6d] content-stretch flex h-[56px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px]"} data-node-id="2:613">
      <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap" data-node-id="2:614">
        Titel button
      </p>
    </div>
  );
}

type NewsCardProps = {
  className?: string;
  viewport?: "Default";
};

function NewsCard({ className, viewport = "Default" }: NewsCardProps) {
  return (
    <div className={className || "bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] w-[1200px]"} data-node-id="43:320">
      <div className="relative rounded-[16px] shrink-0 size-[321px]" data-node-id="43:317" data-name="news-image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgNewsImage} />
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[728px]" data-node-id="43:312" data-name="news-content">
        <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[32px] w-[min-content]" data-node-id="43:313">
          Onze aanpak
        </p>
        <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]" data-node-id="43:314">
          We zorgen ervoor dat uw administratie zorgvuldig en overzichtelijk wordt bijgehouden, zodat u altijd inzicht heeft in de financiële gezondheid van uw onderneming. Daarbij kijken we verder dan alleen de cijfers. We denken proactief met u mee, signaleren fiscale kansen en informeren u tijdig over belangrijke ontwikkelingen.
        </p>
        <Button className="bg-[#2c4c6d] content-stretch flex h-[56px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" />
      </div>
    </div>
  );
}
export default function Frame1440() {
  return (
    <div className="bg-white relative size-full" data-node-id="43:171" data-name="Nieuws — 1440+">
      <div className="absolute content-stretch flex items-center justify-between left-[120px] py-[16px] top-0 w-[1200px]" data-node-id="43:172" data-name="header">
        <div className="content-stretch flex flex-[1_0_0] gap-[7px] items-center justify-end min-w-px relative" data-node-id="43:173" data-name="nav-links-row">
          <Link href="/duvet-dubois" className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="43:174" data-name="nav-link-home">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="43:175">
              Home
            </p>
          </Link>
          <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="43:176" data-name="nav-link-diensten">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="43:177">
              Diensten
            </p>
          </div>
          <Link href="/duvet-dubois/over-ons" className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="43:178" data-name="nav-link-over-ons">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="43:179">
              Over ons
            </p>
          </Link>
          <div className="content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-node-id="43:180" data-name="nav-link-nieuws">
            <p className="[word-break:break-word] font-semibold leading-[normal] not-italic relative shrink-0 text-[#2c4c6d] text-[16px] whitespace-nowrap" data-node-id="43:181">
              Nieuws
            </p>
          </div>
          <div className="content-stretch flex items-center justify-center pl-[10px] pr-[23px] py-[10px] relative shrink-0" data-node-id="43:182" data-name="nav-link-contact">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="43:183">
              Contact
            </p>
          </div>
          <div className="bg-[#2c4c6d] content-stretch flex items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" data-node-id="43:184" data-name="login-button">
            <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap" data-node-id="43:185">
              Inloggen
            </p>
          </div>
        </div>
        <div className="absolute h-[62px] left-0 top-[16px] w-[255px]" data-node-id="43:186" data-name="logo">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
        </div>
      </div>
      <div className="[word-break:break-word] absolute content-stretch flex flex-col font-semibold gap-[17px] items-start left-[132px] not-italic top-[171px] w-[606px]" data-node-id="43:189" data-name="page-heading">
        <p className="leading-none relative shrink-0 text-[48px] text-black w-full" data-node-id="43:190">
          Nieuws en updates
        </p>
        <p className="leading-[normal] relative shrink-0 text-[16px] text-black w-full" data-node-id="43:191">
          Actueel nieuws, relevante ontwikkelingen
        </p>
      </div>
      <div className="absolute flex items-center justify-center left-[45px] size-[46px] top-[169px]" data-node-id="43:197">
        <div className="flex-none rotate-90">
          <div className="relative size-[46px]" data-name="page-heading-marker-triangle">
            <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
              <img alt="" className="block max-w-none size-full" src={imgPageHeadingMarkerTriangle} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[120px] top-[262px] w-[1200px]" data-node-id="43:361" data-name="news-articles-list">
        <NewsCard className="bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" />
        <NewsCard className="bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" />
        <NewsCard className="bg-[#f4f4f4] content-stretch flex gap-[39px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" />
      </div>
      <div className="-translate-x-1/2 absolute bg-[#2c4c6d] h-[279px] left-1/2 rounded-[16px] top-[2676px] w-[1200px]" data-node-id="43:370" data-name="cta-bg" />
      <div className="-translate-x-1/2 [word-break:break-word] absolute content-stretch flex flex-col gap-[16px] items-center justify-center left-1/2 not-italic text-center text-white top-[2729px] w-[800px]" data-node-id="43:371" data-name="cta-heading">
        <p className="font-semibold leading-none min-w-full relative shrink-0 text-[32px] w-[min-content]" data-node-id="43:372">{`Maak kennis met Duvet & Dubois`}</p>
        <div className="font-normal leading-[0] relative shrink-0 text-[16px] w-[648px]" data-node-id="43:373">
          <p className="font-semibold leading-[normal] mb-0">Neem contact met ons op en plan een vrijblijvend kennismakingsgesprek in.</p>
          <p className="leading-[normal]">We bespreken uw situatie, beantwoorden uw vragen en kijken welke ondersteuning het beste bij uw onderneming past.</p>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute content-stretch flex gap-[25px] items-center left-[calc(50%-0.5px)] top-[2863px]" data-node-id="43:374" data-name="cta-contact-cards">
        <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center px-[40px] py-[24px] relative rounded-[8px] shrink-0" data-node-id="43:375" data-name="contact-card-bas-neijenhuis">
          <div className="relative shrink-0 size-[122px]" data-node-id="43:376" data-name="ellipse">
            <img alt="" className="absolute block inset-0 max-w-none size-full" height="122" src={imgEllipse} width="122" />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0" data-node-id="43:377" data-name="item-bas-neijenhuis">
            <div className="content-stretch flex items-center relative shrink-0" data-node-id="43:378" data-name="item-bas-neijenhuis">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[18px] text-black whitespace-nowrap" data-node-id="43:379">
                Bas Neijenhuis
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="43:380" data-name="item-31-06-24-835">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:381" data-name="phone">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
              </div>
              <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="43:383">
                +31 (0)6 24 835 810
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="43:384" data-name="item-basddadnl">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:385" data-name="mail">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
              </div>
              <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-pre" data-node-id="43:388">{`bas@ddad.nl      `}</p>
            </div>
          </div>
        </div>
        <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center px-[40px] py-[24px] relative rounded-[8px] shrink-0" data-node-id="43:389" data-name="contact-card-frans-van-den-bosch">
          <div className="relative shrink-0 size-[122px]" data-node-id="43:390" data-name="ellipse">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0" data-node-id="43:391" data-name="item-frans-van-den-bosch">
            <div className="content-stretch flex items-center relative shrink-0" data-node-id="43:392" data-name="item-frans-van-den-bosch">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[18px] text-black whitespace-nowrap" data-node-id="43:393">
                Frans van den Bosch
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="43:394" data-name="item-31-06-24-835">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:395" data-name="phone">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
              </div>
              <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="43:397">
                +31 (0)6 24 835 810
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="43:398" data-name="item-basddadnl">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:399" data-name="mail">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
              </div>
              <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-pre" data-node-id="43:402">{`bas@ddad.nl      `}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[51px] items-center left-[108px] top-[1489px] w-[1200px]" data-node-id="43:403" data-name="benefits-section">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start not-italic relative shrink-0 text-center w-[800px]" data-node-id="43:404" data-name="section-heading">
          <p className="font-semibold leading-none relative shrink-0 text-[#2c4c6d] text-[32px] w-full" data-node-id="43:405">{`Waarom kiezen voor Duvet & Dubois?`}</p>
          <p className="font-normal leading-[normal] relative shrink-0 text-[16px] text-black w-full" data-node-id="43:406">
            Wij geloven dat een administratiekantoor meer moet zijn dan een verwerker van cijfers.
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="43:407" data-name="benefits-section-row-1">
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-node-id="43:408" data-name="benefits-section-row-2">
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-node-id="43:409" data-name="benefit-card-persoonlijk-betrokken">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:410" data-name="smile">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSmile} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="43:415" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="43:416" data-name="item-persoonlijk-betrokken">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full" data-node-id="43:417">
                    Persoonlijk betrokken
                  </p>
                </div>
                <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="43:418">
                  Een vast aanspreekpunt dat uw onderneming kent.
                </p>
              </div>
            </div>
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-node-id="43:419" data-name="benefit-card-proactief-advies">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:420" data-name="thumbs-up">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgThumbsUp} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="43:422" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="43:423" data-name="item-proactief-advies">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full" data-node-id="43:424">
                    Proactief advies
                  </p>
                </div>
                <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full whitespace-pre-wrap" data-node-id="43:425">
                  <p className="leading-[1.4] mb-0">{`Wij denken mee en signaleren kansen `}</p>
                  <p className="leading-[1.4]">op tijd.</p>
                </div>
              </div>
            </div>
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-node-id="43:426" data-name="benefit-card-betrouwbaar-en-nauwkeurig">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:427" data-name="shield">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShield} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="43:429" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="43:430" data-name="item-betrouwbaar-en-nauwkeurig">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full" data-node-id="43:431">
                    Betrouwbaar en nauwkeurig
                  </p>
                </div>
                <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full whitespace-pre-wrap" data-node-id="43:432">
                  <p className="leading-[1.4] mb-0">{`Uw administratie is altijd zorgvuldig `}</p>
                  <p className="leading-[1.4]">en up-to-date.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-node-id="43:433" data-name="benefits-section-row-3">
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-node-id="43:434" data-name="benefit-card-duidelijke-communicatie">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:435" data-name="message-square">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMessageSquare} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="43:437" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="43:438" data-name="item-duidelijke-communicatie">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full" data-node-id="43:439">
                    Duidelijke communicatie
                  </p>
                </div>
                <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="43:440">
                  <p className="leading-[1.4] mb-0">Heldere uitleg, zonder ingewikkelde vaktaal.</p>
                  <p className="leading-[1.4]">​</p>
                </div>
              </div>
            </div>
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-node-id="43:441" data-name="benefit-card-altijd-inzicht">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:442" data-name="search">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="43:445" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="43:446" data-name="item-altijd-inzicht">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full" data-node-id="43:447">
                    Altijd inzicht
                  </p>
                </div>
                <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="43:448">
                  U weet waar uw onderneming financieel staat.
                </p>
              </div>
            </div>
            <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px p-[24px] relative rounded-[16px]" data-node-id="43:449" data-name="benefit-card-korte-lijnen">
              <div className="relative shrink-0 size-[24px]" data-node-id="43:450" data-name="phone">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="43:452" data-name="card-heading">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="43:453" data-name="item-korte-lijnen">
                  <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-black text-center w-full" data-node-id="43:454">
                    Korte lijnen
                  </p>
                </div>
                <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full whitespace-pre-wrap" data-node-id="43:455">
                  <p className="leading-[1.4] mb-0">{`Snel contact en een vlotte reactie `}</p>
                  <p className="leading-[1.4]">op uw vragen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-0 left-[120px] top-[3298px] w-[1200px]" data-node-id="43:456" data-name="footer-divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgFooterDivider} />
        </div>
      </div>
      <div className="absolute content-stretch flex gap-[145px] items-start left-[120px] top-[3105px]" data-node-id="43:457" data-name="footer-columns">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="43:458" data-name="footer-column-menu">
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:459" data-name="item-menu">
            <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:460">
              Menu
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:461" data-name="item-home">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:462">
              Home
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:463" data-name="item-diensten">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:464">
              Diensten
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:465" data-name="item-over-ons">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:466">
              Over ons
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:467" data-name="item-nieuws">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:468">
              Nieuws
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:469" data-name="item-contact">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:470">
              Contact
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="43:471" data-name="footer-column-diensten">
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:472" data-name="item-diensten">
            <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:473">
              Diensten
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:474" data-name="item-administratie">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:475">
              Administratie
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:476" data-name="item-belastingadvies">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:477">
              Belastingadvies
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:478" data-name="item-jaarrekening">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:479">
              Jaarrekening
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:480" data-name="item-salarisadministratie">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:481">
              Salarisadministratie
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="43:482" data-name="footer-column-nieuws">
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:483" data-name="item-nieuws">
            <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:484">
              Nieuws
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:485" data-name="item-item-1">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:486">
              Item 1
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:487" data-name="item-item-2">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:488">
              Item 2
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:489" data-name="item-item-3">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:490">
              Item 3
            </p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="43:491" data-name="item-item-4">
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap" data-node-id="43:492">
              Item 4
            </p>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex items-center justify-end left-[1190px] top-[3307px] w-[130px]" data-node-id="43:493" data-name="footer-copyright">
        <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-right whitespace-nowrap" data-node-id="43:494">
          Copyright 20026
        </p>
      </div>
      <div className="absolute bg-[#f2f1ee] h-[429px] left-[-46px] rounded-[16px] top-[2094px] w-[1416px]" data-node-id="43:495" data-name="audience-bg" />
      <div className="absolute content-stretch flex flex-col gap-[17px] items-start left-[715px] top-[2144px] w-[606px]" data-node-id="43:496" data-name="audience-content">
        <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[32px] w-[min-content]" data-node-id="43:497">
          Voor wie werken wij?
        </p>
        <p className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]" data-node-id="43:498">
          Wij ondersteunen onder andere:
        </p>
        <div className="[word-break:break-word] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-black w-[1344px]" data-node-id="43:499">
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
        <div className="[word-break:break-word] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content] whitespace-pre-wrap" data-node-id="43:500">
          <p className="leading-[1.4] mb-0">{`Ongeacht de fase waarin uw onderneming zich bevindt, `}</p>
          <p className="leading-[1.4]">denken wij graag met u mee. Wilt u weten wat wij voor u kunnen betekenen?</p>
        </div>
        <div className="bg-[#2c4c6d] content-stretch flex h-[56px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" data-node-id="43:501" data-name="audience-cta-button">
          <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap" data-node-id="I43:501;2:614">
            Plan een vrijblijvend kennismakingsgesprek
          </p>
        </div>
      </div>
      <div className="absolute h-[581px] left-[108px] rounded-[16px] top-[2023px] w-[566px]" data-node-id="43:502" data-name="audience-image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgAudienceImage} />
      </div>
    </div>
  );
}
