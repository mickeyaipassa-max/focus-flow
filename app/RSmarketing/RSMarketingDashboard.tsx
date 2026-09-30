"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Wachtwoord-beveiligd campagnedashboard voor RocketSourcers marketing
 * (/RSmarketing). Haalt ontvangers + opens/clicks op van twee
 * MailerLite-campagnes via /api/rs-marketing/subscribers. Port van de
 * geleverde vanilla-JS dashboard (zelfde markup/gedrag), zodat het als
 * Next.js-route in focus-flow past naast de andere klantprojecten.
 *
 * Bevat persoonsgegevens (AVG): wachtwoordgate + noindex (zie page.tsx)
 * moeten blijven staan.
 */

const API_URL = "/api/rs-marketing/subscribers";

type CampaignKey = "m" | "s";

const CAMPAIGNS: Record<CampaignKey, { label: string }> = {
  m: { label: "Marjolein eerste 700" },
  s: { label: "IT & Tech + Samantha" },
};

type Row = {
  email: string;
  name: string;
  company: string;
  status: string;
  opens: number;
  clicks: number;
};

type FetchError = { code: "unauthorized" } | { code: "server"; message?: string };

type SortKey = "name" | "opens" | "clicks";
type FilterKey = "all" | "open" | "click";
type CampaignFilter = "all" | CampaignKey;

const fmt = (n: number) => n.toLocaleString("nl-NL");

async function fetchCampaign(key: CampaignKey, password: string, fresh: boolean) {
  const res = await fetch(`${API_URL}?campaign=${key}${fresh ? "&fresh=1" : ""}`, {
    headers: { "X-Dashboard-Password": password },
  });
  if (res.status === 401) throw { code: "unauthorized" } as FetchError;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw { code: "server", message: body.error || `HTTP ${res.status}` } as FetchError;
  return body as { rows: Row[]; fetchedAt: number };
}

function errorText(err: FetchError | undefined): [string, string] {
  if (err && err.code === "server") return ["Gegevens konden niet worden geladen.", err.message || ""];
  return ["Gegevens konden niet worden geladen.", "Controleer je verbinding en probeer het opnieuw."];
}

