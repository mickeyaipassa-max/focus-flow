"use client";

import { InputFile } from "./InputFile";

const LABEL = "Kies je bestanden";
const DESCRIPTION = "Je bestanden mogen samen niet groter dan 20mb zijn. Zorg dat je bestanden eindigen op .doc, .docx, .jpg of .pdf.";
const ERROR = "Je hebt geen bestand gekozen. Kies een bestand.";

const demoFile = () => [new File(["demo"], "Title.pdf", { type: "application/pdf", lastModified: 0 })];

/**
 * Alle 8 varianten van Figma's "Input File" (drag-and-drop × validation ×
 * file type, telkens met `show files`) naast elkaar, plus een volledig
 * werkende instantie met beperkingen (accept, max. 3 bestanden, 20MB totaal).
 */
export function InputFileDemo() {
  const variants = [false, true].flatMap((dragAndDrop) =>
    [false, true].flatMap((validation) =>
      [false, true].map((large) => ({ dragAndDrop, validation, large })),
    ),
  );

  return (
    <div className="flex flex-wrap items-start gap-10">
      {variants.map(({ dragAndDrop, validation, large }) => (
        <div key={`${dragAndDrop}-${validation}-${large}`} className="w-full max-w-[480px]">
          <InputFile
            labelText={LABEL}
            description={DESCRIPTION}
            dragAndDrop={dragAndDrop}
            fileListLarge={large}
            error={validation ? ERROR : undefined}
            defaultValue={demoFile()}
          />
        </div>
      ))}
      <form className="flex w-full max-w-[480px] flex-col items-start gap-4" onSubmit={(event) => event.preventDefault()}>
        <InputFile
          labelText="Stuur ons foto's van je schade"
          description="Kies maximaal 3 bestanden die samen niet groter dan 20MB zijn. Zorg dat ze eindigen op .jpg, .png of .pdf."
          name="schade"
          required
          dragAndDrop
          multiple
          fileListLarge
          maxFiles={3}
          maxFileSizeTotal={20}
          accept=".jpg,.png,.pdf"
        />
        <button type="submit" className="underline">
          Verstuur
        </button>
      </form>
    </div>
  );
}
