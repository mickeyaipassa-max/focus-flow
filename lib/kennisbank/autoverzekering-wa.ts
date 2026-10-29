import type { KennisItem } from "./types";

/**
 * Voorwaarden Autoverzekering Wettelijke Aansprakelijkheid (WA) "Ik kies zelf" van a.s.r., D AU-WA 2017-01
 * (29 pagina's). Items die ook in de Casco Beperkt-voorwaarden staan, krijgen het artikel van dat document erbij in
 * index.ts.
 */
export const KENNISBANK_WA: KennisItem[] = [
  {
    id: "polis-en-voorrang",
    artikelen: { wa: "Je polis en de voorwaarden" },
    trefwoorden: ["polisblad", "voorrang", "afwijken", "clausule", "looptijd", "hoe lang loopt", "algemene voorwaarden"],
    tekst:
      "Alle afspraken die we met je maken staan op het polisblad, bijvoorbeeld hoe lang de verzekering loopt en welke dekkingen je hebt gekozen. Naast deze voorwaarden gelden de Algemene voorwaarden en de clausules op het polisblad. Wijken ze van elkaar af, dan gelden eerst de bepalingen en clausules op het polisblad, daarna deze voorwaarden en tot slot de Algemene voorwaarden.",
  },
  {
    id: "wie-verzekerd",
    artikelen: { wa: "1 Wie zijn verzekerd?" },
    trefwoorden: ["wie is verzekerd", "wie zijn verzekerd", "wie verzekerd", "verzekeringnemer", "regelmatige bestuurder", "gemachtigde", "passagier", "werkgever", "meeverzekerd", "mag ik andere", "lenen", "iemand anders rijden", "mijn zoon", "mijn dochter", "mijn partner", "mijn vriend", "mijn vriendin"],
    tekst:
      "Verzekerd zijn: de persoon die op je polisblad staat als verzekeringnemer en eigenaar of houder is van de auto, de regelmatige bestuurder die op je polisblad staat, de gemachtigde bestuurder en passagiers van de auto, en de werkgever van deze mensen als die volgens het burgerlijk recht aansprakelijk is voor de schade die zij hebben veroorzaakt.",
  },
  {
    id: "welke-auto",
    artikelen: { wa: "2.1 Welke auto is verzekerd?" },
    trefwoorden: ["welke auto", "personenauto", "kentekenbewijs", "kenteken", "rdw", "9 personen", "bestemd en ingericht", "categorie b", "rijbewijs b"],
    tekst:
      "Verzekerd is de personenauto die op je polisblad staat, waarvoor je een geldig Nederlands kentekenbewijs van de Rijksdienst voor het Wegverkeer (RDW) hebt en die is bestemd en ingericht voor vervoer van maximaal 9 personen. De bestuurder heeft hiervoor een rijbewijs voor categorie B of B/E nodig.",
  },
  {
    id: "landen",
    artikelen: { wa: "2.2 In welke landen ben je verzekerd?" },
    trefwoorden: ["welke landen", "buitenland", "groene kaart", "europa", "vakantie", "doorgekruist", "in welk land", "landen"],
    tekst:
      "Je bent verzekerd in de landen die op je Internationaal Motorrijtuigverzekeringsbewijs (de Groene Kaart) staan. Je bent niet verzekerd in de landen die op de Groene Kaart zijn doorgekruist.",
  },
  {
    id: "verzekerd-bedrag",
    artikelen: { wa: "2.3 Voor hoeveel ben je verzekerd?" },
    trefwoorden: ["voor hoeveel", "verzekerd bedrag", "verzekerde bedragen", "maximum", "maximale vergoeding", "hoeveel krijg ik", "dekkingsbedrag", "welk bedrag"],
    tekst: "Je bent verzekerd voor maximaal de bedragen die op je polisblad staan. Per gebeurtenis vergoeden wij maximaal die bedragen.",
  },
  {
    id: "gebeurtenis",
    artikelen: { wa: "3 Voor welke schade ben je verzekerd?" },
    trefwoorden: ["plotseling", "onvoorzien", "gebeurtenis", "onzekerheid", "slijtage", "langzaam", "voor welke schade", "welke schade"],
    tekst:
      "Je bent verzekerd voor schade die met of door de auto wordt veroorzaakt en waarvoor je aansprakelijk bent, en voor hulpverlening. Het moet gaan om een gebeurtenis die plotseling en onvoorzien is en die plaatsvindt tijdens de looptijd van de verzekering. Schade die ontstaat door langzaam inwerkende processen valt hier niet onder.",
  },
  {
    id: "wa-dekking",
    artikelen: { wa: "3.1 Dekking Wettelijke Aansprakelijkheid (WA)" },
    trefwoorden: ["wat dekt wa", "wat dekt de wa", "wat is wa", "wettelijke aansprakelijkheid", "wam", "w.a.m", "schade aan anderen", "aansprakelijk", "personenschade", "letsel", "schade aan spullen", "wat is gedekt", "wat is verzekerd", "dekking wa"],
    tekst:
      "Deze verzekering voldoet aan de eisen van de Wet Aansprakelijkheidsverzekering Motorrijtuigen (W.A.M.). Je bent verzekerd voor schade die met of door de auto wordt veroorzaakt aan anderen en aan hun spullen en waarvoor je aansprakelijk bent. Dat is personenschade (letsel, aantasting van de gezondheid of dood, en de schade die daar een gevolg van is) en schade aan spullen (beschadiging, vernietiging of verloren gaan van spullen en onroerende zaken, en de schade die daar een gevolg van is). Ben je niet aansprakelijk, dan kunnen wij namens jou verweer voeren.",
  },
  {
    id: "wa-aanhanger",
    artikelen: { wa: "3.1 Gebeurtenis 2 - aanhanger" },
    trefwoorden: ["aanhanger", "caravan", "vouwwagen", "aanhangwagen", "trailer", "bagagewagen"],
    tekst:
      "Je bent verzekerd voor schade die wordt veroorzaakt met of door een aanhanger die gekoppeld is aan de auto, en met of door een aanhanger die is losgekoppeld maar nog niet veilig stilstaat buiten het verkeer. Met een aanhanger bedoelen wij een bagagewagen, een caravan, een vouwwagen, een aanhangwagen of trailer of iets vergelijkbaars.",
  },
  {
    id: "wa-lading",
    artikelen: { wa: "3.1 Gebeurtenis 3 - lading of spullen" },
    trefwoorden: ["lading", "bagage vervoeren", "spullen vervoeren", "vallen uit de auto", "in- of uitladen", "uitladen", "inladen", "dakkoffer", "verhuizen"],
    tekst:
      "Je bent verzekerd voor schade die wordt veroorzaakt met of door spullen die je vervoert met de auto of de aangekoppelde aanhanger, en door spullen die daaruit vallen. Je bent niet verzekerd voor schade aan de spullen die je zelf vervoert, en niet voor schade die ontstaat tijdens het in- of uitladen, ook niet door spullen die tijdens het in- of uitladen vallen.",
  },
  {
    id: "wa-passagiers",
    artikelen: { wa: "3.1 Gebeurtenis 4 en 8 - passagiers" },
    trefwoorden: ["passagiers", "instappen", "uitstappen", "portier", "handbagage", "kleding", "inzittenden"],
    tekst:
      "Je bent verzekerd voor schade aan anderen of hun spullen die wordt veroorzaakt door passagiers die in de auto zitten of die in- of uitstappen. Ook de handbagage van passagiers en de kleding die zij dragen terwijl ze in de auto zitten zijn verzekerd.",
  },
  {
    id: "wa-slepen",
    artikelen: { wa: "3.1 Gebeurtenis 5 - slepen" },
    trefwoorden: ["slepen", "sleep", "wegslepen", "vriendendienst", "gesleepte"],
    tekst:
      "Je bent verzekerd voor schade die wordt veroorzaakt door een ander motorrijtuig dat jij sleept als vriendendienst. Dit geldt alleen als het slepen voldoet aan de wettelijke eisen. De schade aan het gesleepte motorrijtuig en alle spullen die daar aan, in of op zitten is niet verzekerd.",
  },
  {
    id: "wa-eigen-voertuigen",
    artikelen: { wa: "3.1 Gebeurtenis 6 - andere eigen motorrijtuigen of aanhangers" },
    trefwoorden: ["ander motorrijtuig", "eigen motorrijtuig", "tweede auto", "eigen aanhanger", "waardevermindering", "eigen voertuig"],
    tekst:
      "Je bent verzekerd voor schade aan een ander eigen motorrijtuig of een eigen aanhanger. Ben je als privépersoon eigenaar of houder daarvan, dan ben je ook verzekerd voor waardevermindering. Niet verzekerd is schade aan de aanhanger die op dat moment aan de auto gekoppeld is. Is je bedrijf eigenaar of houder van het beschadigde motorrijtuig of de aanhanger, dan ben je ook niet verzekerd voor waardevermindering en voor schade die is veroorzaakt in de gebouwen of op de terreinen die bij je bedrijf horen.",
  },
  {
    id: "wa-bestuurder",
    artikelen: { wa: "3.1 Gebeurtenis 7 - schade van de bestuurder" },
    trefwoorden: ["eigen letsel", "letsel bestuurder", "schade bestuurder", "bestuurder gewond", "spullen van de bestuurder", "eigen schade", "zelf gewond", "mijn letsel"],
    tekst: "Je bent niet verzekerd voor personenschade van de bestuurder van de auto of schade aan zijn spullen.",
  },
  {
    id: "eigen-auto-schade",
    artikelen: { wa: "3.1 en 4.2 - schade aan je eigen auto" },
    trefwoorden: ["schade aan mijn eigen auto", "schade aan mijn auto", "eigen auto", "casco", "reparatie", "repareren", "onderdelen", "manuren", "aanrijding", "mijn auto beschadigd", "kras", "deuk", "parkeerschade", "herstel"],
    tekst:
      "De WA-dekking vergoedt schade aan anderen en hun spullen, niet de schade aan je eigen auto. De manuren voor reparatie, vervangende onderdelen en gebruikte materialen krijg je alleen vergoed als je een Casco Beperkt- of Casco Allriskverzekering hebt. De vergoeding gaat dan volgens de voorwaarden van die verzekering.",
  },
  {
    id: "storm-natuur",
    artikelen: { wa: "3.1 en 3.2 - storm, natuur en brand" },
    trefwoorden: ["storm", "hagel", "natuur", "overstroming", "brand", "bliksem", "boom op auto", "slecht weer"],
    tekst:
      "In de WA-voorwaarden staat geen vergoeding voor schade aan je eigen auto door storm, natuur of brand; WA dekt schade aan anderen. Wel heb je recht op hulpverlening als de auto of aanhanger zo beschadigd raakt door brand of een oorzaak van buitenaf dat de bestuurder niet verder kan rijden (3.2). Bij Casco Beperkt en Casco Allrisk is schade door storm (wind van 14 meter per seconde of meer), hagel, blikseminslag en brand wel verzekerd; vraag me gerust naar de voorwaarden van die dekkingen.",
  },
  {
    id: "algemene-uitsluitingen",
    artikelen: { wa: "3.1 - algemene uitsluitingen" },
    trefwoorden: ["uitsluiting", "uitgesloten", "niet verzekerd", "niet gedekt", "wat valt niet", "wat dekt wa niet", "atoomkern", "molest", "betalingsachterstand", "niet betaald", "niet vergoed"],
    tekst:
      "Naast de uitsluitingen in deze voorwaarden gelden de algemene uitsluitingen uit de Algemene voorwaarden. Je bent niet verzekerd voor schade door atoomkernreacties en molest, ook niet als je fraude pleegt of een betalingsachterstand hebt. Daarnaast zijn er specifieke situaties zonder dekking: alcohol, geneesmiddelen of drugs, geen (geldig) rijbewijs of geen rijbevoegdheid, wedstrijden, verhuur of lease, zakelijk gebruik, een kenteken dat niet op jouw naam staat en gebruik zonder toestemming. Vraag me gerust naar een van die situaties.",
  },
  {
    id: "uitsluiting-alcohol",
    artikelen: { wa: "3.1 Uitsluiting 1 - alcohol, geneesmiddelen en drugs" },
    trefwoorden: ["alcohol", "drank", "dronken", "gedronken", "gedronken", "drugs", "geneesmiddelen", "medicijnen", "onder invloed", "promille", "ademtest", "bloedproef", "urine", "blazen", "weigeren"],
    tekst:
      "Je krijgt geen vergoeding voor schade als de bestuurder zo onder invloed is van alcohol, geneesmiddelen of drugs dat hij niet meer in staat moet worden geacht de auto behoorlijk te besturen. Ook bij weigering van een ademtest of een urine- of bloedproef krijg je geen vergoeding, en niet bij overmatig alcoholgebruik. Dat is: rijbewijs langer dan 5 jaar 0,5 promille of hoger (220 microgram of hoger in de adem); rijbewijs korter dan 5 jaar, rijexamen korter dan 2 maanden geleden gehaald maar rijbewijs nog niet ontvangen, of de auto onder toezicht besturen 0,2 promille of hoger (88 microgram of hoger). Je krijgt toch vergoeding als je kunt bewijzen dat je er niets van wist, dat het tegen jouw wil gebeurde en dat jou dus niets te verwijten valt. Wij moeten de schade aan de benadeelde vaak wel vergoeden en kunnen die dan op jou of op de dader verhalen.",
  },
  {
    id: "uitsluiting-rijbewijs",
    artikelen: { wa: "3.1 Uitsluiting 2 en 3 - rijbewijs en rijbevoegdheid" },
    trefwoorden: ["rijbewijs", "geen rijbewijs", "verlopen", "rijbevoegdheid", "ontzegd", "rijontzegging", "onder toezicht", "begeleid", "rijles", "gestolen rijbewijs", "rijexamen", "net geslaagd"],
    tekst:
      "Heeft de bestuurder geen geldig wettelijk rijbewijs voor de auto (en eventueel de aanhanger), dan krijg je geen schadevergoeding. Toch krijg je vergoeding als: hij vergeten is zijn rijbewijs op tijd te laten vernieuwen en het niet langer dan 1 jaar verlopen is; hij minder dan 2 maanden voor het ongeval zijn rijbewijs heeft gehaald maar nog niet heeft ontvangen; hij onder toezicht rijdt volgens de wettelijke regels en de toezichthouder niet betaalt krijgt voor de lessen; je kunt bewijzen dat je niets wist, het tegen jouw wil gebeurde en jou niets te verwijten valt; of het rijbewijs gestolen of verloren is. Mag de bestuurder wettelijk niet rijden, is de rijbevoegdheid hem ontzegd of voldoet de auto niet aan de eisen op zijn rijbewijs, dan krijg je ook geen vergoeding, behalve als je kunt bewijzen dat je daar niets van wist, het tegen jouw wil gebeurde en jou niets te verwijten valt.",
  },
  {
    id: "uitsluiting-wedstrijden",
    artikelen: { wa: "3.1 Uitsluiting 4 - wedstrijden" },
    trefwoorden: ["wedstrijd", "snelheidsrit", "circuit", "racen", "betrouwbaarheidsrit", "puzzelrit", "rally", "race"],
    tekst:
      "Je krijgt geen vergoeding voor schade die ontstaat tijdens de deelname aan of de voorbereiding van snelheidsritten en wedstrijden, behalve als je kunt bewijzen dat je daar niets van wist, het tegen jouw wil gebeurde en jou niets te verwijten valt. Schade tijdens betrouwbaarheidsritten en puzzelritten vergoeden wij wel.",
  },
  {
    id: "uitsluiting-verhuur",
    artikelen: { wa: "3.1 Uitsluiting 5 - verhuur of lease" },
    trefwoorden: ["verhuur", "verhuren", "lease", "leasen", "uitlenen", "autodelen", "airbnb", "deelauto", "peer-to-peer", "huren"],
    tekst:
      "Ontstaat de schade tijdens het verhuren of leasen van de auto aan een ander, dan vergoeden wij de schade niet, behalve als je kunt bewijzen dat je daar niets van wist, het tegen jouw wil gebeurde en jou niets te verwijten valt.",
  },
  {
    id: "uitsluiting-zakelijk",
    artikelen: { wa: "3.1 Uitsluiting 6 - zakelijk gebruik" },
    trefwoorden: ["zakelijk", "bedrijf", "taxi", "uber", "bezorgen", "lesauto", "rijschool", "beroepsmatig", "vracht", "maaltijdbezorging", "pakketten"],
    tekst:
      "Je krijgt geen vergoeding voor schade als de auto zakelijk wordt gebruikt. Onder zakelijk gebruik verstaan wij gebruik van de auto voor de exploitatie van een bedrijf, zoals beroepsmatig vervoer van personen of van vracht tegen betaling en gebruik van de auto als lesauto.",
  },
  {
    id: "uitsluiting-kenteken",
    artikelen: { wa: "3.1 Uitsluiting 7 - kenteken niet op naam" },
    trefwoorden: ["kenteken niet op naam", "op naam", "tenaamstelling", "kentekenregister", "andere naam", "kenteken op naam van"],
    tekst:
      "Je krijgt geen schadevergoeding als uit het Kentekenregister van de RDW blijkt dat het kenteken van de auto op het moment van de gebeurtenis niet op jouw naam stond. Behalve als je ons hebt gemeld dat het kentekenbewijs op een andere naam stond en wij dat hebben geaccepteerd.",
  },
  {
    id: "uitsluiting-toestemming",
    artikelen: { wa: "3.1 Uitsluiting 8 - geen toestemming" },
    trefwoorden: ["toestemming", "zonder toestemming", "geleend", "uitlenen aan", "mijn auto geleend", "joyrijden", "joyriding"],
    tekst:
      "Je bent niet verzekerd voor schade die wordt veroorzaakt door iemand die geen toestemming heeft om de auto te gebruiken als bestuurder of als passagier. Als verzekeringnemer ben je wel verzekerd als je kunt aantonen dat je daar niets van wist, of dat het tegen je wil gebeurde en dat je niets te verwijten valt. Met joyrijden bedoelen wij een auto besturen zonder toestemming van de eigenaar of houder, en zonder de bedoeling de auto te houden.",
  },
  {
    id: "hulpverlening",
    artikelen: { wa: "3.2 Dekking Hulpverlening" },
    trefwoorden: ["hulpverlening", "hulp bij diefstal", "diefstal", "gestolen", "autodiefstal", "wat is hulpverlening", "berging", "bergen", "takel", "vervoer van de auto", "niet verder rijden"],
    tekst:
      "Je bent verzekerd voor hulpverlening bij diefstal van de auto, en als de auto en/of de aangekoppelde aanhanger zo beschadigd raakt door brand of een oorzaak van buitenaf dat de bestuurder niet verder kan rijden (ook schade door het blussen van de brand). Denk aan vervoer van jou of de auto of huur van een vervangende auto. Wij vergoeden de hulpverlening bovenop het bedrag dat op je polisblad staat voor de dekking Wettelijke Aansprakelijkheid. Met diefstal bedoelen wij stelen door anderen, of het kwijtraken door verduistering of oplichting.",
  },
  {
    id: "hulpverlening-nederland",
    artikelen: { wa: "3.2 Hulpverlening in Nederland" },
    trefwoorden: ["hulpverlening nederland", "in nederland", "gestolen in nederland", "beschadigd in nederland", "gezamenlijk adres", "naar huis", "ophalen"],
    tekst:
      "Is de auto gestolen of beschadigd in Nederland, dan krijg je een vergoeding voor de berging en het vervoer van de auto en/of de aangekoppelde aanhanger en de bagage en/of lading naar een plek in Nederland die je zelf aanwijst. Ook het noodzakelijk vervoer, direct na de schade, van de bestuurder en de andere passagiers naar één gezamenlijk adres in Nederland wordt vergoed.",
  },
  {
    id: "hulpverlening-diefstal-buitenland",
    artikelen: { wa: "3.2 Gebeurtenis 2 - auto gestolen in het buitenland" },
    trefwoorden: ["gestolen in het buitenland", "diefstal buitenland", "auto gestolen vakantie", "teruggevonden", "terugvinden", "invoeren", "demonteren", "terugreis"],
    tekst:
      "Is de auto in het buitenland gestolen, dan krijg je een vergoeding voor de berging en het eventuele vervoer van de aanhanger en de bagage/lading naar Nederland of de eerstvolgende bedoelde bestemming, voor de extra kosten van de doorreis of terugreis van de bestuurder en passagiers (goedkoopste openbaar vervoer), voor de huur van een vervangende auto (alleen als de auto voor vakantie in het buitenland wordt gebruikt en de vakantie wordt voortgezet) en voor de telefoonkosten van contacten met de Alarmcentrale. De huur is maximaal € 100 per dag en € 1.250 per gebeurtenis, tot de einddatum van de oorspronkelijke vakantie. Wordt de auto teruggevonden, dan vergoeden wij het vervoer naar Nederland. Kost dat meer dan wat de restanten in Nederland waard zijn, dan vergoeden wij de kosten voor invoeren en demonteren in het land waar de schade is ontstaan.",
  },
  {
    id: "hulpverlening-schade-buitenland",
    artikelen: { wa: "3.2 Gebeurtenis 3 - auto beschadigd in het buitenland" },
    trefwoorden: ["schade in het buitenland", "buitenland schade", "ongeluk buitenland", "auto kapot buitenland", "gerepareerd", "onderdelen nasturen", "nasturen", "twee werkdagen", "2 werkdagen", "vier werkdagen", "4 werkdagen", "niet gerepareerd"],
    tekst:
      "Is de auto in het buitenland beschadigd, dan krijg je een vergoeding voor berging en noodzakelijk vervoer naar het dichtstbijzijnde herstelbedrijf, voor de telefoonkosten van contacten met de Alarmcentrale en voor een vervangende auto. Die huur krijg je alleen als de auto niet binnen 2 werkdagen gerepareerd kan worden (binnen 4 werkdagen als er onderdelen worden nagestuurd) en de auto voor vakantie wordt gebruikt en die vakantie wordt voortgezet; maximaal € 100 per dag en € 1.250 per gebeurtenis. Kan de auto gerepareerd worden, dan vergoeden wij ook de verzendkosten van noodzakelijk nagestuurde onderdelen (de onderdelen zelf alleen met Casco) en het noodzakelijk vervoer naar Nederland als de reparatie niet binnen 2 werkdagen (of 4 bij nasturen) kan of langer duurt en degenen die kunnen rijden al terug zijn. Kan de auto niet gerepareerd worden, dan vergoeden wij berging en vervoer van aanhanger en bagage naar Nederland of de eerstvolgende bestemming en de extra reiskosten van bestuurder en passagiers.",
  },
  {
    id: "hulpverlening-geen-recht",
    artikelen: { wa: "3.2 Wanneer heb je geen recht op hulpverlening?" },
    trefwoorden: ["geen recht op hulpverlening", "geen hulpverlening", "sleutels", "onbeheerd", "niet afgesloten", "brievenbus", "niet onderhouden", "onderhoud", "overbelast", "overbelading", "terugbetalen"],
    tekst:
      "De uitsluitingen uit hoofdstuk 3.1 en de algemene uitsluitingen gelden ook voor hulpverlening. Je hebt ook geen recht op hulpverlening als de bestuurder of gebruiker er niet alles aan gedaan heeft om diefstal of joyrijden te voorkomen (bijvoorbeeld de auto onbeheerd en niet afgesloten of met de sleutels erin of erop achtergelaten, of de sleutels in de brievenbus van een garage- of schadeherstelbedrijf), bij schade doordat je de auto of aanhanger niet, niet tijdig of niet deskundig hebt (laten) onderhouden en bij schade doordat de auto of aanhanger wordt overbelast. Als achteraf blijkt dat je geen recht had, moet je de gemaakte kosten aan ons terugbetalen. Als verzekeringnemer ben je wel verzekerd als je kunt aantonen dat je daar niets van wist, of dat het tegen jouw wil gebeurde en dat je niets te verwijten valt.",
  },
  {
    id: "alarmcentrale",
    artikelen: { wa: "3.2, 3.3 en 4.3 - Alarmcentrale" },
    trefwoorden: ["alarmcentrale", "telefoonnummer", "bellen", "wie bel ik", "toestemming vooraf", "pechnummer", "hulp inschakelen", "030"],
    tekst:
      "Hulpverlening en pechhulp worden altijd uitgevoerd door de Alarmcentrale, die zelf kiest wie zij voor de hulp inschakelt. Het telefoonnummer is 030 - 6990708. Vraag vooraf toestemming aan de Alarmcentrale; is niemand daar redelijkerwijs toe in staat, dan ben je toch verzekerd, maar krijg je maximaal de vergoeding die je met de Alarmcentrale zou hebben gekregen. Schakel hen bij schade en pech in het buitenland zo snel mogelijk in, anders krijg je geen vergoeding. De Alarmcentrale kan vragen om bewijs dat iemand de kosten kan betalen voor hulp die de verzekering niet dekt; rekeningen voor niet-gedekte diensten moet je binnen 30 dagen betalen.",
  },
  {
    id: "pechhulp",
    artikelen: { wa: "3.3 Keuzedekking Pechhulp" },
    trefwoorden: ["pechhulp", "pech", "wat is pechhulp", "motor start niet", "accu leeg", "bandenpech", "mankement", "kapot", "pech onderweg", "noodreparatie", "ter plaatse"],
    tekst:
      "Pechhulp is een keuzedekking: wij vergoeden pechhulp alleen als op je polisblad staat dat je daarvoor verzekerd bent. Je krijgt pechhulp bij een mechanisch of elektronisch mankement aan de auto waardoor de bestuurder niet verder kan rijden. Denk aan vervoer van jou of de auto. De gebeurtenis moet plaatsvinden tijdens de looptijd van je verzekering. Wij vergoeden de pechhulp bovenop het bedrag dat op je polisblad staat voor de dekking Wettelijke Aansprakelijkheid. De no-claimkorting geldt niet voor de premie van Pechhulp.",
  },
  {
    id: "pechhulp-nederland",
    artikelen: { wa: "3.3 Gebeurtenis 1 - pech in Nederland" },
    trefwoorden: ["pech in nederland", "pechhulp nederland", "huurauto pech", "vervangende auto pech", "5 dagen", "vijf dagen", "stalling", "weg naar garage"],
    tekst:
      "Bij pech in Nederland vergoeden wij de manuren voor noodreparatie langs de weg, berging, stalling en noodzakelijk vervoer van de auto en/of de aanhanger en de bagage/lading naar het dichtstbijzijnde herstelbedrijf, het vervoer naar een plek in Nederland die je zelf aanwijst, het noodzakelijk vervoer van de bestuurder en passagiers naar één gezamenlijk adres, en de huur van een vervangende vergelijkbare auto zolang je de auto niet kunt gebruiken, voor maximaal 5 dagen. Vervangende onderdelen en gebruikte materialen krijg je niet vergoed. Schakel zo snel mogelijk de Alarmcentrale in, anders krijg je geen vergoeding.",
  },
  {
    id: "pechhulp-buitenland",
    artikelen: { wa: "3.3 Gebeurtenis 2 en 3 - pech in het buitenland" },
    trefwoorden: ["pech in het buitenland", "pech buitenland", "kapot in", "kapot op vakantie", "pechhulp buitenland", "pech vakantie", "auto kapot vakantie"],
    tekst:
      "Bij pech in het buitenland waarbij de auto gerepareerd kan worden, vergoeden wij de manuren voor noodreparatie, berging, stalling en vervoer naar het dichtstbijzijnde herstelbedrijf, de verzendkosten van nagestuurde onderdelen, het noodzakelijk vervoer naar Nederland (als de auto niet binnen 2 werkdagen, of 4 bij nasturen, gerepareerd kan worden, of als de reparatie langer duurt en de bestuurders al terug zijn) en de telefoonkosten van contact met de Alarmcentrale. De huur van een vervangende auto krijg je als de auto niet binnen 2 werkdagen (of 4 bij nasturen) gerepareerd kan worden en de vakantie wordt voortgezet: maximaal € 100 per dag en € 1.250 per gebeurtenis, tot de einddatum van de vakantie. Kan de auto niet gerepareerd worden, dan vergoeden wij berging en vervoer naar het dichtstbijzijnde herstelbedrijf, berging, stalling en vervoer van aanhanger en bagage naar Nederland, de extra reiskosten van bestuurder en passagiers (goedkoopste openbaar vervoer) en de huur van een vervangende auto, alleen als de vakantie wordt voortgezet (maximaal € 100 per dag en € 1.250 per gebeurtenis).",
  },
  {
    id: "pechhulp-geen-recht",
    artikelen: { wa: "3.3 Wanneer heb je geen recht op pechhulp?" },
    trefwoorden: ["geen recht op pechhulp", "geen pechhulp", "pech onderhoud", "pech overbelast", "geen pechhulp"],
    tekst:
      "De uitsluitingen uit hoofdstuk 3.1 en de algemene uitsluitingen gelden ook bij pech. Je hebt ook geen recht op pechhulp bij pech doordat je de auto of aanhanger niet, niet tijdig of niet deskundig hebt (laten) onderhouden, en bij pech doordat de auto of aanhanger wordt overbelast. Blijkt achteraf dat je geen recht had, dan moet je de gemaakte kosten aan ons terugbetalen.",
  },
  {
    id: "vervangend-vervoer",
    artikelen: { wa: "3.2, 3.3 en 4.2 - vervangend vervoer" },
    trefwoorden: ["vervangend vervoer", "vervangende auto", "leenauto", "huurauto", "vervangend", "auto huren", "haal- en brengservice", "haal en breng", "brengservice"],
    tekst:
      "Vervangend vervoer krijg je in deze voorwaarden bij hulpverlening (3.2) en, met de keuzedekking Pechhulp, bij pech (3.3). In het buitenland vergoeden wij de huur van een vergelijkbare auto onder voorwaarden (zie hulpverlening en pechhulp): maximaal € 100 per dag en € 1.250 per gebeurtenis. Bij pech in Nederland is de huur maximaal 5 dagen. Laat je een beschadigde auto repareren door een geselecteerd herstelbedrijf, dan vergoeden wij de haal- en brengservice: het ophalen van de auto op een plek in Nederland die je aanwijst, het tegelijk brengen van een leenauto, het terugbrengen na reparatie en het ophalen van de leenauto. Gratis vervangend vervoer tijdens de reparatietijd krijg je bij een geselecteerd autoschadeherstelbedrijf.",
  },
  {
    id: "garage-keuze",
    artikelen: { wa: "Begrippenlijst - geselecteerd herstelbedrijf" },
    trefwoorden: ["garage", "garage keuze", "herstelbedrijf", "schadegarant", "geselecteerd", "waar laat ik repareren", "focwa", "merkgarantie", "welke garage", "reparatiebedrijf", "schadeherstel"],
    tekst:
      "Een geselecteerd herstelbedrijf is een van de autoschadeherstelbedrijven waar a.s.r. mee samenwerkt. Daardoor zijn reparaties goedkoper. Je krijgt er merkgarantie of garantie van de FOCWA op de reparatie, je kunt gebruikmaken van de haal- en brengservice en je krijgt gratis vervangend vervoer tijdens de reparatietijd. De gegevens van de geselecteerde bedrijven vind je op www.schadegarant.nl. Je bent zelf de opdrachtgever en handelt de reparatie met het herstelbedrijf af. Bij hulpverlening en pechhulp kiest de Alarmcentrale zelf wie zij voor de hulp inschakelt.",
  },
  {
    id: "ruitschade",
    artikelen: { wa: "4.2 - geselecteerd ruitschadeherstelbedrijf" },
    trefwoorden: ["ruit", "ruitschade", "voorruit", "glasschade", "steenslag", "glasgarant", "ruitreparatie", "ruitvervanging"],
    tekst:
      "Een geselecteerd ruitschadeherstelbedrijf is een van de bedrijven waar a.s.r. mee samenwerkt. Dan wikkelen wij de schade rechtstreeks met het bedrijf af. Jij bent wel de opdrachtgever, maar hoeft geen geld voor te schieten; je betaalt alleen een eventueel eigen risico aan het bedrijf. Je krijgt uitgebreide garantie op reparatie en vervanging. De gegevens vind je op www.glasgarant.nl. In de WA-voorwaarden staat geen vergoeding voor ruitschade aan je eigen auto; die is wel verzekerd met Casco Beperkt of Casco Allrisk.",
  },
  {
    id: "eigen-risico",
    artikelen: { wa: "4 Heb je een eigen risico?" },
    trefwoorden: ["eigen risico", "eigen bijdrage", "zelf betalen", "excess", "franchise"],
    tekst:
      "In deze WA-voorwaarden staat geen eigen risico voor schade aan anderen. Het enige eigen risico dat wordt genoemd is een eventueel eigen risico dat je aan een geselecteerd ruitschadeherstelbedrijf betaalt. De hoogte daarvan staat niet in de WA-voorwaarden. Bij Casco Beperkt en Casco Allrisk kan op je polisblad wel een eigen risico staan, en bij Casco Allrisk geldt in bepaalde gevallen een extra jeugd eigen risico. Ook vergoedt a.s.r. niet het eigen risico dat op een andere verzekering geldt (4.4).",
  },
  {
    id: "schadevergoeding-benadeelde",
    artikelen: { wa: "4.1 Schadevergoeding aan de benadeelde" },
    trefwoorden: ["benadeelde", "schade afhandelen", "wie betaalt", "schikking", "tegenpartij", "verhalen", "regres", "hoe wordt schade vergoed"],
    tekst:
      "Ben je aansprakelijk gesteld voor schade van een ander (de benadeelde), dan handelen we de schade rechtstreeks af met die benadeelde. We kunnen de schade rechtstreeks vergoeden of een schikking treffen en houden daarbij rekening met je belangen. Per gebeurtenis vergoeden wij maximaal de bedragen op je polisblad. Moeten wij volgens de W.A.M. of een soortgelijke buitenlandse wet een vergoeding betalen waar je op deze verzekering geen dekking voor hebt, dan hebben wij het recht dat bedrag op jou te verhalen.",
  },
  {
    id: "kosten-vergoed",
    artikelen: { wa: "4.2 Welke kosten vergoeden wij ook?" },
    trefwoorden: ["welke kosten", "kosten vergoed", "kosten voorkomen", "kosten beperken", "rechtsbijstand", "advocaat", "strafproces", "procedure", "wettelijke rente", "verweer", "geldboete", "boete", "aangeklaagd", "strafrechtelijk", "gewonden", "gewonde", "bekleding", "reinigen"],
    tekst:
      "Naast de schade vergoeden wij, als de kosten tijdens de looptijd zijn gemaakt: kosten om een direct dreigende, gedekte schade te voorkomen of te beperken; kosten van procedures die je met onze toestemming of op ons verzoek voert; kosten van rechtsbijstand op ons verzoek; wettelijke rente (niet over het deel boven het verzekerde bedrag); en kosten van verweer als je ten onrechte aansprakelijk wordt gesteld. Hiervoor geldt geen maximum. Word je aangeklaagd in een strafproces, laat het ons dan zo snel mogelijk weten; wij bepalen of we een advocaat inschakelen als de uitkomst belangrijk is om je aansprakelijkheid te beoordelen, en vergoeden die kosten zonder maximum. Wordt er kosteloos een gewonde vervoerd, dan vergoeden wij de schade aan de auto en het reinigen of vervangen van bekleding tot maximaal de dagwaarde. Geldboetes of bedragen om strafvervolging te voorkomen vergoeden wij niet.",
  },
  {
    id: "waarborgsom",
    artikelen: { wa: "4.2 Gebeurtenis 6 - waarborgsom" },
    trefwoorden: ["waarborgsom", "vrijlating", "borg", "teruggaaf rijbewijs", "beslag op de auto", "50.000"],
    tekst:
      "Is de schade waarvoor je aansprakelijk bent gesteld verzekerd en moet je een waarborgsom betalen voor je vrijlating, voor de teruggaaf van je rijbewijs of om een beslag op de auto op te heffen, dan betalen wij die namens jou, tot maximaal € 50.000. Het moet gaan om een waarborg aan een bevoegde overheidsinstantie. Zodra het bedrag vrijkomt, moet je het zo snel mogelijk aan ons terugbetalen, maar in ieder geval binnen 12 maanden.",
  },
  {
    id: "vergoeding-anderen",
    artikelen: { wa: "4.4 Vergoeding door anderen" },
    trefwoorden: ["andere verzekering", "dubbel verzekerd", "na u", "garantie", "fabrikant", "dealer", "reparateur", "werkgever vergoedt", "dubbele vergoeding"],
    tekst:
      "Je krijgt geen vergoeding voor schade die je kunt terugkrijgen (of zou kunnen terugkrijgen als je deze verzekering niet had gehad) via een bestaande garantieregeling of leveringsovereenkomst, via een wet, regeling of voorziening, of via een andere verzekering van jou of van een ander. Bij meerdere verzekeringen geldt de 'Na u-bepaling'. Wij vergoeden alleen de schade of kosten die de andere verzekeraar niet vergoedt omdat de schade hoger is dan het bedrag waarvoor je daar verzekerd bent, en niet het eigen risico dat op de andere verzekering geldt.",
  },
  {
    id: "reageren",
    artikelen: { wa: "5 Tot wanneer kun je op onze beslissing reageren?" },
    trefwoorden: ["bezwaar", "niet eens", "reageren", "beslissing", "afgewezen", "afwijzing", "definitief standpunt", "36 maanden", "klacht", "het oneens"],
    tekst:
      "Zodra wij je verzoek om schadevergoeding hebben beoordeeld, krijg je een mededeling met ons definitieve standpunt: de vastgestelde schadevergoeding of een afwijzing. Ben je het er niet mee eens, dan kun je ons dat binnen 36 maanden laten weten. Die 36 maanden gaan in op de dag dat jij of jouw gemachtigde de mededeling heeft ontvangen. Na die termijn kun je niet meer op ons standpunt terugkomen.",
  },
  {
    id: "noclaim-uitleg",
    artikelen: { wa: "6 en 6.1 De no-claimladder" },
    trefwoorden: ["no-claim", "noclaim", "no claim", "korting", "premiekorting", "no-claimladder", "trede", "ladder", "bonus-malus", "terugval", "korting op mijn premie", "schadevrij"],
    tekst:
      "Er zijn twee tabellen: de no-claimladder en de tabel schadevrije jaren. De no-claimladder bepaalt de hoogte van de korting op je premie. Als je de verzekering afsluit, delen wij je in op een trede, afhankelijk van het aantal schadevrije jaren; met 0 schadevrije jaren start je op trede 5 (50% korting). Heb je een jaar lang geen schade, dan krijg je het volgende verzekeringsjaar korting op je premie, en zo elk jaar verder tot de maximale korting van 75% (trede 26 en hoger, tot en met trede 31). Heb je wel schade, dan val je het volgende verzekeringsjaar terug. Op trede 31 zonder schade blijf je op trede 31. De korting geldt niet voor de premie van de dekking Pechhulp. Vraag me gerust naar een bepaalde trede, bijvoorbeeld 'trede 12'.",
  },
  {
    id: "schadevrije-jaren",
    artikelen: { wa: "6.2 De tabel schadevrije jaren" },
    trefwoorden: ["schadevrije jaren", "schadevrij jaar", "roy-data", "roydata", "royeren", "vorige verzekeraar", "schadevrije jaren doorgeven", "opbouw", "16 schadevrije"],
    tekst:
      "Een jaar zonder schade noemen wij een schadevrij jaar. Het totaal van je schadevrije jaren staat in Roy-data, een landelijk systeem waarin verzekeraars informatie zetten over autoverzekeringen en schadevrije jaren. Bij je eerste aanvraag moet je je schadevrije jaren opgeven; wij zoeken het aantal op in Roy-data. Staan er geen schadevrije jaren, dan gaan wij uit van 0. Wijkt Roy-data af van wat je opgaf, dan nemen we het aantal uit Roy-data over en passen we je premie per ingangsdatum aan. Klopt Roy-data volgens jou niet, neem dan contact op met je vorige verzekeraar. Zeg je de verzekering bij ons op, dan geven wij het aantal schadevrije jaren door aan Roy-data. Zonder schade krijg je er 1 schadevrij jaar bij. Bij schade val je altijd terug volgens de tabel, ook met meer dan 16 schadevrije jaren: bij 1 schade naar 10, bij 2 schades naar 5, bij 3 schades naar 0 en bij 4 of meer schades naar -5. Vraag me gerust naar een bepaald aantal, bijvoorbeeld '12 schadevrije jaren'.",
  },
  {
    id: "noclaim-geen-gevolg",
    artikelen: { wa: "6.3 Schade zonder gevolgen voor de no-claimladder" },
    trefwoorden: ["telt niet mee", "mee voor mijn no claim", "mee voor mijn no-claim", "mee voor no-claim", "mee voor je no-claim", "tellen mee", "meetellen", "telt schade mee", "geen gevolgen voor no-claim", "tellen niet mee", "schade zonder gevolgen", "verhaald", "waarborgfonds", "fietser", "voetganger", "terugbetaald", "zelf betaald", "no-claim behouden"],
    tekst:
      "Deze gevallen tellen niet mee als schade voor de no-claimladder en de tabel schadevrije jaren: wij keren geen schadevergoeding uit en verwachten dat ook niet; het hele bedrag is door iemand op wie wij konden verhalen terugbetaald; het bedrag is helemaal verhaald op het Waarborgfonds Motorverkeer (het eigen risico van het fonds tellen we niet mee); wij betalen alleen omdat dit met een andere verzekeraar is afgesproken; wij kunnen de schade volgens de wet niet (helemaal) verhalen; je betaalt het volledige bedrag binnen 12 maanden na onze laatste betaling terug; wij betalen voor een aanrijding met een fietser of voetganger en je kunt aantonen dat de bestuurder niets te verwijten is; of wij betalen alleen voor hulpverlening, pechhulp, kosten om acute schade te voorkomen of te beperken, kosten of schade bij hulpverlening aan gewonden, haal- en brengservice of expertisekosten.",
  },
  {
    id: "schade-zonder-schuld",
    artikelen: { wa: "6.4 Schade zonder schuld" },
    trefwoorden: ["zonder schuld", "niet mijn schuld", "schuldige derde", "onbekende dader", "doorrijden", "aangifte binnen 14 dagen", "14 dagen", "onbekenden", "getuigen"],
    tekst:
      "Is de schade niet door (mede)schuld van de bestuurder of passagier ontstaan en valt ze niet onder de gevallen van 6.3, dan telt ze niet mee voor de no-claimladder, maar wel voor de tabel schadevrije jaren. Bij een (vermoeden van een) schuldige derde moet je er alles aan doen om dat aan te tonen. Ontstaat de schade door onbekenden, bij doorrijden na een ongeval door een tegenpartij, of bij een aanrijding door onbekenden waardoor je vervolgens schade veroorzaakt aan een ander, dan moet je direct maar uiterlijk binnen 14 dagen aangifte bij de politie doen (in het buitenland in dat land). Doe je geen aangifte, doe je die te laat, of werk je niet mee aan het achterhalen van getuigen, dan tellen wij de schade wel mee voor de no-claimladder.",
  },
  {
    id: "noclaim-casco",
    artikelen: { wa: "6.5 Schade die valt onder de Casco Allrisk" },
    trefwoorden: ["casco no-claim", "casco allrisk no-claim", "casco schade no-claim", "cascoschade", "invloed casco"],
    tekst:
      "Krijg je schade aan je eigen auto vergoed die valt onder de Autoverzekering Casco Allrisk Ik kies zelf van a.s.r., dan kan dat gevolgen hebben voor je trede op de no-claimladder (en dus je premie voor deze WA-verzekering) en voor je schadevrije jaren. Of die cascoschade gevolgen heeft staat in de Voorwaarden Autoverzekering Casco Allrisk Ik kies zelf van a.s.r., in het hoofdstuk 'Hoe werkt de no-claimregeling?'.",
  },
  {
    id: "juiste-gegevens",
    artikelen: { wa: "7.1 De juiste gegevens opgeven" },
    trefwoorden: ["juiste gegevens", "gegevens opgeven", "kilometers", "kilometrage", "jaarkilometrage", "adres klopt niet", "onjuiste gegevens", "gegevens kloppen niet", "premie aanpassen"],
    tekst:
      "Je bent verplicht om bij het aanvragen de juiste gegevens te verstrekken over de auto, je adres, de regelmatige bestuurder en het aantal kilometers dat er per jaar met de auto wordt gereden. Ontdekken wij achteraf dat de gegevens op je polis niet kloppen, dan kan dat gevolgen hebben voor de schadevergoeding. Zo nodig passen wij je premie en/of de voorwaarden aan, eventueel met terugwerkende kracht. Je krijgt daarvan bericht.",
  },
  {
    id: "aangifte",
    artikelen: { wa: "7.2 Aangifte doen" },
    trefwoorden: ["aangifte", "diefstal", "politie", "inbraak", "vandalisme", "diefstal melden", "aangifte doen", "binnen 24 uur", "vbv", "waarborgfonds motorverkeer"],
    tekst:
      "Doe direct aangifte bij de politie bij diefstal of inbraak, beschadiging door onbekenden, vandalisme, joyrijden, doorrijden na een ongeval door een tegenpartij, en bij een aanrijding door onbekenden waardoor je vervolgens schade veroorzaakt aan een ander. De termijn van 14 dagen is belangrijk voor het verhalen van de schade bij het Waarborgfonds Motorverkeer. Bij diefstal of joyrijden doe je nog dezelfde dag aangifte, of de volgende ochtend als het 's avonds of 's nachts gebeurde. Gebeurt het in het buitenland, doe dan aangifte in dat land; bij diefstal van de auto doe je ook aangifte in Nederland binnen 24 uur na thuiskomst. Stuur het bewijs van de aangifte zo snel mogelijk naar ons. Met vandalisme bedoelen we opzettelijke beschadiging door een derde.",
  },
  {
    id: "schade-melden",
    artikelen: { wa: "7.3 Schade melden" },
    trefwoorden: ["schade melden", "melden", "schademelding", "hoe meld ik", "wanneer melden", "bewijsstukken", "36 maanden melden", "verjaringstermijn", "verzekeringsbureau voertuigcriminaliteit", "071"],
    tekst:
      "Meld de schade zodra je ervan op de hoogte bent. Stelt iemand jou aansprakelijk voor schade met of door je auto binnen de wettelijke verjaringstermijn, dan heb je nog 36 maanden de tijd om bij ons een schadevergoeding te vragen. Doe je dit niet op tijd, dan kan dat gevolgen hebben voor de vergoeding; bij een melding na 36 maanden krijg je geen schadevergoeding meer. Meld bij diefstal de gegevens van de auto zo snel mogelijk bij de helpdesk van het Verzekeringsbureau Voertuigcriminaliteit (VbV), telefoon 071 - 3641777 (dag en nacht bereikbaar). Geef ons alle informatie die we nodig hebben en stuur originele bewijsstukken zo snel mogelijk naar ons of de deskundige(n) die we hebben ingeschakeld; op verzoek ook naar de Alarmcentrale. Je bent verplicht om bij het melden de juiste gegevens te verstrekken.",
  },
  {
    id: "medewerking",
    artikelen: { wa: "7.4 Medewerking verlenen" },
    trefwoorden: ["medewerking", "meewerken", "aanwijzingen", "toezegging", "schuld erkennen", "schuld bekennen", "aansprakelijkheid erkennen", "schikking", "wat moet ik doen bij schade", "wat mag ik niet"],
    tekst:
      "Wij vragen je mee te werken: je volgt aanwijzingen van ons, onze deskundigen of de Alarmcentrale op; je verleent volledige medewerking aan de afhandeling en onderzoeken; je doet niets wat onze belangen schaadt; je doet alles wat redelijkerwijs kan om schade te voorkomen of te verminderen; je doet zelf geen toezegging van betaling of schikking en laat je niet uit over je schuld of aansprakelijkheid; en je laat het ons zo snel mogelijk weten als je strafrechtelijk wordt vervolgd. Houd je je niet aan je verplichtingen en schaad je onze belangen, dan heb je geen recht op een schadevergoeding.",
  },
  {
    id: "wijzigingen-doorgeven",
    artikelen: { wa: "7.5 Wijzigingen doorgeven" },
    trefwoorden: ["wijzigingen", "doorgeven", "verhuizen", "verhuisd", "ander adres", "nieuwe auto", "auto vervangen", "auto verkopen", "andere bestuurder", "regelmatige bestuurder wijzigt", "30 dagen"],
    tekst:
      "Je moet ons tijdens de looptijd juist en op tijd informeren. Laat het ons direct weten als je de auto verkoopt en/of vervangt door een andere auto. Laat het ons binnen 30 dagen weten als je naar een ander adres verhuist of als een andere persoon regelmatige bestuurder van de auto is. Daarna kunnen wij de verzekering beëindigen of de premie en/of voorwaarden wijzigen.",
  },
  {
    id: "gevolgen-verplichtingen",
    artikelen: { wa: "7.6 Gevolgen als je je niet aan je verplichtingen houdt" },
    trefwoorden: ["gevolgen verplichtingen", "verplichtingen", "niet houden aan", "onjuiste gegevens gevolgen", "verzekering beëindigen", "terugwerkende kracht", "verhalen op jou"],
    tekst:
      "Houd je je niet aan de verplichtingen en schaad je onze belangen, dan kunnen we de schade en de kosten op jou verhalen. Kloppen de gegevens op je aanvraag, wijzigingsverzoek, polisblad of schademelding niet, dan kan dat gevolgen hebben voor de schadevergoeding en de voortzetting van de verzekering. Zo nodig passen we je premie en/of voorwaarden aan of beëindigen we je verzekering, eventueel met terugwerkende kracht. Je krijgt daarvan bericht.",
  },
  {
    id: "leenauto",
    artikelen: { wa: "8.1 Schade met een leenauto van de garage" },
    trefwoorden: ["leenauto garage", "leenauto", "onderhoudsbeurt", "apk", "garage auto", "tijdelijke auto", "auto van de garage"],
    tekst:
      "Deze verzekering geldt ook voor een auto die je tijdelijk meekrijgt van de garage als je eigen auto een onderhoudsbeurt krijgt of gerepareerd wordt, maar alleen als die leenauto niet is verzekerd. Op het moment dat je verzekering eindigt, is ook de leenauto niet meer bij ons verzekerd. Wij vergoeden de schade alleen als degene die de leenauto ter beschikking stelt geen verzekering voor die auto heeft afgesloten, of als de schade niet gedekt is op de eigen verzekering van de leenauto.",
  },
  {
    id: "auto-verkopen",
    artikelen: { wa: "8.2 Wat als je je auto verkoopt?" },
    trefwoorden: ["auto verkopen", "verkocht", "verkoop", "verkoop auto", "premie terug", "restitutie", "terugbetaling premie", "tussentijds"],
    tekst:
      "Verkoop je de auto en eindigt je verzekering daarom tussentijds, dan betalen wij de premie over het resterende deel van de verzekeringstermijn terug. Laat het ons direct weten als je de auto verkoopt en/of vervangt door een andere auto.",
  },
  {
    id: "buitenlandse-wet",
    artikelen: { wa: "8.3 Ruimere wettelijke bepalingen in het buitenland" },
    trefwoorden: ["ruimere", "buitenlandse wet", "buitenland wet", "wam buitenland", "schade toebrengen buitenland", "buitenlandse bepalingen"],
    tekst:
      "Breng je iemand schade toe in een land waar deze verzekering geldt en geldt in dat land een wet die met de W.A.M. overeenkomt maar ruimere bepalingen heeft dan de W.A.M., dan gelden die bepalingen ook voor deze verzekering.",
  },
  {
    id: "opzet",
    artikelen: { wa: "8.4 Opzet of roekeloosheid" },
    trefwoorden: ["opzet", "opzettelijk", "roekeloos", "roekeloosheid", "bewust", "expres", "met opzet"],
    tekst:
      "Schade die door de bestuurder of de passagier met opzet wordt veroorzaakt of die door zijn bewuste roekeloosheid ontstaat, krijg je niet vergoed. Net zoals schade die iemand met jouw goedvinden veroorzaakt. Behalve als je kunt bewijzen dat jou niets te verwijten valt.",
  },
  {
    id: "fraude",
    artikelen: { wa: "8.5 Fraude" },
    trefwoorden: ["fraude", "frauderen", "oplichting", "liegen", "onwaarheid", "niet de waarheid", "verzwijgen", "onvolledig"],
    tekst:
      "Vertel je opzettelijk niet de waarheid, ben je opzettelijk niet volledig over een schade of een gebeurtenis, of pleeg je fraude, dan krijg je geen schadevergoeding. Fraude is misbruik van vertrouwen met de bedoeling een schadevergoeding of een verzekeringsdekking te krijgen, bijvoorbeeld door het niet eerlijk opgeven van informatie bij het aangaan van een verzekering of bij de afhandeling van een schade.",
  },
  {
    id: "criminele-activiteiten",
    artikelen: { wa: "8.6 Criminele of strafbare activiteiten" },
    trefwoorden: ["misdrijf", "criminele", "strafbaar", "strafbare", "vluchtauto", "overval", "criminaliteit", "drugs vervoeren"],
    tekst:
      "Wij vergoeden geen schade die ontstaat terwijl de bestuurder of de passagier een misdrijf pleegt, meedoet aan een misdrijf of probeert een misdrijf te plegen. Behalve als je kunt bewijzen dat je daar niets van wist, het tegen jouw wil gebeurde en jou dus niets te verwijten valt.",
  },
  {
    id: "terrorisme",
    artikelen: { wa: "8.7 en Clausuleblad terrorismedekking" },
    trefwoorden: ["terrorisme", "terroristisch", "aanslag", "kwaadwillige besmetting", "nht", "herverzekering", "terrorismeverzekerd", "1 miljard"],
    tekst:
      "Is de schade volgens deze voorwaarden verzekerd en veroorzaakt door terrorisme, dan krijg je de schade vergoed volgens het 'Clausuleblad terrorismedekking' van de Nederlandse Herverzekeringsmaatschappij voor Terrorismeschaden N.V. (NHT). Daarin staat dat we schadevergoeding kunnen beperken bij terrorisme, kwaadwillige besmetting en dergelijke. Onze uitkeringsplicht is dan beperkt tot het bedrag dat wij onder de herverzekering bij de NHT ontvangen. De NHT biedt herverzekeringsdekking tot maximaal 1 miljard euro per kalenderjaar voor alle aangesloten verzekeraars samen; de NHT kan de uitkering uitstellen of gedeeltelijk uitkeren en beslist of een gebeurtenis als terrorisme geldt. Meer informatie vind je op www.terrorismeverzekerd.nl.",
  },
  {
    id: "begrippen",
    artikelen: { wa: "Begrippenlijst" },
    trefwoorden: ["begrippenlijst", "wat is een atoomkernreactie", "wat is molest", "restanten", "wat is een schademelding", "binnenlandse onlusten", "burgeroorlog", "gewapend conflict", "muiterij", "oproer", "opstand"],
    tekst:
      "Uit de begrippenlijst: Atoomkernreactie is een kernreactie waarbij energie vrijkomt, zoals kernfusie, kernsplijting of kunstmatige en natuurlijke radioactiviteit; die schade vergoeden we alleen onder strikte voorwaarden (radioactieve nucliden buiten een kerninstallatie, gebruikt voor niet-militaire doeleinden, met vergunning van de overheid en zonder aansprakelijke derde volgens de Wet aansprakelijkheid kernongevallen). Molest is binnenlandse onlusten, burgeroorlog, gewapend conflict, muiterij, oproer of opstand. Restanten is alles wat na een schade nog over is van de auto of de aanhanger. Een gebeurtenis is een plotseling en onvoorzien voorval of een reeks van voorvallen die met elkaar verband houden, waardoor schade ontstaat. Een schademelding is een melding van of vraag naar schade op je verzekering waarbij de toedracht, plaats en datum bekend zijn.",
  },
  {
    id: "contact-en-bedrijf",
    artikelen: { wa: "Colofon" },
    trefwoorden: ["adres a.s.r.", "kvk", "waar zit a.s.r.", "postadres", "utrecht", "archimedeslaan", "website a.s.r.", "wie is de verzekeraar"],
    tekst: "De verzekeraar is ASR Schadeverzekering N.V. (KVK 30031823 Utrecht), a.s.r., Archimedeslaan 10, 3584 BA Utrecht, www.asr.nl.",
  },
];

