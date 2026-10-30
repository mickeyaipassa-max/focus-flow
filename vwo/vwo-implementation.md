# VWO A/B-test: "Kies je basisdekking" met AI-chat-tag (a.s.r. Autoverzekering, stap 2)

Hoort bij `vwo-variation.js` en `vwo-variation.css` in deze map. Alles hieronder is gecontroleerd op de echte a.s.r.-pagina en op de eigen codebase, behalve waar "niet getest" staat.

## 1. Technische analyse (wat er echt is)

**De a.s.r.-pagina** (stap 2 "Kies je dekking" van de Autoverzekering, "Ik kies zelf"):

- Het label boven de productkaarten is geen gewone tekst. De groep is `asr-radio-card-group[formcontrolname="baseCoverage"]`, een Lit-webcomponent met een **open Shadow DOM**. Het label is het attribuut `label` van die groep (nu "Kies je basisverzekering (WA/WA+/Allrisk)"), de component tekent het zelf in een `<legend>` binnen de shadow root, gevolgd door `span.label-required` (het sterretje) en een verborgen `asr-popover`.
- Gevolg 1: CSS van de pagina of van VWO bereikt de tag niet. Het script zet de tag-CSS daarom zelf in de shadow root (zie 4).
- Gevolg 2: het label wijzig je via het attribuut, niet via `textContent`. Het script wacht op `updateComplete` van de component, anders tekent Lit het oude label terug.
- De kaarten zijn gewone kinderen (light DOM): `asr-radio-card-control-bottom` met `value` (`Wa`, `WaCasco`, `WaCascoAllRisk`), titel in `[slot="title"]` en een knop "Meer informatie" (`asr-button[slot="action"]`).
- Het is een Angular-app: de URL blijft `/autoverzekering/afsluiten` tijdens alle stappen. Stap 2 verschijnt dus pas na stap 1, zonder paginalading. Daarom bewaakt het script de pagina met een `MutationObserver` in plaats van één keer te draaien.
- VWO staat al op de pagina (SmartCode, account 219513). `VWO.event` bestaat op het moment van meten nog niet; `VWO.push(['event', naam, eigenschappen])` wel. Het script gebruikt `VWO.event` als die bestaat en anders `VWO.push`. Op het moment van meten waren er geen actieve experimenten (`_vwo_exp` leeg). Controleer dat opnieuw vlak voor de start (zie 8).
- De CSP van asr.nl staat een https-iframe toe (`frame-src 'self' https:`), maar blokkeert `fetch` naar andere domeinen (`connect-src` bevat ditismick.com niet). Een directe aanroep van `/api/chat` vanaf de a.s.r.-pagina werkt dus niet.
- `dataLayer` bevat alleen OneTrust-events. Er is **geen winkelwagen en geen e-commercegebeurtenis** op deze stap. "Toevoegen aan winkelwagen" meten kan dus niet betrouwbaar; zie 5.

**Onze codebase:**

- De chat bestaat alleen op ditismick.com: `/workshop` met `ChatWidget` (`app/aichat/ChatWidget.tsx`) en `/api/chat` met de kennisbank (`lib/kennisbank`, de voorwaarden). De "Hulp nodig?"-tag en de vier keuzehulp-tags (`lib/chat/keuzehulp.ts`) horen daarbij. Op asr.nl bestaat niets daarvan.
- De chat is dus **niet bereikbaar vanuit VWO**: er is geen script of component op asr.nl om aan te roepen.

## 2. Oplossing en de enige extra integratie die nodig is

Het hergebruik zit in één kleine toevoeging aan onze eigen site, geen wijziging van bestaand gedrag:

| Onderdeel | Bestand | Wijziging |
|---|---|---|
| Chatvenster als losse pagina | `app/embed/keuzehulp/page.tsx` (nieuw) | Gebruikt dezelfde `ChatWidget`, dezelfde vier tags, dezelfde vaste antwoorden, dezelfde `/api/chat` met `keuzehulp: true` en de gekozen `dekking` |
| Vensterstand zonder zwevende positie | `app/aichat/ChatWidget.tsx` | Nieuwe optionele prop `embedded` (standaard uit). `/workshop` en `/aichat` zijn ongewijzigd |
| Tag, label, meting, iframe | `vwo/vwo-variation.js` en `.css` | Alles wat VWO uitvoert |

