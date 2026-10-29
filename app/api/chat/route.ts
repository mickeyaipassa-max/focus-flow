import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { ChatSource } from "@/lib/chatPdf";
import { zoekContext, type KennisContext } from "@/lib/kennisbank/zoek";
import type { Product } from "@/lib/kennisbank";
import { bronVanAntwoord } from "@/lib/chat/bron";
import { GEEN_BRON, STIJLHERINNERING, systeemInstructie } from "@/lib/chat/systeem-instructie";

/**
 * Taalmodel achter de chat op /workshop. De klant stelt een vraag, de kennisbank (lib/kennisbank) levert de
 * best passende onderdelen en Claude beantwoordt de vraag daaruit volgens de systeeminstructie (lib/chat). Zonder
 * ANTHROPIC_API_KEY, bij een fout of bij een weigering geeft de route een foutcode terug; de pagina valt dan terug op
 * het trefwoordenantwoord uit de kennisbank.
 *
 * Instellingen (Netlify > Environment variables):
 * - ANTHROPIC_API_KEY (verplicht): zonder sleutel gebruikt de chat de terugval.
 * - ANTHROPIC_MODEL (optioneel): standaard claude-opus-5-5. Een kleiner model (bv. claude-sonnet-5-5 of
 *   claude-haiku-5-5) antwoordt sneller en goedkoper.
 */
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
/** Het model denkt altijd (Opus 5.5); de denktokens tellen mee, dus ruim genoeg voor een kort antwoord. */
const MAX_TOKENS = 4000;

const MAX_BERICHTEN = 20;
const MAX_TEKENS = 1000;
/** Hoeveel kennisbankonderdelen maximaal meegaan; minder tekst geeft kortere, gerichtere antwoorden. */
const AANTAL_ONDERDELEN = 3;
/** Een vervolgvraag korter dan dit aantal woorden ("en bij allrisk?") zoekt ook op de vraag ervoor. */
const KORTE_VRAAG_WOORDEN = 7;

/** Welke voorwaarden en pagina's bij welke basisdekking horen; hetzelfde als op /workshop. */
const PRODUCTEN_PER_DEKKING: Record<string, Product[]> = {
  wa: ["site-wa", "wa"],
  "wa-casco-beperkt": ["site-wa", "wa", "site-casco-beperkt", "casco-beperkt"],
  "wa-casco-allrisk": ["site-wa", "wa", "site-casco-allrisk", "casco-allrisk"],
};

/** Eenvoudige rem tegen misbruik (kosten): per IP maximaal 20 vragen per 10 minuten. Per serverinstantie, dus een vangnet en geen garantie. */
const VENSTER_MS = 10 * 60 * 1000;
const MAX_PER_VENSTER = 20;
const verzoeken = new Map<string, number[]>();

function teVeelVerzoeken(ip: string): boolean {
  const nu = Date.now();
  const recent = (verzoeken.get(ip) ?? []).filter((tijd) => nu - tijd < VENSTER_MS);
  recent.push(nu);
  verzoeken.set(ip, recent);
  if (verzoeken.size > 5000) for (const [sleutel, tijden] of verzoeken) if (tijden.every((tijd) => nu - tijd >= VENSTER_MS)) verzoeken.delete(sleutel);
  return recent.length > MAX_PER_VENSTER;
}

type Bericht = { role: "user" | "assistant"; text: string };

function leesBerichten(body: unknown): Bericht[] | null {
  const berichten = (body as { berichten?: unknown })?.berichten;
  if (!Array.isArray(berichten) || berichten.length === 0 || berichten.length > MAX_BERICHTEN) return null;
  const resultaat: Bericht[] = [];
  for (const bericht of berichten) {
    const { role, text } = (bericht ?? {}) as { role?: unknown; text?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof text !== "string") return null;
    const schoon = text.trim().slice(0, MAX_TEKENS);
    if (schoon) resultaat.push({ role, text: schoon });
  }
  // Een gesprek begint bij de klant en eindigt met een vraag van de klant.
  while (resultaat.length > 0 && resultaat[0].role !== "user") resultaat.shift();
  return resultaat.length > 0 && resultaat[resultaat.length - 1].role === "user" ? resultaat : null;
}

const lijst = (regels: string[]) => regels.map((regel) => `- ${regel}`).join("\n");

