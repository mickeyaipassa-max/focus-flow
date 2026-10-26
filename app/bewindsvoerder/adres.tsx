"use client";

import { useEffect, useState } from "react";
import { CardDetails } from "@/components/CardDetails";
import { Checkbox } from "@/components/Checkbox";
import { FieldsetAddress } from "@/components/FieldsetAddress";
import { Input } from "@/components/Input";
import type { SelectOption } from "@/components/Select";

/*
 * Adres met automatisch ophalen van straatnaam en plaats, naar de Figma-schermen "– adres laden",
 * "– adres opgehaald", "– adres niet gevonden" en "– adres handmatig" (en het gedrag op asr.nl):
 * zodra postcode en huisnummer geldig zijn, wordt het adres opgezocht. Gevonden: de kaart "Deze gegevens
 * hebben we opgehaald" onder de velden. Niet gevonden: melding + "Handmatig de straatnaam en plaats invoeren".
 *
 * Bron: de openbare PDOK Locatieserver (BAG-adressen). De BAG-dienst van asr.nl is intern en niet bedoeld
 * voor deze site.
 */

export type AdresWaarde = {
  postcode: string;
  huisnummer: string;
  toevoeging: string;
  straat: string;
  plaats: string;
  handmatig: boolean;
  gevonden: boolean;
};

export type AdresFouten = Partial<Record<"postcode" | "huisnummer" | "straat" | "plaats", string>>;

export const ADRES_ONBEKEND =
  "De combinatie van postcode en huisnummer is onbekend. Controleer of je de juiste gegevens invult en probeer opnieuw.";

const POSTCODE = /^\d{4} ?[a-zA-Z]{2}$/;
const PDOK = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free";

type Status = "leeg" | "laden" | "gevonden" | "niet-gevonden";
type PdokAdres = { straatnaam: string; woonplaatsnaam: string; huisnummer: number; huisletter?: string; huisnummertoevoeging?: string };

export function isOpzoekbaar(postcode: string, huisnummer: string) {
  const n = Number(huisnummer.trim());
  return POSTCODE.test(postcode.trim()) && /^\d+$/.test(huisnummer.trim()) && n >= 1 && n <= 99999;
}

/** "A", "1" of "A-1": huisletter en huisnummertoevoeging zoals ze achter het huisnummer staan. */
function toevoegingVan(adres: PdokAdres) {
  return [adres.huisletter, adres.huisnummertoevoeging].filter(Boolean).join("-");
}

/** "Archimedeslaan 10A" — gedeeld met de samenvatting. */
export function straatEnHuisnummer(a: Pick<AdresWaarde, "straat" | "huisnummer" | "toevoeging">) {
  const toevoeging = a.toevoeging.trim();
  const scheiding = /^\d/.test(toevoeging) ? "-" : "";
  return `${a.straat.trim()} ${a.huisnummer.trim()}${toevoeging ? scheiding + toevoeging : ""}`.trim();
}

export function AdresBlok({
  waarde,
  fouten,
  onChange,
}: {
  waarde: AdresWaarde;
  fouten: AdresFouten;
  onChange: (update: Partial<AdresWaarde>) => void;
}) {
  const [status, setStatus] = useState<Status>("leeg");
  const [toevoegingen, setToevoegingen] = useState<SelectOption[]>([]);
  const { postcode, huisnummer, handmatig } = waarde;

  useEffect(() => {
    if (handmatig) return;
    if (!isOpzoekbaar(postcode, huisnummer)) {
      setStatus("leeg");
      setToevoegingen([]);
      return;
    }
    setStatus("laden");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const q = `postcode:${postcode.replace(/\s/g, "").toUpperCase()} and huisnummer:${Number(huisnummer)}`;
      const url = `${PDOK}?q=${encodeURIComponent(q)}&fq=type:adres&rows=50&fl=straatnaam,woonplaatsnaam,huisnummer,huisletter,huisnummertoevoeging`;
      try {
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        const adressen: PdokAdres[] = (data?.response?.docs ?? []).filter((d: PdokAdres) => d.huisnummer === Number(huisnummer));
        if (!adressen.length) throw new Error("niet gevonden");
        const opties = [...new Set(adressen.map(toevoegingVan).filter(Boolean))].map((t) => ({ value: t, label: t }));
        setToevoegingen(opties);
        setStatus("gevonden");
        onChange({ gevonden: true, straat: adressen[0].straatnaam, plaats: adressen[0].woonplaatsnaam });
      } catch (error) {
        if (controller.signal.aborted) return;
        setToevoegingen([]);
        setStatus("niet-gevonden");
        onChange({ gevonden: false, straat: "", plaats: "" });
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // `onChange` verandert bij elke render van de ouder; opnieuw zoeken hoort alleen bij een ander adres.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postcode, huisnummer, handmatig]);

  const nietGevonden = status === "niet-gevonden" && !handmatig;

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <FieldsetAddress
        className="flex w-full max-w-[400px] flex-col items-start gap-4"
        value={{ postalCode: postcode, houseNumber: huisnummer, addition: waarde.toevoeging }}
        errors={{ postalCode: fouten.postcode, houseNumber: fouten.huisnummer }}
        onChange={(v) => onChange({ postcode: v.postalCode, huisnummer: v.houseNumber, toevoeging: v.addition })}
        additionOptions={toevoegingen}
        additionAsText={handmatig}
        isLoading={status === "laden" && !handmatig}
        helperText={status === "leeg" && !handmatig ? undefined : ""}
        notFoundMessage={nietGevonden && !fouten.huisnummer ? ADRES_ONBEKEND : undefined}
      />

      {(nietGevonden || handmatig) && (
        <Checkbox
          label="Handmatig de straatnaam en plaats invoeren"
          checked={handmatig}
          onChange={(checked) => onChange({ handmatig: checked, straat: "", plaats: "", gevonden: false })}
        />
      )}

      {handmatig && (
        <div className="flex w-full max-w-[400px] flex-col items-start gap-6">
          <Input
            labelText="Straatnaam"
            className="flex w-full flex-col items-start gap-2"
            autoComplete="address-line1"
            value={waarde.straat}
            error={fouten.straat}
            onChange={(straat) => onChange({ straat })}
          />
          <Input
            labelText="Plaats"
            className="flex w-full flex-col items-start gap-2"
            autoComplete="address-level2"
            value={waarde.plaats}
            error={fouten.plaats}
            onChange={(plaats) => onChange({ plaats })}
          />
        </div>
      )}

      {status === "gevonden" && !handmatig && (
        <CardDetails
          title="Deze gegevens hebben we opgehaald"
          cardActionEdit={false}
          rows={[
            { label: "Straat en huisnummer", value: straatEnHuisnummer(waarde) },
            { label: "Plaats", value: waarde.plaats },
          ]}
        />
      )}
    </div>
  );
}
