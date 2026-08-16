const imgLogo = "/duvet-dubois/mobile-assets/home-logo.png";
const imgHeroImageFrame = "/duvet-dubois/mobile-assets/home-hero-bg.png";
const imgMenuIcon = "/duvet-dubois/mobile-assets/home-menu-icon.svg";
const imgArguslogov1 = "/duvet-dubois/mobile-assets/home-argus-logo.png";
const imgAfasLogoWebsite1 = "/duvet-dubois/mobile-assets/home-afas-logo.png";
const imgDownload1 = "/duvet-dubois/mobile-assets/home-abn-amro-logo.svg";
const imgAudienceDecorImage2 = "/duvet-dubois/mobile-assets/home-abacus-decor.png";
const imgFolder = "/duvet-dubois/mobile-assets/home-icon-folder.svg";
const imgIconCheck1 = "/duvet-dubois/mobile-assets/home-icon-check-1.svg";
const imgMessageCircle = "/duvet-dubois/mobile-assets/home-icon-message-circle.svg";
const imgIconCheck2 = "/duvet-dubois/mobile-assets/home-icon-check-2.svg";
const imgShield = "/duvet-dubois/mobile-assets/home-icon-shield.svg";
const imgIconCheck3 = "/duvet-dubois/mobile-assets/home-icon-check-3.svg";
const imgFile = "/duvet-dubois/mobile-assets/home-icon-file.svg";
const imgIconCheck4 = "/duvet-dubois/mobile-assets/home-icon-check-4.svg";
const imgAudiencePhoto = "/duvet-dubois/mobile-assets/home-audience-photo.png";
const imgSmile = "/duvet-dubois/mobile-assets/home-icon-smile.svg";
const imgThumbsUp = "/duvet-dubois/mobile-assets/home-icon-thumbs-up.svg";
const imgShield2 = "/duvet-dubois/mobile-assets/home-icon-shield-2.svg";
const imgMessageSquare = "/duvet-dubois/mobile-assets/home-icon-message-square.svg";
const imgSearch = "/duvet-dubois/mobile-assets/home-icon-search.svg";
const imgPhone = "/duvet-dubois/mobile-assets/home-icon-phone.svg";
const imgEllipseBas = "/duvet-dubois/mobile-assets/home-avatar-bas.png";
const imgPhone2 = "/duvet-dubois/mobile-assets/home-icon-phone-2.svg";
const imgMail = "/duvet-dubois/mobile-assets/home-icon-mail.svg";
const imgEllipseFrans = "/duvet-dubois/mobile-assets/home-avatar-frans.svg";
const imgFooterDivider = "/duvet-dubois/mobile-assets/home-footer-divider.svg";

