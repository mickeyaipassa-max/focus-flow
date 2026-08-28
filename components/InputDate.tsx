"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";

const WEEKDAY_LABELS = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const MONTH_LABELS = [
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
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

/** Maandraster ma-zo, incl. dagen uit de vorige/volgende maand zodat elke week 7 dagen heeft — zoveel rijen als nodig (Figma's voorbeeld toont 5). */
function buildCalendarGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = maandag
  const gridStart = new Date(year, month, 1 - firstWeekday);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  return Array.from({ length: totalCells }, (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
}

type DayCellProps = {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeEdge: boolean;
  isInRange: boolean;
  isDisabled: boolean;
  onSelect: (date: Date) => void;
};

/**
 * Gebaseerd op Figma's "Day" component (node 14902:19447, state=weekday/
 * date/date today/selected/date start/date in range/date end/disabled).
 * "date start" en "date end" hebben in Figma exact dezelfde stijl als
 * "selected" (bg #eda50f) — dus geen apart visueel onderscheid nodig, enkel
 * bijgehouden welke datum welke rol heeft.
 *
 * Dagen buiten de huidige maand krijgen letterlijk dezelfde stijl als
 * "disabled" (zelfde tekstkleur rgba(0,0,0,0.16), zelfde gewicht) — geen
 * eigen "buiten-maand"-state bestaat in Figma, dus dit is bewust hergebruik,
 * geen verzonnen variant.
 */
function DayCell({ date, inCurrentMonth, isToday, isSelected, isRangeEdge, isInRange, isDisabled, onSelect }: DayCellProps) {
  const muted = !inCurrentMonth || isDisabled;
  const filled = isSelected || isRangeEdge;
  const bold = filled || isToday;

  return (
    <button
      type="button"
      disabled={muted}
      onClick={() => onSelect(date)}
      className={[
        "flex size-8 max-h-8 max-w-8 shrink-0 items-center justify-center rounded-[3px] pt-[2px]",
        filled ? "bg-[#eda50f]" : isInRange ? "bg-[rgba(0,0,0,0.08)]" : isToday ? "border border-black" : "",
        muted ? "cursor-default" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className="text-base leading-[1.5]"
        style={{
          fontFamily: bold ? "var(--font-avenir-bold)" : "var(--font-avenir-book)",
          color: muted ? "rgba(0,0,0,0.16)" : "black",
        }}
      >
        {date.getDate()}
      </span>
    </button>
  );
}

function CalendarPanel({
  month,
  year,
  onMonthChange,
  onYearChange,
  value,
  rangeValue,
  range,
  minDate,
  maxDate,
  onSelectDate,
  showTodayButton,
  showClearButton,
  todayButtonText,
  clearButtonText,
  onToday,
  onClear,
}: {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  value?: Date | null;
  rangeValue?: { start: Date | null; end: Date | null };
  range: boolean;
  minDate?: Date;
  maxDate?: Date;
  onSelectDate: (date: Date) => void;
  showTodayButton: boolean;
  showClearButton: boolean;
  todayButtonText: string;
  clearButtonText: string;
  onToday: () => void;
  onClear: () => void;
}) {
  const today = startOfDay(new Date());
  const cells = buildCalendarGrid(year, month);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  function goPrevMonth() {
    if (month === 0) {
      onMonthChange(11);
      onYearChange(year - 1);
    } else {
      onMonthChange(month - 1);
    }
  }

  function goNextMonth() {
    if (month === 11) {
      onMonthChange(0);
      onYearChange(year + 1);
    } else {
      onMonthChange(month + 1);
    }
  }

  return (
    <div className="flex min-h-[280px] max-h-[324px] min-w-[260px] max-w-[260px] flex-col items-center rounded-[3px] bg-white shadow-[0px_8px_12px_rgba(0,0,0,0.16)]">
      <div className="flex w-full shrink-0 items-center gap-1 p-3">
        <button
          type="button"
          onClick={goPrevMonth}
          aria-label="Vorige maand"
          className="flex shrink-0 items-center gap-2 rounded-[3px] bg-[#f6f6f7] p-2"
        >
          <Icon name="chevron-left-sm" size="sm" />
        </button>
        <div className="flex h-8 flex-1 items-center gap-2 rounded-[3px] bg-[#f6f6f7] px-2 pt-[2px]">
          <span className="text-base leading-[1.5] text-black" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            {MONTH_LABELS[month]}
          </span>
        </div>
        <div className="flex h-8 w-14 shrink-0 items-center gap-2 rounded-[3px] bg-[#f6f6f7] px-2 pt-[2px]">
          <span className="text-base leading-[1.5] text-black" style={{ fontFamily: "var(--font-avenir-medium)" }}>
            {year}
          </span>
        </div>
        <button
          type="button"
          onClick={goNextMonth}
          aria-label="Volgende maand"
          className="flex shrink-0 items-center gap-2 rounded-[3px] bg-[#f6f6f7] p-2"
        >
          <Icon name="chevron-right-sm" size="sm" />
        </button>
      </div>

      <div className="flex shrink-0 flex-col items-center px-3 pb-3">
        <div className="flex items-center gap-0.5">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="flex size-8 max-h-8 max-w-8 items-center justify-center pt-[2px]">
              <span className="text-base leading-[1.5] text-black" style={{ fontFamily: "var(--font-avenir-bold)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex items-center gap-0.5 py-0.5">
              {week.map((date) => {
                const inCurrentMonth = date.getMonth() === month;
                const isDisabled = (minDate ? date < startOfDay(minDate) : false) || (maxDate ? date > startOfDay(maxDate) : false);
                const isSelected = range ? false : sameDay(date, value);
                const isRangeEdge = range && (sameDay(date, rangeValue?.start) || sameDay(date, rangeValue?.end));
                const isInRange =
                  range && !!rangeValue?.start && !!rangeValue?.end && date > startOfDay(rangeValue.start) && date < startOfDay(rangeValue.end);
                return (
                  <DayCell
                    key={date.toISOString()}
                    date={date}
                    inCurrentMonth={inCurrentMonth}
                    isToday={sameDay(date, today)}
                    isSelected={isSelected}
                    isRangeEdge={isRangeEdge}
                    isInRange={isInRange}
                    isDisabled={!inCurrentMonth || isDisabled}
                    onSelect={onSelectDate}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {(showTodayButton || showClearButton) && (
        <div className="flex w-full shrink-0 items-center gap-1 px-3 pb-3">
          {showTodayButton && (
            <button type="button" onClick={onToday} className="flex h-8 shrink-0 items-center gap-2 rounded-[3px] bg-[#f6f6f7] px-2 pt-[2px]">
              <span className="text-base leading-[1.5] text-black" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                {todayButtonText}
              </span>
            </button>
          )}
          {showClearButton && (
            <button type="button" onClick={onClear} className="flex h-8 shrink-0 items-center gap-2 rounded-[3px] bg-[#f6f6f7] px-2 pt-[2px]">
              <span className="text-base leading-[1.5] text-black" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                {clearButtonText}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export type DateRangeValue = { start: Date | null; end: Date | null };

type InputDateProps = {
  /** Figma's eigen default voor dit component is letterlijk "Datum (dd-mm-jjjj)" — echte vaste tekst, geen demo-placeholder (zelfde redenering als InputEmail/InputPhone). */
  labelText?: string;
  required?: boolean;
  error?: string;
  /** Bevestigde Figma-property, default false — de kalenderknop is dus optioneel, niet standaard aan. */
  showPickerButton?: boolean;
  /** Bevestigde Figma-property "range", default false. */
  range?: boolean;
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  rangeValue?: DateRangeValue;
  onRangeChange?: (value: DateRangeValue) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Bevestigde Figma-properties, beide default false — het footer-frame staat in Figma standaard op hidden. */
  showTodayButton?: boolean;
  showClearButton?: boolean;
  /** Figma's eigen knopteksten, letterlijk "Vandaag" / "Wis selectie". */
  todayButtonText?: string;
  clearButtonText?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Input Date" (node 3013:1897, filled × validation ×
 * "date picker button") + het gekoppelde "Date Picker"-component (node
 * 14902:5335, range=false/true) uit de aparte "Date Picker"-pagina.
 *
 * De tekstinvoer zelf blijft een los, direct getypt veld (dd-mm-jjjj) —
 * Figma's eigen componentbeschrijving noemt weliswaar aparte dag/maand/
 * jaar-velden, maar geen van de 6 gefetchte varianten toont die opsplitsing
 * daadwerkelijk (allemaal één doorlopend tekstveld) — dus hier ook niet
 * verzonnen, alleen wat de varianten zelf laten zien is gebouwd.
 */
export function InputDate({
  labelText = "Datum (dd-mm-jjjj)",
  required = true,
  error,
  showPickerButton = false,
  range = false,
  value,
  onChange,
  rangeValue,
  onRangeChange,
  minDate,
  maxDate,
  showTodayButton = false,
  showClearButton = false,
  todayButtonText = "Vandaag",
  clearButtonText = "Wis selectie",
  placeholder,
  name,
  id,
  className,
}: InputDateProps) {
  const [open, setOpen] = useState(false);
  const referenceDate = range ? rangeValue?.start ?? new Date() : value ?? new Date();
  const [viewMonth, setViewMonth] = useState(referenceDate.getMonth());
  const [viewYear, setViewYear] = useState(referenceDate.getFullYear());
  const rootRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleSelectDate(date: Date) {
    if (range) {
      const current = rangeValue ?? { start: null, end: null };
      if (!current.start || (current.start && current.end)) {
        onRangeChange?.({ start: date, end: null });
      } else if (date < current.start) {
        onRangeChange?.({ start: date, end: current.start });
      } else {
        onRangeChange?.({ start: current.start, end: date });
        setOpen(false);
      }
      return;
    }
    onChange?.(date);
    setOpen(false);
  }

  function handleToday() {
    const today = startOfDay(new Date());
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    if (!range) onChange?.(today);
  }

  function handleClear() {
    if (range) onRangeChange?.({ start: null, end: null });
    else onChange?.(null);
  }

  const displayValue = range
    ? [rangeValue?.start ? formatDate(rangeValue.start) : "", rangeValue?.end ? formatDate(rangeValue.end) : ""].filter(Boolean).join(" – ")
    : value
      ? formatDate(value)
      : "";

  return (
    <div ref={rootRef} className={className ?? "relative isolate flex w-[333px] flex-col items-start gap-2"}>
      {open && (
        <div className="absolute bottom-[43px] left-[164px] z-10">
          <CalendarPanel
            month={viewMonth}
            year={viewYear}
            onMonthChange={setViewMonth}
            onYearChange={setViewYear}
            value={value}
            rangeValue={rangeValue}
            range={range}
            minDate={minDate}
            maxDate={maxDate}
            onSelectDate={handleSelectDate}
            showTodayButton={showTodayButton}
            showClearButton={showClearButton}
            todayButtonText={todayButtonText}
            clearButtonText={clearButtonText}
            onToday={handleToday}
            onClear={handleClear}
          />
        </div>
      )}

      <div className="flex w-full flex-col items-start justify-center gap-1">
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
      </div>

      <div
        className={[
          "flex h-[51px] w-full max-w-[320px] items-center gap-2 rounded-[3px] border bg-white py-3 pr-[6px] pl-4",
          error ? "border-[#ce0a1e]" : "border-[#565656] focus-within:border-black",
        ].join(" ")}
      >
        <input
          id={id}
          name={name}
          type="text"
          readOnly={showPickerButton}
          value={displayValue}
          onChange={(event) => {
            if (showPickerButton) return;
            const [dd, mm, yyyy] = event.target.value.split("-");
            const parsed = dd && mm && yyyy && yyyy.length === 4 ? new Date(Number(yyyy), Number(mm) - 1, Number(dd)) : null;
            onChange?.(parsed && !Number.isNaN(parsed.getTime()) ? parsed : null);
          }}
          onClick={() => showPickerButton && setOpen(true)}
          placeholder={placeholder}
          className="min-w-0 flex-1 text-black text-lg leading-[1.5] outline-none"
          style={{ fontFamily: "var(--font-avenir)" }}
        />
        {showPickerButton && (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label="Kalender openen"
            aria-expanded={open}
            className="flex size-10 shrink-0 items-center justify-center gap-1 rounded-[3px] p-3"
          >
            <Icon name="calendar" size="md" />
          </button>
        )}
      </div>

      {error && (
        <div className="flex w-fit items-start gap-2 rounded-[3px] bg-[#f8d3dd] px-2 py-1">
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
