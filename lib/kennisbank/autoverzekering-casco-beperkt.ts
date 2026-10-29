import type { KennisItem } from "./types";

/**
 * Voorwaarden Autoverzekering Casco Beperkt "Ik kies zelf" van a.s.r., D AU-CB 2017-01 (36 pagina's). Alleen de
 * onderdelen die in dit document anders of aanvullend zijn staan hier; onderdelen met dezelfde tekst als in de
 * WA-voorwaarden staan één keer in autoverzekering-wa.ts en worden in index.ts aan dit document gekoppeld.
 */
export const KENNISBANK_CASCO_BEPERKT: KennisItem[] = [
  {
    id: "cb-wie-verzekerd",
    artikelen: { "casco-beperkt": "1 Wie zijn verzekerd?" },
    trefwoorden: ["casco wie is verzekerd", "casco wie zijn verzekerd", "casco verzekeringnemer", "casco bestuurder", "casco passagier"],
    tekst:
      "Bij Casco Beperkt zijn verzekerd: de persoon die op je polisblad staat als verzekeringnemer en eigenaar of houder is van de auto, de regelmatige bestuurder die op je polisblad staat, en de gemachtigde bestuurder en passagiers van de auto.",
  },
  {
    id: "cb-welke-auto",
    artikelen: { "casco-beperkt": "2.1 Welke auto is verzekerd?" },
    trefwoorden: ["cataloguswaarde", "catalogusprijs", "welke onderdelen", "fabrieksopties", "ingebouwde audio", "ingebouwde navigatie", "onderdelen van de auto", "casco welke auto"],
    tekst:
      "Verzekerd is de auto die op je polisblad staat, waarvoor de bestuurder een rijbewijs voor categorie B of B/E nodig heeft, met een geldig Nederlands kentekenbewijs van de RDW en bestemd en ingericht voor vervoer van maximaal 9 personen. Onder de auto vallen ook alle onderdelen die zijn opgenomen in de cataloguswaarde op je polisblad (die je bij de aanvraag hebt opgegeven), zoals door de fabriek ingebouwde audio- of navigatieapparatuur.",
  },
  {
    id: "cb-dekking-overzicht",
    artikelen: { "casco-beperkt": "3 en 3.1 Dekking Casco Beperkt (schade aan de eigen auto)" },
    trefwoorden: ["wat dekt casco", "wat is casco", "casco beperkt", "wa casco", "wat is gedekt casco", "welke schade casco", "wat vergoedt casco", "dekking casco", "casco dekking", "schade aan de eigen auto", "schade aan mijn eigen auto", "schade aan mijn auto", "eigen auto", "aanrijding", "aangereden", "ongeluk", "ongeval", "frontale botsing", "tegen een muur", "tegen een paal", "tegen een andere auto"],
    tekst:
      "Met Casco Beperkt ben je verzekerd voor schade aan je auto (beschadiging, vernietiging of diefstal), schade aan de extra's en hulpverlening. Het moet gaan om een plotselinge en onvoorziene gebeurtenis tijdens de looptijd van de verzekering; schade door langzaam inwerkende processen valt hier niet onder. Gedekt zijn schade door: bevriezing (als gevolg van een verzekerde gebeurtenis), blikseminslag, botsing met dieren, brand, (poging tot) diefstal, inbraak of joyrijden, diefstal van sleutels, kortsluiting, luchtverkeer, natuurramp, ontploffing, rellen, ruitschade, storm en een oorzaak van buitenaf tijdens vervoer door een transportondernemer. Naast de uitsluitingen bij elke gebeurtenis gelden de algemene uitsluitingen uit de Algemene voorwaarden. Schade door een aanrijding met een ander voertuig staat niet in deze lijst; die is wel verzekerd met Casco Allrisk. Vraag me gerust naar een bepaalde gebeurtenis.",
  },
  {
    id: "cb-extras",
    artikelen: { "casco-beperkt": "3, 3.2 en 4.3 Extra's" },
    trefwoorden: ["extra's", "extras", "extra s", "automatten", "gevarendriehoek", "verbanddoos", "brandblusapparaat", "pechlamp", "startkabel", "veiligheidsvest", "later ingebouwd", "achteraf ingebouwd", "audioapparatuur", "dashcam", "losse apparatuur", "mobiele telefoon", "navigatieapparatuur"],
    tekst:
      "Extra's zijn alles wat niet vanuit de fabriek of importeur onderdeel van de auto is maar later is ingebouwd of gemonteerd, bijvoorbeeld door een dealer of garage, en losse onderdelen die alleen bij de auto horen, zoals automatten, brandblusapparaat, gevarendriehoek, pechlamp, sleep- en startkabel, veiligheidsvest en verbanddoos. Opties die een dealer of garage heeft ingebouwd maar die wel in de prijs van de fabrikant of importeur zitten, zijn geen extra's. Cd's, mobiele telefoons en losse geluids-, zend-, navigatie- en (hand)computerapparatuur zijn ook geen extra's. Extra's zijn verzekerd voor dezelfde gebeurtenissen als de auto, standaard tot maximaal € 1.000 (per gebeurtenis het bedrag op je polisblad als Extra's voor meer zijn verzekerd), en voor beeld-, geluids- en navigatieapparatuur nooit meer dan € 500. Raken extra's beschadigd, dan vergoeden wij de reparatie, of de vervangingswaarde als repareren duurder is of niet kan; bij diefstal vergoeden wij de vervangingswaarde, alleen als je direct na de diefstal aangifte hebt gedaan bij de politie (bewijs sturen). De uitsluitingen uit 3.1 gelden ook voor extra's.",
  },
  {
    id: "cb-bevriezing",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 1 - bevriezing" },
    trefwoorden: ["bevriezing", "bevroren", "vorst", "vorstschade", "bevriezen", "koelvloeistof bevroren"],
    tekst: "Je bent verzekerd voor schade door bevriezing die ontstaat door een verzekerde gebeurtenis die in de tabel van hoofdstuk 3.1 is genoemd.",
  },
  {
    id: "cb-bliksem",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 2 - blikseminslag" },
    trefwoorden: ["bliksem", "blikseminslag", "onweer", "ingeslagen"],
    tekst: "Je bent verzekerd voor schade door blikseminslag.",
  },
  {
    id: "cb-dieren",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 3 - botsing met dieren" },
    trefwoorden: ["dier", "dieren", "wild aangereden", "everzwijn", "vogel", "paard", "een ree", "een hert", "een koe", "een vos", "een das", "een hond", "een kat", "een konijn", "een haas", "een schaap", "schaap", "hond aangereden", "aanrijding met een dier", "botsing met"],
    tekst:
      "Je bent verzekerd voor schade door een botsing met vogels of loslopende dieren. Je krijgt geen vergoeding voor schade die ontstaat doordat je door die botsing tegen iets anders botst of iets anders raakt.",
  },
  {
    id: "cb-brand",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 4 - brand" },
    trefwoorden: ["brand", "autobrand", "zelfontbranding", "eigen gebrek", "blussen", "brandschade", "vlammen", "in brand"],
    tekst:
      "Je bent verzekerd voor schade door brand of zelfontbranding, ook als die is ontstaan door een eigen gebrek van de auto. We vergoeden ook de schade die ontstaat door het blussen van de brand. Met brand bedoelen wij een vuur dat ontstaat door verbranding buiten een haard, dat met vlammen gepaard gaat en dat in staat is zich op eigen kracht te verspreiden. Met eigen gebrek bedoelen wij een gebrek van de auto zelf, bijvoorbeeld door een natuurlijke eigenschap of slechte kwaliteit; een eigen gebrek heeft niets te maken met normale slijtage, overbelasting of onvoldoende onderhoud. Je krijgt geen vergoeding voor het onderdeel zelf waarin het eigen gebrek zit.",
  },
  {
    id: "cb-diefstal",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 5 - diefstal, inbraak of joyrijden" },
    trefwoorden: ["diefstal", "gestolen", "inbraak", "joyrijden", "autodiefstal", "ingebroken", "beveiligingssysteem", "inbraakalarm", "vbv", "keurmerk", "peilzender", "voertuigvolgsysteem", "tracker", "sleutels in de auto", "auto niet afgesloten", "braakschade", "diefstal van mijn auto"],
    tekst:
      "Je bent verzekerd voor schade door (poging tot) diefstal, inbraak of joyrijden. Met diefstal bedoelen wij het stelen door anderen, of het kwijtraken door verduistering of oplichting. Moet je auto een beveiligingssysteem hebben, dan staat dat met de verplichtingen op je polisblad; dat is een anti-diefstalsysteem met het VbV-SCM Keurmerk Voertuigbeveiliging (goedgekeurd door het VbV, geïnstalleerd door een door het VbV erkend inbouwbedrijf en voorzien van een certificaat van Kiwa SCM), of een technisch gelijkwaardig systeem dat in de fabriek is ingebouwd. De bestuurder of gebruiker moet er alles aan doen om diefstal of joyrijden te voorkomen, anders krijg je geen vergoeding; dat geldt bijvoorbeeld als de auto onbeheerd en niet afgesloten of met de sleutels erin of erop is achtergelaten, of als de sleutels in de brievenbus van een garage- of schadeherstelbedrijf zijn achtergelaten. Als verzekeringnemer ben je wel verzekerd als je kunt aantonen dat je niets wist van deze situatie, of dat het tegen je wil gebeurde en je niets te verwijten valt. Voldoe je niet aan de eisen en verplichtingen voor het beveiligingssysteem op je polisblad, dan krijg je geen vergoeding voor schade door diefstal of joyrijden, door inbraak (bij een verplicht systeem waarbij een alarm afgaat) en door oplichting en verduistering (bij een verplicht voertuigvolgsysteem of peilzender). Diefstal- en inbraakmeldingen van goedgekeurde voertuigvolgsystemen moeten worden behandeld door meldkamers die door het Ministerie van Veiligheid en Justitie zijn erkend.",
  },
  {
    id: "cb-sleutels",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 6 - diefstal sleutels" },
    trefwoorden: ["sleutel", "sleutels", "autosleutel", "sleutel is gestolen", "sleutels zijn gestolen", "sleutels gestolen", "sleutel kwijt", "sleutel verloren", "nieuwe sloten", "omcoderen", "startonderbreker", "start-onderbreker", "sleutel gestolen"],
    tekst:
      "Bij diefstal van de autosleutels ben je verzekerd voor de kosten van het vervangen van de sleutels, het aanbrengen van nieuwe sloten in de auto en het omcoderen van de start-onderbreker, tot maximaal € 500. Dit geldt alleen als je nog dezelfde dag (of, bij diefstal 's avonds of 's nachts, de volgende ochtend) aangifte hebt gedaan bij de politie en ons daarvan een bewijs stuurt, en als de vervanging van sleutels/sloten en/of omcodering binnen 24 uur na de diefstal heeft plaatsgevonden. Let op: verlies van de autosleutels is niet verzekerd.",
  },
  {
    id: "cb-kortsluiting",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 7 - kortsluiting" },
    trefwoorden: ["kortsluiting", "elektrische storing", "elektronica kapot", "elektrisch defect"],
    tekst: "Je bent verzekerd voor schade door kortsluiting, ook als die is ontstaan door een eigen gebrek van de auto. Je krijgt geen vergoeding voor het onderdeel zelf waarin het eigen gebrek zit.",
  },
  {
    id: "cb-luchtverkeer",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 8 - luchtverkeer" },
    trefwoorden: ["luchtverkeer", "luchtvaartuig", "vliegtuig", "helikopter", "drone", "neerstorten", "uit een vliegtuig"],
    tekst: "Je bent verzekerd voor schade door een luchtvaartuig dat neerstort of door vallende delen van een luchtvaartuig, en doordat er iets uit een luchtvaartuig valt of wordt gegooid.",
  },
  {
    id: "cb-natuurramp",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 9 - natuurramp" },
    trefwoorden: ["natuurramp", "natuurgeweld", "hagel", "hagelschade", "aardbeving", "overstroming", "water in de auto", "lawine", "vulkaan", "geiser", "vloedgolf", "aardverschuiving", "instorting", "stenen van een berg", "hoogwater", "dijk"],
    tekst:
      "Je bent verzekerd voor schade door de volgende natuurrampen: een aardbeving of -verschuiving, hagel, instorting door een natuurverschijnsel, een lawine, een overstroming, stenen die van een berg of natuurlijke helling vallen, een uitbarsting van een vulkaan of geiser en een vloedgolf. Met overstroming bedoelen wij overstroming die het gevolg is van het bezwijken of overlopen van dijken, kaden, sluizen of andere waterkeringen, ook het uitstromen van water via beschadigingen aan waterkeringen. Het maakt niet uit of de overstroming de oorzaak of het gevolg is van een gebeurtenis die door de verzekering gedekt wordt.",
  },
  {
    id: "cb-ontploffing",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 11 - ontploffing" },
    trefwoorden: ["ontploffing", "ontploft", "explosie", "opgeblazen motor", "opgeblazen"],
    tekst:
      "Je bent verzekerd voor schade door ontploffing, ook als die is ontstaan door een eigen gebrek van de auto. Met ontploffing bedoelen wij een plotselinge en hevige uitbarsting van gassen of dampen. Je krijgt geen vergoeding voor een opgeblazen motor of opgeblazen elektronica, en niet voor het onderdeel zelf waarin het eigen gebrek zit.",
  },
  {
    id: "cb-rellen",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 14 - rellen" },
    trefwoorden: ["rellen", "relletjes", "opstootjes", "vandalisme", "vernieling", "opzettelijke beschadiging", "kras gekrast", "autosleutel over de lak", "beschadigd door een buurman"],
    tekst:
      "Je bent verzekerd voor schade door rellen, relletjes en opstootjes. Je krijgt geen vergoeding voor schade door vandalisme. Met vandalisme bedoelen wij opzettelijke beschadiging door een derde.",
  },
  {
    id: "cb-ruitschade",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 15 en 4.2 Ruitschade" },
    trefwoorden: ["ruit", "ruitschade", "voorruit", "autoruit", "glasschade", "steenslag", "scheur in de ruit", "panoramadak", "zonnedak", "scherven", "glasgarant", "ruit vervangen", "ruit repareren", "ruit kapot"],
    tekst:
      "Je bent verzekerd voor het plotseling en onvoorzien breken van de autoruit of het panorama- of zonnedak, en voor schade aan de auto door scherven daarvan, ook als de schade is ontstaan door een eigen gebrek van de auto. Je krijgt geen vergoeding als je tegelijk ook andere schade aan je auto hebt, en niet voor krassen op of oppervlakkige beschadigingen van een autoruit of het panorama- of zonnedak. Wij vergoeden de kosten van repareren of vervangen door een geselecteerd ruitschadeherstelbedrijf. Laat je het niet door een geselecteerd ruitschadeherstelbedrijf doen, dan verlagen wij de schadevergoeding met € 500; behalve bij een noodgeval in het buitenland waarbij reparatie of vervanging door een geselecteerd bedrijf in Nederland niet mogelijk is. Bij een geselecteerd bedrijf wikkelen wij de schade rechtstreeks af (jij bent wel de opdrachtgever maar hoeft geen geld voor te schieten, alleen een eventueel eigen risico te betalen) en krijg je uitgebreide garantie. De gegevens vind je op www.glasgarant.nl. Het eigen risico geldt niet bij het repareren van een autoruit of panorama- of zonnedak, maar wel bij vervangen.",
  },
  {
    id: "cb-storm",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 17 - storm" },
    trefwoorden: ["storm", "stormschade", "windkracht", "waait om", "boom op de auto", "tak op de auto", "portier waait", "14 meter per seconde", "wind"],
    tekst:
      "Je bent verzekerd voor schade door storm als de auto omwaait, er iets op of tegen de auto valt (bijvoorbeeld een boom) of het portier van je auto tegen een ander voorwerp of tegen je auto zelf waait. Met storm bedoelen wij wind met een snelheid van 14 meter per seconde of meer.",
  },
  {
    id: "cb-transport",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 18 - vervoer door een transportondernemer" },
    trefwoorden: ["transportondernemer", "autotransport", "vervoer per vrachtwagen", "autotrein", "ferry", "verscheept", "vervoerd per schip", "transport auto", "oplegger"],
    tekst:
      "Je bent verzekerd voor schade door een oorzaak van buitenaf tijdens het vervoer van de auto door een transportondernemer. Met vervoer bedoelen wij vervoer door een ander transportmiddel, dus niet het rijden met de auto zelf. Je krijgt geen vergoeding voor schade die ontstaat tijdens slepen en takelen, en niet voor schrammen, krassen of lakschade.",
  },
  {
    id: "cb-onderhoud-slijtage",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 10, 12 en 16 - onderhoud en slijtage" },
    trefwoorden: ["onderhoud", "normaal onderhoud", "onvoldoende onderhoud", "slijtage", "verkleuring", "veroudering", "verroesting", "roest", "corrosie", "versleten", "apk onderhoud", "olie verversen"],
    tekst:
      "Je krijgt geen vergoeding voor de kosten van normaal onderhoud. Je krijgt ook geen vergoeding voor schade die ontstaat omdat je de auto of de aanhanger niet, niet tijdig of niet deskundig hebt (laten) onderhouden, en niet voor schade door normaal gebruik, zoals slijtage, verkleuring, veroudering, verroesting en corrosie.",
  },
  {
    id: "cb-onvoldoende-zorg",
    artikelen: { "casco-beperkt": "3.1 Gebeurtenis 13 - onvoldoende zorg" },
    trefwoorden: ["onvoldoende zorg", "waarschuwingslampje", "apk verlopen", "apk afgekeurd", "apk", "laptop in het zicht", "spullen in het zicht", "overbelast", "overbeladen", "doorrijden met lampje", "dashboard lampje", "motorlampje"],
    tekst:
      "Je krijgt geen vergoeding voor schade die ontstaat door onvoldoende zorg. Voorbeelden: je rijdt door terwijl er een waarschuwingslampje op het dashboard brandt; je auto is niet goedgekeurd bij de Algemene Periodieke Keuring (APK) of je APK is verlopen; je hebt diefstalgevoelige spullen (bijvoorbeeld een laptop) in het zicht liggen, wat uitnodigt tot inbraak (braakschade aan de auto); je hebt de auto of de aanhanger overbelast.",
  },
  {
    id: "cb-hulpverlening",
    artikelen: { "casco-beperkt": "3.3 Dekking Hulpverlening" },
    trefwoorden: ["casco hulpverlening", "hulpverlening bij casco", "hulp bij diefstal casco", "niet verder rijden casco", "wat is hulpverlening casco"],
    tekst:
      "Je bent verzekerd voor hulpverlening bij diefstal van de auto en als de auto en/of de aangekoppelde aanhanger zo beschadigd raakt door een verzekerde gebeurtenis dat de bestuurder daarmee niet verder kan rijden. Voor hulpverlening moet je vooraf toestemming vragen aan de Alarmcentrale; is niemand daar redelijkerwijs toe in staat, dan ben je toch verzekerd, met maximaal de vergoeding die je met de Alarmcentrale zou hebben gekregen. Het eigen risico geldt niet voor hulpverlening.",
  },
  {
    id: "cb-hulp-geen-recht",
    artikelen: { "casco-beperkt": "3.3 Wanneer heb je geen recht op hulpverlening?" },
    trefwoorden: ["casco geen recht op hulpverlening", "casco geen hulpverlening"],
    tekst:
      "De uitsluitingen en beperkingen uit hoofdstuk 3.1 en de algemene uitsluitingen uit de Algemene voorwaarden gelden ook voor hulpverlening. Als achteraf blijkt dat je geen recht op hulpverlening had, moet je de kosten die wij eventueel al gemaakt hebben aan ons terugbetalen.",
  },
  {
    id: "cb-nieuwwaarde-keuze",
    artikelen: { "casco-beperkt": "3.4 Keuzedekking Nieuwwaarde 2 jaar of Nieuwwaarde 3 jaar" },
    trefwoorden: ["keuzedekking nieuwwaarde", "nieuwwaarde 2 jaar", "nieuwwaarde 3 jaar", "nieuwwaarde keuzedekking", "nieuwwaarderegeling"],
    tekst:
      "Staat op je polisblad dat Nieuwwaarde 2 jaar of Nieuwwaarde 3 jaar is verzekerd, dan gebruiken wij de termijn die je gekozen hebt om de waarde van je auto vast te stellen als de nieuwwaarderegeling van toepassing is. Meer hierover staat in 4.1 'Beschadiging of diefstal van de auto'. De uitsluitingen en beperkingen uit hoofdstuk 3.1 en de algemene uitsluitingen gelden ook in dit geval.",
  },
  {
    id: "cb-aankoopwaarde-keuze",
    artikelen: { "casco-beperkt": "3.5 Keuzedekking Aankoopwaarde 1 jaar, 2 jaar of 3 jaar" },
    trefwoorden: ["keuzedekking aankoopwaarde", "aankoopwaarde 1 jaar", "aankoopwaarde 2 jaar", "aankoopwaarde 3 jaar", "aankoopwaarde keuzedekking", "aankoopwaarderegeling"],
    tekst:
      "Staat op je polisblad dat Aankoopwaarde 1 jaar, Aankoopwaarde 2 jaar of Aankoopwaarde 3 jaar is verzekerd, dan gebruiken wij de termijn die je gekozen hebt om de waarde van je auto vast te stellen als de aankoopwaarderegeling van toepassing is. Meer hierover staat in 4.1 'Beschadiging of diefstal van de auto'. De uitsluitingen en beperkingen uit hoofdstuk 3.1 en de algemene uitsluitingen gelden ook in dit geval.",
  },
  {
    id: "cb-pechhulp",
    artikelen: { "casco-beperkt": "3.6 Keuzedekking Pechhulp" },
    trefwoorden: ["casco pechhulp", "pechhulp casco", "wat is pechhulp", "pechhulp", "pech", "mankement", "kapot", "accu leeg", "start niet", "bandenpech", "pech onderweg", "noodreparatie"],
    tekst:
      "Pechhulp is een keuzedekking: wij vergoeden pechhulp alleen als op je polisblad staat dat je daarvoor verzekerd bent. Je krijgt pechhulp bij een mechanisch of elektronisch mankement aan de auto waardoor de bestuurder niet verder kan rijden. De gebeurtenis moet plaatsvinden tijdens de looptijd van je verzekering. Voor hulp moet je vooraf toestemming vragen aan de Alarmcentrale. Het eigen risico geldt niet voor Pechhulp (4.6) en de no-claimkorting geldt niet voor de premie van Pechhulp (7.1).",
  },
  {
    id: "cb-pech-geen-recht",
    artikelen: { "casco-beperkt": "3.6 Wanneer heb je geen recht op pechhulp?" },
    trefwoorden: ["casco geen recht op pechhulp", "casco geen pechhulp"],
    tekst:
      "De uitsluitingen en beperkingen uit hoofdstuk 3.1 en de algemene uitsluitingen uit de Algemene voorwaarden gelden ook bij schade door pech. Als achteraf blijkt dat je geen recht op pechhulp had, moet je de kosten die wij eventueel al gemaakt hebben aan ons terugbetalen.",
  },
  {
    id: "cb-vergoeding-reparatie",
    artikelen: { "casco-beperkt": "4.1 Beschadiging of diefstal van de auto" },
    trefwoorden: ["reparatiekosten", "wat wordt vergoed", "hoe wordt de schade vergoed", "vergoeding reparatie", "reparatie of waarde", "technisch mogelijk", "slijtagegevoelige onderdelen", "nieuwe banden", "nieuwe accu", "nieuwe uitlaat", "eerdere beschadigingen", "afwaardering", "vergoeding auto", "diefstal vergoeding"],
    tekst:
      "Bij beschadiging stellen wij vast of reparatie technisch mogelijk en verantwoord is, dus of de auto na reparatie nog in een staat is om er veilig mee te rijden. Is reparatie mogelijk, dan kijken wij of de reparatiekosten hoger zijn dan de waarde van de auto. Afhankelijk daarvan vergoeden wij de reparatiekosten, of de waarde van de auto min de waarde van de restanten (bij technisch of economisch total loss). Bij diefstal vergoeden wij de waarde van de auto. Bij het bepalen van de waarde mogen wij een bedrag aftrekken voor eerdere beschadigingen die nog niet gerepareerd zijn. Soms verlagen wij de vergoeding als slijtagegevoelige onderdelen worden vervangen door nieuwe onderdelen waardoor de bruikbaarheid van de auto verbetert, bijvoorbeeld nieuwe banden, een nieuwe accu of een nieuwe uitlaat. Hoe wij de waarde bepalen staat bij nieuwwaarde, aankoopwaarde en dagwaarde.",
  },
  {
    id: "cb-herstelbedrijf",
    artikelen: { "casco-beperkt": "4.1 Geselecteerd herstelbedrijf" },
    trefwoorden: ["geselecteerd herstelbedrijf", "herstelbedrijf", "schadegarant", "waar laat ik repareren", "welke garage", "garage keuze", "garage", "eigen garage", "500 euro korting", "verlaagd met 500", "schade repareren", "focwa", "merkgarantie", "ingeruild", "inruilen", "noodreparatie buitenland", "repareren zonder herstelbedrijf", "niet repareren"],
    tekst:
      "Wij vergoeden de kosten van reparatie door een geselecteerd herstelbedrijf. Laat je de schade helemaal niet of niet door een geselecteerd herstelbedrijf repareren, dan verlagen wij de schadevergoeding met € 500. Dat doen we niet bij een noodreparatie in het buitenland waarbij reparatie door een geselecteerd herstelbedrijf in Nederland niet mogelijk is, en niet als je de beschadigde auto inruilt zonder te repareren en de auto die je tegelijkertijd ter vervanging koopt aansluitend bij ons verzekert. Een geselecteerd herstelbedrijf is een van de autoschadeherstelbedrijven waar wij mee samenwerken, waardoor reparaties goedkoper zijn. Wij wikkelen de schade rechtstreeks met het bedrijf af; jij bent wel de opdrachtgever maar hoeft geen geld voor te schieten, alleen een eventueel eigen risico te betalen. Je krijgt merkgarantie of garantie van de FOCWA, je kunt gebruikmaken van de haal- en brengservice en je krijgt gratis vervangend vervoer tijdens de reparatietijd; bij total loss heb je maximaal 5 dagen recht op een gratis leenauto. De gegevens vind je op www.schadegarant.nl.",
  },
  {
    id: "cb-waarde-nieuwwaarde",
    artikelen: { "casco-beperkt": "4.1 Waarde van een nieuw in Nederland gekochte auto (nieuwwaarde)" },
    trefwoorden: ["nieuwwaarde", "nieuwwaarderegeling", "nieuw gekocht", "nieuwe auto waarde", "waarde van mijn auto", "waarde auto", "eerste eigenaar", "afgiftedatum", "80.000", "12.500", "110% van de cataloguswaarde", "prijslijst fabrikant"],
    tekst:
      "De nieuwwaarderegeling geldt voor een auto die je nieuw rechtstreeks bij een dealer in Nederland hebt gekocht en waarvan je de eerste eigenaar bent, als de cataloguswaarde op je polisblad maximaal € 80.000 inclusief BTW is. De waarde is dan een percentage van de nieuwwaarde, afhankelijk van het moment van de schade na de afgiftedatum: standaard 100% in de 1e t/m 12e maand, daarna dalend tot 64% (over de eerste € 12.500 van de nieuwwaarde) en 52% (over het meerdere boven € 12.500) in de 36e maand. Met Nieuwwaarde 2 jaar blijft dat 100% in de 1e t/m 24e maand en loopt het daarna af tot 82% en 76% in de 36e maand; met Nieuwwaarde 3 jaar is het 100% in de 1e t/m 36e maand. Is de cataloguswaarde hoger dan € 80.000 inclusief BTW of ligt het moment van de schade na de 36e maand na de afgiftedatum, dan is de waarde van de auto de dagwaarde. Met nieuwwaarde bedoelen wij de prijs van een nieuwe auto van hetzelfde merk, type en uitvoering, volgens de laatst bekende prijslijst van de fabrikant of importeur, inclusief afleveringskosten en verwijderingsbijdrage. Maximum: 110% van de cataloguswaarde op je polisblad. Vraag me gerust naar een bepaalde maand, bijvoorbeeld 'nieuwwaarde 18e maand'.",
  },
  {
    id: "cb-waarde-aankoopwaarde",
    artikelen: { "casco-beperkt": "4.1 Waarde van een tweedehands of in het buitenland gekochte auto (aankoopwaarde)" },
    trefwoorden: ["aankoopwaarde", "aankoopwaarderegeling", "tweedehands", "tweedehands gekocht", "occasion", "aankoopnota", "aankoopbewijs", "dagafschrift", "anwb koerslijst", "anwb-koerslijst", "vervangingswaarde bij total loss", "aankoopdatum", "buitenland gekocht"],
    tekst:
      "De aankoopwaarderegeling geldt voor een auto die je tweedehands hebt gekocht in Nederland of in het buitenland, of nieuw in het buitenland, als de cataloguswaarde op je polisblad maximaal € 80.000 inclusief BTW is en op je polisblad staat dat Aankoopwaarde 1, 2 of 3 jaar is verzekerd. Is de schade in de 1e t/m 12e maand (1 jaar), de 1e t/m 24e maand (2 jaar) of de 1e t/m 36e maand (3 jaar) na de aankoopdatum, dan is de waarde van de auto de aankoopwaarde; daarna is het de dagwaarde. Is de cataloguswaarde hoger dan € 80.000 inclusief BTW, of staat Aankoopwaarde niet op je polisblad, dan is de waarde de dagwaarde. Met aankoopwaarde bedoelen wij het bedrag waarvoor je de auto hebt gekocht. Die geldt alleen als je het kunt aantonen, bijvoorbeeld met een originele aankoopnota of dagafschrift; een verklaring van één of meer getuigen is niet voldoende. Kun je het volgens ons niet aantonen, dan kijken wij naar de 'vervangingswaarde bij total loss' volgens de ANWB-koerslijst van de maand waarin je de auto kocht en naar de dagwaarde, en telt de hoogste van die twee. Maximum: die vervangingswaarde volgens de ANWB-koerslijst plus 20%.",
  },
  {
    id: "cb-dagwaarde",
    artikelen: { "casco-beperkt": "4.1 en Begrippenlijst - dagwaarde" },
    trefwoorden: ["dagwaarde", "verkoopwaarde", "wat is mijn auto waard", "restwaarde", "vervangingswaarde", "waarde net voor de schade"],
    tekst:
      "Met de dagwaarde van de auto bedoelen wij de verkoopwaarde van de auto net voor de schade. Wij stellen deze waarde eventueel samen met een deskundige vast. De vervangingswaarde (van extra's) is de waarde van een voorwerp van dezelfde soort, kwaliteit, staat en ouderdom als het verzekerde voorwerp, onmiddellijk voor het ontstaan van de schade.",
  },
  {
    id: "cb-total-loss",
    artikelen: { "casco-beperkt": "4.1 en 5.3 Total loss" },
    trefwoorden: ["total loss", "totaal verlies", "afgeschreven", "economisch total loss", "technisch total loss", "2/3", "twee derde", "restanten", "demontage", "gedemonteerd", "overdragen", "overschrijvingsbewijs", "kentekenbewijs inleveren"],
    tekst:
      "Technisch total loss: de auto is technisch niet meer in een staat om veilig mee te rijden en reparatie is onmogelijk of onverantwoord. Economisch total loss: bij een vergoeding op basis van nieuwwaarde zijn de reparatiekosten hoger dan 2/3 van de door ons vastgestelde waarde van de auto; bij aankoopwaarde of dagwaarde zijn de reparatiekosten hoger dan het verschil tussen de dagwaarde direct voor de gebeurtenis en de waarde van de restanten daarna. Bij total loss vergoeden wij de waarde van de auto min de waarde van de restanten (restanten zijn alles wat na een schade nog over is van de auto). Wordt de auto gedemonteerd, dan krijg je pas een schadevergoeding als je de auto én de extra's (of de restanten) aan ons of een door ons aangewezen partij overdraagt en alle delen van het kentekenbewijs, het overschrijvingsbewijs en de autosleutels geeft. De waarde van de restanten trekken wij van de schadevergoeding af; dat bedrag krijg je rechtstreeks van het demontagebedrijf dat de auto afvoert.",
  },
  {
    id: "cb-kosten-vergoed",
    artikelen: { "casco-beperkt": "4.4 Welke kosten vergoeden wij ook?" },
    trefwoorden: ["welke kosten casco", "kosten voorkomen casco", "avarij-grosse", "avarij grosse", "avarij", "gewonde vervoeren", "gewonde in de auto", "bekleding reinigen", "bekleding vervangen", "kosten bij schade beperken", "kosten die je maakt"],
    tekst:
      "Naast de schade vergoeden wij, als de kosten tijdens de looptijd zijn gemaakt en zonder dat een eigen risico geldt: kosten om een direct dreigende, gedekte schade te voorkomen of te beperken (geen maximum); schade aan de auto en reiniging of vervanging van bekleding als je kosteloos een gewonde vervoert of tijdelijk in de auto plaatst (in totaal tot maximaal de dagwaarde van de auto); en avarij-grosse (als de auto per schip wordt vervoerd en het schip in problemen komt, jouw deel van de kosten om schip en lading veilig te stellen; geen maximum).",
  },
  {
    id: "cb-extra-kosten-diefstal",
    artikelen: { "casco-beperkt": "4.4 Gebeurtenis 4 - extra kosten bij joyrijden of diefstal" },
    trefwoorden: ["extra kosten diefstal", "extra kosten joyrijden", "tegemoetkoming", "12,50", "375", "auto niet kunnen gebruiken", "vervoerskosten na diefstal", "dagvergoeding"],
    tekst:
      "Kun je de auto niet gebruiken door joyrijden of diefstal, dan krijg je voor die tijd een tegemoetkoming in de extra kosten die je daardoor moet maken: maximaal € 12,50 per dag en maximaal € 375 per gebeurtenis. Er geldt geen eigen risico. Je krijgt geen vergoeding als de auto een lease- of lesauto is.",
  },
  {
    id: "cb-vervangend-vervoer",
    artikelen: { "casco-beperkt": "3.3, 3.6, 4.1 en 4.4 - vervangend vervoer en haal- en brengservice" },
    trefwoorden: ["vervangend vervoer", "vervangende auto", "leenauto", "huurauto", "vervangend", "haal- en brengservice", "haal en breng", "brengservice", "gratis leenauto", "auto huren"],
    tekst:
      "Bij een geselecteerd herstelbedrijf krijg je gratis vervangend vervoer tijdens de reparatietijd; bij total loss heb je maximaal 5 dagen recht op een gratis leenauto. Laat je de beschadigde auto repareren door een geselecteerd herstelbedrijf, dan vergoeden wij ook de haal- en brengservice (geen maximum): het ophalen van de auto op een plek in Nederland die je zelf aanwijst, het tegelijk brengen van een vervangende leenauto, het terugbrengen van de auto na reparatie en het ophalen van de leenauto. Bij hulpverlening in het buitenland vergoeden wij de huur van een vergelijkbare auto onder voorwaarden, maximaal € 100 per dag en € 1.250 per gebeurtenis; bij pech in Nederland (keuzedekking Pechhulp) is de huur maximaal 5 dagen. Na diefstal of joyrijden is er een tegemoetkoming in de extra kosten van maximaal € 12,50 per dag en € 375 per gebeurtenis.",
  },
  {
    id: "cb-eigen-risico",
    artikelen: { "casco-beperkt": "4.6 Eigen risico" },
    trefwoorden: ["eigen risico", "eigen bijdrage", "zelf betalen", "hoeveel eigen risico", "eigen risico casco", "eigen risico ruit", "eigen risico pechhulp", "excess", "franchise"],
    tekst:
      "Heb je een eigen risico, dan staat dat met het bedrag op je polisblad. Dit eigen risico trekken we af van de schadevergoeding, ook in het geval van een maximum verzekerd bedrag. Het eigen risico geldt niet voor de dekking Hulpverlening, niet voor de keuzedekking Pechhulp, niet voor de schadevergoeding voor reparatie van een autoruit of panorama- of zonnedak (maar wel bij vervangen) en niet voor de kosten uit hoofdstuk 4.4. Een eigen risico op een andere verzekering vergoeden wij niet.",
  },
  {
    id: "cb-schade-vaststellen",
    artikelen: { "casco-beperkt": "5.1 Vaststelling van de schade" },
    trefwoorden: ["schade vaststellen", "expert", "deskundige", "taxatie", "tweede deskundige", "derde deskundige", "bindend advies", "nivre", "schadebedrag te laag", "second opinion", "experts", "calculatie", "het schadebedrag"],
    tekst:
      "Wij stellen vast hoeveel schade je hebt, of laten dat doen door een deskundige die wij aanwijzen; die berekent samen met het herstelbedrijf de schade met objectieve calculatiemodellen. Vind je het bedrag te laag, dan mag je in overleg met onze deskundige zelf een tweede deskundige kiezen. Komen die twee er niet uit, dan benoemen zij samen een derde deskundige die de omvang van de schade voor jou en voor ons bindend vaststelt, volgens de 'Richtlijn voor het uitvoeren van een bindend advies Motorvoertuigen' van het Nederlands Instituut van Register Experts (Nivre). Wij vergoeden de redelijke kosten van alle deskundigen, mits ze zich houden aan de Gedragscode Expertiseorganisaties of vergelijkbaar deskundig zijn; de kosten van de deskundige die jij kiest tot maximaal de kosten van de deskundige die wij hebben ingeschakeld.",
  },
  {
    id: "cb-diefstal-afwikkeling",
    artikelen: { "casco-beperkt": "5.2 Diefstal van de auto" },
    trefwoorden: ["auto teruggevonden", "gestolen auto teruggevonden", "teruggevonden", "30 dagen na diefstal", "schadevergoeding diefstal", "eigendom overdragen", "diefstal afhandelen", "wanneer krijg ik geld bij diefstal", "hoe lang duurt diefstal", "teruggevonden na 30 dagen"],
    tekst:
      "Wordt de auto gestolen, dan heb je recht op schadevergoeding 30 dagen nadat wij je melding van diefstal hebben ontvangen, als je het eigendomsrecht van de auto aan ons overdraagt en alle delen van het kentekenbewijs, het overschrijvingsbewijs en de autosleutels aan ons of een door ons aangewezen partij geeft. Wordt de auto binnen 30 dagen na je melding teruggevonden, dan moet je de auto terugnemen en krijg je de schade vergoed die is ontstaan in de tijd dat de auto gestolen was. Wordt hij na die 30 dagen teruggevonden, dan mag je de auto terugnemen, maar moet je eerst de schadevergoeding die wij betaalden aan ons terugbetalen; de schade die in de tijd van de diefstal is ontstaan mag je ervan aftrekken. Meld het ons zodra je weet dat je gestolen auto is teruggevonden.",
  },
  {
    id: "cb-uitbetaling",
    artikelen: { "casco-beperkt": "5.4 Uitbetaling" },
    trefwoorden: ["uitbetaling", "uitbetalen", "wanneer krijg ik mijn geld", "hoe snel betalen", "wettelijke rente", "30 dagen betalen", "schade uitbetaling", "betaald krijgen"],
    tekst:
      "Hebben wij besloten dat je schadevergoeding krijgt, dan betalen wij die zo snel mogelijk uit. Betalen wij het schadebedrag niet binnen 30 dagen nadat we alle gegevens hebben ontvangen om de schade te kunnen beoordelen, dan heb je vanaf dat moment recht op wettelijke rente.",
  },
  {
    id: "cb-aangifte",
    artikelen: { "casco-beperkt": "6.2 Aangifte doen" },
    trefwoorden: ["aangifte", "aangifte doen", "politie", "inbraak melden", "vandalisme melden", "binnen 14 dagen", "14 dagen", "doorrijden", "onbekenden", "aangifte in nederland", "binnen 24 uur", "diefstal melden"],
    tekst:
      "Je moet direct, maar uiterlijk binnen 14 dagen, aangifte bij de politie doen bij inbraak of vandalisme, bij beschadiging door onbekenden en bij doorrijden na een ongeval door een tegenpartij. Bij diefstal of joyrijden moet je nog dezelfde dag aangifte doen, of de volgende ochtend als het 's avonds of 's nachts is gebeurd. Vindt de gebeurtenis in het buitenland plaats, doe dan aangifte in dat land; bij diefstal van de auto moet je ook aangifte doen in Nederland, binnen 24 uur na thuiskomst. Meld bij diefstal de gegevens van de auto zo snel mogelijk bij de helpdesk van het Verzekeringsbureau Voertuigcriminaliteit (VbV), telefoon 071 - 3641777 (dag en nacht bereikbaar).",
  },
  {
    id: "cb-medewerking",
    artikelen: { "casco-beperkt": "6.6 Medewerking verlenen" },
    trefwoorden: ["medewerking", "meewerken", "aanwijzingen", "wat moet ik doen bij schade", "bewijsstukken", "originele bewijsstukken", "wat moet ik doen"],
    tekst:
      "Heb je schade, dan vragen wij je mee te werken: je volgt aanwijzingen van ons, onze deskundigen of de Alarmcentrale op; je verleent je volledige medewerking aan de afhandeling van de schade en onderzoeken; je doet niets wat onze belangen schaadt; en je doet er alles aan wat je redelijkerwijs kunt doen om schade te voorkomen of te verminderen. Je geeft ons alle informatie die wij nodig hebben om te beoordelen of je recht hebt op een schadevergoeding en op welk bedrag, en stuurt originele bewijsstukken zo snel mogelijk naar ons of de deskundige(n); op verzoek ook naar de Alarmcentrale. Houd je je niet aan je verplichtingen en schaad je onze belangen, dan heb je geen recht op een schadevergoeding.",
  },
  {
    id: "cb-wijzigingen",
    artikelen: { "casco-beperkt": "6.7 Wijzigingen doorgeven" },
    trefwoorden: ["wijzigingen", "doorgeven", "verhuizen", "verhuisd", "ander adres", "nieuwe auto", "auto vervangen", "andere bestuurder", "regelmatige bestuurder wijzigt", "30 dagen doorgeven"],
    tekst:
      "Je moet ons tijdens de looptijd juist en op tijd informeren. Laat het ons direct weten als je de auto verkoopt en/of vervangt door een andere auto. Laat het ons binnen 30 dagen weten als je naar een ander adres verhuist of als een andere persoon regelmatige bestuurder van de auto is.",
  },
  {
    id: "cb-noclaim",
    artikelen: { "casco-beperkt": "7.1 De no-claimladder" },
    trefwoorden: ["no-claim casco", "no claim casco", "noclaim casco", "korting casco", "casco korting", "korting op mijn premie casco"],
    tekst:
      "De premie hangt af van je trede op de no-claimladder. Bij de afsluiting delen wij je in op een trede, afhankelijk van het aantal schadevrije jaren; met 0 schadevrije jaren start je op trede 5. Elk volgend verzekeringsjaar krijg je korting op de premie, tot je de maximale korting (75%, trede 26 tot en met 31) hebt bereikt. Op trede 31 blijf je op trede 31 en blijft de korting hetzelfde. De korting geldt niet voor de premie van de dekking Pechhulp. Vraag me gerust naar een bepaalde trede, bijvoorbeeld 'trede 12'.",
  },
  {
    id: "cb-schadevrije-jaren",
    artikelen: { "casco-beperkt": "7.2 Schadevrije jaren" },
    trefwoorden: ["schadevrije jaren casco", "schade casco schadevrije jaren", "casco schade gevolgen", "heeft casco schade invloed", "roy-data casco", "casco roy"],
    tekst:
      "Het totaal van je schadevrije jaren staat in Roy-data, een landelijk systeem waarin verzekeraars informatie zetten over autoverzekeringen en schadevrije jaren. Bij je eerste aanvraag moet je je schadevrije jaren opgeven; wij zoeken ze op in Roy-data. Staan er geen schadevrije jaren, dan gaan wij uit van 0. Wijkt het aantal af van wat je opgaf, dan passen wij je schadevrije jaren aan volgens Roy-data. Klopt Roy-data volgens jou niet, neem dan contact op met je vorige verzekeraar. Zeg je de verzekering bij ons op, dan geven wij het aantal schadevrije jaren door aan Roy-data. Een schade die wij betalen op Casco Beperkt heeft geen negatieve gevolgen voor je schadevrije jaren; je aantal schadevrije jaren wordt ieder verzekeringsjaar met 1 jaar verhoogd.",
  },
  {
    id: "cb-noclaim-wa-schade",
    artikelen: { "casco-beperkt": "7.3 Schade die valt onder de WA-verzekering" },
    trefwoorden: ["wa schade casco", "wa-schade casco", "schade aan anderen casco", "invloed wa schade", "wa schade no-claim casco"],
    tekst:
      "Vergoeden wij een schade die valt onder de Autoverzekering Wettelijke Aansprakelijkheid (WA) van je auto, dus schade die met of door de auto aan anderen en hun spullen is toegebracht, dan kan dat gevolgen hebben voor je trede op de no-claimladder (en dus voor je premie voor Casco Beperkt) en voor je schadevrije jaren. Of die WA-schade gevolgen heeft staat in de WA-voorwaarden, in het hoofdstuk 'Hoe werkt de no-claimregeling?'.",
  },
  {
    id: "cb-leenauto",
    artikelen: { "casco-beperkt": "8.1 Schade met een leenauto van de garage" },
    trefwoorden: ["leenauto garage", "leenauto beschadigd", "schade aan leenauto", "onderhoudsbeurt", "geleende auto", "tijdelijke auto", "auto van de garage", "schade aan de geleende auto"],
    tekst:
      "Deze verzekering geldt ook voor een auto die je tijdelijk meekrijgt van de garage als je eigen auto een onderhoudsbeurt krijgt of gerepareerd wordt. Op het moment dat je verzekering eindigt, is ook de leenauto niet meer bij ons verzekerd. Dit geldt alleen als er door de garage geen verzekering voor die auto is afgesloten, of als de schade niet gedekt is op de eigen verzekering van de garage. Bij een schade aan de geleende auto vergoeden wij maximaal de dagwaarde van je eigen auto. Wij handelen de schade af volgens jouw verzekering, dus het eigen risico en de no-claimregeling zijn van toepassing.",
  },
  {
    id: "cb-buitenland-verhuizen",
    artikelen: { "casco-beperkt": "8.7 en 8.8 Verhuizing, buitenlands kenteken en stalling in het buitenland" },
    trefwoorden: ["naar het buitenland verhuizen", "buitenlands kenteken", "gestald in het buitenland", "auto in het buitenland stallen", "emigreren", "verhuizing naar het buitenland", "meer dan de helft van het jaar", "europese unie verhuizen", "eu verhuizen", "buitenlands kenteken krijgen"],
    tekst:
      "De verzekering eindigt direct zodra jij als verzekeringnemer naar het buitenland verhuist; verhuis je naar een land binnen de Europese Unie, dan eindigt de verzekering van je auto uiterlijk op de eerstvolgende jaarlijkse verlengingsdatum. De verzekering eindigt ook direct zodra je auto een buitenlands kenteken heeft. Staat je auto meer dan de helft van het jaar in het buitenland gestald, dan eindigt de verzekering op dat moment; staat de auto gestald in een land binnen de Europese Unie, dan eindigt de verzekering uiterlijk op de eerstvolgende jaarlijkse verlengingsdatum.",
  },
  {
    id: "cb-begrippen",
    artikelen: { "casco-beperkt": "Begrippenlijst" },
    trefwoorden: ["begrip casco", "wat betekent casco", "wat bedoelen jullie casco", "begrippenlijst casco", "betekenis casco", "wat is een beveiligingssysteem", "wat is overstroming", "wat is storm", "wat is total loss", "wat is extra's", "definitie casco", "wat is een extra"],
    tekst:
      "Uit de begrippenlijst van Casco Beperkt: Beveiligingssysteem is een anti-diefstalsysteem met het VbV-SCM Keurmerk Voertuigbeveiliging (of een technisch gelijkwaardig systeem dat in de fabriek is ingebouwd). Dagwaarde is de verkoopwaarde van de auto net vóór de schade. Extra's zijn alles wat niet vanuit de fabriek of importeur onderdeel van de auto is maar later is ingebouwd of gemonteerd. Nieuwwaarde is de prijs van een nieuwe auto van hetzelfde merk, type en uitvoering volgens de laatst bekende prijslijst, inclusief afleveringskosten en verwijderingsbijdrage. Overstroming is een overstroming als gevolg van het bezwijken of overlopen van dijken, kaden, sluizen of andere waterkeringen, ook het uitstromen van water via beschadigingen daaraan. Storm is wind met een snelheid van 14 meter per seconde of meer. Total loss is technisch niet meer in een staat om veilig mee te rijden met onmogelijke of onverantwoorde reparatie, of reparatiekosten hoger dan 2/3 van de vastgestelde waarde (nieuwwaarde) of hoger dan het verschil tussen dagwaarde en restanten (dagwaarde). Vervangingswaarde is de waarde van een voorwerp van dezelfde soort, kwaliteit, staat en ouderdom, vlak voor de schade. Een geselecteerd (ruitschade)herstelbedrijf is een bedrijf waar wij mee samenwerken, waardoor reparaties goedkoper zijn en wij de premies laag kunnen houden.",
  },
];

/** Nieuwwaarde-percentages (4.1): per maand na de afgiftedatum, over de eerste € 12.500 en over het meerdere boven € 12.500. */
export const NIEUWWAARDE_STANDAARD: [number, number][] = [
  // Maand 13 t/m 36; in de 1e t/m 12e maand is het 100,0% / 100,0%.
  [98.5, 98.0],
  [97.0, 96.0],
  [95.5, 94.0],
  [94.0, 92.0],
  [92.5, 90.0],
  [91.0, 88.0],
  [89.5, 86.0],
  [88.0, 84.0],
  [86.5, 82.0],
  [85.0, 80.0],
  [83.5, 78.0],
  [82.0, 76.0],
  [80.5, 74.0],
  [79.0, 72.0],
  [77.5, 70.0],
  [76.0, 68.0],
  [74.5, 66.0],
  [73.0, 64.0],
  [71.5, 62.0],
  [70.0, 60.0],
  [68.5, 58.0],
  [67.0, 56.0],
  [65.5, 54.0],
  [64.0, 52.0],
];
