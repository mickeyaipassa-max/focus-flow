"use client";

import { useId } from "react";
import { Icon } from "./Icon";
import { RadioGroup } from "./RadioGroup";

export type EmployeeValue = {
  gender: "man" | "vrouw" | "";
  birthYear: string;
  employment: "vast" | "tijdelijk" | "";
  salary: string;
};

export type EmployeeErrors = Partial<Record<keyof EmployeeValue, string>>;

export const EMPTY_EMPLOYEE: EmployeeValue = { gender: "", birthYear: "", employment: "", salary: "" };

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <div id={id} className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
      <span className="flex shrink-0 items-center pt-[3px]">
        <Icon name="validation-error" size="sm" />
      </span>
      <span className="flex items-center pt-[2px] text-black text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir)" }}>
        {message}
      </span>
    </div>
  );
}

type EmployeeFieldsetProps = {
  /** 1-indexed volgnummer, voor het label "Medewerker N" en unieke veld-id's. */
  index: number;
  value: EmployeeValue;
  onChange: (value: EmployeeValue) => void;
  onRemove?: () => void;
  errors?: EmployeeErrors;
  name?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's herziene "Card Details" (node 10938:30216) — een door
 * de gebruiker aangepaste opzet t.o.v. de eerdere versie (10938:29664).
 * Belangrijkste structuurwijziging: avatar + titel + verwijderknop staan nu
 * op hun EIGEN rij bovenaan de kaart (avatar 32px, niet 48px, en
 * `items-center` i.p.v. `items-start`), met de veldenrijen daaronder over de
 * VOLLE kaartbreedte — niet langer ingeklemd naast een avatar-kolom. Dat is
 * precies wat het eerdere breedteprobleem oploste: Dienstverband+Loon delen
 * niet langer breedte met de avatar/verwijderknop-kolom, dus is er nu wél
 * genoeg ruimte voor het "Loon voor werknemersverzekeringen"-label om op 1
 * regel te blijven bij normale kaartbreedtes.
 *
 * Geslacht/Dienstverband hergebruiken nog steeds de bestaande `RadioGroup`
 * (horizontal variant) rechtstreeks — dat onderdeel is ongewijzigd t.o.v.
 * Figma's vorige versie.
 */
export function FieldsetEmployee({ index, value, onChange, onRemove, errors, name, className }: EmployeeFieldsetProps) {
  const generatedName = useId();
  const fieldName = name ?? `${generatedName}-medewerker-${index}`;
  const birthYearId = `${fieldName}-birth-year`;
  const salaryId = `${fieldName}-salary`;

  function set<K extends keyof EmployeeValue>(key: K, fieldValue: EmployeeValue[K]) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <div className={className ?? "flex w-full flex-col items-start gap-4 rounded-[3px] border border-[#ccc] bg-white p-6"}>
      <div className="flex w-full items-center gap-4">
        <div className="flex min-w-px flex-1 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center">
            <img src="/icons/person.svg" alt="" className="size-8" />
          </span>
          <p className="min-w-px flex-1 font-bold text-black text-xl leading-[1.4]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            Medewerker {index}
          </p>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex shrink-0 items-center justify-center gap-2 rounded-[3px]"
            aria-label={`Medewerker ${index} verwijderen`}
          >
            <Icon name="delete" size="md" />
          </button>
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full flex-wrap items-start gap-x-6 gap-y-2">
          <RadioGroup
            labelText="Geslacht"
            horizontal
            options={[
              { value: "man", label: "Man" },
              { value: "vrouw", label: "Vrouw" },
            ]}
            value={value.gender}
            onChange={(v) => set("gender", v as EmployeeValue["gender"])}
            error={errors?.gender}
            name={`${fieldName}-gender`}
            className="flex w-[224px] flex-col items-start gap-2"
          />

          <div className="flex min-w-[160px] flex-1 flex-col items-start gap-2">
            <label htmlFor={birthYearId} className="flex items-center gap-1 text-lg leading-[1.5]">
              <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                Geboortejaar
              </span>
              <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
                *
              </span>
            </label>
            <input
              id={birthYearId}
              name={`${fieldName}-birth-year`}
              type="text"
              inputMode="numeric"
              value={value.birthYear}
              onChange={(event) => set("birthYear", event.target.value)}
              aria-invalid={errors?.birthYear ? true : undefined}
              aria-describedby={errors?.birthYear ? `${birthYearId}-error` : undefined}
              className={[
                "h-[51px] w-full max-w-[160px] rounded-[3px] border bg-white px-4 py-3 text-black text-lg leading-[1.5] outline-none",
                errors?.birthYear ? "border-[#ce0a1e]" : "border-[#565656] focus:border-black",
              ].join(" ")}
              style={{ fontFamily: "var(--font-avenir)" }}
            />
            {errors?.birthYear && <FieldError id={`${birthYearId}-error`} message={errors.birthYear} />}
          </div>
        </div>

        {/*
          Dienstverband (Figma: `w-fit`, hier content-breedte via RadioGroup's
          eigen `horizontal`-default) + Loon-kolom (`flex-1`, GEEN `min-w-0` —
          dat zou de kolom laten "passen" terwijl het label erin alsnog
          overloopt). Het label blijft `shrink-0 whitespace-nowrap`: zijn ware
          minimumbreedte bepaalt via de browser of de rij op 1 regel past, of
          volledig wrapt naar de volgende regel. Nu de velden de volle
          kaartbreedte hebben (niet meer naast de avatar-kolom ingeklemd)
          past dit bij normale kaartbreedtes gewoon op 1 regel; bij een echt
          smalle kaart (bv. 1200px viewport, waar de sidebar ernaast komt)
          wrapt de hele Loon-kolom veilig naar een nieuwe regel, zonder ooit
          de kaart te laten overflowen.
        */}
        <div className="flex w-full flex-wrap items-start gap-x-6 gap-y-2">
          <RadioGroup
            labelText="Dienstverband"
            horizontal
            options={[
              { value: "vast", label: "Vast" },
              { value: "tijdelijk", label: "Tijdelijk" },
            ]}
            value={value.employment}
            onChange={(v) => set("employment", v as EmployeeValue["employment"])}
            error={errors?.employment}
            name={`${fieldName}-employment`}
          />

          <div className="flex flex-1 flex-col items-start gap-2">
            <div className="flex w-full items-center gap-1">
              <label htmlFor={salaryId} className="flex shrink-0 items-center gap-1 whitespace-nowrap text-lg leading-[1.5]">
                <span className="font-bold text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                  Loon voor werknemersverzekeringen
                </span>
                <span className="text-[#ce0a1e]" style={{ fontFamily: "var(--font-avenir)" }}>
                  *
                </span>
              </label>
              <button type="button" className="flex size-6 shrink-0 items-center justify-center rounded-[3px] p-3" aria-label="Meer informatie over loon voor werknemersverzekeringen">
                <Icon name="popover-info" size="sm" />
              </button>
            </div>
            <div
              className={[
                "flex h-[51px] w-full max-w-[480px] items-center gap-2 rounded-[3px] border bg-white px-4 py-3",
                errors?.salary ? "border-[#ce0a1e]" : "border-[#565656] focus-within:border-black",
              ].join(" ")}
            >
              <img src="/icons/euro.svg" alt="" className="size-4 shrink-0" />
              <input
                id={salaryId}
                name={`${fieldName}-salary`}
                type="text"
                inputMode="decimal"
                value={value.salary}
                onChange={(event) => set("salary", event.target.value)}
                aria-invalid={errors?.salary ? true : undefined}
                aria-describedby={errors?.salary ? `${salaryId}-error` : undefined}
                className="min-w-px flex-1 text-black text-lg leading-[1.5] outline-none"
                style={{ fontFamily: "var(--font-avenir)" }}
              />
            </div>
            {errors?.salary && <FieldError id={`${salaryId}-error`} message={errors.salary} />}
          </div>
        </div>
      </div>
    </div>
  );
}
