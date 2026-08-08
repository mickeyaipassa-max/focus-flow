"use client";

import { useId } from "react";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";

export type FieldsetCompanyAddressValue = {
  postalCode: string;
  houseNumber: string;
  addition: string;
};

type FieldsetCompanyAddressErrors = Partial<Record<"postalCode" | "houseNumber", string>>;

type AddressFieldProps = {
  id: string;
  name: string;
  labelText: string;
  required: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className: string;
  inputClassName?: string;
};

function AddressField({ id, name, labelText, required, value, onChange, error, className, inputClassName }: AddressFieldProps) {
  return (
    <div className={className}>
      <div className="flex w-full flex-col items-start justify-center gap-1">
        {/* Echte <label htmlFor> i.p.v. een kale div — zelfde toegankelijkheidsupgrade als elders in deze bibliotheek (Label.tsx, RadioGroup, Select), koppelt het label programmatisch aan het veld voor schermlezers. */}
        <label htmlFor={id} className="flex items-center gap-1 text-lg leading-[1.5]">
          <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            {labelText}
          </span>
          {required && (
            <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
              *
            </span>
          )}
        </label>
      </div>
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          "h-[51px] rounded-[3px] border bg-white px-4 py-3 text-black text-lg leading-[1.5] outline-none",
          inputClassName ?? "w-full",
          error ? "border-[#ce0a1e]" : "border-[#565656] focus:border-black",
        ].join(" ")}
        style={{ fontFamily: "var(--font-avenir)" }}
      />
      {error && (
        <div id={`${id}-error`} className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
          <span className="flex shrink-0 items-center pt-[3px]">
            <Icon name="validation-error" size="sm" />
          </span>
          <span className="flex items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}

const EMPTY_VALUE: FieldsetCompanyAddressValue = { postalCode: "", houseNumber: "", addition: "" };

type FieldsetCompanyAddressProps = {
  value?: FieldsetCompanyAddressValue;
  onChange?: (value: FieldsetCompanyAddressValue) => void;
  errors?: FieldsetCompanyAddressErrors;
  /** Figma's vaste helpertekst onder het veldenblok — letterlijk overgenomen, geconfirmeerd op alle 6 geanalyseerde staten van deze funnelstap. */
  helperText?: string;
  /** Toont een spinner i.p.v. `helperText` terwijl de bedrijven op de achtergrond worden opgezocht (automatisch, zodra postcode + huisnummer bekend zijn). */
  isLoading?: boolean;
  /** Tekst naast de spinner tijdens het ophalen. */
  loadingText?: string;
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's samengestelde "Postcode/Huisnummer/Toevoeging"-slot
 * binnen "Jouw bedrijf 1/3 — Bedrijf zoeken" (node 10938:29354, sub-nodes
 * "Input Postal Code" + twee "Input"-velden). Geen los `InputPostalCode`- of
 * `AddressFieldset`-component bestond al in de codebase (bevestigd via
 * codebase-inventarisatie) — wél het gedeelde input-atoompatroon (label + `*`
 * + rode-rand-foutstaat + Validation-bericht) dat `InputEmail`/`FieldsetName`
 * al gebruiken; dat patroon is hier hergebruikt, niet opnieuw uitgevonden.
 *
 * Layout 1:1 uit Figma: Postcode los op een vaste 112px-breedte, daaronder
 * Huisnummer (verplicht) + Toevoeging (niet verplicht) naast elkaar met
 * dezelfde `gap-x-2 gap-y-6`-verhouding als `FieldsetName`. Anders dan
 * `FieldsetName` zijn Huisnummer/Toevoeging hier vaste 160px-velden
 * (`w-[160px]`), niet `flex-1`: Figma toont ze als losse, niet-meegroeiende
 * velden die de resterende kaartbreedte leeg laten — `flex-1` liet ze eerder
 * ten onrechte uitrekken tot de volle breedte van de kaart.
 */
export function FieldsetCompanyAddress({
  value = EMPTY_VALUE,
  onChange,
  errors,
  helperText = "We halen de bedrijfsgegevens automatisch op.",
  isLoading = false,
  loadingText = "Bedrijven worden opgehaald",
  name,
  className,
}: FieldsetCompanyAddressProps) {
  const generatedName = useId();
  const fieldName = name ?? generatedName;

  function set(key: keyof FieldsetCompanyAddressValue, fieldValue: string) {
    onChange?.({ ...value, [key]: fieldValue });
  }

  return (
    <div className={className ?? "flex w-full flex-col items-start gap-4"}>
      <div className="flex w-full flex-col items-start gap-6">
        <AddressField
          id={`${fieldName}-postal-code`}
          name={`${fieldName}-postal-code`}
          labelText="Postcode"
          required
          value={value.postalCode}
          onChange={(v) => set("postalCode", v)}
          error={errors?.postalCode}
          className="flex w-fit flex-col items-start gap-2"
          inputClassName="w-[112px]"
        />
        <div className="flex w-full flex-wrap items-start gap-x-2 gap-y-6">
          <AddressField
            id={`${fieldName}-house-number`}
            name={`${fieldName}-house-number`}
            labelText="Huisnummer"
            required
            value={value.houseNumber}
            onChange={(v) => set("houseNumber", v)}
            error={errors?.houseNumber}
            className="flex w-[160px] max-w-full shrink-0 flex-col items-start gap-2"
          />
          <AddressField
            id={`${fieldName}-addition`}
            name={`${fieldName}-addition`}
            labelText="Toevoeging"
            required={false}
            value={value.addition}
            onChange={(v) => set("addition", v)}
            className="flex w-[160px] max-w-full shrink-0 flex-col items-start gap-2"
          />
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
