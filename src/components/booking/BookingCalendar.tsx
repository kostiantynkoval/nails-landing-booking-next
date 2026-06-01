"use client";

import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useCallback, useMemo, useRef, useState } from "react";

type BookingCalendarProps = {
  minDate: string;
  selectedDate: string | undefined;
  onSelectDate: (localDate: string) => void;
};

function toLocalDateStr(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function BookingCalendar({
  minDate,
  selectedDate,
  onSelectDate,
}: BookingCalendarProps) {
  const min = parseISO(minDate);
  const minValid = !Number.isNaN(min.getTime());
  const selected = selectedDate ? parseISO(selectedDate) : undefined;
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(selected ?? min),
  );
  const gridRef = useRef<HTMLDivElement>(null);

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const days: Date[] = [];
    let day = gridStart;
    while (day <= monthEnd || days.length % 7 !== 0) {
      days.push(day);
      day = addDays(day, 1);
      if (days.length > 42) break;
    }
    return days;
  }, [viewMonth]);

  const focusDay = useCallback(
    (date: Date) => {
      const btn = gridRef.current?.querySelector<HTMLButtonElement>(
        `[data-date="${toLocalDateStr(date)}"]`,
      );
      btn?.focus();
    },
    [],
  );

  const handleKeyDown = (e: React.KeyboardEvent, date: Date) => {
    let next: Date | null = null;
    switch (e.key) {
      case "ArrowLeft":
        next = addDays(date, -1);
        break;
      case "ArrowRight":
        next = addDays(date, 1);
        break;
      case "ArrowUp":
        next = addDays(date, -7);
        break;
      case "ArrowDown":
        next = addDays(date, 7);
        break;
      case "Home":
        next = startOfMonth(viewMonth);
        break;
      case "End":
        next = endOfMonth(viewMonth);
        break;
      default:
        return;
    }
    e.preventDefault();
    if (!next) return;
    if (!isSameMonth(next, viewMonth)) {
      setViewMonth(startOfMonth(next));
    }
    requestAnimationFrame(() => focusDay(next!));
  };

  const weekDayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, -1))}
          className="rounded-lg border border-[var(--border)] px-3 py-1 text-sm hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
          {format(viewMonth, "MMMM yyyy")}
        </h3>
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="rounded-lg border border-[var(--border)] px-3 py-1 text-sm hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div
        ref={gridRef}
        role="grid"
        aria-label="Choose appointment date"
        className="grid grid-cols-7 gap-1"
      >
        {weekDayLabels.map((label) => (
          <div
            key={label}
            role="columnheader"
            className="py-1 text-center text-xs font-medium text-[var(--text-muted)]"
          >
            {label}
          </div>
        ))}
        {weeks.map((day) => {
          const dateStr = toLocalDateStr(day);
          const inMonth = isSameMonth(day, viewMonth);
          const isPast =
            minValid && isBefore(day, min) && !isSameDay(day, min);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const disabled = !inMonth || isPast;

          return (
            <div key={dateStr} role="gridcell" className="flex justify-center">
              <button
                type="button"
                data-date={dateStr}
                tabIndex={isSelected ? 0 : -1}
                disabled={disabled}
                aria-label={format(day, "EEEE, MMMM d, yyyy")}
                aria-current={isSelected ? "date" : undefined}
                aria-disabled={disabled}
                onClick={() => !disabled && onSelectDate(dateStr)}
                onKeyDown={(e) => !disabled && handleKeyDown(e, day)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  !inMonth
                    ? "text-transparent"
                    : isSelected
                      ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                      : isPast
                        ? "text-[var(--text-muted)] opacity-40"
                        : "text-[var(--text-primary)] hover:bg-[var(--accent-light)]"
                }`}
              >
                {inMonth ? format(day, "d") : ""}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
