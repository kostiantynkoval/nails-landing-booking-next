"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { bookingService } from "@/services/booking/BookingService";
import { BookingError } from "@/services/booking/types";

const slotQuerySchema = z.object({
  technicianId: z.string().uuid(),
  serviceId: z.string().uuid(),
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const createBookingSchema = z.object({
  technicianId: z.string().uuid(),
  serviceId: z.string().uuid(),
  startTimeUtc: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export type BookingActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

function toActionError(error: unknown): BookingActionResult<never> {
  if (error instanceof BookingError) {
    return { ok: false, code: error.code, message: error.message };
  }
  if (error instanceof z.ZodError) {
    return { ok: false, code: "INVALID_INPUT", message: "Invalid request" };
  }
  console.error(error);
  return { ok: false, code: "UNKNOWN", message: "Something went wrong" };
}

export async function getAvailableSlotsAction(
  input: z.infer<typeof slotQuerySchema>,
): Promise<BookingActionResult<Awaited<ReturnType<typeof bookingService.getAvailableSlots>>>> {
  try {
    const parsed = slotQuerySchema.parse(input);
    const slots = await bookingService.getAvailableSlots(parsed);
    return { ok: true, data: slots };
  } catch (error) {
    return toActionError(error);
  }
}

export async function createBookingAction(
  input: z.infer<typeof createBookingSchema>,
): Promise<BookingActionResult<Awaited<ReturnType<typeof bookingService.createBooking>>>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, code: "UNAUTHORIZED", message: "Sign in to book" };
    }

    const parsed = createBookingSchema.parse(input);
    const result = await bookingService.createBooking({
      clientId: session.user.id,
      technicianId: parsed.technicianId,
      serviceId: parsed.serviceId,
      startTimeUtc: new Date(parsed.startTimeUtc),
      notes: parsed.notes,
    });

    return { ok: true, data: result };
  } catch (error) {
    return toActionError(error);
  }
}

export async function cancelBookingAction(
  appointmentId: string,
): Promise<BookingActionResult<{ cancelled: true }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, code: "UNAUTHORIZED", message: "Sign in required" };
    }

    await bookingService.cancelBooking(appointmentId, session.user.id);
    return { ok: true, data: { cancelled: true } };
  } catch (error) {
    return toActionError(error);
  }
}
