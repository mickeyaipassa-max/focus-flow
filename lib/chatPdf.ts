/**
 * PDF-export van een AI-chatgesprek ("Download als PDF" in het chatmenu).
 *
 * Draait volledig in de browser met jsPDF (alleen geladen via `import()` op
 * het moment dat iemand daadwerkelijk downloadt — het zit dus niet in de
 * pagina-bundel). Er gaat uitsluitend zichtbare gesprekstekst in het bestand:
 * rol, tekst en eventuele bronnen — geen ids, tokens of andere interne data.
 *
 * Opmaak is bewust zelf gelegd (woord voor woord) i.p.v. via `splitTextToSize`,
 * zodat links ook midden in een zin klikbaar blijven, lange gesprekken netjes
 * over meerdere A4-pagina's lopen en niets wordt afgesneden.
 */

export type ChatSource = {
  title: string;
  url?: string;
};

export type ChatPdfMessage = {
  role: "user" | "assistant";
  text: string;
  /** Bronnen/citaten die bij dit AI-antwoord horen; worden direct onder dat antwoord genoemd. */
  sources?: ChatSource[];
};

export type ChatPdfResult = {
  blob: Blob;
  filename: string;
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 20;
const MARGIN_TOP = 22;
const MARGIN_BOTTOM = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const BAR_WIDTH = 1.2;
const TEXT_INDENT = 5;
const BODY_SIZE = 11;
const BODY_LINE = 5.4;
const SMALL_SIZE = 9.5;
const SMALL_LINE = 4.6;
const LIST_INDENT = 5;

const COLOR_TEXT: [number, number, number] = [0, 0, 0];
const COLOR_MUTED: [number, number, number] = [86, 86, 86];
const COLOR_LINK: [number, number, number] = [0, 100, 168];
const COLOR_USER: [number, number, number] = [15, 134, 93];
const COLOR_ASSISTANT: [number, number, number] = [237, 165, 15];
const COLOR_RULE: [number, number, number] = [214, 214, 214];

/** Tekens die in de standaard PDF-lettertypen (Windows-1252) bestaan buiten Latin-1. */
const WIN_ANSI_EXTRA = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ");

/**
 * Standaard PDF-lettertypen kennen alleen Windows-1252. Alles daarbuiten
 * (emoji, speciale spaties, onzichtbare tekens) wordt vervangen of weggelaten
 * i.p.v. als rommel in het bestand te belanden.
 */
function toPdfSafe(input: string): string {
  let out = "";
  for (const char of input.normalize("NFC")) {
    const code = char.codePointAt(0) ?? 0;
    if (char === "\n") out += char;
    else if (char === "\t") out += "  ";
    else if (code < 32 || code === 127) continue;
    else if (code === 0xa0 || (code >= 0x2000 && code <= 0x200a) || code === 0x202f) out += " ";
    else if (code === 0x200b || code === 0x200c || code === 0x200d || code === 0xfe0f || code === 0xad) continue;
    else if (code <= 255 || WIN_ANSI_EXTRA.has(char)) out += char;
    else out += "?";
  }
  return out;
}

/** Korte, leesbare titel voor het gesprek: de eerste vraag van de gebruiker. */
export function chatTitle(messages: ChatPdfMessage[]): string {
  const first = messages.find((message) => message.role === "user");
  const line = first?.text.split("\n").find((l) => l.trim())?.trim() ?? "";
  if (!line) return "Gesprek met de AI-assistent";
  if (line.length <= 60) return line;
  const cut = line.slice(0, 60);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 30)).trim()}…`;
}

/** Bestandsnaam zonder tekens die op Windows/macOS niet mogen. */
export function chatFilename(title: string): string {
  const cleaned = title
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[. …]+$/g, "")
    .trim()
    .slice(0, 80)
    .trim();
  return `${cleaned || "Gesprek met de AI-assistent"}.pdf`;
}

/** `glue`: staat direct tegen het vorige woord aan (geen spatie ertussen), bv. een haakje of punt bij een link. */
type Word = { text: string; href?: string; glue?: boolean };

const LINK_PATTERN = /(https?:\/\/[^\s<>]+|www\.[^\s<>]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]'"”’]+$/;

function hrefFor(raw: string): string {
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.includes("@") && !raw.startsWith("www.")) return `mailto:${raw}`;
  return `https://${raw}`;
}

