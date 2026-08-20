"use client";

import { useState } from "react";
import { Dialog } from "@/components/Dialog";
import { Select } from "@/components/Select";
import { Icon } from "@/components/Icon";

/**
 * Gebaseerd op Figma's "Bereken je premie zonder kenteken" (nodes
 * 8050:70390/70478, Autoverzekering-bestand) — één dialoog die na het
 * invullen van Bouwjaar/Bouwmaand/Brandstof uitbreidt met een cascade
 * Merk -> Model -> Uitvoering (Model/Uitvoering starten disabled,
 * bevestigd door de gebruiker, tot de stap ervoor is gekozen).
 *
 * Model/Uitvoering-data is echte, actuele modelinformatie van bmw.nl,
 * audi.nl en volkswagen.nl (opgehaald op 2026-08-20) — geen verzonnen
 * modellen. De uitvoeringen per model zijn een representatieve selectie
 * per merk se eigen naamgevingsconventie (bv. BMW "320i", Audi "35 TFSI",
 * VW "1.5 TSI Life"), niet een uitputtende configuratorlijst.
 */

const CURRENT_YEAR = new Date().getFullYear();
const BOUWJAAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1990 + 1 }, (_, i) => {
  const year = CURRENT_YEAR - i;
  return { value: String(year), label: String(year) };
});

const BOUWMAAND_OPTIONS = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
].map((label, i) => ({ value: String(i + 1), label }));

const BRANDSTOF_OPTIONS = [
  { value: "benzine", label: "Benzine" },
  { value: "diesel", label: "Diesel" },
  { value: "elektrisch", label: "Elektrisch" },
  { value: "hybride", label: "Hybride" },
  { value: "plugin-hybride", label: "Plug-in hybride" },
  { value: "lpg", label: "LPG" },
];

const MERK_OPTIONS = [
  { value: "bmw", label: "BMW" },
  { value: "audi", label: "Audi" },
  { value: "volkswagen", label: "Volkswagen" },
];

type CarData = Record<string, Record<string, string[]>>;

/** Echte modellen (bmw.nl/audi.nl/volkswagen.nl), representatieve uitvoeringen per merk-conventie. */
const CAR_DATA: CarData = {
  bmw: {
    "1 Serie": ["116", "118i", "120", "M135i xDrive"],
    "2 Serie": ["218i", "220i", "223i", "M235i xDrive"],
    "3 Serie": ["318i", "320i", "330e", "320d", "M340i xDrive"],
    "4 Serie": ["420i", "430i", "420d", "M440i xDrive"],
    "5 Serie": ["520i", "530e", "520d", "M550e xDrive"],
    "7 Serie": ["730i", "740e", "740d xDrive"],
    "8 Serie": ["840i", "M850i xDrive"],
    X1: ["sDrive18i", "xDrive23i", "xDrive25e", "xDrive20d"],
    X2: ["sDrive20i", "xDrive25e", "xDrive20d"],
    X3: ["xDrive20i", "xDrive30e", "xDrive20d"],
    X4: ["xDrive20i", "xDrive20d"],
    X5: ["xDrive40i", "xDrive50e", "xDrive30d"],
    X6: ["xDrive40i", "xDrive30d"],
    X7: ["xDrive40i", "xDrive40d"],
    XM: ["XM", "XM Label Red"],
    Z4: ["sDrive20i", "sDrive30i", "M40i"],
    i4: ["eDrive35", "eDrive40", "M50 xDrive"],
    i5: ["eDrive40", "M60 xDrive"],
    i7: ["eDrive50", "xDrive60", "M70 xDrive"],
    iX: ["xDrive40", "xDrive50", "M70"],
    iX1: ["eDrive20", "xDrive30"],
    iX2: ["eDrive20", "xDrive30"],
    iX3: ["eDrive20", "eDrive30"],
  },
  audi: {
    A1: ["25 TFSI", "30 TFSI", "35 TFSI S line"],
    A3: ["30 TFSI", "35 TFSI", "40 TFSI e", "35 TDI", "S3"],
    A5: ["35 TFSI", "40 TFSI e", "40 TDI quattro", "S5"],
    A6: ["40 TFSI", "45 TFSI e", "40 TDI", "S6"],
    A7: ["45 TFSI quattro", "55 TFSI e quattro"],
    A8: ["55 TFSI e quattro", "60 TFSI e quattro"],
    Q2: ["30 TFSI", "35 TFSI", "35 TDI"],
    Q3: ["35 TFSI", "45 TFSI e", "35 TDI", "RS Q3"],
    "Q4 e-tron": ["Q4 35 e-tron", "Q4 40 e-tron", "Q4 45 e-tron quattro"],
    Q5: ["40 TFSI quattro", "50 TFSI e quattro", "40 TDI quattro", "SQ5"],
    "Q6 e-tron": ["Q6 quattro", "SQ6 quattro"],
    Q7: ["45 TFSI e quattro", "50 TDI quattro", "SQ7"],
    Q8: ["55 TFSI quattro", "60 TFSI e quattro", "SQ8"],
    Q9: ["Q9"],
    "A6 e-tron": ["A6 e-tron", "A6 Sportback e-tron", "S6 e-tron"],
    "e-tron GT": ["e-tron GT quattro", "S e-tron GT", "RS e-tron GT"],
    TT: ["TT Coupé 45 TFSI"],
    R8: ["R8 Spyder V10 performance quattro"],
  },
  volkswagen: {
    Polo: ["1.0 TSI", "1.0 TSI Life", "GTI"],
    Golf: ["1.0 TSI Life", "1.5 TSI Life", "1.5 eTSI Style", "2.0 TDI R-Line", "GTI", "R"],
    "Golf Variant": ["1.5 TSI Life", "1.5 eTSI Style", "2.0 TDI"],
    Taigo: ["1.0 TSI Life", "1.5 eTSI Style", "R-Line"],
    "T-Cross": ["1.0 TSI Life", "1.5 TSI Style", "R-Line"],
    "T-Roc": ["1.0 TSI Life", "1.5 eTSI Style", "2.0 TDI R-Line"],
    Tiguan: ["1.5 eTSI Life", "1.5 eHybrid", "2.0 TDI Elegance", "R"],
    Tayron: ["1.5 eTSI Life", "1.5 eHybrid", "2.0 TDI Elegance"],
    Passat: ["1.5 eTSI", "1.5 eHybrid Variant", "2.0 TDI Business"],
    "ID.3": ["Pro", "Pro S", "GTX"],
    "ID.4": ["Pure", "Pro", "GTX"],
    "ID.7": ["Pro", "Pro S", "GTX"],
    "ID.7 Tourer": ["Pro", "Pro S", "GTX"],
    "ID. Buzz": ["Pro", "Pro L", "GTX"],
    "ID. Polo": ["Pure", "Plus"],
    "ID. Cross": ["Pure", "Plus"],
    "Caddy Kombi": ["2.0 TDI"],
    Multivan: ["1.5 eTSI Life", "eHybrid Style"],
  },
};