De chat draait in een **iframe** met onze eigen origin. De iframe doet zelf zijn aanroepen naar `/api/chat`; daardoor spelen de CSP en CORS van asr.nl geen rol en staat er **geen sleutel of geheim in de browser van de bezoeker of in het script**. De pagina en het iframe praten via `postMessage` (de dekking gaat de ene kant op, `ready` en berichtmeldingen de andere).

**Wat er nog moet gebeuren voordat de test live kan:**

1. Deze branch moet naar productie (PR, build, merge), zodat `https://ditismick.com/embed/keuzehulp` bestaat. Lokaal en op een lokale testpagina werkt het; op productie is het nog niet uitgerold. Zonder die route toont het script na 8 seconden de terugvalmelding (getest).
2. Aanrader (niet gedaan): beperk wie de chat mag insluiten met een `Content-Security-Policy: frame-ancestors https://www.asr.nl https://asr.nl` op `/embed/*` in de hostingconfiguratie. Dit project heeft nu geen headers-configuratie. Zonder dit kan elke site de chat insluiten. De pagina beantwoordt alleen berichten van `https://www.asr.nl` en `https://asr.nl` (en in ontwikkeling van de eigen origin).
3. Pas de productiehost aan als die niet ditismick.com is: het domein staat in `vwo-variation.js` (`CHAT_ORIGIN`) en is voor tests te overschrijven met `window.__ASR_KEUZEHULP_CONFIG__ = { chatOrigin: 'https://…' }`.

## 3. Wat er in de Variation gebeurt

Control (50%): niets verandert op de pagina.

Variation (50%):

1. Het label wordt "Kies je basisdekking" (attribuut `label`, na `updateComplete`).
2. Achter het label (na het sterretje) komt een tag "Hulp nodig?" met het AI-icoon, in dezelfde stijl als op `/workshop` (neutraal grijs, 32px hoog, volledig afgerond, 14px). Alleen dit ene label wordt aangeraakt (de groep `baseCoverage`).
3. Klik op de tag opent het chatpaneel rechtsonder (onder 600px bijna schermvullend met donkere achtergrond). De klik doet `preventDefault` en `stopPropagation`: er wordt geen kaart gekozen en geen link gevolgd.
4. De chat opent met de openingsvraag en de vier tags. De gekozen dekking gaat mee (`?dekking=` in de iframe-URL en als `context`-bericht). Kiest de bezoeker daarna een andere kaart, dan gaat de nieuwe dekking 0,4 seconde later mee.
5. Sluiten kan met het menu in de chat (Minimaliseer / Sluit), met Escape of door buiten het paneel te tikken (mobiel). De focus gaat terug naar de tag. Heropenen laat het lopende gesprek zien.

**Productcontext:** de tag staat boven alle kaarten en geeft de dekking van de op dat moment geselecteerde kaart mee. Op de a.s.r.-pagina staat "WA + Casco beperkt" standaard geselecteerd, ook zonder dat de bezoeker iets koos. De chat krijgt dit mee als "staat geselecteerd" en gaat er volgens de keuzehulp-regels niet van uit dat de bezoeker dit gekozen heeft (zie `docs/keuzehulp-controle.md`).

**Als de chat niet laadt:** bij een geblokkeerd iframe, een onbereikbaar chatdomein of 8 seconden zonder `ready` verschijnt een terugvalmelding met link "Open de chat in een nieuw venster" en een knop Sluiten. De rest van de pagina werkt gewoon door.

## 4. Plakken in VWO

