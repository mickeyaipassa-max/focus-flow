"use client";

import { useCallback, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { CardContact } from "@/components/CardContact";
import { Footer, type FooterColumn } from "@/components/Footer";
import { AIChatBlock } from "./AIChatBlock";
import { ChatWidget, type ChatMessageData } from "./ChatWidget";
import { MinimizedChatButton } from "./MinimizedChatButton";

const TILE_ITEMS = [
  { icon: "upload", label: "Declaratie indienen" },
  { icon: "search", label: "Vergoedingen zoeken" },
  { icon: "injury", label: "Zorgverlener zoeken" },
  { icon: "user", label: "Inloggen" },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Wat doe ik als mijn declaratie niet of niet helemaal is vergoed?",
    answer:
      "Als je declaratie niet of niet volledig is vergoed, kun je contact opnemen met onze klantenservice. Wij helpen je graag om dit te onderzoeken en op te lossen.",
  },
  {
    question: "Hoe gebruik ik de Zorg app van a.s.r.?",
    answer:
      "De Zorg app van a.s.r. kun je downloaden via de App Store of Google Play. Na het inloggen heb je direct toegang tot je polisgegevens, declaraties en meer.",
  },
  {
    question: "Kan ik mijn zorgverzekering annuleren of (tussentijds) opzeggen?",
    answer: "Je zorgverzekering kun je in principe alleen aan het einde van het kalenderjaar opzeggen. Tussentijds opzeggen is alleen mogelijk in uitzonderlijke situaties.",
  },
  {
    question: "Hoe neem ik contact op voor een zakelijke zorgverzekering?",
    answer: "Voor zakelijke zorgverzekeringen kun je contact opnemen met onze zakelijke afdeling via telefoon of e-mail. Onze specialisten helpen je graag verder.",
  },
];

/**
 * Lichtgewicht keyword-matching i.p.v. één generiek antwoord op elke vraag —
 * op verzoek van de opdrachtgever, zodat de mock inhoudelijk blijft kloppen:
 * elk onderwerp krijgt een eigen, plausibel antwoord zodra de getypte vraag
 * een van de bijbehorende trefwoorden bevat. Geen match = eerlijke fallback
 * i.p.v. een belofte ("ik zoek het uit") die deze mock toch niet waarmaakt.
 */
const TOPIC_ANSWERS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["vergoeding", "vergoed", "declaratie", "declareren"],
    answer:
      "Welke vergoedingen je krijgt hangt af van je polis. De meeste behandelingen kun je declareren via de Zorg app of Mijn a.s.r. — je ziet daar per behandeling of en hoeveel je vergoed krijgt.",
  },
  {
    keywords: ["eigen risico", "risico"],
    answer:
      "Het verplicht eigen risico is in 2026 vastgesteld op €385 per jaar. Huisartsenzorg, verloskundige zorg en zorg voor kinderen tot 18 jaar vallen daar niet onder.",
  },
  {
    keywords: ["collectie", "werkgever", "korting"],
    answer:
      "Heeft jouw werkgever een collectieve zorgverzekering afgesloten bij a.s.r.? Dan krijg je vaak korting op je premie. Check bij je werkgever of HR-afdeling of er een collectiviteitscode voor jou geldt.",
  },
  {
    keywords: ["contact", "bellen", "telefoon", "spreken"],
    answer:
      "Je kunt ons bereiken via (0800) 00 00 000 (gratis, op werkdagen) of via het contactformulier op onze website. Voor dringende zaken raden we bellen aan.",
  },
  {
    keywords: ["kind", "kinderen", "baby"],
    answer: "Kinderen tot 18 jaar zijn gratis meeverzekerd op de polis van een ouder, zonder eigen risico. Je hoeft ze alleen apart aan te melden bij a.s.r.",
  },
  {
    keywords: ["voorwaarde", "polis"],
    answer: "De volledige polisvoorwaarden kun je downloaden via Mijn a.s.r. of opvragen via de klantenservice. Daarin staat precies wat wel en niet gedekt is.",
  },
];

const FALLBACK_ANSWER = "Daar heb ik nu helaas geen pasklaar antwoord op. Neem voor de zekerheid contact op met onze klantenservice via (0800) 00 00 000.";

function matchTopicAnswer(userText: string): string | null {
  const lower = userText.toLowerCase();
  const match = TOPIC_ANSWERS.find(({ keywords }) => keywords.some((keyword) => lower.includes(keyword)));
  return match?.answer ?? null;
}

const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "Klantenservice", links: ["Inloggen", "Schade melden", "Gegevens wijzigen", "Financieel advies", "Onze apps", "Contact"] },
  { title: "Onze impact", links: ["Duurzaamheid", "Maatschappij", "Toegankelijkheid", "a.s.r. Vitality", "Doenkracht", "De raad van doen"] },
  { title: "a.s.r.", links: ["Over a.s.r.", "Blogs", "Nieuws en financiële publicaties", "Werken bij a.s.r.", "Fondsen en koersen"] },
];

