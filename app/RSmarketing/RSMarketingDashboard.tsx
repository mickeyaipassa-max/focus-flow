"use client";

import { useEffect, useMemo, useState } from "react";
import { campaignsByRecency } from "./campaigns";

/**
 * Wachtwoord-beveiligd, doorlopend marketingdashboard voor RocketSourcers
 * (/RSmarketing). Elke verstuurde campagne uit ./campaigns.ts krijgt een
 * eigen tab (nieuwste eerst), plus een "Alle campagnes"-tab die alles
 * optelt. Haalt ontvangers + opens/clicks op per campagne-slug via
 * /api/rs-marketing/subscribers.
 *
 * Bevat persoonsgegevens (AVG): wachtwoordgate + noindex (zie page.tsx)
 * moeten blijven staan.
 */

const API_URL = "/api/rs-marketing/subscribers";

const CAMPAIGNS = campaignsByRecency();
const CAMPAIGN_LABEL: Record<string, string> = Object.fromEntries(CAMPAIGNS.map((c) => [c.slug, c.label]));
const CAMPAIGN_SLUGS = CAMPAIGNS.map((c) => c.slug);

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
type CampaignFilter = "all" | string;

const fmt = (n: number) => n.toLocaleString("nl-NL");

async function fetchCampaign(slug: string, password: string, fresh: boolean) {
  const res = await fetch(`${API_URL}?campaign=${slug}${fresh ? "&fresh=1" : ""}`, {
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

  const [data, setData] = useState<Record<string, Row[] | null>>({});
  const [errors, setErrors] = useState<Record<string, FetchError>>({});
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
      CAMPAIGN_SLUGS.map(async (k) => {
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
      setData({});
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

  const keys: string[] = campaign === "all" ? CAMPAIGN_SLUGS : [campaign];
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

  const partial = failed.length && loaded.length ? ` · ${failed.map((k) => CAMPAIGN_LABEL[k]).join(", ")} niet geladen` : "";

  if (!ready) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="rsPage">
      <div className="wrap">
        {!loggedIn && (
          <div id="login" className="loginCard">
            <span className="loginKicker">Beveiligde toegang</span>
            <h2 className="loginTitle">Inloggen</h2>
            <p className="loginHint">Dit dashboard bevat persoonsgegevens en is beveiligd.</p>
            <form onSubmit={handleLogin}>
              <input
                className="loginInput"
                type="password"
                autoComplete="current-password"
                placeholder="Wachtwoord"
                aria-label="Wachtwoord"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
              />
              {pwWrong && <p className="loginError">Onjuist wachtwoord.</p>}
              <button type="submit" className="loginSubmit">
                Bekijk dashboard
              </button>
            </form>
          </div>
        )}

        {loggedIn && (
          <div id="app">
            <header>
              <span className="kicker">Live campagnedashboard</span>
              <h1>Marketingdashboard RocketSourcers</h1>
            </header>

            <div className="seg" role="group" aria-label="Campagne">
              <button aria-pressed={campaign === "all"} onClick={() => setCampaign("all")}>
                Alle campagnes
              </button>
              {CAMPAIGNS.map((c) => (
                <button key={c.slug} aria-pressed={campaign === c.slug} onClick={() => setCampaign(c.slug)}>
                  {c.label}
                </button>
              ))}
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
  --bg:#f4ede0; --panel:#ffffff; --panel-alt:#f8f8f8; --ink:#1a1a1a; --mid:#6b6b6b; --line:#e6e1d8; --soft:#f4ede0;
  --accent:#f66517; --accent-dark:#d93909; --accent-soft:#fff2e9; --good:#1f7a55; --bad:#d93909;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){--bg:#17130f;--panel:#211c16;--panel-alt:#2a2319;--ink:#f5efe4;--mid:#b8ab97;--line:#3a3226;--soft:#2a2319;--accent-dark:#ff8a4c;--accent-soft:#3a2412;--good:#4ec38f;--bad:#ff6b4a}
}
:root[data-theme="dark"]{--bg:#17130f;--panel:#211c16;--panel-alt:#2a2319;--ink:#f5efe4;--mid:#b8ab97;--line:#3a3226;--soft:#2a2319;--accent-dark:#ff8a4c;--accent-soft:#3a2412;--good:#4ec38f;--bad:#ff6b4a}
.rsPage{min-height:100vh;background:var(--bg);color:var(--ink);font-family:var(--font-rs-inter),ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
.wrap{max-width:1040px;margin:0 auto;padding:48px 20px 56px;line-height:1.45}
.wrap .kicker{display:inline-block;color:var(--accent);font-weight:800;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px}
.wrap header h1{font-size:clamp(26px,3.4vw,34px);margin:0 0 6px;font-weight:900;letter-spacing:-.01em}
.wrap header p{margin:0;color:var(--mid);font-size:14.5px}
.wrap .loginCard{max-width:400px;margin:64px auto;padding:32px;background:var(--panel);border:1px solid var(--line);border-radius:20px;box-shadow:0 12px 32px rgba(26,17,8,.06)}
.wrap .loginKicker{display:block;color:var(--accent);font-weight:800;font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px}
.wrap .loginTitle{margin:0 0 6px;font-size:22px;font-weight:900}
.wrap .loginHint{margin:0 0 18px;color:var(--mid);font-size:14px}
.wrap .loginInput{width:100%;font:inherit;font-size:15px;padding:12px 14px;border:1.5px solid var(--line);border-radius:10px;background:var(--panel-alt);color:var(--ink)}
.wrap .loginError{color:var(--bad);font-size:13px;font-weight:600;margin:10px 0 0}
.wrap .loginSubmit{margin-top:16px;width:100%;font:inherit;font-weight:700;font-size:15px;background:var(--accent);color:#fff;border:0;border-radius:999px;padding:13px;cursor:pointer;transition:background .15s}
.wrap .loginSubmit:hover{background:var(--accent-dark)}
.wrap .seg{display:inline-flex;background:var(--soft);border-radius:999px;padding:4px;margin:24px 0 18px;flex-wrap:wrap;gap:2px}
.wrap .seg button{border:0;background:transparent;color:var(--mid);font:inherit;font-size:14px;font-weight:700;padding:9px 16px;border-radius:999px;cursor:pointer;transition:background .15s,color .15s}
.wrap .seg button[aria-pressed="true"]{background:var(--ink);color:var(--panel)}
.wrap .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
.wrap .kpi{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px 20px}
.wrap .kpi b{display:block;font-size:30px;font-weight:900;font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.wrap .kpi span{color:var(--mid);font-size:13px;font-weight:500}
.wrap .kpi.hl{border-color:var(--accent);background:var(--accent-soft)}
.wrap .kpi.hl b{color:var(--accent-dark)}
.wrap .panel{background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.wrap .toolbar{display:flex;gap:10px;align-items:center;padding:14px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.wrap .toolbar input{flex:1;min-width:180px;font:inherit;font-size:14px;padding:10px 14px;border:1.5px solid var(--line);border-radius:999px;background:var(--panel-alt);color:var(--ink)}
.wrap .chips{display:flex;gap:6px;flex-wrap:wrap}
.wrap .chips button{font:inherit;font-size:13px;font-weight:700;border:1.5px solid var(--line);background:transparent;color:var(--mid);padding:7px 14px;border-radius:999px;cursor:pointer;transition:background .15s,color .15s,border-color .15s}
.wrap .chips button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--panel)}
.wrap .refresh{font:inherit;font-size:13px;font-weight:700;border:1.5px solid var(--accent);background:transparent;color:var(--accent-dark);padding:8px 16px;border-radius:999px;cursor:pointer;transition:background .15s,color .15s}
.wrap .refresh:hover{background:var(--accent);color:#fff}
.wrap button:focus-visible,.wrap input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.wrap .tablewrap{overflow-x:auto}
.wrap table{width:100%;border-collapse:collapse;font-size:14px}
.wrap th{text-align:left;font-weight:700;color:var(--mid);font-size:12px;letter-spacing:.03em;text-transform:uppercase;padding:12px 16px;border-bottom:1px solid var(--line);white-space:nowrap}
.wrap th.num,.wrap td.num{text-align:right}
.wrap th button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
.wrap th button[data-active="true"]{color:var(--ink)}
.wrap td{padding:13px 16px;border-bottom:1px solid var(--line);vertical-align:middle}
.wrap tr:last-child td{border-bottom:0}
.wrap tbody tr:hover{background:var(--panel-alt)}
.wrap .who{display:flex;flex-direction:column;min-width:0}
.wrap .who strong{font-weight:700}
.wrap .who small{color:var(--mid);font-size:12.5px;overflow-wrap:anywhere}
.wrap .badge{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;margin-left:6px;vertical-align:1px}
.wrap .badge.bounced{background:rgba(217,57,9,.1);color:var(--bad)}
.wrap .badge.unsubscribed{background:var(--soft);color:var(--mid)}
.wrap .cnt{display:inline-flex;align-items:center;gap:8px;justify-content:flex-end;font-variant-numeric:tabular-nums;font-weight:700}
.wrap .cnt i{display:block;height:6px;border-radius:3px;background:var(--line);width:64px;overflow:hidden}
.wrap .cnt i::after{content:"";display:block;height:100%;width:var(--w);background:var(--ink)}
.wrap .cnt.c i::after{background:var(--accent)}
.wrap .zero{color:var(--mid);font-weight:400}
.wrap .state{padding:44px 20px;text-align:center;color:var(--mid);font-size:14px}
.wrap .state strong{display:block;color:var(--ink);margin-bottom:4px;font-weight:800}
.wrap .foot{display:flex;justify-content:space-between;gap:10px;color:var(--mid);font-size:12.5px;padding:12px 16px;border-top:1px solid var(--line);flex-wrap:wrap}
.wrap .more{font:inherit;font-size:13px;font-weight:700;border:0;background:none;color:var(--accent-dark);text-decoration:underline;cursor:pointer}
@media (max-width:640px){.wrap .kpis{grid-template-columns:1fr 1fr}.wrap .kpis .kpi:first-child{grid-column:span 2}.wrap .cnt i{display:none}}
@media (prefers-reduced-motion:reduce){.wrap *{transition:none!important}}
`;
