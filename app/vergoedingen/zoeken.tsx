"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { InputSearch } from "@/components/InputSearch";

const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;

// Letterlijk uit Figma ("Veel gezocht", drie Links).
const VEEL_GEZOCHT = ["Fysiotherapie vanaf 18 jaar", "Podotherapie", "Stoppen met roken"];

/**
 * Figma "Zoeken": een witte kaart (radius 3, schaduw 0/4/16 zwart 12%, padding 24) met links de zoekopdracht en
 * "Veel gezocht", rechts (alleen op het desktopframe) een Highlight die naar inloggen met DigiD verwijst.
 * Figma toont geen resultaten of zoekgedrag; het veld houdt dus alleen zijn eigen waarde bij.
 */
export function VergoedingenZoeken() {
  const [zoekterm, setZoekterm] = useState("");

  return (
    <div className="flex w-full items-start gap-8 rounded-[3px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
        <h2 className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
          Welke vergoeding zoek je?
        </h2>
        <InputSearch labelText="Zoeken" required={false} placeholder="Zoek je vergoeding" value={zoekterm} onChange={setZoekterm} onClear={() => setZoekterm("")} />
        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-black text-lg leading-[1.5]" style={AVENIR}>
            Veel gezocht:
          </p>
          {VEEL_GEZOCHT.map((tekst) => (
            <a
              key={tekst}
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setZoekterm(tekst);
              }}
              className="text-[#0064a8] text-lg leading-[1.5] underline hover:no-underline"
              style={AVENIR}
            >
              {tekst}
            </a>
          ))}
        </div>
      </div>

      {/* Highlight (Figma 22:1550): alleen op het desktopframe; het mobiele frame heeft hem niet. */}
      <div className="hidden w-[384px] shrink-0 items-start rounded-[3px] bg-[#d7e9f5] px-3 py-2 min-[900px]:flex">
        <div className="flex flex-1 flex-col items-start gap-2 p-2">
          <div className="flex w-full flex-col gap-1 text-black">
            <p className="text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
              Wil je weten wat je vergoed krijgt?
            </p>
            <p className="text-base leading-[1.5]" style={AVENIR}>
              Log in met DigiD om jouw persoonlijke vergoedingen te zien
            </p>
          </div>
          <Button type="brand" iconAppend="logo-digid">
            Inloggen met DigiD
          </Button>
        </div>
      </div>
    </div>
  );
}
