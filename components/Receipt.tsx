"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";

export type ReceiptListItem = {
  label: string;
  date?: string;
  amount?: string;
  onRemove?: () => void;
};

export type ReceiptGroup = {
  title?: string;
  items: ReceiptListItem[];
};

export type ReceiptSection = {
  id: string;
  title: string;
  date?: string;
  amount: string;
  /** Figma's "Pictogram" is een echte productafbeelding (bv. "1004-autoverzekering") — geen generiek icoon, dus een echte slot i.p.v. een vast bestand. */
  icon?: ReactNode;
  groups?: ReceiptGroup[];
  onEdit?: () => void;
};

type ReceiptProps = {
  title: string;
  description?: string;
  sections: ReceiptSection[];
  /** Welke sectie standaard openstaat (accordion: maar één tegelijk, bevestigd via Figma's `active`-variant die één enkele waarde is, geen per-sectie booleans). */
  defaultActiveSectionId?: string | null;
  /** Bevestigde vaste tekst uit Figma's "no-receipt items"-variant. */
  emptyMessage?: string;
  /** Bevestigde vaste tekst — "per maand" is herhaaldelijk vaste UI-copy gebleken in dit designsysteem (zie ook CheckboxCardControlLeft). */
  summaryLabel?: string;
  summaryAmount: string;
  summaryInfo?: string;
  showSummaryInfoButton?: boolean;
  onSummaryInfoClick?: () => void;
  className?: string;
};

function ListItemRow({ item }: { item: ReceiptListItem }) {
  return (
    <div className="flex w-full items-start gap-2 px-3">
      <div className="flex min-w-px flex-1 flex-wrap items-start gap-x-2 gap-y-1">
        <p className="whitespace-nowrap text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
          {item.label}
        </p>
        {item.date && (
          <span className="flex items-center pt-[2px] text-[#2a292e] text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
            ({item.date})
          </span>
        )}
      </div>
      {item.amount && (
        <p className="whitespace-nowrap text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
          {item.amount}
        </p>
      )}
      {item.onRemove && (
        <button type="button" onClick={item.onRemove} className="shrink-0 rounded-[3px]">
          <span className="whitespace-nowrap text-black text-base leading-[1.5] underline" style={{ fontFamily: "var(--font-avenir)" }}>
            Verwijder
          </span>
        </button>
      )}
    </div>
  );
}

function GroupBlock({ group }: { group: ReceiptGroup }) {
  return (
    <div className="flex w-full flex-col items-start gap-1">
      {group.title && (
        <p className="w-full px-3 font-bold text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
          {group.title}
        </p>
      )}
      {group.items.map((item, index) => (
        <ListItemRow key={index} item={item} />
      ))}
    </div>
  );
}

