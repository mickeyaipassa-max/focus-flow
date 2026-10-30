"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { InputDate } from "@/components/InputDate";
import { RadioCardBottomCarousel, type CarouselCardOption } from "@/components/RadioCardBottomCarousel";
import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
import { RadioGroup } from "@/components/RadioGroup";
import { Tag } from "@/components/Tag";
import { formatDatum } from "@/lib/datum";
import type { ChatSource } from "@/lib/chatPdf";
import type { Product } from "@/lib/kennisbank";
import { zoekKortAntwoord } from "@/lib/kennisbank/zoek";
import { ChatWidget, type ChatMessageData } from "../aichat/ChatWidget";
import { MinimizedChatButton } from "../aichat/MinimizedChatButton";

const AUTO_STEPS = ["Jouw situatie", "Jouw dekking", "Jouw gegevens", "Laatste vragen", "Samenvatting"];

type DekkingKeuze = "wa" | "wa-casco-beperkt" | "wa-casco-allrisk";

/** Basisdekkingen: de vijf kenmerken en prijzen uit Figma ("Auto/JD/WA+", node 9356:6657). */
const DEKKING_OPTIONS: RadioCardBottomOption[] = [
  {
    value: "wa",
    title: "WA",
    price: "68,76",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: false },
      { text: "Ruitschade", included: false },
      { text: "Diefstal", included: false },
      { text: "Schade door aanrijding en andere schades", included: false },
    ],
  },
  {
    value: "wa-casco-beperkt",
    title: "WA + Casco beperkt",
    price: "75,65",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Diefstal", included: true },
      { text: "Schade door aanrijding en andere schades", included: false },
    ],
  },
  {
    value: "wa-casco-allrisk",
    title: "WA + Casco allrisk",
    price: "116,77",
    features: [
      { text: "Schade aan anderen", included: true },
      { text: "Schade door brand, storm en natuur", included: true },
      { text: "Ruitschade", included: true },
      { text: "Diefstal", included: true },
      { text: "Schade door aanrijding en andere schades", included: true },
    ],
  },
];

const CAROUSEL_OPTIONS: CarouselCardOption[] = DEKKING_OPTIONS.map(({ value, title, price, features }) => ({
  value,
  title,
  price: price ?? "",
  features: features ?? [],
}));

const EIGEN_RISICO_OPTIONS: RadioCardBottomOption[] = [
  { value: "0", title: "€ 0" },
  { value: "150", title: "€ 150" },
  { value: "250", title: "€ 250" },
  { value: "500", title: "€ 500" },
];

const AANVULLENDE_DEKKINGEN = [
  {
    value: "schade-inzittenden",
    title: "Schade inzittenden",
    description: "Passagiers en bestuurder verzekerd voor letsel en schade na een ongeval.",
    price: "5,22",
  },
  {
    value: "rechtsbijstand",
    title: "Rechtsbijstand motorijtuigen",
    description: "Juridische hulp bij conflicten in het verkeer met je auto.",
    price: "5,28",
  },
  {
    value: "pechhulp",
    title: "Pechhulp",
    description: "De a.s.r. Alarmcentrale staat voor je klaar als je niet verder kan rijden door pech.",
    price: "6,16",
  },
];

/** Openingstekst en onderwerpen van de chat, letterlijk uit Figma (Autoverzekering, node 9358:1686; "help nodig" staat daar zo). */
const HULP_OPENINGSVRAAG = "Je hebt help nodig bij het kiezen van een juiste dekking, waar kan ik je mee helpen?";
const HULP_ONDERWERPEN = ["Meer over WA", "Meer over WA+", "Meer over All-Risk", "Vervangend vervoer", "Garage keuze bij pech", "Stormschade"];

