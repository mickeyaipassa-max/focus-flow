"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";

/**
 * "Tile Menu Mobile" uit Figma (node 18:4470, 345px breed op de pagina), met beide niveaus zoals op asr.nl/zorgverzekering:
 *  - niveau 1 (Figma: column=1st): zes groepen met pictogram en chevron;
 *  - niveau 2 (Figma: column=2nd): kop met terugpijl en de groepsnaam, een scheidingslijn en de links van die groep.
 * Een tik op een groep opent het tweede niveau in dezelfde kaart; de terugpijl brengt je terug. De teksten en links zijn die van de
 * live pagina. Relatieve links van asr.nl zijn hier absoluut gemaakt, zodat ze op asr.nl uitkomen.
 */

const FONT_BOOK = "var(--font-avenir-book)";
const ASR = "https://www.asr.nl";
const ZORG = `${ASR}/verzekeringen/zorgverzekering`;

type Groep = { label: string; pictogram: string; links: { label: string; href: string }[] };

const TEGELMENU_GROEPEN: Groep[] = [
  {
    label: "Mijn zorgverzekering",
    pictogram: "/zorgverzekeringen/tegelmenu-persoon-in-cirkel.svg",
    links: [
      { label: "Mijn zorgverzekering", href: `${ASR}/inloggen/zorg` },
      { label: "Zorgpas", href: `${ASR}/zorgverzekering/zorgpas` },
      { label: "Zorgapp", href: `${ZORG}/app` },
      { label: "Declaratieoverzicht", href: `${ASR}/inloggen/zorg` },
      { label: "Stand eigen bijdrage geneesmiddelen", href: `${ASR}/zorgverzekering/eigen-bijdrage` },
      { label: "Stand eigen risico", href: `${ASR}/zorgverzekering/eigen-risico` },
      { label: "Fysiotherapieverbruik", href: `${ASR}/inloggen/zorg` },
    ],
  },
  {
    label: "Betalen en geldzaken",
    pictogram: "/zorgverzekeringen/tegelmenu-euroteken.svg",
    links: [
      { label: "Betalingsregeling aanvragen", href: `${ZORG}/betalen/betalingsregeling-aanvragen` },
      { label: "Eigen risico gespreid betalen", href: `${ZORG}/betalen/gespreid-betalen-eigen-risico` },
      { label: "Rekeningen betalen", href: `${ZORG}#modal-betaaloverzicht` },
      { label: "Zorgtoeslag aanvragen", href: `${ZORG}/zorgtoeslag-aanvragen` },
      { label: "Problemen met betalen", href: `${ASR}/contact/problemen-met-betalen/zorgverzekering` },
    ],
  },
  {
    label: "Wijzigen of aanvragen",
    pictogram: "/zorgverzekeringen/tegelmenu-invullen.svg",
    links: [
      { label: "Verzekering aanpassen", href: `${ASR}/zorgverzekering/aanpassen` },
      { label: "Zorgverzekering afsluiten", href: `${ZORG}/afsluiten` },
      { label: "Betaalgegevens wijzigen", href: `${ASR}/inloggen/zorg` },
      { label: "Machtiging aanvragen", href: `${ZORG}/toestemming-vragen` },
      { label: "Zorgpas aanvragen", href: `${ZORG}/zorgpas` },
      { label: "Wachtlijstbemiddeling aanvragen", href: `${ZORG}/wachtlijstbemiddeling` },
      { label: "Verzekering opzeggen", href: `${ZORG}/annuleren-of-opzeggen` },
    ],
  },
  {
    label: "Documenten en informatie",
    pictogram: "/zorgverzekeringen/tegelmenu-document-details.svg",
    links: [
      { label: "Polisvoorwaarden", href: `${ZORG}/documenten` },
      { label: "Declaratieformulieren", href: `${ZORG}/zorgkosten-declareren#formulieren` },
      { label: "Machtigingsformulieren", href: `${ZORG}/toestemming-vragen` },
      { label: "Alle documenten", href: `${ZORG}/documenten` },
      { label: "Eigen risico", href: `${ZORG}/eigen-risico` },
      { label: "Eigen bijdrage", href: `${ZORG}/eigen-bijdrage` },
      { label: "Zorg in het buitenland", href: `${ZORG}/buitenland` },
    ],
  },
  {
    label: "Zorg en behandeling",
    pictogram: "/zorgverzekeringen/tegelmenu-hart-met-pleister.svg",
    links: [
      { label: "Fysiotherapie", href: `${ZORG}/fysiotherapie` },
      { label: "Mondzorg", href: `${ZORG}/mondzorg` },
      { label: "GGZ", href: `${ZORG}/ggz` },
      { label: "Brillen en lenzen", href: `${ZORG}/brillen` },
      { label: "Zorg in het buitenland", href: `${ZORG}/buitenland` },
      { label: "Ziekenhuiszorg", href: `${ZORG}/ziekenhuis` },
      { label: "Alle zorg en behandelingen", href: `${ZORG}/zorg` },
    ],
  },
  {
    label: "Apps en voordelen",
    pictogram: "/zorgverzekeringen/tegelmenu-ster.svg",
    links: [
      { label: "Zorg app", href: `${ZORG}/app` },
      { label: "Zorg voor jezelf", href: `${ZORG}/zorg-voor-jezelf` },
      { label: "Symptoomchecker", href: `${ZORG}/zorg-voor-jezelf/symptoomchecker` },
      { label: "Extra voor ondernemers", href: `${ASR}/zakelijk/verzekeringen/doorgaanverzekering-voor-ondernemers` },
      { label: "Voordeelpakket a.s.r. verzekeringen", href: `${ASR}/verzekeringen/voordeelpakket-van-asr` },
      { label: "Vitality beloningen", href: `${ASR}/vitality` },
    ],
  },
];