/**
 * Eén onderdeel voor het model. Heeft het een klantvriendelijke laag, dan krijgt het model die als bouwsteen voor het
 * antwoord en de brontekst alleen ter controle; zonder die laag is de brontekst de enige bron.
 */
function onderdeelTekst({ verrijking, tekst }: KennisContext): string {
  if (!verrijking) return tekst;
  const soort = verrijking.brontekstSoort === "samenvatting" ? "een samenvatting, geen letterlijke voorwaardentekst" : "volgt de voorwaarden";
  return [
    `Uitleg: ${verrijking.uitleg}`,
    verrijking.direct.length > 0 ? `Noem direct (deadlines en veiligheidsstappen):\n${lijst(verrijking.direct)}` : "",
    verrijking.aandachtspunten.length > 0 ? `Let ook op (noem alleen wat voor deze klant telt):\n${lijst(verrijking.aandachtspunten)}` : "",
    verrijking.klantinfo.length > 0 ? `Dit moet je van de klant weten voor een juist antwoord:\n${lijst(verrijking.klantinfo)}` : "",
    verrijking.vervolgvragen.length > 0 ? `Logische vervolgvraag (hooguit één, alleen als die informatie nog ontbreekt):\n${lijst(verrijking.vervolgvragen.map(({ als, vraag }) => `Als ${als.charAt(0).toLowerCase()}${als.slice(1)}: "${vraag}"`))}` : "",
    `Brontekst, alleen om je antwoord te controleren (${soort}); neem er niets letterlijk uit over:\n${tekst}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function kennisbankBlok(context: KennisContext[]): string {
  if (context.length === 0) return "<kennisbank>\nEr is geen passend onderdeel gevonden.\n</kennisbank>";
  const onderdelen = context.map(
    (onderdeel, index) =>
      `<onderdeel nummer="${index + 1}" bij-gekozen-dekking="${onderdeel.bijGekozenDekking ? "ja" : "nee"}"${onderdeel.aanvullend ? ' aanvullend="ja"' : ""} herkomst="${onderdeel.herkomst.replace(/"/g, "'")}">\n${onderdeelTekst(onderdeel)}\n</onderdeel>`,
  );
  return `<kennisbank>\n${onderdelen.join("\n")}\n</kennisbank>`;
}