1. Maak een A/B-test (Testing > A/B) op de pagina met pad `/autoverzekering/afsluiten`.
2. **URL-voorwaarde:** "URL bevat" met het pad `/autoverzekering/afsluiten`. Gebruik het pad, niet de volledige URL met domein (mailprogramma's als Outlook herschrijven volledige URL's in doorgestuurde snippets). Eventueel een voorwaarde op host `asr.nl`.
3. **Doelgroep:** alle bezoekers, of juist verkeer van desktop en mobiel samen (de code werkt op beide). Sluit eventueel bestaande, overlappende campagnes uit (zie 8).
4. **Variatie:** maak "Variation 1" met de editor voor eigen code.
   - **Custom CSS:** plak de volledige inhoud van `vwo-variation.css`. Alleen dit, geen aanpassingen.
   - **Custom JS:** plak de volledige inhoud van `vwo-variation.js`. `var MODE = 'variation';` blijft zoals het staat.
5. **Control meten (optioneel):** de kaart- en "Verder"-klikken meet het script ook in Control. Plak daarvoor dezelfde `vwo-variation.js` met `var MODE = 'control';` in de code van Control, **als jouw VWO-versie code in Control toelaat** (niet gecontroleerd; in sommige versies kan dat alleen via campagnebrede code). Anders: gebruik voor kaartklikken in beide varianten VWO's eigen klikdoelen op `asr-radio-card-control-bottom` en op de "Verder naar"-knop (de kaarten staan in de gewone DOM; alleen het label zit in de shadow root). Zet dan nooit beide scripts in dezelfde variant.
6. **Verdeling:** 50% Control, 50% Variation, in de verkeersinstellingen van VWO. Het script randomiseert niets. Eén bezoeker ziet altijd dezelfde variant (VWO bepaalt dat per bezoeker).

## 5. Metrics in VWO

Het script stuurt de gebeurtenissen met `VWO.event(naam, eigenschappen)` als die bestaat, anders `VWO.push(['event', naam, eigenschappen])`. Elke gebeurtenis bevat `variant` (`variation` of `control`). Maak in VWO per naam een doel van het type **Custom Conversion / Custom event** (de naamgeving in de interface verschilt per versie; niet gecontroleerd in jullie dashboard, dat kon ik niet inzien) met precies deze naam.

| Doel in VWO | Gebeurtenis | Wanneer | Eigenschappen | Variant |
|---|---|---|---|---|
| Klik op de tag | `asr_hulp_tag_click` | Elke klik op "Hulp nodig?" (dubbelklikken binnen 0,4 s telt één keer) | `dekking`, `kaart` | variation |
| Chat echt geopend | `asr_chat_opened` | Het iframe is geladen en heeft `ready` gemeld. Anders dan de tagklik: een klik zonder werkende chat telt hier niet mee. Eenmalig per paginaweergave | - | variation |
| Eerste bericht | `asr_chat_first_message` | Eerste klantbericht, via tag of getypt. Eenmalig | `via` (`tag` of `getypt`) | variation |
| Eerste getypte vraag | `asr_chat_first_question` | Eerste zelf getypte vraag (niet een tag). Eenmalig | - | variation |
| Klik op productkaart | `asr_card_click` | Klik op een van de drie kaarten (niet op "Meer informatie") | `kaart`, `dekking` | beide |
| Klik op Meer informatie | `asr_card_info_click` | Klik op "Meer informatie" in een kaart | `kaart`, `dekking` | beide |
| Door naar de volgende stap | `asr_funnel_next_click` | Klik op "Verder naar: Vul je gegevens in" | `kaart`, `dekking` | beide |
| Chat niet beschikbaar | `asr_chat_fallback` | Terugvalmelding getoond (timeout of CSP). Eenmalig | `reden` | variation |

**Aanbevolen hoofdmetric:** `asr_funnel_next_click` (doorstroom naar stap 3), omdat die in beide varianten bestaat en dus eerlijk vergelijkbaar is. De chatgebeurtenissen zijn secundair en bestaan alleen in Variation.

