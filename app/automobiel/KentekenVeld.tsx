"use client";

import { Icon } from "@/components/Icon";

type KentekenVeldProps = {
  /** Uniek per veld op de pagina: de hero en de sticky balk hebben er elk één. */
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Breedte e.d. van de buitenste rand, bv. `w-full` of `min-w-0 flex-1`. */
  className?: string;
};

/**
 * Het kentekenveld van de Autoverzekering-pagina: gele vlak (#fff8e3) met
 * 1px rand (#565656), blauw NL-blok links, kenteken gecentreerd in 20px
 * Avenir Heavy. In Figma heeft dit veld geen zichtbaar label, daarom een
 * onzichtbaar label voor schermlezers.
 *
 * Staten uit Figma's "Input Field": hover = 2px zwarte rand (de rand ligt op
 * de lijn, dus 1px erbinnen en 1px erbuiten — hier de bestaande 1px rand plus
 * een schaduw van 1px), actief/gefocust = 1px zwarte rand.
 */
export function KentekenVeld({ id, value, onChange, className }: KentekenVeldProps) {
  return (
    <div
      className={[
        "flex h-[51px] items-center gap-2 rounded-[3px] border border-[#565656] bg-[#fff8e3] py-3 pr-6 pl-px",
        "hover:border-black hover:shadow-[0_0_0_1px_#000] focus-within:border-black focus-within:shadow-none",
        className ?? "w-full",
      ].join(" ")}
    >
      <span className="flex shrink-0 items-center rounded-tl-[1px] rounded-bl-[1px] bg-[#0064a8] px-3 py-2">
        <Icon name="flag-nl-plate" className="inline-flex shrink-0 items-center justify-center" />
      </span>
      <label htmlFor={id} className="sr-only">
        Kenteken
      </label>
      <input
        id={id}
        name="kenteken"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={10}
        className="min-w-0 flex-1 bg-transparent text-center text-[20px] text-black uppercase leading-[1.4] outline-none"
        style={{ fontFamily: "var(--font-avenir-bold)" }}
      />
    </div>
  );
}
