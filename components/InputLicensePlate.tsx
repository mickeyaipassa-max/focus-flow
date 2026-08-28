"use client";

import { Icon } from "./Icon";
import { Spinner } from "./Spinner";

export type VehicleDetails = {
  makeModel: string;
  type: string;
  year: string;
  fuel: string;
};

type InputLicensePlateProps = {
  labelText?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  state?: "default" | "loading" | "succes" | "error";
  /** Verplicht zodra `state="error"` — Figma's eigen tekst is letterlijk "Error message", een placeholder in de bron zelf, dus hier bewust geen default. */
  errorMessage?: string;
  /** Verplicht zodra `state="succes"` en `showCarDetails` niet expliciet false is. */
  vehicle?: VehicleDetails;
  /** Bevestigde Figma-property ("show car-details"), default true. */
  showCarDetails?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Input License Plate" (node 3549:1087, filled ×
 * validation × state=default/loading/succes/error), uit hetzelfde
 * Components-bestand als de rest van onze bibliotheek.
 *
 * Puur presentationeel, net als InputPhone/InputEmail: dit component
 * toont alleen de gegeven `state` — het daadwerkelijke ophalen van
 * voertuiggegevens (de async logica, debounce, 2s-simulatie o.i.d.) hoort
 * bij de pagina die dit component gebruikt, niet hier. Figma specificeert
 * ook geen kenteken-formatteermasker (de "K - 24 - ASR"-weergave is alleen
 * het resultaat, niet het typgedrag) — dus geen zelfbedachte maskeerlogica
 * hier; `value` wordt verbatim getoond zoals meegegeven.
 *
 * Foutstaat hergebruikt letterlijk hetzelfde "Validation"-patroon
 * (bg-[#f8d3dd] + validation-error icoon + tekst) als InputPhone's
 * error-rendering — bevestigd identiek in Figma.
 */
export function InputLicensePlate({
  labelText = "Kenteken",
  required = true,
  value,
  onChange,
  state = "default",
  errorMessage,
  vehicle,
  showCarDetails = true,
  placeholder,
  name,
  id,
  className,
}: InputLicensePlateProps) {
  const isError = state === "error";
  const isLoading = state === "loading";
  const isSucces = state === "succes";

  return (
    <div className={className ?? "flex w-[272px] flex-col items-start gap-2"}>
      <div className="flex items-center gap-1 text-lg leading-[1.5]">
        <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
          {labelText}
        </span>
        {required && (
          <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
            *
          </span>
        )}
      </div>

      <div
        className={[
          "flex h-[51px] w-full max-w-[240px] items-center gap-2 rounded-[3px] border bg-[#fff8e3] py-3 pr-6 pl-px",
          isError ? "border-[#ce0a1e]" : "border-[#565656] focus-within:border-black",
        ].join(" ")}
      >
        <span className="flex shrink-0 items-center gap-1 rounded-tl-[1px] rounded-bl-[1px] bg-[#0064a8] px-3 py-2">
          <Icon name="flag-nl-plate" className="inline-flex shrink-0 items-center justify-center" />
        </span>

        <input
          id={id}
          name={name}
          type="text"
          value={value ?? ""}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 text-center text-[20px] text-black leading-[1.4] outline-none"
          style={{ fontFamily: "var(--font-avenir-bold)" }}
        />
      </div>

      {state === "default" && (
        <p className="text-base leading-[1.5] text-[#2a292e]" style={{ fontFamily: "var(--font-avenir-book)" }}>
          We halen de voertuiggegevens automatisch op.
        </p>
      )}

      {isLoading && (
        <Spinner size="md" labelPosition="horizontal" label="We halen nu de gegevens van je voertuig automatisch op." />
      )}

      {isSucces && showCarDetails && vehicle && (
        <div className="flex w-full max-w-[240px] items-start gap-3 rounded-[3px] bg-[#eef4e3] px-3 py-2">
          <Icon name="pictogram-car" size="lg" />
          <div className="flex flex-1 flex-col items-start gap-2 text-black">
            <div className="flex w-full flex-col text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              <p className="leading-[1.5]">{vehicle.makeModel}</p>
              <p className="leading-[1.5]">{vehicle.type}</p>
            </div>
            <div className="flex w-full flex-wrap items-start gap-x-4 gap-y-2">
              <div className="flex flex-col items-start">
                <p className="text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  Bouwjaar
                </p>
                <p className="text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  {vehicle.year}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  Brandstof
                </p>
                <p className="text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  {vehicle.fuel}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isError && errorMessage && (
        <div className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
          <span className="flex shrink-0 items-center pt-[3px]">
            <Icon name="validation-error" size="sm" />
          </span>
          <span className="flex items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
}