/** Antwoord op de drie "Meer over …"-onderwerpen, uit de kenmerken van de kaarten op deze pagina; `null` bij elke andere vraag. */
function kaartAntwoord(tekst: string): string | null {
  const dekkingVoorOnderwerp: Record<string, string> = { "Meer over WA": "wa", "Meer over WA+": "wa-casco-beperkt", "Meer over All-Risk": "wa-casco-allrisk" };
  const optie = DEKKING_OPTIONS.find((kaart) => kaart.value === dekkingVoorOnderwerp[tekst]);
  if (!optie?.features) return null;
  const gedekt = optie.features.filter((kenmerk) => kenmerk.included).map((kenmerk) => kenmerk.text.toLowerCase());
  const nietGedekt = optie.features.filter((kenmerk) => !kenmerk.included).map((kenmerk) => kenmerk.text.toLowerCase());
  const lijst = (items: string[]) => items.join(", ").replace(/, ([^,]*)$/, " en $1");
  return nietGedekt.length > 0
    ? `${optie.title} dekt: ${lijst(gedekt)}. Niet gedekt: ${lijst(nietGedekt)}.`
    : `${optie.title} dekt: ${lijst(gedekt)}.`;
}

/** Welke voorwaarden en asr.nl-pagina's bij welke basisdekking horen (de Algemene voorwaarden gelden altijd). */
const VOORWAARDEN_PER_DEKKING: Record<DekkingKeuze, Product[]> = {
  wa: ["site-wa", "wa"],
  "wa-casco-beperkt": ["site-wa", "wa", "site-casco-beperkt", "casco-beperkt"],
  "wa-casco-allrisk": ["site-wa", "wa", "site-casco-allrisk", "casco-allrisk"],
};

/**
 * Het antwoord zonder taalmodel: eerst de kaartkenmerken, dan een kort, gecontroleerd antwoord uit de kennisbank
 * (alleen bij een duidelijke match; nooit een lange voorwaardentekst), anders de eerlijke terugval.
 */
function hulpAntwoord(tekst: string, dekking: DekkingKeuze | ""): Pick<ChatMessageData, "text" | "sources"> {
  const uitKaart = kaartAntwoord(tekst);
  if (uitKaart) return { text: uitKaart };
  const uitKennisbank = zoekKortAntwoord(tekst, { producten: dekking ? VOORWAARDEN_PER_DEKKING[dekking] : undefined });
  if (uitKennisbank) return { text: uitKennisbank.tekst, sources: uitKennisbank.bronnen };
  return { text: HULP_FALLBACK };
}

/**
 * Vraagt het taalmodel (app/api/chat) om een antwoord op het gesprek. `null` als dat niet lukt (er staat geen sleutel
 * ingesteld, het duurt te lang, een fout of een weigering): dan gebruikt de chat `hulpAntwoord`.
 */
async function vraagTaalmodel(berichten: { role: "user" | "assistant"; text: string }[], dekking: DekkingKeuze | ""): Promise<Pick<ChatMessageData, "text" | "sources"> | null> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ berichten, dekking }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) return null;
    const { tekst, bronnen } = (await response.json()) as { tekst?: string; bronnen?: ChatSource[] };
    return tekst ? { text: tekst, sources: bronnen && bronnen.length > 0 ? bronnen : undefined } : null;
  } catch {
    return null;
  }
}

/** Eerlijke terugval voor als het taalmodel er niet is en er geen betrouwbaar kort antwoord is. */
const HULP_FALLBACK = "Ik kan je vraag op dit moment niet goed beantwoorden. Probeer het straks nog een keer, of neem contact op met de klantenservice van a.s.r.";

let nextMessageId = 1;

const JA_NEE = [
  { value: "ja", label: "Ja" },
  { value: "nee", label: "Nee" },
];

/** Terug-knop bovenaan de kaart: 27px hoog, zelfde opmaak als de andere funnels. */
const BACK_BUTTON_CLASS = "inline-flex items-center justify-center gap-2 py-0 pl-px text-black text-lg leading-[1.5] font-[550] underline whitespace-nowrap";