const aantalWoorden = (tekst: string) => tekst.split(/\s+/).filter(Boolean).length;
/** Zinnen tellen zonder "a.s.r." als zinseinde. */
const zinnenVan = (tekst: string) => tekst.replace(/a\.s\.r\./gi, "asr").split(/(?<=[.!?])\s+/).filter((zin) => /\w/.test(zin));
const aantalZinnen = (tekst: string) => zinnenVan(tekst).length;
const langsteZin = (tekst: string) => Math.max(0, ...zinnenVan(tekst).map(aantalWoorden));
const aantalVragen = (tekst: string) => (tekst.match(/\?/g) ?? []).length;
/** Een antwoord langer dan dit wordt één keer laten inkorten. */
const MAX_WOORDEN = 70;
const MAX_ZINNEN = 4;
/** Ook een antwoord met meer dan één vraag, of met één zin langer dan dit aantal woorden, wordt laten inkorten. */
const MAX_ZINLENGTE = 25;
/** Hoeveel van de lengte- en vraagregels een antwoord overtreedt; een herschreven antwoord moet minder overtreden of korter zijn. */
const overtredingen = (tekst: string) => Number(aantalWoorden(tekst) > MAX_WOORDEN) + Number(aantalZinnen(tekst) > MAX_ZINNEN) + Number(langsteZin(tekst) > MAX_ZINLENGTE) + Number(aantalVragen(tekst) > 1);
const INKORT_OPDRACHT = "Dat is te lang of bevat te veel vragen. Schrijf je antwoord opnieuw: maximaal 4 korte zinnen en ongeveer 50 woorden, elke zin maximaal 20 woorden, en hooguit één vraag. Laat elk bedrag, elke deadline en elke uitzondering staan die voor de klant telt, en voeg niets nieuws toe.";

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ fout: "niet-geconfigureerd" }, { status: 503 });

  const ip = request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "onbekend";
  if (teVeelVerzoeken(ip)) return NextResponse.json({ fout: "te-veel-verzoeken" }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ fout: "ongeldig-verzoek" }, { status: 400 });
  }
  const berichten = leesBerichten(body);
  if (!berichten) return NextResponse.json({ fout: "ongeldig-verzoek" }, { status: 400 });
  const dekking = typeof (body as { dekking?: unknown }).dekking === "string" ? (body as { dekking: string }).dekking : undefined;

  // Zoek op de laatste vraag. Is die heel kort ("en bij allrisk?"), zoek dan ook op de vraag ervoor.
  const vragen = berichten.filter((bericht) => bericht.role === "user");
  const laatsteVraag = vragen[vragen.length - 1].text;
  const vorigeVraag = vragen.length > 1 ? vragen[vragen.length - 2].text : "";
  const opties = { producten: dekking ? PRODUCTEN_PER_DEKKING[dekking] : undefined };
  let context = zoekContext(laatsteVraag.split(/\s+/).length < KORTE_VRAAG_WOORDEN && vorigeVraag ? `${vorigeVraag} ${laatsteVraag}` : laatsteVraag, opties, AANTAL_ONDERDELEN);
  // Vindt de laatste vraag niets ("Wat kan ik dan doen?"), zoek dan op het onderwerp van de vraag ervoor.
  if (context.length === 0 && vorigeVraag) context = zoekContext(`${vorigeVraag} ${laatsteVraag}`, opties, AANTAL_ONDERDELEN);

  const laatste = berichten[berichten.length - 1];
  const messages: Anthropic.MessageParam[] = [
    ...berichten.slice(0, -1).map((bericht): Anthropic.MessageParam => ({ role: bericht.role, content: bericht.text })),
    { role: "user", content: `${kennisbankBlok(context)}\n\nVraag van de klant:\n<klantbericht>\n${laatste.text}\n</klantbericht>\n\n${STIJLHERINNERING}` },
  ];

  const gestart = Date.now();
  try {
    const client = new Anthropic({ maxRetries: 1, timeout: 25_000 });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systeemInstructie(dekking),
      messages,
      output_config: { effort: "low" },
    });

    if (response.stop_reason === "refusal") return NextResponse.json({ fout: "geweigerd" }, { status: 502 });

    const tekstVan = (antwoord: Anthropic.Message) => antwoord.content.flatMap((blok) => (blok.type === "text" ? [blok.text] : [])).join("\n").trim();
    let ruw = tekstVan(response);
    // Te lang (meer dan 4 zinnen of 70 woorden, een zin van meer dan 25 woorden) of meer dan één vraag? Dan één keer laten inkorten, als er nog tijd is.
    if ((aantalWoorden(ruw) > MAX_WOORDEN || aantalZinnen(ruw) > MAX_ZINNEN || langsteZin(ruw) > MAX_ZINLENGTE || aantalVragen(ruw) > 1) && Date.now() - gestart < 15_000) {
      const korter = await client.messages.create({ model: MODEL, max_tokens: MAX_TOKENS, system: systeemInstructie(dekking), messages: [...messages, { role: "assistant", content: ruw }, { role: "user", content: INKORT_OPDRACHT }], output_config: { effort: "low" } });
      const kortAntwoord = tekstVan(korter);
      if (korter.stop_reason !== "refusal" && kortAntwoord && (overtredingen(kortAntwoord) < overtredingen(ruw) || (overtredingen(kortAntwoord) === overtredingen(ruw) && aantalWoorden(kortAntwoord) < aantalWoorden(ruw)))) ruw = kortAntwoord;
    }
    const zonderBron = ruw.includes(GEEN_BRON);
    const tekst = ruw.replaceAll(GEEN_BRON, "").trim();
    if (!tekst) return NextResponse.json({ fout: "leeg-antwoord" }, { status: 502 });

    // De bron is die van het best passende onderdeel; bij een antwoord zonder kennisbank (begroeting, vervolgvraag) geen bron.
    return NextResponse.json({ tekst, bronnen: zonderBron ? [] : bronVanAntwoord(tekst, context) });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return NextResponse.json({ fout: "te-druk" }, { status: 429 });
    if (error instanceof Anthropic.APIError) {
      console.error(`[api/chat] Anthropic-fout ${error.status}: ${error.message}`);
      return NextResponse.json({ fout: "model-fout" }, { status: 502 });
    }
    console.error("[api/chat] onverwachte fout", error instanceof Error ? error.message : error);
    return NextResponse.json({ fout: "onverwacht" }, { status: 500 });
  }
}
