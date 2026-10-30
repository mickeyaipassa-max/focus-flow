"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatSource } from "@/lib/chatPdf";
import { KEUZEHULP_OPENING, KEUZEHULP_TAGS, keuzehulpTag } from "@/lib/chat/keuzehulp";
import { ChatWidget, type ChatMessageData } from "../../aichat/ChatWidget";

/**
 * De keuzehulp-chat als pagina voor in een iframe, voor de VWO-test op de productiepagina van a.s.r. (vwo/). Dezelfde chat als op /workshop:
 * zelfde ChatWidget (opt-in `embedded`), dezelfde vier tags met vaste antwoorden zonder taalmodel en dezelfde aanroep van /api/chat
 * (kennisbank, geen sleutels in de browser). De aanroep gaat vanuit het iframe naar het eigen domein, dus de CSP van de pagina erbuiten
 * (`connect-src`) speelt geen rol.
 *
 * Gesprek met de pagina eromheen (window.postMessage):
 * - pagina -> chat  { bron: "asr-keuzehulp", type: "context", dekking?: "wa" | "wa-casco-beperkt" | "wa-casco-allrisk", kaart?: string }
 *                   { bron: "asr-keuzehulp", type: "focus" }
 * - chat -> pagina  { bron: "asr-keuzehulp-chat", type: "ready" | "message" (via: "tag" | "getypt", volgnummer) | "minimize" | "close" }
 * Alleen berichten van de toegestane origins worden gelezen en alleen naar die origin wordt gestuurd.
 *
 * De logica voor de tags en het antwoord staat ook in app/workshop/page.tsx; die pagina is bewust niet aangepast.
 */
const TOEGESTANE_OUDERS = ["https://www.asr.nl", "https://asr.nl"];
type Dekking = "wa" | "wa-casco-beperkt" | "wa-casco-allrisk";
const DEKKINGEN: Dekking[] = ["wa", "wa-casco-beperkt", "wa-casco-allrisk"];
const HULP_FALLBACK = "Ik kan je vraag op dit moment niet goed beantwoorden. Probeer het straks nog een keer, of neem contact op met de klantenservice van a.s.r.";

let nextMessageId = 1;

async function vraagTaalmodel(berichten: { role: "user" | "assistant"; text: string }[], dekking: Dekking | undefined): Promise<Pick<ChatMessageData, "text" | "sources"> | null> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ berichten, dekking, keuzehulp: true }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) return null;
    const { tekst, bronnen } = (await response.json()) as { tekst?: string; bronnen?: ChatSource[] };
    return tekst ? { text: tekst, sources: bronnen && bronnen.length > 0 ? bronnen : undefined } : null;
  } catch {
    return null;
  }
}

export default function KeuzehulpEmbed() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [typing, setTyping] = useState(false);
  const [dekking, setDekking] = useState<Dekking | undefined>(undefined);
  const ouder = useRef<string | null>(null);
  const berichtTeller = useRef(0);
  const vasteReactie = useRef<{ timer: ReturnType<typeof setTimeout>; tekst: string } | null>(null);

  function naarOuder(bericht: Record<string, unknown>) {
    if (!ouder.current || window.parent === window) return;
    window.parent.postMessage({ bron: "asr-keuzehulp-chat", ...bericht }, ouder.current);
  }

  useEffect(() => {
    const dekkingUitUrl = new URLSearchParams(window.location.search).get("dekking") as Dekking | null;
    if (dekkingUitUrl && DEKKINGEN.includes(dekkingUitUrl)) setDekking(dekkingUitUrl);
    // In ontwikkeling mag ook de eigen origin (testpagina op dezelfde host) als ouder dienen.
    const toegestaan = process.env.NODE_ENV === "production" ? TOEGESTANE_OUDERS : [...TOEGESTANE_OUDERS, window.location.origin];

    function opBericht(event: MessageEvent) {
      if (!toegestaan.includes(event.origin) || event.source !== window.parent) return;
      const data = event.data as { bron?: string; type?: string; dekking?: string } | null;
      if (!data || data.bron !== "asr-keuzehulp") return;
      if (ouder.current !== event.origin) {
        ouder.current = event.origin;
        naarOuder({ type: "ready" });
      }
      if (data.type === "context") setDekking(DEKKINGEN.includes(data.dekking as Dekking) ? (data.dekking as Dekking) : undefined);
      if (data.type === "focus") document.querySelector<HTMLTextAreaElement>("[role=dialog] textarea")?.focus();
    }
    window.addEventListener("message", opBericht);
    return () => {
      window.removeEventListener("message", opBericht);
      if (vasteReactie.current) clearTimeout(vasteReactie.current.timer);
    };
  }, []);

  /** Elk klantbericht wordt gemeld; de pagina eromheen bepaalt wat het eerste bericht of de eerste getypte vraag is. */
  function meldBericht(via: "tag" | "getypt") {
    berichtTeller.current += 1;
    naarOuder({ type: "message", via, volgnummer: berichtTeller.current });
  }

  function plaatsVasteReactie(tekst: string) {
    vasteReactie.current = null;
    setTyping(false);
    setMessages((vorige) => [...vorige, { id: nextMessageId++, role: "assistant", text: tekst }]);
  }

  /** Klik op een van de vier tags: het antwoord komt als klantbericht in het gesprek, de chat antwoordt vast, zonder taalmodel. */
  function handleTag(label: string) {
    const tag = keuzehulpTag(label);
    if (!tag) return;
    meldBericht("tag");
    setMessages((vorige) => [...vorige, { id: nextMessageId++, role: "user", text: tag.label }]);
    setTyping(true);
    vasteReactie.current = { timer: setTimeout(() => plaatsVasteReactie(tag.antwoord), 600), tekst: tag.antwoord };
  }

  async function handleSend(text: string) {
    const wachtend = vasteReactie.current;
    if (wachtend) {
      clearTimeout(wachtend.timer);
      plaatsVasteReactie(wachtend.tekst);
    }
    meldBericht("getypt");
    const eerder = [...messages.map(({ role, text: bericht }) => ({ role, text: bericht })), ...(wachtend ? [{ role: "assistant" as const, text: wachtend.tekst }] : [])];
    setMessages((vorige) => [...vorige, { id: nextMessageId++, role: "user", text }]);
    setTyping(true);
    const antwoord = await vraagTaalmodel([...eerder, { role: "user" as const, text }], dekking);
    setTyping(false);
    setMessages((vorige) => [...vorige, { id: nextMessageId++, role: "assistant", ...(antwoord ?? { text: HULP_FALLBACK }) }]);
  }

  function nieuwGesprek() {
    if (vasteReactie.current) clearTimeout(vasteReactie.current.timer);
    vasteReactie.current = null;
    berichtTeller.current = 0;
    setMessages([]);
    setTyping(false);
  }

  return (
    <ChatWidget
      embedded
      isOpen
      messages={messages}
      isTyping={typing}
      onClose={() => {
        nieuwGesprek();
        naarOuder({ type: "close" });
      }}
      onMinimize={() => naarOuder({ type: "minimize" })}
      onNewChat={nieuwGesprek}
      onSend={handleSend}
      welcomeText={KEUZEHULP_OPENING}
      topics={KEUZEHULP_TAGS.map((tag) => tag.label)}
      topicStyle="bubble"
      onTopicSelect={handleTag}
      windowStyle="cream"
    />
  );
}