**Toevoegen aan winkelwagen:** niet gemeten. Op asr.nl bestaat op deze stap geen winkelwagen en geen e-commerce-event in `dataLayer` (alleen OneTrust), dus er is niets betrouwbaars om aan te koppelen. `asr_funnel_next_click` is de dichtstbijzijnde stap en is een **proxy**: het is een klik op de knop, geen bevestiging dat de volgende stap daadwerkelijk laadde. Als a.s.r. later een echt event of een bevestigingspagina publiceert, vervang dan de proxy door dat event.

**Geen dubbele events:** klikken worden op 0,4 seconde ontdubbeld, eenmalige gebeurtenissen (`opened`, `first_message`, `first_question`, `fallback`) gaan per paginaweergave één keer. Eén bezoeker kan per bezoek meerdere kaartklikken doen; dat zijn echte klikken. Als VWO de pagina bij stapwissels niet opnieuw laadt, blijft "eenmalig" gelden voor de hele sessie van die pagina.

**Privacy:** de eigenschappen bevatten alleen de gekozen dekking en kaarttitel, nooit kenteken, postcode, geboortedatum of chatinhoud.

## 6. Preview en controle

**Preview in VWO:** open voor Control en Variation afzonderlijk de Preview Mode in het VWO-dashboard en kies de variant. Control: label "Kies je basisverzekering (WA/WA+/Allrisk)", geen tag. Variation: label "Kies je basisdekking" met de tag. Je moet stap 1 doorlopen om stap 2 te zien.

**Console:** voeg `?asr_vwo_debug=1` toe aan de URL (of zet `window.__ASR_KEUZEHULP_CONFIG__ = { debug: true }` vóór het script) en je ziet elke gebeurtenis als `[asr-keuzehulp-vwo] event …`. In de console geeft `window.__asrKeuzehulpVwo` de toestand (open, ready, aantal herstelacties) en `window.__asrKeuzehulpVwo.destroy()` haalt tag, paneel en observer weg.

**Chat en kennisbank controleren** (in Variation):

1. Klik de tag: het paneel opent, de openingsvraag "Ik help je graag kiezen!" en vier tags staan er.
2. Klik "Vooral een lage premie": het antwoord over WA volgt direct, zonder wachttijd van het taalmodel (vast antwoord).
3. Typ een eigen vraag, bijvoorbeeld "Wat is eigen risico?". Het antwoord komt van `/api/chat`; onder het antwoord staan bronnen uit de kennisbank (voorwaarden). Dat bewijst dat de kennisbank gebruikt is.
4. Selecteer een andere kaart (bijvoorbeeld WA + Casco allrisk), sluit en open de chat opnieuw en vraag "Wat is er dan verzekerd?". Het antwoord hoort bij de gekozen dekking.
5. Netwerk: in het iframe zie je `POST /api/chat` naar ons domein; op de a.s.r.-pagina zelf zie je alleen het laden van het iframe en de VWO-aanroepen. Geen sleutels in de requests van de pagina.

## 7. Wat getest is (en wat niet)

Getest op een testpagina die de a.s.r.-structuur nabootst (open shadow root, Lit-achtig asynchroon label, dynamisch geladen kaarten), op de lokale chat (`/embed/keuzehulp`, echte `ChatWidget`) en gedeeltelijk op de echte a.s.r.-pagina (alleen in mijn eigen browsersessie, zonder iets te versturen of in te dienen):