/** Splitst een tekstregel in woorden; woorden die (deel van) een link zijn onthouden de bestemming. */
function tokenize(line: string): Word[] {
  const words: Word[] = [];
  let last = 0;
  /** `glueFirst`: het eerste woord van dit stuk zit direct tegen het voorgaande woord aan. */
  const push = (segment: string, glueFirst = false) => {
    let first = true;
    for (const piece of segment.split(/\s+/)) {
      if (!piece) continue;
      words.push({ text: piece, glue: first && glueFirst && !/^\s/.test(segment) });
      first = false;
    }
  };
  for (const match of line.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    let linkText = match[0];
    const trailing = linkText.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    if (trailing) linkText = linkText.slice(0, -trailing.length);
    const before = line.slice(last, index);
    push(before, last > 0);
    // Een woord dat direct aan de link vastzit (bv. "(www.x.nl") blijft zonder spatie tegen de link aan.
    words.push({ text: linkText, href: hrefFor(linkText), glue: before !== "" && !/\s$/.test(before) });
    if (trailing) words.push({ text: trailing, glue: true });
    last = index + match[0].length;
  }
  push(line.slice(last), last > 0);
  return words;
}

/**
 * Bouwt het PDF-bestand. Gooit een fout als iets misgaat; de aanroeper toont
 * dan een nette melding.
 */
