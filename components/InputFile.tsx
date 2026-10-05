"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { DragEvent } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Label } from "./Label";
import { Tag } from "./Tag";
import { Validation } from "./Validation";

type FileMessages = {
  valueMissing: () => string;
  rangeOverflow: (max: number) => string;
  tooLong: (maxTotalMb: number) => string;
  empty: (name: string) => string;
  typeMismatch: (name: string, extension: string, accept: string) => string;
  tooLarge: (name: string, maxMb: number) => string;
  invalidFilename: (name: string) => string;
  duplicate: (name: string) => string;
};

/** Standaardmeldingen van het design system (Zeroheight "Code"-tab, `validation-messages(-file)`; leeg bestand uit de Content-tab). */
const DEFAULT_MESSAGES: FileMessages = {
  valueMissing: () => "Je hebt geen bestand gekozen. Kies een bestand.",
  rangeOverflow: (max) =>
    `Je hebt teveel bestanden gekozen. Zorg ervoor dat je maximaal ${max} ${max === 1 ? "bestand" : "bestanden"} kiest.`,
  tooLong: (maxTotalMb) => `Je bestanden zijn samen te groot. Zorg ervoor dat ze samen niet groter dan ${maxTotalMb}MB zijn. En probeer het opnieuw.`,
  empty: () => "Je bestand is leeg. Kies een bestand met inhoud. En probeer het opnieuw.",
  typeMismatch: (name, extension, accept) =>
    `Je bestand "${name}" eindigt op ${extension}. Zorg ervoor dat je alleen bestanden kiest die eindigen op ${accept}.`,
  tooLarge: (name, maxMb) => `Je bestand "${name}" is te groot. Zorg ervoor dat het niet groter dan ${maxMb}MB is. En probeer het opnieuw.`,
  invalidFilename: (name) => `De bestandsnaam "${name}" bevat ongeldige tekens of is te lang. Hernoem het bestand en probeer het opnieuw.`,
  duplicate: (name) => `Je hebt het bestand "${name}" al gekozen. Kies een ander bestand.`,
};

type InputFileProps = {
  labelText: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  popoverButton?: boolean;
  onPopoverClick?: () => void;
  /** Figma `drag-and-drop`: toont een sleepvlak met de knop erin i.p.v. alleen de knop. */
  dragAndDrop?: boolean;
  /** Figma `file type`: `true` = `file` (grote kaart per bestand), `false` = `file compact` (regel van 40px). */
  fileListLarge?: boolean;
  /** Figma `show files`. Toont de lijst met gekozen bestanden; de lijst verschijnt pas zodra er een bestand is. */
  showFiles?: boolean;
  /** Toont de extensie van het bestand als "(PDF)" (compact) of als tag (groot), zoals in Figma. */
  showFileExtension?: boolean;
  /** Komma-gescheiden extensies en/of MIME-types, zoals het native `accept`-attribuut (bv. ".doc,.docx,.jpg,.pdf" of "image/*"). */
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  /** In MB. */
  maxFileSize?: number;
  /** In MB; alleen relevant bij `multiple`. */
  maxFileSizeTotal?: number;
  /** Reguliere expressie waar de bestandsnaam aan moet voldoen. */
  filenamePattern?: string;
  /** Figma-tekst is "Kies bestanden" (meervoud); het design system documenteert "Kies bestand" voor enkelvoudige uploads. */
  buttonText?: string;
  dropText?: string;
  /** Aangeleverde (server)fout, getoond in dezelfde Validation als de eigen controles. */
  error?: string;
  /** Overschrijf standaardmeldingen. */
  messages?: Partial<FileMessages>;
  name?: string;
  id?: string;
  /** Beginwaarde (ongecontroleerd). */
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  className?: string;
};

function splitName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? { base: name.slice(0, dot), extension: name.slice(dot + 1) } : { base: name, extension: "" };
}

