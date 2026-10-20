"use client";

import { useState } from "react";
import { InputSearch } from "./InputSearch";

const MODELLEN = ["Model 231", "Model 232", "Model 233", "Model 234", "Model 221", "Model 222", "Model 223", "Model 224"].map((label) => ({
  value: label,
  label,
}));

/** Interactieve voorbeelden van `InputSearch` voor de componentenpagina: de vier toestanden uit Figma plus een met resultatenlijst. */
export function InputSearchDemo() {
  const [leeg, setLeeg] = useState("");
  const [gevuld, setGevuld] = useState("Zoekwoord");
  const [metKnop, setMetKnop] = useState("");
  const [metKnopGevuld, setMetKnopGevuld] = useState("Zoekwoord");
  const [resultaat, setResultaat] = useState("");
  const gefilterd = resultaat ? MODELLEN.filter((m) => m.label.toLowerCase().includes(resultaat.toLowerCase())) : [];

  return (
    <div className="flex flex-col items-start gap-6">
      <InputSearch labelText="Zoeken" value={leeg} onChange={setLeeg} />
      <InputSearch labelText="Zoeken" value={gevuld} onChange={setGevuld} />
      <InputSearch labelText="Zoeken" loading value="Loading" />
      <InputSearch labelText="Zoeken" submitButton value={metKnop} onChange={setMetKnop} />
      <InputSearch labelText="Zoeken" submitButton value={metKnopGevuld} onChange={setMetKnopGevuld} />
      <InputSearch labelText="Zoeken met resultaten" description="Typ bijvoorbeeld ‘model’." value={resultaat} onChange={setResultaat} results={gefilterd} />
      <InputSearch labelText="Zoeken" value="" error="Vul een zoekwoord in" />
    </div>
  );
}
