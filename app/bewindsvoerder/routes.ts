/**
 * Routes van het bewindvoerdersformulier. Staan in een eigen bestand zonder "use client", zodat ook
 * servercomponenten (zoals de hubpagina op /bewindsvoerder) de waarden kunnen gebruiken; uit een
 * "use client"-bestand krijgt een servercomponent alleen een verwijzing, geen waarde.
 */
export const ROUTES = {
  bewindvoerder: "/bewindsvoerder/bewindvoerder",
  bewindgegevens: "/bewindsvoerder/bewindgegevens",
  klant: "/bewindsvoerder/klant",
  samenvatting: "/bewindsvoerder/samenvatting",
  gelukt: "/bewindsvoerder/gelukt",
} as const;
