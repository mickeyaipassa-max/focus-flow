import type { Verrijking } from "./types";

/**
 * Document 1 van de uitrol: de klantvriendelijke laag voor de Algemene Voorwaarden "Ik kies zelf" van a.s.r. (D 2013-01).
 * Zelfde werkwijze als bij de proefartikelen (zie proefartikelen.ts): de brontekst en bronverwijzing van elk blok blijven
 * ongewijzigd, elke uitleg en elk punt is naast de brontekst gelegd en waar een blok juridisch gevoelig is staat het op
 * "handmatig-controleren". Het blok `al-opzeggen-jij` staat bij de proefartikelen.
 *
 * Let op: de Algemene voorwaarden gelden voor meerdere verzekeringen (ook inboedel, woonhuis en rechtsbijstand). De
 * chat gebruikt ze alleen voor de autoverzekering; waar een onderdeel daarvoor niet geldt, staat dat in de opmerking.
 */
export const VERRIJKING_ALGEMEEN: Record<string, Verrijking> = {
  "al-verzekeraar": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Je verzekeraar is ASR Schadeverzekering N.V. in Utrecht.",
    direct: [],
    aandachtspunten: ["Het KVK-nummer is 30031823."],
    klantinfo: [],
    vervolgvragen: [],
    controle: { status: "gecontroleerd" },
  },

  "al-begin": {
    brontekstSoort: "samenvatting",
    uitleg: "Je verzekering begint op de ingangsdatum op je polisblad. Moet hij dezelfde dag ingaan als je aanvraag, dan begint hij zodra a.s.r. je aanvraag accepteert. Betaal je je eerste premie niet, dan ben je niet verzekerd.",
    direct: ["Zolang je je eerste premie niet betaalt, ben je niet verzekerd."],
    aandachtspunten: ["De ingangsdatum staat op je polisblad.", "Moet de verzekering dezelfde dag ingaan als je aanvraag, dan begint hij op het moment dat a.s.r. je aanvraag accepteert."],
    klantinfo: ["Of de klant vandaag al verzekerd wil zijn.", "Of de eerste premie al is betaald."],
    vervolgvragen: [{ als: "De klant vraagt of hij al verzekerd is en het is niet bekend of de eerste premie is betaald", vraag: "Heb je je eerste premie al betaald?" }],
    gerelateerd: ["al-premie-betalen"],
    controle: { status: "gecontroleerd", opmerking: "De zin over de eerste premie staat in 4.2 en is hier erbij gezet." },
  },

  "al-looptijd": {
    brontekstSoort: "samenvatting",
    uitleg: "Je verzekering loopt een jaar. Daarna verlengt a.s.r. hem steeds met een jaar.",
    direct: [],
    aandachtspunten: ["Bij de jaarlijkse verlenging kunnen premie en voorwaarden veranderen.", "Opzeggen kan pas na het eerste verzekeringsjaar."],
    klantinfo: [],
    vervolgvragen: [],
    gerelateerd: ["al-opzeggen-jij", "al-premie-wijzigen"],
    controle: { status: "gecontroleerd", opmerking: "De verwijzing naar opzeggen en wijzigen komt van de kennisbankmaker; de voorwaarden zeggen alleen dat de verzekering een jaar geldt en telkens met een jaar wordt verlengd." },
  },

  "al-opzeggen-wij": {
    brontekstSoort: "samenvatting",
    uitleg: "A.s.r. kan je verzekering in een paar situaties stoppen, bijvoorbeeld bij fraude, bij onjuiste informatie bij je aanvraag of als je na een aanmaning de premie niet betaalt. Ook kan a.s.r. elk jaar op de verlengingsdatum opzeggen, met 60 dagen opzegtermijn.",
    direct: [
      "Opzeggen op de verlengingsdatum doet a.s.r. met een opzegtermijn van 60 dagen.",
      "Bij onjuiste informatie bij je aanvraag kan a.s.r. de verzekering beëindigen binnen 60 dagen nadat a.s.r. dat heeft ontdekt.",
      "Na een schademelding besluit a.s.r. binnen 30 dagen of de verzekering wordt beëindigd.",
    ],
    aandachtspunten: [
      "Redenen: je gaf bij de aanvraag niet alle of niet de juiste informatie met de bedoeling te misleiden, of a.s.r. had de verzekering anders niet gesloten; fraude of opzettelijk misleiden over een gebeurtenis of schade; of de premie niet (op tijd) betalen nadat a.s.r. je heeft aangemaand.",
      "Na een schademelding kijkt a.s.r. naar de omstandigheden, bijvoorbeeld als je veel schades in korte tijd claimt.",
      "De verzekering eindigt om 24.00 uur op de datum in het bericht van opzegging.",
    ],
    klantinfo: ["Waarom de klant denkt dat a.s.r. opzegt (premie, schade, informatie)."],
    vervolgvragen: [{ als: "De klant zegt dat a.s.r. heeft opgezegd maar de reden is niet bekend", vraag: "Welke reden staat er in het bericht van a.s.r.?" }],
    gerelateerd: ["al-premie-betalen", "al-klacht"],
    controle: { status: "gecontroleerd" },
  },

  "al-geen-belang": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Je verzekering stopt direct als je geen belang meer hebt bij wat verzekerd is, bijvoorbeeld als je de auto verkoopt, hij gestolen wordt of total loss is. Bij verkoop stopt hij zodra de eigendom wordt overgedragen.",
    direct: ["Bij verkoop stopt de verzekering direct bij de overdracht van de eigendom."],
    aandachtspunten: [
      "Ook bij diefstal of total loss. Total loss betekent dat gebruik en reparatie niet meer mogelijk zijn.",
      "Ook als een officiële instantie bepaalt dat je niet meer zelfstandig over je bezittingen mag beslissen, en bij je overlijden.",
      "Overlijd je, dan stopt de verzekering van je auto niet; je erfgenamen moeten je overlijden zo snel mogelijk aan a.s.r. doorgeven.",
      "Een inboedel- of woonhuisverzekering blijft bij overlijden nog een jaar geldig voor de erfgenamen.",
    ],
    klantinfo: ["Wat er met de auto is gebeurd: verkocht, gestolen of total loss."],
    vervolgvragen: [{ als: "Het is niet duidelijk waarom de klant geen belang meer heeft", vraag: "Heb je de auto verkocht, is hij gestolen of is hij total loss?" }],
    gerelateerd: ["auto-verkopen"],
    controle: { status: "gecontroleerd" },
  },

  "al-uitwonend-buitenland": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Ga je als meeverzekerde uitwonen of in het buitenland wonen, dan stopt je verzekering op de eerstvolgende verlengingsdatum. Gaat de verzekeringnemer in het buitenland wonen, dan stopt de verzekering direct voor iedereen. Krijgt je auto een buitenlands kenteken, dan stopt de autoverzekering direct.",
    direct: [
      "Een buitenlands kenteken: de autoverzekering stopt direct.",
      "De verzekeringnemer gaat in het buitenland wonen: de verzekering stopt direct voor alle verzekerden. Verhuis je naar een land in de Europese Unie, dan stopt de autoverzekering uiterlijk op de eerstvolgende verlengingsdatum.",
    ],
    aandachtspunten: [
      "Een meeverzekerd kind dat uitwonend wordt voor een stage of dagonderwijs en ingeschreven blijft in het Nederlandse bevolkingsregister, blijft verzekerd.",
      "Staat je auto meer dan de helft van het jaar in het buitenland gestald, dan stopt de autoverzekering op dat moment.",
    ],
    klantinfo: ["Wie er gaat verhuizen: de verzekeringnemer of een meeverzekerde.", "Naar welk land."],
    vervolgvragen: [{ als: "Het is niet duidelijk wie er gaat verhuizen", vraag: "Wie gaat er verhuizen: jij als verzekeringnemer, of iemand die meeverzekerd is?" }],
    gerelateerd: ["cb-buitenland-verhuizen"],
    controle: { status: "gecontroleerd", opmerking: "De voorwaarden van Casco Beperkt en Allrisk (8.8) zeggen dat bij stalling in een EU-land de verzekering uiterlijk op de verlengingsdatum stopt; dat staat in het gerelateerde blok." },
  },

  "al-premie-betalen": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Je betaalt je premie per maand vooruit. Betaal je niet op tijd, dan krijg je een aanmaning. Betaal je dan niet binnen 14 dagen, dan ben je niet meer verzekerd.",
    direct: [
      "Betaal je niet binnen 14 dagen na de aanmaning, dan ben je niet meer verzekerd vanaf de dag dat je de premie moest betalen. Je moet de premie wel nog betalen.",
      "De dekking gaat weer in 1 dag nadat a.s.r. je betaling heeft ontvangen en geaccepteerd.",
      "Zolang je je eerste premie niet betaalt, ben je niet verzekerd.",
    ],
    aandachtspunten: ["A.s.r. kan je gegevens vastleggen bij Stichting CIS (www.stichtingcis.nl).", "Betaal je te laat, dan kun je extra kosten krijgen, zoals herinneringskosten of incassokosten."],
    klantinfo: ["Of de klant een aanmaning heeft gekregen.", "Of het de eerste premie is of een latere."],
    vervolgvragen: [{ als: "De klant zegt dat hij niet heeft betaald", vraag: "Heb je al een aanmaning van a.s.r. gekregen?" }],
    gerelateerd: ["al-premie-kosten"],
    controle: { status: "gecontroleerd" },
  },

  "al-storneren": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Een automatische afschrijving kun je in bepaalde situaties door je bank laten terugboeken. Heb je al een schadevergoeding van a.s.r. gekregen en boek je je premie daarna terug? Dan voldoe je niet aan je betalingsverplichting en kan a.s.r. de schadevergoeding terugeisen.",
    direct: ["Boek je je premie terug nadat je een schadevergoeding hebt gekregen, dan kan a.s.r. die schadevergoeding terugeisen."],
    aandachtspunten: ["Terugboeken heet ook wel storneren."],
    klantinfo: ["Of de klant al een schadevergoeding van a.s.r. heeft gekregen."],
    vervolgvragen: [{ als: "De klant wil een afschrijving terugboeken en het is niet bekend of er schade is vergoed", vraag: "Heb je van a.s.r. al een schadevergoeding gekregen?" }],
    gerelateerd: ["al-premie-betalen"],
    controle: { status: "gecontroleerd" },
  },

  "al-premie-kosten": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Betaal je je premie te laat, dan kun je extra kosten krijgen, zoals herinneringskosten of de kosten van een incassobureau. Moet a.s.r. je een schade vergoeden en heb je nog premie of kosten open staan? Dan mag a.s.r. dat van het bedrag aftrekken.",
    direct: [],
    aandachtspunten: ["Voorbeelden van extra kosten: herinneringskosten en kosten voor het incassobureau dat a.s.r. inschakelt."],
    klantinfo: ["Of de klant een betalingsachterstand heeft."],
    vervolgvragen: [],
    gerelateerd: ["al-premie-betalen"],
    controle: { status: "gecontroleerd" },
  },

  "al-premie-wijzigen": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "A.s.r. kan elk jaar de premie en de voorwaarden veranderen. Dat gaat in op de verlengingsdatum van je polis en je krijgt er bericht over. In bijzondere gevallen, bijvoorbeeld door nieuwe wetgeving, kan het ook tussentijds.",
    direct: ["Een wijziging gaat in op de jaarlijkse verlengingsdatum van je polis. Je krijgt informatie over de wijziging."],
    aandachtspunten: [
      "Tussentijds kan alleen in bijzondere gevallen, bijvoorbeeld omdat wetgeving dat verplicht.",
      "A.s.r. kan dat voor een of meer soorten verzekeringen voor alle verzekerden tegelijk doen en houdt de verandering zo beperkt mogelijk.",
      "Ook de algemene voorwaarden kunnen zo veranderen.",
    ],
    klantinfo: ["Wanneer de wijziging is aangekondigd of ingaat."],
    vervolgvragen: [{ als: "De klant klaagt over een hogere premie zonder meer informatie", vraag: "Heb je een bericht over de wijziging gekregen, en wanneer gaat die in?" }],
    gerelateerd: ["al-niet-eens-wijziging", "al-aanpassing-na-schade"],
    controle: { status: "gecontroleerd" },
  },

  "al-aanpassing-na-schade": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Meld je een schade? Dan kijkt a.s.r. naar de omstandigheden. Zijn er bijvoorbeeld veel schades in korte tijd, dan kan a.s.r. je verzekering aanpassen, bijvoorbeeld met een hogere premie of een eigen risico.",
    direct: ["A.s.r. besluit binnen 30 dagen na je schademelding, nadat de schade is vergoed of nadat je verzoek is afgewezen. A.s.r. laat je weten wanneer de wijziging ingaat."],
    aandachtspunten: ["Aanpassen kan door de premie te verhogen, een eigen risico toe te passen, een bestaand eigen risico te verhogen of aanvullende voorwaarden te stellen."],
    klantinfo: ["Hoeveel schades de klant in korte tijd heeft gemeld."],
    vervolgvragen: [],
    gerelateerd: ["al-niet-eens-wijziging"],
    controle: { status: "gecontroleerd" },
  },

  "al-niet-eens-wijziging": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Ben je het niet eens met een wijziging van je premie of voorwaarden? Dan kun je online opzeggen via je a.s.r. account, ook in het eerste verzekeringsjaar.",
    direct: ["Zeg je op, dan stopt de verzekering op de datum waarop de wijziging zou ingaan.", "Hoort a.s.r. niets van je, dan gelden de veranderingen voor jou."],
    aandachtspunten: [],
    klantinfo: ["Over welke wijziging het gaat: premie of voorwaarden."],
    vervolgvragen: [{ als: "De klant is boos over een wijziging maar zegt niet of hij wil opzeggen", vraag: "Wil je opzeggen, of wil je eerst weten wat er is veranderd?" }],
    gerelateerd: ["al-opzeggen-jij"],
    controle: { status: "gecontroleerd" },
  },

  "al-verklaringen": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Als je een verzekering aanvraagt, verklaar je dat een aantal dingen klopt, bijvoorbeeld dat je de afgelopen jaren niet bent geweigerd of failliet bent gegaan. Klopt iets niet, laat dat dan binnen 14 dagen weten nadat je je polisblad hebt gekregen.",
    direct: ["Klopt een van de verklaringen niet en heb je dat niet gemeld? Meld het a.s.r. dan binnen 14 dagen na ontvangst van je polisblad."],
    aandachtspunten: [
      "Blijkt later dat je informatie niet klopt, dan kan dat betekenen dat je geen recht hebt op schadevergoeding.",
      "A.s.r. mag de verzekering beëindigen als je met opzet hebt misleid, of als a.s.r. de verzekering niet had gesloten als het de juiste informatie meteen had gehad.",
      "Voor een eigen situatie verwijs je naar de klantenservice van a.s.r.",
    ],
    klantinfo: ["Welke verklaring niet klopt."],
    vervolgvragen: [{ als: "De klant zegt dat iets niet klopt bij zijn aanvraag", vraag: "Om welk onderwerp gaat het, bijvoorbeeld een eerdere weigering, een strafzaak of een faillissement?" }],
    gerelateerd: ["al-verklaring-geweigerd", "al-verklaring-strafrecht"],
    controle: { status: "handmatig-controleren", opmerking: "Juridisch zwaar: 'kan betekenen dat je geen recht hebt op schadevergoeding'. De chat mag dit niet zekerder maken dan de voorwaarden doen en geeft geen oordeel over een eigen situatie." },
  },

  "al-verklaring-geweigerd": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Je verklaart dat in de laatste 8 jaar geen verzekeraar een verzekering van je heeft opgezegd. Ook heeft niemand geweigerd een verzekering met je af te sluiten of te wijzigen.",
    direct: ["Het gaat om de laatste 8 jaar voor het sluiten van de verzekering."],
    aandachtspunten: ["Dit geldt voor a.s.r. én voor andere verzekeraars."],
    klantinfo: ["Of er in de laatste 8 jaar een verzekering van de klant is opgezegd of geweigerd."],
    vervolgvragen: [{ als: "De klant noemt een eerdere opzegging of weigering", vraag: "Wanneer was dat, en was het in de laatste 8 jaar?" }],
    gerelateerd: ["al-verklaringen"],
    controle: { status: "gecontroleerd" },
  },

  "al-verklaring-strafrecht": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Je verklaart dat je in de laatste 8 jaar niet met politie of justitie te maken hebt gehad, als verdachte of voor een opgelegde straf. Het gaat om feiten zoals diefstal, oplichting, geweld of een zwaar verkeersdelict. Ook verklaar je dat je niet betrokken was bij verzekeringsfraude.",
    direct: ["Het gaat om de laatste 8 jaar voor het sluiten van de verzekering."],
    aandachtspunten: [
      "Genoemd worden: diefstal, verduistering, bedrog, oplichting en valsheid in geschrifte; vernieling of beschadiging, mishandeling, afpersing, bedreiging en misdrijven tegen de persoonlijke vrijheid of het leven; overtreding van de Wet wapens en munitie, de Opiumwet of de Wet economische delicten; en een verkeersmisdrijf zoals rijden onder invloed, meer dan 50 km/uur te hard rijden of doorrijden na een aanrijding.",
      "Bij de eerste twee groepen tellen ook pogingen daartoe mee.",
      "Ook verzekeringsfraude of opzettelijke misleiding van een financiële instelling in de laatste 8 jaar telt.",
      "Voor een eigen situatie verwijs je naar de klantenservice van a.s.r.",
    ],
    klantinfo: ["Of de klant in de laatste 8 jaar verdachte is geweest of een straf kreeg voor een van deze feiten."],
    vervolgvragen: [],
    gerelateerd: ["al-verklaringen"],
    controle: { status: "handmatig-controleren", opmerking: "Juridisch gevoelig. De lijst is samengevat en de chat mag niet beoordelen of een bepaald feit een probleem is voor de aanvraag." },
  },

  "al-verklaring-financieel": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Je verklaart dat je in de laatste 5 jaar niet failliet bent verklaard en niet in een schuldsanering zat. Ook verklaar je dat er bij het afsluiten geen deurwaarder beslag had gelegd op je spullen of inkomsten.",
    direct: ["Faillissement of schuldsanering: de laatste 5 jaar voor het afsluiten.", "Beslag door een deurwaarder: op het moment van afsluiten."],
    aandachtspunten: [],
    klantinfo: ["Of de klant in de laatste 5 jaar failliet was of in een schuldsanering zat, en of er nu beslag ligt."],
    vervolgvragen: [{ als: "De klant noemt schulden of een faillissement", vraag: "Is dat in de laatste 5 jaar gebeurd?" }],
    gerelateerd: ["al-verklaringen"],
    controle: { status: "gecontroleerd" },
  },

  "al-verklaring-rijverbod": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Heb je een autoverzekering? Dan verklaar je dat jij, de vaste bestuurder en de houder van het kentekenbewijs in de laatste 8 jaar door de rechter geen rijverbod hebben gekregen, ook niet voorwaardelijk.",
    direct: ["Het gaat om de laatste 8 jaar voor het sluiten van de verzekering."],
    aandachtspunten: ["Het geldt voor jou, de regelmatige bestuurder en de houder van het kentekenbewijs.", "Ook een voorwaardelijk rijverbod telt."],
    klantinfo: ["Of een van deze personen in de laatste 8 jaar een rijverbod kreeg."],
    vervolgvragen: [{ als: "De klant noemt een rijverbod", vraag: "Wanneer kreeg je dat rijverbod, en was het voorwaardelijk?" }],
    gerelateerd: ["al-verklaringen"],
    controle: { status: "gecontroleerd" },
  },

  "al-verklaring-rechtsbijstand": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Heb je een rechtsbijstandverzekering? Dan verklaar je dat je in de laatste 5 jaar geen geschil had waarvoor je juridische hulp nodig had. Ook verklaar je dat er nu al geen aanleiding bekend is om een beroep op de verzekering te doen.",
    direct: ["Het gaat om de laatste 5 jaar voor het sluiten van de verzekering."],
    aandachtspunten: ["Dit geldt voor de rechtsbijstandverzekering, niet voor WA of Casco."],
    klantinfo: ["Of er al een geschil is of aanleiding voor een geschil."],
    vervolgvragen: [{ als: "De klant wil rechtsbijstand afsluiten en noemt een bestaand conflict", vraag: "Is het conflict al ontstaan voordat je de verzekering afsluit?" }],
    gerelateerd: ["al-verklaringen"],
    controle: { status: "gecontroleerd", opmerking: "Geldt alleen voor de rechtsbijstandverzekering." },
  },

  "al-fraude": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Fraude is bijvoorbeeld niet eerlijk vertellen wat er is gebeurd, bedragen op nota's veranderen, meer claimen dan je schade of een afgewezen schade nog eens opgeven. Bij fraude vergoedt a.s.r. de schade niet, eist het uitgekeerde geld terug en beëindigt het je verzekeringen.",
    direct: ["Bij fraude vergoedt a.s.r. de schade niet en eist het al uitgekeerde bedrag terug."],
    aandachtspunten: [
      "A.s.r. doet aangifte bij de politie.",
      "A.s.r. beëindigt de lopende verzekeringen. Je kunt dan geen andere verzekeringen meer bij a.s.r. afsluiten.",
      "Je gegevens komen in registers die ook voor andere verzekeraars toegankelijk zijn, en in het incidentenregister van a.s.r.",
      "Meer informatie staat op www.asr.nl.",
    ],
    klantinfo: ["Of de klant wil weten wat fraude is, of zelf iets heeft gedaan."],
    vervolgvragen: [],
    gerelateerd: ["al-fraude-andere-verzekeringen"],
    controle: { status: "gecontroleerd", opmerking: "Gevoelig onderwerp: de chat geeft geen advies over een eigen situatie en vraagt niet door naar wat de klant heeft gedaan." },
  },

  "al-fraude-andere-verzekeringen": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Heb je fraude gepleegd? Dan mag a.s.r. ook je andere schadeverzekeringen bij a.s.r. direct beëindigen. Ook andere bedrijven van a.s.r. mogen dat doen.",
    direct: ["Dat kan ook voor een verzekering waarbij je niet hebt gefraudeerd."],
    aandachtspunten: ["De andere ondernemingen van a.s.r. staan op www.asrnederland.nl."],
    klantinfo: [],
    vervolgvragen: [],
    gerelateerd: ["al-fraude"],
    controle: { status: "gecontroleerd" },
  },

  "al-persoonsgegevens": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "A.s.r. vraagt om je gegevens om een contract te sluiten en te onderhouden. Ook gebruikt a.s.r. ze om fraude te bestrijden en om je op de hoogte te houden van producten en diensten. Je kunt je gegevens inzien en online aanpassen via je a.s.r. account.",
    direct: [],
    aandachtspunten: [
      "A.s.r. kan je schade- en verzekeringsgegevens raadplegen en vastleggen bij Stichting CIS (telefoon 030 - 6935668, www.stichtingcis.nl), om risico's te beheersen en fraude tegen te gaan.",
      "A.s.r. schakelt soms andere bedrijven in, zoals een incassobureau, expertisebureaus of herverzekeraars. A.s.r. blijft verantwoordelijk voor je gegevens.",
      "De rechten en plichten staan in de Gedragscode Verwerking Persoonsgegevens Financiële Instellingen (www.verzekeraars.nl, Verbond van Verzekeraars, telefoon 070 - 3338500).",
    ],
    klantinfo: ["Of de klant zijn gegevens wil inzien, wijzigen of wil weten waarvoor ze worden gebruikt."],
    vervolgvragen: [{ als: "Het is niet duidelijk wat de klant met zijn gegevens wil", vraag: "Wil je je gegevens inzien of aanpassen, of wil je weten waarvoor a.s.r. ze gebruikt?" }],
    gerelateerd: ["al-telefoongesprekken"],
    controle: { status: "handmatig-controleren", opmerking: "Privacy: de voorwaarden beschrijven het gebruik van gegevens, niet alle rechten van de klant. De chat mag geen toezeggingen doen over privacyrechten buiten deze tekst; laat dit door de privacyverantwoordelijke nakijken." },
  },

  "al-telefoongesprekken": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "A.s.r. kan telefoongesprekken opnemen, bijvoorbeeld voor training en coaching, om opdrachten te controleren, tegen fraude en om aan wettelijke regels te voldoen. De opnames worden niet langer bewaard dan nodig is.",
    direct: [],
    aandachtspunten: ["Is er een geschil over wat er in een gesprek is gezegd, dan mag je het gesprek beluisteren of een uitgeschreven versie (transcriptie) krijgen."],
    klantinfo: ["Of de klant een gesprek wil terugluisteren en of er een geschil is."],
    vervolgvragen: [{ als: "De klant wil een gesprek terugluisteren", vraag: "Gaat het om een geschil over wat er in dat gesprek is gezegd?" }],
    gerelateerd: ["al-persoonsgegevens"],
    controle: { status: "gecontroleerd" },
  },

  "al-recht": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Op je verzekering is het Nederlandse recht van toepassing.",
    direct: [],
    aandachtspunten: [],
    klantinfo: [],
    vervolgvragen: [],
    controle: { status: "gecontroleerd" },
  },

  "al-sancties": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "De overheid kan sancties opleggen aan landen en aan personen of bedrijven in die landen. Dit kan betekenen dat een verzekeraar geen dekking mag geven of schade niet mag vergoeden als dat in strijd is met die sanctieregels.",
    direct: [],
    aandachtspunten: ["Sancties kunnen bijvoorbeeld bestaan uit het bevriezen van buitenlandse tegoeden of andere handelsbeperkingen.", "Meer informatie staat op www.rijksoverheid.nl."],
    klantinfo: [],
    vervolgvragen: [],
    controle: { status: "handmatig-controleren", opmerking: "Abstracte juridische tekst ('dit kan betekenen'). De chat mag niet zeggen dat een specifieke vergoeding wel of niet geblokkeerd is." },
  },

  "al-klacht": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Heb je een klacht? Neem dan contact op met a.s.r. Komen jullie er samen niet uit, dan kun je online een klacht indienen via het klachtenformulier op www.asr.nl.",
    direct: ["Vind je dat je klacht niet goed is afgehandeld? Leg hem dan binnen 3 maanden voor aan het KiFiD (www.kifid.nl). Die 3 maanden gaan in nadat je een definitieve reactie van a.s.r. op je klacht hebt gekregen."],
    aandachtspunten: ["Je kunt het geschil ook voorleggen aan de bevoegde rechter."],
    klantinfo: ["Waarover de klacht gaat.", "Of de klant al een definitieve reactie van a.s.r. heeft gekregen."],
    vervolgvragen: [{ als: "De klant wil klagen en het is niet bekend of a.s.r. al heeft gereageerd", vraag: "Heb je al een definitieve reactie van a.s.r. op je klacht gekregen?" }],
    controle: { status: "gecontroleerd" },
  },
};
