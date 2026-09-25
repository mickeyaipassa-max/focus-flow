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

function ChatMessage({ message, showAvatar }: { message: ChatMessageData; showAvatar: boolean }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end pl-6">
        <div className="max-w-[80%] rounded-md bg-[#eef4e3] px-4 py-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.12)" }}>
          <p className="break-words text-right text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pr-6">
      {showAvatar && <AssistantAvatar />}
      <div className="rounded-md bg-white px-4 py-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.12)" }}>
        <p className="break-words text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
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
        <div className="flex w-full items-start rounded-md bg-white p-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.12)" }}>
          <p className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
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

  // Breedte/rechtermarge: 400px/60px tussen 900-1199px, 480px/64px tussen 1200-1439px, 528px/120px vanaf 1440px — bevestigd via Figma's aparte 900px- en 1200px-breakpointframes.
  // Verticaal gecentreerd (top-1/2 + translateY(-50%)) met een marge boven/onder die evenredig meeschaalt: 24px tussen 900-1199px, 40px tussen 1200-1439px, 80px vanaf 1440px — de max-h-calc()'s trekken die marge 2x af zodat er op korte vensters evenveel ruimte overblijft boven als onder.
  return (
    <div
      role="dialog"
      aria-label="AI-assistent van a.s.r."
      aria-modal="false"
      className="fixed top-1/2 right-16 z-50 flex max-h-[calc(100dvh-80px)] w-[480px] flex-col overflow-hidden rounded-md bg-[#fff8e3] min-[900px]:right-[60px] min-[900px]:max-h-[calc(100dvh-48px)] min-[900px]:w-[400px] min-[1200px]:right-16 min-[1200px]:max-h-[calc(100dvh-80px)] min-[1200px]:w-[480px] min-[1440px]:right-[120px] min-[1440px]:max-h-[calc(100dvh-160px)] min-[1440px]:w-[528px]"
      style={{
        height: 653,
        boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
        opacity: isLeaving ? 0 : 1,
        transform: `translateY(${isLeaving ? "calc(-50% + 16px)" : "-50%"})`,
        transition: "opacity 200ms ease-out, transform 200ms ease-out",
      }}
    >
      {/* Header */}
      <div className="flex shrink-0 items-start bg-[#eda50f] p-6">
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

        <div className="relative shrink-0" ref={menuRef}>
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Menu opties"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex size-[51px] items-center justify-center rounded-[3px] bg-[#fff8e3] hover:brightness-95"
          >
            <img src="/icons/more-vertical.svg" alt="" className="size-6" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label="Chat opties"
              className="absolute top-[calc(100%+4px)] right-0 z-10 flex min-w-[220px] flex-col overflow-hidden rounded-md bg-white"
              style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}
            >
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  menuBtnRef.current?.focus();
                  setSelectedTag(null);
                  onNewChat();
                }}
                className="w-full px-4 py-3 text-left hover:bg-[#f6f6f7]"
              >
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
                className="w-full px-4 py-3 text-left hover:bg-[#f6f6f7]"
              >
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
                className="w-full px-4 py-3 text-left hover:bg-[#f6f6f7]"
              >
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
  );
}
