import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { findCampaign } from "../../../RSmarketing/campaigns";

/**
 * Server-side proxy naar MailerLite voor het RSmarketing-campagnedashboard
 * (/RSmarketing). Campagnes (en welke MailerLite-ID's daarbij horen) staan
 * in ../../RSmarketing/campaigns.ts. Vereist env vars MAILERLITE_API_KEY en
 * DASHBOARD_PASSWORD (Netlify site settings + lokaal .env.local) — nooit
 * in git.
 */

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

async function fetchMailerLiteRows(mailerliteId: string, apiKey: string): Promise<Row[]> {
  const rows: Row[] = [];
  let page = 1;
  let last = 1;
  do {
    const r = await fetch(
      `https://connect.mailerlite.com/api/campaigns/${mailerliteId}/reports/subscriber-activity?limit=100&page=${page}`,
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
  return rows;
}

/** Rijen van meerdere MailerLite-ID's (zelfde campagne, andere lijst) samenvoegen per e-mailadres. */
function mergeRows(rowLists: Row[][]): Row[] {
  const map = new Map<string, Row>();
  for (const rows of rowLists) {
    for (const r of rows) {
      const cur = map.get(r.email);
      if (cur) {
        cur.opens += r.opens;
        cur.clicks += r.clicks;
        if (!cur.name) cur.name = r.name;
        if (!cur.company) cur.company = r.company;
      } else {
        map.set(r.email, { ...r });
      }
    }
  }
  return [...map.values()];
}

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(request: NextRequest) {
  const given = request.headers.get("x-dashboard-password") ?? "";
  const expected = process.env.DASHBOARD_PASSWORD ?? "";
  if (!given || !expected || !safeEqual(given, expected)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401, headers: NO_STORE });
  }

  const slug = request.nextUrl.searchParams.get("campaign") ?? "";
  const campaign = findCampaign(slug);
  if (!campaign) {
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
    const rowLists = await Promise.all(campaign.mailerliteIds.map((id) => fetchMailerLiteRows(id, apiKey)));
    const rows = mergeRows(rowLists);
    return NextResponse.json({ rows, fetchedAt: Date.now() }, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: "MailerLite is niet bereikbaar. Probeer het later opnieuw." },
      { status: 502, headers: NO_STORE }
    );
  }
}
