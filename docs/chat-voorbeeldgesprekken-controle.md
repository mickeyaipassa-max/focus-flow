# Voorbeeldgesprekken in de chat: wat is gedaan en gecontroleerd

Status: lokaal klaar, nog niet gepubliceerd. De vergelijking met het echte taalmodel (oud tegen nieuw) is nog niet gedraaid.

## Wat er is toegevoegd

- `lib/chat/voorbeeldgesprekken.ts`: de vijf gesprekken als gegevens, plus de functie die ze als tekstblok in de systeeminstructie zet.
- `lib/chat/systeem-instructie.ts`: de voorbeelden staan nu achteraan de systeeminstructie, in een eigen blok `<voorbeeldgesprekken>`. Het blok begint met uitleg dat het verzonnen oefengesprekken zijn.
- `scripts/test-voorbeeldgesprekken.mts`: controles zonder taalmodel.
- `scripts/vergelijk-voorbeelden.mts`: de vergelijking oud tegen nieuw met het echte taalmodel (14 gesprekken).

`app/api/chat/route.ts` is niet gewijzigd. De kennisbank (174 blokken), de bronverwijzingen en de lengtecontrole in de route zijn ongemoeid gelaten.

## Hoe de voorbeelden worden gescheiden van de echte kennis en het echte gesprek

| Wat | Waar | Hoe herkenbaar |
|---|---|---|
| Voorbeeldgesprekken | systeeminstructie (`system`), nooit in `messages` | `<voorbeeldgesprekken>`, `<voorbeeld>`, `<klant>`, `<jij>`, `<les>` |
| Kennisbankinformatie | in het laatste bericht van de klant | `<kennisbank>`, `<onderdeel>` |
| Het echte bericht van de klant | in het laatste bericht van de klant | `<klantbericht>` |
| Eerdere echte berichten | `messages` | gewone beurten |

Het blok zegt zelf: geen echte klanten, geen eerdere berichten, geen bron, bedragen zijn niet van de klant, kopieer geen zin of opening, kies zelf wat natuurlijk is. De route verwijst nergens naar de voorbeelden (gecontroleerd).

## Wat is aangepast aan jouw vijf voorbeelden, en waarom

Jouw opdracht (punt 6) vraagt om de voorbeelden eerst tegen de voorwaarden te controleren. Dit is gebeurd tegen de kennisbank. Elke bewering staat met het blok waar ze vandaan komt in `scripts/test-voorbeeldgesprekken.mts` (22 beweringen).

| Voorbeeld | Wat er stond | Wat nu | Reden en bron |
|---|---|---|---|
| 1. WA | Twee zinnen over WA | Ongewijzigd | Klopt met `sw-wa-wat-is`. |
| 2. Paaltje | "Heb je WA, WA+ of Allrisk?" | Die vraag is weg; de chat weet de dekking al | De chat krijgt de gekozen dekking mee en de instructie zegt: stel de vraag nooit als het antwoord al bekend is. |
| 2. Paaltje | "Met Allrisk is schade ... vaak verzekerd ... hangt af van de polisvoorwaarden" | Verzekerd, ook als je het zelf veroorzaakt; eigen risico gaat af; a.s.r. stelt het bedrag vast na de melding | Te vaag en niet precies: `sw-ca-eigen-schuld` noemt het paaltje letterlijk als voorbeeld, `ca-eigen-risico` en `cb-schade-vaststellen`. De onzekerheid over het bedrag blijft. |
| 3. Diefstal | "Doe zo snel mogelijk aangifte" | Nog vandaag, of de volgende ochtend als het 's nachts gebeurde | Je vroeg om ontbrekende termijnen aan te vullen. Bron: `cb-aangifte`. |
| 3. Diefstal | "Weet je welke dekking je hebt?" | Weg | Dekking is bekend. |
| 3. Diefstal | "Controleer ook welke aangifte- en meldtermijnen gelden. Die kan ik voor je opzoeken" | De termijn staat er direct, plus het nummer van het VbV (071 - 3641777, dag en nacht) | Een belofte om iets op te zoeken is leeg: de chat noemt de termijn zelf. Bron: `cb-aangifte`. |
| 3. Diefstal | "Doorgaans verzekerd. Er kunnen wel voorwaarden gelden" | Verzekerd, tenzij de auto niet op slot zat of de sleutels erin zaten | Noemt de voorwaarde in plaats van te verwijzen. Bron: `cb-diefstal`. |
| 4. Eigen risico | € 600 schade, € 150 eigen risico | € 800 schade, € 250 eigen risico, als "stel dat" en als voorbeeld aangeduid | € 250 is een echte keuze (`sw-eigen-risico`). De klant die vraagt "dus ik betaal altijd € 250?" krijgt te horen dat het alleen een rekenvoorbeeld was en dat zijn eigen bedrag op het polisblad staat. |
| 4. Eigen risico | "Dat hangt af van je verzekering en het soort schade" | Staat op je polisblad; geen eigen risico als je een ruit laat repareren | Noemt een echte uitzondering uit `cb-eigen-risico`. |
| 5. Autokeuze | "Dan kan WA+ interessant zijn" en "past mogelijk bij wat je zoekt" | Zegt wat in WA + Casco beperkt zit en wat niet; "bij 6 tot 10 jaar kiezen de meeste klanten deze dekking"; a.s.r. geeft geen persoonlijk advies; een onafhankelijk adviseur kan dat wel | Dit was persoonlijk advies. De instructie verbiedt dat en `sw-adviseur` zegt hetzelfde. Bron: `sw-adviseur`, `sw-cb-verzekerd`. |
| 5. Autokeuze | "Controleer ... de premie" | Weg | De kennisbank bevat geen premies. |

