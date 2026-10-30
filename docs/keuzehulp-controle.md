# Keuzehulp op /workshop: wat is gebouwd en gecontroleerd

Status: lokaal klaar en getest. Het gedrag met het echte taalmodel (het vervolggesprek na een tag) is nog niet gedraaid: dat vraagt een gebouwde versie op Netlify.

## Wat er gebeurt

1. De bezoeker klikt bij "Kies je basisdekking" op de link (nu "Hulp nodig?"). De bestaande chat opent met:
   "Ik help je graag kiezen! 😊 / Wat vind je belangrijk bij je autoverzekering?" en vier tags: Vooral een lage premie, Ook mijn eigen auto verzekeren, Dat weet ik nog niet, Ik heb een andere vraag.
2. Een klik op een tag zet de gekozen tekst als klantbericht in het gesprek, laat 0,6 seconde het typ-bolletje zien en toont dan het vaste antwoord. Dat is geen aanroep van het taalmodel (gemeten: 0 aanroepen). De tags verdwijnen direct bij de klik. Snelle dubbele of driedubbele klikken geven één bericht en één antwoord. De cursor staat meteen in het invoerveld.
3. Typt de klant daarna, dan gaat het hele gesprek (tag, vast antwoord, nieuw bericht) naar het taalmodel, met de geselecteerde dekking en `keuzehulp: true`. Typt de klant meteen een vraag zonder tag, dan is dat één aanroep en verdwijnen de tags ook.

## Waar het zit

| Onderdeel | Bestand |
|---|---|
| Opening, tags, vaste antwoorden, zoektermen | `lib/chat/keuzehulp.ts` |
| Klik op een tag, dubbelklikbeveiliging, cursor, mobiele opmaak | `app/aichat/ChatWidget.tsx` (opt-in; `/aichat` ongewijzigd) |
| Vast antwoord zonder taalmodel, doorgeven van dekking en `keuzehulp` | `app/workshop/page.tsx` |
| Zoeken bij een kort vervolgantwoord, geen voorkeur voor de geselecteerde dekking | `app/api/chat/route.ts` |
| Keuzehulpregels voor het taalmodel | `lib/chat/systeem-instructie.ts` |
| Controles | `scripts/test-keuzehulp.mts` |

## Controle van de vaste antwoorden tegen de kennisbank

Alle vier de antwoorden en de opening staan letterlijk zoals opgegeven (test controleert dat).

| Tag | Bewering | Bron | Uitkomst |
|---|---|---|---|
| 1 | Met WA verzeker je schade die je met je auto bij anderen veroorzaakt | `sw-wa-wat-is` | Klopt |
| 1 | Diefstal en ruitschade zijn met WA niet verzekerd (daarom de vraag) | `sw-wa-verzekerd` | Klopt |
| 1 | "WA is vaak de voordeligste keuze" | Niet in de kennisbank (die noemt geen premies). Wel in de prijzen op de kaarten van de pagina: WA € 68,76, WA + Casco beperkt € 75,65, allrisk € 116,77 | Klopt volgens de kaarten; de test valt om als WA niet meer de goedkoopste kaart is |
| 2 | De keuzes heten WA + Casco beperkt en WA + Casco allrisk | `sw-dekking-aanpassen` | Klopt |
| 2 | Welke dekking past, hangt af van je auto | `sw-adviseur` (bij 6 tot 10 jaar kiezen klanten meestal WA + Casco beperkt) | Klopt |
| 2 | ... en van welke schades je zelf wilt betalen | `sw-cb-verzekerd` (klanten kiezen Casco beperkt als ze ruitbreuk, diefstal en brand niet zelf willen betalen) | Klopt |
| 3, 4 | Geen inhoudelijke beweringen | - | - |

Voor tag 1 geldt: de kennisbank bevat geen premievergelijking. De claim steunt op de prijzen die de bezoeker zelf op de kaarten ziet, met "vaak" als voorbehoud. Wil je de claim liever uit de kennisbank halen, dan kan dat met een kleine tekstwijziging.

## Hoe het gesprek na een tag verder gaat

- De chat krijgt de tag, het vaste antwoord en het nieuwe bericht als gesprek. Hij herhaalt de openingsvraag niet (regel in de instructie) en gebruikt wat de klant al zei.
- Een kort antwoord ("5 jaar", "ja") vond bij het zoeken eerst niets passends. De route voegt daarom de zoektermen van de gekozen tag toe. Getest op zes vervolgvoorbeelden; die vinden nu bijvoorbeeld `sw-adviseur` of `sw-vergelijken`.
- De geselecteerde dekking is context: "Op de pagina staat nu WA + Casco beperkt geselecteerd, maar de klant heeft nog niet gekozen". De regels zeggen dat de chat niet van die dekking uitgaat en geen advies geeft. Verandert de bezoeker de selectie, dan gaat de nieuwe dekking mee (gemeten).
- In de keuzehulp zoekt de route zonder voorkeur voor de geselecteerde dekking, en de bronnen onder een antwoord zijn die van alle dekkingen. Eerder werden bronnen beperkt tot de geselecteerde dekking, wat bij het vergelijken van dekkingen niet past.

## Keuzes en afwijkingen

- **Link:** de link op de pagina heet "Hulp nodig?" (zo staat hij in Figma), niet "Hulp nodig met kiezen?". Niet gewijzigd.
- **Tag 4:** het label is "Ik heb een andere vraag". De tag toont al een spraakballon, dus de 💬 uit de opdracht staat niet nog eens in de tekst.
- **Vormgeving:** de tags zijn de bestaande witte pillen met spraakballon. Onder 600px zijn ze 44px hoog (goed aantikbaar) en mag de tekst op een tweede regel doorlopen; op 320px past de langste tag zo nog binnen het venster. Vanaf 600px zijn ze 32px zoals in Figma.
- **Opnieuw openen:** staat er al een gesprek (geminimaliseerd), dan opent de link dat gesprek, zonder tags. Alleen een leeg gesprek toont de vier tags.
- **Oude onderwerpen:** de zes oude tags zijn vervangen. Het vaste kaartantwoord op getypte tekst als "Meer over WA" bestaat nog, maar wordt niet meer via een tag bereikt.

## Nog niet gedaan

- Het vervolggesprek met het echte taalmodel na elke tag. Daarvoor is een gebouwde versie nodig (lokaal is geen API-sleutel).
