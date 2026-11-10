"use client";

import { useId, useState } from "react";
import { Icon } from "./Icon";

/**
 * "Tile Menu" uit de a.s.r. Components-library (Figma 1cHiSmdMZQsfivYMqhPfyq, pagina "Tile Menu", node 13889:10).
 * Een navigatiemenu van maximaal drie niveaus:
 *  - desktop ("Tile Menu Desktop", columns=2|3): de niveaus staan als even brede kolommen naast elkaar;
 *    een klik op een item in kolom 1 of 2 opent de volgende kolom ernaast;
 *  - mobiel ("Tile Menu Mobile", column=1st|2nd|3rd): één kaart. Een tik opent het volgende niveau op dezelfde plek,
 *    met bovenaan een terugregel (pijl naar links + naam van het bovenliggende item) en een Divider.
 *
 * Eén menuregel volgt "Tile Menu Item": 64px hoog, px 24 / py 16, label in Text/MD (Avenir 45 Book, 18px, lh 1.5).
 * Kolom 1 heeft een pictogram van 32px (gap 12px tot het label), kolom 2 alleen label + chevron, kolom 3 (eindlinks) alleen het label.
 *  - hover: achtergrond color/gray-30 (#f6f6f7), gele linkerrand van 4px (color/yellow-500, #eda50f), chevron wordt pijl naar rechts,
 *    gap tussen label en icoon 16px → 24px;
 *  - selected (active=true): als hover, plus het label in Text/MD | bold (85 Heavy).
 * De linkerrand is een inset-schaduw i.p.v. een CSS-border: in Figma telt de stroke niet mee in de auto-layout,
 * met een echte border zou de inhoud 4px opschuiven.
 */

export type TileMenuItem = {
  label: string;
  /** Pad naar een pictogram van 32px. Alleen getoond in het eerste niveau. */
  pictogram?: string;
  /** Link voor een eindpunt (een item zonder `children`). */
  href?: string;
  /** Toon ook bij een eindpunt de chevron (Figma toont die bij elk item van het eerste niveau, ook als het submenu nog niet is ingevuld). */
  toonChevron?: boolean;
  /** Het volgende niveau (maximaal drie niveaus in totaal). */
  children?: TileMenuItem[];
};

type TileMenuProps = {
  /** Toegankelijke naam van de navigatie. */
  label: string;
  items: TileMenuItem[];
  /** Aantal kolommen op desktop: 3 (standaard) of 2 ("Tile Menu Desktop, columns=2": twee even brede kolommen, bv. op de Service hub). */
  kolommen?: 2 | 3;
  /** Welke items bij het laden al open staan, per niveau (bv. `[0]` = eerste item van kolom 1 geselecteerd, zoals in de Service hub-pagina). */
  standaardOpen?: number[];
  className?: string;
};

const FONT_BOOK = "var(--font-avenir-book)";
const FONT_BOLD = "var(--font-avenir-bold)";
const ACTIEF = "bg-[#f6f6f7] shadow-[inset_4px_0_0_#eda50f]";
const HOVER =
  "hover:bg-[#f6f6f7] hover:shadow-[inset_4px_0_0_#eda50f] focus-visible:bg-[#f6f6f7] focus-visible:shadow-[inset_4px_0_0_#eda50f] focus-visible:outline-none";
// Figma: rij van 64px (py 16 rond een regel van 27px). Een label over twee regels laat de rij meegroeien i.p.v. over de rand te lopen,
// net als in app/zorgverzekeringen/TegelMenu.tsx.
const RIJ = "group flex min-h-16 w-full items-center px-6 py-[5px] text-left text-lg leading-[1.5] text-black";

function RijInhoud({ item, toonPictogram, actief, heeftVervolg }: { item: TileMenuItem; toonPictogram: boolean; actief: boolean; heeftVervolg: boolean }) {
  return (
    <>
      <span className="flex min-w-px flex-1 items-center gap-3">
        {toonPictogram && <img src={item.pictogram ?? "/icons/pictogram-placeholder.svg"} alt="" className="size-8 shrink-0" />}
        <span className="min-w-px flex-1" style={{ fontFamily: actief ? FONT_BOLD : FONT_BOOK }}>
          {item.label}
        </span>
      </span>
      {heeftVervolg &&
        (actief ? (
          <Icon name="arrow-right-black" size="md" />
        ) : (
          <>
            <Icon name="chevron-right-md" size="md" className="inline-flex size-6 shrink-0 items-center justify-center group-hover:hidden group-focus-visible:hidden" />
            <Icon name="arrow-right-black" size="md" className="hidden size-6 shrink-0 items-center justify-center group-hover:inline-flex group-focus-visible:inline-flex" />
          </>
        ))}
    </>
  );
}

function Rij({
  item,
  niveau,
  actief = false,
  onOpen,
  id,
  controls,
}: {
  item: TileMenuItem;
  niveau: number;
  actief?: boolean;
  onOpen: () => void;
  id?: string;
  controls?: string;
}) {
  const heeftVervolg = Boolean(item.children?.length);
  const toonIcoon = heeftVervolg || Boolean(item.toonChevron);
  const klasse = [RIJ, actief ? `gap-6 ${ACTIEF}` : `gap-4 hover:gap-6 focus-visible:gap-6 ${HOVER}`].join(" ");
  const inhoud = <RijInhoud item={item} toonPictogram={niveau === 0} actief={actief} heeftVervolg={toonIcoon} />;

  if (!heeftVervolg) {
    return (
      <a id={id} href={item.href ?? "#"} className={klasse}>
        {inhoud}
      </a>
    );
  }
  return (
    <button id={id} type="button" onClick={onOpen} aria-expanded={actief} aria-controls={controls} className={klasse}>
      {inhoud}
    </button>
  );
}

