import { PRODUCT_URL, type KennisItem, type Product } from "./types";

/**
 * De drie productpagina's op asr.nl, gelezen op 29 oktober 2026 (inclusief de ingeklapte veelgestelde vragen):
 * - https://www.asr.nl/autoverzekering/wa
 * - https://www.asr.nl/autoverzekering/wa-casco-beperkt-verzekering
 * - https://www.asr.nl/autoverzekering/wa-casco-allrisk-verzekering
 * Het zijn marketingteksten in gewone taal; de precieze dekking staat in de voorwaarden. Staat dezelfde tekst op
 * meer pagina's, dan is het één onderdeel met meer pagina's als bron. Prijzen staan er niet (die worden berekend).
 */
const ALLE_PAGINAS = (artikel: string): Partial<Record<Product, string>> => ({ "site-wa": artikel, "site-casco-beperkt": artikel, "site-casco-allrisk": artikel });
const BEIDE_CASCO = (artikel: string): Partial<Record<Product, string>> => ({ "site-casco-beperkt": artikel, "site-casco-allrisk": artikel });

export const KENNISBANK_WEBSITE: KennisItem[] = [
  {
    id: "sw-wa-wat-is",
    artikelen: { "site-wa": "Wat is een WA autoverzekering?" },
    trefwoorden: ["wat is een wa autoverzekering", "wat is wa verzekering", "wa autoverzekering", "wa verzekering", "verplicht", "wettelijk verplicht", "moet ik een wa", "verplicht voor iedere auto-eigenaar", "auto op mijn naam", "auto op jouw naam", "andermans auto", "andermans spullen", "wat dekt de wa"],
    tekst:
      "Met de WA autoverzekering van Ik kies zelf ben je verzekerd voor schade aan anderen die je met je auto veroorzaakt. De WA (wettelijke aansprakelijkheid) autoverzekering vergoedt schade die jij met je auto aan anderen, andermans auto of andermans spullen toebrengt. Schade aan je eigen auto is niet verzekerd. Heb je een auto en staat deze op jouw naam, dan is een WA-verzekering wettelijk verplicht. Je kunt hem eenvoudig online afsluiten.",
  },
  {
    id: "sw-wa-verzekerd",
    artikelen: { "site-wa": "Wat is verzekerd met de WA autoverzekering? en Wanneer kies je voor een WA autoverzekering?" },
    trefwoorden: ["wat is verzekerd met de wa", "wat is verzekerd met wa", "wanneer kies ik wa", "wanneer kies je voor wa", "alleen wa", "alleen wa kiezen", "voor welke auto wa", "oude auto", "auto van 10 jaar", "10 jaar en ouder", "10 jaar of ouder", "lage dagwaarde", "schade aan mijn eigen auto zelf betalen", "is brand verzekerd met wa", "storm verzekerd met wa", "wa dekt geen"],
    tekst:
      "Met WA (verplicht) is schade aan anderen verzekerd. Niet verzekerd zijn: schade door brand, storm en natuur, ruitschade, diefstal, standaard 1 jaar nieuwwaarde en schade aan je eigen auto door aanrijding of vandalisme. WA is het meest gekozen voor auto's van 10 jaar en ouder. A.s.r. kan je geen persoonlijk advies geven over welke dekking het beste bij je past, maar klanten kiezen meestal alleen voor een WA-dekking als de auto 10 jaar of ouder is en dus een lagere dagwaarde heeft, of als ze schade aan hun eigen auto zelf willen betalen.",
  },
  {
    id: "sw-wa-bedragen",
    artikelen: { "site-wa": "Tot welk bedrag vergoedt een WA verzekering schade?" },
    trefwoorden: ["tot welk bedrag", "welk bedrag vergoedt", "bedrag vergoedt wa", "vergoedt wa schade", "hoeveel vergoedt wa", "maximale vergoeding wa", "6.450.000", "2.500.000", "letselschade", "per schadegeval", "hoeveel dekking wa", "dekkingsbedrag", "verzekerd bedrag wa", "maximum wa", "maximaal bedrag wa"],
    tekst:
      "Veroorzaak jij schade met of door je auto aan een ander en ben je aansprakelijk voor de schade? Dan vergoedt a.s.r. voor letselschade aan personen maximaal € 6.450.000 per schadegeval. Voor schade aan zaken en spullen vergoeden wij maximaal € 2.500.000.",
  },
  {
    id: "sw-wa-schade-aan-ander",
    artikelen: { "site-wa": "Wat gebeurt er bij schade aan een ander?" },
    trefwoorden: ["wat gebeurt er bij schade aan een ander", "schade aan een ander", "ik heb schade veroorzaakt", "tegenpartij", "verzekeraar van de tegenpartij", "een ander veroorzaakt schade aan mijn auto", "schade door een ander", "afspraak tussen autoverzekeraars", "schade melden online", "hoe meld ik schade", "wat moet ik doen na een ongeluk"],
    tekst:
      "Veroorzaak jij met je auto schade aan een ander? Meld de schade eenvoudig online; wij regelen de afhandeling. Veroorzaakt een ander schade aan jouw auto? Ook dan meld je je schade bij ons. Wij nemen alle zorg uit handen door bijvoorbeeld contact op te nemen met de verzekeraar van de tegenpartij. Dit is een afspraak tussen autoverzekeraars in Nederland.",
  },
  {
    id: "sw-premie",
    artikelen: ALLE_PAGINAS("Wat kost een autoverzekering?"),
    trefwoorden: ["wat kost mijn verzekering", "wat kost de verzekering", "wat kost de autoverzekering", "wat kost een auto", "wat kost een wa", "wat kost een casco", "wat kost een allrisk", "hoeveel kost mijn verzekering", "hoeveel kost de verzekering", "hoeveel kost een auto", "prijs verzekering", "prijs autoverzekering", "prijs van de verzekering", "premie berekenen", "bereken je premie", "bereken premie", "waar hangt de premie van af", "waarvan hangt de premie af", "hoe wordt de premie berekend", "premie bepaald", "wat betaal ik per maand", "kosten verzekering", "hoe duur is", "premie afhankelijk", "leeftijd bestuurder premie"],
    tekst:
      "De premie hangt af van een aantal dingen. Bij het berekenen van de premie kijkt a.s.r. bijvoorbeeld naar de leeftijd van de bestuurder, het merk, model, type en bouwjaar van je auto, je woonplaats en het aantal schadevrije jaren dat je hebt opgebouwd. Binnen 1 minuut bereken je je premie en sluit je direct online af.",
  },
  {
    id: "sw-dekking-aanpassen",
    artikelen: ALLE_PAGINAS("Kan ik later mijn dekking aanpassen?"),
    trefwoorden: ["dekking aanpassen", "later mijn dekking aanpassen", "dekking wijzigen", "dekking veranderen", "upgraden", "opwaarderen", "overstappen naar allrisk", "overstappen naar casco", "van wa naar casco", "van wa naar allrisk", "van casco naar wa", "dekking aanpassen naar", "verzekering wijzigen", "online wijzigen", "mijn a.s.r. account", "wijzigen via account"],
    tekst:
      "Ja, je kunt je dekking op ieder moment aanpassen naar WA, WA + Casco beperkt of WA + Casco allrisk. Je past je dekking eenvoudig aan in je a.s.r. account. Je ziet direct wat dit betekent voor je premie.",
  },
  {
    id: "sw-iemand-anders-rijdt",
    artikelen: ALLE_PAGINAS("Ben ik verzekerd als iemand anders in mijn auto rijdt?"),
    trefwoorden: ["iemand anders in mijn auto", "iemand anders rijdt", "auto uitlenen", "mijn auto uitlenen", "auto lenen", "familielid rijdt", "kennis rijdt", "andere bestuurder", "iemand anders rijdt in mijn auto", "mag iemand anders rijden", "mijn auto uitgeleend", "toestemming gegeven", "vriend rijdt"],
    tekst:
      "Ja, mits je toestemming aan de ander hebt gegeven om in je auto te rijden. Je auto is dus verzekerd als je die bijvoorbeeld uitleent aan een familielid of kennis. Welke schade verzekerd is hangt af van de door jou gekozen dekking. Kies je voor alleen een WA autoverzekering, dan is schade aan je eigen auto niet verzekerd; met WA + Casco beperkt is schade aan je eigen auto door aanrijding of vandalisme niet verzekerd.",
  },
  {
    id: "sw-geen-vergoeding",
    artikelen: ALLE_PAGINAS("Wanneer krijg je geen vergoeding?"),
    trefwoorden: ["wanneer krijg je geen vergoeding", "wanneer krijg ik geen vergoeding", "geen vergoeding", "niet verzekerd", "wanneer ben ik niet verzekerd", "geen premie betaald", "niet goed beveiligd", "snelheidsritten", "wat is niet gedekt", "wat valt er niet onder", "waarvoor krijg ik niets", "wanneer word ik niet vergoed"],
    tekst:
      "Je bent niet altijd verzekerd; soms krijg je geen vergoeding, bijvoorbeeld als je geen premie betaalt. Andere voorbeelden: de bestuurder heeft geen geldig rijbewijs of rijdt onder invloed; schade door snelheidsritten of wedstrijden; schade door slijtage of onvoldoende onderhoud; de auto is niet goed beveiligd tegen diefstal; schade die ontstaat tijdens verhuur, lease of zakelijk gebruik van de auto; het kenteken staat niet op naam van de verzekeringnemer, behalve als wij hebben aangegeven dat dit niet hoeft. Wil je precies weten hoe het zit, lees dan de voorwaarden.",
  },
  {
    id: "sw-aanvullende-dekkingen",
    artikelen: ALLE_PAGINAS("Aanvullende dekkingen"),
    trefwoorden: ["aanvullende dekking", "aanvullende dekkingen", "extra dekking", "uitbreiden", "uitbreiding", "breid je autoverzekering uit", "schade inzittenden", "inzittenden", "rechtsbijstand motorrijtuigen", "rechtsbijstand", "juridische hulp", "alarmcentrale 24/7", "24/7 hulp", "wat is schade inzittenden", "wat is rechtsbijstand", "wat is pechhulp"],
    tekst:
      "Wil je meer zekerheid, dan breid je je autoverzekering uit met aanvullende dekkingen. Pechhulp: de a.s.r. Alarmcentrale staat 24/7 voor je klaar als je niet verder kan rijden door pech. Schade inzittenden: passagiers en bestuurder zijn verzekerd voor letsel en schade aan hun spullen na een ongeval. Rechtsbijstand Motorrijtuigen: juridische hulp bij conflicten in het verkeer waarbij je auto is betrokken. De voorwaarden van de aanvullende dekking Pechhulp zijn opgenomen in de voorwaarden van Casco Beperkt en Casco Allrisk; Schade inzittenden (D SI 2017-01) en Rechtsbijstand Motorrijtuigen (D MR-RB 2015-01) hebben eigen voorwaarden.",
    links: [
      { title: "a.s.r. IKZ Voorwaarden Auto Schade Inzittenden D SI 2017-01", url: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57655.pdf" },
      { title: "a.s.r. IKZ Voorwaarden Rechtsbijstand Motorrijtuigen D MR-RB 2015-01", url: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57621.pdf" },
    ],
  },
  {
    id: "sw-voordelen",
    artikelen: ALLE_PAGINAS("Voordelen autoverzekering Ik kies zelf"),
    trefwoorden: ["voordelen", "waarom ik kies zelf", "waarom bij a.s.r.", "wat zijn de voordelen", "duurzaam schadeherstel", "duurzaam herstel", "snelle schadeafhandeling", "alles online", "24/7 hulp bij schade", "online afsluiten", "eenvoudig online", "makkelijk online", "ik kies zelf", "hoe sluit ik af"],
    tekst:
      "Voordelen van de autoverzekering Ik kies zelf: eenvoudig alles online (sluit zelf makkelijk online af en wijzig je verzekering via je a.s.r. account); 24/7 hulp bij schade (de alarmcentrale staat voor je klaar); snelle schadeafhandeling (meld je schade online, wij regelen de rest); en duurzaam schadeherstel (onze vakkundige herstellers repareren je schade duurzaam als dat kan). Binnen 1 minuut bereken je je premie en sluit je direct online af.",
  },
  {
    id: "sw-adviseur",
    artikelen: ALLE_PAGINAS("Liever onafhankelijk advies?"),
    trefwoorden: ["onafhankelijk advies", "adviseur", "onafhankelijk adviseur", "persoonlijk advies", "advies nodig", "welke dekking past bij mij", "welke dekking moet ik kiezen", "welke verzekering past bij mij", "wat raden jullie aan", "kunnen jullie mij adviseren", "welke dekking is het beste", "welke dekking kies ik", "advies"],
    tekst:
      "A.s.r. kan je geen persoonlijk advies geven over welke dekking het beste bij je past; jij kent je eigen situatie het beste. De autoverzekering Ik kies zelf sluit je zelf online af. Wil je liever advies? Een onafhankelijk adviseur denkt met je mee en zoekt de autoverzekering die het beste bij jouw situatie past. Klanten kiezen meestal voor alleen WA bij een auto van 10 jaar of ouder, voor WA + Casco beperkt bij een auto van 6 tot 10 jaar oud en voor WA + Casco allrisk bij een auto van 0 tot en met 5 jaar oud.",
  },
  {
    id: "sw-vergelijken",
    artikelen: ALLE_PAGINAS("Autoverzekeringen Ik kies zelf van a.s.r. vergelijken"),
    trefwoorden: ["vergelijken", "verschil tussen wa en casco", "verschil wa casco", "verschil casco beperkt en allrisk", "verschil beperkt allrisk", "wat is het verschil", "welke dekking", "welke is beter", "vergelijking dekkingen", "wa of casco", "wa plus of allrisk", "wa vs casco", "verschillen dekkingen", "welke dekkingen zijn er", "overzicht dekkingen", "hoe oud moet mijn auto zijn"],
    tekst:
      "De drie dekkingen vergeleken. WA (verplicht), het meest gekozen voor auto's van 10 jaar en ouder: schade aan anderen is verzekerd; schade door brand, storm en natuur, ruitschade, diefstal, standaard 1 jaar nieuwwaarde en schade aan je eigen auto door aanrijding of vandalisme zijn niet verzekerd. WA + Casco beperkt, het meest gekozen voor auto's van 6 tot 10 jaar oud: schade aan anderen, schade door brand, storm en natuur, ruitschade, diefstal en standaard 1 jaar nieuwwaarde zijn verzekerd; schade aan je eigen auto door aanrijding of vandalisme is niet verzekerd. WA + Casco allrisk, het meest gekozen voor auto's van 0 tot en met 5 jaar oud: dat alles is verzekerd, inclusief schade aan je eigen auto door aanrijding of vandalisme.",
  },
  {
    id: "sw-documenten",
    artikelen: ALLE_PAGINAS("Extra informatie en documenten"),
    trefwoorden: ["polisvoorwaarden", "voorwaarden downloaden", "waar vind ik de voorwaarden", "voorwaarden pdf", "verzekeringskaart", "verzekeringskaarten", "europees schadeformulier", "schadeformulier", "afstandverklaring", "schadevrije jaren overdragen", "partner schadevrije jaren", "schadevrije jaren afstaan", "tabel schadevrije jaren", "no-claim ladder", "wijzer in geldzaken", "documenten", "waar vind ik", "informatiedocument"],
    tekst:
      "Wil je weten wat precies verzekerd is? Dat lees je in de voorwaarden: Algemene Voorwaarden D 2013-01, Voorwaarden Auto Wettelijke Aansprakelijkheid D AU WA 2017-01, Voorwaarden Auto Casco Beperkt D AU CB 2017-01, Voorwaarden Auto Casco Allrisk D AU CA 2017-01, Voorwaarden Rechtsbijstand Motorrijtuigen D MR-RB 2015-01 en Voorwaarden Schade Inzittenden D SI 2017-01. Met de verzekeringskaart zie je in een oogopslag de meest relevante productinformatie en kun je de autoverzekering vergelijken met andere verzekeraars; die is er voor WA, Casco Beperkt, Casco Allrisk en Schade Inzittenden. Verder vind je het Europees Schadeformulier, de Afstandverklaring Schadevrije jaren (partners kunnen onderling schadevrije jaren aan elkaar overdragen via een afstandverklaring; degene die ze afstaat kan ze in de toekomst zelf niet meer gebruiken), de tabel schadevrije jaren, de no-claim ladder en Wijzer in geldzaken.",
    links: [
      { title: "a.s.r. IKZ Algemene Voorwaarden D 2013-01", url: PRODUCT_URL.algemeen },
      { title: "a.s.r. IKZ Voorwaarden Auto Wettelijke Aansprakelijkheid D AU WA 2017-01", url: PRODUCT_URL.wa },
      { title: "a.s.r. IKZ Voorwaarden Auto Casco Beperkt D AU CB 2017-01", url: PRODUCT_URL["casco-beperkt"] },
      { title: "a.s.r. IKZ Voorwaarden Auto Casco Allrisk D AU CA 2017-01", url: PRODUCT_URL["casco-allrisk"] },
      { title: "Verzekeringskaart a.s.r. IKZ Auto Wettelijke Aansprakelijkheid", url: "https://verzekeringskaarten.nl/ikkieszelf/auto-wa" },
      { title: "Verzekeringskaart a.s.r. IKZ Auto Casco Beperkt", url: "https://verzekeringskaarten.nl/ikkieszelf/auto-casco-beperkt" },
      { title: "Verzekeringskaart a.s.r. IKZ Auto Casco Allrisk", url: "https://verzekeringskaarten.nl/ikkieszelf/auto-casco-allrisk" },
      { title: "Tabel schadevrije jaren", url: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/57376.pdf" },
      { title: "No-claim ladder", url: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/50496.pdf" },
      { title: "Europees Schadeformulier", url: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/51335.pdf" },
      { title: "Afstandverklaring Schadevrije jaren", url: "https://www.asr.nl/asr/api/asrnl/pod/getpdf?uri=/POD/r/Pdf/56923.pdf" },
    ],
  },
  {
    id: "sw-cb-wat-is",
    artikelen: { "site-casco-beperkt": "Wat is een autoverzekering WA + Casco beperkt?" },
    trefwoorden: ["wat is wa plus", "wa plus", "wat is wa casco beperkt", "wat is casco beperkt", "wa + casco beperkt", "wa casco beperkt", "wat dekt wa plus", "wat is een autoverzekering wa", "uitgebreide autoverzekering", "beperkt casco", "beperkt casco verzekering", "wat is beperkt casco", "wat dekt wa casco beperkt"],
    tekst:
      "Naast schade aan anderen ben je met WA + Casco beperkt verzekerd voor schade door brand, storm, diefstal en ruitschade. Een WA + Casco beperkt autoverzekering (of WA plus) is een uitgebreide autoverzekering en bestaat uit twee delen. WA (wettelijke aansprakelijkheid) vergoedt schade die je met je auto aan anderen, andermans auto of andermans spullen veroorzaakt; die dekking is wettelijk verplicht als je een auto hebt. Casco beperkt vergoedt schade aan je eigen auto door brand, storm en natuur, en je bent verzekerd voor diefstal, ruit- en inbraakschade. Beperkt casco is niet verplicht, maar biedt wel extra zekerheid als je deze schade aan je eigen auto niet helemaal zelf wilt betalen. Je krijgt tot 3 jaar vergoeding van de nieuw- of aankoopwaarde en no-claimkorting tot 75%.",
  },
  {
    id: "sw-cb-verzekerd",
    artikelen: { "site-casco-beperkt": "Wat is verzekerd met WA + Casco beperkt? en Wanneer kies je voor WA + Casco beperkt?" },
    trefwoorden: ["wat is verzekerd met wa casco beperkt", "wat is verzekerd met casco beperkt", "wanneer kies ik wa casco beperkt", "wanneer kies je voor wa casco beperkt", "auto van 6 tot 10 jaar", "6 tot 10 jaar", "6 tot 10 jaar oud", "ruitbreuk diefstal brand", "meer zekerheid dan wa", "is aanrijding verzekerd casco beperkt", "vandalisme casco beperkt", "aanrijding casco beperkt"],
    tekst:
      "Met WA + Casco beperkt is verzekerd: schade aan anderen, schade door brand, storm en natuur, ruitschade, diefstal en standaard 1 jaar nieuwwaarde. Niet verzekerd is schade aan je eigen auto door aanrijding of vandalisme. WA + Casco beperkt is het meest gekozen voor auto's van 6 tot 10 jaar oud. A.s.r. kan je geen persoonlijk advies geven, maar klanten kiezen meestal voor WA + Casco beperkt als de auto 6 tot 10 jaar oud is en dus een lagere dagwaarde heeft, als ze schade door ruitbreuk, diefstal en brand niet zelf willen betalen en als ze meer zekerheid willen dan alleen de wettelijk verplichte WA-dekking.",
  },
  {
    id: "sw-ca-wat-is",
    artikelen: { "site-casco-allrisk": "Wat is een Allrisk autoverzekering?" },
    trefwoorden: ["wat is een allrisk autoverzekering", "wat is allrisk", "wat is casco allrisk", "allrisk autoverzekering", "meest uitgebreide autoverzekering", "wa volledig casco", "volledig casco", "wat is wa casco allrisk", "wat is volledig casco", "allrisk verzekering", "wat dekt allrisk"],
    tekst:
      "Naast schade aan anderen ben je met onze allriskdekking het meest uitgebreid verzekerd voor schade aan je eigen auto. Een Allrisk autoverzekering is de meest uitgebreide autoverzekering en bestaat uit twee delen. WA (wettelijke aansprakelijkheid) vergoedt schade die je met je auto aan anderen, andermans auto of andermans spullen veroorzaakt; die dekking is wettelijk verplicht als je een auto hebt. Casco allrisk vergoedt schade aan je eigen auto, ook als je die zelf veroorzaakt, bijvoorbeeld als je even niet oplet en een aanrijding krijgt. Allrisk is niet verplicht, maar biedt wel extra zekerheid als je schade aan je eigen auto niet helemaal zelf wilt betalen. Schade aan je auto door eigen schuld of vandalisme is verzekerd, en je krijgt no-claimkorting tot 75%.",
  },
  {
    id: "sw-ca-verzekerd",
    artikelen: { "site-casco-allrisk": "Wat is verzekerd met een Allrisk autoverzekering? en Wanneer kies je voor een Allrisk autoverzekering?" },
    trefwoorden: ["wat is verzekerd met allrisk", "wat is verzekerd met een allrisk", "wanneer kies ik allrisk", "wanneer kies je voor allrisk", "auto jonger dan 6 jaar", "nieuwe auto allrisk", "hoge dagwaarde", "auto van 0 tot en met 5 jaar", "0 tot en met 5 jaar", "zekerheid bij onverwachte schade", "onverwachte schade", "is allrisk de moeite waard", "voor welke auto allrisk"],
    tekst:
      "Met WA + Casco allrisk is alles verzekerd: schade aan anderen, schade door brand, storm en natuur, ruitschade, diefstal, standaard 1 jaar nieuwwaarde en schade aan je eigen auto door aanrijding of vandalisme. WA + Casco allrisk is het meest gekozen voor auto's van 0 tot en met 5 jaar oud. A.s.r. kan je geen persoonlijk advies geven, maar klanten kiezen meestal voor een WA Volledig Casco-dekking als de auto jonger is dan 6 jaar en dus nog een hoge dagwaarde heeft, als ze zekerheid willen bij onverwachte schade en als ze schade aan de eigen auto niet zelf willen betalen.",
  },
  {
    id: "sw-ca-eigen-schuld",
    artikelen: { "site-casco-allrisk": "Ben ik verzekerd bij schade als het mijn eigen schuld is?" },
    trefwoorden: ["eigen schuld", "mijn eigen schuld", "zelf veroorzaakt", "zelf schade veroorzaakt", "parkeren", "paaltje", "paal geraakt", "tijdens het parkeren", "andere auto geraakt", "opzettelijk", "met opzet", "even niet opgelet", "niet opgelet", "parkeerschade", "ben ik verzekerd als ik zelf schuld heb"],
    tekst:
      "Ja. Met WA + Casco allrisk is schade aan je eigen auto die je zelf hebt veroorzaakt verzekerd, bijvoorbeeld wanneer je tijdens het parkeren je eigen auto beschadigt doordat je een paaltje of een andere auto raakt. Schade die je met opzet veroorzaakt is nooit verzekerd.",
  },
  {
    id: "sw-ruitschade",
    artikelen: BEIDE_CASCO("Ben ik verzekerd bij ruitschade?"),
    trefwoorden: ["ruitschade verzekerd", "ben ik verzekerd bij ruitschade", "sterretje", "sterretje in de ruit", "steentje", "opspattend steentje", "ruitbreuk", "zonnedak", "ruitschade melden", "afspraak hersteller", "aangesloten hersteller", "ruit herstellen", "ruit laten repareren", "hoe regel ik ruitschade", "moet ik ruitschade melden"],
    tekst:
      "Ja, ruitschade is verzekerd met WA + Casco beperkt en met WA + Casco allrisk. Bijvoorbeeld een sterretje door een opspattend steentje of ruitbreuk door een voorwerp op de weg. Ook je zonnedak is hiervoor verzekerd. Heb je ruitschade, dan hoef je deze niet eerst bij ons te melden: maak direct een afspraak bij een van onze aangesloten herstellers.",
  },
  {
    id: "sw-vervangend-vervoer",
    artikelen: BEIDE_CASCO("Ben ik ook verzekerd voor vervangend vervoer?"),
    trefwoorden: ["vervangend vervoer verzekerd", "ben ik verzekerd voor vervangend vervoer", "gratis vervangend vervoer", "gratis leenauto", "leenauto total loss", "5 dagen leenauto", "vijf dagen", "auto in de garage", "tijdens de reparatie", "tijdens reparatie", "krijg ik een leenauto", "vervangende auto bij schade", "netwerk hersteller", "aangesloten hersteller leenauto"],
    tekst:
      "Heb je schade aan je auto en laat je deze repareren door een bij ons netwerk aangesloten hersteller, dan krijg je tijdens de reparatie gratis vervangend vervoer. Kan je auto niet gerepareerd worden en is deze total loss, dan krijg je voor 5 dagen een gratis leenauto.",
  },
  {
    id: "sw-eigen-risico",
    artikelen: BEIDE_CASCO("Heb ik eigen risico?"),
    trefwoorden: ["welk eigen risico", "welk eigen risico kan ik kiezen", "eigen risico kiezen", "eigen risico aanpassen", "eigen risico verlagen", "eigen risico verhogen", "eigen risico hoogte", "hoeveel eigen risico kan ik kiezen", "kan ik eigen risico kiezen", "eigen risico bedragen", "eigen risico 0", "eigen risico 150", "eigen risico 250", "eigen risico 500", "150 euro", "250 euro", "500 euro", "hoe hoger eigen risico", "hoe hoger je eigen risico", "geen eigen risico", "eigen risico sterretje"],
    tekst:
      "Je kunt zelf kiezen of je een eigen risico wilt. Je kunt kiezen uit € 0, € 150, € 250 of € 500. Dit is het bedrag dat we van een eventuele schadevergoeding afhalen. Hoe hoger je eigen risico, hoe lager je premie. Goed om te weten: laat je een sterretje in je ruit herstellen, dan heb je geen eigen risico.",
  },
  {
    id: "sw-nieuwwaarde-aankoopwaarde",
    artikelen: BEIDE_CASCO("Extra opties: nieuwwaarderegeling en aankoopwaarderegeling"),
    trefwoorden: ["nieuwwaarderegeling", "aankoopwaarderegeling", "nieuwwaarde meeverzekeren", "aankoopwaarde meeverzekeren", "eerste eigenaar", "nieuwe auto verzekeren", "tweedehands gekocht", "in het buitenland gekocht", "3 jaar meeverzekeren", "tot 3 jaar", "extra opties", "nieuwwaarde of aankoopwaarde", "wat is de nieuwwaarderegeling", "wat is de aankoopwaarderegeling", "welke extra opties", "vergoeding nieuwwaarde"],
    tekst:
      "Nieuwwaarderegeling: ben je de eerste eigenaar van een nieuwe auto, dan kun je de nieuwwaarde tot 3 jaar meeverzekeren. Aankoopwaarderegeling: heb je je auto tweedehands of in het buitenland gekocht, dan kun je de aankoopwaarde tot 3 jaar meeverzekeren. Met WA + Casco beperkt of WA + Casco allrisk krijg je standaard 1 jaar nieuwwaarde. Je kunt ook je eigen risico aanpassen: hoe hoger je eigen risico, hoe lager je premie. Hoe de waarde precies wordt bepaald staat in de voorwaarden.",
  },
];
