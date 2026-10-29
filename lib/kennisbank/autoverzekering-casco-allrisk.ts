import type { KennisItem } from "./types";

/**
 * Voorwaarden Autoverzekering Casco Allrisk "Ik kies zelf" van a.s.r., D AU-CA 2017-01 (41 pagina's). Alleen de
 * onderdelen die in dit document anders of aanvullend zijn staan hier. Passages die gelijk zijn aan die in de
 * WA- of Casco Beperkt-voorwaarden (uitsluitingen, hulpverlening, pechhulp, waarde van de auto, verplichtingen, de
 * no-claimladder en de tabel schadevrije jaren) staan één keer in de kennisbank en worden in index.ts aan dit
 * document gekoppeld.
 */
export const KENNISBANK_CASCO_ALLRISK: KennisItem[] = [
  {
    id: "ca-dekking-overzicht",
    artikelen: { "casco-allrisk": "3 en 3.1 Dekking Casco Allrisk voor de auto" },
    trefwoorden: ["wat dekt casco allrisk", "wat is casco allrisk", "casco allrisk", "all risk", "allrisk", "all-risk", "wa casco allrisk", "wat is gedekt allrisk", "dekking allrisk", "welke schade allrisk", "wat vergoedt allrisk", "wat dekt all risk", "wat dekt allrisk", "wat is allrisk", "wat is all-risk", "alle risico"],
    tekst:
      "Met Casco Allrisk ben je verzekerd voor schade aan je auto (beschadiging, vernietiging of diefstal), schade aan de extra's en hulpverlening. Het moet gaan om een plotselinge en onvoorziene gebeurtenis tijdens de looptijd van de verzekering; schade door langzaam inwerkende processen valt hier niet onder. Gedekt zijn schade door: een aanrijding, botsing, in het water raken, omslaan, slippen of van de weg raken; bevriezing (als gevolg van een verzekerde gebeurtenis); blikseminslag; brand; (poging tot) diefstal, inbraak of joyrijden; diefstal van sleutels; kortsluiting; luchtverkeer; materiaal- of constructiefouten of een eigen gebrek; beschadiging van motor, aandrijving, elektrische installatie en/of transmissie door een eigen gebrek (onder voorwaarden); natuurramp; ontploffing; een overige oorzaak van buitenaf; rellen; ruitschade; storm; takelen aan of van boord van een binnenvaartschip; vandalisme; en een oorzaak van buitenaf tijdens vervoer door een transportondernemer. Naast de uitsluitingen bij elke gebeurtenis gelden de algemene uitsluitingen uit de Algemene voorwaarden. Niet gedekt zijn onder meer normaal onderhoud, onvoldoende onderhoud, onvoldoende zorg en slijtage. Vraag me gerust naar een bepaalde gebeurtenis.",
  },
  {
    id: "ca-aanrijding",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 1 - aanrijding, botsing, in het water raken, omslaan, slippen of van de weg raken" },
    trefwoorden: ["te water geraakt", "te water", "in de sloot", "sloot ingereden", "in het water beland", "aanrijding", "aangereden", "botsing", "botsen", "ongeluk", "ongeval", "in het water raken", "water in gereden", "omslaan", "omgeslagen", "slippen", "geslipt", "van de weg raken", "van de weg af", "uit de bocht", "tegen een paal", "tegen een muur", "tegen een boom", "tegen een andere auto", "aanrijding met een andere auto", "dier", "dieren", "een ree", "een hert", "wild aangereden", "eigen schuld", "zelf schuld", "schade door aanrijding", "frontale botsing", "flankschade"],
    tekst:
      "Je bent verzekerd voor schade door een aanrijding, een botsing, in het water raken, omslaan, slippen of van de weg raken, ook als dit is ontstaan door een eigen gebrek van de auto. Met eigen gebrek bedoelen wij een gebrek van de auto zelf, bijvoorbeeld door een natuurlijke eigenschap of slechte kwaliteit; een eigen gebrek heeft niets te maken met normale slijtage, overbelasting of onvoldoende onderhoud. Je krijgt geen vergoeding voor het onderdeel zelf waarin het eigen gebrek zit. Bij een botsing met vogels of loslopende dieren geldt het extra jeugd eigen risico niet, wel voor schade doordat de bestuurder door die botsing tegen iets anders botst of iets anders raakt.",
  },
  {
    id: "ca-materiaalfouten",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 9 - materiaal- of constructiefouten of een eigen gebrek" },
    trefwoorden: ["materiaalfout", "materiaalfouten", "constructiefout", "constructiefouten", "constructiefout auto", "fabricagefout", "productiefout", "eigen gebrek", "gebrek aan de auto", "defect onderdeel", "fabrieksfout"],
    tekst:
      "Je bent verzekerd voor schade als gevolg van materiaal- of constructiefouten of een eigen gebrek. Je krijgt geen vergoeding voor het onderdeel zelf waarin de materiaal- of constructiefout of het eigen gebrek zit. Met eigen gebrek bedoelen wij een gebrek van de auto zelf dat niets te maken heeft met normale slijtage, overbelasting of onvoldoende onderhoud.",
  },
  {
    id: "ca-motor",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 10 - motor, aandrijving, elektrische installatie en/of transmissie" },
    trefwoorden: ["motorschade", "motor kapot", "motor defect", "motorblok", "aandrijving", "transmissie", "versnellingsbak", "elektrische installatie", "dynamo", "startmotor", "spanningsregelaar", "turbo", "koppeling", "koppelomvormer", "distributie", "koelsysteem", "brandstofsysteem", "100.000 kilometer", "100000 km", "36 maanden oud", "bovag", "merkdealer", "onderhoud volgens fabrikant", "verbrande kleppen", "klepzetels", "motor", "versnellingsbakhuis", "differentieel", "wiellagers", "kruiskoppelingen"],
    tekst:
      "Je bent verzekerd voor beschadiging van de motor, de aandrijving, de elektrische installatie en/of de transmissie van de auto door een eigen gebrek. Met motor bedoelen wij de motor met alle inwendige onderdelen, het brandstofsysteem, de distributie, het koelsysteem, de spruitstukken, de turbo, de ventilator en het vliegwiel; met elektrische installatie de dynamo, de spanningsregelaar en de startmotor; met transmissie het versnellingsbakhuis met alle inwendige onderdelen, de hulpversnellingsbak, de koppelingsplaat met drukgroep en de koppelomvormer; met aandrijving de aandrijfassen, het as- en differentieelhuis voor en achter met alle inwendige onderdelen, de kruiskoppelingen, de naven en de wiellagers. Een eigen gebrek is een gebrek van het onderdeel zelf, bijvoorbeeld door een natuurlijke eigenschap of slechte kwaliteit, en heeft niets te maken met normale slijtage, overbelasting of onvoldoende onderhoud. Deze dekking geldt alleen als de auto nieuw was op de afgiftedatum, als de auto op het moment van de gebeurtenis niet ouder is dan 36 maanden, als met de auto niet meer is gereden dan 100.000 kilometer, als het onderhoud aantoonbaar is gebeurd volgens de voorschriften van de fabrikant en als het onderhoud is verricht door een bedrijf dat is erkend door de BOVAG of door de officiële merkdealer. Met afgiftedatum bedoelen wij de datum van afgifte op het kentekenbewijs dat in Nederland op je naam is afgegeven. Je krijgt geen vergoeding voor verbrande kleppen en verbrande klepzetels, en niet voor schade aan de elektronische componenten van de motor.",
  },
  {
    id: "ca-natuurramp",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 11 - natuurramp" },
    trefwoorden: ["natuurramp", "natuurgeweld", "hagel", "hagelschade", "overstroming", "water in de auto", "lawine", "vulkaan", "geiser", "vloedgolf", "instorting", "stenen van een berg", "hoogwater", "dijk", "aardbeving"],
    tekst:
      "Je bent verzekerd voor schade door de volgende natuurrampen: hagel, instorting door een natuurverschijnsel, een lawine, een overstroming, stenen die van een berg of natuurlijke helling vallen, een uitbarsting van een vulkaan of geiser en een vloedgolf. Met overstroming bedoelen wij overstroming die het gevolg is van het bezwijken of overlopen van dijken, kaden, sluizen of andere waterkeringen, ook het uitstromen van water via beschadigingen aan waterkeringen. Het maakt niet uit of de overstroming de oorzaak of het gevolg is van een gebeurtenis die door de verzekering gedekt wordt. Een aardbeving of -verschuiving staat niet in deze lijst, anders dan bij Casco Beperkt.",
  },
  {
    id: "ca-ontploffing",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 13 - ontploffing" },
    trefwoorden: ["ontploffing", "ontploft", "explosie"],
    tekst:
      "Je bent verzekerd voor schade door ontploffing, ook als die is ontstaan door een eigen gebrek van de auto. Met ontploffing bedoelen wij een plotselinge en hevige uitbarsting van gassen of dampen.",
  },
  {
    id: "ca-overige-oorzaak",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 16 - overige oorzaak van buitenaf" },
    trefwoorden: ["overige oorzaak", "oorzaak van buitenaf", "andere oorzaak van buitenaf", "iets anders", "overige schade", "niet genoemde gebeurtenis", "wat valt er nog meer onder", "alle andere schade"],
    tekst: "Je bent verzekerd voor schade veroorzaakt door een andere oorzaak van buitenaf dan degene die apart zijn genoemd in de tabel met verzekerde gebeurtenissen.",
  },
  {
    id: "ca-rellen-vandalisme",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 17 en 22 - rellen en vandalisme" },
    trefwoorden: ["bekrast", "bekrassen", "auto bekrast", "lak bekrast", "rellen", "relletjes", "opstootjes", "vandalisme", "vernieling", "opzettelijke beschadiging", "kras gekrast", "autosleutel over de lak", "beschadigd door een buurman", "vandalisme auto", "gekrast"],
    tekst:
      "Je bent verzekerd voor schade door rellen, relletjes en opstootjes, en voor schade door vandalisme. Met vandalisme bedoelen wij opzettelijke beschadiging door een derde. Bij vandalisme moet je direct, maar uiterlijk binnen 14 dagen, aangifte doen bij de politie.",
  },
  {
    id: "ca-ruitschade",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 18 en 4.2 Ruitschade" },
    trefwoorden: ["ruit", "ruitschade", "voorruit", "autoruit", "glasschade", "steenslag", "scheur in de ruit", "panoramadak", "zonnedak", "scherven", "glasgarant", "ruit vervangen", "ruit repareren", "ruit kapot"],
    tekst:
      "Je bent verzekerd voor het plotseling en onvoorzien breken van de autoruit of het panorama- of zonnedak, en voor schade aan de auto door scherven daarvan, ook als de schade is ontstaan door een eigen gebrek van de auto. Wij vergoeden de kosten van repareren of vervangen door een geselecteerd ruitschadeherstelbedrijf. Laat je het niet door een geselecteerd ruitschadeherstelbedrijf doen, dan verlagen wij de schadevergoeding met € 500; behalve bij een noodgeval in het buitenland waarbij reparatie of vervanging door een geselecteerd bedrijf in Nederland niet mogelijk is. Bij een geselecteerd bedrijf wikkelen wij de schade rechtstreeks af (jij bent wel de opdrachtgever maar hoeft geen geld voor te schieten, alleen een eventueel eigen risico te betalen) en krijg je uitgebreide garantie. De gegevens vind je op www.glasgarant.nl. Het eigen risico geldt niet bij het repareren van een autoruit of panorama- of zonnedak, maar wel bij vervangen.",
  },
  {
    id: "ca-takelen",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 21 - takelen" },
    trefwoorden: ["takelen", "getakeld", "binnenvaartschip", "boot", "schip", "aan boord", "van boord", "kraan"],
    tekst:
      "Je bent verzekerd voor schade die ontstaat door takelen van de auto aan of van boord van een binnenvaartschip. Je krijgt geen vergoeding voor schade die ontstaat door takelen in alle andere gevallen, en niet voor schrammen, krassen of lakschade.",
  },
  {
    id: "ca-transport",
    artikelen: { "casco-allrisk": "3.1 Gebeurtenis 23 - vervoer door een transportondernemer" },
    trefwoorden: ["transportondernemer", "autotransport", "vervoer per vrachtwagen", "autotrein", "ferry", "verscheept", "vervoerd per schip", "transport auto", "oplegger"],
    tekst:
      "Je bent verzekerd voor schade door een oorzaak van buitenaf tijdens het vervoer van de auto door een transportondernemer. Met vervoer bedoelen wij vervoer door een ander transportmiddel, dus niet het rijden met de auto zelf.",
  },
  {
    id: "ca-eigen-risico",
    artikelen: { "casco-allrisk": "4.6 Eigen risico" },
    trefwoorden: ["eigen risico", "eigen bijdrage", "zelf betalen", "hoeveel eigen risico", "eigen risico casco", "eigen risico ruit", "eigen risico pechhulp", "excess", "franchise", "eigen risico allrisk", "eigen risico all risk"],
    tekst:
      "Heb je een eigen risico, dan staat dat met het bedrag op je polisblad. Dit eigen risico trekken we af van de schadevergoeding, ook in het geval van een maximum verzekerd bedrag. Het eigen risico geldt niet voor de dekking Hulpverlening, niet voor de keuzedekking Pechhulp, niet voor de schadevergoeding voor reparatie van een autoruit of panorama- of zonnedak (maar wel bij vervangen) en niet voor de kosten uit hoofdstuk 4.4. Bij Casco Allrisk kan daar een extra jeugd eigen risico bijkomen. Een eigen risico op een andere verzekering vergoeden wij niet.",
  },
  {
    id: "ca-jeugd-eigen-risico",
    artikelen: { "casco-allrisk": "4.6 Jeugd eigen risico" },
    trefwoorden: ["jeugd eigen risico", "jeugd", "jeugdige bestuurder", "mijn zoon", "mijn dochter", "zoon van", "dochter van", "jeugdig eigen risico", "extra eigen risico", "jonge bestuurder", "jonger dan 24", "24 jaar", "jong rijden", "zoon rijdt", "dochter rijdt", "kind rijdt", "jongere", "jongeren", "250 euro eigen risico", "toezichthouder jonger", "begeleid rijden jonger", "beginnende bestuurder"],
    tekst:
      "Bij Casco Allrisk geldt bij een aanrijding, botsing, in het water raken, omslaan, slippen of van de weg raken een extra eigen risico van € 250 voor een jeugdige bestuurder. Dat is zo als de regelmatige bestuurder die op je polisblad staat op het moment van de gebeurtenis 24 jaar of ouder is maar de werkelijke bestuurder van de auto jonger dan 24 jaar, of als de bestuurder de auto onder toezicht bestuurt (volgens de wettelijke regels en zonder de toezichthouder te betalen) en de toezichthouder jonger is dan 24 jaar. Dit extra eigen risico komt boven op het eigen risico op je polisblad, ook als op je polisblad staat dat je geen eigen risico hebt. Het geldt niet bij een botsing met vogels of loslopende dieren, maar wel voor schade die ontstaat doordat de bestuurder door die botsing tegen iets anders botst of iets anders raakt.",
  },
  {
    id: "ca-noclaim-geen-gevolg",
    artikelen: { "casco-allrisk": "7.3 Schade zonder gevolgen voor de no-claimladder en de tabel schadevrije jaren" },
    trefwoorden: ["telt niet mee", "tellen niet mee", "schade zonder gevolgen", "geen gevolgen voor no-claim", "no-claim behouden", "no claim behouden", "trede behouden", "verhaald", "waarborgfonds", "fietser", "voetganger", "terugbetaald", "zelf betaald", "welke schade telt mee", "welke schade telt niet mee", "mee voor mijn no claim", "mee voor mijn no-claim", "mee voor no-claim", "mee voor je no-claim", "tellen mee", "meetellen", "telt schade mee", "telt mee", "hagelschade no-claim", "stormschade no-claim", "ruitschade no-claim", "diefstal no-claim", "invloed op no-claim", "gevolgen voor no-claim", "no-claim allrisk", "no claim allrisk", "schadevrije jaren allrisk"],
    tekst:
      "Deze gevallen tellen niet mee als schade voor de no-claimladder en de tabel schadevrije jaren: wij keren geen schadevergoeding uit en verwachten dat ook niet; het hele bedrag is door iemand op wie wij konden verhalen terugbetaald; het bedrag is helemaal verhaald op het Waarborgfonds Motorverkeer (het eigen risico van het fonds tellen we niet mee); wij betalen alleen omdat dit met een andere verzekeraar is afgesproken; wij kunnen de schade volgens de wet niet (helemaal) verhalen; je betaalt het volledige bedrag binnen 12 maanden na onze laatste betaling terug; wij betalen voor een aanrijding met een fietser of voetganger en je kunt aantonen dat de bestuurder niets te verwijten is. Ook schade door blikseminslag, brand, diefstal van de auto of de sleutels, inbraak of joyrijden (en schade tijdens de periode van diefstal), kortsluiting, luchtverkeer, een natuurramp, ontploffing, rellen, ruitschade, storm, vervoer door een transportondernemer en bevriezing die daardoor ontstaat telt niet mee, en schade door een botsing met vogels of loslopende dieren (maar niet tegen iets anders botsen of iets anders raken door die botsing). Telt ook niet mee: als wij alleen een bedrag betalen voor hulpverlening, pechhulp, de kosten uit hoofdstuk 4.4 of expertisekosten.",
  },
  {
    id: "ca-noclaim-wa-schade",
    artikelen: { "casco-allrisk": "7.4 Schade die valt onder de WA-verzekering" },
    trefwoorden: ["schade aan een ander no-claim", "schade aan anderen no-claim", "wa schade no-claim", "gevolgen voor mijn no-claim", "wa schade allrisk", "wa-schade allrisk", "schade aan anderen allrisk", "invloed wa schade", "wa schade no-claim allrisk"],
    tekst:
      "Vergoeden wij een schade die valt onder de Autoverzekering Wettelijke Aansprakelijkheid (WA) van je auto, dus schade die met of door de auto aan anderen en hun spullen is toegebracht, dan kan dat gevolgen hebben voor je trede op de no-claimladder (en dus voor je premie voor Casco Allrisk) en voor je schadevrije jaren. Of die WA-schade gevolgen heeft staat in de WA-voorwaarden, in het hoofdstuk 'Hoe werkt de no-claimregeling?'.",
  },
  {
    id: "ca-begrippen",
    artikelen: { "casco-allrisk": "Begrippenlijst" },
    trefwoorden: ["begrip allrisk", "wat betekent allrisk", "begrippenlijst allrisk", "wat is een eigen gebrek", "wat is eigen gebrek", "wat is de aandrijving", "wat is de motor", "wat is transmissie", "wat is elektrische installatie", "wat is het waarborgfonds", "waarborgfonds motorverkeer", "wat is een eigen", "wat betekent eigen gebrek", "definitie allrisk", "wat bedoelen jullie met motor", "wat valt onder de motor"],
    tekst:
      "Uit de begrippenlijst van Casco Allrisk: Aandrijving is de aandrijfassen, het as- en differentieelhuis voor en achter met alle inwendige onderdelen, de kruiskoppelingen, de naven en de wiellagers. Eigen gebrek is een gebrek van de auto zelf dat niets te maken heeft met normale slijtage, overbelasting of onvoldoende onderhoud. Elektrische installatie is de dynamo, de spanningsregelaar en de startmotor. Motor is de motor met alle inwendige onderdelen, het brandstofsysteem, de distributie, het koelsysteem, de spruitstukken, de turbo, de ventilator en het vliegwiel. Transmissie is het versnellingsbakhuis met alle inwendige onderdelen, de hulpversnellingsbak, de koppelingsplaat met drukgroep en de koppelomvormer. Waarborgfonds Motorverkeer is de organisatie waarop wij in bepaalde gevallen schaden kunnen verhalen die zijn ontstaan door een motorrijtuig van een ander, die daarvoor aansprakelijk is; een van die gevallen is als er een onbekende schadeveroorzaker is. Beveiligingssysteem is een anti-diefstalsysteem met het VbV-SCM Keurmerk Voertuigbeveiliging (of een technisch gelijkwaardig systeem dat in de fabriek is ingebouwd). Dagwaarde is de verkoopwaarde van de auto net vóór de schade. Nieuwwaarde is de prijs van een nieuwe auto van hetzelfde merk, type en uitvoering volgens de laatst bekende prijslijst, inclusief afleveringskosten en verwijderingsbijdrage. Overstroming is een overstroming als gevolg van het bezwijken of overlopen van dijken, kaden, sluizen of andere waterkeringen. Total loss is technisch niet meer in een staat om veilig mee te rijden met onmogelijke of onverantwoorde reparatie, of reparatiekosten hoger dan 2/3 van de vastgestelde waarde (nieuwwaarde) of hoger dan het verschil tussen dagwaarde en restanten (dagwaarde). Vervangingswaarde is de waarde van een voorwerp van dezelfde soort, kwaliteit, staat en ouderdom, vlak voor de schade. Een geselecteerd (ruitschade)herstelbedrijf is een bedrijf waar wij mee samenwerken, waardoor reparaties goedkoper zijn.",
  },
];
