import MobileMenu from "../../components/MobileMenu";

const imgLogo = "/duvet-dubois/mobile-assets/over-ons-logo.png";
const imgHeroImage = "/duvet-dubois/mobile-assets/over-ons-hero-image.png";
const imgPillarIcon1 = "/duvet-dubois/mobile-assets/over-ons-pillar-icon-1.svg";
const imgPillarIcon2 = "/duvet-dubois/mobile-assets/over-ons-pillar-icon-2.svg";
const imgPillarIcon3 = "/duvet-dubois/mobile-assets/over-ons-pillar-icon-3.svg";
const imgSmile = "/duvet-dubois/mobile-assets/over-ons-icon-smile.svg";
const imgThumbsUp = "/duvet-dubois/mobile-assets/over-ons-icon-thumbs-up.svg";
const imgShield = "/duvet-dubois/mobile-assets/over-ons-icon-shield.svg";
const imgMessageSquare = "/duvet-dubois/mobile-assets/over-ons-icon-message-square.svg";
const imgSearch = "/duvet-dubois/mobile-assets/over-ons-icon-search.svg";
const imgPhone = "/duvet-dubois/mobile-assets/over-ons-icon-phone.svg";
const imgAudiencePhoto = "/duvet-dubois/mobile-assets/over-ons-audience-photo.png";
const imgEllipseBas = "/duvet-dubois/mobile-assets/over-ons-avatar-bas.png";
const imgPhone2 = "/duvet-dubois/mobile-assets/over-ons-icon-phone-2.svg";
const imgMail = "/duvet-dubois/mobile-assets/over-ons-icon-mail.svg";
const imgEllipseFrans = "/duvet-dubois/mobile-assets/over-ons-avatar-frans.svg";
const imgFooterDivider = "/duvet-dubois/mobile-assets/over-ons-footer-divider.svg";

