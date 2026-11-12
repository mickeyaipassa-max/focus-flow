"use client";

import type { ReactNode } from "react";
import { Dialog } from "@/components/Dialog";
import { Icon } from "@/components/Icon";
import { List } from "@/components/List";
import { DEKKING_INFO, EXTRA_INFO, type DekkingKeuze, type ExtraKeuze } from "./data";

const MEMPHIS = { fontFamily: "var(--font-memphis-medium)" } as const;
const BOOK = { fontFamily: "var(--font-avenir-book)" } as const;
const BOLD = { fontFamily: "var(--font-avenir-bold)" } as const;

/** Figma "Highlight" (gray): grijs vak met info-icoon, 8px padding, rand-radius 3px. */
function Highlight({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-start gap-2 rounded-[3px] bg-[#f6f6f7] p-2">
      <div className="flex min-w-px flex-1 items-start gap-2 p-2">
        <span className="flex shrink-0 items-start">
          <Icon name="info" size="lg" />
        </span>
        <div className="flex min-w-px flex-1 flex-col items-start gap-2 pt-1">{children}</div>
      </div>
    </div>
  );
}

function PdfLink({ naam, href }: { naam: string; href?: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon name="file-md" size="md" />
      <span className="flex items-center gap-1">
        <a
          href={href ?? "#"}
          {...(href ? { target: "_blank", rel: "noopener noreferrer" } : { onClick: (event) => event.preventDefault() })}
          className="font-[550] text-base text-black underline leading-[1.5]"
          style={{ fontFamily: "var(--font-avenir-medium)" }}
        >
          {naam}
        </a>
        <span className="text-[#565656] text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
          (PDF)
        </span>
      </span>
    </div>
  );
}

/** Basisdekking-dialog: "Wat is verzekerd met …?" (en "Wat is niet verzekerd met …?") + voorwaarden-vak. */
export function DekkingDialog({ keuze, onClose }: { keuze: DekkingKeuze | null; onClose: () => void }) {
  const info = keuze ? DEKKING_INFO[keuze] : null;
  return (
    <Dialog open={Boolean(info)} onClose={onClose} title={info?.delen[0].titel ?? ""} size="md">
      {info && (
        <div className="flex flex-col gap-6">
          {info.delen.map((deel, deelIndex) => (
            <div key={deel.titel} className="flex flex-col gap-6">
              {deelIndex > 0 && (
                <p className="pt-1 text-black text-2xl leading-[1.3]" style={MEMPHIS}>
                  {deel.titel}
                </p>
              )}
              {deel.blokken.map((blok) => (
                <div key={blok.kop} className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-black text-xl leading-[1.4]" style={BOLD}>
                      {blok.kop}
                    </p>
                    <p className="text-black text-lg leading-[1.5]" style={BOOK}>
                      Hiermee bedoelen wij:
                    </p>
                  </div>
                  <List icon="bullet" items={blok.bullets.map((text) => ({ text }))} />
                </div>
              ))}
            </div>
          ))}

          <Highlight>
            <div className="flex w-full flex-col gap-1">
              <p className="font-bold text-black text-lg leading-[1.5]" style={BOLD}>
                Voorwaarden en dekking
              </p>
              <p className="text-black text-base leading-[1.5]" style={BOOK}>
                Lees de voorwaarden en ontdek wat verzekerd is, welke uitzonderingen gelden en welke afspraken bij jouw dekking horen.
              </p>
            </div>
            <PdfLink naam={info.pdf.naam} href={info.pdf.href} />
          </Highlight>
        </div>
      )}
    </Dialog>
  );
}

/** Dialog voor een aanvullende dekking: intro, vinkjes, toelichting en een grijs voorwaarden-vak. */
export function ExtraDialog({ keuze, onClose }: { keuze: ExtraKeuze | null; onClose: () => void }) {
  const info = keuze ? EXTRA_INFO[keuze] : null;
  return (
    <Dialog open={Boolean(info)} onClose={onClose} title={info?.titel ?? ""} size="md">
      {info && (
        <div className="flex flex-col gap-4">
          {info.intro && <p>{info.intro}</p>}
          <List icon="check" items={info.vinkjes.map((text) => ({ text }))} />
          {info.outro && <p>{info.outro}</p>}

          <Highlight>
            {info.vak.soort === "pdf" ? (
              <>
                <p className="text-black text-base leading-[1.5]" style={BOOK}>
                  {info.vak.tekst}
                </p>
                <PdfLink naam={info.vak.bestand} />
              </>
            ) : (
              <p className="text-black text-base leading-[1.5]" style={BOOK}>
                {info.vak.voor}
                {info.vak.links.map((link, index) => (
                  <span key={link}>
                    {index > 0 && " en "}
                    <a href="#" onClick={(event) => event.preventDefault()} className="underline">
                      {link}
                    </a>
                  </span>
                ))}
                {info.vak.na}
              </p>
            )}
          </Highlight>
        </div>
      )}
    </Dialog>
  );
}