function ServiceBullet({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <div className="flex flex-row items-center self-stretch">
        <div className="content-stretch flex h-full items-center pt-[3px] relative shrink-0">
          <div className="relative shrink-0 size-[16px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={icon} />
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}

export default function FrameMobile() {
  return (
    <div className="bg-white relative size-full" data-node-id="50:226" data-name="Homepage — mobile max 600">
      {/* hero-section */}
      <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-[393px]" data-node-id="50:697" data-name="hero-section">
        <div className="content-stretch flex items-center justify-between px-[24px] relative shrink-0 w-[393px]" data-node-id="50:241" data-name="header">
          <div className="content-stretch flex flex-col items-start py-[10px] relative shrink-0 w-[186px]" data-node-id="50:234" data-name="header-logo">
            <div className="aspect-[283/69] relative shrink-0 w-full" data-node-id="50:235" data-name="logo">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
            </div>
          </div>
          <div className="relative shrink-0 size-[24px]" data-node-id="50:236" data-name="menu-icon">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMenuIcon} />
          </div>
        </div>
        <div className="h-[619px] relative shrink-0 w-[393px]" data-node-id="50:242" data-name="hero-image-frame">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[66.4%] left-[-28.38%] max-w-none top-[0.06%] w-[156.77%]" src={imgHeroImageFrame} />
          </div>
        </div>
      </div>

      {/* hero-overlay */}
      <div className="absolute content-stretch flex items-center justify-center left-0 px-[24px] top-[296px] w-[393px]" data-node-id="50:256" data-name="hero-overlay">
        <div className="bg-[#2c4c6d] content-stretch flex flex-[1_0_0] flex-col gap-[17px] items-start min-w-px px-[16px] py-[24px] relative rounded-[8px]" data-node-id="50:257" data-name="hero-content">
          <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[24px] text-white w-[min-content]" data-node-id="50:258">
            Uw financiële administratie in vertrouwde handen
          </p>
          <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[14px] text-white w-[min-content]" data-node-id="50:259">
            Administratie, belastingadvies en financieel inzicht voor ondernemers. Persoonlijk en deskundig, zodat u met vertrouwen kunt ondernemen.
          </p>
          <p className="[word-break:break-word] font-semibold leading-[0] min-w-full not-italic relative shrink-0 text-[0px] text-white w-[min-content]" data-node-id="50:260">
            <span className="font-normal leading-[1.4] text-[#d1a97b] text-[14px]">✓</span>
            <span className="font-normal leading-[1.4] text-[14px]">
              {` Persoonlijk contact`}
              <br aria-hidden />
            </span>
            <span className="font-normal leading-[1.4] text-[#d1a97b] text-[14px]">✓</span>
            <span className="font-normal leading-[1.4] text-[14px]">
              {` Deskundig belastingadvies`}
              <br aria-hidden />
            </span>
            <span className="font-normal leading-[1.4] text-[#d1a97b] text-[14px]">✓</span>
            <span className="font-normal leading-[1.4] text-[14px]">
              {` Heldere financiële inzichten`}
              <br aria-hidden />
            </span>
            <span className="font-normal leading-[1.4] text-[#d1a97b] text-[14px]">✓</span>
            <span className="font-normal leading-[1.4] text-[14px]">{` Betrouwbare ondersteuning voor iedere ondernemer`}</span>
          </p>
          <div className="group bg-[#e4c5a1] content-stretch flex h-[37px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#f4e3cf] active:bg-[#f4e3cf] transition-colors cursor-pointer" data-node-id="50:261" data-name="hero-cta-button">
            <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline" data-node-id="I50:261;54:228">
              Vrijblijvend kennismaken
            </p>
          </div>
        </div>
      </div>

      {/* logo-strip */}
      <div className="absolute content-stretch flex items-center justify-center left-0 px-[64px] top-[724px] w-[393px] h-[39px]" data-node-id="50:269" data-name="logo-strip">
        <div className="content-stretch flex gap-[24px] items-end relative shrink-0" data-node-id="50:270" data-name="group">
          <div className="h-[28.812px] relative shrink-0 w-[200px]" data-node-id="50:271" data-name="arguslogov1 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgArguslogov1} />
          </div>
          <div className="h-[39px] relative shrink-0 w-[128px]" data-node-id="50:272" data-name="afas logo website 1">
            <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src={imgAfasLogoWebsite1} />
          </div>
          <div className="h-[27px] relative shrink-0 w-[134px]" data-node-id="50:273" data-name="download 1">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDownload1} />
          </div>
          <div className="h-[28.812px] relative shrink-0 w-[200px]" data-node-id="50:285" data-name="arguslogov1 2">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgArguslogov1} />
          </div>
          <div className="h-[39px] relative shrink-0 w-[128px]" data-node-id="50:286" data-name="afas logo website 2">
            <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src={imgAfasLogoWebsite1} />
          </div>
        </div>
      </div>

      {/* intro-section */}
      <div className="absolute bg-[#f4f4f4] content-stretch flex flex-col items-start left-0 p-[24px] top-[803px] w-[393px]" data-node-id="50:293" data-name="intro-section">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-full" data-node-id="50:294" data-name="item-meer-dan-alleen-cijfers">
          <div className="relative shrink-0 size-[113px]" data-node-id="50:298" data-name="audience-decor-image-2">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAudienceDecorImage2} />
          </div>
          <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[20px] text-center w-[min-content]" data-node-id="50:295">
            Meer dan alleen cijfers
          </p>
          <div className="[word-break:break-word] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[14px] text-black text-center w-[min-content] whitespace-pre-wrap" data-node-id="50:296">
            <p className="leading-[1.4] mb-0">{`Een goede administratie vormt de basis van een gezonde onderneming. Bij Duvet & Dubois kijken we verder dan de boekhouding alleen. We denken actief met u mee over fiscale kansen, financiële keuzes en de toekomst van uw bedrijf.`}</p>
            <p className="leading-[1.4] mb-0">​</p>
            <p className="leading-[1.4]">Of u nu start als ondernemer, een groeiend mkb-bedrijf heeft of behoefte heeft aan een betrouwbare financiële sparringpartner: wij bieden ondersteuning die past bij uw onderneming.</p>
          </div>
        </div>
      </div>

      {/* services-section */}
      <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-0 px-[24px] top-[1256px] w-[393px]" data-node-id="50:300" data-name="services-section">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="50:301" data-name="section-heading">
          <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[#2c4c6d] text-[20px] text-center w-full" data-node-id="50:302">
            Onze dienstverlening
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="50:303" data-name="services-section-row-1">
          {/* Administratie */}
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:305" data-name="service-card-administratie">
            <div className="relative shrink-0 size-[24px]" data-node-id="50:306" data-name="folder">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFolder} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="50:308">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[18px] text-black text-center w-full" data-node-id="50:310">
                Administratie
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full" data-node-id="50:311">
                Wij nemen uw het uit handen, zodat u zich kunt richten op ondernemen.
              </p>
            </div>
            <div className="bg-[#f6f6f6] content-stretch flex items-center justify-center py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:312">
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="50:313">
                <ServiceBullet icon={imgIconCheck1} label="Financiële administratie" />
                <ServiceBullet icon={imgIconCheck1} label="Debiteuren- en crediteurenbeheer" />
                <ServiceBullet icon={imgIconCheck1} label="Periodieke rapportages" />
                <ServiceBullet icon={imgIconCheck1} label="Digitaal administreren" />
                <ServiceBullet icon={imgIconCheck1} label="Altijd inzicht in uw cijfers" />
              </div>
            </div>
            <div className="group bg-[#2c4c6d] content-stretch flex h-[48px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#09223e] active:bg-[#09223e] transition-colors cursor-pointer" data-node-id="50:339">
              <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline">
                Alles over Administratie
              </p>
            </div>
          </div>
          {/* Belastingadvies */}
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:340" data-name="service-card-belastingadvies">
            <div className="relative shrink-0 size-[24px]" data-node-id="50:341" data-name="message-circle">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMessageCircle} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="50:343">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[18px] text-black text-center w-full" data-node-id="50:345">
                Belastingadvies
              </p>
              <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full whitespace-pre-wrap" data-node-id="50:346">
                <p className="leading-[1.4] mb-0">{`Deskundig belastingadvies, `}</p>
                <p className="leading-[1.4]">afgestemd op uw onderneming.</p>
              </div>
            </div>
            <div className="bg-[#f6f6f6] content-stretch flex items-center justify-center py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:347">
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="50:348">
                <ServiceBullet icon={imgIconCheck2} label="Inkomstenbelasting" />
                <ServiceBullet icon={imgIconCheck2} label="Vennootschapsbelasting" />
                <ServiceBullet icon={imgIconCheck2} label="Omzetbelasting (btw)" />
                <ServiceBullet icon={imgIconCheck2} label="Fiscaal advies" />
                <ServiceBullet icon={imgIconCheck2} label="Begeleiding bij controles" />
              </div>
            </div>
            <div className="group bg-[#2c4c6d] content-stretch flex h-[48px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#09223e] active:bg-[#09223e] transition-colors cursor-pointer" data-node-id="50:374">
              <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline">
                Alles over Belastingadvies
              </p>
            </div>
          </div>
          {/* Jaarrekening */}
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:376" data-name="service-card-jaarrekening">
            <div className="relative shrink-0 size-[24px]" data-node-id="50:377" data-name="shield">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShield} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="50:379">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[18px] text-black text-center w-full" data-node-id="50:381">
                Jaarrekening
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center w-full" data-node-id="50:382">
                Een betrouwbare jaarrekening als basis voor uw onderneming.
              </p>
            </div>
            <div className="bg-[#f6f6f6] content-stretch flex items-center justify-center py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:383">
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="50:384">
                <ServiceBullet icon={imgIconCheck3} label="Jaarrekening samenstellen" />
                <ServiceBullet icon={imgIconCheck3} label="Publicatiestukken" />
                <ServiceBullet icon={imgIconCheck3} label="Financiële analyse" />
                <ServiceBullet icon={imgIconCheck3} label="Bespreking van de resultaten" />
              </div>
            </div>
            <div className="group bg-[#2c4c6d] content-stretch flex h-[48px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#09223e] active:bg-[#09223e] transition-colors cursor-pointer" data-node-id="50:405">
              <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline">
                Alles over Jaarrekening
              </p>
            </div>
          </div>
          {/* Salarisadministratie */}
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:406" data-name="service-card-salarisadministratie">
            <div className="relative shrink-0 size-[24px]" data-node-id="50:407" data-name="file">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFile} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="50:410">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[18px] text-black text-center w-full" data-node-id="50:412">
                Salarisadministratie
              </p>
              <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center w-full whitespace-pre-wrap" data-node-id="50:413">
                <p className="leading-[1.4] mb-0">{`Een correcte salarisverwerking `}</p>
                <p className="leading-[1.4]">voorkomt fouten en bespaart tijd.</p>
              </div>
            </div>
            <div className="bg-[#f6f6f6] content-stretch flex items-center justify-center py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:414">
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-node-id="50:415">
                <ServiceBullet icon={imgIconCheck4} label="Salarisverwerking" />
                <ServiceBullet icon={imgIconCheck4} label="Loonstroken" />
                <ServiceBullet icon={imgIconCheck4} label="Pensioen- en premieafdrachten" />
                <ServiceBullet icon={imgIconCheck4} label="Verlof- en personeelsadministratie" />
              </div>
            </div>
            <div className="group bg-[#2c4c6d] content-stretch flex h-[48px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#09223e] active:bg-[#09223e] transition-colors cursor-pointer" data-node-id="50:436">
              <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline">
                Alles over Salarisadministratie
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* audience-section */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-center justify-center left-0 px-[24px] top-[3176px] w-[393px]" data-node-id="50:478" data-name="audience-section">
        <div className="h-[398px] relative shrink-0 w-[387px]" data-node-id="50:479" data-name="rectangle">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAudiencePhoto} />
        </div>
        <div className="content-stretch flex flex-col gap-[17px] items-start relative shrink-0 w-full" data-node-id="50:480">
          <p className="[word-break:break-word] font-semibold leading-none min-w-full not-italic relative shrink-0 text-[#2c4c6d] text-[20px] w-[min-content]" data-node-id="50:481">
            Voor wie werken wij?
          </p>
          <p className="[word-break:break-word] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]" data-node-id="50:482">
            Wij ondersteunen onder andere:
          </p>
          <div className="[word-break:break-word] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-black w-full" data-node-id="50:483">
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
          <p className="[word-break:break-word] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]" data-node-id="50:484">
            Ongeacht de fase waarin uw onderneming zich bevindt, denken wij graag met u mee. Wilt u weten wat wij voor u kunnen betekenen?
          </p>
          <div className="group bg-[#2c4c6d] content-stretch flex h-[48px] items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0 hover:bg-[#09223e] active:bg-[#09223e] transition-colors cursor-pointer" data-node-id="50:485">
            <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap group-hover:font-bold group-hover:underline group-active:font-bold group-active:no-underline">
              Plan een vrijblijvend kennismakingsgesprek
            </p>
          </div>
        </div>
      </div>

      {/* benefits-grid */}
      <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-0 px-[24px] top-[3991px] w-[393px]" data-node-id="50:493" data-name="benefits-grid">
        <div className="[word-break:break-word] font-semibold leading-[0] not-italic relative shrink-0 text-[#2c4c6d] text-[20px] text-center w-full whitespace-pre-wrap" data-node-id="50:549">
          <p className="leading-none mb-0">{`Waarom kiezen voor `}</p>
          <p className="leading-none">{`Duvet & Dubois?`}</p>
        </div>
        <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full" data-node-id="50:547">
          Wij geloven dat een administratiekantoor meer moet zijn dan een verwerker van cijfers.
        </p>
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-node-id="50:494">
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:495">
            <div className="relative shrink-0 size-[24px]" data-name="smile">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSmile} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                Persoonlijk betrokken
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">
                Een vast aanspreekpunt dat uw onderneming kent.
              </p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:505">
            <div className="relative shrink-0 size-[24px]" data-name="thumbs-up">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgThumbsUp} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                Proactief advies
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">
                Wij denken mee en signaleren kansen op tijd.
              </p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:512">
            <div className="relative shrink-0 size-[24px]" data-name="shield">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShield2} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                Betrouwbaar en nauwkeurig
              </p>
              <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center w-full whitespace-pre-wrap">
                <p className="leading-[1.4] mb-0">{`Uw administratie is altijd zorgvuldig `}</p>
                <p className="leading-[1.4]">en up-to-date.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-node-id="50:519">
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:520">
            <div className="relative shrink-0 size-[24px]" data-name="message-square">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMessageSquare} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                Duidelijke communicatie
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">
                Heldere uitleg, zonder ingewikkelde vaktaal.
              </p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:527">
            <div className="relative shrink-0 size-[24px]" data-name="search">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                Altijd inzicht
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center w-full">
                U weet waar uw onderneming financieel staat.
              </p>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex flex-col gap-[16px] items-center px-[16px] py-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="50:535">
            <div className="relative shrink-0 size-[24px]" data-name="phone">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                Korte lijnen
              </p>
              <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-center w-full">
                Snel contact en een vlotte reactie op uw vragen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* cta-heading */}
      <div className="absolute bg-[#2c4c6d] content-stretch flex flex-col gap-[16px] items-center justify-center left-0 p-[24px] top-[5079px] w-[393px]" data-node-id="50:656" data-name="cta-heading">
        <p className="[word-break:break-word] font-semibold leading-none not-italic relative shrink-0 text-[20px] text-center text-white w-full" data-node-id="50:657">
          Klaar voor een administratie zonder zorgen?
        </p>
        <div className="[word-break:break-word] font-normal leading-[0] not-italic relative shrink-0 text-[0px] text-center text-white w-full" data-node-id="50:658">
          <p className="font-semibold leading-[1.4] mb-0 text-[14px]">Neem contact met ons op en plan een vrijblijvend kennismakingsgesprek in.</p>
          <p className="leading-[1.4] text-[14px]">We bespreken uw situatie, beantwoorden uw vragen en kijken welke ondersteuning het beste bij uw onderneming past.</p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-node-id="50:659">
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center p-[24px] relative rounded-[8px] shrink-0 w-full" data-node-id="50:660">
            <div className="relative shrink-0 size-[80px]" data-node-id="50:661">
              <img alt="" className="absolute block inset-0 max-w-none size-full" height="80" src={imgEllipseBas} width="80" />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0" data-node-id="50:662">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="50:664">
                Bas Neijenhuis
              </p>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="50:665">
                <div className="relative shrink-0 size-[24px]" data-node-id="50:666" data-name="phone">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone2} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="50:668">
                  +31 (0)6 24 835 810
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="50:669">
                <div className="relative shrink-0 size-[24px]" data-node-id="50:670" data-name="mail">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-pre" data-node-id="50:673">{`bas@ddad.nl      `}</p>
              </div>
            </div>
          </div>
          <div className="bg-white content-stretch drop-shadow-[2px_4px_5.45px_rgba(0,0,0,0.25)] flex gap-[24px] items-center p-[24px] relative rounded-[8px] shrink-0 w-full" data-node-id="50:674">
            <div className="relative shrink-0 size-[80px]" data-node-id="50:675">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipseFrans} />
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0" data-node-id="50:676">
              <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap" data-node-id="50:678">
                Frans van den Bosch
              </p>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="50:679">
                <div className="relative shrink-0 size-[24px]" data-node-id="50:680" data-name="phone">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone2} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="50:682">
                  +31 (0)6 24 835 810
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="50:683">
                <div className="relative shrink-0 size-[24px]" data-node-id="50:684" data-name="mail">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
                </div>
                <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-pre" data-node-id="50:687">{`bas@ddad.nl      `}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer-section */}
      <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-0 pb-[40px] top-[5623px] w-[393px]" data-node-id="50:695" data-name="footer-section">
        <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0" data-node-id="50:585">
          <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-node-id="50:586">
            <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Menu</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Home</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Diensten</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Over ons</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Nieuws</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-center whitespace-nowrap">Contact</p>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-node-id="50:599">
            <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Diensten</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Administratie</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Belastingadvies</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Jaarrekening</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Salarisadministratie</p>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-node-id="50:610">
            <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Nieuws</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 1</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 2</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 3</p>
            <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] whitespace-nowrap">Item 4</p>
          </div>
        </div>
        <div className="h-[20px] relative shrink-0 w-full" data-node-id="50:691">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFooterDivider} />
        </div>
        <div className="content-stretch flex items-center justify-end relative shrink-0 w-[130px]" data-node-id="50:692">
          <p className="[word-break:break-word] font-normal leading-[1.4] not-italic relative shrink-0 text-[#626262] text-[14px] text-right whitespace-nowrap" data-node-id="50:693">
            Copyright 20026
          </p>
        </div>
      </div>
    </div>
  );
}
