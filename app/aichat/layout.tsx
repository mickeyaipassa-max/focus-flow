import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * `app/aichat/page.tsx` is een Client Component ("use client", vanwege de
 * chat-state) — een Server Component `export const metadata` kan dus niet
 * ín dat bestand staan, zelfde precedent als `app/bday/layout.tsx`. Titel
 * matcht de zichtbare H1 op de pagina zelf ("Zorgverzekering
 * klantenservice") — WCAG 2.4.2 (Page Titled) vereist een titel die het
 * onderwerp/doel van de pagina beschrijft; zonder deze layout bleef
 * `document.title` leeg (bevestigd via een WCAG-check op de live pagina).
 */
export const metadata: Metadata = {
  title: "Zorgverzekering klantenservice | a.s.r.",
};

export default function AiChatLayout({ children }: { children: ReactNode }) {
  return children;
}
