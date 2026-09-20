import type { SelectOption } from "@/components/Select";

/**
 * Opties voor de "Gegevens"/"Je woning"-velden — losgetrokken uit de
 * Opstal-pagina zodat Inboedel (en straks andere producten) dezelfde vragen
 * met dezelfde opties tonen. Bevestigd via mcp dat Inboedel's "Je woning"-
 * sectie letterlijk dezelfde velden vraagt als Opstal's "Gegevens"-sectie —
 * vandaar gedeeld i.p.v. per pagina opnieuw gedefinieerd (voorkomt dat de
 * twee ooit uit de pas gaan lopen).
 *
 * `SOORT_WONING_OPTIONS`: geen enkele Figma-instance toonde de volledige
 * optielijst (alleen het al gekozen voorbeeld "Twee onder een kap" was
 * zichtbaar) — dus, op die ene optie na, niet 1-op-1 mcp-bevestigd. Gebaseerd
 * op de gangbare a.s.r.-categorieën voor woningtype.
 */
export const SOORT_WONING_OPTIONS: SelectOption[] = [
  { value: "vrijstaand", label: "Vrijstaande woning" },
  { value: "twee-onder-een-kap", label: "Twee onder een kap woning" },
  { value: "tussenwoning", label: "Rijwoning (tussenwoning)" },
  { value: "hoekwoning", label: "Rijwoning (hoekwoning)" },
  { value: "appartement", label: "Appartement" },
];

export const KOOP_HUUR_OPTIONS = [
  { value: "koop", label: "Koopwoning" },
  { value: "huur", label: "Huurwoning" },
];

export const JA_NEE_OPTIONS = [
  { value: "ja", label: "Ja" },
  { value: "nee", label: "Nee" },
];

export const MUREN_OPTIONS = [
  { value: "steen", label: "Steen" },
  { value: "hout", label: "Hout" },
];

export const DAK_OPTIONS = [
  { value: "schuin", label: "Schuin dak" },
  { value: "plat", label: "Plat dak" },
];

export const EIGEN_RISICO_OPTIONS = [
  { value: "0", label: "€ 0" },
  { value: "100", label: "€ 100" },
  { value: "500", label: "€ 500" },
];

/**
 * Geen Figma-instance toonde de volledige optielijst (alleen dat dit veld
 * een Select is, bevestigd op Inboedel's "Persoonlijke gegevens"-sectie) —
 * niet 1-op-1 mcp-bevestigd. Gebaseerd op gangbare gezinssamenstelling-
 * categorieën.
 */
export const GEZINSSAMENSTELLING_OPTIONS: SelectOption[] = [
  { value: "alleenstaand", label: "Alleenstaand" },
  { value: "samenwonend-zonder-kinderen", label: "Samenwonend/getrouwd zonder kinderen" },
  { value: "samenwonend-met-kinderen", label: "Samenwonend/getrouwd met kinderen" },
  { value: "alleenstaand-met-kinderen", label: "Alleenstaand met kinderen" },
];
