"use client";

import { useEffect, useState, type KeyboardEvent, type RefObject } from "react";
import { Button } from "@/components/Button";

const TOPIC_LABELS = ["Vergoedingen", "Eigen risico", "Collectieve zorg", "Contact met a.s.r.", "Zorg voor kinderen", "Voorwaarden"];

type AIChatBlockProps = {
  chatActive: boolean;
  onStartFromTag: (tag: string) => void;
  onStartFromInput: (text: string) => void;
  onReopen: () => void;
  onReset: () => void;
  primaryBtnRef?: RefObject<HTMLButtonElement | null>;
};

/**
 * De "Heb je een vraag?"-sectie op de pagina zelf — bevestigd via de
 * bijgeleverde spec ("chat-widget-spec.md"): idle-staat (tags + textarea +
 * "Start je gesprek") zolang er geen gesprek loopt, active-staat ("Verder
 * met je gesprek" / "Start een nieuw gesprek") zodra dat wel zo is. H2 en
 * achtergrond/padding blijven in beide staten gelijk.
 */
export function AIChatBlock({
  chatActive,
  onStartFromTag,
  onStartFromInput,
  onReopen,
  onReset,
  primaryBtnRef,
}: AIChatBlockProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    if (!chatActive) setSelectedTag(null);
  }, [chatActive]);

  function handleTagClick(label: string) {
    setSelectedTag(label);
    onStartFromTag(label);
  }

  /** Bevestigd via de spec ("chat-widget-spec.md"): "Een lege textarea opent de chat niet: de knop doet dan niets." */
  function handleStart() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onStartFromInput(trimmed);
    setInputValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleStart();
    }
  }

  return (
    <section className="w-full bg-[#fff8e3] px-6 py-12 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex max-w-[800px] flex-col">
          {/* H2 24px i.p.v. 32px onder 600px — bevestigd via Figma's mobiele frame (node 56:9284). */}
          <h2 className="mb-2 text-black text-[24px] leading-[1.3] min-[600px]:text-[32px]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            Heb je een vraag?
          </h2>

          {chatActive ? (
            <div className="mt-2 flex flex-col gap-6">
              {/* Op 900-1199px staat de zwevende chatwidget (400px breed) naast deze tekst, waardoor er te weinig ruimte overblijft voor de knoppenrij ernaast — vandaar hier eerder afbreken en de knoppen eronder stapelen i.p.v. een volledige reflow van de sectie (bevestigd via Figma's "900-1199 chat open"-frame, node 54:9187/54:9193). Tekst 14px onder 600px, zelfde max-w-[326px] blijft toevallig kloppen (327px beschikbare breedte op mobiel). */}
              <p
                className="max-w-[326px] text-black text-sm leading-[1.5] min-[600px]:text-lg min-[1200px]:max-w-none"
                style={{ fontFamily: "var(--font-avenir-book)" }}
              >
                Je hebt al een lopend gesprek, ga daar verder of start een nieuw gesprek
              </p>
              <div className="flex flex-col items-start gap-2 min-[1200px]:flex-row min-[1200px]:items-center">
                {/*
                  Native <button> i.p.v. het gedeelde `Button`-component: die
                  is geen `forwardRef`-component, en deze knop heeft een ref
                  nodig om de focus terug te zetten zodra het chatvenster
                  sluit (bevestigd in de spec onder "Toegankelijkheid").
                  Styling 1:1 overgenomen uit `Button.tsx`'s eigen
                  `type="primary"`-variant.
                */}
                <button
                  ref={primaryBtnRef}
                  type="button"
                  onClick={onReopen}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] bg-black px-6 py-3 text-lg text-white leading-[1.5] hover:border hover:border-black hover:bg-[#292929]"
                  style={{ fontFamily: "var(--font-avenir-medium)", fontWeight: 550 }}
                >
                  Verder met je gesprek
                </button>
                <Button type="tertiary" onClick={onReset}>
                  Start een nieuw gesprek
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Tekst 14px onder 600px — bevestigd via Figma's mobiele frame (node 56:9284). */}
              <p className="mb-6 text-black text-sm leading-[1.5] min-[600px]:text-lg" style={{ fontFamily: "var(--font-avenir-book)" }}>
                Hoi, ik ben de nieuwe AI-assistent van a.s.r. en help je graag op weg.
                <br />
                Kies hieronder een onderwerp of typ je vraag.
              </p>
              {/* Volgorde en gap bevestigd via Figma (node 27:5854, "Frame 2609921"): tags staan nu bóven de invoerrij, gap 16px — het losse label "Typ je vraag of kies een onderwerp" dat hier eerder boven de textarea stond, is uit het ontwerp verwijderd en leeft nu alleen nog als `aria-label` op de textarea zelf. */}
              <div className="flex flex-col gap-4">
                <div className="flex max-w-[480px] flex-wrap gap-2" style={{ filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.12))" }}>
                  {TOPIC_LABELS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={selectedTag === label}
                      onClick={() => handleTagClick(label)}
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
                <div className="flex w-full items-center gap-2">
                  {/* Hoogte 45px en tekst 14px onder 600px, terug naar 51px/16px vanaf 600px — bevestigd via Figma's mobiele frame (node 56:9289). */}
                  <textarea
                    aria-label="Typ je vraag of kies een onderwerp"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Je vraag of bericht..."
                    rows={1}
                    className="h-[45px] min-w-0 flex-1 resize-none rounded-[3px] border border-[#565656] bg-white px-4 py-[13px] text-black text-sm leading-[1.5] outline-none placeholder:text-[#565656] focus:outline focus:outline-[1.5px] focus:outline-black min-[600px]:h-[51px] min-[600px]:text-base"
                    style={{ fontFamily: "var(--font-avenir-book)" }}
                  />
                  {/*
                    Native <button> i.p.v. `Button.tsx`: zelfde ref-behoefte als hierboven, styling 1:1 uit `Button.tsx`'s `type="brand"`-variant, alleen op de vaste 51px-hoogte van deze rij i.p.v. Button's eigen `py-3`.
                    Onder 600px wordt de knop icon-only (51×45px, alleen het verstuur-icoon) i.p.v. tekst — bevestigd via Figma's mobiele frame (node 56:9292, Code Connect verwijst hier naar `iconOnly=true`); `aria-label` behoudt de toegankelijke naam nu de tekst met CSS verborgen is.
                  */}
                  <button
                    ref={primaryBtnRef}
                    type="button"
                    onClick={handleStart}
                    aria-label="Start je gesprek"
                    className="flex h-[45px] w-[51px] shrink-0 items-center justify-center gap-2 rounded-[3px] border-[rgba(0,0,0,0.08)] border-b-2 bg-[#eda50f] hover:border hover:border-b hover:border-[#f0b335] hover:bg-[#f0b335] min-[600px]:h-[51px] min-[600px]:w-auto min-[600px]:whitespace-nowrap min-[600px]:px-6"
                    style={{ fontFamily: "var(--font-avenir-medium)", fontWeight: 550 }}
                  >
                    <img src="/icons/send.svg" alt="" className="size-6 min-[600px]:hidden" />
                    <span className="hidden text-black text-lg leading-[1.5] min-[600px]:inline">Start je gesprek</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