/** No-claimladder (6.1): trede, korting en de trede in het volgende verzekeringsjaar bij 0, 1, 2, 3 en 4 of meer schades. */
export const NO_CLAIM_LADDER: { trede: number; korting: string; volgende: [number, number, number, number, number] }[] = [
  { trede: 31, korting: "75,0%", volgende: [31, 26, 20, 14, 8] },
  { trede: 30, korting: "75,0%", volgende: [31, 25, 19, 13, 7] },
  { trede: 29, korting: "75,0%", volgende: [30, 24, 18, 12, 6] },
  { trede: 28, korting: "75,0%", volgende: [29, 23, 17, 11, 5] },
  { trede: 27, korting: "75,0%", volgende: [28, 22, 16, 10, 4] },
  { trede: 26, korting: "75,0%", volgende: [27, 21, 15, 9, 3] },
  { trede: 25, korting: "74,5%", volgende: [26, 20, 14, 8, 2] },
  { trede: 24, korting: "74,0%", volgende: [25, 19, 13, 7, 1] },
  { trede: 23, korting: "73,5%", volgende: [24, 18, 12, 6, 1] },
  { trede: 22, korting: "73,0%", volgende: [23, 17, 11, 5, 1] },
  { trede: 21, korting: "72,0%", volgende: [22, 16, 10, 4, 1] },
  { trede: 20, korting: "71,0%", volgende: [21, 15, 9, 3, 1] },
  { trede: 19, korting: "70,0%", volgende: [20, 14, 8, 2, 1] },
  { trede: 18, korting: "69,0%", volgende: [19, 13, 7, 1, 1] },
  { trede: 17, korting: "68,0%", volgende: [18, 12, 6, 1, 1] },
  { trede: 16, korting: "67,0%", volgende: [17, 11, 5, 1, 1] },
  { trede: 15, korting: "66,0%", volgende: [16, 10, 4, 1, 1] },
  { trede: 14, korting: "65,0%", volgende: [15, 9, 3, 1, 1] },
  { trede: 13, korting: "64,0%", volgende: [14, 8, 2, 1, 1] },
  { trede: 12, korting: "63,0%", volgende: [13, 7, 1, 1, 1] },
  { trede: 11, korting: "61,5%", volgende: [12, 6, 1, 1, 1] },
  { trede: 10, korting: "60,0%", volgende: [11, 5, 1, 1, 1] },
  { trede: 9, korting: "58,5%", volgende: [10, 4, 1, 1, 1] },
  { trede: 8, korting: "57,0%", volgende: [9, 3, 1, 1, 1] },
  { trede: 7, korting: "55,5%", volgende: [8, 2, 1, 1, 1] },
  { trede: 6, korting: "54,0%", volgende: [7, 1, 1, 1, 1] },
  { trede: 5, korting: "50,0%", volgende: [6, 1, 1, 1, 1] },
  { trede: 4, korting: "41,0%", volgende: [5, 1, 1, 1, 1] },
  { trede: 3, korting: "33,0%", volgende: [4, 1, 1, 1, 1] },
  { trede: 2, korting: "25,0%", volgende: [3, 1, 1, 1, 1] },
  { trede: 1, korting: "0%", volgende: [2, 1, 1, 1, 1] },
];

