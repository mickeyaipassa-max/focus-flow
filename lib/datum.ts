/** Datumhelpers gedeeld door de mutatie- en royeren-funnel (eerder in app/mutatie/pricing.ts). */
export function formatDatum(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

/**
 * yyyy-mm-dd i.p.v. `Date.toISOString()` — die converteert naar UTC, wat in
 * een positieve tijdzone (bv. Europe/Amsterdam) middernacht-lokale datums een
 * dag terug kan schuiven. `MutatieFunnelState.ingangsdatum` wordt hiermee
 * JSON-veilig opgeslagen (sessionStorage kent geen `Date`-type).
 */
export function toIsoDatum(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function fromIsoDatum(iso: string): Date {
  const [yyyy, mm, dd] = iso.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}
