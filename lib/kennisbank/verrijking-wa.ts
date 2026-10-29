import type { Verrijking } from "./types";

/**
 * Document 2 van de uitrol: de klantvriendelijke laag voor de Voorwaarden Autoverzekering Wettelijke Aansprakelijkheid
 * (WA), D AU-WA 2017-01. Zelfde werkwijze als bij de proefartikelen en de Algemene voorwaarden: brontekst en
 * bronverwijzing van elk blok blijven ongewijzigd, elke uitleg en elk punt is naast de brontekst gelegd (en
 * `scripts/test-verrijking.mts` controleert elk getal), en waar een blok juridisch gevoelig is staat het op
 * "handmatig-controleren". Vier WA-blokken staan bij de proefartikelen (wa-dekking, uitsluiting-alcohol,
 * schadevrije-jaren, schade-melden).
 *
 * Veel WA-blokken hebben dezelfde tekst in de voorwaarden van Casco Beperkt en Allrisk (zie `OOK_IN_CASCO_BEPERKT` in
 * index.ts); de laag hieronder is daarom zo geschreven dat hij voor al die documenten klopt.
 */
const b = (x: Partial<Verrijking> & Pick<Verrijking, "uitleg">): Verrijking => ({
  brontekstSoort: "bijna-letterlijk",
  direct: [],
  aandachtspunten: [],
  klantinfo: [],
  vervolgvragen: [],
  controle: { status: "gecontroleerd" },
  ...x,
});
const q = (als: string, vraag: string) => ({ als, vraag });
const HANDMATIG = (opmerking: string) => ({ status: "handmatig-controleren" as const, opmerking });

const DEKKING_VRAAG = "Welke dekking heb je: alleen WA, WA + Casco beperkt of WA + Casco allrisk?";
const PECH_VRAAG = "Staat Pechhulp op je polisblad?";
const UITSLUITING_UITZONDERING = "Uitzondering: je krijgt wel een vergoeding als je kunt bewijzen dat je er niets van wist, dat het tegen je wil gebeurde en dat jou niets te verwijten valt.";