// Figma: rijen van 64px (px 24, py 16, gevuld met een regel van 27px). Een label dat op twee regels breekt ("Documenten en informatie") blijft in
// het ontwerp 64px hoog: 54px tekst met 5px erboven en eronder. `min-h-16` met `py-[5px]` geeft precies dat, en groeit mee bij meer regels.
const rijKlasse = "flex min-h-16 w-full items-center gap-4 px-6 py-[5px] text-left text-lg leading-[1.5] text-black hover:bg-[#f6f6f7] focus-visible:bg-[#f6f6f7]";

export function TegelMenu({ label }: { label: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const groepKnoppen = useRef<(HTMLButtonElement | null)[]>([]);
  const terugKnop = useRef<HTMLButtonElement>(null);
  const laatsteOpen = useRef<number>(0);

  function openGroep(index: number) {
    laatsteOpen.current = index;
    setOpen(index);
    // De lijst wisselt van inhoud: zet de focus op de terugknop, zodat toetsenbord- en schermlezergebruikers op de nieuwe kop beginnen.
    requestAnimationFrame(() => terugKnop.current?.focus());
  }

  function sluit() {
    setOpen(null);
    requestAnimationFrame(() => groepKnoppen.current[laatsteOpen.current]?.focus());
  }

  const groep = open === null ? null : TEGELMENU_GROEPEN[open];

  return (
    <nav aria-label={label} className="overflow-clip rounded-md bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {groep === null ? (
        <ul className="flex flex-col py-2">
          {TEGELMENU_GROEPEN.map((item, index) => (
            <li key={item.label}>
              <button
                type="button"
                ref={(element) => {
                  groepKnoppen.current[index] = element;
                }}
                onClick={() => openGroep(index)}
                className={rijKlasse}
                style={{ fontFamily: FONT_BOOK }}
              >
                <span className="flex min-w-px flex-1 items-center gap-3">
                  <img src={item.pictogram} alt="" className="size-8 shrink-0" />
                  <span className="min-w-px flex-1">{item.label}</span>
                </span>
                <Icon name="chevron-right-md" size="md" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <button type="button" ref={terugKnop} onClick={sluit} aria-label={`${groep.label}, terug naar het overzicht`} className={rijKlasse} style={{ fontFamily: FONT_BOOK }}>
            <Icon name="arrow-left" size="md" />
            <span className="min-w-px flex-1">{groep.label}</span>
          </button>
          <hr className="m-0 h-px border-0 bg-[rgba(0,0,0,0.12)]" />
          <ul className="flex flex-col py-2">
            {groep.links.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <a href={link.href} className={rijKlasse} style={{ fontFamily: FONT_BOOK }}>
                  <span className="min-w-px flex-1">{link.label}</span>
                  <Icon name="chevron-right-md" size="md" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
