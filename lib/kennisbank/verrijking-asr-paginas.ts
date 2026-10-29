import type { Verrijking } from "./types";
import { b, q } from "./verrijking-hulp";

/**
 * Document 5 van de uitrol: de klantvriendelijke laag voor de drie productpagina's op asr.nl (22 blokken, gelezen op
 * 29 oktober 2026). Zelfde werkwijze als bij de voorwaarden: brontekst en bronverwijzing blijven ongewijzigd en
 * `scripts/test-verrijking.mts` controleert elk getal. De pagina's zijn marketingtekst in gewone taal; de precieze
 * dekking staat in de voorwaarden. Daarom verwijzen de blokken waar dat kan naar het voorwaardenblok, en staat overal
 * dat a.s.r. geen persoonlijk advies geeft en geen prijzen noemt.
 */
export const VERRIJKING_ASR_PAGINAS: Record<string, Verrijking> = {
  "sw-wa-wat-is": b({
    uitleg: "Met WA ben je verzekerd voor schade die jij met je auto aan anderen veroorzaakt: aan andermans auto of andermans spullen. Schade aan je eigen auto vergoedt WA niet.",
    direct: ["Staat de auto op jouw naam, dan is een WA-verzekering wettelijk verplicht."],
    klantinfo: ["Of de klant een auto op eigen naam heeft."],
    gerelateerd: ["wa-dekking", "sw-wa-bedragen"],
  }),

  "sw-wa-verzekerd": b({
    uitleg: "Met alleen WA is schade aan anderen verzekerd. Schade aan je eigen auto is niet verzekerd, bijvoorbeeld door brand, storm, ruitschade, diefstal of een aanrijding.",
    direct: ["A.s.r. geeft geen persoonlijk advies over welke dekking bij je past."],
    aandachtspunten: [
      "Klanten kiezen meestal alleen WA als de auto 10 jaar of ouder is en dus een lagere dagwaarde heeft, of als ze schade aan hun eigen auto zelf willen betalen.",
      "Standaard 1 jaar nieuwwaarde zit niet in WA.",
    ],
    klantinfo: ["Hoe oud de auto is.", "Of de klant schade aan de eigen auto zelf wil betalen."],
    vervolgvragen: [q("De klant vraagt of alleen WA genoeg is", "Hoe oud is je auto, en wil je schade aan je eigen auto zelf betalen?")],
    gerelateerd: ["wa-dekking", "sw-vergelijken"],
  }),

  "sw-wa-bedragen": b({
    uitleg: "Veroorzaak je schade aan een ander en ben je aansprakelijk, dan vergoedt a.s.r. voor letsel maximaal € 6.450.000 per schadegeval. Voor schade aan zaken en spullen is het maximaal € 2.500.000.",
    aandachtspunten: ["Het gaat om schade waarvoor jij aansprakelijk bent."],
    klantinfo: ["Of het om letsel of om schade aan spullen gaat."],
    gerelateerd: ["verzekerd-bedrag", "wa-dekking"],
  }),

  "sw-wa-schade-aan-ander": b({
    uitleg: "Veroorzaak je schade aan een ander, meld die dan online. A.s.r. regelt de afhandeling. Veroorzaakt een ander schade aan jouw auto, meld dat dan ook bij a.s.r.",
    direct: ["A.s.r. neemt zelf contact op met de verzekeraar van de tegenpartij. Dat is een afspraak tussen autoverzekeraars in Nederland."],
    klantinfo: ["Wie de schade heeft veroorzaakt."],
    vervolgvragen: [q("De klant meldt schade en het is niet bekend wie die veroorzaakte", "Heb jij de schade veroorzaakt, of heeft een ander dat gedaan?")],
    gerelateerd: ["schade-melden", "schade-zonder-schuld"],
  }),

  "sw-premie": b({
    uitleg: "De premie hangt af van een aantal dingen. Denk aan de leeftijd van de bestuurder, merk, model, type en bouwjaar van je auto, je woonplaats en je schadevrije jaren.",
    direct: ["A.s.r. noemt hier geen vaste prijs. Je berekent je eigen premie online, dat kost 1 minuut."],
    aandachtspunten: ["Hoe hoger je eigen risico, hoe lager je premie."],
    klantinfo: ["Welke dekking de klant wil."],
    gerelateerd: ["sw-eigen-risico"],
  }),

  "sw-dekking-aanpassen": b({
    uitleg: "Je kunt je dekking op elk moment aanpassen naar WA, WA + Casco beperkt of WA + Casco allrisk. Dat doe je in je a.s.r. account.",
    direct: ["Je ziet direct wat de aanpassing betekent voor je premie."],
    klantinfo: ["Naar welke dekking de klant wil overstappen."],
    vervolgvragen: [q("De klant wil van dekking wisselen en het is niet bekend naar welke", "Naar welke dekking wil je overstappen?")],
    gerelateerd: ["sw-vergelijken"],
  }),

  "sw-iemand-anders-rijdt": b({
    uitleg: "Ja, als je de ander toestemming hebt gegeven om in je auto te rijden. Welke schade verzekerd is, hangt af van de dekking die jij hebt gekozen.",
    direct: ["Met alleen WA is schade aan je eigen auto niet verzekerd. Met WA + Casco beperkt is schade aan je eigen auto door een aanrijding of vandalisme niet verzekerd."],
    aandachtspunten: ["Je auto is dus ook verzekerd als je hem uitleent aan een familielid of kennis."],
    klantinfo: ["Of de bestuurder toestemming had.", "Welke dekking de klant heeft."],
    vervolgvragen: [q("Het is niet bekend of de bestuurder toestemming had", "Had die persoon toestemming van jou om te rijden?")],
    gerelateerd: ["uitsluiting-toestemming", "cb-wie-verzekerd"],
  }),

  "sw-geen-vergoeding": b({
    uitleg: "Je bent niet altijd verzekerd. Soms krijg je geen vergoeding, bijvoorbeeld als je geen premie betaalt.",
    direct: ["Wil je precies weten hoe het zit, lees dan de voorwaarden."],
    aandachtspunten: [
      "De bestuurder heeft geen geldig rijbewijs of rijdt onder invloed.",
      "Schade door snelheidsritten of wedstrijden.",
      "Schade door slijtage of onvoldoende onderhoud.",
      "De auto is niet goed beveiligd tegen diefstal.",
      "Schade tijdens verhuur, lease of zakelijk gebruik van de auto.",
      "Het kenteken staat niet op naam van de verzekeringnemer, behalve als a.s.r. heeft aangegeven dat dit niet hoeft.",
    ],
    klantinfo: ["Wat er is gebeurd."],
    vervolgvragen: [q("De klant vraagt of iets verzekerd is en geeft geen situatie", "Wat is er precies gebeurd?")],
    gerelateerd: ["algemene-uitsluitingen", "al-premie-betalen", "uitsluiting-kenteken"],
  }),

  "sw-aanvullende-dekkingen": b({
    brontekstSoort: "samenvatting",
    uitleg: "Je kunt je autoverzekering uitbreiden met aanvullende dekkingen: Pechhulp, Schade inzittenden en Rechtsbijstand Motorrijtuigen.",
    aandachtspunten: [
      "Pechhulp: de a.s.r. Alarmcentrale staat 24/7 voor je klaar als je niet verder kan rijden door pech.",
      "Schade inzittenden: passagiers en bestuurder zijn verzekerd voor letsel en schade aan hun spullen na een ongeval.",
      "Rechtsbijstand Motorrijtuigen: juridische hulp bij conflicten in het verkeer waarbij je auto is betrokken.",
      "De voorwaarden van Pechhulp staan in de voorwaarden van Casco beperkt en Casco allrisk. Schade inzittenden (D SI 2017-01) en Rechtsbijstand Motorrijtuigen (D MR-RB 2015-01) hebben eigen voorwaarden.",
    ],
    klantinfo: ["Welke aanvullende dekking de klant bedoelt."],
    vervolgvragen: [q("De klant vraagt naar uitbreiden en noemt geen dekking", "Over welke aanvullende dekking wil je meer weten: Pechhulp, Schade inzittenden of Rechtsbijstand?")],
    gerelateerd: ["cb-pechhulp", "alarmcentrale"],
  }),

  "sw-voordelen": b({
    uitleg: "Bij Ik kies zelf sluit je alles online af en wijzig je zelf je verzekering in je a.s.r. account. Bij schade staat de alarmcentrale 24/7 voor je klaar.",
    aandachtspunten: [
      "Snelle schadeafhandeling: meld je schade online, a.s.r. regelt de rest.",
      "Duurzaam schadeherstel: de herstellers van a.s.r. repareren je schade duurzaam als dat kan.",
      "Binnen 1 minuut bereken je je premie en sluit je direct online af.",
    ],
  }),

  "sw-adviseur": b({
    uitleg: "A.s.r. kan je geen persoonlijk advies geven over welke dekking het beste bij je past. Jij kent je eigen situatie het beste.",
    direct: ["Wil je liever advies, dan denkt een onafhankelijk adviseur met je mee en zoekt de autoverzekering die bij jouw situatie past."],
    aandachtspunten: ["Klanten kiezen meestal alleen WA bij een auto van 10 jaar of ouder, WA + Casco beperkt bij 6 tot 10 jaar en WA + Casco allrisk bij 0 tot en met 5 jaar."],
    klantinfo: ["Hoe oud de auto is."],
    vervolgvragen: [q("De klant vraagt welke dekking hij moet kiezen", "Hoe oud is je auto?")],
    gerelateerd: ["sw-vergelijken"],
  }),

  "sw-vergelijken": b({
    uitleg: "WA is verplicht en vergoedt schade aan anderen. Casco beperkt en Casco allrisk zijn extra en vergoeden ook schade aan je eigen auto.",
    aandachtspunten: [
      "WA, het meest gekozen bij auto's van 10 jaar en ouder: schade aan anderen. Niet verzekerd: brand, storm en natuur, ruitschade, diefstal, standaard 1 jaar nieuwwaarde en schade aan je eigen auto door aanrijding of vandalisme.",
      "WA + Casco beperkt, het meest gekozen bij auto's van 6 tot 10 jaar: schade aan anderen, brand, storm en natuur, ruitschade, diefstal en standaard 1 jaar nieuwwaarde. Niet verzekerd: schade aan je eigen auto door aanrijding of vandalisme.",
      "WA + Casco allrisk, het meest gekozen bij auto's van 0 tot en met 5 jaar: dat alles, inclusief schade aan je eigen auto door aanrijding of vandalisme.",
      "A.s.r. geeft geen persoonlijk advies over welke dekking bij je past.",
    ],
    vervolgvragen: [q("De klant vraagt naar het verschil en noemt geen dekkingen", "Welke dekkingen wil je met elkaar vergelijken?")],
    gerelateerd: ["wa-dekking", "cb-dekking-overzicht", "ca-dekking-overzicht"],
  }),

  "sw-documenten": b({
    brontekstSoort: "samenvatting",
    uitleg: "Wat precies verzekerd is, lees je in de voorwaarden op asr.nl. Ook de verzekeringskaart en het Europees Schadeformulier staan daar.",
    aandachtspunten: [
      "Voorwaarden: Algemene Voorwaarden D 2013-01, WA D AU WA 2017-01, Casco Beperkt D AU CB 2017-01, Casco Allrisk D AU CA 2017-01, Rechtsbijstand Motorrijtuigen D MR-RB 2015-01 en Schade Inzittenden D SI 2017-01.",
      "Met de verzekeringskaart zie je in een oogopslag de belangrijkste productinformatie en kun je vergelijken met andere verzekeraars. Die is er voor WA, Casco Beperkt, Casco Allrisk en Schade Inzittenden.",
      "Via een Afstandverklaring Schadevrije jaren kunnen partners onderling schadevrije jaren overdragen. Wie ze afstaat, kan ze in de toekomst zelf niet meer gebruiken.",
      "Verder staan er de tabel schadevrije jaren, de no-claim ladder en Wijzer in geldzaken.",
    ],
    klantinfo: ["Welk document de klant zoekt."],
    vervolgvragen: [q("De klant vraagt waar de voorwaarden staan en welk product is niet bekend", "Welke voorwaarden zoek je: WA, Casco beperkt, Casco allrisk of de Algemene voorwaarden?")],
  }),

  "sw-cb-wat-is": b({
    uitleg: "WA + Casco beperkt is WA plus. Je bent verzekerd voor schade aan anderen en voor schade aan je eigen auto door brand, storm en natuur.",
    direct: ["Je bent ook verzekerd voor diefstal, ruitschade en inbraakschade."],
    aandachtspunten: [
      "Casco beperkt is niet verplicht, maar geeft extra zekerheid als je deze schade niet helemaal zelf wilt betalen.",
      "Op asr.nl staat dat je tot 3 jaar vergoeding van de nieuw- of aankoopwaarde kunt krijgen en no-claimkorting tot 75%.",
    ],
    gerelateerd: ["sw-cb-verzekerd", "sw-nieuwwaarde-aankoopwaarde", "cb-dekking-overzicht"],
  }),

  "sw-cb-verzekerd": b({
    uitleg: "Met WA + Casco beperkt is naast schade aan anderen ook brand, storm en natuur, ruitschade, diefstal en standaard 1 jaar nieuwwaarde verzekerd.",
    direct: ["Niet verzekerd is schade aan je eigen auto door een aanrijding of vandalisme."],
    aandachtspunten: [
      "WA + Casco beperkt wordt het meest gekozen bij auto's van 6 tot 10 jaar oud.",
      "A.s.r. geeft geen persoonlijk advies. Klanten kiezen meestal Casco beperkt als de auto een lagere dagwaarde heeft, als ze schade door ruitbreuk, diefstal en brand niet zelf willen betalen en als ze meer zekerheid willen dan alleen WA.",
    ],
    klantinfo: ["Wat er met de auto is gebeurd."],
    gerelateerd: ["cb-dekking-overzicht", "sw-vergelijken"],
  }),

  "sw-ca-wat-is": b({
    uitleg: "Casco allrisk is de meest uitgebreide autoverzekering. Naast schade aan anderen vergoedt die ook schade aan je eigen auto, ook als je die zelf veroorzaakt.",
    aandachtspunten: [
      "Een voorbeeld is dat je even niet oplet en een aanrijding krijgt.",
      "Allrisk is niet verplicht, maar geeft extra zekerheid als je schade aan je eigen auto niet helemaal zelf wilt betalen.",
      "Je krijgt no-claimkorting tot 75%.",
    ],
    gerelateerd: ["ca-dekking-overzicht", "sw-ca-eigen-schuld"],
  }),

  "sw-ca-verzekerd": b({
    uitleg: "Met WA + Casco allrisk is naast alles van Casco beperkt ook schade aan je eigen auto door een aanrijding of vandalisme verzekerd.",
    aandachtspunten: [
      "Niet alles is verzekerd: de uitsluitingen in de voorwaarden gelden ook bij allrisk.",
      "WA + Casco allrisk wordt het meest gekozen bij auto's van 0 tot en met 5 jaar oud.",
      "A.s.r. geeft geen persoonlijk advies. Klanten kiezen meestal allrisk als de auto jonger is dan 6 jaar en dus een hoge dagwaarde heeft, als ze zekerheid willen bij onverwachte schade en als ze schade aan de eigen auto niet zelf willen betalen.",
    ],
    gerelateerd: ["ca-dekking-overzicht", "sw-vergelijken"],
  }),

  "sw-ca-eigen-schuld": b({
    uitleg: "Ja. Met WA + Casco allrisk is schade aan je eigen auto verzekerd, ook als je die zelf hebt veroorzaakt.",
    direct: ["Schade die je met opzet veroorzaakt is nooit verzekerd."],
    aandachtspunten: [
      "Een voorbeeld is dat je tijdens het parkeren een paaltje of een andere auto raakt.",
      "Met alleen WA of met WA + Casco beperkt is schade aan je eigen auto door een aanrijding niet verzekerd.",
    ],
    gerelateerd: ["ca-dekking-overzicht", "ca-aanrijding"],
  }),

  "sw-ruitschade": b({
    uitleg: "Ja, ruitschade is verzekerd met WA + Casco beperkt en met WA + Casco allrisk, bijvoorbeeld een sterretje door een steentje of ruitbreuk. Je zonnedak valt er ook onder.",
    direct: ["Je hoeft ruitschade niet eerst bij a.s.r. te melden. Maak direct een afspraak bij een aangesloten hersteller."],
    aandachtspunten: ["Met alleen WA is ruitschade niet verzekerd."],
    klantinfo: ["Of de ruit nog te repareren is of vervangen moet worden."],
    gerelateerd: ["cb-ruitschade", "ca-ruitschade", "sw-eigen-risico"],
  }),

  "sw-vervangend-vervoer": b({
    uitleg: "Laat je de schade repareren door een hersteller uit het netwerk van a.s.r., dan krijg je tijdens de reparatie gratis vervangend vervoer.",
    direct: ["Is je auto total loss, dan krijg je een gratis leenauto voor 5 dagen."],
    klantinfo: ["Of de auto gerepareerd kan worden of total loss is.", "Of de klant naar een hersteller uit het netwerk gaat."],
    vervolgvragen: [q("De klant vraagt naar een leenauto en het is niet bekend of de auto gerepareerd wordt", "Kan je auto gerepareerd worden, of is hij total loss?")],
    gerelateerd: ["cb-vervangend-vervoer", "cb-total-loss"],
  }),

  "sw-eigen-risico": b({
    uitleg: "Je kiest zelf of je een eigen risico wilt. Je kunt kiezen uit € 0, € 150, € 250 of € 500.",
    direct: ["Hoe hoger je eigen risico, hoe lager je premie."],
    aandachtspunten: [
      "Het eigen risico is het bedrag dat a.s.r. afhaalt van een schadevergoeding.",
      "Laat je een sterretje in je ruit herstellen, dan heb je geen eigen risico.",
      "Bij Casco allrisk kan er een extra jeugd eigen risico bijkomen.",
    ],
    klantinfo: ["Welk eigen risico op het polisblad staat."],
    gerelateerd: ["cb-eigen-risico", "ca-jeugd-eigen-risico"],
  }),

  "sw-nieuwwaarde-aankoopwaarde": b({
    uitleg: "Je kunt de nieuwwaarde of de aankoopwaarde tot 3 jaar meeverzekeren. Met WA + Casco beperkt of allrisk krijg je standaard al 1 jaar nieuwwaarde.",
    direct: [
      "Nieuwwaarderegeling: ben je de eerste eigenaar van een nieuwe auto, dan kun je de nieuwwaarde tot 3 jaar meeverzekeren.",
      "Aankoopwaarderegeling: heb je je auto tweedehands of in het buitenland gekocht, dan kun je de aankoopwaarde tot 3 jaar meeverzekeren.",
    ],
    aandachtspunten: ["Hoe de waarde precies wordt bepaald, staat in de voorwaarden."],
    klantinfo: ["Of de auto nieuw, tweedehands of in het buitenland is gekocht."],
    vervolgvragen: [q("Het is niet bekend of de klant de auto nieuw of tweedehands kocht", "Heb je de auto nieuw gekocht, of tweedehands of in het buitenland?")],
    gerelateerd: ["cb-waarde-nieuwwaarde", "cb-nieuwwaarde-keuze", "cb-aankoopwaarde-keuze"],
  }),
};
