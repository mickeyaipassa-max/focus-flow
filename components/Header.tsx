import { Icon } from "./Icon";

type HeaderProps = {
  /**
   * Titel die gecentreerd in de Header wordt getoond (bv. "Verzuimverzekering").
   * In Figma is dit een placeholder ("Funnel title") die per instance overschreven
   * wordt — er is geen zinvolle default, dus geen defaultwaarde.
   */
  title: string;
  /**
   * Toont/verbergt de Chat-knop. Geen formele Figma-variant, maar waargenomen
   * gedrag: zichtbaar op sommige funnel-schermen (bv. Succes), verborgen op
   * andere (bv. Intro). Default true, gelijk aan de basis-componentdefinitie.
   */
  chatButton?: boolean;
  /**
   * Toont een telefoonnummer i.p.v. de Chat-knop (bevestigd op "Jouw bedrijf
   * 1/3", Header Funnel-instance: zelfde knop-slot, maar met een phone-icoon
   * en "(0800) 00 00 000" i.p.v. chat-icoon en "Chat" — geen aparte formele
   * Figma-variant/property hiervoor (componentProperties tonen alleen
   * `viewport` en `IKZ sticker`), dus een content-override op dezelfde knop,
   * niet een nieuw component. Heeft voorrang op `chatButton` wanneer gezet.
   */
  phoneNumber?: string;
  /**
   * Toont "Annuleren" i.p.v. Chat/telefoonnummer, op hetzelfde knop-slot
   * (bevestigd op de mutatie-funnel "Dekking wijzigen", node 8031:10688:
   * zelfde "Chat Button"-slot, nu met close-icoon + "Annuleren"). Heeft
   * voorrang op zowel `phoneNumber` als `chatButton`.
   */
  cancelButton?: boolean;
  onCancel?: () => void;
  /**
   * Toont de "ik kies zelf"-sticker naast de titel (Figma: Header Funnel's
   * "Logo" instance, type="ikz-sticker-arrow-left" — bevestigd bestaande
   * property, destijds bewust niet gebouwd: "ikz is een label en is
   * optioneel, wordt niet gebruikt bij verzuim". Wel nodig voor Auto.
   */
  ikzSticker?: boolean;
  className?: string;
};

function IkzSticker() {
  return (
    <span className="relative inline-flex h-[28px] w-[130px] shrink-0 items-center">
      <img src="/header/ikz-bg-white.svg" alt="" className="absolute left-1/2 top-1/2 h-[26.7px] w-[127.6px] -translate-x-1/2 -translate-y-1/2" />
      <img src="/header/ikz-bg-blue.svg" alt="" className="absolute left-1/2 top-1/2 h-[28px] w-[129px] -translate-x-1/2 -translate-y-1/2" />
      <img src="/header/ikz-check.svg" alt="" className="absolute left-[calc(50%-41px)] top-1/2 h-[13px] w-[13.7px] -translate-x-1/2 -translate-y-1/2" />
      <img src="/header/ikz-wordmark.svg" alt="ik kies zelf" className="absolute left-[calc(50%+18.4px)] top-1/2 h-[12.1px] w-[71.4px] -translate-x-1/2 -translate-y-1/2" />
    </span>
  );
}

export function Header({ title, chatButton = true, phoneNumber, cancelButton = false, onCancel, ikzSticker = false, className }: HeaderProps) {
  const showContactButton = cancelButton || Boolean(phoneNumber) || chatButton;
  return (
    <header className={className ?? "flex w-full justify-center bg-white"}>
      {/*
        Zelfde `max-w-[1440px]`-behandeling als FunnelPageTemplate's
        content (geverifieerd tegen node 11256:32902): de witte achtergrond
        blijft full-bleed, maar de logo/titel/chat-rij zelf rekt niet
        verder uit dan 1440px op bredere schermen.
      */}
      <div
        className={[
          "flex w-full max-w-[1440px] flex-col items-start justify-center px-6 pb-4",
          "min-[600px]:px-12",
          "min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-center min-[900px]:gap-10 min-[900px]:px-16 min-[900px]:pb-0",
          "min-[1200px]:px-32",
        ].join(" ")}
      >
        {/* Logo + Chat-knop staan in kolom-modus (<900px) samen op één rij.
            Vanaf 900px wordt deze wrapper "contents": hij verdwijnt uit de
            layout en Logo/Chat worden directe flex-children van de header,
            zodat Title (via order) ertussen kan komen. Zo blijft er één
            semantische DOM-structuur voor beide layouts — geen dubbele content. */}
        <div className="flex w-full items-center justify-between min-[900px]:contents">
          {/* Logo */}
          <div className="order-1 flex shrink-0 flex-col items-start pb-4">
            <div className="relative h-[57.75px] w-[120px] overflow-hidden bg-white shadow-[0_3px_12px_0_rgba(0,0,0,0.12)] min-[1200px]:h-[77px] min-[1200px]:w-[160px] min-[1200px]:shadow-[0_4px_16px_0_rgba(0,0,0,0.12)]">
              <picture>
                <source media="(min-width: 1200px)" srcSet="/header/logo-underline-lg.svg" />
                <img
                  src="/header/logo-underline-sm.svg"
                  alt=""
                  className="absolute inset-x-0 bottom-0 block h-[3.916px] w-full min-[1200px]:h-[5.222px]"
                />
              </picture>
              <picture>
                <source media="(min-width: 1200px)" srcSet="/header/logo-asr-lg.svg" />
                <img
                  src="/header/logo-asr-sm.svg"
                  alt="a.s.r."
                  className="-translate-x-1/2 absolute left-1/2 top-[19.94px] h-[14.074px] w-[79.529px] min-[1200px]:top-[26.59px] min-[1200px]:h-[18.766px] min-[1200px]:w-[106.039px]"
                />
              </picture>
            </div>
          </div>

          {/* Chat-knop / telefoonnummer-knop */}
          {showContactButton && (
            <div className="order-3 flex shrink-0 items-center justify-end min-[900px]:w-[120px] min-[1200px]:w-[160px]">
              <button
                type="button"
                onClick={cancelButton ? onCancel : undefined}
                className="flex items-center justify-center gap-2 rounded-[4px] border border-transparent px-3 py-2 font-[550] text-base text-black leading-[1.5] underline decoration-solid whitespace-nowrap [text-decoration-skip-ink:none] hover:border-[rgba(0,0,0,0.08)] hover:bg-[rgba(0,0,0,0.08)] hover:no-underline min-[1200px]:px-4 min-[1200px]:py-3 min-[1200px]:text-lg"
                style={{ fontFamily: "var(--font-avenir-medium)" }}
              >
                <Icon name={cancelButton ? "close" : phoneNumber ? "phone" : "chat"} size="md" />
                {cancelButton ? "Annuleren" : (phoneNumber ?? "Chat")}
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="order-2 flex w-full items-center justify-center gap-2 min-[900px]:w-auto min-[900px]:min-w-0 min-[900px]:flex-1">
          <p
            className="text-center font-bold text-base text-black leading-[1.5] whitespace-nowrap min-[1200px]:text-lg"
            style={{ fontFamily: "var(--font-avenir-bold)" }}
          >
            {title}
          </p>
          {ikzSticker && <IkzSticker />}
        </div>
      </div>
    </header>
  );
}
