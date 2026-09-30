import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * Server-side proxy naar MailerLite voor het RSmarketing-campagnedashboard
 * (/RSmarketing). Twee vaste campagnes van 23 sep 2026 ("Hoeveel talent is
 * bij jou al uit beeld?"). Vereist env vars MAILERLITE_API_KEY en
 * DASHBOARD_PASSWORD (Netlify site settings + lokaal .env.local) — nooit
 * in git.
 */

const CAMPAIGNS: Record<string, string> = {
  m: "199395607668851900", // Marjolein eerste 700
  s: "199377868890834346", // IT & Tech Utrecht + Lijst Samantha
};

type Row = {
  email: string;
  name: string;
  company: string;
  status: string;
  opens: number;
  clicks: number;
};

type MailerLiteSubscriber = {
  email?: string;
  status?: string;
  fields?: { name?: string; last_name?: string; company?: string };
};

type MailerLiteActivityItem = {
  subscriber?: MailerLiteSubscriber;
  opens_count?: number;
  clicks_count?: number;
};

type MailerLiteActivityResponse = {
  data?: MailerLiteActivityItem[];
  meta?: { last_page?: number };
};

function safeEqual(given: string, expected: string) {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(request: NextRequest) {
  const given = request.headers.get("x-dashboard-password") ?? "";
  const expected = process.env.DASHBOARD_PASSWORD ?? "";
  if (!given || !expected || !safeEqual(given, expected)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401, headers: NO_STORE });
  }

  const campaign = request.nextUrl.searchParams.get("campaign") ?? "";
  const id = CAMPAIGNS[campaign];
  if (!id) {
    return NextResponse.json({ error: "Onbekende campagne" }, { status: 400, headers: NO_STORE });
  }

  const apiKey = process.env.MAILERLITE_API_KEY ?? "";
  if (!apiKey) {
    return NextResponse.json(
      { error: "MAILERLITE_API_KEY is niet ingesteld op de server." },
      { status: 500, headers: NO_STORE }
    );
  }

  try {
    const rows: Row[] = [];
    let page = 1;
    let last = 1;
    do {
      const r = await fetch(
        `https://connect.mailerlite.com/api/campaigns/${id}/reports/subscriber-activity?limit=100&page=${page}`,
        {
          headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
          cache: "no-store",
        }
      );
      if (!r.ok) throw new Error("MailerLite status " + r.status);
      const body = (await r.json()) as MailerLiteActivityResponse;
      for (const item of body.data ?? []) {
        const sub = item.subscriber ?? {};
        const f = sub.fields ?? {};
        rows.push({
          email: (sub.email ?? "").toLowerCase(),
          name: [f.name, f.last_name].filter(Boolean).join(" "),
          company: f.company ?? "",
          status: sub.status ?? "",
          opens: Number(item.opens_count) || 0,
          clicks: Number(item.clicks_count) || 0,
        });
      }
      last = body.meta?.last_page ?? 1;
      page++;
    } while (page <= last && page <= 50);

    return NextResponse.json({ rows, fetchedAt: Date.now() }, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: "MailerLite is niet bereikbaar. Probeer het later opnieuw." },
      { status: 502, headers: NO_STORE }
    );
  }
}