function matchesAccept(file: File, accept: string | undefined) {
  const tokens = (accept ?? "")
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

const sameFile = (a: File, b: File) => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

const MB = 1024 * 1024;

/**
 * Gebaseerd op Figma's "Input File"-component (node 7348:1747, properties
 * `drag-and-drop`, `validation`, `file type`, `show files` = 8 varianten) en
 * "Drag and Drop" (node 7348:1716, states default/hover/active/error), met het
 * gedrag en de API van het design system (`AsrInputFile`, Zeroheight
 * "Input File").
 *
 * Opbouw (8px tussen label en inhoud, 16px tussen invoer en lijst, 8px tussen
 * sleepvlak/knop en melding): `Label` → knop (secundair, compact, upload-icoon)
 * of sleepvlak met de knop erin → `Validation`-meldingen → bestandslijst.
 * Figma's `validation=true` is hier afgeleid: het zit in de state (eigen
 * controles of de `error`-prop), niet in een aparte prop.
 *
 * Sleepvlak: 1px gestippeld gray-660 (default), 2px doorlopend zwart bij hover
 * en tijdens het slepen (Figma: hover en active zijn identiek), 1px gestippeld
 * rood bij een fout. De rand is een overlay (`::after`-patroon) zodat de rand
 * van 1px→2px de afmetingen van het vlak niet verandert.
 *
 * Gedrag: een ongeldig bestand wordt los geweigerd (met melding) terwijl
 * geldige bestanden wel worden toegevoegd; een nieuwe keuze wist eerdere
 * meldingen. Zonder `multiple` vervangt een nieuw bestand het vorige. De
 * gekozen bestanden worden gespiegeld naar een verborgen native
 * `<input type="file" name>` zodat gewone `<form>`-submits ze meesturen en
 * `required` de browser-validatie gebruikt.
 *
 * Bewust niet gebouwd: de sluitbare Validation uit de code (bestaat niet in
 * Figma, daar alleen `closable=false`), voortgangs-/uploadstate (staat niet
 * in de Input File-varianten), de aangepaste lijst via slot, `capture` en
 * `tracking`.
 */
export function InputFile({
  labelText,
  required = false,
  optional = false,
  description,
  popoverButton = false,
  onPopoverClick,
  dragAndDrop = false,
  fileListLarge = false,
  showFiles = true,
  showFileExtension = true,
  accept,
  multiple = false,
  maxFiles,
  maxFileSize,
  maxFileSizeTotal,
  filenamePattern,
  buttonText = "Kies bestanden",
  dropText,
  error,
  messages,
  name,
  id,
  defaultValue,
  onChange,
  className,
}: InputFileProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const pickerId = `${baseId}-picker`;
  const pickerRef = useRef<HTMLInputElement>(null);
  const formInputRef = useRef<HTMLInputElement>(null);
  const triggerWrapRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<File[]>(defaultValue ?? []);
  const [rejections, setRejections] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const text: FileMessages = { ...DEFAULT_MESSAGES, ...messages };
  const shownMessages = [...(error ? [error] : []), ...rejections];
  const hasError = shownMessages.length > 0;
  const effectiveMax = multiple ? maxFiles : 1;

  // Spiegel de bestanden naar het verborgen formulierveld (FormData / `required`).
  useEffect(() => {
    const input = formInputRef.current;
    if (!input) return;
    try {
      const transfer = new DataTransfer();
      for (const file of files) transfer.items.add(file);
      input.files = transfer.files;
    } catch {
      // DataTransfer-constructor niet beschikbaar: het zichtbare gedrag blijft werken.
    }
  }, [files]);

  function focusTrigger() {
    triggerWrapRef.current?.querySelector<HTMLElement>("button")?.focus();
  }

  function addFiles(incoming: File[]) {
    if (incoming.length === 0) return;
    const nextRejections: string[] = [];
    const accepted: File[] = [];
    const current = multiple ? files : [];
    let total = current.reduce((sum, file) => sum + file.size, 0);
    let overflowReported = false;
    let tooLongReported = false;
    const pattern = filenamePattern ? new RegExp(`^(?:${filenamePattern})$`) : null;

    for (const file of incoming) {
      if (!multiple && accepted.length >= 1) {
        if (!overflowReported) nextRejections.push(text.rangeOverflow(1));
        overflowReported = true;
        continue;
      }
      if (file.size === 0) {
        nextRejections.push(text.empty(file.name));
      } else if (!matchesAccept(file, accept)) {
        const { extension } = splitName(file.name);
        nextRejections.push(text.typeMismatch(file.name, extension ? `.${extension}` : "geen extensie", accept ?? ""));
      } else if (maxFileSize !== undefined && file.size > maxFileSize * MB) {
        nextRejections.push(text.tooLarge(file.name, maxFileSize));
      } else if (pattern && !pattern.test(file.name)) {
        nextRejections.push(text.invalidFilename(file.name));
      } else if ([...current, ...accepted].some((existing) => sameFile(existing, file))) {
        nextRejections.push(text.duplicate(file.name));
      } else if (effectiveMax !== undefined && current.length + accepted.length >= effectiveMax) {
        if (!overflowReported) nextRejections.push(text.rangeOverflow(effectiveMax));
        overflowReported = true;
      } else if (maxFileSizeTotal !== undefined && total + file.size > maxFileSizeTotal * MB) {
        if (!tooLongReported) nextRejections.push(text.tooLong(maxFileSizeTotal));
        tooLongReported = true;
      } else {
        accepted.push(file);
        total += file.size;
      }
    }

    setRejections(nextRejections);
    if (accepted.length === 0) return;
    const next = multiple ? [...current, ...accepted] : accepted;
    setFiles(next);
    onChange?.(next);
    setStatus(
      accepted.length === 1 ? `Bestand '${accepted[0].name}' gekozen` : `${accepted.length} bestanden gekozen`,
    );
  }

  function removeFile(index: number) {
    const removed = files[index];
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    setRejections([]);
    onChange?.(next);
    setStatus(`Bestand '${removed.name}' verwijderd`);
    focusTrigger();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  const trigger = (
    <Button type="secondary" compact iconPrepend="upload-md" onClick={() => pickerRef.current?.click()}>
      {buttonText}
    </Button>
  );

  const borderClass = dragOver
    ? "border-2 border-solid border-black"
    : hasError
      ? "border border-dashed border-[#ce0a1e]"
      : "border border-dashed border-[#565656] group-hover:border-2 group-hover:border-solid group-hover:border-black";

  return (
    <div className={className ?? "flex w-full max-w-[480px] flex-col items-start gap-2"}>
      <Label
        labelText={labelText}
        required={required}
        optional={optional}
        description={description}
        popoverButton={popoverButton}
        onPopoverClick={onPopoverClick}
        htmlFor={pickerId}
      />

      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full flex-col items-start">
          <div ref={triggerWrapRef} className="w-full">
            {dragAndDrop ? (
              <div
                className="group relative flex w-full max-w-[480px] flex-col items-center justify-center gap-6 rounded-[3px] bg-white px-6 py-8"
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragOver(false);
                }}
                onDrop={handleDrop}
              >
                <span aria-hidden className={`pointer-events-none absolute inset-0 rounded-[3px] ${borderClass}`} />
                <p className="w-full text-center text-[#565656] text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                  {dropText ?? `Sleep bestanden naar dit vlak. Of gebruik de knop '${buttonText}'.`}
                </p>
                {trigger}
              </div>
            ) : (
              <div className="w-fit">{trigger}</div>
            )}
          </div>

          <div aria-live="polite" className="flex w-full flex-col items-start gap-2 not-empty:mt-2">
            {shownMessages.map((message) => (
              <Validation key={message} message={message} />
            ))}
          </div>
        </div>

        {showFiles && files.length > 0 && (
          <ul className={fileListLarge ? "flex w-full flex-col gap-2" : "flex w-full flex-col"}>
            {files.map((file, index) => {
              const { base, extension } = splitName(file.name);
              const title = showFileExtension && extension ? base : file.name;
              const removeButton = (
                <Button type="tertiary" compact iconOnly iconPrepend="delete" ariaLabel={`Verwijder ${file.name}`} onClick={() => removeFile(index)} />
              );

              if (!fileListLarge) {
                return (
                  <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex w-full items-center gap-2 rounded-[3px]">
                    <div className="flex min-w-px flex-1 items-center gap-2 py-2">
                      <Icon name="file-md" size="md" />
                      <p className="flex min-w-0 flex-wrap items-center gap-x-1 text-center" style={{ overflowWrap: "anywhere" }}>
                        <span className="text-black text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                          {title}
                        </span>
                        {showFileExtension && extension && (
                          <span className="text-[#565656] text-sm leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                            ({extension.toUpperCase()})
                          </span>
                        )}
                      </p>
                    </div>
                    {removeButton}
                  </li>
                );
              }

              return (
                <li
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  // 11px/15px i.p.v. 12px/16px: Figma's rand ligt binnen het kader, de CSS-rand van 1px erbuiten.
                  className="flex w-full items-center gap-3 rounded-md border border-[rgba(0,0,0,0.12)] bg-white px-[15px] py-[11px]"
                >
                  <span className="flex shrink-0 items-center justify-center rounded-full bg-[#f6f6f7] p-3">
                    <Icon name="file-md" size="md" />
                  </span>
                  <div className="flex min-w-px flex-1 items-center gap-4 pr-2">
                    <p className="min-w-[112px] flex-1 text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)", overflowWrap: "anywhere" }}>
                      {title}
                    </p>
                    {showFileExtension && extension && <Tag text={extension.toUpperCase()} />}
                  </div>
                  <span aria-hidden className="w-px self-stretch bg-[rgba(0,0,0,0.08)]" />
                  {removeButton}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Picker: leegt zichzelf na elke keuze, zodat hetzelfde bestand opnieuw gekozen kan worden. */}
      <input
        ref={pickerRef}
        id={pickerId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          addFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      {/* Formulierveld: spiegelt de gekozen bestanden voor FormData en `required`. */}
      <input
        ref={formInputRef}
        type="file"
        name={name}
        multiple={multiple}
        required={required && files.length === 0}
        aria-hidden
        tabIndex={-1}
        className="sr-only"
        onInvalid={(event) => {
          event.preventDefault();
          setRejections([text.valueMissing()]);
          focusTrigger();
        }}
        onChange={() => {}}
      />
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  );
}
