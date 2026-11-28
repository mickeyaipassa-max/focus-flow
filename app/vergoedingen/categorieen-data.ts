/** Een link is alleen tekst (bestemming nog onbekend) of tekst met bestemming. */
export type Link = string | { tekst: string; href: string };
export type Kolom = { kop: string; links: Link[] };
export type Categorie = { label: string; pictogram: string; kolommen: Kolom[] };

/**
 * Inhoud van de opgeklapte categorieën, overgenomen van de live pagina asr.nl/zorgverzekering/vergoedingen
 * (november 2026). Figma tekent alleen de dichte staat; de bestemmingen van de links zijn op de live pagina niet
 * uit te lezen, dus de meeste links navigeren nog nergens heen (alleen "Oefentherapie bij knie- en heupartrose" wijst naar de gebouwde pagina). Alleen "Laboratoriumonderzoek" is rechtgezet
 * (live: "Labaratoriumonderzoek").
 */
export const CATEGORIEEN: Categorie[] = [
  {
    label: "Alternatieve zorg",
    pictogram: "alternatieve-zorg",
    kolommen: [{ kop: "Alternatieve zorg", links: ["Alternatieve geneesmiddelen", "Alternatieve geneeswijzen"] }],
  },
  {
    label: "Anticonceptie",
    pictogram: "anticonceptie",
    kolommen: [{ kop: "Anticonceptie", links: ["Anticonceptie tot 21 jaar", "Anticonceptie vanaf 21 jaar"] }],
  },
  {
    label: "Buitenland",
    pictogram: "buitenland",
    kolommen: [
      {
        kop: "Gepland",
        links: ["Niet-spoedeisende zorg in het buitenland", "Medisch noodzakelijke medicijnen in het buitenland", "Reizigersvaccinatie"],
      },
      {
        kop: "Niet gepland (spoedeisend)",
        links: ["Spoedeisende zorg in het buitenland", "Begrafenis of crematie in het buitenland", "Repatriëring"],
      },
    ],
  },
  {
    label: "Fysiotherapie",
    pictogram: "fysiotherapie",
    kolommen: [
      {
        kop: "Algemene fysiotherapie",
        links: [
          "Fysio- en oefentherapie tot 18 jaar",
          "Fysio- en oefentherapie tot 18 jaar bij een chronische aandoening",
          "Fysio- en oefentherapie vanaf 18 jaar",
          "Fysio- en oefentherapie vanaf 18 jaar bij een chronische aandoening",
          "Online fysiotherapie via de Zorg voor jezelf app",
        ],
      },
      {
        kop: "Specifieke fysiotherapie",
        links: [
          "Bekkenfysiotherapie bij urine-incontinentie",
          "Ergotherapie",
          "Fysio- en oefentherapie bij COPD stadium II of hoger",
          "Fysio- en oefentherapie bij etalagebenen",
          { tekst: "Oefentherapie bij knie- en heupartrose", href: "/vergoedingen/oefentherapie-knie-en-heupartrose" },
          "Valpreventieve beweeginterventie voor ouderen",
        ],
      },
    ],
  },
  {
    label: "GGZ",
    pictogram: "ggz",
    kolommen: [
      {
        kop: "GGZ",
        links: [
          "Geestelijke Gezondheidszorg (GGZ)",
          "Behandeling bij ADHD",
          "Begeleiding en nazorg bij kanker",
          "Eerstelijns psychologische hulp bij werk- of relatieproblemen",
          "Mindfulness en Acceptance and Commitment Therapy (ACT)",
          "Orthopedagogie",
          "Transgenderzorg",
        ],
      },
    ],
  },
  {
    label: "Horen en spreken",
    pictogram: "horen-en-spreken",
    kolommen: [
      {
        kop: "Horen",
        links: [
          "Audiologische zorg",
          "BAHA met softband",
          "Gehoorbescherming",
          "Hoortoestel",
          "Ringleiding",
          "Solo-apparatuur",
          "Tekst- en beeldtelefoons",
          "Tinnitusmaskeerders",
          "Wek- en waarschuwingsapparatuur",
        ],
      },
      {
        kop: "Spreken",
        links: ["Hulpmiddelen voor communicatie en informatie", "Logopedie", "Spraakvervangende hulpmiddelen", "Stottertherapie"],
      },
    ],
  },
  {
    label: "Huid",
    pictogram: "huid",
    kolommen: [
      {
        kop: "Huid",
        links: ["Acnebehandeling", "Camouflage", "Eczeembehandeling door lichtcabine", "Epilatie of laserbehandeling voor ontharing", "Symptoomchecker"],
      },
    ],
  },
  {
    label: "Huisarts",
    pictogram: "huisarts",
    kolommen: [{ kop: "Huisarts", links: ["Huisarts", "Ketenzorg", "Laboratoriumonderzoek via huisarts", "Soa test"] }],
  },
  {
    label: "Hulpmiddelen",
    pictogram: "hulpmiddelen",
    kolommen: [
      {
        kop: "Ademhaling",
        links: [
          "Apparatuur voor positieve uitademingsdruk",
          "CPAP-apparatuur",
          "MRA (snurkbeugel)",
          "Slaap Positie Trainer (SPT)",
          "Slijmuitzuigapparatuur",
          "Tracheacanule",
          "Vernevelaar en voorzetkamer",
          "Zuurstof",
        ],
      },
      {
        kop: "Incontinentie en stoma",
        links: [
          "Blaasspoelvloeistoffen",
          "Incontinentie-absorptiemateriaal",
          "Katheters",
          "Opvangzakken voor urine of feces",
          "Plaswekker",
          "Spoelzakken voor het spoelen van de darm",
          "Stomabeschermers voor gelaryngectomeerden",
          "Voorzieningen voor stomapatiënten",
        ],
      },
      {
        kop: "Overige hulpmiddelen",
        links: [
          "Aangepaste tafels en stoelen",
          "ADL-hulpmiddelen (voor wijkverpleging)",
          "AED-pads voor defibrillator",
          "Alarmeringsapparatuur",
          "Allergeenvrije hoezen",
          "Antidecubituskussen, luchtring of windring",
          "Apparatuur voor omgevingsbediening",
          "Compressie BH",
          "Diabeteshulpmiddelen",
          "(Dynamische) lig-, sta- en zithulpmiddelen",
          "Haarwerken (pruiken)",
          "Hulphonden",
          "Hulpmiddelen voor verzorging en verpleging op bed",
          "Infuuspomp",
          "Injectiespuiten en -pennen",
          "Loopwagens, loopfietsen en Parkinson-rollators",
          "(Mamma)borstprothese",
          "Orthesen (braces) voor ondersteuning, ontlasting of correctie",
          "Prothesen",
          "Rolstoelen en drempelhulpen",
          "Schedelbeschermingskap",
          "TENS",
          "Toiletverhogers, douche- en toiletstoelen",
          "Transferhulpmiddelen",
          "Trippelstoel",
          "Verbandmiddelen",
          "Voedingspomp en voedingssonde",
          "Zelfmeetapparatuur voor bloedstollingstijden met toebehoren",
        ],
      },
    ],
  },
  {
    label: "Leefstijl en preventie",
    pictogram: "leefstijl-en-preventie",
    kolommen: [
      {
        kop: "Leefstijl",
        links: [
          "Beweegprogramma's",
          "Diëtetiek",
          "Diëtist via de Zorg voor jezelf app",
          "Gecombineerde Leefstijl Interventie (GLI)",
          "Gewichtsconsulent",
          "Ketenzorg voor kinderen met overgewicht of obesitas",
          "Leefstijlprogramma via de Zorg voor jezelf app",
          "Lidmaatschap wandelbond (KWbN)",
          "Obesitasbehandeling",
          "Overgangsconsulent",
          "Slaapcoaching",
          "Stoppen met roken",
          "Zorg voor haar via de Zorg voor jezelf app",
        ],
      },
      {
        kop: "Ondersteuning",
        links: ["Budgetcoach", "Cursus patiëntenvereniging", "Lidmaatschap patiëntenvereniging", "Mental coach via de Zorg voor jezelf app"],
      },
      {
        kop: "Preventie",
        links: [
          "a.s.r. Vitality gezondheidscheck (fysiek)",
          "Bevolkingsonderzoek",
          "Cholesterolonderzoek",
          "Griepprik",
          "Hart- en bloedvatenonderzoek",
          "Persoonlijke Gezondheidscheck",
          "Preventieve cursussen",
          "Sportarts",
          "Vaccinaties",
        ],
      },
    ],
  },
  {
    label: "Medicijnen",
    pictogram: "medicijnen",
    kolommen: [
      { kop: "Medicijnen", links: ["Dieetpreparaten", "Geneesmiddelen", "Medische babyvoeding", "Middelen bij ADHD", "Zelfzorg geneesmiddelen"] },
    ],
  },
  {
    label: "Mondzorg",
    pictogram: "mondzorg",
    kolommen: [
      {
        kop: "Mondzorg",
        links: [
          "Tandarts en mondhygiënist tot 18 jaar",
          "Tandarts en mondhygiënist vanaf 18 jaar",
          "Kaakchirurgie",
          "Kaakgewrichtsbehandelingen",
          "Bijzondere tandheelkunde",
          "Tandartskosten na een ongeval",
        ],
      },
      { kop: "Kunstgebit en implantaat", links: ["Implantaten gebit", "Kunstgebit", "Uitgestelde fronttandvervanging"] },
      { kop: "Orthodontie", links: ["Orthodontie tot 18 jaar", "Orthodontie vanaf 18 jaar"] },
    ],
  },
  {
    label: "Ogen",
    pictogram: "ogen",
    kolommen: [
      { kop: "Ogen", links: ["Brillen en lenzen tot 18 jaar", "Brillen en lenzen vanaf 18 jaar", "Bijzondere optische hulpmiddelen"] },
      {
        kop: "Behandeling",
        links: ["Oogdruppels", "Ooglaserbehandeling en lensimplantatie", "Orthoptie", "Staaroperatie (poliklinische hulp)"],
      },
      {
        kop: "Hulpmiddelen bij zien",
        links: [
          "Beeldschermloepen",
          "Blindengeleidehond",
          "Blindentaststokken",
          "Computersoftware voor grootlettersystemen",
          "In- en uitvoerapparatuur voor computers",
          "Oogprothese",
          "Opname- en voorleesapparatuur",
          "Spraaksoftware voor mobiele telefoons",
          "Tactiele leesapparaten",
        ],
      },
    ],
  },
  {
    label: "Verpleging en verzorging",
    pictogram: "verpleging-en-verzorging",
    kolommen: [
      {
        kop: "Verpleging en verzorging",
        links: [
          "Verpleging en verzorging thuis (wijkverpleging)",
          "Zintuiglijk gehandicaptenzorg",
          "Kortdurend verblijf (eerstelijnsverblijf)",
          "Herstellingsoord",
          "Terminale zorg",
          "Kuurreizen",
          "Therapeutische kampen",
        ],
      },
      {
        kop: "Mantelzorg en overig",
        links: [
          "Extra kinderopvang bij opname ouders",
          "Gezinshulp bij uitval partner",
          "Huishoudelijke hulp na een ongeval",
          "Mantelzorgcoach",
          "Mantelzorg cursus",
          "Mantelzorgmakelaar",
          "Vervangende mantelzorg",
        ],
      },
    ],
  },
  {
    label: "Vervoer",
    pictogram: "vervoer",
    kolommen: [
      { kop: "Vervoer", links: ["Reiskosten ziekenbezoek aan verzekerde", "Vervoer per ambulance", "Ziekenvervoer"] },
      { kop: "Overnachting", links: ["Logeerhuis bij ziekenhuisopname", "Overnachting in plaats van vervoer"] },
    ],
  },
  {
    label: "Voeten",
    pictogram: "voeten",
    kolommen: [
      { kop: "Voetzorg", links: ["Pedicure", "Podotherapie"] },
      {
        kop: "Hulpmiddelen voor voeten",
        links: ["Allergeenvrije schoenen", "Elastische kousen en compressietherapie", "Orthopedische schoenen", "Steunzolen", "Verbandschoenen"],
      },
    ],
  },
  {
    label: "Ziekenhuis",
    pictogram: "ziekenhuis",
    kolommen: [
      { kop: "Opname en revalidatie", links: ["Ziekenhuisopname", "Geriatrische revalidatiezorg", "Medisch specialistische revalidatie"] },
      { kop: "Onderzoek", links: ["ECG", "Erfelijkheidsonderzoek en -advisering", "MRI-scan", "Röntgenonderzoek", "Second opinion"] },
      {
        kop: "Behandeling",
        links: [
          "Ziekenhuiszorg (poliklinische hulp)",
          "Abortus",
          "Dialyse",
          "Geneeskundige zorg voor specifieke patiëntgroepen (GZSP)",
          "Mechanische beademing",
          "Oncologische aandoeningen bij kinderen",
          "Buikwandcorrectie",
          "Orgaantransplantatie",
          "Plastische chirurgie",
          "Refertilisatie",
          "Sterilisatie",
          "Trombosedienst",
          "Zorg bij complex chronische longaandoeningen",
        ],
      },
    ],
  },
  {
    label: "Zwanger en geboorte",
    pictogram: "zwanger-en-geboorte",
    kolommen: [
      {
        kop: "Zwanger en bevallen",
        links: [
          "Verloskundige zorg voor en tijdens zwangerschap",
          "Prenatale screening",
          "Zwangerschapscursus",
          "Bevalling: thuis of in het ziekenhuis",
          "GeboorteTENS",
        ],
      },
      {
        kop: "Kraamzorg",
        links: [
          "Kraampakket",
          "Kraamzorg in het ziekenhuis",
          "Kraamzorg thuis of in een kraamhotel",
          "Couveuse nazorg",
          "Aanvullende kraamzorg",
          "Kraamzorg bij adoptie",
          "Borstkolf",
          "Lactatiekundige hulp",
          "Neonatale screening en consultatiebureau",
        ],
      },
      { kop: "Vruchtbaarheid", links: ["Invriezen en bewaren van eicellen of sperma", "Vruchtbaarheidsbehandelingen"] },
    ],
  },
];