export function TileMenu({ label, items, kolommen: aantalKolommen = 3, standaardOpen = [], className }: TileMenuProps) {
  const basisId = useId();
  // Gekozen index per niveau, bv. [1, 3] = tweede item in kolom 1 en daarbinnen het vierde item in kolom 2.
  const [pad, setPad] = useState<number[]>(standaardOpen);
  // `standaardOpen` geldt alleen voor desktop (daar zie je het submenu naast het menu staan); de mobiele kaart begint altijd op niveau 1.
  const [aangeraakt, setAangeraakt] = useState(false);

  // De lijsten die bij een pad zichtbaar zijn: altijd niveau 1, plus de kinderen van elk gekozen item.
  function bouwKolommen(gekozen: number[]): TileMenuItem[][] {
    const lijsten: TileMenuItem[][] = [items];
    for (const index of gekozen) {
      const kinderen = lijsten[lijsten.length - 1][index]?.children;
      if (!kinderen?.length) break;
      lijsten.push(kinderen);
    }
    return lijsten;
  }
  const kolommen = bouwKolommen(pad);
  const mobielPad = aangeraakt ? pad : [];
  const mobieleKolommen = bouwKolommen(mobielPad);

  const rijId = (niveau: number, index: number, plek: "d" | "m") => `${basisId}-${plek}-${niveau}-${index}`;
  const kolomId = (niveau: number) => `${basisId}-kolom-${niveau}`;
  const terugId = `${basisId}-terug`;

  function open(niveau: number, index: number, mobiel = false) {
    // Mobiel start op een leeg pad; desktop kan al een standaardpad hebben, dus bouw verder op het pad van de eigen weergave.
    const basis = mobiel ? mobielPad : pad;
    setAangeraakt(true);
    setPad([...basis.slice(0, niveau), index]);
    // Mobiel wisselt de kaart van inhoud: zet de focus op de nieuwe terugregel.
    if (mobiel) requestAnimationFrame(() => document.getElementById(terugId)?.focus());
  }

  function terug() {
    const vorige = mobielPad[mobielPad.length - 1];
    const niveau = mobielPad.length - 1;
    setAangeraakt(true);
    setPad(mobielPad.slice(0, -1));
    requestAnimationFrame(() => document.getElementById(rijId(niveau, vorige, "m"))?.focus());
  }

  const diepte = mobieleKolommen.length - 1;
  const ouder = diepte > 0 ? mobieleKolommen[diepte - 1][mobielPad[diepte - 1]] : null;

  return (
    <nav aria-label={label} className={className}>
      {/* Desktop: twee of drie even brede kolommen; niet-geopende kolommen blijven leeg (Figma: lege "Container"). */}
      <div className={`hidden lg:grid ${aantalKolommen === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {Array.from({ length: aantalKolommen }, (_, niveau) => niveau).map((niveau) => {
          const lijst = kolommen[niveau];
          if (!lijst) return <div key={niveau} />;
          const laatste = niveau === kolommen.length - 1;
          // Bij twee kolommen (Service hub, Figma 14160:3974) rekt het eerste menu niet mee met een hoger submenu: dat steekt eronder uit.
          const hoeken = [niveau === 0 ? "rounded-l-md" : "", laatste ? "rounded-r-md" : ""].join(" ");
          return (
            <ul key={niveau} id={kolomId(niveau)} className={`flex flex-col bg-white py-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] ${hoeken} ${niveau === 0 && aantalKolommen === 2 ? "self-start" : ""}`}>
              {lijst.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <Rij
                    item={item}
                    niveau={niveau}
                    actief={pad[niveau] === index && niveau < kolommen.length - 1}
                    onOpen={() => open(niveau, index)}
                    id={rijId(niveau, index, "d")}
                    controls={kolomId(niveau + 1)}
                  />
                </li>
              ))}
            </ul>
          );
        })}
      </div>

      {/* Mobiel: één kaart die per niveau van inhoud wisselt. */}
      <div className="overflow-clip rounded-md bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] lg:hidden">
        {ouder && (
          <>
            <button id={terugId} type="button" onClick={terug} aria-label={`${ouder.label}, terug`} className={`${RIJ} ${HOVER}`}>
              <span className="flex min-w-px flex-1 items-center gap-4 pl-1">
                <Icon name="arrow-left" size="md" />
                <span className="min-w-px flex-1" style={{ fontFamily: FONT_BOOK }}>
                  {ouder.label}
                </span>
              </span>
            </button>
            <hr className="m-0 h-px border-0 bg-[#00000014]" />
          </>
        )}
        <ul className="flex flex-col py-2">
          {mobieleKolommen[diepte].map((item, index) => (
            <li key={`${item.label}-${index}`}>
              <Rij item={item} niveau={diepte} onOpen={() => open(diepte, index, true)} id={rijId(diepte, index, "m")} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
