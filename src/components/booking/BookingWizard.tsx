"use client";

import { useMemo } from "react";
import {
  BOOKING_STEPS,
  parseWizardSearchParams,
  resolveBookingStep,
  type BookingWizardParams,
} from "@/lib/booking-wizard";
import type { ServiceItem, TechnicianItem } from "@/services/booking/types";
import { BookingStepIndicator } from "./BookingStepIndicator";
import { ConfirmStep } from "./steps/ConfirmStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import { ServiceStep } from "./steps/ServiceStep";
import { SuccessStep } from "./steps/SuccessStep";
import { TechnicianStep } from "./steps/TechnicianStep";

type BookingWizardProps = {
  services: ServiceItem[];
  technicians: TechnicianItem[];
  minDate: string;
  searchParams: Record<string, string | string[] | undefined>;
  userName?: string | null;
};

export function BookingWizard({
  services,
  technicians,
  minDate,
  searchParams,
  userName,
}: BookingWizardProps) {
  const params: BookingWizardParams = useMemo(
    () => parseWizardSearchParams(searchParams),
    [searchParams],
  );

  const step = resolveBookingStep(searchParams, params);

  const service = services.find((s) => s.id === params.service);
  const technician = technicians.find((t) => t.id === params.technician);

  if (step === BOOKING_STEPS.success && params.appointment) {
    return <SuccessStep appointmentId={params.appointment} userName={userName} />;
  }

  if (
    step === BOOKING_STEPS.confirm &&
    service &&
    technician &&
    params.date &&
    params.slot
  ) {
    return (
      <>
        <BookingStepIndicator currentStep={step} />
        <ConfirmStep
          service={service}
          technician={technician}
          localDate={params.date}
          slotUtc={params.slot}
        />
      </>
    );
  }

  if (
    step === BOOKING_STEPS.datetime &&
    service &&
    technician
  ) {
    return (
      <>
        <BookingStepIndicator currentStep={step} />
        <DateTimeStep
          serviceId={service.id}
          technicianId={technician.id}
          minDate={minDate}
          selectedDate={params.date}
          selectedSlot={params.slot}
        />
      </>
    );
  }

  if (step === BOOKING_STEPS.technician && service) {
    return (
      <>
        <BookingStepIndicator currentStep={step} />
        <TechnicianStep
          technicians={technicians}
          serviceId={service.id}
          selectedId={params.technician}
        />
      </>
    );
  }

  return (
    <>
      <BookingStepIndicator currentStep={BOOKING_STEPS.service} />
      <ServiceStep services={services} selectedId={params.service} />
    </>
  );
}
