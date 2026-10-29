import type { Verrijking } from "./types";
import { b, HANDMATIG, q } from "./verrijking-hulp";

/**
 * Document 3 van de uitrol: de klantvriendelijke laag voor de Voorwaarden Autoverzekering Casco Beperkt, D AU-CB 2017-01.
 * Zelfde werkwijze als bij de eerdere documenten: brontekst en bronverwijzing blijven ongewijzigd, elke uitleg en elk
 * punt is naast de brontekst gelegd (`scripts/test-verrijking.mts` controleert elk getal) en juridisch gevoelige
 * blokken staan op "handmatig-controleren". Vier Casco-blokken staan bij de proefartikelen (cb-dekking-overzicht,
 * cb-diefstal, cb-eigen-risico, cb-waarde-nieuwwaarde).
 *
 * Bijna alle blokken hieronder staan met dezelfde tekst ook in de voorwaarden van Casco Allrisk (zie
 * `CASCO_BEPERKT_OOK_IN_ALLRISK` in index.ts). Die zijn daarom neutraal geschreven ("Casco"); de blokken die alleen in
 * Casco Beperkt staan (dieren, natuurramp, ontploffing, rellen, ruitschade, transport, no-claim, begrippen) noemen
 * Casco beperkt en verwijzen waar nuttig naar het Allrisk-blok.
 */
const PECH_VRAAG = "Staat Pechhulp op je polisblad?";

