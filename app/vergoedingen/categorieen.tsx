"use client";

import NextLink from "next/link";
import { Fragment, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { CATEGORIEEN } from "./categorieen-data";

const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;
const AVENIR_BOLD = { fontFamily: "var(--font-avenir-bold)" } as const;

// Aantal kolommen per breakpoint: 1 tot 600 px, 2 vanaf 600 px, 3 vanaf 900 px.
const KOLOMMEN = [1, 2, 3] as const;

/** Tailwind moet de klassenamen letterlijk zien, dus geen samengestelde `grid-cols-${n}`. */
const PANEEL_KOLOMMEN: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 min-[600px]:grid-cols-2",
  3: "grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3",
};

function Verbergen({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-black text-base leading-[1.5] underline hover:no-underline" style={AVENIR}>
      Verbergen
    </button>
  );
}

/**
 * "Zoek in categorieën": 18 knoppen die elk een paneel met de vergoedingen van die categorie openen. Naar het gedrag
 * van de live pagina (asr.nl/zorgverzekering/vergoedingen): er is er één tegelijk open, de open knop krijgt een zwarte rand
 * en een minteken, en het paneel staat over de volle breedte onder de rij van die knop, met een pijltje naar de knop.
 * Figma tekent alleen de dichte staat; het paneel en de min zijn dus nagebouwd naar de live pagina.
 *
 * De plek van het paneel in de rij volgt uit CSS `order` per breakpoint (de CSS-variabelen --o1/--o2/--o3 en het pijltje
 * --a1/--a2/--a3), zodat de server-HTML al klopt bij elke breedte en er geen verspringing na hydratatie is.
 */
export function VergoedingenCategorieen() {
  const [open, setOpen] = useState<number | null>(null);
  const knoppen = useRef<(HTMLButtonElement | null)[]>([]);
  const totaal = CATEGORIEEN.length;

  function verberg(index: number) {
    setOpen(null);
    knoppen.current[index]?.focus();
  }

  return (
    <ul className="m-0 grid w-full list-none grid-cols-1 gap-2 p-0 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 min-[900px]:gap-4">
      {CATEGORIEEN.map((categorie, index) => {
        const isOpen = open === index;
        const paneelId = `categorie-paneel-${index}`;
        const titelId = `categorie-titel-${index}`;
        // Positie van het paneel (na het laatste item van de rij) en van het pijltje (midden onder de knop), per kolomaantal.
        const paneelStijl: Record<string, string | number> = {};
        KOLOMMEN.forEach((kolommen, i) => {
          const laatsteVanRij = Math.min((Math.floor(index / kolommen) + 1) * kolommen - 1, totaal - 1);
          paneelStijl[`--o${i + 1}`] = laatsteVanRij * 2 + 1;
          paneelStijl[`--a${i + 1}`] = `${(((index % kolommen) + 0.5) / kolommen) * 100}%`;
        });

        return (
          <Fragment key={categorie.label}>
            <li style={{ order: index * 2 }}>
              <button
                ref={(element) => {
                  knoppen.current[index] = element;
                }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={isOpen ? paneelId : undefined}
                onClick={() => setOpen(isOpen ? null : index)}
                className={`flex min-h-16 w-full items-center gap-3 rounded-[3px] border bg-white px-4 py-3 text-left text-black hover:border-black hover:bg-[rgba(0,0,0,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                  isOpen ? "border-black" : "border-[#565656]"
                }`}
              >
                <img src={`/vergoedingen/pictogram-${categorie.pictogram}.svg`} alt="" width={24} height={24} className="size-6 shrink-0" />
                <span className="flex-1 text-lg leading-[1.5]" style={AVENIR}>
                  {categorie.label}
                </span>
                <Icon name={isOpen ? "minus" : "add"} />
              </button>
            </li>

            {isOpen && (
              <li
                style={paneelStijl}
                className="relative order-[var(--o1)] col-span-full min-[600px]:order-[var(--o2)] min-[900px]:order-[var(--o3)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-2 left-[var(--a1)] size-4 -translate-x-1/2 rotate-45 bg-[#f6f6f7] min-[600px]:left-[var(--a2)] min-[900px]:left-[var(--a3)]"
                />
                <section id={paneelId} aria-labelledby={titelId} className="relative flex flex-col gap-4 rounded-[3px] bg-[#f6f6f7] p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 id={titelId} className="text-black text-[24px] leading-[1.3]" style={MEMPHIS}>
                    {categorie.label}
                  </h3>
                  <Verbergen onClick={() => verberg(index)} />
                </div>

                <div className={`grid gap-x-8 gap-y-6 ${PANEEL_KOLOMMEN[categorie.kolommen.length]}`}>
                  {categorie.kolommen.map((kolom) => (
                    <div key={kolom.kop} className="flex min-w-0 flex-col gap-2">
                      <h4 className="text-black text-lg leading-[1.5]" style={AVENIR_BOLD}>
                        {kolom.kop}
                      </h4>
                      <ul className="m-0 flex list-none flex-col gap-1 p-0">
                        {kolom.links.map((link) => {
                          const tekst = typeof link === "string" ? link : link.tekst;
                          const href = typeof link === "string" ? undefined : link.href;
                          const className = "text-[#0064a8] text-lg leading-[1.5] underline hover:no-underline";
                          return (
                            <li key={tekst} className="flex items-start gap-2">
                              <span className="flex h-[27px] shrink-0 items-center">
                                <Icon name="chevron-right-sm" size="sm" />
                              </span>
                              {href ? (
                                <NextLink href={href} className={className} style={AVENIR}>
                                  {tekst}
                                </NextLink>
                              ) : (
                                /* Geen bestemming bekend (zie categorieen-data.ts): de link scrolt niet naar boven. */
                                <a href="#" onClick={(event) => event.preventDefault()} className={className} style={AVENIR}>
                                  {tekst}
                                </a>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <Verbergen onClick={() => verberg(index)} />
                </div>
                </section>
              </li>
            )}
          </Fragment>
        );
      })}
    </ul>
  );
}
