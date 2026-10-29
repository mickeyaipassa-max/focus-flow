import type { KennisItem } from "./types";

/**
 * Algemene Voorwaarden "Ik kies zelf" van a.s.r., D 2013-01 (9 pagina's). Deze gelden bij elke dekking; de tekst staat
 * hier in de woorden van het document. Het document is geschreven voor meerdere verzekeringen (ook inboedel, woonhuis
 * en rechtsbijstand); die onderdelen zijn niet weggelaten.
 */
export const KENNISBANK_ALGEMEEN: KennisItem[] = [
  {
    id: "al-verzekeraar",
    artikelen: { algemeen: "Wie is je verzekeraar?" },
    trefwoorden: ["wie is mijn verzekeraar", "wie is de verzekeraar", "wie is je verzekeraar", "asr schadeverzekering", "kvk nummer"],
    tekst: "Je verzekeraar is ASR Schadeverzekering N.V., KVK 30031823, Utrecht.",
  },
  {
    id: "al-begin",
    artikelen: { algemeen: "1 Wanneer begint je verzekering?" },
    trefwoorden: ["wanneer begint", "ingangsdatum", "wanneer gaat mijn verzekering in", "dezelfde dag", "begin verzekering", "start verzekering", "vandaag verzekerd", "direct verzekerd", "wanneer ben ik verzekerd"],
    tekst:
      "De verzekering begint op de ingangsdatum die op je polisblad staat. Moet de verzekering ingaan op dezelfde dag dat deze bij ons wordt aangevraagd, dan begint de verzekering op het tijdstip waarop jouw aanvraag door ons wordt geaccepteerd. Let op: zolang je je eerste premie niet betaalt, ben je niet verzekerd.",
  },
  {
    id: "al-looptijd",
    artikelen: { algemeen: "2 Hoe lang is je verzekering geldig?" },
    trefwoorden: ["hoe lang is de verzekering geldig", "looptijd verzekering", "een jaar", "stilzwijgend verlengd", "verlengen", "verlenging", "contractduur", "jaarlijkse verlenging", "hoe lang loopt mijn verzekering", "verlengingsdatum"],
    tekst: "De verzekering geldt voor een jaar. Wij verlengen je verzekering telkens met een jaar. Zie ook: opzeggen en het wijzigen van premie en voorwaarden bij verlenging.",
  },
  {
    id: "al-opzeggen-jij",
    artikelen: { algemeen: "3 Opzegging door jou (3.1)" },
    trefwoorden: ["opzeggen", "opzegging", "verzekering opzeggen", "hoe zeg ik op", "zeg ik mijn verzekering op", "zeg mijn verzekering op", "opzegtermijn", "beëindigen", "beeindigen", "stopzetten", "annuleren", "verzekering stoppen", "overstappen", "eerste verzekeringsjaar", "maandelijkse beeindigingsdatum", "online opzeggen", "a.s.r. account", "asr account", "kan ik opzeggen"],
    tekst:
      "In het eerste verzekeringsjaar (tot een jaar na de ingangsdatum op je polisblad) kun je je verzekering niet beëindigen. Daarna kun je je verzekering ieder moment online opzeggen via je a.s.r. account. Wij beëindigen de verzekering dan met ingang van de eerstkomende maandelijkse beëindigingsdatum; als dag van beëindiging geldt dezelfde dag als die van de ingangsdatum. Bijvoorbeeld: bij een ingangsdatum van 06-11-2013 en een opzegdatum van 18-03-2017 wordt de beëindigingsdatum 06-04-2017. Ben je het niet eens met een wijziging van premie of voorwaarden, dan kun je ook in het eerste verzekeringsjaar online opzeggen (zie het wijzigen van premie en voorwaarden).",
  },
  {
    id: "al-opzeggen-wij",
    artikelen: { algemeen: "3 Opzegging door ons (3.2 t/m 3.4)" },
    trefwoorden: ["opzegging door a.s.r.", "opzeggen door a.s.r.", "kan a.s.r. mijn verzekering opzeggen", "verzekering geweigerd", "polis beëindigd door", "polis beeindigd door", "60 dagen", "jaarlijkse verlengingsdatum", "veel schades", "veel schade claimen", "premie niet betaald", "aanmaning", "misleiden", "niet alle informatie", "ontdekt", "beëindigen door a.s.r.", "mag a.s.r. opzeggen", "opzegging door ons"],
    tekst:
      "Wij kunnen de verzekering beëindigen als je ons bij de aanvraag niet alle of niet de juiste informatie hebt gegeven met de bedoeling ons te misleiden, of als wij de verzekering niet zouden hebben gesloten als wij de juiste informatie meteen hadden gehad (beide binnen 60 dagen nadat wij dit hebben ontdekt), als je over een gebeurtenis of schade fraude hebt gepleegd of ons opzettelijk hebt misleid, of als je de premie niet volledig betaalt, niet op tijd betaalt of weigert te betalen nadat wij je hebben aangemaand. De verzekering eindigt dan om 24.00 uur op de datum die wij je in ons bericht van opzegging noemen. Wij kunnen de verzekering ook beëindigen met ingang van de jaarlijkse verlengingsdatum (steeds een jaar na de ingangsdatum op je polisblad), met een opzegtermijn van 60 dagen. Meld je een schade, dan beoordelen wij de omstandigheden; zien wij daarvoor aanleiding, bijvoorbeeld als je veel schades claimt in een korte tijd, dan kunnen wij besluiten de verzekering te beëindigen. Dat besluiten we binnen 30 dagen na je schademelding, nadat wij je schade vergoed hebben of nadat wij je verzoek om schadevergoeding hebben afgewezen, en wij laten je weten wanneer de verzekering eindigt.",
  },
  {
    id: "al-geen-belang",
    artikelen: { algemeen: "3.5 Geen belang meer" },
    trefwoorden: ["geen belang meer", "total loss verzekering eindigt", "overlijden", "overleden", "erfgenamen", "verkoop auto verzekering eindigt", "overdracht eigendom", "wanneer eindigt mijn verzekering", "verzekering eindigt", "onder curatele", "nalatenschap"],
    tekst:
      "De verzekering eindigt direct wanneer je geen belang meer hebt bij de verzekering, bijvoorbeeld bij verkoop, diefstal of total loss van de verzekerde bezittingen (total loss is beschadiging waarbij zowel gebruik als reparatie niet meer mogelijk is); bij verkoop eindigt de verzekering direct bij de overdracht van de eigendom. Ook als een officiële instantie bepaalt dat je niet meer zelfstandig over je bezittingen kunt beschikken, en bij je overlijden. Bij overlijden blijft de verzekering van je inboedel of woonhuis nog een jaar geldig voor de erfgenamen, totdat de nalatenschap is geregeld; wij kunnen de verzekering binnen dat jaar beëindigen met een opzegtermijn van 30 dagen. De verzekering van je motorrijtuig eindigt niet; je erfgenamen moeten je overlijden zo snel mogelijk aan ons doorgeven.",
  },
  {
    id: "al-uitwonend-buitenland",
    artikelen: { algemeen: "3.6 en 3.7 Uitwonend of naar het buitenland" },
    trefwoorden: ["uitwonend", "uitwonende", "uit huis", "student", "stage", "dagonderwijs", "meeverzekerd kind", "bevolkingsregister", "verhuizen naar het buitenland", "buitenlands kenteken", "in het buitenland wonen", "buitenland gestald", "naar het buitenland gaan wonen"],
    tekst:
      "De verzekering eindigt op de jaarlijkse verlengingsdatum als je als (mede)verzekerde uitwonend wordt of in het buitenland gaat wonen, behalve als je een meeverzekerd kind bent, uitwonend wordt vanwege een stage of het volgen van dagonderwijs en in het Nederlandse bevolkingsregister ingeschreven blijft; dan blijft de verzekering geldig. Gaat de verzekeringnemer (degene met wie wij de verzekeringsovereenkomst zijn aangegaan) in het buitenland wonen, dan eindigt de verzekering direct voor alle verzekerden; bij verhuizing naar een land binnen de Europese Unie eindigt de verzekering van je motorrijtuig uiterlijk op de eerstvolgende jaarlijkse verlengingsdatum. De verzekering van je motorrijtuig eindigt direct zodra je motorrijtuig een buitenlands kenteken gaat voeren en op het moment dat je motorrijtuig meer dan de helft van het jaar in het buitenland is gestald.",
  },
  {
    id: "al-premie-betalen",
    artikelen: { algemeen: "4 Wanneer moet je de premie betalen? (4.1 en 4.2)" },
    trefwoorden: ["premie betalen", "wanneer betalen", "wanneer moet ik betalen", "wanneer moet ik de premie betalen", "moet ik betalen", "premie per maand", "maandelijks betalen", "vooruit betalen", "premie niet betaald", "betaling vergeten", "niet meer verzekerd", "eerste premie", "aanmaning", "14 dagen betalen", "cis", "stichting cis", "dekking weer ingaan", "premie te laat", "niet op tijd betaald", "achterstand"],
    tekst:
      "Je moet de premie per maand vooruit betalen. Hebben wij de verschuldigde premie niet tijdig of niet volledig ontvangen, dan manen wij je aan. Betaal je de premie niet binnen de termijn van 14 dagen die wij in de aanmaning noemen, dan ben je niet meer verzekerd vanaf de dag dat je de premie verschuldigd was; je blijft wel verplicht de premie alsnog te betalen. De dekking gaat weer in 1 dag nadat wij je betaling hebben ontvangen en geaccepteerd. Let op: zolang je je eerste premie niet betaalt, ben je niet verzekerd. Wij kunnen je gegevens vastleggen bij de Stichting Centraal Informatie Systeem van in Nederland werkzame verzekeringsmaatschappijen (CIS); meer informatie en het privacyreglement vind je op www.stichtingcis.nl.",
  },
  {
    id: "al-storneren",
    artikelen: { algemeen: "4.3 Premie terugstorten" },
    trefwoorden: ["storneren", "terugboeken", "terugstorten", "afschrijving terugboeken", "incasso terugboeken", "afschrijving laten terugstorten", "bank terugstorten", "automatische incasso terug"],
    tekst:
      "In bepaalde situaties kun je de premie die automatisch van je bankrekening is afgeschreven door je bank laten terugstorten. Dit noemen we ook wel storneren of terugboeken. Heb je van ons een schadevergoeding gehad en boek je je premie daarna terug, dan voldoe je niet aan je betalingsverplichting en kunnen wij de schadevergoeding van je terugeisen.",
  },
  {
    id: "al-premie-kosten",
    artikelen: { algemeen: "4.4 en 4.5 Extra kosten en verrekening" },
    trefwoorden: ["herinneringskosten", "incassokosten", "incassobureau", "extra kosten premie", "verrekenen", "verrekening", "premie aftrekken", "kosten niet op tijd betalen", "aftrekken van schadevergoeding"],
    tekst:
      "Betaal je de premie niet op tijd, dan betaal je extra kosten zoals herinneringskosten of kosten voor het incassobureau dat wij inschakelen. Moet je nog premie of kosten aan ons betalen en moeten wij een schade aan je betalen, dan kunnen wij de premie of kosten van dit bedrag aftrekken.",
  },
  {
    id: "al-premie-wijzigen",
    artikelen: { algemeen: "5 Wanneer veranderen je premie en verzekeringsvoorwaarden? (5.1 en 5.2)" },
    trefwoorden: ["premie verhoging", "premieverhoging", "premie omhoog", "premie hoger", "premie stijgt", "premie duurder", "waarom is mijn premie hoger", "premie verandert", "premie veranderen", "voorwaarden wijzigen", "voorwaarden veranderen", "wijziging premie", "wijziging voorwaarden", "waarom wordt mijn premie duurder", "premie aanpassen", "tussentijds wijzigen", "wetgeving verplicht", "jaarlijks premie"],
    tekst:
      "Wij kunnen jaarlijks de premie en de voorwaarden van je verzekering veranderen, en ook de algemene voorwaarden. Die aanpassing gaat in op de jaarlijkse verlengingsdatum van je polis. Als de premie of voorwaarden veranderen, ontvang je van ons informatie over de wijziging. In bijzondere gevallen, bijvoorbeeld omdat wetgeving ons daartoe verplicht, kan het noodzakelijk zijn om tussentijds de premie en/of voorwaarden te veranderen. Wij kunnen dat dan voor een of meerdere soorten verzekeringen voor al onze verzekerden tegelijk doen en houden de verandering zo beperkt mogelijk. Ook dan ontvang je informatie over de wijziging.",
  },
  {
    id: "al-aanpassing-na-schade",
    artikelen: { algemeen: "5.3 Aanpassing na een schademelding" },
    trefwoorden: ["premie na schade", "premie omhoog na schade", "schade claim premie", "schade claimen premie", "gevolgen schade claimen", "eigen risico na schade", "eigen risico verhogen", "aanvullende voorwaarden", "veel schades premie", "na een schademelding", "verzekering aanpassen na schade"],
    tekst:
      "Meld je een schade, dan beoordelen wij de omstandigheden waarin de schade ontstond. Zien wij daarvoor aanleiding, bijvoorbeeld als je veel schades claimt in een korte tijd, dan kunnen wij besluiten de verzekering aan te passen, bijvoorbeeld door de premie te verhogen, een eigen risico toe te passen, het bestaande eigen risico te verhogen of aanvullende voorwaarden te stellen. Dat besluiten we binnen 30 dagen na je schademelding, nadat wij je schade vergoed hebben of nadat wij je verzoek om schadevergoeding hebben afgewezen. Wij laten je weten wanneer de wijziging ingaat.",
  },
  {
    id: "al-niet-eens-wijziging",
    artikelen: { algemeen: "5.4 Niet eens met een wijziging" },
    trefwoorden: ["niet eens met wijziging", "niet eens met de premie", "niet akkoord met wijziging", "bezwaar tegen wijziging", "opzeggen bij wijziging", "wijziging niet accepteren", "geen bericht ontvangen wijziging"],
    tekst:
      "Ben je het niet eens met een wijziging van premie of voorwaarden, dan kun je de verzekering online opzeggen via je a.s.r. account, ook in het eerste verzekeringsjaar. Wij beëindigen de verzekering dan met ingang van de datum waarop de verandering van de premie en/of voorwaarden zou ingaan. Ontvangen wij geen bericht van je, dan gelden de veranderingen voor jou.",
  },
  {
    id: "al-verklaringen",
    artikelen: { algemeen: "6 Wat verklaar je bij het afsluiten van je verzekering? (6.1)" },
    trefwoorden: ["wat verklaar ik", "verklaring bij afsluiten", "verklaringen afsluiten", "acceptatievoorwaarden", "acceptatie", "wat moet ik opgeven", "informatie klopt niet", "14 dagen na ontvangst polisblad", "juiste informatie", "onjuiste informatie", "niet alle informatie"],
    tekst:
      "De verzekering is gesloten op de voorwaarden die gelden voor jou en de andere verzekerden op deze verzekering. Klopt de informatie uit artikel 6.2 t/m 6.8 niet, of niet helemaal, op het moment dat je een verzekering bij ons aanvraagt en heb je dit bij die aanvraag niet gemeld, dan moet je ons dat binnen 14 dagen na ontvangst van je polisblad alsnog laten weten. Ontdekken wij achteraf dat jouw informatie niet klopt, dan kan dat betekenen dat je geen recht hebt op schadevergoeding, en wij hebben het recht de verzekering te beëindigen als je ons met opzet hebt misleid of als wij de verzekering niet zouden hebben gesloten als wij de juiste informatie meteen hadden gehad.",
  },
  {
    id: "al-verklaring-geweigerd",
    artikelen: { algemeen: "6.2 Eerder opgezegd of geweigerd" },
    trefwoorden: ["eerder opgezegd", "verzekering geweigerd", "geweigerd door verzekeraar", "opgezegd door verzekeraar", "laatste 8 jaar", "8 jaar", "acht jaar geweigerd", "eerdere weigering"],
    tekst:
      "Je verklaart dat in de laatste 8 jaar voor het sluiten van deze verzekering wij of een andere verzekeraar niet een verzekering van jou hebben opgezegd, en dat wij of een andere verzekeraar niet hebben geweigerd om een verzekering met jou af te sluiten of een verzekering van jou te wijzigen.",
  },
  {
    id: "al-verklaring-strafrecht",
    artikelen: { algemeen: "6.3 en 6.4 Politie, justitie en verzekeringsfraude" },
    trefwoorden: ["politie en justitie", "verdachte", "strafrechtelijk verleden", "justitie", "strafmaatregel", "veroordeeld", "diefstal verleden", "opiumwet", "wapens en munitie", "rijden onder invloed", "50 km/uur", "snelheidsoverschrijding", "doorrijden na aanrijding", "verkeersmisdrijf", "verzekeringsfraude verleden", "misleiding financiële instelling", "antecedenten", "strafblad"],
    tekst:
      "Je verklaart dat je in de laatste 8 jaar voor het sluiten van deze verzekering niet in aanraking bent geweest met politie of justitie als verdachte of voor het uitvoeren van een opgelegde strafmaatregel voor: diefstal, verduistering, bedrog, oplichting, valsheid in geschrifte of pogingen daartoe; het benadelen van anderen, zoals vernieling of beschadiging, mishandeling, afpersing en bedreiging of een misdrijf gericht tegen de persoonlijke vrijheid of tegen het leven of pogingen daartoe; het overtreden van de Wet wapens en munitie, de Opiumwet of de Wet economische delicten; of een verkeersmisdrijf, zoals rijden onder invloed, snelheidsoverschrijding van meer dan 50 km/uur of doorrijden na een aanrijding. Ook verklaar je dat je in de laatste 8 jaar niet betrokken bent geweest bij verzekeringsfraude of bij opzettelijke misleiding van een financiële instelling.",
  },
  {
    id: "al-verklaring-financieel",
    artikelen: { algemeen: "6.5 en 6.6 Faillissement, schuldsanering en beslag" },
    trefwoorden: ["failliet", "faillissement", "schuldsanering", "wsnp", "deurwaarder", "beslag", "beslag gelegd", "schulden", "laatste 5 jaar", "5 jaar failliet", "beslag op inkomsten"],
    tekst:
      "Je verklaart dat je in de laatste 5 jaar voor het sluiten van deze verzekering niet failliet bent verklaard of door de rechter in een schuldsanering bent betrokken, en dat op het moment van sluiten van deze verzekering een deurwaarder geen beslag heeft gelegd op jouw spullen of jouw inkomsten.",
  },
  {
    id: "al-verklaring-rijverbod",
    artikelen: { algemeen: "6.7 Rijverbod bij een motorrijtuig" },
    trefwoorden: ["rijverbod", "rijontzegging", "door de rechter verboden te rijden", "voorwaardelijk rijverbod", "mag niet rijden", "ontzegging", "rijbevoegdheid ontzegd", "regelmatige bestuurder rijverbod"],
    tekst:
      "Heb je een verzekering voor een motorrijtuig, dan verklaar je dat jij, de regelmatige bestuurder en de houder van het kentekenbewijs in de laatste 8 jaar voor het sluiten van deze verzekering door de rechter niet is verboden te rijden, wel of niet voorwaardelijk.",
  },
  {
    id: "al-verklaring-rechtsbijstand",
    artikelen: { algemeen: "6.8 Rechtsbijstand" },
    trefwoorden: ["rechtsbijstand verzekering", "geschil gehad", "juridische bijstand", "juridisch geschil", "feiten of omstandigheden", "bekend geschil", "al een conflict"],
    tekst:
      "Heb je een verzekering voor rechtsbijstand, dan verklaar je dat je in de laatste 5 jaar voor het sluiten van deze verzekering geen geschil hebt gehad waarbij juridische bijstand nodig was, en dat er geen feiten of omstandigheden bekend zijn die nu al aanleiding kunnen geven om een beroep op deze verzekering voor rechtsbijstand te gaan doen.",
  },
  {
    id: "al-fraude",
    artikelen: { algemeen: "7 Wat doen wij bij fraude? (7.1 en 7.2)" },
    trefwoorden: ["wat doen jullie bij fraude", "wat is fraude", "fraudebestrijding", "meer claimen", "aankoopnota veranderen", "afgewezen schade nogmaals", "incidentenregister", "terugvorderen", "aangifte fraude", "fraude gevolgen", "wat gebeurt er bij fraude", "frauderen", "protocol incidentenwaarschuwingssystemen", "registers verzekeraars"],
    tekst:
      "Onder fraude verstaan wij: niet eerlijk vertellen wat er is gebeurd, bedragen op de aankoopnota's veranderen, meer claimen dan de geleden schade en een afgewezen schade nogmaals opgeven. Via je premie betaal je mee aan het fraude-gedrag van anderen, daarom doet a.s.r. aan fraudebestrijding. Bij fraude doen wij aangifte bij de politie; wij vergoeden de schade niet en reeds uitgekeerde schadevergoedingen worden teruggevorderd; wij beëindigen de lopende verzekeringen en de klant die fraude heeft gepleegd kan bij ons geen andere verzekeringen meer afsluiten; en wij plaatsen de gegevens van de klant in een of meer registers die ook voor andere verzekeraars toegankelijk zijn en in ons incidentenregister, volgens het Protocol Incidentenwaarschuwingssystemen Financiële Instellingen (volledige tekst op www.verzekeraars.nl). Meer informatie vind je op www.asr.nl.",
  },
  {
    id: "al-fraude-andere-verzekeringen",
    artikelen: { algemeen: "7.3 en 7.4 Fraude en je andere verzekeringen" },
    trefwoorden: ["andere verzekeringen beëindigen", "andere verzekeringen beeindigen", "andere ondernemingen van a.s.r.", "asrnederland", "fraude andere verzekering", "alle verzekeringen opzeggen fraude"],
    tekst:
      "Heb je fraude gepleegd, dan hebben wij het recht om ook andere schadeverzekeringen die je bij ons hebt direct te beëindigen, ook als je bij die verzekering niet hebt gefraudeerd. Ook andere ondernemingen van a.s.r. hebben dan het recht een verzekering van jou direct te beëindigen, ook als het gaat om een verzekering waarbij je niet hebt gefraudeerd. De andere ondernemingen van a.s.r. vind je op www.asrnederland.nl.",
  },
  {
    id: "al-persoonsgegevens",
    artikelen: { algemeen: "8 Wat doen wij met jouw persoonsgegevens? (8, 8.1 t/m 8.3)" },
    trefwoorden: ["persoonsgegevens", "privacy", "mijn gegevens", "gegevens inzien", "gegevens aanpassen", "gedragscode verwerking persoonsgegevens", "verbond van verzekeraars", "cis", "centraal informatie systeem", "dienstverlening door derden", "expertisebureau", "herverzekeraar", "gegevens gebruiken", "waarvoor gebruiken jullie mijn gegevens", "avg"],
    tekst:
      "Bij de aanvraag of wijziging van een verzekering of financiële dienst vragen wij om persoonsgegevens en andere gegevens. Die gebruiken wij om met jou een contract te kunnen sluiten en te onderhouden, om fraude te bestrijden en om je op de hoogte te houden van onze producten en diensten. Je kunt je persoonsgegevens die wij geregistreerd hebben inzien en online via je a.s.r. account aanpassen. Op de verwerking is de 'Gedragscode Verwerking Persoonsgegevens Financiële Instellingen' van toepassing (volledige tekst op www.verzekeraars.nl of bij het Verbond van Verzekeraars, Postbus 93450, 2509 AL Den Haag, telefoon 070 - 3338500). Wij kunnen je schade- en verzekeringsgegevens raadplegen en vastleggen bij de Stichting Centraal Informatie Systeem (CIS), Postbus 124, 3700 AC Zeist, telefoon 030 - 6935668, om risico's te beheersen en fraude tegen te gaan; meer informatie op www.stichtingcis.nl. Wij schakelen soms andere bedrijven in, zoals een incassobureau, expertisebureaus of herverzekeraars; wij blijven verantwoordelijk voor de verwerking van je gegevens en maken contractuele afspraken zodat je privacy gewaarborgd blijft.",
  },
  {
    id: "al-telefoongesprekken",
    artikelen: { algemeen: "8.4 Opname van telefoongesprekken" },
    trefwoorden: ["telefoongesprekken", "gesprek opnemen", "opgenomen", "opname gesprek", "gesprek beluisteren", "transcriptie", "wordt mijn gesprek opgenomen", "telefoon opnemen"],
    tekst:
      "Wij kunnen telefoongesprekken opnemen voor trainings- en coachingsdoeleinden, ter verificatie van en onderzoek naar opdrachten en transacties, voor fraudebestrijding en integriteitsbewaking binnen financiële instellingen en om te kunnen voldoen aan wettelijke verplichtingen. De opgenomen gesprekken worden niet langer bewaard dan noodzakelijk is voor deze doeleinden. Bij een geschil over de inhoud van opgenomen telefoongesprekken heb jij het recht het gesprek te beluisteren of er een transcriptie van te ontvangen.",
  },
  {
    id: "al-recht",
    artikelen: { algemeen: "9 Welk recht geldt voor deze overeenkomst?" },
    trefwoorden: ["welk recht", "nederlands recht", "toepasselijk recht", "rechtsstelsel"],
    tekst: "Op deze verzekeringsovereenkomst is het Nederlands recht van toepassing.",
  },
  {
    id: "al-sancties",
    artikelen: { algemeen: "10 Wat doen wij bij sanctiemaatregelen van de overheid?" },
    trefwoorden: ["sancties", "sanctiemaatregelen", "sanctiewet", "bevroren tegoeden", "handelsbeperkingen", "oorlog sancties", "sanctieregelgeving", "internationale sancties"],
    tekst:
      "Een land dat de mensenrechten schendt, oorlog voert of een gevaar vormt voor de internationale vrede en veiligheid kan door de overheid worden gestraft met sancties. Vaak bestaan sancties tegen een land ook uit maatregelen tegen bepaalde personen en/of bedrijven in dat land, bijvoorbeeld het bevriezen van buitenlandse tegoeden of andere (financiële) handelsbeperkingen. Dit kan betekenen dat verzekeraars ook geen dekking mogen verlenen of schade mogen vergoeden als dat in strijd is met deze sanctiewet- en regelgeving. Meer informatie vind je op www.rijksoverheid.nl.",
  },
  {
    id: "al-klacht",
    artikelen: { algemeen: "11 Wat kun je doen als je een klacht hebt?" },
    trefwoorden: ["klacht", "klachten", "klacht indienen", "ik wil klagen", "klachtenformulier", "kifid", "klachteninstituut", "ontevreden", "niet tevreden", "klacht niet goed afgehandeld", "binnen 3 maanden klacht", "rechter", "geschil"],
    tekst:
      "Heb je klachten over dit product of deze verzekering, of over onze dienstverlening, neem dan contact met ons op; dan zoeken wij naar een passende oplossing. Biedt het overleg geen oplossing, dan kun je online een klacht indienen via het klachtenformulier op www.asr.nl. Vind je dat je klacht niet goed is afgehandeld, dan kun je die voorleggen aan de Stichting Klachteninstituut Financiële Dienstverlening (KiFiD, www.kifid.nl), binnen 3 maanden nadat je een definitieve reactie van ons op je klacht hebt gekregen. Wil je van deze mogelijkheden geen gebruik maken, dan kun je het geschil voorleggen aan de bevoegde rechter.",
  },
];