export default function FrameMobile() {
  return (
    <div className="bg-white relative size-full" data-node-id="65:268" data-name="Over ons — mobile max 600">
      {/* Frame 4: header + hero image */}
      <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-[393px]" data-node-id="50:1043">
        <div className="bg-white content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="65:269" data-name="header">
          <div className="content-stretch flex flex-col items-start py-[10px] relative shrink-0 w-[186px]" data-node-id="65:270" data-name="header-logo">
            <div className="aspect-[283/69] relative shrink-0 w-full" data-node-id="65:271" data-name="logo">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
            </div>
          </div>
          <MobileMenu />
        </div>
        <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="50:1042">
          <div className="flex-[1_0_0] h-[400px] min-w-px relative" data-node-id="66:269" data-name="hero-image">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgHeroImage} />
          </div>
        </div>
      </div>

      {/* Frame 1: overlapping hero-content card */}
      <div className="absolute content-stretch flex items-center left-0 px-[24px] top-[296px] w-[393px]" data-node-id="50:1040">
        <div className="bg-[#2c4c6d] content-stretch flex flex-[1_0_0] flex-col gap-[17px] items-start min-w-px overflow-clip px-[24px] py-[32px] relative rounded-[8px]" data-node-id="66:270" data-name="hero-content">
          <p className="[word-break:break-word] font-semibold leading-[normal] min-w-full not-italic relative shrink-0 text-[24px] text-white w-[min-content]" data-node-id="66:271">{`Over Duvet & Dubois`}</p>
          <p className="[word-break:break-word] font-semibold leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-white w-[min-content]" data-node-id="66:272">
            Persoonlijke betrokkenheid, deskundig advies
          </p>
          <div className="[word-break:break-word] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content] whitespace-pre-wrap" data-node-id="66:273">
            <p className="leading-[1.4] mb-0">{`Bij Duvet & Dubois geloven we dat een goede administratie meer is dan alleen cijfers verwerken. Het is de basis voor gezonde financiële keuzes en succesvol ondernemen. Daarom ondersteunen wij ondernemers met betrouwbare administratieve dienstverlening, deskundig belastingadvies en persoonlijk contact.`}</p>
            <p className="leading-[1.4] mb-0">​</p>
            <p className="leading-[1.4]">Wij nemen de tijd om uw onderneming te leren kennen. Zo kunnen we niet alleen uw administratie verzorgen, maar ook meedenken over financiële vraagstukken en fiscale kansen.</p>
          </div>
          <div className="group bg-[#e4c5a1] content-stretch flex h-[48px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#f4e3cf] active:bg-[#f4e3cf] transition-colors cursor-pointer" data-node-id="66:274" data-name="Button">
            <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline">
              Vrijblijvend kennismaken
            </p>
          </div>
        </div>
      </div>

      {/* logo-strip */}
      <div className="absolute content-stretch flex items-center justify-center left-0 px-[64px] top-[846px] w-[393px] h-[39px]" data-node-id="65:278" data-name="logo-strip">
        <div className="content-stretch flex gap-[24px] items-end relative shrink-0">
          <div className="h-[28.812px] relative shrink-0 w-[200px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/duvet-dubois/mobile-assets/home-argus-logo.png" />
          </div>
          <div className="h-[39px] relative shrink-0 w-[128px]">
            <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src="/duvet-dubois/mobile-assets/home-afas-logo.png" />
          </div>
          <div className="h-[27px] relative shrink-0 w-[134px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/duvet-dubois/mobile-assets/home-abn-amro-logo.svg" />
          </div>
          <div className="h-[28.812px] relative shrink-0 w-[200px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/duvet-dubois/mobile-assets/home-argus-logo.png" />
          </div>
          <div className="h-[39px] relative shrink-0 w-[128px]">
            <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src="/duvet-dubois/mobile-assets/home-afas-logo.png" />
          </div>
        </div>
      </div>

      {/* Frame 2: approach-section (Onze aanpak) */}
      <div className="absolute content-stretch flex items-center left-0 px-[24px] top-[925px] w-[393px]" data-node-id="50:1041">
        <div className="bg-[#f2f1ee] content-stretch flex flex-col gap-[24px] items-center overflow-clip px-[24px] py-[32px] relative rounded-[8px] w-full" data-node-id="67:270" data-name="approach-section">
          <p className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#1c3654] text-[20px] text-center w-[min-content]" data-node-id="67:271">
            Onze aanpak
          </p>
          <p className="[word-break:break-word] font-normal leading-[1.6] min-w-full not-italic relative shrink-0 text-[#3b4550] text-[14px] text-center w-[min-content]" data-node-id="67:272">{`Bij Duvet & Dubois geloven we dat een goede samenwerking begint met elkaar leren kennen. Daarom nemen we de tijd om uw onderneming, ambities en uitdagingen te begrijpen zodat ons advies écht aansluit bij uw situatie.`}</p>
          <div className="content-stretch flex flex-col gap-[28px] items-start overflow-clip relative shrink-0 w-full" data-node-id="67:273" data-name="pillars">
            <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0 w-full" data-node-id="67:274" data-name="pillar">
              <div className="bg-[#e4cda2] content-stretch flex h-[44px] items-center justify-center overflow-clip px-[8px] relative rounded-[10px] shrink-0" data-node-id="67:275">
                <div className="relative shrink-0 size-[22px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPillarIcon1} />
                </div>
              </div>
              <p className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#1c3654] text-[16px] w-[min-content]" data-node-id="67:279">
                Zorgvuldige administratie
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.6] min-w-full not-italic relative shrink-0 text-[#3b4550] text-[14px] w-[min-content]" data-node-id="67:280">
                Uw administratie wordt nauwkeurig en overzichtelijk bijgehouden, zodat u altijd inzicht heeft in de financiële gezondheid van uw onderneming. We kijken verder dan de cijfers: we denken proactief mee en signaleren fiscale kansen tijdig.
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0 w-full" data-node-id="67:281" data-name="pillar">
              <div className="bg-[#e4cda2] content-stretch flex h-[44px] items-center justify-center overflow-clip px-[8px] relative rounded-[10px] shrink-0" data-node-id="67:282">
                <div className="relative shrink-0 size-[22px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPillarIcon2} />
                </div>
              </div>
              <p className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#1c3654] text-[16px] w-[min-content]" data-node-id="67:286">
                Eén vast aanspreekpunt
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.6] min-w-full not-italic relative shrink-0 text-[#3b4550] text-[14px] w-[min-content]" data-node-id="67:287">
                Persoonlijk contact staat centraal. U heeft een vast aanspreekpunt dat uw onderneming kent en snel kan schakelen wanneer u vragen heeft. Geen ingewikkelde vaktaal, maar heldere communicatie en praktisch advies.
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0 w-full" data-node-id="67:288" data-name="pillar">
              <div className="bg-[#e4cda2] content-stretch flex h-[44px] items-center justify-center overflow-clip px-[8px] relative rounded-[10px] shrink-0" data-node-id="67:289">
                <div className="relative shrink-0 size-[22px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPillarIcon3} />
                </div>
              </div>
              <p className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#1c3654] text-[16px] w-[min-content]" data-node-id="67:293">
                Duurzame samenwerking
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.6] min-w-full not-italic relative shrink-0 text-[#3b4550] text-[14px] w-[min-content]" data-node-id="67:294">
                Zo bouwen we aan een samenwerking waarin u met vertrouwen kunt ondernemen, terwijl wij zorgen dat uw administratie en belastingzaken goed geregeld zijn — vandaag en op de lange termijn.
              </p>
            </div>
          </div>
          <div className="group bg-[#2c4c6d] content-stretch flex h-[48px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#09223e] active:bg-[#09223e] transition-colors cursor-pointer" data-node-id="67:295">
            <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline">
              Plan een kennismakingsgesprek
            </p>
          </div>
        </div>
      </div>

      {/* benefits-grid — identical content to homepage's */}
      <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-0 px-[24px] top-[1984px] w-[393px]" data-node-id="65:297" data-name="benefits-grid">
        <div className="[word-break:break-word] font-semibold leading-[0] not-italic relative shrink-0 text-[#2c4c6d] text-[20px] text-center w-full whitespace-pre-wrap">
          <p className="leading-none mb-0">{`Waarom kiezen voor `}</p>
          <p className="leading-none">{`Duvet & Dubois?`}</p>
        </div>
        <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">
          Wij geloven dat een administratiekantoor meer moet zijn dan een verwerker van cijfers.
        </p>
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full">
            <div className="relative shrink-0 size-[24px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSmile} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">Persoonlijk betrokken</p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">Een vast aanspreekpunt dat uw onderneming kent.</p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full">
            <div className="relative shrink-0 size-[24px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgThumbsUp} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">Proactief advies</p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">Wij denken mee en signaleren kansen op tijd.</p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full">
            <div className="relative shrink-0 size-[24px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShield} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">Betrouwbaar en nauwkeurig</p>
              <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center w-full whitespace-pre-wrap">
                <p className="leading-[1.4] mb-0">{`Uw administratie is altijd zorgvuldig `}</p>
                <p className="leading-[1.4]">en up-to-date.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full">
            <div className="relative shrink-0 size-[24px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMessageSquare} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">Duidelijke communicatie</p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">Heldere uitleg, zonder ingewikkelde vaktaal.</p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full">
            <div className="relative shrink-0 size-[24px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">Altijd inzicht</p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">U weet waar uw onderneming financieel staat.</p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full">
            <div className="relative shrink-0 size-[24px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">Korte lijnen</p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center w-full">Snel contact en een vlotte reactie op uw vragen.</p>
            </div>
          </div>
        </div>
      </div>

      {/* audience-section — identical content to homepage's */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-center justify-center left-0 px-[24px] top-[3072px] w-[393px]" data-node-id="65:348" data-name="audience-section">
        <div className="h-[398px] relative shrink-0 w-[387px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAudiencePhoto} />
        </div>
        <div className="content-stretch flex flex-col gap-[17px] items-start relative shrink-0 w-full">
          <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[20px] w-[min-content]">
            Voor wie werken wij?
          </p>
          <p className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">
            Wij ondersteunen onder andere:
          </p>
          <div className="[word-break:break-word] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-black w-full">
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
          <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">
            Ongeacht de fase waarin uw onderneming zich bevindt, denken wij graag met u mee. Wilt u weten wat wij voor u kunnen betekenen?
          </p>
          <div className="group bg-[#2c4c6d] content-stretch flex h-[48px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#09223e] active:bg-[#09223e] transition-colors cursor-pointer">
            <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline">
              Plan een vrijblijvend kennismakingsgesprek
            </p>
          </div>
        </div>
      </div>

      {/* cta-heading — "Maak kennis met Duvet & Dubois" */}
      <div className="absolute bg-[#2c4c6d] content-stretch flex flex-col gap-[16px] items-center justify-center left-0 p-[24px] top-[3887px] w-[393px]" data-node-id="65:356" data-name="cta-heading">
        <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-center text-white w-full">{`Maak kennis met Duvet & Dubois`}</p>
        <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[0px] text-center text-white w-full">
          <p className="font-semibold leading-[1.4] mb-0 text-[14px]">Neem contact met ons op en plan een vrijblijvend kennismakingsgesprek in.</p>
          <p className="leading-[1.4] text-[14px]">We bespreken uw situatie, beantwoorden uw vragen en kijken welke ondersteuning het beste bij uw onderneming past.</p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center p-[24px] relative rounded-[8px] shrink-0 w-full">
            <div className="relative shrink-0 size-[80px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" height="80" src={imgEllipseBas} width="80" />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">Bas Neijenhuis</p>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[24px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone2} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">+31 (0)6 24 835 810</p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[24px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-pre">{`bas@ddad.nl      `}</p>
              </div>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center p-[24px] relative rounded-[8px] shrink-0 w-full">
            <div className="relative shrink-0 size-[80px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipseFrans} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">Frans van den Bosch</p>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[24px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone2} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">+31 (0)6 24 835 810</p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[24px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-pre">{`bas@ddad.nl      `}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer-section — identical content to homepage's */}
      <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-0 pb-[40px] top-[4411px] w-[393px]" data-node-id="65:388" data-name="footer-section">
        <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
          <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0">
            <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Menu</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Home</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Diensten</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Over ons</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Nieuws</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Contact</p>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0">
            <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Diensten</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Administratie</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Belastingadvies</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Jaarrekening</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Salarisadministratie</p>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0">
            <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Nieuws</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 1</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 2</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 3</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 4</p>
          </div>
        </div>
        <div className="h-[20px] relative shrink-0 w-full">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFooterDivider} />
        </div>
        <div className="content-stretch flex items-center justify-end relative shrink-0 w-[130px]">
          <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-right whitespace-nowrap">
            Copyright 20026
          </p>
        </div>
      </div>
    </div>
  );
}
