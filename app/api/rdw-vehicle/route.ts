import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy naar RDW Open Data (opendata.rdw.nl) — publiek en
 * kosteloos, geen API-key nodig (geverifieerd met een echte call:
 * kenteken=59TSB5 -> Volkswagen Up, 999cc, Benzine).
 *
 * Twee losse RDW-datasets nodig voor de velden die Figma's "Vehicle
 * Details" toont (merk, model, type, bouwjaar, brandstof):
 * - m9d7-ebf2 ("Gekentekende voertuigen"): merk, handelsbenaming, type,
 *   datum_eerste_toelating
 * - 8ys7-d773 ("Brandstof"): brandstof_omschrijving
 */

type RdwVoertuig = {
  kenteken?: string;
  merk?: string;
  handelsbenaming?: string;
  type?: string;
  datum_eerste_toelating?: string;
};

type RdwBrandstof = {
  brandstof_omschrijving?: string;
};

export async function GET(request: NextRequest) {
  const kentekenRaw = request.nextUrl.searchParams.get("kenteken") ?? "";
  const kenteken = kentekenRaw.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  if (!kenteken) {
    return NextResponse.json({ error: "kenteken is verplicht." }, { status: 400 });
  }

  let voertuigRes: Response;
  let brandstofRes: Response;
  try {
    [voertuigRes, brandstofRes] = await Promise.all([
      fetch(`https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${kenteken}`, { cache: "no-store" }),
      fetch(`https://opendata.rdw.nl/resource/8ys7-d773.json?kenteken=${kenteken}`, { cache: "no-store" }),
    ]);
  } catch {
    return NextResponse.json({ error: "Kon geen verbinding maken met de RDW." }, { status: 502 });
  }

  if (!voertuigRes.ok || !brandstofRes.ok) {
    return NextResponse.json({ error: "RDW gaf een foutstatus terug." }, { status: 502 });
  }

  const voertuigen = (await voertuigRes.json()) as RdwVoertuig[];
  const voertuig = voertuigen[0];

  if (!voertuig) {
    return NextResponse.json({ found: false });
  }

  const brandstoffen = (await brandstofRes.json()) as RdwBrandstof[];
  const year = voertuig.datum_eerste_toelating?.slice(0, 4) ?? "";

  return NextResponse.json({
    found: true,
    vehicle: {
      makeModel: [voertuig.merk, voertuig.handelsbenaming].filter(Boolean).join(" "),
      type: voertuig.type ?? "",
      year,
      fuel: brandstoffen[0]?.brandstof_omschrijving ?? "",
    },
  });
}