export async function buildChatPdf(
  messages: ChatPdfMessage[],
  options: { title?: string; exportedAt?: Date } = {},
): Promise<ChatPdfResult> {
  if (messages.length === 0) throw new Error("Er is geen gesprek om te exporteren.");

  const { jsPDF } = await import("jspdf");
  const exportedAt = options.exportedAt ?? new Date();
  const title = toPdfSafe(options.title ?? chatTitle(messages));
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  doc.setProperties({ title, subject: "Gesprek met de AI-assistent van a.s.r.", creator: "a.s.r. AI-assistent" });

  let y = MARGIN_TOP;

  const newPage = () => {
    doc.addPage();
    y = MARGIN_TOP;
  };
  const ensure = (height: number) => {
    if (y + height > PAGE_HEIGHT - MARGIN_BOTTOM) {
      newPage();
      return true;
    }
    return false;
  };
  const setFont = (style: "normal" | "bold", size: number, color: [number, number, number]) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  // ── Kop ──
  setFont("bold", 18, COLOR_TEXT);
  const titleLines = doc.splitTextToSize(title, CONTENT_WIDTH) as string[];
  for (const line of titleLines) {
    doc.text(line, MARGIN_X, y);
    y += 8;
  }
  setFont("normal", 11, COLOR_MUTED);
  doc.text("Gesprek met de AI-assistent van a.s.r.", MARGIN_X, y);
  y += 5.5;
  const exportedLabel = new Intl.DateTimeFormat("nl-NL", { dateStyle: "long", timeStyle: "short" }).format(exportedAt);
  doc.text(toPdfSafe(`Geëxporteerd op ${exportedLabel}`), MARGIN_X, y);
  y += 4;
  doc.setDrawColor(...COLOR_RULE);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y);
  y += 9;

  // ── Berichten ──
  let barColor = COLOR_USER;
  let barStart = y;
  const closeBar = () => {
    if (y > barStart) {
      doc.setFillColor(...barColor);
      doc.rect(MARGIN_X, barStart, BAR_WIDTH, y - barStart, "F");
    }
  };
  const breakInMessage = (height: number) => {
    if (y + height > PAGE_HEIGHT - MARGIN_BOTTOM) {
      closeBar();
      newPage();
      barStart = y;
    }
  };

  /**
   * Tekent één paragraaf met woordafbreking, lijstinspringing en klikbare links.
   * Eerst wordt de indeling in regels bepaald, daarna wordt per regel getekend:
   * aaneengesloten gewone woorden gaan als één tekstvak mee (zo blijft de
   * onderlinge woordafstand die van het lettertype), links krijgen hun eigen
   * klikbare vlak.
   */
  type Placed = { text: string; href?: string; space: boolean };
  const drawParagraph = (raw: string, size: number, lineHeight: number, style: "normal" | "bold", color: [number, number, number]) => {
    const listMatch = raw.match(/^\s*([-*•]|\d+[.)])\s+(.*)$/);
    const marker = listMatch ? (/^\d/.test(listMatch[1]) ? listMatch[1] : "•") : null;
    const body = listMatch ? listMatch[2] : raw.trim();
    const indent = TEXT_INDENT + (marker ? LIST_INDENT : 0);
    const maxWidth = CONTENT_WIDTH - indent;
    setFont(style, size, color);
    const spaceWidth = doc.getTextWidth(" ");

    if (!body && !marker) {
      breakInMessage(lineHeight);
      y += lineHeight * 0.6;
      return;
    }

    // 1. Indeling in regels
    const lines: Placed[][] = [[]];
    let lineWidth = 0;
    const newLine = () => {
      lines.push([]);
      lineWidth = 0;
    };
    for (const word of tokenize(body)) {
      let text = word.text;
      let width = doc.getTextWidth(text);
      let current = lines[lines.length - 1];
      const space = current.length > 0 && !word.glue;
      if (current.length > 0 && lineWidth + (space ? spaceWidth : 0) + width > maxWidth + 0.01 && !word.glue) {
        newLine();
        current = lines[lines.length - 1];
      }
      // Een los woord dat breder is dan de regel (bv. een lange URL) wordt per stuk afgebroken.
      while (width > maxWidth) {
        let cut = text.length - 1;
        while (cut > 1 && doc.getTextWidth(text.slice(0, cut)) > maxWidth) cut--;
        current.push({ text: text.slice(0, cut), href: word.href, space: false });
        newLine();
        current = lines[lines.length - 1];
        text = text.slice(cut);
        width = doc.getTextWidth(text);
      }
      const joinSpace = current.length > 0 && !word.glue;
      current.push({ text, href: word.href, space: joinSpace });
      lineWidth += (joinSpace ? spaceWidth : 0) + width;
    }

    // 2. Tekenen
    lines.forEach((line, lineIndex) => {
      breakInMessage(lineHeight);
      y += lineHeight;
      setFont(style, size, color);
      if (lineIndex === 0 && marker) doc.text(marker, MARGIN_X + TEXT_INDENT, y);
      let x = MARGIN_X + indent;
      let run = "";
      const flush = () => {
        if (!run) return;
        setFont(style, size, color);
        doc.text(run, x, y);
        x += doc.getTextWidth(run);
        run = "";
      };
      line.forEach((placed) => {
        if (placed.href) {
          flush();
          if (placed.space) x += spaceWidth;
          setFont(style, size, COLOR_LINK);
          const width = doc.getTextWidth(placed.text);
          doc.text(placed.text, x, y);
          doc.setDrawColor(...COLOR_LINK);
          doc.setLineWidth(0.15);
          doc.line(x, y + 0.7, x + width, y + 0.7);
          doc.link(x, y - lineHeight * 0.75, width, lineHeight, { url: placed.href });
          x += width;
        } else {
          if (run === "" && placed.space) x += spaceWidth;
          run += (run !== "" && placed.space ? " " : "") + placed.text;
        }
      });
      flush();
    });
  };

  /** Eenvoudige markdown-tabel (| a | b |) als echte tabel met kopregel en randen. */
  const isTableLine = (line: string) => /^\s*\|.*\|\s*$/.test(line);
  const drawTable = (tableLines: string[]) => {
    const rows = tableLines
      .map((line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()))
      .filter((cells) => !cells.every((cell) => /^:?-{2,}:?$/.test(cell)));
    const columns = Math.max(...rows.map((row) => row.length));
    const pad = 1.6;
    const lh = 4.8;
    const available = CONTENT_WIDTH - TEXT_INDENT;
    setFont("normal", 10, COLOR_TEXT);
    const natural = Array.from(
      { length: columns },
      (_, c) =>
        Math.max(
          ...rows.map((row, rowIndex) => {
            setFont(rowIndex === 0 ? "bold" : "normal", 10, COLOR_TEXT);
            return doc.getTextWidth(row[c] ?? "");
          }),
          6,
        ) +
        pad * 2 +
        0.5,
    );
    const total = natural.reduce((sum, width) => sum + width, 0);
    const widths = total > available ? natural.map((width) => Math.max((width / total) * available, 12)) : natural;
    rows.forEach((row, rowIndex) => {
      const header = rowIndex === 0;
      setFont(header ? "bold" : "normal", 10, COLOR_TEXT);
      const cellLines = widths.map((width, c) => doc.splitTextToSize(row[c] ?? "", width - pad * 2) as string[]);
      const height = Math.max(...cellLines.map((l) => l.length)) * lh + pad * 2 - 1;
      breakInMessage(height + 0.5);
      let x = MARGIN_X + TEXT_INDENT;
      widths.forEach((width, c) => {
        if (header) {
          doc.setFillColor(246, 246, 247);
          doc.rect(x, y, width, height, "F");
        }
        doc.setDrawColor(...COLOR_RULE);
        doc.setLineWidth(0.25);
        doc.rect(x, y, width, height, "S");
        setFont(header ? "bold" : "normal", 10, COLOR_TEXT);
        cellLines[c].forEach((cellLine, i) => doc.text(cellLine, x + pad, y + pad + 3.2 + i * lh));
        x += width;
      });
      y += height;
    });
    y += 2;
  };

  messages.forEach((message, index) => {
    const isUser = message.role === "user";
    barColor = isUser ? COLOR_USER : COLOR_ASSISTANT;
    ensure(7 + BODY_LINE * 2);
    barStart = y - 4;
    setFont("bold", 10, COLOR_TEXT);
    doc.text(isUser ? "Jij" : "AI-assistent", MARGIN_X + TEXT_INDENT, y);
    y += 1;

    const paragraphs = toPdfSafe(message.text).split("\n");
    for (let i = 0; i < paragraphs.length; i++) {
      if (isTableLine(paragraphs[i])) {
        const block: string[] = [];
        while (i < paragraphs.length && isTableLine(paragraphs[i])) block.push(paragraphs[i++]);
        i--;
        y += 1;
        drawTable(block);
      } else {
        drawParagraph(paragraphs[i], BODY_SIZE, BODY_LINE, "normal", COLOR_TEXT);
      }
    }

    if (!isUser && message.sources?.length) {
      y += 3;
      breakInMessage(SMALL_LINE * 2);
      y += SMALL_LINE;
      setFont("bold", SMALL_SIZE, COLOR_MUTED);
      doc.text("Bronnen", MARGIN_X + TEXT_INDENT, y);
      message.sources.forEach((source, sourceIndex) => {
        const label = `${sourceIndex + 1}. ${toPdfSafe(source.title)}`;
        const line = source.url ? `${label} – ${source.url}` : label;
        drawParagraph(line, SMALL_SIZE, SMALL_LINE, "normal", COLOR_MUTED);
      });
    }

    closeBar();
    y += index === messages.length - 1 ? 0 : 8;
  });

  // ── Voettekst op elke pagina ──
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    setFont("normal", 8.5, COLOR_MUTED);
    doc.setDrawColor(...COLOR_RULE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_X, PAGE_HEIGHT - 14, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 14);
    doc.text("AI-assistent van a.s.r.", MARGIN_X, PAGE_HEIGHT - 9);
    doc.text(`Pagina ${page} van ${pageCount}`, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 9, { align: "right" });
  }

  const buffer = doc.output("arraybuffer");
  return { blob: new Blob([buffer], { type: "application/pdf" }), filename: chatFilename(title) };
}

/** Start de download in de browser. */
export function downloadPdf({ blob, filename }: ChatPdfResult): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
