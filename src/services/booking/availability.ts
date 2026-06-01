import { addMinutes, isBefore } from "date-fns";
import type { Appointment, BreakTime, WorkingHours } from "@/generated/prisma/client";
import {
  addMinutesUtc,
  formatSalonLocalTime,
  getSalonDayOfWeek,
  parseLocalDateString,
  salonLocalToUtc,
  salonNowUtc,
} from "@/lib/timezone";
import type { TimeSlot } from "./types";

const DEFAULT_SLOT_INTERVAL_MIN = 15;

export type AvailabilityContext = {
  localDate: string;
  durationMin: number;
  workingHours: WorkingHours | null;
  appointments: Pick<Appointment, "startTime" | "endTime" | "status">[];
  breaks: Pick<BreakTime, "startTime" | "endTime">[];
  slotIntervalMin?: number;
};

function intervalsOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  appointments: AvailabilityContext["appointments"],
  breaks: AvailabilityContext["breaks"],
): boolean {
  for (const apt of appointments) {
    if (apt.status === "CANCELLED") continue;
    if (intervalsOverlap(slotStart, slotEnd, apt.startTime, apt.endTime)) {
      return false;
    }
  }
  for (const brk of breaks) {
    if (intervalsOverlap(slotStart, slotEnd, brk.startTime, brk.endTime)) {
      return false;
    }
  }
  return true;
}

export function computeAvailableSlots(ctx: AvailabilityContext): TimeSlot[] {
  parseLocalDateString(ctx.localDate);

  if (!ctx.workingHours) {
    return [];
  }

  const interval = ctx.slotIntervalMin ?? DEFAULT_SLOT_INTERVAL_MIN;
  const dayStart = salonLocalToUtc(ctx.localDate, ctx.workingHours.openTime);
  const dayEnd = salonLocalToUtc(ctx.localDate, ctx.workingHours.closeTime);
  const now = salonNowUtc();

  const slots: TimeSlot[] = [];
  let cursor = dayStart;

  while (true) {
    const slotEnd = addMinutesUtc(cursor, ctx.durationMin);
    if (slotEnd > dayEnd) {
      break;
    }

    if (!isBefore(cursor, now) && isSlotAvailable(cursor, slotEnd, ctx.appointments, ctx.breaks)) {
      slots.push({
        startTimeUtc: cursor.toISOString(),
        endTimeUtc: slotEnd.toISOString(),
        startTimeLocal: formatSalonLocalTime(cursor),
        endTimeLocal: formatSalonLocalTime(slotEnd),
      });
    }

    cursor = addMinutes(cursor, interval);
  }

  return slots;
}

export function getDayOfWeekForLocalDate(localDate: string): number {
  return getSalonDayOfWeek(localDate);
}