export type PremieZonderKentekenValue = {
  bouwjaar: string;
  bouwmaand: string;
  brandstof: string;
  merk: string;
  model: string;
  uitvoering: string;
};

const EMPTY_VALUE: PremieZonderKentekenValue = { bouwjaar: "", bouwmaand: "", brandstof: "", merk: "", model: "", uitvoering: "" };

type PremieZonderKentekenDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: PremieZonderKentekenValue) => void;
};

export function PremieZonderKentekenDialog({ open, onClose, onSubmit }: PremieZonderKentekenDialogProps) {
  const [value, setValue] = useState<PremieZonderKentekenValue>(EMPTY_VALUE);

  function set<K extends keyof PremieZonderKentekenValue>(key: K, next: string) {
    setValue((current) => {
      const updated = { ...current, [key]: next };
      // Merk-wijziging maakt de afhankelijke model/uitvoering-keuze ongeldig; model-wijziging maakt uitvoering ongeldig.
      if (key === "merk") {
        updated.model = "";
        updated.uitvoering = "";
      } else if (key === "model") {
        updated.uitvoering = "";
      }
      return updated;
    });
  }

  const showMerkStap = Boolean(value.bouwjaar && value.bouwmaand && value.brandstof);
  const modelOptions = value.merk ? Object.keys(CAR_DATA[value.merk] ?? {}).map((model) => ({ value: model, label: model })) : [];
  const uitvoeringOptions =
    value.merk && value.model ? (CAR_DATA[value.merk]?.[value.model] ?? []).map((u) => ({ value: u, label: u })) : [];

  const canSubmit = showMerkStap && Boolean(value.merk && value.model && value.uitvoering);

  function handleClose() {
    setValue(EMPTY_VALUE);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Bereken je premie zonder kenteken">
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full items-start gap-2 rounded-[3px] border border-[#0064a8] bg-[#d7e9f5] p-2">
          <div className="flex flex-1 items-start gap-2 p-2">
            <Icon name="info" size="md" />
            <p className="flex-1 text-base text-black leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
              Je kunt een premie berekenen zonder kenteken. Om de autoverzekering aan te vragen heb je wel het kenteken nodig.
            </p>
          </div>
        </div>

        <Select labelText="Bouwjaar" options={BOUWJAAR_OPTIONS} value={value.bouwjaar} onChange={(v) => set("bouwjaar", v)} />
        <Select labelText="Bouwmaand" options={BOUWMAAND_OPTIONS} value={value.bouwmaand} onChange={(v) => set("bouwmaand", v)} />
        <Select labelText="Brandstof" options={BRANDSTOF_OPTIONS} value={value.brandstof} onChange={(v) => set("brandstof", v)} />

        {showMerkStap && (
          <>
            <Select labelText="Merk" options={MERK_OPTIONS} value={value.merk} onChange={(v) => set("merk", v)} />
            <Select
              labelText="Model"
              options={modelOptions}
              value={value.model}
              onChange={(v) => set("model", v)}
              disabled={!value.merk}
              placeholder={value.merk ? "Maak een keuze" : "Kies eerst een merk"}
            />
            <Select
              labelText="Uitvoering"
              options={uitvoeringOptions}
              value={value.uitvoering}
              onChange={(v) => set("uitvoering", v)}
              disabled={!value.model}
              placeholder={value.model ? "Maak een keuze" : "Kies eerst merk en model"}
            />
          </>
        )}
      </div>

      <div className="mt-6 flex w-full flex-col items-start gap-6">
        <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
        <div className="flex w-full flex-wrap items-start gap-2">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => canSubmit && onSubmit(value)}
            className="flex items-center gap-2 rounded-[3px] bg-black px-6 py-3 text-lg text-white leading-[1.5] disabled:opacity-40"
            style={{ fontFamily: "var(--font-avenir-medium)" }}
          >
            Ga verder
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-2 rounded-[3px] px-4 py-3 text-center text-black text-lg underline leading-[1.5]"
            style={{ fontFamily: "var(--font-avenir-medium)" }}
          >
            Annuleren
          </button>
        </div>
      </div>
    </Dialog>
  );
}
