"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * Tekst 1:1 uit Figma (fileKey J5w7sS61nA71ipx9SwRCA2, nodes 11:190 t/m
 * 11:208, "Slide 16:9 - 4" t/m "- 10"). Elke slide is daar een los, statisch
 * frame — Figma bevat geen animatie-data voor deze nodes. De fade-transitie
 * hieronder (op ArrowRight, of tap/klik voor mobiel) is dus een interactie
 * die de gebruiker zelf heeft gevraagd, niet iets dat uit het ontwerp komt.
 */
const slides: string[][] = [
  ["Lieve Elise", "weer een jaartje erbij"],
  [
    "Ik wou dat je jezelf soms kon zien zoals ik jou zie. Hoeveel talent, creativiteit en eigenheid er in jou zit.",
  ],
  [
    "Je hoeft niet eerst beter, zekerder of minder bang te zijn om daar iets mee te mogen doen. Het is er al.",
  ],
  [
    "Daarom krijg je van mij dit jaar geen gewoon cadeau, maar een klein zetje om te spelen, te maken en vooral te ontdekken wat er gebeurt als je jezelf wat meer ruimte geeft.",
  ],
  ["Een graffiti workshop om lekker buiten de lijntjes te kleuren"],
  ["en een reminder om je te laten zien wat ik allang zie:"],
  ["Jouw werk verdient een plek in de wereld."],
];

const FADE_MS = 900;

const LAST_INDEX = slides.length - 1;

export default function BdayPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const goNext = useCallback(() => {
    if (index >= LAST_INDEX) {
      setLeaving(true);
      return;
    }
    setIndex((current) => current + 1);
  }, [index]);

  // Na de laatste slide fadet het scherm eerst naar zwart (zelfde
  // FADE_MS als de slide-transities) voor naar /elise wordt genavigeerd
  // — geen abrupte sprong naar de andere pagina.
  useEffect(() => {
    if (!leaving) return;
    const timeout = setTimeout(() => router.push("/elise"), FADE_MS);
    return () => clearTimeout(timeout);
  }, [leaving, router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext]);

  return (
    <main
      className="relative h-screen w-screen overflow-hidden bg-black"
      onClick={goNext}
    >
      {slides.map((lines, i) => {
        const active = revealed && i === index && !leaving;
        return (
          <div
            key={i}
            aria-hidden={!active}
            className="absolute inset-0 flex items-center pl-[clamp(24px,12.76vw,245px)] pr-[clamp(24px,15.52vw,298px)]"
            style={{
              opacity: active ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
              pointerEvents: active ? "auto" : "none",
            }}
          >
            <p
              className="m-0 max-w-[1377px] font-[family-name:var(--font-bday-poppins)] font-light text-white"
              style={{
                fontSize: "clamp(1.5rem, 1.05rem + 2.6vw, 4rem)",
                lineHeight: 1.11,
                letterSpacing: "0.18em",
              }}
            >
              {lines.map((line, li) => (
                <span key={li} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        );
      })}
    </main>
  );
}