export const VERRIJKING_WA: Record<string, Verrijking> = {
  "polis-en-voorrang": b({
    uitleg: "Alle afspraken over je verzekering staan op je polisblad, zoals hoe lang hij loopt en welke dekkingen je hebt. Naast deze voorwaarden gelden de Algemene voorwaarden en de clausules op je polisblad. Wijken ze van elkaar af, dan gaat het polisblad voor.",
    direct: ["Bij verschil gelden eerst de bepalingen en clausules op het polisblad, dan deze voorwaarden en daarna de Algemene voorwaarden."],
    klantinfo: ["Welke dekkingen op het polisblad staan."],
    vervolgvragen: [q("Het is niet duidelijk welke dekking de klant heeft", "Welke dekking staat er op je polisblad?")],
  }),

  "wie-verzekerd": b({
    uitleg: "Verzekerd zijn jij als verzekeringnemer en eigenaar of houder van de auto, de vaste bestuurder op je polisblad en de bestuurder die van jou toestemming heeft. Ook passagiers zijn verzekerd. Heeft iemand een werkgever die aansprakelijk is voor zijn schade, dan is die werkgever ook verzekerd.",
    aandachtspunten: ["Een bestuurder zonder toestemming is niet verzekerd (zie de uitsluiting 'geen toestemming')."],
    klantinfo: ["Wie er reed en of die persoon toestemming had.", "Of de bestuurder als regelmatige bestuurder op het polisblad staat."],
    vervolgvragen: [q("De klant vraagt of iemand anders mag rijden en het is niet bekend of die toestemming had", "Had die persoon toestemming van jou om te rijden?")],
    gerelateerd: ["uitsluiting-toestemming"],
  }),

  "welke-auto": b({
    uitleg: "Verzekerd is de personenauto die op je polisblad staat. Hij moet een geldig Nederlands kentekenbewijs hebben en gemaakt zijn voor maximaal 9 personen. De bestuurder heeft een rijbewijs B of B/E nodig.",
    klantinfo: ["Om welke auto het gaat en of die op het polisblad staat."],
    vervolgvragen: [q("De klant vraagt of een bepaald voertuig is verzekerd", "Om wat voor voertuig gaat het, en staat het op je polisblad?")],
    gerelateerd: ["uitsluiting-kenteken"],
  }),

  landen: b({
    uitleg: "Je bent verzekerd in de landen die op je Groene Kaart staan. In landen die op de Groene Kaart zijn doorgekruist ben je niet verzekerd.",
    direct: ["Landen die op de Groene Kaart zijn doorgekruist: daar ben je niet verzekerd."],
    aandachtspunten: ["De Groene Kaart is het Internationaal Motorrijtuigverzekeringsbewijs."],
    klantinfo: ["Naar welk land de klant reist."],
    vervolgvragen: [q("De klant vraagt of een land is gedekt", "Naar welk land ga je?")],
  }),

  "verzekerd-bedrag": b({
    uitleg: "Je bent verzekerd voor maximaal de bedragen die op je polisblad staan. Dat geldt per gebeurtenis.",
    aandachtspunten: ["Op asr.nl staat: letselschade maximaal € 6.450.000 per schadegeval en schade aan zaken en spullen maximaal € 2.500.000."],
    klantinfo: ["Gaat het om letsel of om schade aan spullen?"],
    vervolgvragen: [q("De klant vraagt naar een maximumbedrag zonder te zeggen om welke schade het gaat", "Gaat het om letsel van personen of om schade aan spullen?")],
    gerelateerd: ["sw-wa-bedragen"],
    controle: { status: "gecontroleerd", opmerking: "De voorwaarden noemen alleen 'de bedragen op je polisblad'; de maximumbedragen komen van asr.nl." },
  }),

  gebeurtenis: b({
    uitleg: "WA dekt schade die met of door je auto aan een ander wordt veroorzaakt en waarvoor je aansprakelijk bent. Het moet plotseling en onvoorzien zijn en tijdens de looptijd van je verzekering gebeuren. Schade door langzaam werkende processen valt er niet onder.",
    aandachtspunten: ["Ook hulpverlening valt onder de dekking."],
    klantinfo: ["Wat er is gebeurd en wanneer."],
    vervolgvragen: [q("Het is niet duidelijk wat er is gebeurd", "Wat is er precies gebeurd, en wanneer?")],
    gerelateerd: ["wa-dekking"],
  }),

  "wa-aanhanger": b({
    uitleg: "Schade door een aanhanger is verzekerd als hij aan je auto gekoppeld is. Ook als hij is losgekoppeld maar nog niet veilig buiten het verkeer staat.",
    aandachtspunten: ["Een aanhanger is een bagagewagen, caravan, vouwwagen, aanhangwagen, trailer of iets vergelijkbaars."],
    klantinfo: ["Of de aanhanger gekoppeld of losgekoppeld was, en of hij veilig buiten het verkeer stond."],
    vervolgvragen: [q("De klant noemt schade door een aanhanger zonder de situatie", "Was de aanhanger aan je auto gekoppeld?")],
  }),

  "wa-lading": b({
    uitleg: "Schade die spullen veroorzaken die je met de auto of aanhanger vervoert, is verzekerd, ook als ze eruit vallen. Schade aan die spullen zelf en schade tijdens het in- of uitladen zijn niet verzekerd.",
    direct: ["Schade tijdens het in- of uitladen is niet verzekerd, ook niet door spullen die dan vallen."],
    aandachtspunten: ["Schade aan de spullen die je zelf vervoert is niet verzekerd."],
    klantinfo: ["Gebeurde het onderweg of tijdens het in- of uitladen?"],
    vervolgvragen: [q("Het is niet duidelijk of de schade onderweg of tijdens het laden ontstond", "Gebeurde het tijdens het rijden of tijdens het in- of uitladen?")],
  }),

  "wa-passagiers": b({
    uitleg: "Schade die passagiers aan anderen of hun spullen veroorzaken is verzekerd, ook bij het in- en uitstappen. Ook de handbagage van passagiers en de kleding die zij dragen zijn verzekerd.",
    klantinfo: ["Wie de schade veroorzaakte en wie de benadeelde is."],
  }),

  "wa-slepen": b({
    uitleg: "Sleep je als vriendendienst een ander voertuig, dan is schade die dat voertuig veroorzaakt verzekerd. Dat geldt alleen als het slepen aan de wettelijke eisen voldoet.",
    direct: ["Schade aan het gesleepte voertuig en aan de spullen daarin of daarop is niet verzekerd."],
    klantinfo: ["Of het een vriendendienst was."],
    vervolgvragen: [q("De klant vraagt over slepen en het is niet bekend of het een vriendendienst was", "Sleep je het voertuig als vriendendienst?")],
  }),

  "wa-eigen-voertuigen": b({
    uitleg: "Schade aan een ander voertuig of een aanhanger van jezelf is verzekerd. Ben je er privé eigenaar of houder van, dan is ook waardevermindering verzekerd. Is je bedrijf de eigenaar, dan niet.",
    direct: ["Schade aan de aanhanger die op dat moment aan je auto gekoppeld is, is niet verzekerd."],
    aandachtspunten: ["Is je bedrijf eigenaar of houder, dan is waardevermindering niet verzekerd, en ook geen schade in de gebouwen of op de terreinen van je bedrijf."],
    klantinfo: ["Of het andere voertuig van de klant privé is of van zijn bedrijf."],
    vervolgvragen: [q("Het is niet duidelijk of het voertuig van de klant privé of van het bedrijf is", "Is dat voertuig van jou privé, of van je bedrijf?")],
  }),

  "wa-bestuurder": b({
    uitleg: "Letsel van de bestuurder zelf en schade aan zijn spullen zijn niet verzekerd met WA.",
    aandachtspunten: ["Op asr.nl staat de aanvullende dekking Schade inzittenden: passagiers en bestuurder zijn dan verzekerd voor letsel en schade aan hun spullen na een ongeval."],
    klantinfo: ["Wie er gewond of benadeeld is: de bestuurder of een passagier."],
    vervolgvragen: [q("Het is niet duidelijk wie gewond is", "Is de bestuurder gewond, of een passagier?")],
    gerelateerd: ["sw-aanvullende-dekkingen"],
  }),

  "eigen-auto-schade": b({
    uitleg: "De WA-dekking vergoedt schade aan anderen en hun spullen, niet de schade aan je eigen auto. Reparatiekosten voor je eigen auto vergoedt a.s.r. alleen met Casco beperkt of Casco allrisk.",
    direct: ["Schade aan je eigen auto valt niet onder WA."],
    aandachtspunten: [
      "De manuren voor reparatie, vervangende onderdelen en gebruikte materialen krijg je alleen vergoed met Casco beperkt of Casco allrisk, volgens de voorwaarden van die verzekering.",
      "Je kunt je dekking op elk moment aanpassen in je a.s.r. account (asr.nl).",
    ],
    klantinfo: ["Welke dekking de klant heeft.", "Wat voor schade het is."],
    vervolgvragen: [q("De klant noemt schade aan de eigen auto en het is niet bekend welke dekking hij heeft", DEKKING_VRAAG)],
    gerelateerd: ["sw-dekking-aanpassen"],
    controle: { status: "gecontroleerd", opmerking: "'Niet de schade aan je eigen auto' volgt uit 'schade aan anderen' en wordt bevestigd op asr.nl (WA-pagina)." },
  }),

  "storm-natuur": b({
    brontekstSoort: "samenvatting",
    uitleg: "WA vergoedt geen schade aan je eigen auto door storm, natuur of brand. Met Casco beperkt of Casco allrisk is die schade wel verzekerd.",
    direct: ["Raakt je auto door brand of een oorzaak van buitenaf zo beschadigd dat je niet verder kunt rijden, dan heb je ook met WA recht op hulpverlening."],
    aandachtspunten: ["Bij Casco is schade door storm verzekerd bij wind van 14 meter per seconde of meer.", "Bij Casco zijn ook hagel, blikseminslag en brand verzekerd."],
    klantinfo: ["Welke dekking de klant heeft."],
    vervolgvragen: [q("De klant noemt storm-, hagel- of brandschade zonder zijn dekking te noemen", DEKKING_VRAAG)],
    gerelateerd: ["hulpverlening"],
    controle: { status: "gecontroleerd", opmerking: "Samenvoeging van WA 3.1/3.2 met de Casco-voorwaarden; dat WA dit niet dekt volgt uit 'schade aan anderen' en uit asr.nl." },
  }),

  "algemene-uitsluitingen": b({
    brontekstSoort: "samenvatting",
    uitleg: "Voor schade door atoomkernreacties en molest ben je niet verzekerd. Dat geldt ook als je fraude pleegt of een betalingsachterstand hebt. Daarnaast zijn er situaties zonder dekking, zoals rijden onder invloed, zonder geldig rijbewijs, wedstrijden, verhuur, zakelijk gebruik, een kenteken niet op jouw naam en gebruik zonder toestemming.",
    aandachtspunten: ["Bij de meeste van die situaties geldt een uitzondering als je kunt bewijzen dat je er niets van wist, dat het tegen je wil gebeurde en dat jou niets te verwijten valt. Bij zakelijk gebruik staat zo'n uitzondering er niet bij."],
    klantinfo: ["Om welke situatie het gaat."],
    vervolgvragen: [q("De klant vraagt of iets is uitgesloten en het is niet bekend om welke situatie het gaat", "Om welke situatie gaat het, bijvoorbeeld alcohol, verhuur of zakelijk gebruik?")],
  }),

  "uitsluiting-rijbewijs": b({
    brontekstSoort: "samenvatting",
    uitleg: "Heeft de bestuurder geen geldig rijbewijs voor je auto, dan krijg je geen vergoeding. Er zijn uitzonderingen, bijvoorbeeld als het rijbewijs hooguit 1 jaar verlopen is of als hij onder toezicht reed. Ook als hij niet mag rijden of zijn rijbevoegdheid is ontzegd, krijg je geen vergoeding.",
    direct: ["Een verlopen rijbewijs: je krijgt alleen vergoeding als de bestuurder vergeten was het te vernieuwen en het niet langer dan 1 jaar verlopen is."],
    aandachtspunten: [
      "Ook vergoeding als de bestuurder minder dan 2 maanden voor het ongeval zijn rijbewijs haalde en het nog niet had ontvangen.",
      "Ook vergoeding bij rijden onder toezicht volgens de wettelijke regels, als de toezichthouder niet betaald krijgt voor de lessen.",
      "Ook vergoeding als het rijbewijs gestolen of verloren is.",
      "Ook vergoeding als je kunt bewijzen dat je er niets van wist, dat het tegen je wil gebeurde en dat jou niets te verwijten valt.",
      "Voldoet de auto niet aan de eisen op het rijbewijs van de bestuurder, dan krijg je geen vergoeding, behalve als je dezelfde uitzondering kunt bewijzen.",
    ],
    klantinfo: ["Heeft de bestuurder een geldig rijbewijs? Zo niet: is het verlopen, gestolen, verloren of nog niet ontvangen?"],
    vervolgvragen: [q("De klant noemt een rijbewijsprobleem zonder details", "Wat is er met het rijbewijs: is het verlopen, kwijt of nog niet ontvangen?")],
  }),

  "uitsluiting-wedstrijden": b({
    uitleg: "Schade tijdens snelheidsritten en wedstrijden, en tijdens de voorbereiding daarop, krijg je niet vergoed. Schade tijdens betrouwbaarheidsritten en puzzelritten vergoedt a.s.r. wel.",
    aandachtspunten: [UITSLUITING_UITZONDERING],
    klantinfo: ["Om wat voor rit of wedstrijd het gaat."],
    vervolgvragen: [q("Het is niet duidelijk om welke soort rit het gaat", "Gaat het om een snelheidsrit of wedstrijd, of om een betrouwbaarheidsrit of puzzelrit?")],
  }),

  "uitsluiting-verhuur": b({
    uitleg: "Ontstaat de schade terwijl je de auto verhuurt of least aan iemand anders, dan vergoedt a.s.r. de schade niet.",
    aandachtspunten: [UITSLUITING_UITZONDERING],
    klantinfo: ["Of de klant de auto aan een ander verhuurt of least."],
    vervolgvragen: [q("Het is niet duidelijk of er sprake is van verhuur", "Verhuur of lease je de auto aan iemand anders?")],
  }),

  "uitsluiting-zakelijk": b({
    uitleg: "Wordt de auto zakelijk gebruikt, dan krijg je geen vergoeding voor schade. Zakelijk betekent gebruik voor een bedrijf, zoals vervoer van personen of vracht tegen betaling of gebruik als lesauto.",
    direct: ["Bij zakelijk gebruik staat in deze voorwaarden geen uitzondering."],
    aandachtspunten: ["Voorbeelden van zakelijk gebruik: beroepsmatig vervoer van personen of van vracht tegen betaling, en gebruik van de auto als lesauto."],
    klantinfo: ["Of de klant de auto voor een bedrijf of tegen betaling gebruikt."],
    vervolgvragen: [q("Het is niet duidelijk hoe de auto wordt gebruikt", "Gebruik je de auto ook voor werk, of om tegen betaling mensen of spullen te vervoeren?")],
  }),

  "uitsluiting-kenteken": b({
    uitleg: "Staat het kenteken van de auto niet op jouw naam in het Kentekenregister van de RDW, dan krijg je geen schadevergoeding. Uitzondering: je hebt a.s.r. gemeld dat het kentekenbewijs op een andere naam stond en a.s.r. heeft dat geaccepteerd.",
    klantinfo: ["Op wiens naam het kenteken staat.", "Of dit aan a.s.r. is gemeld en door a.s.r. is geaccepteerd."],
    vervolgvragen: [q("Het is niet duidelijk op wiens naam het kenteken staat", "Op wiens naam staat het kenteken van de auto?")],
  }),

  "uitsluiting-toestemming": b({
    uitleg: "Schade die iemand veroorzaakt zonder toestemming om je auto te gebruiken, is niet verzekerd. Als verzekeringnemer ben je wel verzekerd als je kunt aantonen dat je het niet wist of dat het tegen je wil gebeurde, en dat jou niets te verwijten valt.",
    aandachtspunten: ["Joyrijden is een auto besturen zonder toestemming van de eigenaar of houder en zonder de bedoeling de auto te houden."],
    klantinfo: ["Of de bestuurder toestemming had."],
    vervolgvragen: [q("Het is niet duidelijk of er toestemming was", "Had die persoon toestemming om in je auto te rijden?")],
  }),

  hulpverlening: b({
    uitleg: "Met WA heb je recht op hulpverlening bij diefstal van de auto. Dat geldt ook als de auto door brand of een oorzaak van buitenaf zo beschadigd is dat je niet verder kunt rijden. Denk aan vervoer of een vervangende auto, bovenop het bedrag op je polisblad voor WA.",
    direct: ["Vraag vooraf toestemming aan de Alarmcentrale: 030 - 6990708."],
    aandachtspunten: ["Ook schade door het blussen van de brand valt eronder.", "Diefstal is stelen door anderen, of kwijtraken door verduistering of oplichting."],
    klantinfo: ["Wat er is gebeurd: diefstal, brand of een andere oorzaak.", "Of dit in Nederland of in het buitenland gebeurde."],
    vervolgvragen: [q("Het is niet bekend of het in Nederland of in het buitenland gebeurde", "Is dit in Nederland of in het buitenland gebeurd?")],
    gerelateerd: ["alarmcentrale", "hulpverlening-nederland"],
  }),

  "hulpverlening-nederland": b({
    uitleg: "Is je auto in Nederland gestolen of beschadigd? Dan vergoedt a.s.r. de berging en het vervoer van de auto naar een plek in Nederland die je zelf kiest. Ook het vervoer van de bestuurder en passagiers naar één adres in Nederland wordt vergoed.",
    direct: ["Vraag vooraf toestemming aan de Alarmcentrale."],
    aandachtspunten: ["Ook de bagage of lading wordt meevervoerd.", "Het vervoer van de bestuurder en passagiers moet direct na de schade zijn."],
    klantinfo: ["Naar welke plek in Nederland de auto moet."],
    vervolgvragen: [q("Het is niet bekend waar de klant naartoe wil", "Naar welke plek in Nederland moet de auto?")],
    gerelateerd: ["alarmcentrale"],
  }),

  "hulpverlening-diefstal-buitenland": b({
    uitleg: "Is je auto in het buitenland gestolen? Dan vergoedt a.s.r. onder meer de extra kosten van je terugreis of doorreis, en een vervangende auto als je op vakantie bent en die voortzet. De huur is maximaal € 100 per dag en € 1.250 per gebeurtenis.",
    direct: [
      "Neem zo snel mogelijk contact op met de Alarmcentrale en vraag vooraf toestemming: 030 - 6990708.",
      "Doe aangifte in het land waar het gebeurde, en daarna binnen 24 uur na thuiskomst ook in Nederland.",
    ],
    aandachtspunten: [
      "De huur van een vervangende auto krijg je alleen als je de auto voor vakantie gebruikt en de vakantie voortzet, tot de einddatum van de oorspronkelijke vakantie.",
      "Extra reiskosten voor bestuurder en passagiers: de goedkoopste vorm van openbaar vervoer.",
      "Wordt de auto teruggevonden, dan vergoedt a.s.r. het vervoer naar Nederland.",
      "Kost dat meer dan de restanten in Nederland waard zijn, dan vergoedt a.s.r. de kosten voor invoeren en demonteren in het land waar de schade is ontstaan.",
      "De telefoonkosten van contact met de Alarmcentrale worden vergoed.",
    ],
    klantinfo: ["Of de klant op vakantie is en de vakantie voortzet."],
    vervolgvragen: [q("Het is niet bekend of de klant op vakantie is", "Ben je op vakantie, en wil je de vakantie voortzetten?")],
    gerelateerd: ["alarmcentrale", "aangifte"],
  }),

  "hulpverlening-schade-buitenland": b({
    uitleg: "Is je auto in het buitenland beschadigd? Dan vergoedt a.s.r. berging en vervoer naar het dichtstbijzijnde herstelbedrijf. Een vervangende auto krijg je alleen als de reparatie langer dan 2 werkdagen duurt en je de vakantie voortzet.",
    direct: ["Schakel zo snel mogelijk de Alarmcentrale in, anders krijg je geen vergoeding: 030 - 6990708."],
    aandachtspunten: [
      "Een vervangende auto: alleen als de auto niet binnen 2 werkdagen gerepareerd kan worden (4 werkdagen als er onderdelen worden nagestuurd) en je de vakantie voortzet. Maximaal € 100 per dag en € 1.250 per gebeurtenis.",
      "Kan de auto gerepareerd worden, dan vergoedt a.s.r. ook de verzendkosten van nagestuurde onderdelen. De onderdelen zelf alleen met Casco.",
      "Kan de auto niet gerepareerd worden, dan vergoedt a.s.r. berging en vervoer van aanhanger en bagage naar Nederland of de eerstvolgende bestemming, en de extra reiskosten van bestuurder en passagiers.",
    ],
    klantinfo: ["Of de auto gerepareerd kan worden en hoe lang dat duurt.", "Of de klant op vakantie is."],
    vervolgvragen: [q("Het is niet bekend of de auto gerepareerd kan worden", "Weet je al of de auto gerepareerd kan worden en hoe lang dat duurt?")],
    gerelateerd: ["alarmcentrale"],
  }),

  "hulpverlening-geen-recht": b({
    uitleg: "Je hebt geen recht op hulpverlening in de situaties waarin je ook geen WA-vergoeding krijgt. Ook niet als de bestuurder niet alles deed om diefstal te voorkomen, bijvoorbeeld de auto niet afsluiten of de sleutels erin laten zitten.",
    direct: ["Heeft a.s.r. al kosten gemaakt en blijkt achteraf dat je geen recht had, dan moet je die kosten terugbetalen."],
    aandachtspunten: [
      "Ook geen recht bij schade doordat je de auto of aanhanger niet, niet op tijd of niet deskundig hebt laten onderhouden, of doordat hij overbelast is.",
      "Sleutels in de brievenbus van een garage- of schadeherstelbedrijf tellen ook als niet alles doen om diefstal te voorkomen.",
      "Uitzondering voor de verzekeringnemer: je bent wel verzekerd als je kunt aantonen dat je het niet wist, dat het tegen je wil gebeurde en dat jou niets te verwijten valt.",
    ],
    klantinfo: ["Hoe de auto was achtergelaten: afgesloten, en waar de sleutels waren."],
    vervolgvragen: [q("De klant vraagt of hulp bij diefstal is gedekt en het is niet bekend hoe de auto was achtergelaten", "Was de auto afgesloten, en zaten de sleutels er niet in of op?")],
    gerelateerd: ["hulpverlening"],
  }),

  alarmcentrale: b({
    uitleg: "De Alarmcentrale regelt hulpverlening en pechhulp en kiest zelf wie zij inschakelt. Vraag vooraf toestemming. Het nummer is 030 - 6990708.",
    direct: ["Bel de Alarmcentrale vooraf: 030 - 6990708. Bij schade en pech in het buitenland zo snel mogelijk, anders krijg je geen vergoeding."],
    aandachtspunten: [
      "Kan niemand redelijkerwijs bellen, dan ben je toch verzekerd, met maximaal de vergoeding die je met de Alarmcentrale had gekregen.",
      "De Alarmcentrale kan vragen om bewijs dat iemand de kosten kan betalen voor hulp die de verzekering niet dekt.",
      "Rekeningen voor niet-gedekte diensten betaal je binnen 30 dagen.",
    ],
    klantinfo: ["Of het om hulpverlening of pech gaat, en waar de klant is."],
    vervolgvragen: [q("Het is niet bekend wat er aan de hand is of waar de klant is", "Waar sta je, en wat is er aan de hand met je auto?")],
  }),

  pechhulp: b({
    uitleg: "Pechhulp is een extra dekking: je hebt die alleen als hij op je polisblad staat. Je krijgt pechhulp bij een mechanisch of elektronisch mankement waardoor je niet verder kunt rijden.",
    direct: ["Bel vooraf de Alarmcentrale: 030 - 6990708."],
    aandachtspunten: ["Pechhulp wordt vergoed bovenop het bedrag op je polisblad voor WA.", "De no-claimkorting geldt niet voor de premie van Pechhulp.", "Denk aan vervoer van jou of van de auto."],
    klantinfo: ["Of Pechhulp op het polisblad staat.", "Of de auto in Nederland of in het buitenland staat."],
    vervolgvragen: [q("De klant heeft pech en het is niet bekend of hij Pechhulp heeft", PECH_VRAAG)],
    gerelateerd: ["alarmcentrale", "pechhulp-nederland"],
  }),

  "pechhulp-nederland": b({
    uitleg: "Heb je pech in Nederland, dan vergoedt a.s.r. onder meer de noodreparatie langs de weg en het vervoer van de auto naar het dichtstbijzijnde herstelbedrijf. Je krijgt ook een vervangende auto voor maximaal 5 dagen.",
    direct: ["Schakel zo snel mogelijk de Alarmcentrale in, anders krijg je geen vergoeding."],
    aandachtspunten: [
      "Ook vergoed: berging, stalling en vervoer naar een plek in Nederland die je zelf kiest, en het vervoer van bestuurder en passagiers naar één adres.",
      "Vervangende onderdelen en gebruikte materialen krijg je niet vergoed.",
    ],
    klantinfo: ["Of Pechhulp op het polisblad staat."],
    vervolgvragen: [q("De klant heeft pech en het is niet bekend of hij Pechhulp heeft", PECH_VRAAG)],
    gerelateerd: ["alarmcentrale"],
  }),

  "pechhulp-buitenland": b({
    uitleg: "Heb je pech in het buitenland? Dan vergoedt a.s.r. onder meer noodreparatie, berging en vervoer naar het dichtstbijzijnde herstelbedrijf. Een vervangende auto krijg je alleen als de reparatie te lang duurt en je de vakantie voortzet.",
    direct: ["Schakel zo snel mogelijk de Alarmcentrale in, anders krijg je geen vergoeding."],
    aandachtspunten: [
      "Vervoer naar Nederland krijg je als de auto niet binnen 2 werkdagen (of 4 bij nasturen van onderdelen) gerepareerd kan worden, of als de reparatie langer duurt en degenen die kunnen rijden al terug zijn.",
      "Een vervangende auto: maximaal € 100 per dag en € 1.250 per gebeurtenis, tot de einddatum van de vakantie.",
      "Kan de auto niet gerepareerd worden, dan vergoedt a.s.r. ook de extra reiskosten van bestuurder en passagiers (goedkoopste openbaar vervoer).",
    ],
    klantinfo: ["Of Pechhulp op het polisblad staat.", "Of de auto gerepareerd kan worden."],
    vervolgvragen: [q("De klant heeft pech in het buitenland en het is niet bekend of hij Pechhulp heeft", PECH_VRAAG)],
    gerelateerd: ["alarmcentrale"],
  }),

  "pechhulp-geen-recht": b({
    uitleg: "Je hebt geen recht op pechhulp als de uitsluitingen van WA gelden. Ook niet als de pech komt doordat je de auto niet op tijd of niet deskundig hebt laten onderhouden, of doordat hij overbelast is.",
    direct: ["Blijkt achteraf dat je geen recht had, dan moet je de gemaakte kosten terugbetalen."],
    klantinfo: ["Of de auto goed en op tijd is onderhouden."],
    gerelateerd: ["pechhulp"],
  }),

  "vervangend-vervoer": b({
    brontekstSoort: "samenvatting",
    uitleg: "Vervangend vervoer krijg je bij hulpverlening en, met Pechhulp, bij pech. Laat je een beschadigde auto repareren bij een geselecteerd herstelbedrijf, dan krijg je gratis vervangend vervoer tijdens de reparatie. Bij pech in Nederland is de huur maximaal 5 dagen.",
    aandachtspunten: ["In het buitenland: maximaal € 100 per dag en € 1.250 per gebeurtenis, onder voorwaarden.", "Bij een geselecteerd herstelbedrijf vergoedt a.s.r. ook de haal- en brengservice."],
    klantinfo: ["Waarvoor de klant vervangend vervoer nodig heeft: pech, diefstal of een reparatie."],
    vervolgvragen: [q("Het is niet duidelijk waarom de klant vervangend vervoer nodig heeft", "Waarom heb je vervangend vervoer nodig: pech, diefstal of een reparatie?")],
  }),

  "garage-keuze": b({
    uitleg: "Een geselecteerd herstelbedrijf is een garage waar a.s.r. mee samenwerkt, waardoor reparaties goedkoper zijn. Je krijgt er garantie, een haal- en brengservice en gratis vervangend vervoer tijdens de reparatie.",
    aandachtspunten: ["De bedrijven staan op www.schadegarant.nl.", "Je bent zelf de opdrachtgever en handelt de reparatie met het herstelbedrijf af.", "Bij hulpverlening en pechhulp kiest de Alarmcentrale zelf wie zij inschakelt."],
    klantinfo: ["Of het om een reparatie na schade of om pech onderweg gaat."],
    vervolgvragen: [q("Het is niet duidelijk of het om een reparatie of om pech gaat", "Gaat het om een reparatie na schade, of om pech onderweg?")],
    gerelateerd: ["vervangend-vervoer"],
  }),

  ruitschade: b({
    uitleg: "Met WA is ruitschade aan je eigen auto niet verzekerd; dat kan wel met Casco beperkt of Casco allrisk. Gebruik je een geselecteerd ruitschadeherstelbedrijf, dan regelt a.s.r. de betaling rechtstreeks met dat bedrijf.",
    aandachtspunten: [
      "Je bent wel de opdrachtgever, maar hoeft geen geld voor te schieten. Je betaalt alleen een eventueel eigen risico aan het bedrijf.",
      "Je krijgt uitgebreide garantie op de reparatie en vervanging.",
      "De bedrijven staan op www.glasgarant.nl.",
    ],
    klantinfo: ["Welke dekking de klant heeft."],
    vervolgvragen: [q("De klant vraagt over ruitschade en het is niet bekend welke dekking hij heeft", DEKKING_VRAAG)],
    gerelateerd: ["sw-ruitschade"],
    controle: { status: "gecontroleerd", opmerking: "Dat WA geen ruitschade vergoedt, staat op asr.nl (WA-pagina: 'Ruitschade is niet verzekerd'); de WA-voorwaarden dekken schade aan anderen." },
  }),

  "eigen-risico": b({
    uitleg: "In de WA-voorwaarden staat geen eigen risico voor schade aan anderen. Bij Casco beperkt of Casco allrisk kan op je polisblad wel een eigen risico staan.",
    aandachtspunten: [
      "Het enige eigen risico dat de WA-voorwaarden noemen, is een eventueel eigen risico dat je betaalt aan een geselecteerd ruitschadeherstelbedrijf. De hoogte daarvan staat er niet in.",
      "Bij Casco allrisk kan een extra jeugd eigen risico gelden.",
      "Een eigen risico van een andere verzekering vergoedt a.s.r. niet.",
    ],
    klantinfo: ["Welke dekking de klant heeft."],
    vervolgvragen: [q("De klant vraagt naar eigen risico en het is niet bekend welke dekking hij heeft", DEKKING_VRAAG)],
    gerelateerd: ["cb-eigen-risico"],
  }),

  "schadevergoeding-benadeelde": b({
    uitleg: "Wordt jou iets verweten door een ander (de benadeelde)? Dan handelt a.s.r. de schade rechtstreeks met die persoon af, of treft een schikking. A.s.r. houdt daarbij rekening met jouw belangen.",
    direct: ["Doe zelf geen toezegging van betaling of schikking en laat je niet uit over je schuld: laat het afhandelen door a.s.r.", "Per gebeurtenis vergoedt a.s.r. maximaal de bedragen op je polisblad."],
    aandachtspunten: ["Moet a.s.r. volgens de W.A.M. of een soortgelijke buitenlandse wet iets betalen waarvoor je geen dekking hebt, dan mag a.s.r. dat op jou verhalen."],
    klantinfo: ["Wie de klant aansprakelijk heeft gesteld en waarvoor."],
    vervolgvragen: [q("De klant is aansprakelijk gesteld maar het is niet bekend door wie of waarvoor", "Wie heeft je aansprakelijk gesteld, en waarvoor?")],
    gerelateerd: ["medewerking"],
  }),

  "kosten-vergoed": b({
    brontekstSoort: "samenvatting",
    uitleg: "Naast de schade vergoedt a.s.r. een aantal kosten, bijvoorbeeld om schade te voorkomen of te beperken, kosten van procedures en rechtsbijstand op verzoek van a.s.r. en wettelijke rente. Daarvoor geldt geen maximum.",
    direct: ["Word je aangeklaagd in een strafproces? Laat het a.s.r. zo snel mogelijk weten."],
    aandachtspunten: [
      "Of er een advocaat voor je strafproces komt, bepaalt a.s.r.; die kosten vergoedt a.s.r. zonder maximum.",
      "Wordt er kosteloos een gewonde in de auto vervoerd, dan vergoedt a.s.r. de schade aan de auto en het reinigen of vervangen van bekleding, tot maximaal de dagwaarde.",
      "Geldboetes en bedragen om strafvervolging te voorkomen vergoedt a.s.r. niet.",
      "Over het deel boven het verzekerde bedrag betaalt a.s.r. geen wettelijke rente.",
    ],
    klantinfo: ["Om welke kosten het gaat: procedure, advocaat, boete of bekleding."],
    vervolgvragen: [q("De klant vraagt naar kosten zonder te zeggen om welke", "Om welke kosten gaat het?")],
  }),

  waarborgsom: b({
    uitleg: "Moet je een waarborgsom betalen, bijvoorbeeld voor je vrijlating of de teruggave van je rijbewijs, voor schade die verzekerd is? Dan betaalt a.s.r. die tot maximaal € 50.000 namens jou. Je moet het bedrag terugbetalen zodra het vrijkomt.",
    direct: ["Betaal het bedrag zo snel mogelijk aan a.s.r. terug zodra de waarborgsom vrijkomt, in elk geval binnen 12 maanden."],
    aandachtspunten: ["Het moet gaan om een waarborg aan een bevoegde overheidsinstantie.", "Ook voor het opheffen van een beslag op de auto."],
    klantinfo: ["Waarvoor de waarborgsom is: vrijlating, rijbewijs of beslag.", "Of de schade verzekerd is."],
    vervolgvragen: [q("De klant moet een waarborgsom betalen en het is niet bekend waarvoor", "Waarvoor moet je de waarborgsom betalen?")],
  }),

  "vergoeding-anderen": b({
    uitleg: "Kun je de schade ook terugkrijgen via een garantie, een wet of een andere verzekering? Dan vergoedt a.s.r. die niet. Zijn er meerdere verzekeringen, dan vergoedt a.s.r. alleen wat de andere verzekeraar niet betaalt omdat de schade hoger is dan het bedrag waarvoor je daar verzekerd bent.",
    aandachtspunten: ["A.s.r. vergoedt niet het eigen risico van de andere verzekering.", "Dit heet de 'Na u-bepaling'."],
    klantinfo: ["Of de klant ook een andere verzekering of garantie heeft die de schade dekt."],
    vervolgvragen: [q("Het is niet bekend of een andere verzekering of garantie de schade ook dekt", "Heb je ook een andere verzekering of een garantie die deze schade kan dekken?")],
    controle: HANDMATIG("Juridisch complex (Na u-bepaling). De chat mag niet zeggen welke verzekeraar uiteindelijk betaalt."),
  }),

  reageren: b({
    uitleg: "Na je schademelding krijg je het definitieve standpunt van a.s.r.: de vastgestelde vergoeding of een afwijzing. Ben je het er niet mee eens, dan laat je dat binnen 36 maanden weten.",
    direct: ["Je hebt 36 maanden om te reageren, gerekend vanaf de dag waarop jij of je gemachtigde het standpunt kreeg. Daarna kun je niet meer op het standpunt terugkomen."],
    klantinfo: ["Wanneer de klant het definitieve standpunt kreeg."],
    vervolgvragen: [q("De klant is het oneens met een besluit en het is niet bekend wanneer hij dat kreeg", "Wanneer heb je het besluit van a.s.r. gekregen?")],
    gerelateerd: ["al-klacht"],
  }),

  "noclaim-uitleg": b({
    brontekstSoort: "samenvatting",
    uitleg: "Met de no-claimladder krijg je korting op je premie. Start je met 0 schadevrije jaren, dan begin je op trede 5 met 50% korting. Zonder schade klim je elk jaar, tot maximaal 75% korting.",
    direct: ["Heb je schade, dan val je het volgende verzekeringsjaar terug op de ladder."],
    aandachtspunten: ["De maximale korting van 75% heb je vanaf trede 26 tot en met trede 31.", "Op trede 31 zonder schade blijf je op trede 31.", "De korting geldt niet voor de premie van Pechhulp.", "Voor elke trede kan de chat de exacte korting en de trede van volgend jaar geven."],
    klantinfo: ["Op welke trede de klant zit, of hoeveel schadevrije jaren hij heeft."],
    vervolgvragen: [q("De klant vraagt naar zijn korting en het is niet bekend op welke trede hij zit", "Op welke trede zit je, of hoeveel schadevrije jaren heb je?")],
    gerelateerd: ["schadevrije-jaren"],
  }),

  "noclaim-geen-gevolg": b({
    brontekstSoort: "samenvatting",
    uitleg: "Niet elke schade telt mee voor je no-claim. Bijvoorbeeld niet als a.s.r. niets vergoedt, als het hele bedrag bij een ander is teruggehaald, of als jij het bedrag terugbetaalt.",
    direct: ["Betaal je het hele bedrag zelf terug, dan moet dat binnen 12 maanden nadat a.s.r. voor het laatst betaalde."],
    aandachtspunten: [
      "Ook niet bij een aanrijding met een fietser of voetganger, als je kunt aantonen dat de bestuurder niets te verwijten is.",
      "Ook niet als a.s.r. alleen betaalt voor hulpverlening, pechhulp, kosten om schade te voorkomen of te beperken, kosten of schade bij hulp aan gewonden, haal- en brengservice of expertisekosten.",
      "Ook niet als a.s.r. betaalt omdat dat met een andere verzekeraar is afgesproken, of als het bedrag helemaal is verhaald op het Waarborgfonds Motorverkeer.",
    ],
    klantinfo: ["Wat voor schade het was en wie die betaalde of terugbetaalde."],
    vervolgvragen: [q("De klant vraagt of een schade meetelt en het is niet bekend om welke schade het gaat", "Om wat voor schade gaat het, en wie heeft die betaald?")],
    gerelateerd: ["schade-zonder-schuld"],
  }),

  "schade-zonder-schuld": b({
    uitleg: "Is de schade niet door (mede)schuld van de bestuurder of passagier ontstaan? Dan telt ze niet mee voor je no-claimladder, maar wel voor de tabel schadevrije jaren. Bij een onbekende dader of een tegenpartij die doorrijdt moet je snel aangifte doen.",
    direct: ["Doe direct aangifte bij de politie, uiterlijk binnen 14 dagen, bij schade door onbekenden, doorrijden na een ongeval of een aanrijding door onbekenden. In het buitenland doe je aangifte in dat land."],
    aandachtspunten: ["Doe je geen aangifte, doe je die te laat of werk je niet mee aan het vinden van getuigen, dan telt de schade toch mee voor de no-claimladder.", "Bij een (vermoeden van een) schuldige derde moet je er alles aan doen om dat aan te tonen."],
    klantinfo: ["Of er een schuldige derde is en of die bekend is.", "Of er al aangifte is gedaan."],
    vervolgvragen: [q("Het is niet bekend of er al aangifte is gedaan", "Heb je al aangifte gedaan bij de politie?")],
    gerelateerd: ["aangifte"],
  }),

  "noclaim-casco": b({
    uitleg: "Krijg je schade aan je eigen auto vergoed via Casco allrisk? Dan kan dat gevolgen hebben voor je trede op de no-claimladder en voor je schadevrije jaren. Of dat zo is, staat in de voorwaarden van Casco allrisk.",
    aandachtspunten: ["Het gaat om het hoofdstuk 'Hoe werkt de no-claimregeling?' in de voorwaarden van Casco allrisk."],
    klantinfo: ["Of de klant Casco allrisk heeft en om welke schade het gaat."],
    vervolgvragen: [q("De klant vraagt naar de no-claim bij schade aan de eigen auto en het is niet bekend of hij Casco allrisk heeft", "Heb je WA + Casco allrisk, of een andere dekking?")],
    gerelateerd: ["ca-noclaim-geen-gevolg"],
  }),

  "juiste-gegevens": b({
    uitleg: "Bij je aanvraag geef je de juiste gegevens over je auto, je adres, de vaste bestuurder en het aantal kilometers per jaar. Kloppen ze niet, dan kan dat gevolgen hebben voor je vergoeding en kan a.s.r. je premie of voorwaarden aanpassen, ook met terugwerkende kracht.",
    direct: ["Klopt een gegeven niet meer? Geef het door: bij een verhuizing of een andere vaste bestuurder binnen 30 dagen."],
    aandachtspunten: ["Het gaat om de auto, je adres, de regelmatige bestuurder en het aantal kilometers per jaar.", "A.s.r. laat het je weten als de premie of voorwaarden worden aangepast."],
    klantinfo: ["Welk gegeven niet klopt."],
    vervolgvragen: [q("De klant zegt dat zijn gegevens niet kloppen maar het is niet bekend welke", "Welk gegeven klopt niet: de auto, je adres, de vaste bestuurder of het aantal kilometers?")],
    gerelateerd: ["wijzigingen-doorgeven"],
  }),

  aangifte: b({
    uitleg: "Doe direct aangifte bij de politie bij bijvoorbeeld diefstal, inbraak, vandalisme of doorrijden door een tegenpartij. Bij diefstal of joyrijden doe je dat nog dezelfde dag, of de volgende ochtend als het 's avonds of 's nachts gebeurde.",
    direct: [
      "Diefstal of joyrijden: aangifte nog dezelfde dag, of de volgende ochtend als het 's avonds of 's nachts is gebeurd.",
      "Inbraak, beschadiging door onbekenden, vandalisme of doorrijden na een ongeval: aangifte direct, uiterlijk binnen 14 dagen.",
      "Stuur het bewijs van de aangifte zo snel mogelijk naar a.s.r.",
    ],
    aandachtspunten: [
      "Gebeurt het in het buitenland, doe dan aangifte in dat land. Bij diefstal van de auto doe je ook aangifte in Nederland, binnen 24 uur na thuiskomst.",
      "Vandalisme is opzettelijke beschadiging door een derde.",
      "De termijn van 14 dagen is belangrijk om de schade te kunnen verhalen bij het Waarborgfonds Motorverkeer.",
    ],
    klantinfo: ["Wat er is gebeurd.", "Of het in Nederland of in het buitenland gebeurde.", "Wanneer het gebeurde."],
    vervolgvragen: [q("Het is niet bekend wat er is gebeurd", "Wat is er gebeurd?")],
  }),

  medewerking: b({
    uitleg: "Na een schade vraagt a.s.r. je mee te werken: volg de aanwijzingen op en geef alle informatie. Doe zelf geen toezegging van betaling en laat je niet uit over wie er schuld heeft.",
    direct: ["Doe zelf geen toezegging van betaling of schikking en laat je niet uit over je schuld of aansprakelijkheid.", "Word je strafrechtelijk vervolgd? Laat het a.s.r. zo snel mogelijk weten."],
    aandachtspunten: [
      "Doe niets wat de belangen van a.s.r. schaadt en doe alles wat redelijk is om schade te voorkomen of te verminderen.",
      "Houd je je niet aan je verplichtingen en schaad je de belangen van a.s.r., dan heb je geen recht op schadevergoeding.",
      "Volg ook de aanwijzingen van de deskundigen en de Alarmcentrale op.",
    ],
  }),

  "wijzigingen-doorgeven": b({
    uitleg: "Verkoop of vervang je je auto? Laat het a.s.r. dan direct weten. Verhuis je of is er een andere vaste bestuurder, dan geef je dat binnen 30 dagen door.",
    direct: ["Auto verkocht of vervangen: direct doorgeven.", "Verhuizing of een andere regelmatige bestuurder: binnen 30 dagen doorgeven."],
    aandachtspunten: ["Na zo'n melding kan a.s.r. de verzekering beëindigen of de premie en voorwaarden wijzigen."],
    klantinfo: ["Wat er is veranderd: de auto, het adres of de bestuurder."],
    vervolgvragen: [q("Het is niet bekend wat er is veranderd", "Wat is er veranderd: je auto, je adres of de vaste bestuurder?")],
    gerelateerd: ["auto-verkopen"],
  }),

  "gevolgen-verplichtingen": b({
    uitleg: "Houd je je niet aan je verplichtingen en schaadt dat a.s.r.? Dan kan a.s.r. de schade en kosten op jou verhalen. Kloppen je gegevens niet, dan kan dat gevolgen hebben voor je vergoeding en voor je verzekering.",
    aandachtspunten: ["A.s.r. kan je premie of voorwaarden aanpassen of de verzekering beëindigen, ook met terugwerkende kracht.", "Je krijgt daarvan bericht.", "Het gaat om gegevens op je aanvraag, wijzigingsverzoek, polisblad of schademelding."],
    klantinfo: ["Welke verplichting of welk gegeven het betreft."],
    gerelateerd: ["juiste-gegevens"],
    controle: HANDMATIG("Juridisch gewicht: 'kan de schade en kosten op jou verhalen' en 'beëindigen met terugwerkende kracht'. De chat mag dit niet zekerder maken dan de voorwaarden doen."),
  }),

  leenauto: b({
    uitleg: "WA geldt ook voor een leenauto van de garage, als je eigen auto een beurt of reparatie krijgt. Dat is alleen zo als de leenauto zelf niet verzekerd is.",
    direct: ["Eindigt je verzekering, dan is ook de leenauto niet meer verzekerd."],
    aandachtspunten: ["A.s.r. vergoedt de schade alleen als degene die de leenauto uitleent geen verzekering voor die auto heeft, of als de schade niet gedekt is op de eigen verzekering van de leenauto."],
    klantinfo: ["Of de garage de leenauto zelf heeft verzekerd."],
    vervolgvragen: [q("Het is niet bekend of de leenauto verzekerd is", "Weet je of de garage de leenauto zelf heeft verzekerd?")],
  }),

  "auto-verkopen": b({
    uitleg: "Verkoop je je auto en stopt je verzekering daardoor tussentijds? Dan betaalt a.s.r. de premie voor het resterende deel terug. Laat de verkoop direct aan a.s.r. weten.",
    direct: ["Laat het a.s.r. direct weten als je de auto verkoopt of vervangt door een andere auto."],
    aandachtspunten: ["Bij verkoop stopt de verzekering direct bij de overdracht van de eigendom (Algemene voorwaarden)."],
    klantinfo: ["Wanneer de eigendom wordt overgedragen.", "Of de klant een andere auto koopt."],
    vervolgvragen: [q("De klant verkoopt zijn auto en het is niet bekend of hij een andere auto koopt", "Koop je een andere auto, of heb je geen auto meer?")],
    gerelateerd: ["al-geen-belang"],
  }),

  "buitenlandse-wet": b({
    uitleg: "Breng je in een land waar je verzekering geldt iemand schade toe, en heeft de wet daar ruimere regels dan de Nederlandse WAM? Dan gelden die ruimere regels ook voor jouw verzekering.",
    klantinfo: ["In welk land de schade is ontstaan."],
    controle: HANDMATIG("Juridisch (W.A.M. en buitenlandse wetgeving). De chat mag niet zeggen wat de wet in een bepaald land inhoudt."),
  }),

  opzet: b({
    uitleg: "Schade die de bestuurder of een passagier met opzet veroorzaakt, of door bewuste roekeloosheid, krijg je niet vergoed. Dat geldt ook voor schade die iemand met jouw goedvinden veroorzaakt.",
    aandachtspunten: ["Uitzondering: je krijgt wel een vergoeding als je kunt bewijzen dat jou niets te verwijten valt."],
    klantinfo: ["Wat er gebeurde en of het opzettelijk was."],
  }),

  fraude: b({
    uitleg: "Vertel je opzettelijk niet de waarheid of niet alles over een schade, of pleeg je fraude? Dan krijg je geen schadevergoeding. Fraude is misbruik van vertrouwen om een vergoeding of dekking te krijgen.",
    aandachtspunten: ["Een voorbeeld: niet eerlijk informatie opgeven bij het afsluiten van een verzekering of bij de afhandeling van een schade.", "Wat a.s.r. verder bij fraude doet, staat in de Algemene voorwaarden."],
    gerelateerd: ["al-fraude"],
  }),

  "criminele-activiteiten": b({
    uitleg: "Schade die ontstaat terwijl de bestuurder of een passagier een misdrijf pleegt, eraan meedoet of het probeert, vergoedt a.s.r. niet.",
    aandachtspunten: [UITSLUITING_UITZONDERING],
    klantinfo: ["Wat er gebeurde."],
  }),

  terrorisme: b({
    uitleg: "Is verzekerde schade veroorzaakt door terrorisme? Dan wordt die vergoed volgens het Clausuleblad terrorismedekking. A.s.r. betaalt dan maximaal het bedrag dat de Nederlandse Herverzekeringsmaatschappij voor Terrorismeschaden (NHT) aan a.s.r. uitkeert.",
    aandachtspunten: [
      "De NHT biedt herverzekeringsdekking tot maximaal 1 miljard euro per kalenderjaar voor alle aangesloten verzekeraars samen.",
      "De NHT kan de uitkering uitstellen of gedeeltelijk uitkeren, en beslist of een gebeurtenis als terrorisme geldt.",
      "Meer informatie staat op www.terrorismeverzekerd.nl.",
    ],
    controle: HANDMATIG("Juridisch complex (herverzekering, beslissingsbevoegdheid NHT). De chat doet geen uitspraken over een concrete gebeurtenis."),
  }),

  begrippen: b({
    brontekstSoort: "samenvatting",
    uitleg: "In de begrippenlijst staat wat een paar woorden betekenen, zoals atoomkernreactie, molest, restanten, gebeurtenis en schademelding.",
    aandachtspunten: [
      "Molest is binnenlandse onlusten, burgeroorlog, gewapend conflict, muiterij, oproer of opstand.",
      "Restanten is alles wat na een schade nog over is van de auto of de aanhanger.",
      "Een gebeurtenis is een plotseling en onvoorzien voorval of een reeks van voorvallen die met elkaar verband houden, waardoor schade ontstaat.",
      "Een schademelding is een melding van of vraag naar schade waarbij de toedracht, plaats en datum bekend zijn.",
      "Schade door atoomkernreacties vergoedt a.s.r. alleen onder strikte voorwaarden.",
    ],
    klantinfo: ["Welk woord de klant uitgelegd wil hebben."],
    vervolgvragen: [q("Het is niet duidelijk welk begrip de klant bedoelt", "Welk woord wil je uitgelegd hebben?")],
    controle: HANDMATIG("Samenvatting van een begrippenlijst; de definitie van atoomkernreactie is juridisch en hier sterk ingekort."),
  }),

  "contact-en-bedrijf": b({
    uitleg: "De verzekeraar is ASR Schadeverzekering N.V. in Utrecht, Archimedeslaan 10, 3584 BA Utrecht. Meer informatie vind je op www.asr.nl.",
    aandachtspunten: ["Het KVK-nummer is 30031823."],
  }),
};
