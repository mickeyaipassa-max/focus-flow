import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { zoekContext, type KennisContext } from "@/lib/kennisbank/zoek";
import type { Product } from "@/lib/kennisbank";
import { GEEN_BRON, systeemInstructie } from "@/lib/chat/systeem-instructie";

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
const AANTAL_ONDERDELEN = 5;

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

function kennisbankBlok(context: KennisContext[]): string {
  if (context.length === 0) return "<kennisbank>\nEr is geen passend onderdeel gevonden.\n</kennisbank>";
  const onderdelen = context.map((onderdeel, index) => `<onderdeel nummer="${index + 1}" bij-gekozen-dekking="${onderdeel.bijGekozenDekking ? "ja" : "nee"}" herkomst="${onderdeel.herkomst.replace(/"/g, "'")}">\n${onderdeel.tekst}\n</onderdeel>`);
  return `<kennisbank>\n${onderdelen.join("\n")}\n</kennisbank>`;
}

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

  // Zoek op de laatste vraag en de vraag daarvoor, zodat een korte vervolgvraag ("en bij allrisk?") toch iets vindt.
  const vragen = berichten.filter((bericht) => bericht.role === "user").slice(-2);
  const context = zoekContext(vragen.map((vraag) => vraag.text).join(" "), { producten: dekking ? PRODUCTEN_PER_DEKKING[dekking] : undefined }, AANTAL_ONDERDELEN);

  const laatste = berichten[berichten.length - 1];
  const messages: Anthropic.MessageParam[] = [
    ...berichten.slice(0, -1).map((bericht): Anthropic.MessageParam => ({ role: bericht.role, content: bericht.text })),
    { role: "user", content: `${kennisbankBlok(context)}\n\nVraag van de klant:\n<klantbericht>\n${laatste.text}\n</klantbericht>` },
  ];

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

    const ruw = response.content.flatMap((blok) => (blok.type === "text" ? [blok.text] : [])).join("\n").trim();
    const zonderBron = ruw.includes(GEEN_BRON);
    const tekst = ruw.replace(GEEN_BRON, "").trim();
    if (!tekst) return NextResponse.json({ fout: "leeg-antwoord" }, { status: 502 });

    // De bron is die van het best passende onderdeel; bij een antwoord zonder kennisbank (begroeting, vervolgvraag) geen bron.
    const bronnen = zonderBron || context.length === 0 ? [] : context[0].bronnen;
    return NextResponse.json({ tekst, bronnen });
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