Niet overgenomen uit jouw voorbeelden: de naam "WA+" op zichzelf. De kennisbank gebruikt "WA + Casco beperkt" en "WA plus"; de voorbeelden gebruiken de eerste.

## Tegenstrijdigheden in de bestaande instructie

Gevonden en opgelost in deel 8 (de technische aanvulling). De tekst van de opdrachtgever in deel 1 tot en met 7 is niet aangepast.

| Eerder | Probleem | Nu |
|---|---|---|
| Vier voorbeelden van de stijl, waarvan drie met "Wil je weten ...?" als laatste zin | Leert af te sluiten met een vraag | Vervangen door de vijf nieuwe voorbeelden; vier van de elf antwoorden daarin sluiten met een vraag, de rest niet |
| "Antwoord eerst ... en stel daarna die ene vraag" | Dwingt een vraag af | "Stel daarna alleen een vraag als die echt nodig is. Sluit niet standaard af met een vraag" |
| "Je mag het aanbieden: 'Wil je ook weten hoe ...?'" | Nodigt uit tot een slotvraag | "Soms mag je kort aanbieden om meer uit te leggen, maar niet in elk antwoord" |
| "Laat rekenvoorbeelden weg tenzij de klant erom vraagt" | Botste met voorbeeld 4 (klant zegt het niet te snappen) | Ook als de klant zegt het niet te snappen; een voorbeeld begint met "Stel dat" en het bedrag is nooit van de klant |
| "Noem direct" noemde deadlines en veiligheidsstappen, maar niet wat de klant moet sturen | Bij sleutels viel "stuur het bewijs van de aangifte" weg | Aangevuld met wat de klant moet doen of sturen om recht op vergoeding te houden |
| Geen regel tegen retorische vragen | "Heb je een auto op jouw naam? Dan ..." telt als vraag maar is er geen | Regel: een vraag is een echte vraag; schrijf "Staat de auto op jouw naam, dan ..." |
| De stijlherinnering na elk bericht noemde alleen "hooguit één vraag" | Zwakker dan de wens "niet standaard met een vraag" | Aangevuld: alleen als die echt nodig is, begin anders dan je vorige antwoorden |
| Geen regel over begrip bij schade of diefstal | Alleen in een oud voorbeeld | Eigen regel: één korte, oprechte zin van begrip, daarna meteen wat de klant moet weten |
| Geen regel tegen vaste openers | Deel 6 noemt voorbeeldzinnen ("Ik kijk graag met je mee") die het model steeds kan herhalen | Regel: wissel af, vermijd "Goede vraag", "Ik help je graag", "Dat hangt af van verschillende factoren", en de zinnen in deel 6 zijn alleen toon |

Wat blijft staan, omdat het jouw tekst is: deel 1 zegt "gebruik geen standaardzinnen" en deel 6 noemt er juist enkele als voorbeeld. De nieuwe regel in deel 8 lost dat in de praktijk op, maar je kunt deel 6 zelf aanpassen als je dat wilt.

## Herhalen voorkomen

- De voorbeelden zeggen zelf dat de chat geen zin of opening moet kopiëren.
- Alle elf antwoorden in de voorbeelden beginnen anders (gecontroleerd).
- De vergelijking meet letterlijk overnemen uit de voorbeelden (8 woorden achter elkaar) en het aantal verschillende openingen.
- De gesprekken in de vergelijking lijken bewust op de voorbeelden (WA-uitleg, paaltje, diefstal, eigen risico, autokeuze), om herhaling te zien.

## Omvang

Schatting op 3,3 tekens per token (er is lokaal geen sleutel voor een exacte telling):

| | Tekens | Tokens (schatting) |
|---|---|---|
| Huidige instructie | 9.693 | circa 2.940 |
| Nieuwe instructie | 13.721 | circa 4.160 |
| Waarvan de vijf voorbeelden | 4.227 | circa 1.280 |

Dat is circa 1.220 tokens extra per vraag. Daar komen per vraag de kennisbankblokken en het gesprek bij, dus de totale invoer per vraag stijgt minder dan 42%. Wil je het goedkoper, dan kan voorbeeld 1 weg (het is het kortst en het meest vanzelfsprekend) of kunnen de `<les>`-regels vervallen. Prompt caching van de instructie is ook een optie; of dat bij deze lengte werkt hangt van het model af en is niet getest.

## Wat nog niet is gecontroleerd

- Het gedrag met het echte taalmodel. De vergelijking staat klaar (`scripts/vergelijk-voorbeelden.mts`) maar is niet gedraaid: lokaal is geen API-sleutel (die staat alleen in Netlify), en een test vraagt een bereikbare versie van de chat.
- "Natuurlijkheid" van de taal wordt deels gemeten (variatie in openingen, zinslengte, slotvragen) en moet deels worden gelezen. De vergelijking zet alle antwoorden naast elkaar.