function SectionAccordion({ section, open, onToggle }: { section: ReceiptSection; open: boolean; onToggle: () => void }) {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-4 border-b border-[#e5e5e5] py-3 pr-3">
      <button type="button" onClick={onToggle} className="group flex w-full items-start gap-4">
        <span className="flex shrink-0 items-start pt-1">
          <Icon name={open ? "chevron-up" : "chevron-down"} size="md" />
        </span>
        <span className="flex min-w-px flex-1 items-start gap-2 self-stretch">
          {section.icon && <span className="flex size-8 shrink-0 items-center justify-center">{section.icon}</span>}
          <span className="flex min-w-px flex-1 flex-wrap items-start gap-2 pt-1 leading-[1.5]">
            <span className="flex min-w-px flex-1 flex-wrap items-center gap-2">
              <span
                className="whitespace-nowrap font-bold text-black text-lg leading-[1.5] group-hover:underline"
                style={{ fontFamily: "var(--font-avenir-bold)" }}
              >
                {section.title}
              </span>
              {section.date && (
                <span className="whitespace-nowrap text-[#2a292e] text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
                  ({section.date})
                </span>
              )}
            </span>
            <span className="whitespace-nowrap text-right font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
              {section.amount}
            </span>
          </span>
        </span>
      </button>

      {open && section.groups && section.groups.length > 0 && (
        <div className="flex w-full flex-col items-start gap-3">
          {section.groups.map((group, index) => (
            <GroupBlock key={index} group={group} />
          ))}
        </div>
      )}

      {open && section.onEdit && (
        <div className="flex w-full flex-col items-start pl-3">
          <button
            type="button"
            onClick={section.onEdit}
            className="flex items-center justify-center gap-2 rounded-[3px] border border-[#2a292e] px-4 py-2"
          >
            <Icon name="edit" size="md" />
            <span className="whitespace-nowrap text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
              Wijzig
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Gebaseerd op Figma's "Receipt Box" (type=collapsable/one-section/no-
 * receipt items — hier "collapsable" volledig gebouwd, dat is bevestigd de
 * primaire/rijkste variant en dekt de andere twee al af via lege
 * `sections`/`groups`-arrays).
 *
 * Accordion-gedrag: bevestigd via Figma's `active`-variant (één enkele
 * waarde, geen per-sectie booleans) — maar één sectie tegelijk open, zelf
 * beheerd (`useState`), net als Popover's eigen open/dicht-state.
 *
 * Hover op een dichte sectietitel toont een underline — bevestigd via een
 * losse hover-state-fetch, letterlijk overgenomen (`group-hover:underline`).
 *
 * Herberekenen: gebaseerd op een losse referentie uit de "Mutatie funnels"
 * (node 7616:20956) — wanneer een wijziging elders in de aanvraag impact
 * heeft op de premie, toont het bedrag achter `summaryLabel` een 24px
 * Spinner in plaats van het bedrag, 1 seconde lang. Hier vertaald naar
 * intern gedrag: elke wijziging van de `summaryAmount`-prop (na de eerste
 * render) triggert dit automatisch, zodat een consument alleen het nieuwe
 * bedrag hoeft door te geven — geen aparte "aan het herberekenen"-prop
 * nodig.
 */
export function Receipt({
  title,
  description,
  sections,
  defaultActiveSectionId = null,
  emptyMessage = "Vul de gegevens in of kies een product om de verwachte premie te zien.",
  summaryLabel = "Je betaalt per maand",
  summaryAmount,
  summaryInfo,
  showSummaryInfoButton = false,
  onSummaryInfoClick,
  className,
}: ReceiptProps) {
  const [activeSectionId, setActiveSectionId] = useState(defaultActiveSectionId);

  const [isRecalculating, setIsRecalculating] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsRecalculating(true);
    const timeout = setTimeout(() => setIsRecalculating(false), 1000);
    return () => clearTimeout(timeout);
  }, [summaryAmount]);

  return (
    <div className={className ?? "flex w-full flex-col items-start gap-4 overflow-hidden rounded-[3px] bg-white p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]"}>
      <div className="flex w-full flex-col items-start gap-2">
        <p className="w-full font-bold text-[#2a292e] text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
          {title}
        </p>
        {description && (
          <p className="w-full font-[350] text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {description}
          </p>
        )}
      </div>

      <div className="flex w-full items-center">
        {sections.length === 0 ? (
          <div className="flex flex-1 items-start gap-2 px-3">
            <p className="flex-1 text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="flex min-w-px flex-1 flex-col items-start gap-1">
            {sections.map((section) => (
              <SectionAccordion
                key={section.id}
                section={section}
                open={activeSectionId === section.id}
                onToggle={() => setActiveSectionId((current) => (current === section.id ? null : section.id))}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col items-start gap-4 rounded-[3px] bg-[#eef4e3] p-3">
          <div className="flex w-full items-start gap-2">
            <p className="min-w-px flex-1 py-[2px] font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
              {summaryLabel}
            </p>
            {isRecalculating ? (
              <span className="flex shrink-0 items-center justify-end pt-[2px]" aria-live="polite" aria-label="Premie wordt herberekend">
                <Spinner size="md" />
              </span>
            ) : (
              <p className="shrink-0 pt-[2px] text-right font-bold text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                {summaryAmount}
              </p>
            )}
          </div>
          {summaryInfo && (
            <div className="flex w-full items-center gap-1">
              <span className="text-[#2a292e] text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
                {summaryInfo}
              </span>
              {showSummaryInfoButton && (
                <button
                  type="button"
                  onClick={onSummaryInfoClick}
                  className="flex items-center pt-[2px]"
                  aria-label="Meer informatie"
                >
                  <Icon name="popover-info" size="sm" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
