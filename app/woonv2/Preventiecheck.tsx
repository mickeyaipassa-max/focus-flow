"use client";

import { useId, useState } from "react";
import { Button } from "@/components/Button";

const TOTAAL_VRAGEN = 5;

const VRAAG = "Waar laad jij meestal de accu van je elektrische fiets op?";
const ANTWOORDEN = ["In de gang", "In de schuur", "Buiten", "Ergens anders"];

/**
 * Demo van de interactieve preventiecheck: alleen vraag 1 is uitgewerkt (de briefing geeft alleen die tekst).
 * Een antwoord kiezen markeert de optie; "Volgende vraag" zet de voortgang een stap verder. De overige vragen en
 * tips zijn bewust niet verzonnen: daarna volgt een demo-melding met een knop om opnieuw te beginnen.
 */
export function Preventiecheck() {
  const groepNaam = useId();
  const [stap, setStap] = useState(1);
  const [antwoord, setAntwoord] = useState<string | null>(null);
  const [fout, setFout] = useState(false);

  const inDemoEinde = stap > 1;

  return (
    <div className="w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-white p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.12)] min-[600px]:p-10">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }} aria-live="polite">
          Vraag {stap} van {TOTAAL_VRAGEN}
        </p>
        {/* Vijf segmenten, gevuld t/m de huidige vraag; zelfde kleuren als de ProgressIndicator van de funnels. */}
        <div
          className="flex gap-1"
          role="progressbar"
          aria-valuenow={stap}
          aria-valuemin={1}
          aria-valuemax={TOTAAL_VRAGEN}
          aria-label={`Vraag ${stap} van ${TOTAAL_VRAGEN}`}
        >
          {Array.from({ length: TOTAAL_VRAGEN }, (_, index) => (
            <div key={index} className={["h-1 flex-1 rounded-[3px] transition-colors", index < stap ? "bg-[#0f865d]" : "bg-[rgba(0,0,0,0.12)]"].join(" ")} />
          ))}
        </div>
      </div>

      {inDemoEinde ? (
        <div className="flex flex-col items-start gap-6">
          <p className="text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            Dit is een demonstratie: je koos &ldquo;{antwoord}&rdquo;. De overige vragen en de tips om schade te voorkomen volgen in de uitwerking van deze check.
          </p>
          <Button
            type="secondary"
            onClick={() => {
              setStap(1);
              setAntwoord(null);
              setFout(false);
            }}
          >
            Begin opnieuw bij vraag 1
          </Button>
        </div>
      ) : (
        <fieldset className="m-0 flex flex-col items-start gap-4 border-0 p-0">
          <legend className="mb-4 text-black text-xl leading-[1.4] min-[600px]:text-2xl" style={{ fontFamily: "var(--font-memphis-medium)" }}>
            {VRAAG}
          </legend>
          <div className="flex w-full flex-col gap-2">
            {ANTWOORDEN.map((optie) => {
              const gekozen = antwoord === optie;
              return (
                <label
                  key={optie}
                  className={[
                    "flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-[3px] border px-4 py-3 text-black text-lg leading-[1.5] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-black",
                    gekozen ? "border-2 border-black bg-[#fff8e3]" : "border-[#565656] hover:border-black hover:bg-[#fafafa]",
                  ].join(" ")}
                  style={{ fontFamily: "var(--font-avenir-book)" }}
                >
                  <input type="radio" name={groepNaam} value={optie} checked={gekozen} onChange={() => {
                      setAntwoord(optie);
                      setFout(false);
                    }} className="size-5 shrink-0 accent-black" />
                  {optie}
                </label>
              );
            })}
          </div>
          {fout && (
            <p role="alert" className="text-[#ce0a1e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              Kies eerst een antwoord om door te gaan.
            </p>
          )}
          <div className="mt-2">
            <Button
              type="primary"
              onClick={() => {
                if (!antwoord) setFout(true);
                else setStap(stap + 1);
              }}
            >
              Volgende vraag
            </Button>
          </div>
        </fieldset>
      )}
    </div>
  );
}