/**
 * Tabel schadevrije jaren (6.2): schadevrije jaren nu (16 staat voor "16 of meer") en het aantal in het volgende
 * verzekeringsjaar bij 0, 1, 2, 3 en 4 of meer schades. Bij 16 of meer en 0 schades komt er 1 jaar bij.
 */
export const SCHADEVRIJE_JAREN: { jaren: number; volgende: [number, number, number, number, number] }[] = [
  { jaren: 16, volgende: [17, 10, 5, 0, -5] },
  { jaren: 15, volgende: [16, 10, 5, 0, -5] },
  { jaren: 14, volgende: [15, 9, 4, -1, -5] },
  { jaren: 13, volgende: [14, 8, 3, -2, -5] },
  { jaren: 12, volgende: [13, 7, 2, -3, -5] },
  { jaren: 11, volgende: [12, 6, 1, -4, -5] },
  { jaren: 10, volgende: [11, 5, 0, -5, -5] },
  { jaren: 9, volgende: [10, 4, -1, -5, -5] },
  { jaren: 8, volgende: [9, 3, -2, -5, -5] },
  { jaren: 7, volgende: [8, 2, -3, -5, -5] },
  { jaren: 6, volgende: [7, 1, -4, -5, -5] },
  { jaren: 5, volgende: [6, 0, -5, -5, -5] },
  { jaren: 4, volgende: [5, -1, -5, -5, -5] },
  { jaren: 3, volgende: [4, -2, -5, -5, -5] },
  { jaren: 2, volgende: [3, -3, -5, -5, -5] },
  { jaren: 1, volgende: [2, -4, -5, -5, -5] },
  { jaren: 0, volgende: [1, -5, -5, -5, -5] },
  { jaren: -1, volgende: [0, -5, -5, -5, -5] },
  { jaren: -2, volgende: [-1, -5, -5, -5, -5] },
  { jaren: -3, volgende: [-2, -5, -5, -5, -5] },
  { jaren: -4, volgende: [-3, -5, -5, -5, -5] },
  { jaren: -5, volgende: [-4, -5, -5, -5, -5] },
];
