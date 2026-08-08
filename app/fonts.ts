import localFont from "next/font/local";

/**
 * Echt lettertype-bestand voor "Avenir LT Pro 85 Heavy" (Figma-token
 * font-weight 700, gebruikt overal waar `font-bold`-Avenir-tekst voorkomt:
 * labels, titels, kaartkoppen). 550 (Medium) heeft nog geen bestand, dus
 * die blijft op de bestaande fallback-stack in `--font-avenir` staan.
 *
 * Elk gewicht krijgt bewust zijn eigen variabele i.p.v. samengevoegd te
 * worden: een font-family met maar één geregistreerd gewicht zou browsers
 * bij een andere gewicht-aanvraag dát ene bestand laten "matchen" i.p.v.
 * doorvallen naar de systeem-fallback — dat zou bv. gewone body-tekst per
 * ongeluk vet laten renderen.
 */
export const avenirHeavy = localFont({
  src: "./fonts/AvenirLTW05-85Heavy.otf",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-avenir-bold",
  fallback: ["Avenir Next", "Avenir", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

/**
 * "Avenir LT Pro 45 Book" — dit is, ondanks dat Figma het token intern
 * "font-text-weight-light" noemt, letterlijk het lettertype-bestand dat in
 * élke Figma-export achter dat token zat (numerieke waarde 350). Dit is
 * het meest gebruikte gewicht in de hele bibliotheek (alle `font-[350]`-
 * body-tekst: beschrijvingen, waarden, hulpteksten).
 */
export const avenirBook = localFont({
  src: "./fonts/AvenirLTW05-45Book.otf",
  weight: "350",
  style: "normal",
  display: "swap",
  variable: "--font-avenir-book",
  fallback: ["Avenir Next", "Avenir", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

/**
 * "Avenir LT Pro 65 Medium" (CSS-gewicht 550) — het laatst ontbrekende
 * Avenir-gewicht. Gebruikt in onderstreepte knoptekst: primaire/secundaire
 * knoppen in Dialog/Button/Header, "Meer informatie" in
 * CheckboxCardControlLeft, en het onderstreepte deel van CardDetails.
 */
export const avenirMedium = localFont({
  src: "./fonts/AvenirMedium.woff2",
  weight: "550",
  style: "normal",
  display: "swap",
  variable: "--font-avenir-medium",
  fallback: ["Avenir Next", "Avenir", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

/**
 * "Avenir LT Pro 35 Light" (CSS-gewicht 300). Geregistreerd als
 * beschikbare infrastructuur, maar: in geen van de Figma-fetches die in
 * dit project zijn gedaan kwam een tekststijl voor die dit bestand
 * (35 Light) gebruikte — steeds was het 45 Book (zie hierboven). Er is dus
 * momenteel geen component dat `--font-avenir-light` toepast. Niet
 * geforceerd ergens op geplakt om "het bestand toch te gebruiken" — dat
 * zou een aanname zijn, geen Figma-feit.
 */
export const avenirLight = localFont({
  src: "./fonts/AvenirLTW05-35Light.otf",
  weight: "300",
  style: "normal",
  display: "swap",
  variable: "--font-avenir-light",
  fallback: ["Avenir Next", "Avenir", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

/**
 * "Memphis Bold" — echte webfont (.woff2) uit het a.s.r.-webfonts-pakket,
 * i.p.v. losse OTF-uploads. Gebruikt overal waar `font-bold`-Memphis-tekst
 * voorkomt: de prijsweergave in CheckboxCardControlLeft (bevestigd via
 * Figma als "Memphis_LT_Std:Bold").
 */
export const memphisBold = localFont({
  src: "./fonts/MemphisBold.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-memphis-bold",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/**
 * "Memphis Medium" — bevestigd via Figma als "font-display-weight-medium"
 * (numerieke waarde 500). Gebruikt in Dialog-titels én in het stapnummer
 * van StepIndicator — dat laatste miste tot nu toe zelfs een expliciete
 * `font-medium`-klasse (bevestigde bevinding uit de typografie-audit),
 * hier meteen gecorrigeerd nu het echte bestand er is.
 */
export const memphisMedium = localFont({
  src: "./fonts/MemphisMedium.woff2",
  weight: "500",
  style: "normal",
  display: "swap",
  variable: "--font-memphis-medium",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/**
 * "Memphis Light" — geregistreerd als beschikbare infrastructuur. Net als
 * bij Avenir Light: geen enkel component in deze bibliotheek gebruikt op
 * dit moment een Memphis-tekst zonder `font-bold`/`font-medium` (d.w.z.
 * puur "Light"), dus deze variabele wordt momenteel nergens toegepast.
 */
export const memphisLight = localFont({
  src: "./fonts/MemphisLight.woff2",
  weight: "300",
  style: "normal",
  display: "swap",
  variable: "--font-memphis-light",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
