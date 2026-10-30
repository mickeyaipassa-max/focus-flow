import type { Verrijking } from "./types";
import { b, HANDMATIG, q } from "./verrijking-hulp";

/**
 * Document 4 van de uitrol: de klantvriendelijke laag voor de Voorwaarden Autoverzekering Casco Allrisk.
 * Zelfde werkwijze als bij de eerdere documenten: brontekst en bronverwijzing blijven ongewijzigd, elke uitleg en elk
 * punt is naast de brontekst gelegd (`scripts/test-verrijking.mts` controleert elk getal) en juridisch gevoelige
 * blokken staan op "handmatig-controleren". `ca-dekking-overzicht` staat bij de proefartikelen. De blokken die ook in
 * Casco Beperkt staan (brand, diefstal, sleutels, storm, enzovoort) zijn al neutraal beschreven in
 * `verrijking-casco-beperkt.ts` en worden hier niet herhaald.
 */
export const VERRIJKING_CASCO_ALLRISK: Record<string, Verrijking> = {
  "ca-aanrijding": b({
    uitleg: "Schade door een aanrijding, botsing, slippen, omslaan, in het water raken of van de weg raken is verzekerd. Dat geldt ook als de oorzaak een eigen gebrek van de auto is.",
    aandachtspunten: [
      "Een eigen gebrek is een gebrek van de auto zelf, bijvoorbeeld door een natuurlijke eigenschap of slechte kwaliteit. Het heeft niets te maken met normale slijtage, overbelasting of onvoldoende onderhoud.",
      "Het onderdeel waarin het eigen gebrek zit, krijg je niet vergoed.",
      "Bij een aanrijding kan een extra jeugd eigen risico gelden. Bij een botsing met vogels of loslopende dieren geldt dat niet, wel voor schade doordat de bestuurder door die botsing tegen iets anders botst.",
    ],
    klantinfo: ["Wat er is gebeurd.", "Wie er reed en hoe oud die persoon is."],
    vervolgvragen: [q("De klant meldt een aanrijding en het is niet bekend wie er reed", "Wie reed er op dat moment, en hoe oud is die persoon?")],
    gerelateerd: ["ca-jeugd-eigen-risico", "ca-eigen-risico"],
  }),

  "ca-materiaalfouten": b({
    uitleg: "Schade door een materiaal- of constructiefout of een eigen gebrek van de auto is verzekerd. Het onderdeel waarin de fout zit, krijg je niet vergoed.",
    aandachtspunten: ["Een eigen gebrek is een gebrek van de auto zelf. Het heeft niets te maken met normale slijtage, overbelasting of onvoldoende onderhoud."],
    klantinfo: ["Welk onderdeel kapot is en welke schade daardoor is ontstaan."],
    vervolgvragen: [q("De klant meldt een defect zonder te zeggen wat er is beschadigd", "Welk onderdeel is kapot, en is er ook andere schade ontstaan?")],
    gerelateerd: ["ca-motor"],
  }),

  "ca-motor": b({
    uitleg: "Schade aan de motor, aandrijving, elektrische installatie of transmissie door een eigen gebrek is alleen onder strikte voorwaarden verzekerd. Die gaan over de leeftijd en de kilometers van de auto en over het onderhoud.",
    direct: ["Alle voorwaarden moeten kloppen. De auto was nieuw op de afgiftedatum, is niet ouder dan 36 maanden en heeft niet meer dan 100.000 kilometer gereden."],
    aandachtspunten: [
      "Het onderhoud moet aantoonbaar zijn gedaan volgens de voorschriften van de fabrikant, door een bedrijf dat erkend is door de BOVAG of door de officiële merkdealer.",
      "De afgiftedatum is de datum op het kentekenbewijs dat in Nederland op jouw naam is afgegeven.",
      "Geen vergoeding voor verbrande kleppen en klepzetels, en niet voor schade aan de elektronische componenten van de motor.",
      "Een eigen gebrek heeft niets te maken met normale slijtage, overbelasting of onvoldoende onderhoud.",
      "Wat onder motor, aandrijving, elektrische installatie en transmissie valt, staat in de brontekst en in de begrippenlijst.",
    ],
    klantinfo: ["Welk onderdeel kapot is.", "De leeftijd en het aantal kilometers van de auto.", "Wie het onderhoud heeft gedaan."],
    vervolgvragen: [
      q("De klant meldt motor- of versnellingsbakschade en de leeftijd of kilometerstand is niet bekend", "Hoe oud is je auto en hoeveel kilometer heeft hij gereden?"),
      q("De leeftijd en kilometers zijn bekend en het onderhoud niet", "Wie heeft het onderhoud van je auto gedaan, en is dat aantoonbaar volgens de voorschriften van de fabrikant?"),
    ],
    gerelateerd: ["ca-begrippen", "ca-materiaalfouten"],
    controle: HANDMATIG("Meerdere voorwaarden gelden tegelijk (nieuw op afgiftedatum, 36 maanden, 100.000 km, onderhoud door erkend bedrijf). De chat moet nooit zeggen dat iets gedekt is zonder alle voorwaarden te noemen. Laat een medewerker dit nakijken."),
  }),

  "ca-natuurramp": b({
    uitleg: "Schade door een natuurramp is verzekerd, bijvoorbeeld door hagel, een overstroming, een lawine of stenen die van een berg vallen.",
    aandachtspunten: [
      "Gedekt zijn: hagel, instorting door een natuurverschijnsel, een lawine, een overstroming, stenen die van een berg of natuurlijke helling vallen, een uitbarsting van een vulkaan of geiser en een vloedgolf.",
      "Met overstroming bedoelt a.s.r. een overstroming door het bezwijken of overlopen van dijken, kaden, sluizen of andere waterkeringen, ook water dat via beschadigingen aan waterkeringen uitstroomt.",
      "Het maakt niet uit of de overstroming de oorzaak of het gevolg is van een gebeurtenis die verzekerd is.",
      "Een aardbeving of -verschuiving staat niet in deze lijst. Bij Casco beperkt staat die wel in de lijst.",
    ],
    klantinfo: ["Door welke natuurramp of oorzaak de schade is ontstaan."],
    vervolgvragen: [q("De klant noemt waterschade of schade zonder oorzaak", "Wat is de oorzaak van de schade?")],
    gerelateerd: ["cb-natuurramp"],
  }),

  "ca-ontploffing": b({
    uitleg: "Schade door ontploffing is verzekerd, ook als die komt door een eigen gebrek van de auto.",
    aandachtspunten: ["Een ontploffing is een plotselinge en hevige uitbarsting van gassen of dampen."],
    klantinfo: ["Wat er is ontploft en wat er is beschadigd."],
  }),

  "ca-overige-oorzaak": b({
    uitleg: "Schade door een andere oorzaak van buitenaf dan de gebeurtenissen die apart in de lijst staan, is ook verzekerd.",
    aandachtspunten: ["De uitsluitingen blijven gelden. Niet gedekt zijn onder meer normaal onderhoud, onvoldoende onderhoud, onvoldoende zorg en slijtage."],
    klantinfo: ["Wat er is gebeurd en waardoor de schade is ontstaan."],
    vervolgvragen: [q("De klant meldt schade die niet bij een bekende oorzaak past", "Wat is er precies gebeurd, en waar kwam de schade vandaan?")],
    gerelateerd: ["ca-dekking-overzicht"],
  }),

  "ca-rellen-vandalisme": b({
    uitleg: "Schade door rellen, relletjes en opstootjes is verzekerd. Schade door vandalisme is ook verzekerd. Dat is opzettelijke beschadiging door een ander.",
    direct: ["Bij vandalisme doe je direct aangifte bij de politie, uiterlijk binnen 14 dagen."],
    klantinfo: ["Wat er met de auto is gebeurd.", "Of er al aangifte is gedaan."],
    vervolgvragen: [q("De klant meldt vandalisme en het is niet bekend of er al aangifte is gedaan", "Heb je al aangifte gedaan bij de politie?")],
    gerelateerd: ["aangifte", "cb-rellen"],
  }),

  "ca-ruitschade": b({
    uitleg: "Een ruit of zonnedak dat plotseling breekt is verzekerd, net als schade door de scherven. Laat je het repareren of vervangen door een geselecteerd ruitschadeherstelbedrijf, dan regelt a.s.r. de betaling met dat bedrijf.",
    direct: ["Laat je het niet door een geselecteerd ruitschadeherstelbedrijf doen, dan verlaagt a.s.r. de vergoeding met € 500. Dat geldt niet bij een noodgeval in het buitenland waar zo'n bedrijf in Nederland niet kan."],
    aandachtspunten: [
      "Bij een geselecteerd bedrijf ben je de opdrachtgever, maar hoef je geen geld voor te schieten. Je betaalt alleen een eventueel eigen risico.",
      "Het eigen risico geldt niet bij het repareren van een ruit, wel bij vervangen.",
      "Je krijgt uitgebreide garantie. De bedrijven staan op www.glasgarant.nl.",
    ],
    klantinfo: ["Of de ruit nog te repareren is of vervangen moet worden."],
    vervolgvragen: [q("De klant meldt een kapotte ruit en het is niet bekend of die gerepareerd of vervangen wordt", "Is de ruit te repareren, of moet hij vervangen worden?")],
    gerelateerd: ["ca-eigen-risico", "cb-ruitschade"],
  }),

  "ca-takelen": b({
    uitleg: "Schade door takelen van de auto aan of van boord van een binnenvaartschip is verzekerd. Schade door takelen in alle andere gevallen krijg je niet vergoed.",
    aandachtspunten: ["Ook schrammen, krassen en lakschade krijg je niet vergoed."],
    klantinfo: ["Waar en waarom de auto is getakeld."],
    vervolgvragen: [q("De klant meldt schade door takelen zonder context", "Is de auto getakeld aan of van boord van een binnenvaartschip, of ergens anders?")],
  }),

  "ca-transport": b({
    uitleg: "Schade door een oorzaak van buitenaf tijdens vervoer van de auto door een transportondernemer is verzekerd. Rijden met de auto zelf valt hier niet onder.",
    aandachtspunten: ["Met vervoer bedoelt a.s.r. vervoer door een ander transportmiddel."],
    klantinfo: ["Hoe de auto werd vervoerd en door wie."],
    gerelateerd: ["cb-transport"],
  }),

  "ca-eigen-risico": b({
    uitleg: "Heb je een eigen risico, dan staat het bedrag op je polisblad. A.s.r. trekt het af van de schadevergoeding.",
    aandachtspunten: [
      "Het eigen risico geldt niet voor Hulpverlening en niet voor de keuzedekking Pechhulp.",
      "Het geldt niet bij het repareren van een autoruit of zonnedak, wel bij vervangen.",
      "Bij Casco allrisk kan er een extra jeugd eigen risico bijkomen.",
      "Een eigen risico op een andere verzekering vergoedt a.s.r. niet.",
    ],
    klantinfo: ["Wat voor schade het is.", "Het bedrag van het eigen risico op het polisblad."],
    vervolgvragen: [q("De klant vraagt hoeveel eigen risico er geldt", "Staat er een eigen risico op je polisblad, en hoe hoog is dat?")],
    gerelateerd: ["ca-jeugd-eigen-risico", "cb-eigen-risico", "ca-ruitschade"],
  }),

  "ca-jeugd-eigen-risico": b({
    uitleg: "Bij een aanrijding of botsing kan een extra eigen risico van € 250 gelden voor een jeugdige bestuurder. Dat komt boven op het eigen risico op je polisblad.",
    direct: ["Het extra eigen risico geldt als de vaste bestuurder op je polisblad 24 jaar of ouder is, maar de bestuurder op dat moment jonger was dan 24."],
    aandachtspunten: [
      "Het geldt bij een aanrijding, botsing, in het water raken, omslaan, slippen of van de weg raken.",
      "Het geldt ook als iemand de auto onder toezicht bestuurt en de toezichthouder jonger is dan 24 jaar. De toezichthouder wordt daarvoor niet betaald.",
      "Het komt ook boven op het eigen risico als op je polisblad staat dat je geen eigen risico hebt.",
      "Bij een botsing met vogels of loslopende dieren geldt het niet, wel als de bestuurder daardoor tegen iets anders botst.",
    ],
    klantinfo: ["Hoe oud de bestuurder was.", "Of de vaste bestuurder op het polisblad 24 jaar of ouder is."],
    vervolgvragen: [
      q("Het gaat om een jonge bestuurder en het is niet bekend hoe oud de vaste bestuurder op het polisblad is", "Hoe oud is de vaste bestuurder op je polisblad, en hoe oud was degene die reed?"),
    ],
    gerelateerd: ["ca-aanrijding", "ca-eigen-risico"],
  }),

  "ca-noclaim-geen-gevolg": b({
    brontekstSoort: "samenvatting",
    uitleg: "Sommige schades tellen niet mee voor je no-claimladder en je schadevrije jaren, bijvoorbeeld als a.s.r. de schade volledig op iemand anders kan verhalen. Dan houd je je trede.",
    aandachtspunten: [
      "Het hele bedrag is door iemand op wie a.s.r. kon verhalen terugbetaald, of helemaal verhaald op het Waarborgfonds Motorverkeer.",
      "Je betaalt het volledige bedrag binnen 12 maanden na de laatste betaling van a.s.r. zelf terug.",
      "Schade door blikseminslag, brand, diefstal van de auto of de sleutels, inbraak, joyriden, kortsluiting, luchtverkeer, een natuurramp, ontploffing, rellen, ruitschade, storm, vervoer door een transportondernemer en bevriezing daardoor telt niet mee.",
      "Een botsing met vogels of loslopende dieren telt niet mee, maar niet als je daardoor tegen iets anders botst.",
      "Een aanrijding met een fietser of voetganger telt niet mee als je kunt aantonen dat de bestuurder niets te verwijten is.",
      "Als a.s.r. alleen betaalt voor hulpverlening, pechhulp, de kosten uit hoofdstuk 4.4 of expertisekosten, telt het ook niet mee.",
    ],
    klantinfo: ["Om wat voor schade het gaat en wat er is gebeurd."],
    vervolgvragen: [q("De klant vraagt of een schade invloed heeft op zijn no-claim en het is niet bekend wat er gebeurd is", "Wat voor schade was het, en wat is er gebeurd?")],
    gerelateerd: ["ca-noclaim-wa-schade", "noclaim-geen-gevolg"],
    controle: HANDMATIG("Lange lijst met uitzonderingen, hier samengevat. De chat mag alleen zeggen dat een schade niet meetelt als de gebeurtenis in de lijst staat. Laat een medewerker de samenvatting naast de voorwaarden leggen."),
  }),

  "ca-noclaim-wa-schade": b({
    uitleg: "Betaalt a.s.r. een schade onder je WA-verzekering, dus schade aan anderen? Dan kan dat gevolgen hebben voor je trede op de no-claimladder en je schadevrije jaren.",
    aandachtspunten: [
      "Dat kan ook je premie voor Casco allrisk veranderen.",
      "Of het zo is, staat in de WA-voorwaarden, in het hoofdstuk 'Hoe werkt de no-claimregeling?'.",
    ],
    klantinfo: ["Om wat voor schade het gaat."],
    gerelateerd: ["ca-noclaim-geen-gevolg", "cb-noclaim-wa-schade"],
  }),

  "ca-begrippen": b({
    brontekstSoort: "samenvatting",
    uitleg: "In de begrippenlijst van Casco allrisk staat wat woorden betekenen, zoals eigen gebrek, motor, transmissie, aandrijving, dagwaarde, nieuwwaarde en total loss.",
    aandachtspunten: [
      "Eigen gebrek is een gebrek van de auto zelf. Het heeft niets te maken met normale slijtage, overbelasting of onvoldoende onderhoud.",
      "Motor is de motor met alle inwendige onderdelen, het brandstofsysteem, de distributie, het koelsysteem, de spruitstukken, de turbo, de ventilator en het vliegwiel.",
      "Elektrische installatie is de dynamo, de spanningsregelaar en de startmotor.",
      "Transmissie is het versnellingsbakhuis met alle inwendige onderdelen, de hulpversnellingsbak, de koppelingsplaat met drukgroep en de koppelomvormer.",
      "Aandrijving is de aandrijfassen, het as- en differentieelhuis voor en achter met alle inwendige onderdelen, de kruiskoppelingen, de naven en de wiellagers.",
      "Dagwaarde is de verkoopwaarde van de auto net voor de schade.",
      "Nieuwwaarde is de prijs van een nieuwe auto van hetzelfde merk, type en uitvoering volgens de laatst bekende prijslijst, inclusief afleveringskosten en verwijderingsbijdrage.",
      "Waarborgfonds Motorverkeer is de organisatie waarop a.s.r. in bepaalde gevallen schade kan verhalen, bijvoorbeeld als de schadeveroorzaker onbekend is.",
      "Een geselecteerd herstelbedrijf is een bedrijf waar a.s.r. mee samenwerkt, waardoor reparaties goedkoper zijn.",
    ],
    klantinfo: ["Welk woord de klant wil begrijpen."],
    vervolgvragen: [q("De klant vraagt naar een begrip zonder het te noemen", "Welk woord of begrip wil je uitgelegd hebben?")],
    gerelateerd: ["ca-motor", "cb-begrippen"],
  }),

  "ca-voor-en-nadelen": b({
    brontekstSoort: "samenvatting",
    uitleg: "Allrisk is de meest uitgebreide dekking: ook schade aan je eigen auto door een aanrijding of vandalisme is verzekerd, ook als je die zelf veroorzaakt. Een eventueel eigen risico gaat af van de vergoeding, en normaal onderhoud en slijtage zijn niet gedekt.",
    aandachtspunten: [
      "Voordeel: je hebt ook alles van Casco beperkt: brand, storm en natuur, ruitschade, diefstal en standaard 1 jaar nieuwwaarde.",
      "Voordeel: schade aan motor, aandrijving, elektrische installatie en transmissie door een eigen gebrek is verzekerd, maar alleen onder strikte voorwaarden over de leeftijd en de kilometers van de auto en over het onderhoud.",
      "Voordeel: je krijgt no-claimkorting tot 75%.",
      "Nadeel: allrisk is niet verplicht. Een eigen risico op je polisblad gaat af van de vergoeding.",
      "Nadeel: bij een aanrijding, botsing of slippen kan een extra jeugd eigen risico van € 250 gelden. Dat is zo als de vaste bestuurder op je polisblad 24 jaar of ouder is en de bestuurder jonger dan 24 jaar.",
      "Nadeel: schade die je met opzet veroorzaakt is nooit verzekerd.",
      "Nadeel: normaal onderhoud, onvoldoende onderhoud, onvoldoende zorg en slijtage zijn niet gedekt.",
      "Klanten kiezen meestal WA + Casco allrisk bij een auto van 0 tot en met 5 jaar oud, met een hoge dagwaarde, als ze zekerheid willen bij onverwachte schade en schade aan hun eigen auto niet zelf willen betalen. A.s.r. geeft geen persoonlijk advies.",
    ],
    klantinfo: ["Hoe oud de auto is.", "Wie de auto bestuurt en hoe oud die persoon is."],
    vervolgvragen: [q("De klant vraagt naar voor- en nadelen en het is niet bekend hoe oud de auto is", "Hoe oud is je auto?")],
    gerelateerd: ["ca-dekking-overzicht", "ca-jeugd-eigen-risico", "ca-motor"],
    controle: {
      status: "gecontroleerd",
      opmerking: "Samenvatting, samengesteld uit sw-ca-wat-is, sw-ca-verzekerd, sw-ca-eigen-schuld, ca-dekking-overzicht, ca-motor en ca-jeugd-eigen-risico; elke bewering is nagelopen. Bewust niet opgenomen: een premievergelijking met WA of Casco beperkt (de kennisbank noemt geen premies).",
    },
  }),
};
