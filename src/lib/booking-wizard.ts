export const BOOKING_STEPS = {
  service: 1,
  technician: 2,
  datetime: 3,
  confirm: 4,
  success: 5,
} as const;

export type BookingStep = (typeof BOOKING_STEPS)[keyof typeof BOOKING_STEPS];

export type BookingWizardParams = {
  step: BookingStep;
  service?: string;
  technician?: string;
  date?: string;
  slot?: string;
  appointment?: string;
};

const LOCAL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseBookingStep(value: string | undefined): BookingStep {
  const n = Number(value);
  if (n >= 1 && n <= 5) return n as BookingStep;
  return BOOKING_STEPS.service;
}

export function parseWizardSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): BookingWizardParams {
  const step = parseBookingStep(
    typeof searchParams.step === "string" ? searchParams.step : undefined,
  );
  const service =
    typeof searchParams.service === "string" ? searchParams.service : undefined;
  const technician =
    typeof searchParams.technician === "string"
      ? searchParams.technician
      : undefined;
  const date =
    typeof searchParams.date === "string" &&
    LOCAL_DATE_RE.test(searchParams.date)
      ? searchParams.date
      : undefined;
  const slot =
    typeof searchParams.slot === "string" ? searchParams.slot : undefined;
  const appointment =
    typeof searchParams.appointment === "string"
      ? searchParams.appointment
      : undefined;

  return { step, service, technician, date, slot, appointment };
}

export function buildBookUrl(params: Partial<BookingWizardParams>): string {
  const sp = new URLSearchParams();
  if (params.step != null) sp.set("step", String(params.step));
  if (params.service) sp.set("service", params.service);
  if (params.technician) sp.set("technician", params.technician);
  if (params.date) sp.set("date", params.date);
  if (params.slot) sp.set("slot", params.slot);
  if (params.appointment) sp.set("appointment", params.appointment);
  const q = sp.toString();
  return q ? `/book?${q}` : "/book";
}

/** Resolve wizard step from URL; explicit `step` wins over param-based inference. */
export function resolveBookingStep(
  searchParams: Record<string, string | string[] | undefined>,
  params: BookingWizardParams,
): BookingStep {
  if (params.appointment) return BOOKING_STEPS.success;

  if (typeof searchParams.step === "string") {
    return params.step;
  }

  if (params.slot && params.date && params.technician && params.service) {
    return BOOKING_STEPS.confirm;
  }
  if (params.date && params.technician && params.service) {
    return BOOKING_STEPS.datetime;
  }
  if (params.technician && params.service) return BOOKING_STEPS.datetime;
  if (params.service) return BOOKING_STEPS.technician;
  return BOOKING_STEPS.service;
}

export const STEP_LABELS: Record<BookingStep, string> = {
  1: "Service",
  2: "Technician",
  3: "Date & time",
  4: "Confirm",
  5: "Done",
};
