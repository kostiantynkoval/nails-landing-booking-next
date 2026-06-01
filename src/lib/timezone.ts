import { addDays, addMinutes, getDay, parseISO } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

const LOCAL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function getSalonTimezone(): string {
  return process.env.SALON_TIMEZONE ?? "Europe/Kyiv";
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
  return fromZonedTime(`${localDate}T${timeHHMM}:00`, getSalonTimezone());
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
  return formatInTimeZone(utc, getSalonTimezone(), pattern);
}

export function formatSalonLocalDate(utc: Date, pattern = "yyyy-MM-dd"): string {
  return formatInTimeZone(utc, getSalonTimezone(), pattern);
}

export function addMinutesUtc(utc: Date, minutes: number): Date {
  return addMinutes(utc, minutes);
}

export function salonNowUtc(): Date {
  return new Date();
}

/** Next calendar day as YYYY-MM-DD in salon timezone */
export function nextSalonLocalDate(localDate: string): string {
  parseLocalDateString(localDate);
  const anchor = salonLocalToUtc(localDate, "12:00");
  const next = addDays(anchor, 1);
  return formatInTimeZone(next, getSalonTimezone(), "yyyy-MM-dd");
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
