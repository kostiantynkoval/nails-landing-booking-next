import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  addMinutesUtc,
  formatSalonLocalDate,
  formatSalonLocalTime,
  parseLocalDateString,
  salonLocalDayUtcRange,
  salonLocalToUtc,
} from "@/lib/timezone";
import { computeAvailableSlots, getDayOfWeekForLocalDate } from "./availability";
import {
  BookingError,
  type ClientAppointment,
  type CreateBookingInput,
  type BookingResult,
  type ServiceItem,
  type SlotQuery,
  type TechnicianItem,
  type TimeSlot,
} from "./types";

function decimalToNumber(value: Prisma.Decimal | number | string): number {
  return typeof value === "number" ? value : Number(value);
}

function mapService(row: {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: Prisma.Decimal;
  isActive: boolean;
}): ServiceItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    durationMin: row.durationMin,
    price: decimalToNumber(row.price),
    isActive: row.isActive,
  };
}

async function assertSlotStillAvailable(
  tx: Prisma.TransactionClient,
  technicianId: string,
  startTime: Date,
  endTime: Date,
): Promise<void> {
  const locked = await tx.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Appointment"
    WHERE "technicianId" = ${technicianId}
    AND "startTime" < ${endTime}
    AND "endTime" > ${startTime}
    AND status <> 'CANCELLED'::"AppointmentStatus"
    FOR UPDATE
  `;

  if (locked.length > 0) {
    throw new BookingError("SLOT_TAKEN", "This time slot was just booked. Please choose another.");
  }
}

async function loadAvailabilityForSlot(
  technicianId: string,
  serviceId: string,
  localDate: string,
) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service?.isActive) {
    throw new BookingError("NOT_FOUND", "Service not found");
  }

  const dayOfWeek = getDayOfWeekForLocalDate(localDate);
  const { dayStart, dayEnd } = salonLocalDayUtcRange(localDate);

  const [workingHours, appointments, breaks] = await Promise.all([
    prisma.workingHours.findUnique({
      where: { technicianId_dayOfWeek: { technicianId, dayOfWeek } },
    }),
    prisma.appointment.findMany({
      where: {
        technicianId,
        startTime: { lt: dayEnd },
        endTime: { gt: dayStart },
      },
      select: { startTime: true, endTime: true, status: true },
    }),
    prisma.breakTime.findMany({
      where: {
        technicianId,
        startTime: { lt: dayEnd },
        endTime: { gt: dayStart },
      },
      select: { startTime: true, endTime: true },
    }),
  ]);

  return {
    service,
    workingHours,
    slots: computeAvailableSlots({
      localDate,
      durationMin: service.durationMin,
      workingHours,
      appointments,
      breaks,
    }),
  };
}

async function validateWithinWorkingHours(
  technicianId: string,
  serviceId: string,
  startTime: Date,
  endTime: Date,
): Promise<void> {
  const localDate = formatSalonLocalDate(startTime);
  const { workingHours, slots } = await loadAvailabilityForSlot(
    technicianId,
    serviceId,
    localDate,
  );

  if (!workingHours) {
    throw new BookingError("OUTSIDE_HOURS", "Technician is not available on this day");
  }

  const dayOpen = salonLocalToUtc(localDate, workingHours.openTime);
  const dayClose = salonLocalToUtc(localDate, workingHours.closeTime);

  if (startTime < dayOpen || endTime > dayClose) {
    throw new BookingError("OUTSIDE_HOURS", "Selected time is outside working hours");
  }

  const match = slots.some((s) => s.startTimeUtc === startTime.toISOString());
  if (!match) {
    throw new BookingError("OUTSIDE_HOURS", "Selected time is not an available slot");
  }
}

export const bookingService = {
  async getServices(): Promise<ServiceItem[]> {
    const rows = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return rows.map(mapService);
  },

  async getTechnicians(): Promise<TechnicianItem[]> {
    const rows = await prisma.technicianProfile.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: { user: { name: "asc" } },
    });

    return rows.map((t) => ({
      id: t.id,
      userId: t.userId,
      name: t.user.name,
      bio: t.bio,
      specialties: t.specialties,
    }));
  },

  async getAvailableSlots(query: SlotQuery): Promise<TimeSlot[]> {
    parseLocalDateString(query.localDate);

    const [service, technician] = await Promise.all([
      prisma.service.findUnique({ where: { id: query.serviceId } }),
      prisma.technicianProfile.findUnique({ where: { id: query.technicianId } }),
    ]);

    if (!service?.isActive) {
      throw new BookingError("NOT_FOUND", "Service not found");
    }
    if (!technician) {
      throw new BookingError("NOT_FOUND", "Technician not found");
    }

    const { slots } = await loadAvailabilityForSlot(
      query.technicianId,
      query.serviceId,
      query.localDate,
    );
    return slots;
  },

  async createBooking(input: CreateBookingInput): Promise<BookingResult> {
    const service = await prisma.service.findUnique({
      where: { id: input.serviceId },
    });

    if (!service?.isActive) {
      throw new BookingError("NOT_FOUND", "Service not found");
    }

    const technician = await prisma.technicianProfile.findUnique({
      where: { id: input.technicianId },
    });

    if (!technician) {
      throw new BookingError("NOT_FOUND", "Technician not found");
    }

    const endTime = addMinutesUtc(input.startTimeUtc, service.durationMin);

    await validateWithinWorkingHours(
      input.technicianId,
      input.serviceId,
      input.startTimeUtc,
      endTime,
    );

    const appointment = await prisma.$transaction(async (tx) => {
      await assertSlotStillAvailable(
        tx,
        input.technicianId,
        input.startTimeUtc,
        endTime,
      );

      return tx.appointment.create({
        data: {
          clientId: input.clientId,
          technicianId: input.technicianId,
          serviceId: input.serviceId,
          startTime: input.startTimeUtc,
          endTime,
          notes: input.notes,
          status: "PENDING",
        },
      });
    });

    return {
      id: appointment.id,
      startTimeUtc: appointment.startTime.toISOString(),
      endTimeUtc: appointment.endTime.toISOString(),
      startTimeLocal: formatSalonLocalTime(appointment.startTime),
      endTimeLocal: formatSalonLocalTime(appointment.endTime),
      status: appointment.status,
    };
  },

  async cancelBooking(id: string, userId: string): Promise<void> {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new BookingError("NOT_FOUND", "Appointment not found");
    }

    if (appointment.clientId !== userId) {
      throw new BookingError("UNAUTHORIZED", "You can only cancel your own bookings");
    }

    if (
      appointment.status !== "PENDING" &&
      appointment.status !== "CONFIRMED"
    ) {
      throw new BookingError("INVALID_INPUT", "This appointment cannot be cancelled");
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  },

  async getClientBookings(userId: string): Promise<ClientAppointment[]> {
    const rows = await prisma.appointment.findMany({
      where: { clientId: userId },
      include: {
        service: true,
        technician: { include: { user: { select: { name: true } } } },
      },
      orderBy: { startTime: "desc" },
    });

    return rows.map((row) => ({
      id: row.id,
      startTimeUtc: row.startTime.toISOString(),
      endTimeUtc: row.endTime.toISOString(),
      startTimeLocal: formatSalonLocalTime(row.startTime),
      endTimeLocal: formatSalonLocalTime(row.endTime),
      status: row.status,
      notes: row.notes,
      service: {
        id: row.service.id,
        name: row.service.name,
        durationMin: row.service.durationMin,
        price: decimalToNumber(row.service.price),
      },
      technician: {
        id: row.technician.id,
        name: row.technician.user.name,
      },
    }));
  },
};
