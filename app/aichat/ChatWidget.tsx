"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";

export type ChatMessageData = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const TOPIC_LABELS = ["Vergoedingen", "Eigen risico", "Collectieve zorg", "Contact met a.s.r.", "Zorg voor kinderen", "Voorwaarden"];

function AssistantAvatar() {
  return (
    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#eda50f] p-3">
      <img src="/icons/pictogram-chat-assistent.svg" alt="" className="size-8" />
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 pr-6">
      <AssistantAvatar />
      <div
        role="status"
        aria-label="Assistent is aan het typen"
        className="flex items-center gap-1.5 rounded-md bg-white px-4 py-4"
        style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.12)" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="size-2 rounded-full bg-[#565656]"
            style={{ animation: `aichat-typing-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * WCAG 1.3.1: wie iets gezegd heeft, wordt nu alleen visueel bepaald
 * (uitlijning rechts/links, kleur, wel/geen avatar) — een screenreader
 * krijgt anders alleen de kale berichttekst zonder afzender te horen. De
 * `sr-only`-prefix (al elders in dit project gebruikt, bv.
 * RadioCardBottom.tsx) maakt dat verschil programmatisch beschikbaar
 * zonder de zichtbare weergave te raken.
 */
function ChatMessage({ message, showAvatar }: { message: ChatMessageData; showAvatar: boolean }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end pl-6">
        <div className="max-w-[80%] rounded-md bg-[#eef4e3] px-4 py-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.12)" }}>
          <p className="break-words text-right text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            <span className="sr-only">Jij zei: </span>
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2 pr-6">
      {showAvatar && <AssistantAvatar />}
      <div className="max-w-[80%] rounded-md bg-white px-4 py-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.12)" }}>
        <p className="break-words text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
          <span className="sr-only">AI-assistent zei: </span>
          {message.text}
        </p>
      </div>
    </div>
  );
}

function ChatWelcome({
  onTagClick,
  selectedTag,
  showTags,
}: {
  onTagClick: (tag: string) => void;
  selectedTag: string | null;
  showTags: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col items-start gap-2 pr-6">
        <AssistantAvatar />
        <div className="max-w-[80%] rounded-md bg-white p-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.12)" }}>
          <p className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            <span className="sr-only">AI-assistent zei: </span>
            Hallo, ik ben de AI-assistent van a.s.r. Ik kan je snel helpen. En anders stuur ik je door naar de juiste persoon. Waar gaat je
            vraag over?
          </p>
        </div>
      </div>
      {showTags && (
        <div className="flex max-w-[480px] flex-wrap gap-2" style={{ filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.12))" }}>
          {TOPIC_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              aria-pressed={selectedTag === label}
              onClick={() => onTagClick(label)}
              className={[
                "flex h-8 items-center justify-center gap-1 rounded-full py-1 pr-3 pl-2",
                selectedTag === label ? "bg-[#eef4e3]" : "bg-white hover:bg-[#fafafa]",
              ].join(" ")}
            >
              <img src="/icons/comment.svg" alt="" className="size-4" />
              <span className="whitespace-nowrap text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="shrink-0 bg-white p-6" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.12)" }}>
      <div className="flex w-full items-center gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Typ je vraag of bericht"
          placeholder="Typ je vraag of bericht..."
          rows={1}
          className="h-[51px] flex-1 resize-none rounded-[3px] border border-[#565656] bg-white px-4 py-[13px] text-black text-base leading-[1.5] outline-none placeholder:text-[#565656] hover:border-2 hover:border-black focus:border-2 focus:border-black"
          style={{ fontFamily: "var(--font-avenir-book)" }}
        />
        <button
          type="button"
          onClick={submit}
          aria-label="Verstuur bericht"
          className="flex size-[51px] shrink-0 items-center justify-center rounded-[3px] bg-black hover:opacity-90"
        >
          <img src="/icons/send.svg" alt="" className="size-6" />
        </button>
      </div>
    </div>
  );
}

type ChatWidgetProps = {
  isOpen: boolean;
  messages: ChatMessageData[];
  isTyping: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onNewChat: () => void;
  onSend: (text: string) => void;
  returnFocusOnMinimize?: RefObject<HTMLButtonElement | null>;
  returnFocusOnClose?: RefObject<HTMLButtonElement | null>;
};

/**
 * Het zwevende chatvenster zelf — bevestigd via de bijgeleverde spec
 * ("chat-widget-spec.md"): `position: fixed; bottom: 80px; right: 120px`,
 * 528×653px maar nooit hoger dan `calc(100dvh - 160px)` (alleen het
 * berichtengebied krimpt, header en invoerbalk blijven altijd zichtbaar).
 * Open/dicht: fade + 16px slide-omhoog, 200ms, met `prefers-reduced-motion`-
 * fallback (alleen fade).
 *
 * `aria-modal="false"` is bewust letterlijk uit de spec-tekst overgenomen
 * ("de pagina blijft bruikbaar") — de meegeleverde React-referentie-
 * implementatie zelf gebruikt op dat punt nog `aria-modal="true"`, een
 * inconsistentie tussen de twee bijgeleverde bronnen die hier niet
 * stilzwijgend is opgelost: de geschreven spec-tekst is leidend.
 */
export function ChatWidget({
  isOpen,
  messages,
  isTyping,
  onClose,
  onMinimize,
  onNewChat,
  onSend,
  returnFocusOnMinimize,
  returnFocusOnClose,
}: ChatWidgetProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const hasMessages = messages.length > 0 || isTyping;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setIsLeaving(false);
    } else if (visible) {
      setIsLeaving(true);
      const timeout = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, visible]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (menuOpen) {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      } else {
        setTimeout(() => returnFocusOnMinimize?.current?.focus(), 50);
        onMinimize();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, onMinimize, returnFocusOnMinimize]);

  function handleTagClick(label: string) {
    setSelectedTag(label);
    onSend(`Ik heb een vraag over ${label.toLowerCase()}`);
  }

  if (!visible) return null;

  // Onder 600px voelt de widget als een echte popup: inset-6 (24px marge rondom) i.p.v. een vaste breedte/hoogte, met een donkere overlay erachter die de chat sluit bij een klik — bevestigd via Figma's mobiele "chat open"-frame plus expliciete aanvulling van de opdrachtgever (24px marge + scrim, i.p.v. Figma's eigen 11px/10px-marges zonder overlay).
  // Vanaf 600px de bestaande, per breakpoint variërende positionering: breedte/rechtermarge 400px/60px tussen 900-1199px, 480px/64px tussen 1200-1439px, 528px/120px vanaf 1440px; verticaal gecentreerd (top-1/2 + translateY(-50%)) met een marge boven/onder van 24px tussen 900-1199px, 40px tussen 1200-1439px, 80px vanaf 1440px.
  // `--y-base` is 0 op mobiel (inset-6 bepaalt de positie al volledig) en -50% vanaf 600px (voor de top-1/2-centrering) — zo hoeft de leave-animatie in de inline style niet los per breakpoint te vertakken.
  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => {
          setTimeout(() => returnFocusOnClose?.current?.focus(), 50);
          onClose();
        }}
        className="fixed inset-0 z-40 bg-black/50 min-[600px]:hidden"
        style={{ opacity: isLeaving ? 0 : 1, transition: "opacity 200ms ease-out" }}
      />
      <div
        role="dialog"
        aria-label="AI-assistent van a.s.r."
        aria-modal="false"
        className="fixed inset-6 z-50 flex flex-col overflow-hidden rounded-md bg-[#fff8e3] [--y-base:0] min-[600px]:inset-auto min-[600px]:top-1/2 min-[600px]:right-16 min-[600px]:h-[653px] min-[600px]:w-[480px] min-[600px]:max-h-[calc(100dvh-80px)] min-[600px]:[--y-base:-50%] min-[900px]:right-[60px] min-[900px]:max-h-[calc(100dvh-48px)] min-[900px]:w-[400px] min-[1200px]:right-16 min-[1200px]:max-h-[calc(100dvh-80px)] min-[1200px]:w-[480px] min-[1440px]:right-[120px] min-[1440px]:max-h-[calc(100dvh-160px)] min-[1440px]:w-[528px]"
        style={{
          boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
          opacity: isLeaving ? 0 : 1,
          transform: `translateY(calc(var(--y-base) + ${isLeaving ? "16px" : "0px"}))`,
          transition: "opacity 200ms ease-out, transform 200ms ease-out",
        }}
      >
        {/* Header — relative + menuRef hier i.p.v. op de kleine knop-wrapper: het menu moet 24px minder breed zijn dan de widget aan beide kanten (op verzoek van de opdrachtgever). `left-0 right-0` bleek verkeerd — dat sluit aan op de PADDING-box van deze relative ouder, wat gelijk is aan de widget's eigen buitenrand (0px inset, want de header heeft zelf geen marge, alleen interne p-6). `left-6 right-6` (24px) is daarom nodig om echt 24px van de widget-rand af te blijven. */}
        <div className="relative flex shrink-0 items-start bg-[#eda50f] p-6" ref={menuRef}>
          <div className="min-w-0 flex-1">
            <h2 className="pb-2 text-black text-[24px] leading-[1.3]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
              AI-assistent van a.s.r.
            </h2>
            <div className="flex items-center gap-[11px]">
              <span className="size-[11px] shrink-0 rounded-full border border-white bg-[#0f865d]" />
              <span className="text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                Altijd online
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menu opties"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex size-[51px] items-center justify-center rounded-[3px] bg-[#fff8e3] hover:brightness-95"
            >
              {/* Drie puntjes → kruisje (hergebruik van add.svg, 45° geroteerd — zelfde "sluiten"-icoon als het "Gesprek afsluiten"-menu-item) bij openen, met een zachte fade+rotate-transitie (motion-safe, 200ms — zelfde duur als elders in dit project, bv. de tile-hover-scale). */}
              <span className="relative flex size-6 items-center justify-center">
                <img
                  src="/icons/more-vertical.svg"
                  alt=""
                  className={`absolute size-6 motion-safe:transition-all motion-safe:duration-200 ${menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
                />
                <img
                  src="/icons/add.svg"
                  alt=""
                  className={`absolute size-6 motion-safe:transition-all motion-safe:duration-200 ${menuOpen ? "rotate-45 opacity-100" : "rotate-0 opacity-0"}`}
                />
              </span>
            </button>

            {menuOpen && (
              <div
                role="menu"
                aria-label="Chat opties"
                // top-[79px] i.p.v. top-[calc(100%+4px)]: dat laatste stond onder de hele header (die door het H2-blok hoger is dan de 51px-knop), waardoor het menu ~37px onder de knop "zweefde" i.p.v. er duidelijk bij te horen. 79px = de knop's eigen onderrand (24px header-padding + 51px knophoogte = 75px vanaf de bovenkant van de header) + 4px marge — op verzoek van de opdrachtgever.
                className="absolute top-[79px] left-6 right-6 z-10 flex flex-col overflow-hidden rounded-md bg-white"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}
              >
                {/* Icoon-cirkel (40px, bg-[#f6f6f7]) per item bevestigd via Figma node 63:13371: refresh / chevron-down / een 45°-geroteerd "add"-icoon (optisch een X). */}
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    menuBtnRef.current?.focus();
                    setSelectedTag(null);
                    onNewChat();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f6f6f7]"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f6f6f7]">
                    <img src="/icons/refresh.svg" alt="" className="size-4" />
                  </span>
                  <span className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                    Nieuw gesprek starten
                  </span>
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => returnFocusOnMinimize?.current?.focus(), 50);
                    onMinimize();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f6f6f7]"
                >
                  {/* chevron-down-sm.svg i.p.v. het gedeelde chevron-down.svg: dat laatste is van zichzelf niet-vierkant (16,06×9,09px, elders altijd via `Icon` getoond op eigen grootte) — in een geforceerde 16×16px <img> hier werd de pijl daardoor verticaal uitgerekt. Dit is Figma's eigen vierkante 16×16px-asset voor deze specifieke plek. */}
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f6f6f7]">
                    <img src="/icons/chevron-down-sm.svg" alt="" className="size-4" />
                  </span>
                  <span className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                    Gesprek minimaliseren
                  </span>
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => returnFocusOnClose?.current?.focus(), 50);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f6f6f7]"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f6f6f7]">
                    <img src="/icons/add.svg" alt="" className="size-4 rotate-45" />
                  </span>
                  <span className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                    Gesprek afsluiten
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Berichtengebied */}
        <div aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
          <ChatWelcome onTagClick={handleTagClick} selectedTag={selectedTag} showTags={!hasMessages} />
          {messages.map((message, index) => {
            const previous = messages[index - 1];
            const showAvatar = message.role === "assistant" && (index === 0 || previous?.role !== "assistant");
            return <ChatMessage key={message.id} message={message} showAvatar={showAvatar} />;
          })}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={onSend} />
      </div>
    </>
  );
}