export const VERRIJKING_CASCO_BEPERKT: Record<string, Verrijking> = {
  "cb-wie-verzekerd": b({
    uitleg: "Met Casco zijn verzekerd: jij als verzekeringnemer en eigenaar of houder van de auto, de vaste bestuurder op je polisblad, de bestuurder die toestemming heeft en de passagiers.",
    aandachtspunten: ["Een bestuurder zonder toestemming is niet verzekerd (zie de uitsluiting 'geen toestemming')."],
    klantinfo: ["Wie er reed en of die persoon toestemming had."],
    vervolgvragen: [q("De klant vraagt of iemand anders mag rijden en het is niet bekend of die toestemming had", "Had die persoon toestemming van jou om te rijden?")],
    gerelateerd: ["uitsluiting-toestemming"],
  }),

  "cb-welke-auto": b({
    uitleg: "Verzekerd is de auto op je polisblad, met een geldig Nederlands kentekenbewijs en gemaakt voor maximaal 9 personen. De bestuurder heeft een rijbewijs B of B/E nodig. Ook de onderdelen uit de cataloguswaarde op je polisblad vallen eronder, zoals audio- of navigatieapparatuur die de fabriek heeft ingebouwd.",
    aandachtspunten: ["Spullen die later zijn ingebouwd of losse onderdelen zijn extra's; daarvoor geldt een eigen regeling."],
    klantinfo: ["Om welke auto of welk onderdeel het gaat."],
    gerelateerd: ["cb-extras"],
  }),

  "cb-extras": b({
    uitleg: "Extra's zijn dingen die later in je auto zijn gebouwd of die los bij de auto horen, zoals automatten, een brandblusapparaat of een gevarendriehoek. Ze zijn verzekerd voor dezelfde gebeurtenissen als de auto, standaard tot € 1.000.",
    direct: ["Bij diefstal van extra's krijg je alleen vergoeding als je direct na de diefstal aangifte hebt gedaan bij de politie. Stuur a.s.r. het bewijs."],
    aandachtspunten: [
      "Voor beeld-, geluids- en navigatieapparatuur krijg je nooit meer dan € 500.",
      "Zijn extra's voor een hoger bedrag verzekerd, dan krijg je per gebeurtenis maximaal het bedrag dat op je polisblad staat.",
      "Opties die een dealer of garage heeft ingebouwd maar die in de prijs van de fabrikant zitten, zijn geen extra's.",
      "Cd's, mobiele telefoons en losse geluids-, zend-, navigatie- en (hand)computerapparatuur zijn ook geen extra's.",
      "Raken extra's beschadigd, dan vergoedt a.s.r. de reparatie, of de vervangingswaarde als repareren duurder is of niet kan.",
      "De uitsluitingen van de auto gelden ook voor extra's.",
    ],
    klantinfo: ["Om welke spullen het gaat en of ze later zijn ingebouwd of los bij de auto horen."],
    vervolgvragen: [q("Het is niet duidelijk of iets een extra is", "Is dit later in de auto gebouwd of los bij de auto gekomen, of zat het er vanuit de fabriek in?")],
  }),

  "cb-bevriezing": b({
    uitleg: "Schade door bevriezing is alleen verzekerd als ze komt door een andere gebeurtenis die Casco dekt.",
    aandachtspunten: ["Het moet gaan om een gebeurtenis die in de lijst van gedekte gebeurtenissen staat."],
    klantinfo: ["Door welke gebeurtenis de bevriezing is ontstaan."],
    vervolgvragen: [q("De klant meldt vorstschade zonder oorzaak", "Hoe is de schade door vorst ontstaan?")],
  }),

  "cb-bliksem": b({
    uitleg: "Schade door blikseminslag is verzekerd.",
    klantinfo: ["Wat er door de bliksem is beschadigd."],
  }),

  "cb-dieren": b({
    uitleg: "Schade door een botsing met vogels of loslopende dieren is verzekerd. Botst of raak je daardoor iets anders, dan krijg je die schade niet vergoed.",
    direct: ["Schade doordat je door de botsing met een dier tegen iets anders botst of iets anders raakt, vergoedt a.s.r. niet."],
    aandachtspunten: ["Met Casco allrisk is een aanrijding of botsing in het algemeen wel verzekerd."],
    klantinfo: ["Of de auto alleen het dier raakte of ook iets anders."],
    vervolgvragen: [q("De klant noemt een botsing met een dier en het is niet bekend of daarna iets anders is geraakt", "Heb je alleen het dier geraakt, of ook iets anders, zoals een boom of een paal?")],
    gerelateerd: ["ca-aanrijding"],
  }),

  "cb-brand": b({
    uitleg: "Schade door brand of zelfontbranding is verzekerd, ook als de brand komt door een gebrek aan de auto zelf. Ook schade door het blussen is verzekerd. Het onderdeel waarin het gebrek zit, krijg je niet vergoed.",
    aandachtspunten: [
      "Brand is vuur dat buiten een haard ontstaat, met vlammen, en dat zich op eigen kracht kan verspreiden.",
      "Een eigen gebrek is een gebrek van de auto zelf, bijvoorbeeld door een natuurlijke eigenschap of slechte kwaliteit. Het heeft niets te maken met normale slijtage, overbelasting of onvoldoende onderhoud.",
      "Kun je door de brand niet verder rijden, dan heb je ook recht op hulpverlening.",
    ],
    klantinfo: ["Wat er is gebrand en hoe het is ontstaan."],
    vervolgvragen: [q("De klant meldt een brand zonder context", "Wat is er gebeurd, en kun je nog met de auto rijden?")],
    gerelateerd: ["cb-hulpverlening"],
  }),

  "cb-sleutels": b({
    uitleg: "Zijn je autosleutels gestolen? Dan vergoedt a.s.r. het vervangen van de sleutels, nieuwe sloten en het omcoderen van de start-onderbreker, tot € 500. Verlies van je sleutels is niet verzekerd.",
    direct: [
      "Doe nog dezelfde dag aangifte bij de politie, of de volgende ochtend als het 's avonds of 's nachts gebeurde, en stuur a.s.r. het bewijs.",
      "Laat de sleutels, sloten en/of omcodering binnen 24 uur na de diefstal vervangen.",
    ],
    aandachtspunten: ["De vergoeding is maximaal € 500.", "Alleen diefstal van sleutels is verzekerd, geen verlies."],
    klantinfo: ["Of de sleutels gestolen of kwijt zijn.", "Of er al aangifte is gedaan."],
    vervolgvragen: [q("De klant is zijn sleutel kwijt en het is niet bekend of die gestolen is", "Zijn je sleutels gestolen, of ben je ze kwijt?")],
    gerelateerd: ["cb-aangifte"],
  }),

  "cb-kortsluiting": b({
    uitleg: "Schade door kortsluiting is verzekerd, ook als die komt door een gebrek aan de auto zelf. Het onderdeel waarin het gebrek zit, krijg je niet vergoed.",
    klantinfo: ["Wat er door de kortsluiting kapot is gegaan."],
  }),

  "cb-luchtverkeer": b({
    uitleg: "Schade door een luchtvaartuig dat neerstort of door vallende delen daarvan is verzekerd. Ook schade doordat er iets uit een luchtvaartuig valt of wordt gegooid is verzekerd.",
  }),

  "cb-natuurramp": b({
    uitleg: "Schade door een natuurramp is verzekerd, bijvoorbeeld door hagel, een overstroming, een lawine of een aardbeving.",
    aandachtspunten: [
      "Gedekt zijn: een aardbeving of -verschuiving, hagel, instorting door een natuurverschijnsel, een lawine, een overstroming, stenen die van een berg of natuurlijke helling vallen, een uitbarsting van een vulkaan of geiser en een vloedgolf.",
      "Met overstroming bedoelt a.s.r. een overstroming door het bezwijken of overlopen van dijken, kaden, sluizen of andere waterkeringen, ook water dat via beschadigingen aan waterkeringen uitstroomt.",
      "Het maakt niet uit of de overstroming de oorzaak of het gevolg is van een gebeurtenis die verzekerd is.",
      "Bij Casco allrisk staat een aardbeving niet in de lijst.",
    ],
    klantinfo: ["Door welke natuurramp of oorzaak de schade is ontstaan."],
    vervolgvragen: [q("De klant noemt waterschade of schade zonder oorzaak", "Wat is de oorzaak van de schade?")],
    gerelateerd: ["ca-natuurramp"],
  }),

  "cb-ontploffing": b({
    uitleg: "Schade door ontploffing is verzekerd, ook als die komt door een gebrek aan de auto. Een opgeblazen motor of opgeblazen elektronica krijg je niet vergoed.",
    aandachtspunten: ["Een ontploffing is een plotselinge en hevige uitbarsting van gassen of dampen.", "Het onderdeel waarin het gebrek zit, krijg je niet vergoed."],
    klantinfo: ["Wat er is ontploft en wat er is beschadigd."],
  }),

  "cb-rellen": b({
    uitleg: "Schade door rellen, relletjes en opstootjes is verzekerd. Schade door vandalisme is niet verzekerd.",
    direct: ["Vandalisme, dat is opzettelijke beschadiging door een derde, is niet verzekerd."],
    aandachtspunten: ["Met Casco allrisk is vandalisme wel verzekerd."],
    klantinfo: ["Of de schade bij rellen of opstootjes ontstond, of dat iemand de auto opzettelijk beschadigde."],
    vervolgvragen: [q("De klant meldt beschadiging door een derde zonder context", "Is de schade ontstaan bij rellen of opstootjes, of heeft iemand je auto expres beschadigd?")],
    gerelateerd: ["ca-rellen-vandalisme"],
  }),

  "cb-ruitschade": b({
    uitleg: "Een ruit of zonnedak dat plotseling breekt is verzekerd, net als schade door de scherven. Laat je het repareren of vervangen door een geselecteerd ruitschadeherstelbedrijf, dan regelt a.s.r. de betaling met dat bedrijf.",
    direct: ["Laat je het niet door een geselecteerd ruitschadeherstelbedrijf doen, dan verlaagt a.s.r. de vergoeding met € 500. Dat geldt niet bij een noodgeval in het buitenland waar zo'n bedrijf in Nederland niet kan."],
    aandachtspunten: [
      "Geen vergoeding voor krassen of oppervlakkige beschadigingen, en niet als je tegelijk ook andere schade aan je auto hebt.",
      "Bij een geselecteerd bedrijf ben je de opdrachtgever, maar hoef je geen geld voor te schieten. Je betaalt alleen een eventueel eigen risico.",
      "Het eigen risico geldt niet bij het repareren van een ruit, wel bij vervangen.",
      "Je krijgt uitgebreide garantie. De bedrijven staan op www.glasgarant.nl.",
      "Op asr.nl staat: heb je ruitschade, dan hoef je die niet eerst bij a.s.r. te melden; maak direct een afspraak bij een aangesloten hersteller.",
    ],
    klantinfo: ["Of de ruit gebroken of gescheurd is, of alleen gekrast.", "Of er ook andere schade is."],
    vervolgvragen: [q("De klant meldt ruitschade en het is niet bekend wat voor schade", "Is de ruit gebroken of gescheurd, of gaat het alleen om een kras?")],
    gerelateerd: ["sw-ruitschade"],
  }),

  "cb-storm": b({
    uitleg: "Schade door storm is verzekerd. Bijvoorbeeld als je auto omwaait, als er iets op of tegen je auto valt (zoals een boom) of als je portier door de wind tegen iets waait. Storm is wind van 14 meter per seconde of meer.",
    klantinfo: ["Wat er is gebeurd: omgewaaid, iets op de auto gevallen of een portier tegen iets gewaaid."],
    vervolgvragen: [q("De klant meldt stormschade zonder details", "Wat is er gebeurd: is er iets op je auto gevallen, of is je auto omgewaaid?")],
  }),

  "cb-transport": b({
    uitleg: "Schade door een oorzaak van buitenaf tijdens het vervoer van je auto door een transportondernemer is verzekerd. Schade door slepen en takelen, en schrammen, krassen of lakschade krijg je niet vergoed.",
    aandachtspunten: ["Met vervoer bedoelt a.s.r. vervoer door een ander transportmiddel, dus niet het rijden met de auto zelf."],
    klantinfo: ["Wat voor schade het is en hoe de auto werd vervoerd."],
  }),

  "cb-onderhoud-slijtage": b({
    uitleg: "Normaal onderhoud en slijtage vergoedt a.s.r. niet. Ook niet als de schade komt doordat je de auto niet op tijd of niet deskundig hebt laten onderhouden.",
    aandachtspunten: ["Onder normaal gebruik vallen slijtage, verkleuring, veroudering, verroesting en corrosie."],
    klantinfo: ["Wat er kapot is en of de auto goed en op tijd is onderhouden."],
    vervolgvragen: [q("De klant vraagt of iets gedekt is en het is niet bekend of het om een gebeurtenis of om slijtage gaat", "Is dit schade door een gebeurtenis, of gaat het om onderhoud of slijtage?")],
  }),

  "cb-onvoldoende-zorg": b({
    uitleg: "Schade die ontstaat doordat je onvoldoende zorg hebt gehad, krijg je niet vergoed. Bijvoorbeeld doorrijden met een waarschuwingslampje, een afgekeurde of verlopen APK, diefstalgevoelige spullen in het zicht of een overbeladen auto.",
    aandachtspunten: ["Ligt er een diefstalgevoelig voorwerp zoals een laptop in het zicht en nodigt dat uit tot inbraak, dan krijg je de braakschade aan de auto niet vergoed."],
    klantinfo: ["Of er een waarschuwingslampje brandde, of de APK geldig was en of er spullen in het zicht lagen."],
    vervolgvragen: [q("De klant meldt inbraakschade en het is niet bekend of er spullen in het zicht lagen", "Lagen er spullen in het zicht in de auto?")],
  }),

  "cb-hulpverlening": b({
    uitleg: "Met Casco heb je recht op hulpverlening bij diefstal van de auto, of als de auto door een gedekte gebeurtenis zo beschadigd is dat je niet verder kunt rijden. Vraag vooraf toestemming aan de Alarmcentrale.",
    direct: ["Vraag vooraf toestemming aan de Alarmcentrale: 030 - 6990708."],
    aandachtspunten: ["Kan niemand redelijkerwijs bellen, dan ben je toch verzekerd, met maximaal de vergoeding die je met de Alarmcentrale had gekregen.", "Het eigen risico geldt niet voor hulpverlening."],
    klantinfo: ["Wat er is gebeurd.", "Of het in Nederland of in het buitenland gebeurde."],
    vervolgvragen: [q("Het is niet bekend of het in Nederland of in het buitenland gebeurde", "Is dit in Nederland of in het buitenland gebeurd?")],
    gerelateerd: ["alarmcentrale", "hulpverlening-nederland"],
  }),

  "cb-hulp-geen-recht": b({
    uitleg: "Voor hulpverlening gelden dezelfde uitsluitingen als voor de auto zelf, en de algemene uitsluitingen. Blijkt achteraf dat je geen recht had, dan betaal je de kosten terug die a.s.r. al maakte.",
    direct: ["Heeft a.s.r. al kosten gemaakt en blijkt achteraf dat je geen recht had, dan moet je die kosten terugbetalen."],
    gerelateerd: ["cb-hulpverlening"],
  }),

  "cb-nieuwwaarde-keuze": b({
    uitleg: "Nieuwwaarde 2 jaar of 3 jaar is een keuzedekking. Staat die op je polisblad, dan gebruikt a.s.r. die termijn om de waarde van je auto vast te stellen.",
    aandachtspunten: ["Hoe de waarde wordt bepaald staat bij 'Beschadiging of diefstal van de auto'.", "De uitsluitingen en beperkingen van de dekking en de algemene uitsluitingen gelden ook hier."],
    klantinfo: ["Of Nieuwwaarde 2 jaar of 3 jaar op het polisblad staat."],
    vervolgvragen: [q("De klant vraagt naar nieuwwaarde en het is niet bekend of die op het polisblad staat", "Staat Nieuwwaarde 2 jaar of 3 jaar op je polisblad?")],
    gerelateerd: ["cb-waarde-nieuwwaarde"],
  }),

  "cb-aankoopwaarde-keuze": b({
    uitleg: "Aankoopwaarde 1, 2 of 3 jaar is een keuzedekking. Staat die op je polisblad, dan gebruikt a.s.r. die termijn om de waarde van je auto vast te stellen.",
    aandachtspunten: ["Hoe de waarde wordt bepaald staat bij 'Beschadiging of diefstal van de auto'.", "De uitsluitingen en beperkingen van de dekking en de algemene uitsluitingen gelden ook hier."],
    klantinfo: ["Of Aankoopwaarde 1, 2 of 3 jaar op het polisblad staat."],
    vervolgvragen: [q("De klant vraagt naar aankoopwaarde en het is niet bekend of die op het polisblad staat", "Staat Aankoopwaarde 1, 2 of 3 jaar op je polisblad?")],
    gerelateerd: ["cb-waarde-aankoopwaarde"],
  }),

  "cb-pechhulp": b({
    uitleg: "Pechhulp is een extra dekking: je hebt die alleen als hij op je polisblad staat. Je krijgt pechhulp bij een mechanisch of elektronisch mankement waardoor je niet verder kunt rijden.",
    direct: ["Vraag vooraf toestemming aan de Alarmcentrale."],
    aandachtspunten: ["Het eigen risico geldt niet voor Pechhulp.", "De no-claimkorting geldt niet voor de premie van Pechhulp.", "De gebeurtenis moet plaatsvinden tijdens de looptijd van je verzekering."],
    klantinfo: ["Of Pechhulp op het polisblad staat."],
    vervolgvragen: [q("De klant heeft pech en het is niet bekend of hij Pechhulp heeft", PECH_VRAAG)],
    gerelateerd: ["alarmcentrale", "pechhulp-nederland"],
  }),

  "cb-pech-geen-recht": b({
    uitleg: "Voor pechhulp gelden dezelfde uitsluitingen als voor de auto zelf, en de algemene uitsluitingen. Blijkt achteraf dat je geen recht had, dan betaal je de kosten terug die a.s.r. al maakte.",
    direct: ["Heeft a.s.r. al kosten gemaakt en blijkt achteraf dat je geen recht had, dan moet je die kosten terugbetalen."],
    gerelateerd: ["cb-pechhulp"],
  }),

  "cb-vergoeding-reparatie": b({
    brontekstSoort: "samenvatting",
    uitleg: "Is je auto veilig te repareren, dan vergoedt a.s.r. de reparatiekosten. Zijn die hoger dan de waarde van de auto, dan krijg je de waarde min de restanten. Bij diefstal krijg je de waarde van de auto.",
    aandachtspunten: [
      "A.s.r. mag een bedrag aftrekken voor eerdere schade die nog niet is gerepareerd.",
      "Soms verlaagt a.s.r. de vergoeding als slijtagegevoelige onderdelen door nieuwe worden vervangen waardoor de auto beter wordt, bijvoorbeeld nieuwe banden, een nieuwe accu of een nieuwe uitlaat.",
      "Hoe de waarde wordt bepaald hangt af van nieuwwaarde, aankoopwaarde of dagwaarde.",
    ],
    klantinfo: ["Wat voor schade het is en wat de reparatie kost."],
    vervolgvragen: [q("De klant vraagt wat hij krijgt bij schade en het is niet bekend of de auto te repareren is", "Is je auto te repareren, of zegt de garage dat hij total loss is?")],
    gerelateerd: ["cb-herstelbedrijf", "cb-total-loss"],
  }),

  "cb-herstelbedrijf": b({
    uitleg: "A.s.r. vergoedt reparatie door een geselecteerd herstelbedrijf. Laat je de schade niet door zo'n bedrijf repareren, dan verlaagt a.s.r. je vergoeding met € 500.",
    direct: ["Repareer je niet bij een geselecteerd herstelbedrijf (of niet), dan gaat de vergoeding € 500 omlaag."],
    aandachtspunten: [
      "Geen korting van € 500 bij een noodreparatie in het buitenland waar een geselecteerd bedrijf in Nederland niet kan, en niet als je de beschadigde auto inruilt zonder te repareren en de vervangende auto aansluitend bij a.s.r. verzekert.",
      "Bij een geselecteerd bedrijf regelt a.s.r. de betaling rechtstreeks. Jij bent de opdrachtgever en betaalt alleen een eventueel eigen risico.",
      "Je krijgt merkgarantie of FOCWA-garantie, de haal- en brengservice en gratis vervangend vervoer tijdens de reparatie.",
      "Bij total loss heb je maximaal 5 dagen recht op een gratis leenauto.",
      "De bedrijven staan op www.schadegarant.nl.",
    ],
    klantinfo: ["Of de klant de schade bij een eigen garage wil laten repareren."],
    vervolgvragen: [q("De klant wil bij een eigen garage repareren", "Wil je de schade bij een geselecteerd herstelbedrijf laten repareren, of bij je eigen garage?")],
    gerelateerd: ["cb-vervangend-vervoer"],
  }),

  "cb-waarde-aankoopwaarde": b({
    brontekstSoort: "samenvatting",
    uitleg: "Heb je je auto tweedehands of in het buitenland gekocht en staat Aankoopwaarde op je polisblad? Dan krijg je in de gekozen periode van 1, 2 of 3 jaar het bedrag waarvoor je de auto kocht. Daarna krijg je de dagwaarde.",
    direct: ["Je moet de aankoopwaarde kunnen aantonen, bijvoorbeeld met een originele aankoopnota of dagafschrift. Een verklaring van getuigen is niet genoeg."],
    aandachtspunten: [
      "Is de cataloguswaarde hoger dan € 80.000 inclusief BTW, of staat Aankoopwaarde niet op je polisblad, dan is de waarde de dagwaarde.",
      "Kun je de aankoopwaarde niet aantonen, dan telt de hoogste van de 'vervangingswaarde bij total loss' volgens de ANWB-koerslijst van de maand van aankoop en de dagwaarde.",
      "Het maximum is die vervangingswaarde plus 20%.",
    ],
    klantinfo: ["Hoe en wanneer de auto is gekocht.", "Welke aankoopperiode op het polisblad staat.", "Of de klant een aankoopnota heeft."],
    vervolgvragen: [q("De klant vraagt naar aankoopwaarde en het is niet bekend wanneer de auto is gekocht", "Hoeveel maanden geleden heb je de auto gekocht?")],
    gerelateerd: ["cb-dagwaarde"],
  }),

  "cb-dagwaarde": b({
    uitleg: "De dagwaarde is de verkoopwaarde van je auto net voor de schade. A.s.r. bepaalt die zo nodig samen met een deskundige.",
    aandachtspunten: ["De vervangingswaarde (van extra's) is de waarde van een voorwerp van dezelfde soort, kwaliteit, staat en ouderdom, vlak voor de schade."],
  }),

  "cb-total-loss": b({
    uitleg: "Total loss betekent dat je auto niet meer veilig te repareren is, of dat de reparatie te duur is. Dan krijg je de waarde van de auto min de waarde van de restanten.",
    direct: ["Wordt de auto gedemonteerd, dan krijg je pas een vergoeding als je de auto en de extra's (of de restanten) overdraagt en het kentekenbewijs, het overschrijvingsbewijs en alle sleutels inlevert."],
    aandachtspunten: [
      "Technisch total loss: de auto is niet meer veilig te rijden en repareren is onmogelijk of onverantwoord.",
      "Economisch total loss: bij nieuwwaarde zijn de reparatiekosten hoger dan 2/3 van de vastgestelde waarde van de auto; bij aankoopwaarde of dagwaarde zijn ze hoger dan het verschil tussen de dagwaarde en de waarde van de restanten.",
      "De waarde van de restanten trekt a.s.r. van de vergoeding af. Dat bedrag krijg je rechtstreeks van het demontagebedrijf dat de auto afvoert.",
    ],
    klantinfo: ["Wat de reparatie kost en wat de auto waard is."],
    vervolgvragen: [q("De klant vraagt of zijn auto total loss is en het is niet bekend wat de reparatie kost", "Wat zegt de garage of de expert over de reparatiekosten?")],
    gerelateerd: ["cb-vervangend-vervoer"],
  }),

  "cb-kosten-vergoed": b({
    brontekstSoort: "samenvatting",
    uitleg: "Naast de schade vergoedt a.s.r. een paar kosten, bijvoorbeeld om schade te voorkomen of te beperken, voor een kosteloos vervoerde gewonde en avarij-grosse. Daarvoor geldt geen eigen risico.",
    aandachtspunten: [
      "Kosten om een direct dreigende, gedekte schade te voorkomen of te beperken: geen maximum.",
      "Schade aan de auto en het reinigen of vervangen van bekleding als je kosteloos een gewonde vervoert of tijdelijk in de auto plaatst: in totaal tot maximaal de dagwaarde van de auto.",
      "Avarij-grosse is jouw deel van de kosten om schip en lading veilig te stellen als je auto per schip wordt vervoerd en het schip in problemen komt: geen maximum.",
    ],
    klantinfo: ["Om welke kosten het gaat."],
    vervolgvragen: [q("De klant vraagt naar kosten zonder te zeggen om welke", "Om welke kosten gaat het?")],
  }),

  "cb-extra-kosten-diefstal": b({
    uitleg: "Kun je je auto niet gebruiken door diefstal of joyrijden? Dan krijg je een tegemoetkoming in de extra kosten die je daardoor maakt. Dat is maximaal € 12,50 per dag en € 375 per gebeurtenis.",
    direct: ["Je krijgt geen vergoeding als de auto een lease- of lesauto is."],
    aandachtspunten: ["Er geldt geen eigen risico."],
    klantinfo: ["Of de auto een lease- of lesauto is."],
    vervolgvragen: [q("De klant vraagt naar kosten na diefstal en het is niet bekend of de auto geleased is", "Is je auto een lease- of lesauto?")],
  }),

  "cb-vervangend-vervoer": b({
    brontekstSoort: "samenvatting",
    uitleg: "Laat je je beschadigde auto repareren bij een geselecteerd herstelbedrijf, dan krijg je gratis vervangend vervoer. Bij total loss krijg je maximaal 5 dagen een gratis leenauto. A.s.r. vergoedt ook de haal- en brengservice.",
    aandachtspunten: [
      "Haal- en brengservice: de auto wordt opgehaald en teruggebracht op een plek in Nederland die je kiest en je krijgt tegelijk een leenauto. Geen maximum.",
      "Bij hulpverlening in het buitenland: huur van een vergelijkbare auto onder voorwaarden, maximaal € 100 per dag en € 1.250 per gebeurtenis.",
      "Bij pech in Nederland (met Pechhulp) is de huur maximaal 5 dagen.",
      "Na diefstal of joyrijden krijg je een tegemoetkoming van maximaal € 12,50 per dag en € 375 per gebeurtenis.",
    ],
    klantinfo: ["Waarom de klant vervangend vervoer nodig heeft: reparatie, total loss, pech of diefstal."],
    vervolgvragen: [q("Het is niet duidelijk waarom de klant vervangend vervoer nodig heeft", "Waarom heb je vervangend vervoer nodig: een reparatie, total loss, pech of diefstal?")],
    gerelateerd: ["cb-herstelbedrijf"],
  }),

  "cb-schade-vaststellen": b({
    uitleg: "A.s.r. stelt vast hoeveel schade je hebt, of laat dat een deskundige doen. Vind je het bedrag te laag, dan mag je zelf een tweede deskundige kiezen. Komen de twee deskundigen er niet uit, dan kiezen zij samen een derde die bindend beslist.",
    aandachtspunten: [
      "A.s.r. vergoedt de redelijke kosten van alle deskundigen, mits ze zich houden aan de Gedragscode Expertiseorganisaties of vergelijkbaar deskundig zijn.",
      "De kosten van de deskundige die jij kiest vergoedt a.s.r. tot maximaal de kosten van de deskundige die a.s.r. heeft ingeschakeld.",
      "De derde deskundige volgt de Richtlijn voor het uitvoeren van een bindend advies Motorvoertuigen van het Nederlands Instituut van Register Experts (Nivre).",
    ],
    klantinfo: ["Of de klant het vastgestelde schadebedrag te laag vindt."],
    vervolgvragen: [q("De klant is het niet eens met het schadebedrag", "Vind je dat het vastgestelde schadebedrag te laag is?")],
    controle: HANDMATIG("Het oordeel van de derde deskundige is bindend voor de klant en voor a.s.r.; juridisch gewicht. De chat mag niet uitleggen wat er in een concrete zaak uitkomt."),
  }),

  "cb-diefstal-afwikkeling": b({
    uitleg: "Wordt je auto gestolen, dan krijg je 30 dagen na je melding schadevergoeding. Daarvoor draag je de eigendom van de auto over en lever je het kentekenbewijs, het overschrijvingsbewijs en alle sleutels in. Wordt de auto binnen 30 dagen teruggevonden, dan moet je hem terugnemen.",
    direct: ["Meld het a.s.r. zodra je weet dat je gestolen auto is teruggevonden."],
    aandachtspunten: [
      "Wordt de auto binnen 30 dagen na je melding teruggevonden, dan krijg je de schade vergoed die tijdens de diefstal is ontstaan.",
      "Wordt hij daarna teruggevonden, dan mag je hem terugnemen. Je moet dan eerst de vergoeding terugbetalen; de schade uit de tijd van de diefstal mag je ervan aftrekken.",
    ],
    klantinfo: ["Wanneer de diefstal is gemeld.", "Of de auto is teruggevonden en wanneer."],
    vervolgvragen: [q("De klant meldt dat de auto is teruggevonden maar het is niet bekend wanneer", "Hoeveel dagen na je melding is de auto teruggevonden?")],
    gerelateerd: ["cb-diefstal"],
  }),

  "cb-uitbetaling": b({
    uitleg: "Heeft a.s.r. besloten dat je schadevergoeding krijgt, dan betaalt a.s.r. die zo snel mogelijk uit. Duurt het langer dan 30 dagen nadat a.s.r. alle gegevens heeft ontvangen, dan heb je recht op wettelijke rente.",
    direct: ["Betaalt a.s.r. niet binnen 30 dagen nadat alle gegevens zijn ontvangen, dan krijg je vanaf dat moment wettelijke rente."],
    klantinfo: ["Wanneer a.s.r. alle gegevens heeft gekregen."],
    vervolgvragen: [q("De klant vraagt waarom de uitbetaling lang duurt", "Wanneer heb je de laatste gegevens naar a.s.r. gestuurd?")],
  }),

  "cb-aangifte": b({
    uitleg: "Doe bij inbraak, vandalisme, beschadiging door onbekenden of doorrijden na een ongeval direct aangifte, uiterlijk binnen 14 dagen. Bij diefstal of joyrijden doe je dat nog dezelfde dag, of de volgende ochtend als het 's avonds of 's nachts gebeurde.",
    direct: [
      "Diefstal of joyrijden: aangifte nog dezelfde dag, of de volgende ochtend als het 's avonds of 's nachts is gebeurd.",
      "Inbraak, vandalisme, beschadiging door onbekenden of doorrijden na een ongeval: aangifte direct, uiterlijk binnen 14 dagen.",
      "Meld bij diefstal de gegevens van de auto zo snel mogelijk bij het VbV: 071 - 3641777 (dag en nacht bereikbaar).",
    ],
    aandachtspunten: ["In het buitenland doe je aangifte in dat land. Bij diefstal van de auto doe je ook aangifte in Nederland, binnen 24 uur na thuiskomst."],
    klantinfo: ["Wat er is gebeurd.", "Of het in Nederland of in het buitenland gebeurde."],
    vervolgvragen: [q("Het is niet bekend wat er is gebeurd", "Wat is er gebeurd?")],
  }),

  "cb-medewerking": b({
    uitleg: "Heb je schade? Dan vraagt a.s.r. je mee te werken: volg de aanwijzingen op en geef alle informatie die nodig is. Stuur originele bewijsstukken zo snel mogelijk op.",
    direct: ["Stuur originele bewijsstukken zo snel mogelijk naar a.s.r. of naar de deskundige; op verzoek ook naar de Alarmcentrale."],
    aandachtspunten: [
      "Doe niets wat de belangen van a.s.r. schaadt en doe alles wat redelijk is om schade te voorkomen of te verminderen.",
      "Je geeft a.s.r. alle informatie die nodig is om te beoordelen of je recht hebt op vergoeding en hoeveel.",
      "Houd je je niet aan je verplichtingen en schaad je de belangen van a.s.r., dan heb je geen recht op schadevergoeding.",
    ],
  }),

  "cb-wijzigingen": b({
    uitleg: "Verkoop of vervang je je auto? Laat het a.s.r. dan direct weten. Verhuis je of is er een andere vaste bestuurder, dan geef je dat binnen 30 dagen door.",
    direct: ["Auto verkocht of vervangen: direct doorgeven.", "Verhuizing of een andere regelmatige bestuurder: binnen 30 dagen doorgeven."],
    klantinfo: ["Wat er is veranderd: de auto, het adres of de bestuurder."],
    vervolgvragen: [q("Het is niet bekend wat er is veranderd", "Wat is er veranderd: je auto, je adres of de vaste bestuurder?")],
    gerelateerd: ["auto-verkopen"],
  }),

  "cb-noclaim": b({
    uitleg: "Met de no-claimladder krijg je korting op je premie. Met 0 schadevrije jaren start je op trede 5. Elk volgend jaar krijg je meer korting, tot maximaal 75%.",
    aandachtspunten: ["De maximale korting van 75% heb je vanaf trede 26 tot en met trede 31.", "Op trede 31 blijf je op trede 31 en blijft de korting gelijk.", "De korting geldt niet voor de premie van Pechhulp.", "Voor elke trede kan de chat de exacte korting geven."],
    klantinfo: ["Op welke trede de klant zit."],
    vervolgvragen: [q("De klant vraagt naar zijn korting en het is niet bekend op welke trede hij zit", "Op welke trede zit je, of hoeveel schadevrije jaren heb je?")],
    gerelateerd: ["cb-schadevrije-jaren"],
  }),

  "cb-schadevrije-jaren": b({
    uitleg: "Je schadevrije jaren staan in Roy-data, een landelijk systeem van verzekeraars. Een schade die a.s.r. betaalt op Casco beperkt kost je geen schadevrije jaren. Elk verzekeringsjaar komt er 1 schadevrij jaar bij.",
    aandachtspunten: [
      "Bij je eerste aanvraag geef je je schadevrije jaren op. A.s.r. zoekt ze op in Roy-data. Staan er geen, dan gaat a.s.r. uit van 0.",
      "Wijkt Roy-data af van wat je opgaf, dan past a.s.r. je schadevrije jaren aan volgens Roy-data.",
      "Klopt Roy-data volgens jou niet? Neem dan contact op met je vorige verzekeraar.",
      "Zeg je op, dan geeft a.s.r. je aantal schadevrije jaren door aan Roy-data.",
      "Een schade onder de WA-verzekering kan wel gevolgen hebben.",
    ],
    gerelateerd: ["cb-noclaim-wa-schade"],
  }),

  "cb-noclaim-wa-schade": b({
    uitleg: "Vergoedt a.s.r. een schade onder je WA-verzekering, dus schade aan anderen? Dan kan dat gevolgen hebben voor je trede op de no-claimladder en voor je schadevrije jaren. Of dat zo is, staat in de WA-voorwaarden.",
    aandachtspunten: ["Het gaat om het hoofdstuk 'Hoe werkt de no-claimregeling?' in de WA-voorwaarden."],
    klantinfo: ["Om wat voor schade het gaat."],
    gerelateerd: ["noclaim-geen-gevolg", "schade-zonder-schuld"],
  }),

  "cb-leenauto": b({
    uitleg: "Je verzekering geldt ook voor een leenauto van de garage als je eigen auto een beurt of reparatie krijgt. Dat is alleen zo als de garage de leenauto niet heeft verzekerd, of als de schade niet gedekt is op de verzekering van de garage.",
    direct: ["Bij schade aan de leenauto vergoedt a.s.r. maximaal de dagwaarde van je eigen auto."],
    aandachtspunten: ["Eindigt je verzekering, dan is ook de leenauto niet meer verzekerd.", "A.s.r. handelt de schade af volgens jouw verzekering: het eigen risico en de no-claimregeling gelden dus."],
    klantinfo: ["Of de garage de leenauto zelf heeft verzekerd."],
    vervolgvragen: [q("Het is niet bekend of de leenauto verzekerd is", "Weet je of de garage de leenauto zelf heeft verzekerd?")],
  }),

  "cb-buitenland-verhuizen": b({
    uitleg: "Verhuis je als verzekeringnemer naar het buitenland, dan stopt je verzekering direct. Verhuis je naar een EU-land, dan stopt de autoverzekering uiterlijk op de eerstvolgende verlengingsdatum. Krijgt je auto een buitenlands kenteken, dan stopt de verzekering direct.",
    direct: ["Buitenlands kenteken: de verzekering stopt direct.", "Verhuizing naar het buitenland: de verzekering stopt direct, behalve bij een EU-land: dan uiterlijk op de eerstvolgende jaarlijkse verlengingsdatum."],
    aandachtspunten: ["Staat je auto meer dan de helft van het jaar in het buitenland gestald, dan stopt de verzekering op dat moment. Staat hij in een EU-land gestald, dan uiterlijk op de eerstvolgende jaarlijkse verlengingsdatum."],
    klantinfo: ["Wie er gaat verhuizen en naar welk land."],
    vervolgvragen: [q("Het is niet bekend naar welk land de klant verhuist", "Naar welk land ga je verhuizen?")],
    gerelateerd: ["al-uitwonend-buitenland"],
  }),

  "cb-begrippen": b({
    brontekstSoort: "samenvatting",
    uitleg: "In de begrippenlijst van Casco beperkt staat wat een aantal woorden betekent, zoals beveiligingssysteem, dagwaarde, extra's, nieuwwaarde, overstroming, storm en total loss.",
    aandachtspunten: [
      "Een beveiligingssysteem is een anti-diefstalsysteem met het VbV-SCM Keurmerk Voertuigbeveiliging, of een technisch gelijkwaardig systeem dat in de fabriek is ingebouwd.",
      "Dagwaarde is de verkoopwaarde van de auto net voor de schade.",
      "Nieuwwaarde is de prijs van een nieuwe auto van hetzelfde merk, type en uitvoering volgens de laatst bekende prijslijst, inclusief afleveringskosten en verwijderingsbijdrage.",
      "Storm is wind van 14 meter per seconde of meer.",
      "Vervangingswaarde is de waarde van een voorwerp van dezelfde soort, kwaliteit, staat en ouderdom, vlak voor de schade.",
      "Een geselecteerd (ruitschade)herstelbedrijf is een bedrijf waar a.s.r. mee samenwerkt, waardoor reparaties goedkoper zijn.",
    ],
    klantinfo: ["Welk woord de klant uitgelegd wil hebben."],
    vervolgvragen: [q("Het is niet duidelijk welk begrip de klant bedoelt", "Welk woord wil je uitgelegd hebben?")],
  }),
};
