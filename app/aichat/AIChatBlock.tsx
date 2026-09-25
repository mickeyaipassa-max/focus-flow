"use client";

import { useEffect, useState, type KeyboardEvent, type RefObject } from "react";
import { Button } from "@/components/Button";

const TOPIC_LABELS = ["Vergoedingen", "Eigen risico", "Collectieve zorg", "Contact met a.s.r.", "Zorg voor kinderen", "Voorwaarden"];

type AIChatBlockProps = {
  chatActive: boolean;
  onStartFromTag: (tag: string) => void;
  onStartFromInput: (text: string) => void;
  onOpenWelcome: () => void;
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
  onOpenWelcome,
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

  function handleStart() {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onStartFromInput(trimmed);
      setInputValue("");
    } else {
      onOpenWelcome();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleStart();
    }
  }

  return (
    <section className="w-full bg-[#fff8e3] px-32 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex max-w-[800px] flex-col">
          <h2 className="mb-2 text-black text-[32px] leading-[1.3]" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            Heb je een vraag?
          </h2>

          {chatActive ? (
            <div className="mt-2 flex flex-col gap-6">
              <p className="text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                Je hebt al een lopend gesprek, ga daar verder of start een nieuw gesprek
              </p>
              <div className="flex items-center gap-2">
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
              <p className="mb-6 text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                Hoi, ik ben de nieuwe AI-assistent van a.s.r. en help je graag op weg.
                <br />
                Typ je hieronder je vraag of kies een onderwerp.
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
                  <textarea
                    aria-label="Typ je vraag of kies een onderwerp"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Je vraag of bericht..."
                    rows={1}
                    className="h-[51px] min-w-0 flex-1 resize-none rounded-[3px] border border-[#565656] bg-white px-4 py-[13px] text-black text-base leading-[1.5] outline-none placeholder:text-[#565656] focus:outline focus:outline-[1.5px] focus:outline-black"
                    style={{ fontFamily: "var(--font-avenir-book)" }}
                  />
                  {/* Native <button> i.p.v. `Button.tsx`: zelfde ref-behoefte als hierboven, styling 1:1 uit `Button.tsx`'s `type="brand"`-variant, alleen op de vaste 51px-hoogte van deze rij i.p.v. Button's eigen `py-3`. */}
                  <button
                    ref={primaryBtnRef}
                    type="button"
                    onClick={handleStart}
                    className="flex h-[51px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[3px] border-[rgba(0,0,0,0.08)] border-b-2 bg-[#eda50f] px-6 text-black text-lg leading-[1.5] hover:border hover:border-b hover:border-[#f0b335] hover:bg-[#f0b335]"
                    style={{ fontFamily: "var(--font-avenir-medium)", fontWeight: 550 }}
                  >
                    Start je gesprek
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
