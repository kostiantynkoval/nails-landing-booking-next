import { addDays, addMinutes, format, getDay, parseISO } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

const LOCAL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Mississauga salon default; must be an IANA zone (e.g. America/Toronto), not UTC-5 */
const FALLBACK_TIMEZONE = "America/Toronto";

function isValidIanaTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function getSalonTimezone(): string {
  const configured = process.env.SALON_TIMEZONE?.trim();
  if (configured && isValidIanaTimeZone(configured)) {
    return configured;
  }
  return FALLBACK_TIMEZONE;
}

export function parseLocalDateString(localDate: string): void {
  if (!LOCAL_DATE_RE.test(localDate)) {
    throw new Error(`Invalid local date: ${localDate}`);
  }
  const parsed = parseISO(localDate);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid local date: ${localDate}`);
  }
}

export function parseTimeHHMM(time: string): { hours: number; minutes: number } {
  const match = TIME_RE.exec(time);
  if (!match) {
    throw new Error(`Invalid time: ${time}`);
  }
  return { hours: Number(match[1]), minutes: Number(match[2]) };
}

/** Salon-local calendar date + HH:MM → UTC instant */
export function salonLocalToUtc(localDate: string, timeHHMM: string): Date {
  parseLocalDateString(localDate);
  parseTimeHHMM(timeHHMM);
  const result = fromZonedTime(
    `${localDate}T${timeHHMM}:00`,
    getSalonTimezone(),
  );
  if (Number.isNaN(result.getTime())) {
    throw new Error(
      `Could not convert ${localDate} ${timeHHMM} with timezone ${getSalonTimezone()}`,
    );
  }
  return result;
}

/** UTC instant → salon-local Date object (for getDay, comparisons in salon TZ) */
export function utcToSalonLocal(utc: Date): Date {
  return toZonedTime(utc, getSalonTimezone());
}

/** Day of week 0 (Sun) – 6 (Sat) for a salon-local YYYY-MM-DD */
export function getSalonDayOfWeek(localDate: string): number {
  const noonUtc = salonLocalToUtc(localDate, "12:00");
  return getDay(utcToSalonLocal(noonUtc));
}

export function formatSalonLocalTime(utc: Date, pattern = "HH:mm"): string {
  if (Number.isNaN(utc.getTime())) {
    throw new Error("Cannot format invalid date");
  }
  return formatInTimeZone(utc, getSalonTimezone(), pattern);
}

export function formatSalonLocalDate(utc: Date, pattern = "yyyy-MM-dd"): string {
  if (Number.isNaN(utc.getTime())) {
    throw new Error("Cannot format invalid date");
  }
  return formatInTimeZone(utc, getSalonTimezone(), pattern);
}

export function addMinutesUtc(utc: Date, minutes: number): Date {
  return addMinutes(utc, minutes);
}

export function salonNowUtc(): Date {
  return new Date();
}

/** Next calendar day as YYYY-MM-DD (date-only math, no timezone) */
export function nextSalonLocalDate(localDate: string): string {
  parseLocalDateString(localDate);
  return format(addDays(parseISO(localDate), 1), "yyyy-MM-dd");
}

/** UTC range covering a full salon-local calendar day */
export function salonLocalDayUtcRange(localDate: string): {
  dayStart: Date;
  dayEnd: Date;
} {
  parseLocalDateString(localDate);
  return {
    dayStart: salonLocalToUtc(localDate, "00:00"),
    dayEnd: salonLocalToUtc(nextSalonLocalDate(localDate), "00:00"),
  };
}

/** Today in salon timezone as YYYY-MM-DD */
export function salonTodayLocalDate(): string {
  return formatInTimeZone(new Date(), getSalonTimezone(), "yyyy-MM-dd");
}