/** Een geldige datum, of null: de datumvelden geven tijdens het typen ook halve invoer door. */
function geldigeDatum(date: Date | null): Date | null {
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

/** Zelfde dag, N jaar later (29 februari valt in een niet-schrikkeljaar op 28 februari). */
function plusJaren(date: Date, jaren: number): Date {
  const doel = new Date(date.getFullYear() + jaren, date.getMonth(), date.getDate());
  if (doel.getMonth() !== date.getMonth()) return new Date(date.getFullYear() + jaren, date.getMonth() + 1, 0);
  return doel;
}

/**
 * "Jouw dekking" (stap 2 van 5) van de Autoverzekering-funnel op `/workshop`, gebouwd op Figma-node 9356:20207
 * ("Auto/JD/WA+", bestand "Autoverzekering"): de brede kaart (1184px) met basisdekking, eigen risico,
 * aanvullende dekkingen en de aankoopwaarderegeling.
 *
 * De beginstand is die van het Figma-frame (WA + Casco beperkt gekozen, aankoopwaarderegeling "Ja",
 * aankoopdatum 23-10-2025); alle keuzes zijn te wijzigen. De einddata van de aankoopwaarderegeling volgen uit
 * de ingevulde aankoopdatum (2 en 3 jaar later), zoals in het ontwerp. Prijzen zijn de voorbeeldbedragen uit
 * Figma, er is geen berekening achter de keuzes.
 *
 * Opvallend in Figma (letterlijk overgenomen): de terugknop bovenin heet "Jouw situatie", de vorige-stapknop
 * onderin "Jouw dekking".
 */
export default function WorkshopPage() {
  const router = useRouter();
  const [dekking, setDekking] = useState<DekkingKeuze | "">("wa-casco-beperkt");
  const [eigenRisico, setEigenRisico] = useState("");
  const [aanvullend, setAanvullend] = useState<string[]>([]);
  const [aankoopwaarde, setAankoopwaarde] = useState("ja");
  const [aankoopdatum, setAankoopdatum] = useState<Date | null>(new Date(2025, 9, 23));
  const [looptijd, setLooptijd] = useState("");

  const datum = geldigeDatum(aankoopdatum);
  const looptijdOpties = datum
    ? [2, 3].map((jaren) => ({ value: String(jaren), label: `${formatDatum(plusJaren(datum, jaren))} (${jaren} jaar na aankoopdatum)` }))
    : [];

  // AI-chat van /aichat (zelfde ChatWidget en knop), hier geopend met de vraag naar de dekking.
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);
  const [chatTyping, setChatTyping] = useState(false);
  const minimizedButtonRef = useRef<HTMLButtonElement>(null);
  const hulpTagRef = useRef<HTMLButtonElement | null>(null);

  function startChat() {
    setChatMessages([]);
    setChatTyping(false);
    setChatOpen(true);
  }

  function handleHulpClick(event: { currentTarget: HTMLButtonElement }) {
    hulpTagRef.current = event.currentTarget;
    // Loopt er al een gesprek (geminimaliseerd): gewoon weer openen, niet opnieuw beginnen.
    if (chatMessages.length > 0) setChatOpen(true);
    else startChat();
  }

  async function handleChatSend(text: string) {
    const gesprek = [...chatMessages.map(({ role, text: bericht }) => ({ role, text: bericht })), { role: "user" as const, text }];
    setChatMessages((previous) => [...previous, { id: nextMessageId++, role: "user", text }]);
    setChatTyping(true);
    // De drie "Meer over …"-onderwerpen blijven het vaste antwoord uit de kaarten; de rest gaat naar het taalmodel,
    // en als dat er niet is (geen sleutel, fout, weigering) naar het trefwoordenantwoord uit de kennisbank.
    const uitTaalmodel = kaartAntwoord(text) ? null : await vraagTaalmodel(gesprek, dekking);
    if (!uitTaalmodel) await new Promise((resolve) => setTimeout(resolve, 800));
    setChatTyping(false);
    setChatMessages((previous) => [...previous, { id: nextMessageId++, role: "assistant", ...(uitTaalmodel ?? hulpAntwoord(text, dekking)) }]);
  }

  const hulpTag = (
    <button
      type="button"
      onClick={handleHulpClick}
      aria-haspopup="dialog"
      className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <Tag text="Hulp nodig?" icon iconName="ai-agent" />
    </button>
  );

  return (
    <FunnelPageTemplate
      headerTitle="Autoverzekering"
      chatButton
      ikzSticker
      steps={AUTO_STEPS}
      activeStep={2}
      navigation={
        <FormNavigation
          previousStep
          previousLabel="Jouw dekking"
          nextLabel="Naar jouw gegevens"
          saveForLater
          onSaveForLater={() => {}}
          onPrevious={() => router.push("/auto")}
          onNext={() => router.push("/auto/jouw-gegevens")}
        />
      }
    >
      <div className="flex w-full items-start">
        <Button type="tertiary" iconPrepend="arrow-left" onClick={() => router.push("/auto")} className={BACK_BUTTON_CLASS}>
          Jouw situatie
        </Button>
      </div>

      <FunnelSection intro title="Jouw dekking" showRequiredFieldsNote />

      <FunnelSection title="Stel je autoverzekering samen">
        {/* Onder 600px: horizontaal swipebare kaarten (zelfde patroon als /autonew); vanaf 600px naast elkaar. */}
        <div className="-mx-6 w-[calc(100%+48px)] min-[600px]:hidden">
          <RadioCardBottomCarousel
            labelText="Kies je basisdekking"
            labelAction={hulpTag}
            options={CAROUSEL_OPTIONS}
            value={dekking}
            onChange={(value) => setDekking(value as DekkingKeuze)}
            onMoreInfoClick={() => {}}
            contentTopClassName="mt-2"
          />
        </div>
        <div className="hidden w-full min-[600px]:block">
          <RadioCardBottomGroup
            labelText="Kies je basisdekking"
            labelAction={hulpTag}
            options={DEKKING_OPTIONS}
            contentTopClassName="mt-2"
            value={dekking}
            onChange={(value) => setDekking(value as DekkingKeuze)}
            onMoreInfoClick={() => {}}
          />
        </div>

        <RadioCardBottomGroup
          labelText="Kies je eigen risico"
          description="Dit is het bedrag dat wij aftrekken van een schadevergoeding. Hoe hoger je eigen risico, hoe minder je per maand betaalt."
          variant="compact"
          options={EIGEN_RISICO_OPTIONS}
          value={eigenRisico}
          onChange={setEigenRisico}
        />

        <CheckboxCardControlLeftGroup
          labelText="Welke aanvullende dekkingen wil je?"
          options={AANVULLENDE_DEKKINGEN}
          values={aanvullend}
          onChange={setAanvullend}
          onMoreInfoClick={() => {}}
        />
      </FunnelSection>

      <FunnelSection
        title="Aankoopwaarderegeling"
        showDividerAbove
        description={
          <span className="block max-w-[640px]">
            Als je auto gestolen wordt of total loss raakt, dan krijg je standaard de dagwaarde van je auto vergoed. Dat is het bedrag dat je auto op dat moment waard is. Wil je in plaats van de dagwaarde het aankoopbedrag vergoed krijgen? Kies dan voor de aankoopwaarderegeling.
          </span>
        }
      >
        <RadioGroup
          labelText="Wil je gebruik maken van de aankoopwaarderegeling?"
          horizontal
          options={JA_NEE}
          value={aankoopwaarde}
          onChange={setAankoopwaarde}
        />

        {aankoopwaarde === "ja" && (
          <>
            <InputDate
              labelText="Wanneer heb je de auto gekocht? (dd-mm-jjjj)"
              showPickerButton
              maxDate={new Date()}
              value={aankoopdatum}
              onChange={(date) => {
                setAankoopdatum(date);
                setLooptijd("");
              }}
            />
            {looptijdOpties.length > 0 && (
              <RadioGroup
                labelText="Hoeveel jaar wil je deze aankoopwaarderegeling?"
                options={looptijdOpties}
                value={looptijd}
                onChange={setLooptijd}
              />
            )}
          </>
        )}
      </FunnelSection>

      {!chatOpen && chatMessages.length > 0 && <MinimizedChatButton onClick={() => setChatOpen(true)} btnRef={minimizedButtonRef} />}
      <ChatWidget
        isOpen={chatOpen}
        messages={chatMessages}
        isTyping={chatTyping}
        onClose={() => {
          setChatOpen(false);
          setChatMessages([]);
          setChatTyping(false);
        }}
        onMinimize={() => setChatOpen(false)}
        onNewChat={startChat}
        onSend={handleChatSend}
        returnFocusOnMinimize={minimizedButtonRef}
        returnFocusOnClose={hulpTagRef}
        welcomeText={HULP_OPENINGSVRAAG}
        topics={HULP_ONDERWERPEN}
        topicStyle="bubble"
        topicMessage={(label) => label}
        windowStyle="cream"
      />
    </FunnelPageTemplate>
  );
}
