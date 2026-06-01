export type BookingErrorCode =
  | "SLOT_TAKEN"
  | "OUTSIDE_HOURS"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INVALID_INPUT";

export class BookingError extends Error {
  readonly code: BookingErrorCode;

  constructor(code: BookingErrorCode, message: string) {
    super(message);
    this.name = "BookingError";
    this.code = code;
  }
}

export type ServiceItem = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: number;
  isActive: boolean;
};

export type TechnicianItem = {
  id: string;
  userId: string;
  name: string;
  bio: string | null;
  specialties: string[];
};

export type TimeSlot = {
  startTimeUtc: string;
  endTimeUtc: string;
  startTimeLocal: string;
  endTimeLocal: string;
};

export type SlotQuery = {
  technicianId: string;
  serviceId: string;
  localDate: string;
};

export type CreateBookingInput = {
  clientId: string;
  technicianId: string;
  serviceId: string;
  startTimeUtc: Date;
  notes?: string;
};

export type BookingResult = {
  id: string;
  startTimeUtc: string;
  endTimeUtc: string;
  startTimeLocal: string;
  endTimeLocal: string;
  status: string;
};

export type ClientAppointment = {
  id: string;
  startTimeUtc: string;
  endTimeUtc: string;
  startTimeLocal: string;
  endTimeLocal: string;
  status: string;
  notes: string | null;
  service: { id: string; name: string; durationMin: number; price: number };
  technician: { id: string; name: string };
};