let nextMessageId = 1;

/**
 * Service hub-pagina "Zorgverzekering klantenservice" + AI-chatwidget —
 * bevestigd via de door de opdrachtgever aangeleverde Figma Make-broncode en
 * twee specs ("service-hub-page.md", "chat-widget-spec.md"), en gespiegeld
 * aan het Figma-bestand "AI chat" (node 27:6491 e.o., via MCP geraadpleegd).
 * De gedeelde chat-state (berichten, open/dicht, aan het typen) leeft hier
 * op paginaniveau — zowel de inline "Heb je een vraag?"-sectie als het
 * zwevende chatvenster lezen/schrijven dezelfde state, exact zoals de
 * "Technisch"-sectie van de spec voorschrijft.
 */
export default function AiChatPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const chatActive = isOpen || messages.length > 0;
  const minimizedButtonRef = useRef<HTMLButtonElement>(null);
  const sectionButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * `topic` wordt expliciet doorgegeven i.p.v. uit de `activeTopic`-state
   * gelezen: `handleStartFromTag` zet die state en roept dit in dezelfde
   * synchrone afhandeling aan, vóórdat React de state-update verwerkt heeft
   * — lezen uit `activeTopic` zou dan nog de oude (vorige) waarde geven.
   */
  const addAssistantReply = useCallback((isFollowUpToTag: boolean, topic: string | null, userText: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const text = isFollowUpToTag && topic ? `Wat zou je willen weten over ${topic.toLowerCase()}?` : (matchTopicAnswer(userText) ?? FALLBACK_ANSWER);
      setMessages((prev) => [...prev, { id: nextMessageId++, role: "assistant", text }]);
    }, 800);
  }, []);

  function openChat(firstMessage: string, fromTag: boolean, topic: string | null) {
    setMessages([{ id: nextMessageId++, role: "user", text: firstMessage }]);
    setIsOpen(true);
    addAssistantReply(fromTag, topic, firstMessage);
  }

  function handleStartFromTag(tag: string) {
    setActiveTopic(tag);
    openChat(`Ik heb een vraag over ${tag.toLowerCase()}`, true, tag);
  }

  function handleStartFromInput(text: string) {
    setActiveTopic(null);
    openChat(text, false, null);
  }

  function handleSendMessage(text: string) {
    setMessages((prev) => [...prev, { id: nextMessageId++, role: "user", text }]);
    addAssistantReply(false, activeTopic, text);
  }

  function handleReset() {
    setMessages([]);
    setIsTyping(false);
    setIsOpen(true);
    setActiveTopic(null);
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-white">
      <SiteHeader />

      <Breadcrumb
        items={[{ label: "Home" }, { label: "Breadcrumb item" }, { label: "Breadcrumb item" }, { label: "Breadcrumb item" }, { label: "Current page" }]}
      />

      <main className="flex w-full flex-col items-start gap-6 pb-0 min-[600px]:gap-12">
        {/* Zijmarge-schaal (24/48/64/128px) op alle secties hieronder — bevestigd via Figma's mobiele frame (56:9265, elke sectie op x=24 in een 375px-frame) en het 900px-frame (54:5255, Content op x=64 in een 900px-frame); vanaf 1200px ongewijzigd px-32, zoals ook al in Footer.tsx's niet-centered modus gebruikt wordt. */}
        {/* pt-6 (24px) onder 600px tussen breadcrumb en H1 — op expliciet verzoek van de opdrachtgever bijgesteld vanaf de eerder bevestigde 0px uit Figma's mobiele frame (56:9265, waar Breadcrumb en Hero elkaar zonder marge raken). */}
        <section className="w-full px-6 pt-6 min-[600px]:px-12 min-[600px]:pt-10 min-[900px]:px-16 min-[1200px]:px-32">
          {/* H1 32px→40px, paragraaf 16px→20px, gap 4px→8px vanaf 600px — bevestigd via Figma's mobiele frame (node 56:9269), niet eerder meegenomen in de mobiele pas. */}
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 min-[600px]:gap-2">
            <h1 className="text-black text-[32px] leading-[1.2] min-[600px]:text-[40px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
              Zorgverzekering klantenservice
            </h1>
            <p className="max-w-[880px] text-black text-base leading-[1.4] min-[600px]:text-xl" style={{ fontFamily: "var(--font-avenir-book)" }}>
              Heb je een vraag over je vergoedingen, declaraties of eigen risico? Wil je snel zelf iets regelen of wijzigen? Wij zijn er voor je.
            </p>
          </div>
        </section>

        <section className="w-full px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto w-full max-w-[1200px]">
            {/* Onder 600px stapelt de rij van 4 tot volle-breedte kaarten (64px hoog, 1px gap), tekst 14px i.p.v. 16px — bevestigd via Figma's mobiele frame (56:9271). Icoon/cirkel blijven 40px/16px, zelfde als de 900-1439px-tiers. */}
            <div
              className="grid w-full grid-cols-1 overflow-hidden rounded-md min-[600px]:grid-cols-4"
              style={{ background: "rgba(0,0,0,0.16)", gap: 1, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
            >
              {/* Cirkel groeit naar scale(1.2) bij hover, 200ms cubic-bezier(0,-.4,.4,1.6) ("ease-back-out") — bevestigd via de officiële a.s.r. webcomponent (<asr-tile>, webcomponents.asr.nl/.../tile--inline-compact, shadow-DOM CSS: `.tile:hover .graphic::after { transform: scale(1.2) }`, transitie alleen binnen `@media (prefers-reduced-motion: no-preference)` — hier dus `motion-safe:` i.p.v. de scale zelf conditioneel te maken, exact zoals de bron: de sprong gebeurt altijd, alleen de animatie ernaartoe wordt overgeslagen bij reduced motion. */}
              {TILE_ITEMS.map(({ icon, label }) => (
                <button key={label} type="button" className="group flex items-center gap-3 bg-white px-4 py-3 text-left hover:bg-[#fafafa]">
                  <span className="flex size-10 min-[1440px]:size-14 shrink-0 scale-100 items-center justify-center rounded-full bg-[#fff8e3] p-3 group-hover:scale-[1.2] motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0,-0.4,0.4,1.6)]">
                    <img src={`/icons/${icon}.svg`} alt="" className="size-4 min-[1440px]:size-8" />
                  </span>
                  <span
                    className="text-black text-sm leading-[1.5] min-[600px]:text-base min-[1440px]:text-lg"
                    style={{ fontFamily: "var(--font-avenir-medium)" }}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <AIChatBlock
          chatActive={chatActive}
          onStartFromTag={handleStartFromTag}
          onStartFromInput={handleStartFromInput}
          onReopen={() => setIsOpen(true)}
          onReset={handleReset}
          primaryBtnRef={sectionButtonRef}
        />

        <section className="w-full px-6 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          {/* Gap H2→accordion 16px onder 600px i.p.v. de vaste 24px — op verzoek van de opdrachtgever. */}
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 min-[600px]:gap-6">
            {/* 24px→32px vanaf 600px — bevestigd via Figma's mobiele frame (node 56:9298). */}
            <h2 className="text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
              Veel gestelde vragen
            </h2>
            <FaqAccordion items={FAQ_ITEMS} className="flex w-full max-w-[800px] flex-col gap-1" />
          </div>
        </section>

        {/* py-6 (24px) onder 600px i.p.v. de vaste py-12 (48px) — op verzoek van de opdrachtgever. */}
        <section className="w-full bg-[#f6f6f7] px-6 py-6 min-[600px]:px-12 min-[600px]:py-12 min-[900px]:px-16 min-[1200px]:px-32">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
            {/* 24px→32px vanaf 600px — bevestigd via Figma's mobiele frame (node 56:9303). */}
            <h2 className="text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
              Liever echt contact?
            </h2>
            <div className="grid w-full grid-cols-1 gap-4 min-[600px]:grid-cols-3">
              <CardContact
                title="Telefoon"
                availability="Availability"
                actionIcon="phone"
                actionLabel="(0800) 00 00 000"
                footerText="Description bottom"
                className="flex min-w-px flex-1 flex-col items-start gap-8 self-stretch rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-6"
              />
              {/* Onder 600px staat de grid op grid-cols-1, waardoor deze lege placeholders (kolom 2/3 op desktop) anders twee extra lege rijen worden — elk nog steeds met de grid-gap (16px) ervoor, samen 32px onbedoelde ruimte bovenop de sectie's eigen bottom-padding. Verborgen op mobiel om dat te voorkomen. */}
              <div className="hidden min-[600px]:block" />
              <div className="hidden min-[600px]:block" />
            </div>
          </div>
        </section>
      </main>

      <Footer columns={FOOTER_COLUMNS} showAppBadges centered />

      {!isOpen && chatActive && <MinimizedChatButton onClick={() => setIsOpen(true)} btnRef={minimizedButtonRef} />}

      <ChatWidget
        isOpen={isOpen}
        messages={messages}
        isTyping={isTyping}
        onClose={() => {
          setIsOpen(false);
          setMessages([]);
          setIsTyping(false);
        }}
        onMinimize={() => setIsOpen(false)}
        onNewChat={handleReset}
        onSend={handleSendMessage}
        returnFocusOnMinimize={minimizedButtonRef}
        returnFocusOnClose={sectionButtonRef}
      />
    </div>
  );
}
