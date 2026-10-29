import type { Verrijking } from "./types";

/**
 * Fase 2 van het kennisbankplan: tien proefartikelen met de klantvriendelijke laag (`Verrijking`). De sleutel is het id van
 * het bestaande kennisblok; de brontekst en bronverwijzing van dat blok blijven ongewijzigd. De overige blokken
 * krijgen deze laag pas na goedkeuring.
 *
 * Elke uitleg en elk punt is naast de brontekst gelegd. Bedragen en termijnen komen letterlijk uit het document of de
 * asr.nl-pagina waarop het blok is gebaseerd; waar een punt van de website komt of uit een lijst is afgeleid, staat dat
 * in `controle.opmerking`.
 */
export const PROEFARTIKELEN: Record<string, Verrijking> = {
  // 1. WA-dekking
  "wa-dekking": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Met WA ben je verzekerd voor schade die jij met je auto aan anderen en hun spullen veroorzaakt, als je daarvoor aansprakelijk bent. Schade aan je eigen auto vergoedt WA niet.",
    direct: ["WA is wettelijk verplicht als je een auto op jouw naam hebt.", "Schade aan je eigen auto valt niet onder WA."],
    aandachtspunten: [
      "Het gaat om letsel van personen en om schade aan spullen, ook de gevolgen daarvan.",
      "Ook gedekt: schade door een aanhanger, door lading die uit de auto valt en door passagiers.",
      "Niet gedekt: schade aan de spullen die je zelf vervoert, en letsel van de bestuurder of schade aan zijn spullen.",
      "Maximum: de bedragen op je polisblad. Op asr.nl staat: letselschade maximaal € 6.450.000 per schadegeval, schade aan zaken en spullen maximaal € 2.500.000.",
      "In een paar situaties krijg je geen vergoeding, bijvoorbeeld bij rijden onder invloed, zonder geldig rijbewijs, bij wedstrijden, verhuur of zakelijk gebruik.",
      "Ben je niet aansprakelijk voor de schade, dan kan a.s.r. namens jou verweer voeren.",
    ],
    klantinfo: ["Welke dekking de klant heeft (alleen WA of WA met Casco).", "Gaat het om schade aan de eigen auto of aan een ander?"],
    vervolgvragen: [{ als: "Het is niet duidelijk of de schade aan de eigen auto of aan een ander is", vraag: "Gaat het om schade aan jouw eigen auto, of aan de auto of spullen van iemand anders?" }],
    gerelateerd: ["sw-wa-bedragen"],
    controle: { status: "handmatig-controleren", opmerking: "Dat WA verplicht is en dat eigen-autoschade niet onder WA valt, staat op asr.nl; de WA-voorwaarden zeggen alleen dat WA schade aan anderen dekt. De maximumbedragen staan niet in de voorwaarden maar op asr.nl." },
  },

  // 2. WA+ (WA + Casco beperkt)
  "cb-dekking-overzicht": {
    brontekstSoort: "samenvatting",
    uitleg: "Met WA + Casco beperkt is naast schade aan anderen ook je eigen auto verzekerd voor een aantal oorzaken, zoals brand, storm, diefstal en ruitschade. Schade door een aanrijding of vandalisme valt er niet onder.",
    direct: ["Een aanrijding met een ander voertuig staat niet in de lijst van gedekte gebeurtenissen; die schade is wel gedekt met Casco allrisk."],
    aandachtspunten: [
      "Gedekt: bevriezing (door een gedekte gebeurtenis), blikseminslag, botsing met dieren, brand, (poging tot) diefstal, inbraak of joyrijden, diefstal van sleutels, kortsluiting, luchtverkeer, natuurramp, ontploffing, rellen, ruitschade, storm en vervoer door een transportondernemer.",
      "Storm betekent wind van 14 meter per seconde of meer.",
      "Niet gedekt: normaal onderhoud, onvoldoende onderhoud, onvoldoende zorg (bijvoorbeeld doorrijden met een waarschuwingslampje, een verlopen APK, een laptop in het zicht) en slijtage.",
      "Standaard is 1 jaar nieuwwaarde meeverzekerd; dat kan tot 3 jaar.",
      "Extra's (later ingebouwde spullen) zijn verzekerd tot € 1.000, beeld-, geluids- en navigatieapparatuur tot € 500.",
      "Op je polisblad kan een eigen risico staan.",
    ],
    klantinfo: ["Wat er met de auto is gebeurd (de oorzaak van de schade).", "Of de klant WA + Casco beperkt heeft."],
    vervolgvragen: [{ als: "De klant zegt alleen 'schade aan mijn auto' zonder oorzaak", vraag: "Wat is er precies gebeurd met je auto?" }],
    gerelateerd: ["cb-eigen-risico"],
    controle: { status: "handmatig-controleren", opmerking: "Dat een aanrijding en vandalisme niet gedekt zijn, is afgeleid uit het ontbreken in de lijst van 3.1 en bevestigd op asr.nl ('Schade aan je eigen auto door aanrijding of vandalisme is niet verzekerd'). Laat dit juridisch bevestigen." },
  },

  // 3. Allrisk
  "ca-dekking-overzicht": {
    brontekstSoort: "samenvatting",
    uitleg: "Met WA + Casco allrisk ben je naast schade aan anderen het ruimst verzekerd voor schade aan je eigen auto. Ook schade door een aanrijding of door je eigen schuld is gedekt.",
    direct: ["Schade die je met opzet veroorzaakt is nooit verzekerd."],
    aandachtspunten: [
      "Gedekt zijn onder meer aanrijding, botsing, slippen, omslaan, in het water raken, van de weg raken, brand, diefstal, storm, natuurramp, ruitschade, vandalisme en een overige oorzaak van buitenaf.",
      "Niet gedekt: normaal onderhoud, onvoldoende onderhoud, onvoldoende zorg (bijvoorbeeld doorrijden met een waarschuwingslampje, een verlopen APK) en slijtage.",
      "Motor, aandrijving, elektrische installatie en transmissie zijn alleen gedekt bij een eigen gebrek, en alleen als de auto nieuw was bij afgifte, niet ouder is dan 36 maanden, niet meer dan 100.000 kilometer heeft gereden en het onderhoud door een BOVAG-erkend bedrijf of de merkdealer is gedaan.",
      "Is de bestuurder jonger dan 24 en de vaste bestuurder op je polis 24 of ouder, dan geldt bij een aanrijding een extra eigen risico van € 250.",
    ],
    klantinfo: ["Wat er met de auto is gebeurd.", "Bij een aanrijding: wie er reed en hoe oud die persoon is."],
    vervolgvragen: [{ als: "Het gaat om een aanrijding en het is niet bekend wie reed", vraag: "Wie reed er op dat moment, en hoe oud is die persoon?" }],
    gerelateerd: ["ca-jeugd-eigen-risico"],
    controle: { status: "gecontroleerd", opmerking: "Dat eigen schuld is gedekt en opzet nooit, staat op asr.nl (Allrisk-pagina); de voorwaarden dekken aanrijding, botsing, slippen enzovoort zonder schuldvraag." },
  },

  // 4. Diefstal
  "cb-diefstal": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Met WA + Casco beperkt of allrisk ben je verzekerd bij (poging tot) diefstal, inbraak of joyrijden. Doe nog dezelfde dag aangifte bij de politie, of de volgende ochtend als het 's avonds of 's nachts gebeurde, en meld de diefstal zo snel mogelijk bij a.s.r.",
    direct: [
      "Aangifte bij de politie: nog dezelfde dag, of de volgende ochtend als het 's avonds of 's nachts is gebeurd.",
      "Meld bij diefstal de gegevens van de auto zo snel mogelijk bij het Verzekeringsbureau Voertuigcriminaliteit (VbV): 071 - 3641777, dag en nacht bereikbaar.",
    ],
    aandachtspunten: [
      "Heb je hulp nodig, zoals vervoer of een huurauto? Vraag vooraf toestemming aan de Alarmcentrale: 030 - 6990708.",
      "Gebeurde het in het buitenland, doe dan aangifte in dat land en daarna binnen 24 uur na thuiskomst ook in Nederland.",
      "Je krijgt geen vergoeding als de auto niet was afgesloten, de sleutels erin of erop zaten, of de sleutels in de brievenbus van een garage lagen. Uitzondering: je kunt aantonen dat je het niet wist of dat het tegen je wil gebeurde.",
      "Moet je auto een beveiligingssysteem hebben (dat staat op je polisblad) en voldoe je daar niet aan, dan krijg je geen vergoeding voor diefstal.",
      "De vergoeding krijg je 30 dagen na je melding, als je het eigendom van de auto aan a.s.r. overdraagt en het kentekenbewijs, het overschrijvingsbewijs en alle sleutels inlevert.",
      "Wordt de auto binnen 30 dagen teruggevonden, dan moet je hem terugnemen en krijg je de schade vergoed die tijdens de diefstal is ontstaan. Meld het a.s.r. zodra je weet dat hij terecht is.",
      "Diefstal van sleutels: vervanging van sleutels, sloten en het omcoderen vergoedt a.s.r. tot € 500, als je direct aangifte deed en alles binnen 24 uur is vervangen. Verlies van sleutels is niet verzekerd.",
      "Met alleen WA is de gestolen auto zelf niet verzekerd.",
    ],
    klantinfo: ["Heeft de klant WA + Casco (beperkt of allrisk)? Met alleen WA is de auto zelf niet gedekt.", "Is het in Nederland of in het buitenland gebeurd?", "Is er al aangifte gedaan?"],
    vervolgvragen: [
      { als: "Het is niet bekend of de klant al aangifte deed", vraag: "Heb je al aangifte gedaan bij de politie?" },
      { als: "Het is niet bekend of het in het buitenland gebeurde", vraag: "Is dit in Nederland of in het buitenland gebeurd?" },
    ],
    gerelateerd: ["cb-aangifte", "aangifte", "cb-diefstal-afwikkeling"],
    controle: { status: "gecontroleerd", opmerking: "Dat de gestolen auto bij alleen WA niet is verzekerd, staat op asr.nl (WA-pagina); de WA-voorwaarden dekken wel hulpverlening bij diefstal." },
  },

  // 5. Schade melden
  "schade-melden": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Meld je schade zodra je ervan weet. Doe je dat te laat, dan kan dat gevolgen hebben voor je vergoeding. Na 36 maanden krijg je helemaal geen schadevergoeding meer.",
    direct: ["Meld de schade zodra je ervan weet.", "Een melding na 36 maanden krijgt geen schadevergoeding meer."],
    aandachtspunten: [
      "Wordt iemand anders aansprakelijk gesteld voor schade met je auto, dan heb je 36 maanden om bij a.s.r. een vergoeding te vragen.",
      "Geef a.s.r. alle informatie die nodig is en vul de juiste gegevens in.",
      "Stuur originele bewijsstukken en documenten zo snel mogelijk op, naar a.s.r. of naar de deskundige die a.s.r. heeft ingeschakeld.",
      "Bij diefstal meld je de gegevens van de auto ook zo snel mogelijk bij het VbV: 071 - 3641777.",
      "Je kunt schade online melden. Veroorzaakt een ander schade aan jouw auto, meld die dan ook bij a.s.r.; zij nemen contact op met de verzekeraar van de tegenpartij.",
    ],
    klantinfo: ["Wanneer de schade is ontstaan.", "Wat er is gebeurd (diefstal, ruit, aanrijding, schade aan een ander)."],
    vervolgvragen: [{ als: "Het is niet duidelijk wat er is gebeurd", vraag: "Wat is er gebeurd?" }],
    gerelateerd: ["cb-aangifte", "aangifte"],
    controle: { status: "gecontroleerd", opmerking: "Dat je schade online kunt melden en dat a.s.r. contact opneemt met de verzekeraar van de tegenpartij, staat op asr.nl (WA-pagina)." },
  },

  // 6. Opzegging
  "al-opzeggen-jij": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "In het eerste verzekeringsjaar kun je je autoverzekering niet opzeggen. Daarna zeg je op elk moment online op via je a.s.r. account.",
    direct: [
      "Eerste verzekeringsjaar (tot een jaar na de ingangsdatum op je polisblad): opzeggen kan niet.",
      "Daarna zeg je op elk moment online op via je a.s.r. account.",
      "De verzekering stopt op de eerstvolgende maandelijkse beëindigingsdatum, op dezelfde dag van de maand als je ingangsdatum.",
    ],
    aandachtspunten: [
      "Ben je het niet eens met een wijziging van premie of voorwaarden, dan kun je wel in het eerste jaar online opzeggen. De verzekering stopt dan op de datum waarop de wijziging zou ingaan.",
      "Verkoop je de auto, dan stopt de verzekering direct bij de overdracht van de eigendom en betaalt a.s.r. de premie over de resterende termijn terug. Geef de verkoop direct door.",
      "Zeg je op, dan geeft a.s.r. je aantal schadevrije jaren door aan Roy-data.",
      "Een rekenvoorbeeld uit de voorwaarden (ingangsdatum 6 november, opzegdatum 18 maart, einde 6 april) is alleen een voorbeeld.",
    ],
    klantinfo: ["Wanneer de verzekering is ingegaan (de ingangsdatum).", "Waarom de klant wil opzeggen, bijvoorbeeld auto verkocht of het niet eens zijn met een wijziging."],
    vervolgvragen: [
      { als: "De ingangsdatum is niet bekend en de klant wil opzeggen", vraag: "Wanneer is je verzekering ingegaan?" },
      { als: "De klant kan nog niet opzeggen en de reden is niet bekend", vraag: "Heb je je auto verkocht, of ben je het niet eens met een wijziging van je premie of voorwaarden?" },
    ],
    gerelateerd: ["al-niet-eens-wijziging", "auto-verkopen"],
    controle: { status: "gecontroleerd", opmerking: "Opzeggen door a.s.r. staat in een apart blok (al-opzeggen-wij). De Algemene voorwaarden gelden voor alle dekkingen." },
  },

  // 7. Eigen risico
  "cb-eigen-risico": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Het eigen risico is het bedrag dat a.s.r. van een schadevergoeding afhaalt. Op asr.nl kies je bij Casco uit € 0, € 150, € 250 of € 500. Hoe hoger je eigen risico, hoe lager je premie.",
    direct: ["Je eigen risico staat met het bedrag op je polisblad.", "Geen eigen risico bij hulpverlening, pechhulp, het repareren van een ruit en de extra kosten uit hoofdstuk 4.4."],
    aandachtspunten: [
      "Het eigen risico gaat van je vergoeding af, ook als er een maximumbedrag geldt.",
      "Een ruit laten repareren (bijvoorbeeld een sterretje) kost geen eigen risico; een ruit laten vervangen wel.",
      "Een eigen risico van een andere verzekering vergoedt a.s.r. niet.",
      "Bij WA (schade aan anderen) noemen de voorwaarden geen eigen risico.",
      "Bij Casco allrisk kan een extra jeugd eigen risico van € 250 gelden als de bestuurder jonger is dan 24.",
    ],
    klantinfo: ["Welke dekking de klant heeft.", "Om welke schade het gaat, bijvoorbeeld een ruit of een aanrijding."],
    vervolgvragen: [{ als: "De klant vraagt of er eigen risico geldt maar zegt niet om welke schade het gaat", vraag: "Om welke schade gaat het, bijvoorbeeld ruitschade of schade door een aanrijding?" }],
    gerelateerd: ["sw-eigen-risico", "ca-jeugd-eigen-risico"],
    controle: { status: "handmatig-controleren", opmerking: "De keuze uit € 0, € 150, € 250 of € 500 staat op asr.nl, niet in de voorwaarden; die verwijzen naar het polisblad." },
  },

  // 8. Schadevrije jaren
  "schadevrije-jaren": {
    brontekstSoort: "samenvatting",
    uitleg: "Een schadevrij jaar is een jaar zonder schade. Je schadevrije jaren staan in Roy-data, een landelijk systeem van verzekeraars. Elk jaar zonder schade komt er één bij; bij schade val je terug volgens een vaste tabel.",
    direct: [
      "Zonder schade krijg je er elk jaar 1 schadevrij jaar bij.",
      "Bij schade val je altijd terug volgens de tabel, ook met meer dan 16 schadevrije jaren: bij 1 schade naar 10, bij 2 schades naar 5, bij 3 schades naar 0 en bij 4 of meer schades naar -5.",
    ],
    aandachtspunten: [
      "Bij je eerste aanvraag geef je je schadevrije jaren op. A.s.r. zoekt ze op in Roy-data. Staan er geen schadevrije jaren, dan gaat a.s.r. uit van 0.",
      "Wijkt Roy-data af van wat je opgaf, dan geldt Roy-data en past a.s.r. je premie per ingangsdatum aan.",
      "Klopt Roy-data volgens jou niet? Neem dan contact op met je vorige verzekeraar.",
      "Niet elke schade telt mee, bijvoorbeeld als a.s.r. geen vergoeding betaalt of alles kan terugvragen bij een ander.",
      "Bij Casco beperkt heeft een schade die a.s.r. betaalt geen negatieve gevolgen voor je schadevrije jaren.",
      "Voor elk aantal schadevrije jaren kan de chat het exacte aantal voor volgend jaar geven.",
    ],
    klantinfo: ["Hoeveel schadevrije jaren de klant nu heeft.", "Of er schade is geweest en hoeveel."],
    vervolgvragen: [{ als: "De klant vraagt wat er bij schade gebeurt maar noemt het aantal schadevrije jaren niet", vraag: "Hoeveel schadevrije jaren heb je nu?" }],
    gerelateerd: ["noclaim-uitleg"],
    controle: { status: "gecontroleerd", opmerking: "Samenvoeging van WA 6.2 en Casco Beperkt 7.2. De terugvaltabel staat als exacte data in de kennisbank." },
  },

  // 9. Nieuwwaarderegeling
  "cb-waarde-nieuwwaarde": {
    brontekstSoort: "samenvatting",
    uitleg: "Heb je een nieuwe auto rechtstreeks bij een Nederlandse dealer gekocht en ben je de eerste eigenaar? Dan wordt je auto bij schade of diefstal de eerste tijd vergoed op basis van de nieuwwaarde. Na het eerste jaar wordt dat bedrag elke maand een stukje lager.",
    direct: [
      "Standaard krijg je 100% van de nieuwwaarde in maand 1 tot en met 12 na de afgiftedatum. Daarna daalt het, tot 64% (over de eerste € 12.500) en 52% (over het meerdere) in maand 36.",
      "Met Nieuwwaarde 2 jaar blijft het 100% in maand 1 tot en met 24, met Nieuwwaarde 3 jaar in maand 1 tot en met 36. Dat moet op je polisblad staan.",
      "Na de 36e maand, of bij een cataloguswaarde boven € 80.000 inclusief BTW, geldt de dagwaarde.",
    ],
    aandachtspunten: [
      "De nieuwwaarde is het maximum van 110% van de cataloguswaarde op je polisblad.",
      "Het geldt alleen voor een auto die je nieuw rechtstreeks bij een Nederlandse dealer kocht en waarvan je de eerste eigenaar bent. Anders gelden de aankoopwaarde (als die op je polisblad staat) of de dagwaarde.",
      "Het is total loss op basis van nieuwwaarde als de reparatiekosten hoger zijn dan 2/3 van de vastgestelde waarde van de auto.",
      "Het percentage hangt af van de maand na de afgiftedatum. Voor elke maand kan de chat de exacte percentages geven.",
    ],
    klantinfo: ["Is de auto nieuw gekocht bij een Nederlandse dealer en is de klant de eerste eigenaar?", "Hoeveel maanden geleden is de afgiftedatum?", "Staat Nieuwwaarde 2 jaar of 3 jaar op het polisblad?"],
    vervolgvragen: [
      { als: "Het is niet bekend of de auto nieuw bij een Nederlandse dealer is gekocht", vraag: "Heb je de auto nieuw bij een Nederlandse dealer gekocht?" },
      { als: "Het is niet bekend hoe lang geleden de afgiftedatum was", vraag: "Hoeveel maanden geleden is de auto voor het eerst op jouw naam gezet?" },
    ],
    gerelateerd: ["cb-waarde-aankoopwaarde"],
    controle: { status: "gecontroleerd", opmerking: "Percentages gecontroleerd tegen de tabel in Casco Beperkt 4.1 (identiek in Casco Allrisk 4.1). De zin 'elke maand een stukje lager' vereenvoudigt de tabel." },
  },

  // 10. Uitsluitingen (alcohol, geneesmiddelen en drugs)
  "uitsluiting-alcohol": {
    brontekstSoort: "bijna-letterlijk",
    uitleg: "Rijdt de bestuurder onder invloed van alcohol, drugs of medicijnen? Dan krijg je geen vergoeding voor de schade. Schade aan een ander betaalt a.s.r. vaak wel, maar a.s.r. kan dat daarna bij jou terugvragen.",
    direct: [
      "Grens bij een rijbewijs van meer dan 5 jaar: 0,5 promille (220 microgram in de adem) of hoger.",
      "Grens bij een rijbewijs korter dan 5 jaar, een rijexamen minder dan 2 maanden geleden (rijbewijs nog niet ontvangen) of rijden onder toezicht: 0,2 promille (88 microgram) of hoger.",
      "Ook geen vergoeding als de bestuurder een ademtest, urine- of bloedproef weigert.",
    ],
    aandachtspunten: [
      "Uitzondering: je krijgt wel een vergoeding als je kunt bewijzen dat je er niets van wist, dat het tegen je wil gebeurde en dat jou niets te verwijten valt.",
      "A.s.r. moet de schade aan de benadeelde vaak toch betalen en kan dat bedrag verhalen op jou of op de dader.",
      "Dezelfde uitsluiting geldt voor hulpverlening.",
      "Hetzelfde staat in de voorwaarden van WA, Casco beperkt en Casco allrisk.",
    ],
    klantinfo: ["Wie er reed en hoe lang die persoon een rijbewijs heeft.", "Wist de klant (de verzekeringnemer) dat de bestuurder had gedronken?"],
    vervolgvragen: [{ als: "De klant vraagt of een hoeveelheid alcohol mag en het is niet bekend hoe lang de bestuurder een rijbewijs heeft", vraag: "Hoe lang heeft de bestuurder zijn rijbewijs?" }],
    gerelateerd: ["uitsluiting-rijbewijs"],
    controle: { status: "gecontroleerd", opmerking: "Identieke tekst in WA 3.1, Casco Beperkt 3.1 en Casco Allrisk 3.1. De chat geeft geen advies over hoeveel alcohol veilig is." },
  },
};