| Test | Resultaat |
|---|---|
| Kaarten al aanwezig bij laden | Label "Kies je basisdekking", tag precies één keer, andere groepen onaangeraakt |
| Kaarten later geladen / stap 2 verwijderd en opnieuw opgebouwd (3x) | Tag steeds precies één keer, label correct |
| Script twee keer uitgevoerd | Geen tweede tag, stijl of paneel, geen dubbele handlers (events één keer) |
| Component tekent legenda opnieuw (volledige herrender) | Tag en label hersteld; begrensd op 20 herstelacties, geen lus |
| Tagklik (ook dubbelklik) | Eén `asr_hulp_tag_click`, paneel opent één keer, URL verandert niet, geen kaart gekozen |
| Chat opent met juiste context | iframe-URL `?dekking=wa-casco-beperkt` bij de standaardselectie |
| Chat-tag aangeklikt | `asr_chat_first_message` met `via: tag`, geen `first_question` |
| Eigen vraag getypt | `asr_chat_first_question` |
| Kaartklik, Meer informatie, Verder (dubbel geklikt) | Elk één event, juiste dekking |
| Control-modus | Label en legenda ongewijzigd, geen tag, geen paneel, geen iframe; alleen kaart- en Verder-events |
| `VWO.push`-pad (geen `VWO.event`) | Events in de VWO-wachtrij |
| Chat onbereikbaar | Na 8 s terugvalmelding, `asr_chat_fallback` (`timeout`), Escape sluit en focus gaat terug naar de tag |
| Mobiel | Op 480px (testpagina): paneel bijna schermvullend met donkere achtergrond. Op 375px (echte pagina): tag onder het label |
| Console | Geen fouten tijdens alle bovenstaande tests |
| Echte a.s.r.-pagina met de definitieve bestanden en de deploypreview van PR #215 als chatdomein (alleen in mijn sessie) | Label en tag correct, tagklik opent het paneel, `ready`-handshake slaagt, geen CSP-melding, geen fouten. Tag in de chat en een getypte vraag ("Wat is eigen risico?") geven `first_message` (`tag`) en `first_question`; het echte taalmodel antwoordde met bronnen uit de kennisbank |
| Echte a.s.r.-pagina (alleen in mijn sessie; een eerdere versie van het script, daarna de legenda-opmaak met de hand) | Label en tag correct, één tag, geen fouten. Breed genoeg: label, sterretje en tag op één regel en de legenda even hoog als met alleen het label. Op 375px (legendabreedte 267px) past de tag niet naast het label en staat links eronder |

**Niet getest:**

- De chat vanaf asr.nl met het echte productiedomein ditismick.com: de route staat pas na de merge op productie. Getest is dezelfde code met de deploypreview van PR #215 als chatdomein (zie hieronder).
- Dat de events daadwerkelijk in een VWO-doel binnenkomen. Dat vraagt een campagne in jullie account (niet aangemaakt) en zou echte data in het account schrijven.
- Preview Mode in VWO zelf, en het gedrag van VWO's anti-flicker. Het script past het label aan zodra de component klaar is met tekenen (`updateComplete`, microtaken). Naar verwachting gebeurt dat vóór de eerstvolgende weergave, maar dat is niet gemeten; kijk hier in Preview naar.
- Safari en Firefox. Alleen de Chromium-browser in deze omgeving.
- Echte VWO met consentmodus: VWO laadt pas na toestemming; zonder VWO-script doet het script niets.

## 8. Risico's, afhankelijkheden en terugdraaien

- **Afhankelijk van a.s.r.-interne namen:** `asr-radio-card-group[formcontrolname="baseCoverage"]`, de `legend`, `.label-required`, `asr-radio-card-control-bottom`, `asr-button`. Verandert a.s.r. die, dan doet het script niets (geen fouten, geen tag) en blijft de pagina zoals hij was. Zet een controle in de periodieke test van de campagne.
- **Overlap:** controleer vlak voor start in de console `Object.keys(window._vwo_exp)` op actieve experimenten op deze pagina, en of een bestaande test dezelfde groep of hetzelfde label wijzigt.
- **Legenda:** het script zet de legenda in een flex-rij (label, sterretje, tag; de tag breekt onder circa 315px af onder het label). Daardoor groeit de regel niet door de tag. Een andere a.s.r.-opmaak van de legenda kan dit verstoren.
- **Hoogteverschil met Control:** het nieuwe label is korter dan het oude ("Kies je basisverzekering (WA/WA+/Allrisk)"). Op smalle schermen kan Control daardoor een regel hoger zijn. Dat is bedoeld.
- **Opruimen:** zet de campagne op pauze of gebruik `window.__asrKeuzehulpVwo.destroy()` om tag, paneel en observer weg te halen. Het label wordt dan niet teruggezet; laad de pagina opnieuw.
- **Tijdelijke testbestanden** (`public/_vwotest`) zijn na de test verwijderd en horen niet in een commit.