export default function RSMarketingDashboard() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [pwWrong, setPwWrong] = useState(false);

  const [data, setData] = useState<Record<CampaignKey, Row[] | null>>({ m: null, s: null });
  const [errors, setErrors] = useState<Partial<Record<CampaignKey, FetchError>>>({});
  const [stamp, setStamp] = useState<number | null>(null);

  const [campaign, setCampaign] = useState<CampaignFilter>("all");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("opens");
  const [dir, setDir] = useState<1 | -1>(-1);
  const [limit, setLimit] = useState(100);

  // Wachtwoord uit sessionStorage lezen na mount (server heeft geen sessionStorage).
  useEffect(() => {
    try {
      const pw = sessionStorage.getItem("rs_pw") || "";
      if (pw) {
        setPassword(pw);
        setLoggedIn(true);
      }
    } catch {
      // sessionStorage kan geblokkeerd zijn (privé-venster) — dan gewoon uitloggen tonen.
    }
    setReady(true);
  }, []);

  async function load(fresh: boolean) {
    await Promise.all(
      (Object.keys(CAMPAIGNS) as CampaignKey[]).map(async (k) => {
        try {
          const res = await fetchCampaign(k, password, fresh);
          setData((d) => ({ ...d, [k]: res.rows }));
          setErrors((e) => {
            const next = { ...e };
            delete next[k];
            return next;
          });
          setStamp((s) => (s ? Math.min(s, res.fetchedAt) : res.fetchedAt));
        } catch (e) {
          const err = e as FetchError;
          if (err.code === "unauthorized") {
            logout(true);
            return;
          }
          setErrors((prev) => ({ ...prev, [k]: err }));
        }
      })
    );
  }

  useEffect(() => {
    if (loggedIn && password) {
      setData({ m: null, s: null });
      setErrors({});
      setStamp(null);
      load(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  function logout(wrong: boolean) {
    try {
      sessionStorage.removeItem("rs_pw");
    } catch {
      // negeren
    }
    setPassword("");
    setLoggedIn(false);
    setPwWrong(wrong);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      sessionStorage.setItem("rs_pw", pwInput);
    } catch {
      // negeren
    }
    setPassword(pwInput);
    setLoggedIn(true);
    setPwWrong(false);
  }

  const keys: CampaignKey[] = campaign === "all" ? ["m", "s"] : [campaign];
  const loaded = keys.filter((k) => data[k]);
  const failed = keys.filter((k) => errors[k]);

  const all = useMemo(() => {
    const map = new Map<string, Row>();
    keys.forEach((k) =>
      (data[k] || []).forEach((r) => {
        const cur = map.get(r.email);
        if (cur) {
          cur.opens += r.opens;
          cur.clicks += r.clicks;
          if (!cur.name) cur.name = r.name;
          if (!cur.company) cur.company = r.company;
        } else {
          map.set(r.email, { ...r });
        }
      })
    );
    return [...map.values()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, campaign]);

  const rows = useMemo(() => {
    let out = all;
    if (filter === "open") out = out.filter((r) => r.opens > 0);
    if (filter === "click") out = out.filter((r) => r.clicks > 0);
    const query = q.trim().toLowerCase();
    if (query) out = out.filter((r) => (r.name + " " + r.email + " " + r.company).toLowerCase().includes(query));
    out = [...out].sort((a, b) => {
      if (sort === "name") return dir * (a.name || a.email).localeCompare(b.name || b.email, "nl");
      const d = dir * (a[sort] - b[sort]);
      return d || b.clicks - a.clicks || b.opens - a.opens || a.email.localeCompare(b.email);
    });
    return out;
  }, [all, filter, q, sort, dir]);

  const maxO = Math.max(1, ...all.map((r) => r.opens));
  const maxC = Math.max(1, ...all.map((r) => r.clicks));

  function toggleSort(key: SortKey) {
    if (sort === key) {
      setDir((d) => (d === 1 ? -1 : 1) as 1 | -1);
    } else {
      setSort(key);
      setDir(key === "name" ? 1 : -1);
    }
  }

  const partial = failed.length && loaded.length ? ` · ${failed.map((k) => CAMPAIGNS[k].label).join(", ")} niet geladen` : "";

  if (!ready) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="wrap">
        {!loggedIn && (
          <div id="login" className="panel" style={{ maxWidth: 380, margin: "60px auto", padding: 24 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>Inloggen</h2>
            <p style={{ margin: "0 0 14px", color: "var(--mid)", fontSize: 14 }}>
              Dit dashboard bevat persoonsgegevens en is beveiligd.
            </p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Wachtwoord"
                aria-label="Wachtwoord"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                style={{
                  width: "100%",
                  font: "inherit",
                  padding: "10px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  background: "var(--bg)",
                  color: "var(--ink)",
                }}
              />
              {pwWrong && (
                <p style={{ color: "var(--bad)", fontSize: 13, margin: "8px 0 0" }}>Onjuist wachtwoord.</p>
              )}
              <button
                type="submit"
                className="refresh"
                style={{ marginTop: 12, width: "100%", background: "var(--ink)", color: "var(--panel)", borderColor: "var(--ink)", padding: 10 }}
              >
                Bekijk dashboard
              </button>
            </form>
          </div>
        )}

        {loggedIn && (
          <div id="app">
            <header>
              <h1>Hoeveel talent is bij jou al uit beeld?</h1>
              <p>Ontvangers van de campagnes van 23 september, met opens en clicks per persoon. Live uit MailerLite.</p>
            </header>

            <div className="seg" role="group" aria-label="Campagne">
              <button aria-pressed={campaign === "all"} onClick={() => setCampaign("all")}>
                Beide campagnes
              </button>
              <button aria-pressed={campaign === "m"} onClick={() => setCampaign("m")}>
                Marjolein eerste 700
              </button>
              <button aria-pressed={campaign === "s"} onClick={() => setCampaign("s")}>
                IT &amp; Tech Utrecht + Lijst Samantha
              </button>
            </div>

            <div className="kpis">
              <div className="kpi">
                <b>{loaded.length ? fmt(all.length) : "–"}</b>
                <span>ontvangers</span>
              </div>
              <div className="kpi">
                <b>{loaded.length ? fmt(all.filter((r) => r.opens > 0).length) : "–"}</b>
                <span>hebben geopend</span>
              </div>
              <div className="kpi hl">
                <b>{loaded.length ? fmt(all.filter((r) => r.clicks > 0).length) : "–"}</b>
                <span>hebben geklikt</span>
              </div>
            </div>

            <div className="panel">
              <div className="toolbar">
                <input
                  type="search"
                  placeholder="Zoek op naam, e-mail of bedrijf"
                  aria-label="Zoeken"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setLimit(100);
                  }}
                />
                <div className="chips" role="group" aria-label="Filter">
                  <button aria-pressed={filter === "all"} onClick={() => { setFilter("all"); setLimit(100); }}>
                    Iedereen
                  </button>
                  <button aria-pressed={filter === "open"} onClick={() => { setFilter("open"); setLimit(100); }}>
                    Geopend
                  </button>
                  <button aria-pressed={filter === "click"} onClick={() => { setFilter("click"); setLimit(100); }}>
                    Geklikt
                  </button>
                </div>
                <button className="refresh" type="button" onClick={() => { setStamp(null); load(true); }}>
                  Vernieuwen
                </button>
              </div>
              <div className="tablewrap">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <button data-active={sort === "name"} onClick={() => toggleSort("name")}>
                          {sort === "name" ? `Gebruiker ${dir < 0 ? "↓" : "↑"}` : "Gebruiker"}
                        </button>
                      </th>
                      <th className="num">
                        <button data-active={sort === "opens"} onClick={() => toggleSort("opens")}>
                          {sort === "opens" ? `Opens ${dir < 0 ? "↓" : "↑"}` : "Opens"}
                        </button>
                      </th>
                      <th className="num">
                        <button data-active={sort === "clicks"} onClick={() => toggleSort("clicks")}>
                          {sort === "clicks" ? `Clicks ${dir < 0 ? "↓" : "↑"}` : "Clicks"}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, limit).map((r) => (
                      <tr key={r.email}>
                        <td>
                          <div className="who">
                            <strong>
                              {r.name || r.email}
                              {(r.status === "bounced" || r.status === "unsubscribed") && (
                                <span className={`badge ${r.status}`}>
                                  {r.status === "bounced" ? "bounced" : "afgemeld"}
                                </span>
                              )}
                            </strong>
                            {(r.name ? r.email : "") || r.company ? (
                              <small>{[r.name ? r.email : "", r.company].filter(Boolean).join(" · ")}</small>
                            ) : null}
                          </div>
                        </td>
                        <Cell value={r.opens} max={maxO} />
                        <Cell value={r.clicks} max={maxC} accent />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div id="state" className="state" hidden={!(
                (failed.length > 0 && loaded.length === 0) ||
                (loaded.length < keys.length && failed.length === 0) ||
                rows.length === 0
              )}>
                {failed.length && !loaded.length ? (
                  (() => {
                    const [t, s] = errorText(errors[failed[0]]);
                    return (
                      <>
                        <strong>{t}</strong>
                        {s}
                      </>
                    );
                  })()
                ) : loaded.length < keys.length && !failed.length ? (
                  "Gegevens ophalen uit MailerLite…"
                ) : !rows.length ? (
                  "Geen ontvangers gevonden voor deze selectie."
                ) : null}
              </div>

              <div className="foot">
                <span>
                  {rows.length ? (
                    <>
                      {fmt(Math.min(rows.length, limit))} van {fmt(rows.length)} getoond
                      {rows.length > limit && (
                        <>
                          {" · "}
                          <button className="more" onClick={() => setLimit((l) => l + 200)}>
                            Toon meer
                          </button>
                        </>
                      )}
                    </>
                  ) : null}
                </span>
                <span>
                  {stamp
                    ? "Bijgewerkt " + new Date(stamp).toLocaleString("nl-NL", { dateStyle: "short", timeStyle: "short" })
                    : ""}
                  {partial}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Cell({ value, max, accent }: { value: number; max: number; accent?: boolean }) {
  return (
    <td className="num">
      <span className={`cnt ${accent ? "c" : ""}`}>
        <span className={value ? "" : "zero"}>{value}</span>
        <i style={{ ["--w" as string]: `${(value / max) * 100}%` }} />
      </span>
    </td>
  );
}

const CSS = `
:root{
  --bg:#f5f6f8; --panel:#ffffff; --ink:#15213b; --mid:#667085; --line:#e4e7ec; --soft:#eef1f5;
  --accent:#f5a623; --accent-soft:#fdf0d9; --good:#1f7a55; --bad:#b42318;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){--bg:#0f1524;--panel:#171f33;--ink:#e8ecf4;--mid:#98a2b3;--line:#27314a;--soft:#1e2740;--accent-soft:#3a2f16;--good:#4ec38f;--bad:#f97066}
}
:root[data-theme="dark"]{--bg:#0f1524;--panel:#171f33;--ink:#e8ecf4;--mid:#98a2b3;--line:#27314a;--soft:#1e2740;--accent-soft:#3a2f16;--good:#4ec38f;--bad:#f97066}
.wrap{max-width:1040px;margin:0 auto;padding:32px 20px 48px;background:var(--bg);color:var(--ink);font-family:"Instrument Sans",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;line-height:1.45}
.wrap header h1{font-size:clamp(22px,3vw,28px);margin:0 0 4px;font-weight:700}
.wrap header p{margin:0;color:var(--mid);font-size:14px}
.wrap .seg{display:inline-flex;background:var(--soft);border-radius:10px;padding:4px;margin:22px 0 18px;flex-wrap:wrap;gap:2px}
.wrap .seg button{border:0;background:transparent;color:var(--mid);font:inherit;font-size:14px;font-weight:500;padding:8px 14px;border-radius:7px;cursor:pointer}
.wrap .seg button[aria-pressed="true"]{background:var(--panel);color:var(--ink);box-shadow:0 1px 2px rgba(16,24,40,.08)}
.wrap .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
.wrap .kpi{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px 18px}
.wrap .kpi b{display:block;font-size:28px;font-weight:700;font-variant-numeric:tabular-nums}
.wrap .kpi span{color:var(--mid);font-size:13px}
.wrap .kpi.hl{border-color:var(--accent);background:var(--accent-soft)}
.wrap .panel{background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.wrap .toolbar{display:flex;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.wrap .toolbar input{flex:1;min-width:180px;font:inherit;font-size:14px;padding:9px 12px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink)}
.wrap .chips{display:flex;gap:6px;flex-wrap:wrap}
.wrap .chips button{font:inherit;font-size:13px;border:1px solid var(--line);background:transparent;color:var(--mid);padding:6px 11px;border-radius:999px;cursor:pointer}
.wrap .chips button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--panel)}
.wrap .refresh{font:inherit;font-size:13px;border:1px solid var(--line);background:transparent;color:var(--ink);padding:7px 12px;border-radius:8px;cursor:pointer}
.wrap button:focus-visible,.wrap input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.wrap .tablewrap{overflow-x:auto}
.wrap table{width:100%;border-collapse:collapse;font-size:14px}
.wrap th{text-align:left;font-weight:600;color:var(--mid);font-size:12.5px;padding:10px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
.wrap th.num,.wrap td.num{text-align:right}
.wrap th button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
.wrap th button[data-active="true"]{color:var(--ink)}
.wrap td{padding:11px 14px;border-bottom:1px solid var(--line);vertical-align:middle}
.wrap tr:last-child td{border-bottom:0}
.wrap .who{display:flex;flex-direction:column;min-width:0}
.wrap .who strong{font-weight:600}
.wrap .who small{color:var(--mid);font-size:12.5px;overflow-wrap:anywhere}
.wrap .badge{display:inline-block;font-size:11px;font-weight:600;padding:1px 7px;border-radius:999px;margin-left:6px;vertical-align:1px}
.wrap .badge.bounced{background:rgba(180,35,24,.12);color:var(--bad)}
.wrap .badge.unsubscribed{background:var(--soft);color:var(--mid)}
.wrap .cnt{display:inline-flex;align-items:center;gap:8px;justify-content:flex-end;font-variant-numeric:tabular-nums;font-weight:600}
.wrap .cnt i{display:block;height:6px;border-radius:3px;background:var(--line);width:64px;overflow:hidden}
.wrap .cnt i::after{content:"";display:block;height:100%;width:var(--w);background:var(--ink)}
.wrap .cnt.c i::after{background:var(--accent)}
.wrap .zero{color:var(--mid);font-weight:400}
.wrap .state{padding:40px 20px;text-align:center;color:var(--mid);font-size:14px}
.wrap .state strong{display:block;color:var(--ink);margin-bottom:4px}
.wrap .foot{display:flex;justify-content:space-between;gap:10px;color:var(--mid);font-size:12.5px;padding:10px 14px;border-top:1px solid var(--line);flex-wrap:wrap}
.wrap .more{font:inherit;font-size:13px;border:0;background:none;color:var(--ink);text-decoration:underline;cursor:pointer}
@media (max-width:640px){.wrap .kpis{grid-template-columns:1fr 1fr}.wrap .kpis .kpi:first-child{grid-column:span 2}.wrap .cnt i{display:none}}
@media (prefers-reduced-motion:reduce){.wrap *{transition:none!important}}
`;
