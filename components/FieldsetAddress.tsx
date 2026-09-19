"use client";

import { useId } from "react";
import { Icon } from "./Icon";
import { Select, type SelectOption } from "./Select";
import { Spinner } from "./Spinner";

export type FieldsetAddressValue = {
  postalCode: string;
  houseNumber: string;
  addition: string;
};

type FieldsetAddressErrors = Partial<Record<"postalCode" | "houseNumber", string>>;

const EMPTY_VALUE: FieldsetAddressValue = { postalCode: "", houseNumber: "", addition: "" };

type FieldsetAddressProps = {
  value?: FieldsetAddressValue;
  onChange?: (value: FieldsetAddressValue) => void;
  errors?: FieldsetAddressErrors;
  /**
   * Opties voor de Toevoeging-dropdown — geen vaste lijst, want dit hangt af
   * van wat de postcode/huisnummer-lookup teruggeeft (meerdere huizen kunnen
   * dezelfde toevoeging-reeks hebben). Leeg totdat de lookup iets teruggeeft.
   */
  additionOptions?: SelectOption[];
  helperText?: string;
  isLoading?: boolean;
  loadingText?: string;
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Fieldset Address" (node 1:26283-omgeving, "Live
 * event Funnel", instances 1:31580/1:37058 op de Opstal-pagina) — bevestigd
 * via mcp als los, nieuw component: structureel gelijk aan de bestaande
 * `FieldsetCompanyAddress` (Postcode boven, Huisnummer+Toevoeging eronder,
 * helpertekst onder het blok), maar met twee bevestigde verschillen die een
 * aparte adaptatie i.p.v. hergebruik rechtvaardigen:
 * 1. Toevoeging is hier een echte Select-dropdown ("Maak een keuze",
 *    bevestigd via de "Selectbox"-substructuur), niet een tekstveld —
 *    logisch voor een privéadres met meerdere toevoegingen per huisnummer,
 *    anders dan het bedrijfsadres-component.
 * 2. De bevestigde helpertekst is "Straatnaam en plaats worden automatisch
 *    opgehaald" (i.p.v. "We halen de bedrijfsgegevens automatisch op.") en
 *    de laad-tekst "Straatnaam en plaats ophalen" — beide letterlijk uit
 *    Figma overgenomen, dus als eigen defaults i.p.v. een override nodig te
 *    maken op de bedrijfsversie.
 *
 * Figma's component kent daarnaast nog "succes"/"not found"/"manually"-
 * varianten met een checkbox ("handmatig invoeren") en 2 extra tekstvelden —
 * geen van die geneste teksten was zelf ingevuld (letterlijke "Label"/
 * "Checkbox"-placeholders, bevestigd via mcp), dus niet overgenomen. Op déze
 * pagina wordt het succesvol-opgehaalde adres bovendien niet door dit
 * component zelf getoond, maar door een losstaande `CardDetails`-kaart
 * eronder (bevestigd: "Fieldset Address" + "Card Details" staan in Figma als
 * twee losse, opeenvolgende instances) — vandaar dat dit component zelf
 * alleen default/loading afhandelt, niet de succes-weergave.
 */
export function FieldsetAddress({
  value = EMPTY_VALUE,
  onChange,
  errors,
  additionOptions = [],
  helperText = "Straatnaam en plaats worden automatisch opgehaald",
  isLoading = false,
  loadingText = "Straatnaam en plaats ophalen",
  name,
  className,
}: FieldsetAddressProps) {
  const generatedName = useId();
  const fieldName = name ?? generatedName;

  function set(key: keyof FieldsetAddressValue, fieldValue: string) {
    onChange?.({ ...value, [key]: fieldValue });
  }

  return (
    <div className={className ?? "flex w-full flex-col items-start gap-4"}>
      <div className="flex w-full flex-col items-start gap-6">
        <div className="flex w-fit flex-col items-start gap-2">
          <label htmlFor={`${fieldName}-postal-code`} className="flex items-center gap-1 text-lg leading-[1.5]">
            <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
              Postcode
            </span>
            <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
              *
            </span>
          </label>
          <input
            id={`${fieldName}-postal-code`}
            name={`${fieldName}-postal-code`}
            type="text"
            value={value.postalCode}
            onChange={(event) => set("postalCode", event.target.value)}
            aria-invalid={errors?.postalCode ? true : undefined}
            aria-describedby={errors?.postalCode ? `${fieldName}-postal-code-error` : undefined}
            className={[
              "h-[51px] w-[112px] rounded-[3px] border bg-white px-4 py-3 text-black text-lg leading-[1.5] outline-none",
              errors?.postalCode ? "border-[#ce0a1e]" : "border-[#565656] focus:border-black",
            ].join(" ")}
            style={{ fontFamily: "var(--font-avenir)" }}
          />
          {errors?.postalCode && (
            <div id={`${fieldName}-postal-code-error`} className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
              <span className="flex shrink-0 items-center pt-[3px]">
                <Icon name="validation-error" size="sm" />
              </span>
              <span className="flex items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
                {errors.postalCode}
              </span>
            </div>
          )}
        </div>

        <div className="flex w-full flex-wrap items-start gap-x-2 gap-y-6">
          <div className="flex w-[160px] max-w-full shrink-0 flex-col items-start gap-2">
            <label htmlFor={`${fieldName}-house-number`} className="flex items-center gap-1 text-lg leading-[1.5]">
              <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                Huisnummer
              </span>
              <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
                *
              </span>
            </label>
            <input
              id={`${fieldName}-house-number`}
              name={`${fieldName}-house-number`}
              type="text"
              value={value.houseNumber}
              onChange={(event) => set("houseNumber", event.target.value)}
              aria-invalid={errors?.houseNumber ? true : undefined}
              aria-describedby={errors?.houseNumber ? `${fieldName}-house-number-error` : undefined}
              className={[
                "h-[51px] w-full rounded-[3px] border bg-white px-4 py-3 text-black text-lg leading-[1.5] outline-none",
                errors?.houseNumber ? "border-[#ce0a1e]" : "border-[#565656] focus:border-black",
              ].join(" ")}
              style={{ fontFamily: "var(--font-avenir)" }}
            />
            {errors?.houseNumber && (
              <div id={`${fieldName}-house-number-error`} className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
                <span className="flex shrink-0 items-center pt-[3px]">
                  <Icon name="validation-error" size="sm" />
                </span>
                <span className="flex items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
                  {errors.houseNumber}
                </span>
              </div>
            )}
          </div>

          <div className="w-[160px] max-w-full shrink-0">
            <Select
              labelText="Toevoeging"
              required={false}
              options={additionOptions}
              value={value.addition}
              onChange={(v) => set("addition", v)}
              disabled={additionOptions.length === 0}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner size="sm" label={loadingText} labelPosition="horizontal" />
      ) : (
        helperText && (
          <p className="w-full text-[#2a292e] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {helperText}
          </p>
        )
      )}
    </div>
  );
}
